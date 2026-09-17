import type { Decision, LaunchPlan, TimelineEvent } from './types'

export function checkUnlocked(plan: LaunchPlan, checkId: string): boolean {
  const check = plan.checks.find((item) => item.id === checkId)
  if (!check) return false
  return check.dependencyIds.every((id) => {
    const dependency = plan.dependencies.find((item) => item.id === id)
    return Boolean(dependency?.ownerId) && dependency?.state === 'ready'
  })
}

export function readiness(plan: LaunchPlan) {
  const items = [
    ...plan.dependencies.map((dependency) => ({
      id: dependency.id,
      passed: Boolean(dependency.ownerId) && dependency.state === 'ready',
      reason: !dependency.ownerId ? `${dependency.name} needs an owner` : dependency.state !== 'ready' ? `${dependency.name} is ${dependency.state}` : '',
    })),
    ...plan.checks.filter((check) => check.mandatory).map((check) => ({
      id: check.id,
      passed: checkUnlocked(plan, check.id) && Boolean(check.ownerId) && check.complete && Boolean(check.evidence.trim()),
      reason: !checkUnlocked(plan, check.id) ? `${check.name} is waiting on a dependency` : !check.ownerId ? `${check.name} needs an owner` : !check.complete ? `${check.name} is incomplete` : !check.evidence.trim() ? `${check.name} needs evidence` : '',
    })),
  ]
  return { passed: items.filter((item) => item.passed).length, total: items.length, blockers: items.filter((item) => !item.passed).map((item) => item.reason) }
}

export function canLaunch(plan: LaunchPlan): boolean {
  return plan.phase === 'prelaunch' && readiness(plan).blockers.length === 0 && plan.decision?.value === 'go'
}

export function canRecordDecision(plan: LaunchPlan, value: NonNullable<Decision>['value'], note: string): boolean {
  const rationale = note.trim()
  if (plan.phase !== 'prelaunch' || rationale.length < 4 || (value === 'go' && readiness(plan).blockers.length > 0)) return false
  return plan.decision?.value !== value || plan.decision.note !== rationale
}

export function recordDecision(plan: LaunchPlan, value: NonNullable<Decision>['value'], note: string, at: string, id: string): LaunchPlan {
  const rationale = note.trim()
  if (!canRecordDecision(plan, value, rationale)) return plan
  return appendEvent(
    { ...plan, decision: { value, note: rationale, recordedAt: at } },
    { id, at, title: `${value === 'go' ? 'Go' : 'No-go'} decision recorded`, detail: rationale, kind: value === 'go' ? 'success' : 'warning' },
  )
}

export function simulateLaunch(plan: LaunchPlan, at: string, id: string): LaunchPlan {
  if (!canLaunch(plan)) return plan
  return appendEvent({ ...plan, phase: 'launched' }, { id, at, title: 'Launch completed', detail: `${plan.name} simulated launch completed.`, kind: 'success' })
}

export function openSampleIncident(plan: LaunchPlan, at: string, id: string): LaunchPlan {
  if (plan.phase !== 'launched' || plan.incident?.active) return plan
  return appendEvent({ ...plan, incident: { active: true, openedAt: at } }, { id, at, title: 'Sample issue detected', detail: 'Export jobs are delayed for a sample customer segment.', kind: 'critical' })
}

export function resolveSampleIncident(plan: LaunchPlan, decision: 'pause' | 'rollback', at: string, id: string): LaunchPlan {
  if (!plan.incident?.active) return plan
  const phase = decision === 'pause' ? 'paused' : 'rolledback'
  return appendEvent(
    { ...plan, phase, incident: { ...plan.incident, active: false, decision } },
    { id, at, title: decision === 'pause' ? 'Rollout paused' : 'Release rolled back', detail: decision === 'pause' ? 'Further sample exposure is paused for investigation.' : 'Sample traffic returned to the prior release.', kind: 'warning' },
  )
}

export function revokeGoIfBlocked(plan: LaunchPlan, at: string): LaunchPlan {
  if (plan.decision?.value !== 'go' || readiness(plan).blockers.length === 0) return plan
  return appendEvent(
    { ...plan, decision: null },
    { id: `go-revoked-${Date.now()}`, at, title: 'Go decision withdrawn', detail: 'A required gate changed after Go was recorded. Clear the blocker and record a new decision.', kind: 'warning' },
  )
}

export function appendEvent(plan: LaunchPlan, event: TimelineEvent): LaunchPlan {
  return { ...plan, timeline: [...plan.timeline, event] }
}

export function appendEvidenceSnapshot(plan: LaunchPlan, checkId: string, previousValue: string, nextValue: string, at: string): LaunchPlan {
  const check = plan.checks.find((item) => item.id === checkId)
  const previous = previousValue.trim()
  const evidence = nextValue.trim()
  if (!check || previous === evidence) return plan
  return appendEvent(plan, {
    id: `evidence-${checkId}-${Date.now()}`,
    at,
    title: 'Readiness evidence recorded',
    detail: evidence ? `${check.name}: ${evidence}` : `${check.name}: evidence cleared`,
    kind: evidence ? 'info' : 'warning',
  })
}

export function ownerName(plan: LaunchPlan, ownerId: string): string {
  return plan.owners.find((owner) => owner.id === ownerId)?.name ?? 'Unassigned'
}
