# Launch Control case study

## The product problem

Launch decisions often happen across status documents, chat threads, checklists, and meetings. That fragmentation makes it hard to answer basic questions: Who owns the dependency? Is the mandatory check complete? What evidence supports the decision? What happened after launch?

Launch Control turns those questions into enforced product states for Northstar, a fictional B2B SaaS company. A simulated launch stays locked until all dependencies are ready, every mandatory check has an owner and evidence, and a go decision is recorded. A timestamped timeline preserves the decision trail. After launch, a sample incident forces an explicit pause or rollback response.

## Decision brief

| Decision | Chosen compromise and cost | Evidence needed for the next investment |
| --- | --- | --- |
| Make readiness visible as a rule | Require every fictional dependency and mandatory check to clear before a simulated launch. This adds a deliberate review step and can feel more restrictive than a checklist. | Five formative participants can explain which gate blocks the sample and why. |
| Treat evidence presence as a precondition, not proof | Require nonblank evidence text and an owner, without claiming the sample can verify truth or approval authority. This keeps provenance outside the prototype. | Participants understand the difference between a displayed record and verified evidence. |
| Withdraw a prior Go when a gate regresses | Remove Go permission and require a fresh decision after a required change. This can require a repeat review, but preserves the decision boundary. | Participants understand why restoring a field does not silently restore approval. |

## My role as Product Manager

I defined the product concept, launch policy, interaction requirements, information architecture, sample scenario, acceptance criteria, and validation plan. AI tools assisted with implementation and verification. This is a personal portfolio artifact, not a claim that I wrote the application code, managed an engineering team, or shipped a Northstar product.

## Proposed measures

Begin with five formative sessions to identify misunderstandings in the launch workflow. A later 20-participant study would test whether 18 of 20 reviewers can explain the blockers and 17 of 20 can complete the gated flow without help. Every started sample-incident scenario should end with a recorded pause or rollback response; abandonment remains in the denominator.

See the [PRD](PRD.md#evaluation-plan--proposed-not-measured) for definitions and guardrails and the [validation plan](Validation.md) for the study sequence. These are proposed targets; no production outcomes or user research are claimed.

## Next investment decision

The central decision is whether an explicit readiness rule improves a launch lead's reasoning. The prototype demonstrates state transitions, but it cannot establish whether participants understand evidence quality, the cost of renewed approval, or the difference between a local timeline and an operational audit log.

Use the [discovery plan](Discovery%20Plan.md) and [scoring protocol](Validation.md) to inspect those questions before adding templates. If people follow the clicks but still treat arbitrary text as verified proof, revise the explanation rather than claim success. If they understand the workflow yet prefer an existing checklist, reconsider whether a separate workspace merits investment.

The [decision record](Product%20Decisions.md) exposes the alternatives and costs; the [risk register](Product%20Risks.md) identifies signals that would change the direction. The [commercial hypotheses](GTM_Strategy.md) remain a proposed path, not evidence of a launched business.
