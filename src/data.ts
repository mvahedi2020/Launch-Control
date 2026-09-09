import type { LaunchPlan } from './types'

export const samplePlan: LaunchPlan = {
  name: 'Analytics 2.4',
  window: 'September 18 · 09:00 PT',
  owners: [
    { id: 'sarah', name: 'Sarah Kim', role: 'Launch lead', initials: 'SK' },
    { id: 'omar', name: 'Omar Reed', role: 'Engineering', initials: 'OR' },
    { id: 'jules', name: 'Jules Martin', role: 'Customer success', initials: 'JM' },
  ],
  dependencies: [
    { id: 'billing', name: 'Billing migration', ownerId: 'omar', state: 'ready', note: 'Dry run complete' },
    { id: 'enablement', name: 'Support enablement', ownerId: 'jules', state: 'watching', note: 'Final brief pending' },
    { id: 'status', name: 'Status page notice', ownerId: 'sarah', state: 'ready', note: 'Scheduled in sample plan' },
  ],
  checks: [
    { id: 'qa', name: 'Regression suite reviewed', ownerId: 'omar', mandatory: true, complete: true, evidence: 'Sample QA report #184', dependencyIds: ['billing'] },
    { id: 'privacy', name: 'Privacy review recorded', ownerId: 'sarah', mandatory: true, complete: true, evidence: 'Sample review PRV-32', dependencyIds: ['billing'] },
    { id: 'support', name: 'Support runbook rehearsed', ownerId: 'jules', mandatory: true, complete: false, evidence: '', dependencyIds: ['enablement'] },
    { id: 'brief', name: 'Executive brief distributed', ownerId: 'sarah', mandatory: false, complete: false, evidence: '', dependencyIds: ['status'] },
  ],
  decision: null,
  phase: 'prelaunch',
  timeline: [
    { id: 'opened', at: 'Sep 8, 2026, 9:02 AM PDT', title: 'Launch room opened', detail: 'Sarah created the sample readiness review.', kind: 'info' },
    { id: 'qa-ready', at: 'Sep 8, 2026, 9:18 AM PDT', title: 'Regression evidence added', detail: 'Omar attached sample QA report #184.', kind: 'success' },
  ],
  incident: null,
}

export const clonePlan = (plan: LaunchPlan): LaunchPlan => JSON.parse(JSON.stringify(plan)) as LaunchPlan
