import { describe, expect, it } from 'vitest'
import { clonePlan, samplePlan } from './data'
import { appendEvent, appendEvidenceSnapshot, canLaunch, canRecordDecision, checkUnlocked, exportPayload, isLaunchPlan, MAX_EVIDENCE_LENGTH, MAX_RATIONALE_LENGTH, newTimelineId, openSampleIncident, readiness, recordDecision, resolveSampleIncident, revokeGoIfBlocked, simulateLaunch } from './logic'

describe('launch gate policy', () => {
  it('exports a recomputable readiness snapshot with the fictional boundary', () => {
    const payload = exportPayload(samplePlan, '2026-09-20T12:00:00Z')
    expect(payload.boundary).toBe('Fictional simulation; no production action')
    expect(payload.schemaVersion).toBe(1)
    expect(payload.summary.blockers).toEqual(readiness(samplePlan).blockers)
    expect(payload.launch).toEqual(samplePlan)
    expect(payload.launch).not.toBe(samplePlan)
  })
  it('blocks launch on unresolved dependencies and mandatory checks', () => {
    expect(readiness(samplePlan).blockers).toEqual(['Support enablement is watching', 'Support runbook rehearsed is waiting on a dependency'])
    expect(checkUnlocked(samplePlan, 'support')).toBe(false)
    expect(canLaunch(samplePlan)).toBe(false)
  })

  it('requires evidence and a recorded go decision', () => {
    const plan = clonePlan(samplePlan)
    plan.dependencies[1].state = 'ready'
    plan.checks[2].complete = true
    expect(readiness(plan).blockers).toEqual(['Support runbook rehearsed needs evidence'])
    plan.checks[2].evidence = 'Sample rehearsal notes'
    expect(canLaunch(plan)).toBe(false)
    plan.decision = { value: 'go', note: 'All gates reviewed', recordedAt: 'now' }
    expect(canLaunch(plan)).toBe(true)
  })

  it('withdraws launch permission when a readiness gate regresses after go is recorded', () => {
    const plan = clonePlan(samplePlan)
    plan.dependencies[1].state = 'ready'
    plan.checks[2].complete = true
    plan.checks[2].evidence = 'Sample rehearsal notes'
    plan.decision = { value: 'go', note: 'All gates reviewed', recordedAt: 'now' }
    expect(canLaunch(plan)).toBe(true)
    plan.dependencies[0].state = 'blocked'
    expect(canLaunch(plan)).toBe(false)
    const revoked = revokeGoIfBlocked(plan, 'later')
    expect(revoked.decision).toBeNull()
    expect(revoked.timeline.at(-1)?.title).toBe('Go decision withdrawn')
  })

  it('withdraws a recorded go when mandatory evidence is removed', () => {
    const plan = clonePlan(samplePlan)
    plan.dependencies[1].state = 'ready'
    plan.checks[2].complete = true
    plan.checks[2].evidence = 'Sample rehearsal notes'
    plan.decision = { value: 'go', note: 'All gates reviewed', recordedAt: 'now' }
    plan.checks[0].evidence = ''
    const revoked = revokeGoIfBlocked(plan, 'later')
    expect(revoked.decision).toBeNull()
    expect(revoked.timeline.at(-1)?.detail).toContain('required gate changed')
  })

  it('records one evidence snapshot per completed edit and never restores a withdrawn go', () => {
    const plan = clonePlan(samplePlan)
    plan.dependencies[1].state = 'ready'
    plan.checks[2].complete = true
    plan.checks[2].evidence = 'Sample rehearsal notes'
    plan.decision = { value: 'go', note: 'All gates reviewed', recordedAt: 'now' }

    plan.checks[0].evidence = ''
    const withdrawn = revokeGoIfBlocked(plan, 'withdrawn')
    const restored = { ...withdrawn, checks: withdrawn.checks.map((check) => check.id === 'qa' ? { ...check, evidence: 'Sample QA report #184' } : check) }
    const firstSnapshot = appendEvidenceSnapshot(restored, 'qa', '', 'Sample QA report #184', 'restored')
    const unchangedBlur = appendEvidenceSnapshot(firstSnapshot, 'qa', 'Sample QA report #184', 'Sample QA report #184', 'unchanged')

    expect(withdrawn.decision).toBeNull()
    expect(firstSnapshot.timeline).toHaveLength(withdrawn.timeline.length + 1)
    expect(unchangedBlur.timeline).toHaveLength(firstSnapshot.timeline.length)
    expect(canLaunch(restored)).toBe(false)
  })

  it('appends timeline evidence without mutating the original', () => {
    const next = appendEvent(samplePlan, { id: 'test', at: 'now', title: 'Test', detail: 'Recorded', kind: 'info' })
    expect(next.timeline).toHaveLength(samplePlan.timeline.length + 1)
    expect(samplePlan.timeline).toHaveLength(2)
  })

  it('creates distinct timeline identities for rapid events', () => {
    expect(newTimelineId('event')).not.toBe(newTimelineId('event'))
  })

  it('records a changed pre-launch decision once and rejects a duplicate or post-launch decision', () => {
    const plan = clonePlan(samplePlan)
    const recorded = recordDecision(plan, 'no-go', 'Need more review', 'now', 'decision-1')
    expect(recorded.decision).toEqual({ value: 'no-go', note: 'Need more review', recordedAt: 'now' })
    expect(canRecordDecision(recorded, 'no-go', 'Need more review')).toBe(false)
    expect(recordDecision(recorded, 'no-go', 'Need more review', 'later', 'decision-2')).toBe(recorded)
    expect(recordDecision({ ...recorded, phase: 'launched' }, 'go', 'Reconsidered', 'later', 'decision-3')).toEqual({ ...recorded, phase: 'launched' })
  })

  it('bounds evidence and rationale so restored and typed values share one contract', () => {
    const plan = clonePlan(samplePlan)
    plan.dependencies[1].state = 'ready'
    plan.checks[2].complete = true
    plan.checks[2].evidence = 'Sample rehearsal notes'
    expect(isLaunchPlan({ ...plan, checks: plan.checks.map((check) => check.id === 'qa' ? { ...check, evidence: 'x'.repeat(MAX_EVIDENCE_LENGTH + 1) } : check) })).toBe(false)
    expect(canRecordDecision(plan, 'no-go', 'x'.repeat(MAX_RATIONALE_LENGTH + 1))).toBe(false)
  })

  it('rejects a restored pre-launch Go that conflicts with current blockers', () => {
    const plan = clonePlan(samplePlan)
    plan.decision = { value: 'go', note: 'Approved earlier', recordedAt: 'before restore' }
    expect(isLaunchPlan(plan)).toBe(false)
  })

  it('makes launch and incident transitions idempotent', () => {
    const plan = clonePlan(samplePlan)
    plan.dependencies[1].state = 'ready'
    plan.checks[2].complete = true
    plan.checks[2].evidence = 'Sample rehearsal notes'
    plan.decision = { value: 'go', note: 'All gates reviewed', recordedAt: 'now' }

    const launched = simulateLaunch(plan, 'later', 'launch-1')
    expect(simulateLaunch(launched, 'later', 'launch-2')).toBe(launched)
    const incident = openSampleIncident(launched, 'later', 'incident-1')
    expect(openSampleIncident(incident, 'later', 'incident-2')).toBe(incident)
    const paused = resolveSampleIncident(incident, 'pause', 'later', 'pause-1')
    expect(resolveSampleIncident(paused, 'pause', 'later', 'pause-2')).toBe(paused)
  })

  it('accepts a complete launch plan and rejects malformed saved session data', () => {
    expect(isLaunchPlan(samplePlan)).toBe(true)
    expect(isLaunchPlan({ ...samplePlan, checks: [{ id: 'qa' }] })).toBe(false)
    expect(isLaunchPlan({ ...samplePlan, dependencies: [{ ...samplePlan.dependencies[0], ownerId: 'unknown' }] })).toBe(false)
    expect(isLaunchPlan({ ...samplePlan, timeline: [{ id: 'event', at: 'now', title: 'Broken', detail: 'Missing kind' }] })).toBe(false)
    expect(isLaunchPlan({ ...samplePlan, incident: { active: true, openedAt: 'now' } })).toBe(false)
    expect(isLaunchPlan({ ...samplePlan, phase: 'launched', incident: { active: false, openedAt: 'now', decision: 'pause' } })).toBe(false)
    expect(isLaunchPlan({ ...samplePlan, timeline: [...samplePlan.timeline, { ...samplePlan.timeline[0] }] })).toBe(false)
    expect(isLaunchPlan({ ...samplePlan, owners: [{ ...samplePlan.owners[0], name: ' ' }, ...samplePlan.owners.slice(1)] })).toBe(false)
    expect(isLaunchPlan({ ...samplePlan, owners: [samplePlan.owners[0], { ...samplePlan.owners[1], id: samplePlan.owners[0].id.toUpperCase() }, ...samplePlan.owners.slice(2)] })).toBe(false)
    expect(isLaunchPlan({ ...samplePlan, decision: { value: 'no-go', note: ' ', recordedAt: 'now' } })).toBe(false)
    expect(isLaunchPlan({ ...samplePlan, checks: [{ ...samplePlan.checks[0], dependencyIds: ['billing', 'billing'] }, ...samplePlan.checks.slice(1)] })).toBe(false)
  })

  it('only resolves an active incident from the launched phase', () => {
    const invalid = { ...samplePlan, phase: 'paused' as const, incident: { active: true, openedAt: 'now' } }
    expect(resolveSampleIncident(invalid, 'pause', 'later', 'pause-1')).toBe(invalid)
  })
})
