# Product decisions: launch readiness

These decisions describe the fictional prototype. They are not records of stakeholder approval or customer demand.

| Decision | Alternatives | Chosen compromise and cost | Reversal criterion |
|---|---|---|---|
| Use required gates | Overall readiness score; a free-form checklist | All dependencies and mandatory checks must clear. This costs review effort and may feel restrictive. | Formative research shows the dependency model obscures the decision or repeatedly creates unnecessary mandatory work. |
| Separate decision from action | Automatically launch when checks clear; combine approval and launch | A recorded Go precedes a separate simulated-launch action. Two deliberate actions make intent inspectable. | Participants consistently confuse approval with execution after the labels and sequence have been tested. |
| Withdraw Go when a gate regresses | Keep an old approval; warn without invalidation | A blocker removes the current Go and records the withdrawal. Reviewers must make a new decision after resolution. | A scoped-approval policy defines evidence ownership, expiry, and a safe reapproval boundary. |
| Show local evidence text | Connect proof systems; allow a checkbox alone | Nonblank evidence supports a review exercise without integration. The app cannot verify that text is true or sufficient. | A real-data proposal establishes provenance, reviewer responsibilities, and access requirements. |
| Limit incident responses | Simulate a full incident platform; omit post-launch behavior | Pause and rollback make a response decision visible. They leave severity assessment and real operational procedures outside the sample. | Discovery finds the readiness question requires a different, explicitly scoped response model. |

The PM responsibility is to explain the cost of each constraint and what evidence would justify changing it. This record complements the case study; it does not authorize real launches or new integrations.
