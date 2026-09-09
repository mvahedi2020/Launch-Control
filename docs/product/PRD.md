# Product requirements

## Objective

Give launch leads one inspectable command surface for readiness, decisions, launch state, and immediate incident response.

## Core user story

As a launch lead, I can verify owners, dependencies, checks, and evidence before recording a decision so the simulated launch cannot proceed on incomplete information.

## Functional requirements

1. Every dependency has an explicit owner and readiness state.
2. Mandatory checks require an owner, completion, and evidence.
3. The product calculates readiness from those enforced rules.
4. A go or no-go choice and rationale can be recorded with a timestamp.
5. Simulated launch remains unavailable unless all gates clear and a go is recorded.
6. Launch completion and subsequent state changes appear in a timestamped timeline.
7. A sample post-launch issue requires a pause or rollback decision.
8. Versioned browser persistence explains storage failures and offers a sample reset.
9. Hash navigation, keyboard controls, responsive layouts, empty states, and errors are supported.
10. Users can export the current readiness, decisions, and timeline as a local JSON summary.

## Non-goals

Deployment orchestration, paging, traffic control, source-control integration, authentication, and production incident management are outside this demo.

## Proposed success targets

- 90% of evaluators correctly explain why launch is blocked.
- 85% complete the gated launch flow without guidance.
- 100% of simulated incident sessions end with a recorded pause or rollback decision.

These are proposed validation thresholds, not observed results.

For a future 20-participant task study, measure correct blocker explanations divided by all participants (target 18/20) and unassisted gated launch completion divided by all participants (17/20). Guardrail: no participant should believe the demo deployed real software. Measure completed incident responses divided by all started incident scenarios (target 100%); record abandonment separately rather than omitting it. Use the same seeded scenario, record task time and misinterpretations, and obtain participant consent. No sessions have been conducted.
