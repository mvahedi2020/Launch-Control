export type GateState = 'ready' | 'watching' | 'blocked'
export type Phase = 'prelaunch' | 'launched' | 'paused' | 'rolledback'
export type Owner = { id: string; name: string; role: string; initials: string }
export type Dependency = { id: string; name: string; ownerId: string; state: GateState; note: string }
export type ReadinessCheck = { id: string; name: string; ownerId: string; mandatory: boolean; complete: boolean; evidence: string; dependencyIds: string[] }
export type Decision = { value: 'go' | 'no-go'; note: string; recordedAt: string } | null
export type TimelineEvent = { id: string; at: string; title: string; detail: string; kind: 'info' | 'success' | 'warning' | 'critical' }
export type Incident = { active: boolean; openedAt: string; decision?: 'pause' | 'rollback' }
export type LaunchPlan = {
  name: string
  window: string
  owners: Owner[]
  dependencies: Dependency[]
  checks: ReadinessCheck[]
  decision: Decision
  phase: Phase
  timeline: TimelineEvent[]
  incident: Incident | null
}
