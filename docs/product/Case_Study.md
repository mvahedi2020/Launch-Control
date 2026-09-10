# Launch Control case study

## The product problem

Launch decisions often happen across status documents, chat threads, checklists, and meetings. That fragmentation makes it hard to answer basic questions: Who owns the dependency? Is the mandatory check complete? What evidence supports the decision? What happened after launch?

Launch Control turns those questions into enforced product states for Northstar, a fictional B2B SaaS company. A simulated launch stays locked until all dependencies are ready, every mandatory check has an owner and evidence, and a go decision is recorded. A timestamped timeline preserves the decision trail. After launch, a sample incident forces an explicit pause or rollback response.

## My role as Product Manager

I defined the product concept, launch policy, interaction requirements, information architecture, sample scenario, acceptance criteria, and validation plan. Google Antigravity and other AI tools assisted with implementation and verification. This is a personal portfolio artifact, not a claim that I wrote the application code, managed an engineering team, or shipped a Northstar product.

## Product choices

- Make readiness a rule, not a decorative score.
- Require ownership and evidence on mandatory checks.
- Separate the recorded go/no-go decision from the launch action.
- Use a timeline to make state changes and incident responses inspectable.
- Keep every action simulated and device-local.

## Proposed measures

Begin with five formative sessions to identify misunderstandings in the launch workflow. A later 20-participant study would test whether 18 of 20 reviewers can explain the blockers and 17 of 20 can complete the gated flow without help. Every started sample-incident scenario should end with a recorded pause or rollback response; abandonment remains in the denominator.

See the [PRD](PRD.md#evaluation-plan--proposed-not-measured) for definitions and guardrails and the [validation plan](Validation.md) for the study sequence. These are proposed targets; no production outcomes or user research are claimed.
