# Sample walkthrough: clear and recheck a launch gate

This walkthrough uses only the fictional Northstar Analytics 2.4 plan. It demonstrates an inspectable readiness decision; it does not deploy software, contact people, or verify real evidence.

## Read the initial blocker

Choose **Reset sample** first to replace any browser-local state with the fictional fixtures; this is the explicit replacement action. If saved data is incompatible, the app first preserves that raw browser payload, shows the sample plan with a warning, and leaves the choice to the reviewer. Open **Command**. The seeded plan shows **Support enablement** as **Watching** with the note “Final brief pending.” Because that dependency is not Ready, **Support runbook rehearsed** remains locked. The launch control is disabled even though the other required checks show completed sample records.

The sample makes a policy distinction: a readiness percentage or a completed-looking checklist does not itself permit launch. A required dependency must have an owner and be Ready; the related mandatory check must then have an owner, completion, and nonblank evidence. The displayed evidence is a review input, not proof that an underlying event occurred.

## Prepare a draft decision state

Set **Support enablement state** to **Ready**. The Support runbook check unlocks. Mark **Support runbook rehearsed** complete and enter **Sample rehearsal notes** in its evidence field. Evidence and rationale are each limited to 500 characters, so typed and restored state follow the same contract. These exact sample inputs clear the final required gate.

Select **Go**, add a rationale such as “All required sample evidence reviewed,” and choose **Record decision**. The timeline records a local Go event and **Simulate launch** becomes available. This is deliberately separate from recording Go: a decision is visible before the simulated state transition occurs.

## Test the boundary and response

After recording Go, clear the existing **Regression suite reviewed evidence** field. The sample withdraws Go, disables simulated launch, and adds a withdrawal event to the timeline. Re-enter the original **Sample QA report #184** evidence, select **Go**, enter a new rationale, and choose **Record decision**. Re-entering evidence clears the blocker, but only this fresh decision restores launch permission. This prevents an earlier approval from silently surviving a changed prerequisite.

Once every required gate is clear and a current Go exists, choose **Simulate launch**. Then run the **sample post-launch issue** and select either **Pause rollout** or **Roll back release**. Export the summary after the response and inspect its top-level boundary: **Fictional simulation; no production action**. Its compact summary names the resulting phase, recorded decision, and remaining readiness blockers before the full local launch record. The interface repeats the simulated phase and blocker count after download. The timeline and JSON remain local to the browser unless the reviewer separately shares the downloaded file.

If you export before changing a dependency or check, the completion notice describes that earlier plan. Make one edit and confirm the notice clears; export again when the new state is ready for review. A pre-launch saved Go with current blockers is rejected during restore, because resolving a blocker still requires a fresh decision.

The product tradeoff is intentional: the sample enforces the presence and sequence of decision inputs, while leaving evidence truth, authority, production deployment, and real incident management outside its scope. The next product question is whether launch practitioners understand that boundary without help; the [measurement plan](Measurement%20Plan.md) defines the proposed study and stop conditions.
