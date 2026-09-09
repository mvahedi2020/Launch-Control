import type { LaunchPlan, TimelineEvent } from './types'

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

export function appendEvent(plan: LaunchPlan, event: TimelineEvent): LaunchPlan {
  return { ...plan, timeline: [...plan.timeline, event] }
}

export function ownerName(plan: LaunchPlan, ownerId: string): string {
  return plan.owners.find((owner) => owner.id === ownerId)?.name ?? 'Unassigned'
}
