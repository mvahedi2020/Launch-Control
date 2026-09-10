# Launch Control — product requirements

## Product brief

**Problem.** Launch readiness is often scattered across checklists, chat, status documents, and meetings. That makes it difficult to answer the questions that determine a responsible decision: who owns each dependency, what evidence proves a required check, why was Go granted, and what response followed a post-launch issue.

**Opportunity.** Give a B2B SaaS launch lead one inspectable local workspace that turns readiness policy into visible rules and preserves the decision trail.

**Product decision.** Launch Control models a disciplined launch conversation. It deliberately stops short of deployment orchestration or incident management: every action, person, evidence record, and outcome is fictional and device-local.

## Users and job to be done

| User | Job | Evidence needed before acting |
| --- | --- | --- |
| Product or launch lead | Decide whether a simulated launch can proceed | A named owner, ready dependency, completed required check, evidence, and recorded decision |
| Functional owner | Supply readiness information and see the effect of a missing prerequisite | The dependency state, related locked check, and the blocker explanation |
| Review participant | Reconstruct the decision and response sequence | A timestamped timeline of decision, launch, and sample-incident events |

## Scope, constraints, and principles

Launch Control uses fictional Northstar sample data. It has no production connection, authentication, deployment action, traffic control, source-control integration, messaging, paging, paid service, or real incident response. Browser storage and exported JSON stay local to the device.

The product follows four principles:

1. **Readiness is a rule, not a score.** Required gates cannot be bypassed by an aggregate percentage.
2. **A decision needs evidence.** Mandatory checks need an owner, completion, and nonblank evidence; Go also needs a rationale.
3. **A cleared gate can regress.** Removing required evidence or changing a required dependency withdraws Go permission and requires a new decision.
4. **State changes must be inspectable.** The local timeline shows the decision, simulated launch, and required sample-incident response.

## Core user story

As a launch lead, I can verify owners, dependencies, checks, and evidence before recording a decision so the simulated launch cannot proceed on incomplete information.

## Primary workflow

1. Review dependencies and the blocker explanation for the seeded Analytics 2.4 sample launch.
2. Assign or confirm fictional owners, set dependencies to Ready, and complete the newly unlocked required checks with sample evidence.
3. Choose Go or No-go, record a rationale, and inspect the resulting timestamped decision.
4. Simulate the launch only after every required rule clears and a Go decision exists.
5. Trigger the sample post-launch issue, choose Pause rollout or Roll back release, then review or export the timeline.

## Functional requirements and acceptance criteria

| Requirement | Acceptance criterion |
| --- | --- |
| Model ownership and prerequisites | Every dependency has an owner and readiness state. A check whose dependencies lack an owner or Ready state remains locked and explains why. |
| Require evidence for mandatory work | A required check passes only when it is unlocked, has an owner, is complete, and contains nonblank evidence. Optional checks do not change the launch rule. |
| Enforce the decision rule | Go or No-go can be recorded with a timestamp and rationale. Simulate launch is enabled only in pre-launch when every required gate clears and the current decision is Go. |
| Handle regression honestly | If a required dependency or evidence regresses after Go, the Go decision is withdrawn, the timeline records that withdrawal, and a new Go decision is required after the blocker clears. |
| Make the response trail inspectable | Simulated launch and subsequent state changes appear in a local timestamped timeline. A sample post-launch issue requires either Pause rollout or Roll back release before it is resolved. |
| Support recovery and review | Sample reset restores fictional fixtures. The current readiness, decision, and timeline can be exported as local JSON. Storage failures are explained while the current tab remains usable. |
| Make the demo broadly inspectable | Hash navigation supports browser back and forward. Native labels, visible focus treatment, keyboard controls, responsive layouts, empty states, and errors are supported. |

## Explicit non-goals

Deployment orchestration, paging, traffic control, source-control integration, authentication, production incident management, notifications, approval permissions, and real launch data are outside this sample. A simulated launch must never be presented as a software deployment.

## Evaluation plan — proposed, not measured

Research is staged. First, conduct five moderated formative sessions with product operations or release leads to identify workflow failures and refine the task; do not apply a percentage threshold to that small diagnostic sample. Then run a 20-participant task study using the same seeded scenario. Ask each participant to identify initial blockers, supply the missing readiness information, record a decision, launch the simulation, respond to the sample issue, and explain the timeline. Obtain consent and record task time, incorrect launch attempts, misinterpretations, abandonment, and confidence.

| Evaluation question | Measure and denominator | Proposed target | Guardrail |
| --- | --- | --- | --- |
| Can a reviewer explain why launch is blocked? | Correct blocker explanations / all participants | 18/20 | No participant should believe the demo deploys real software. |
| Can a reviewer complete the gated flow? | Unassisted gated-launch completion / all participants | 17/20 | Record abandonment separately rather than omitting it. |
| Does the incident flow end with a decision? | Completed pause or rollback responses / all started incident scenarios | 100% | The two sample response paths do not model a production incident program. |

Automated checks verify the launch policy and controls; they do not establish human usability, demand, reliability, or business impact. No user research or production outcome is claimed.
