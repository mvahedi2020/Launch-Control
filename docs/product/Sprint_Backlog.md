# Product backlog

## Implemented sample scope

Editable dependency owners and states; prerequisite-locked checks; mandatory evidence; recorded Go/No-go rationale; Go withdrawal when required gates regress; simulated launch; sample pause/rollback responses; local timeline, persistence, reset, and JSON export. Existing logic and browser tests check parts of this workflow. This is sample implementation, not a staffed delivery roadmap.

## Ordered next decisions

| Priority | Candidate work | Evidence required | Dependency or tradeoff |
|---|---|---|---|
| 1 | Test blocker and evidence comprehension | Five formative sessions identify where explanations fail. | Improve the existing decision before adding more configuration. |
| 2 | Test keyboard and screen-reader review | Participants can locate the blocker, record the decision, and recover without relying on visual position. | Accessible task design and consenting participants precede conclusions. |
| 3 | Explore a clearer decision handoff | Reviewers cannot reconstruct why Go changed using the current timeline and export. | Compare a printable summary with the existing export before building a new reporting feature. |
| 4 | Explore named local templates | Repeated sample reviews show setup is a material barrier. | A template must expose its assumptions and cannot carry an approval into a new launch. |

## Deferred scope

Import formats, complex dependency visualization, shared approvals, notifications, deployment integrations, and incident operations remain uncommitted. They introduce policy and data responsibilities that the local sample does not model. Do not describe dependency support itself as missing: the current checks already depend on named prerequisites; richer visualization would be an extension.

The next investment is chosen from research evidence, not a promise to complete this list. No sprint dates, capacity estimate, assigned team, or shipped customer outcome is implied.
