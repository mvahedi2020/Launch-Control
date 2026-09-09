import { describe, expect, it } from 'vitest'
import { clonePlan, samplePlan } from './data'
import { appendEvent, canLaunch, checkUnlocked, readiness } from './logic'

describe('launch gate policy', () => {
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

  it('appends timeline evidence without mutating the original', () => {
    const next = appendEvent(samplePlan, { id: 'test', at: 'now', title: 'Test', detail: 'Recorded', kind: 'info' })
    expect(next.timeline).toHaveLength(samplePlan.timeline.length + 1)
    expect(samplePlan.timeline).toHaveLength(2)
  })
})
