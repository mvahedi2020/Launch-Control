# Validation plan

## Observed software checks — September 16, 2026

On Node 24/macOS, lint, strict type checks, production build, ten policy tests, and seven repository browser tests passed. `npm audit --omit=dev` reported no vulnerabilities. The policy and browser suites now cover the decision replay boundary: an unchanged recorded decision cannot create another timeline record, and repeated launch or incident actions cannot replay a completed local state transition. Saved-session checks also reject partial, unknown-reference, duplicate-timeline, and invalid phase/incident records before the command surface renders. Browser coverage verifies that pre-launch gates lock after launch while the sample incident response remains available.

## Observed software checks — September 8, 2026

On Node 24/macOS: lint, strict type checks, three policy tests, production build and two repository browser tests passed. The additional headless Chrome walkthrough passed locked prerequisites, evidence, no-go blocking, go approval, reblocking after a gate changed, launch persistence, sample issue and rollback, timeline, JSON export, navigation/reset, mobile controls at 390 × 844 with no page overflow, and unavailable-storage fallback. No page errors were captured. npm audit reported zero vulnerabilities.

First production-build Lighthouse mobile run: performance 100 and accessibility 96. The identified contrast issues were then corrected. Actual screenshots and workflow recording are in ../media; full reports accompany the handoff. Automated results do not establish human usability or market demand.

## What is verified in this repository

Automated logic tests verify that unresolved dependencies, incomplete mandatory checks, missing evidence, and absent go decisions block launch. Browser tests complete the gated launch flow and the post-launch pause path. Lint, type checking, and the production build are also required.

## Proposed user validation

Conduct five moderated sessions with product operations or release leads. Ask each participant to identify the initial blockers, supply the missing readiness information, record a decision, launch the simulation, respond to the sample incident, and explain the timeline.

Measure unassisted completion, time to identify blockers, incorrect launch attempts, response-decision completion, and confidence on a five-point scale. The five sessions are formative: use them to identify failures before setting a percentage threshold. A later 20-participant study can test the proposed 85% unassisted completion target (17/20), while the formative work can assess whether blocker diagnosis is understandable within 90 seconds.

## Moderator answer key for the seeded task

The initial blocker is **Support enablement** in **Watching** state; the related **Support runbook rehearsed** check is locked until that named dependency is Ready and owned. A participant must then supply sample evidence, complete the required check, record a Go rationale, and choose **Simulate launch**. A nonblank value satisfies the fictional presence rule only; it does not verify the evidence. Clearing **Regression suite reviewed** evidence after Go must immediately withdraw Go. Restoring “Sample QA report #184” clears the blocker but cannot restore launch permission until the participant records a fresh Go. After simulated launch, either recorded sample response—Pause rollout or Roll back release—completes the incident task.

Do not score a preferred response or a high readiness percentage as correct by itself. Score whether the participant names the missing prerequisite or evidence, connects it to the disabled action, explains the evidence boundary, and follows the withdrawal-and-reapproval contract.

## Known limits

The scenario, evidence, and people are fictional. Local timestamps and browser persistence do not represent production audit controls. The demo has not established usability, demand, reliability, or business impact.

The current recovery contract also requires an explicit confirmation before Reset sample replaces a local session. Readiness progress exposes its passed and total gate counts to assistive technology, and trimmed evidence text is the value persisted after the field is completed.

## Proposed session scoring protocol

Use the same seeded scenario for every participant and record whether help was needed before a task finished. A blocker explanation passes when it identifies the missing dependency or required evidence and connects that condition to the disabled launch action; repeating the percentage alone is insufficient. Gated-flow completion passes only when the participant supplies the sample information, records a reasoned decision, and simulates launch without moderator instructions.

Use the consent-aware units and denominators in [Measurement Plan.md](Measurement%20Plan.md) for the later 20-person study. Retain assisted and abandoned attempts, report 18/20 and 17/20 as proposed thresholds rather than population estimates, and score incident response separately among participants who start that task.

Record whether the participant understands that evidence text is not verified and no real software is deployed. A correct click sequence with either misconception should trigger design review even if completion targets are met. The initial five sessions identify problems and refine these tasks; they are not the later quantitative study. No sessions have been conducted.

For the five formative sessions, retain every started task in the study notes, including abandonment, assistance, and a participant who chooses No-go, subject to the consent-withdrawal rule in [Measurement Plan.md](Measurement%20Plan.md). Stop expansion and return to the gate explanation if participants repeatedly treat evidence presence as truth, mistake simulated launch for deployment, or cannot explain why a required regression withdraws Go. Do not add templates, integrations, or real-data intake before that boundary is understood.
# September 21 validation additions

Focused Vitest coverage verifies that exports carry schema version 1 and a detached launch snapshot, duplicate timeline identities are ignored, and the existing gate, incident, and decision transitions remain covered. The reset dialog now exposes an accessible description and reset clears stale export feedback.

These checks establish local product behavior only. They do not simulate a real deployment, traffic change, notification, or rollback.
