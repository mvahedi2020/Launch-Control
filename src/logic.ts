import type { Decision, LaunchPlan, TimelineEvent } from './types'

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const isString = (value: unknown): value is string => typeof value === 'string'
const hasText = (value: unknown): value is string => isString(value) && value.trim().length > 0
const isId = (value: unknown): value is string => hasText(value) && value === value.trim()
const hasUniqueNormalizedIds = (values: string[]) => new Set(values.map((value) => value.toLowerCase())).size === values.length
const isGateState = (value: unknown) => value === 'ready' || value === 'watching' || value === 'blocked'
const isPhase = (value: unknown) => value === 'prelaunch' || value === 'launched' || value === 'paused' || value === 'rolledback'
const isEventKind = (value: unknown) => value === 'info' || value === 'success' || value === 'warning' || value === 'critical'
export const MAX_EVIDENCE_LENGTH = 500
export const MAX_RATIONALE_LENGTH = 500
let fallbackEventSequence = 0

export function newTimelineId(prefix: string): string {
  const suffix = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${++fallbackEventSequence}`
  return `${prefix}-${suffix}`
}

export function isLaunchPlan(value: unknown): value is LaunchPlan {
  if (!isRecord(value) || !hasText(value.name) || !hasText(value.window) || !isPhase(value.phase) || !Array.isArray(value.owners) || !Array.isArray(value.dependencies) || !Array.isArray(value.checks) || !Array.isArray(value.timeline)) return false
  if (!value.owners.every((owner) => isRecord(owner) && isId(owner.id) && hasText(owner.name) && hasText(owner.role) && hasText(owner.initials))) return false
  const ownerIds = new Set(value.owners.map((owner) => owner.id))
  if (ownerIds.size !== value.owners.length || !hasUniqueNormalizedIds([...ownerIds])) return false
  const knownOwner = (id: unknown) => isString(id) && (!id || ownerIds.has(id))
  if (!value.dependencies.every((dependency) => isRecord(dependency) && isId(dependency.id) && hasText(dependency.name) && knownOwner(dependency.ownerId) && isGateState(dependency.state) && hasText(dependency.note))) return false
  const dependencyIds = new Set(value.dependencies.map((dependency) => dependency.id))
  if (dependencyIds.size !== value.dependencies.length || !hasUniqueNormalizedIds([...dependencyIds])) return false
  if (!value.checks.every((check) => isRecord(check) && isId(check.id) && hasText(check.name) && knownOwner(check.ownerId) && typeof check.mandatory === 'boolean' && typeof check.complete === 'boolean' && isString(check.evidence) && check.evidence.length <= MAX_EVIDENCE_LENGTH && Array.isArray(check.dependencyIds) && check.dependencyIds.every((id) => isId(id) && dependencyIds.has(id)) && new Set(check.dependencyIds).size === check.dependencyIds.length)) return false
  const checkIds = value.checks.map((check) => check.id)
  if (new Set(checkIds).size !== value.checks.length || !hasUniqueNormalizedIds(checkIds)) return false
  if (value.decision !== null && (!isRecord(value.decision) || (value.decision.value !== 'go' && value.decision.value !== 'no-go') || !hasText(value.decision.note) || value.decision.note.length > MAX_RATIONALE_LENGTH || !hasText(value.decision.recordedAt))) return false
  if (!value.timeline.every((event) => isRecord(event) && isId(event.id) && hasText(event.at) && hasText(event.title) && hasText(event.detail) && isEventKind(event.kind))) return false
  const eventIds = value.timeline.map((event) => event.id)
  if (new Set(eventIds).size !== value.timeline.length || !hasUniqueNormalizedIds(eventIds)) return false
  if (value.incident !== null && (!isRecord(value.incident) || typeof value.incident.active !== 'boolean' || !hasText(value.incident.openedAt) || (value.incident.decision !== undefined && value.incident.decision !== 'pause' && value.incident.decision !== 'rollback'))) return false
  if (value.phase === 'prelaunch') {
    if (value.incident !== null) return false
    const candidate = value as unknown as LaunchPlan
    return candidate.decision?.value !== 'go' || readiness(candidate).blockers.length === 0
  }
  if (value.phase === 'launched') return value.incident === null || (value.incident.active === true && value.incident.decision === undefined)
  return Boolean(value.incident && !value.incident.active && value.incident.decision === (value.phase === 'paused' ? 'pause' : 'rollback'))
}

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

export function exportPayload(plan: LaunchPlan, exportedAt: string) {
  const status = readiness(plan)
  return { product: 'Launch Control sample', boundary: 'Fictional simulation; no production action', exportedAt, summary: { phase: plan.phase, recordedDecision: plan.decision?.value ?? 'none', blockers: status.blockers }, readiness: status, launch: plan }
}

export function canLaunch(plan: LaunchPlan): boolean {
  return plan.phase === 'prelaunch' && readiness(plan).blockers.length === 0 && plan.decision?.value === 'go'
}

export function canRecordDecision(plan: LaunchPlan, value: NonNullable<Decision>['value'], note: string): boolean {
  const rationale = note.trim()
  if (plan.phase !== 'prelaunch' || rationale.length < 4 || rationale.length > MAX_RATIONALE_LENGTH || (value === 'go' && readiness(plan).blockers.length > 0)) return false
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
  if (plan.phase !== 'launched' || !plan.incident?.active) return plan
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
    { id: newTimelineId('go-revoked'), at, title: 'Go decision withdrawn', detail: 'A required gate changed after Go was recorded. Clear the blocker and record a new decision.', kind: 'warning' },
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
    id: newTimelineId(`evidence-${checkId}`),
    at,
    title: 'Readiness evidence recorded',
    detail: evidence ? `${check.name}: ${evidence}` : `${check.name}: evidence cleared`,
    kind: evidence ? 'info' : 'warning',
  })
}

export function ownerName(plan: LaunchPlan, ownerId: string): string {
  return plan.owners.find((owner) => owner.id === ownerId)?.name ?? 'Unassigned'
}
