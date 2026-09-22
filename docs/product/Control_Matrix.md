# Control matrix: Launch Control

Every person, dependency, evidence record, event, and release response is fictional. This app has no production connection, authentication, deployment action, traffic control, messaging, or paid service.

| Area | Control | Expected behavior | Recovery and boundary |
| --- | --- | --- | --- |
| Navigation | Command, Timeline, About, brand, View timeline | Changes the local hash view | Browser back and forward work locally |
| Dependencies | Owner list | Assigns or removes the fictional owner for a dependency | Missing owners block related required work |
| Dependencies | State list | Marks a dependency Ready, Watching, or Blocked | A non-ready state locks related checks and launch permission |
| Checks | Readiness checkbox | Marks an unlocked check complete or reopens it | Locked checks remain unavailable until every dependency is Ready and owned |
| Checks | Check owner and evidence fields | Owner changes update the fictional check immediately; each changed evidence-text edit is captured once when completed on blur | Required checks need both completion and nonblank evidence; a present value is not verified proof |
| Checks / Decision | Input bounds | Evidence and rationale controls enforce a 500-character maximum, and restored plans reject longer values | The same bound applies to typed and restored state; no silent truncation occurs |
| Decision | Go choice | Available only when every required gate is clear | It is disabled with an explanation while a blocker remains |
| Decision | No-go choice and rationale | Allows a hold decision with a nonblank reason | It does not permit simulated launch |
| Decision | Record decision | Adds a timestamped local event | A recorded Go is withdrawn if a required dependency or check later regresses; resolving it requires a new Go record |
| Launch | Simulate launch | Runs only in pre-launch state with cleared required gates and a recorded Go | It changes only local sample state |
| Incident | Run sample post-launch issue | Reveals a fictional SEV 2 response choice after launch | No real alert or customer effect occurs |
| Incident | Pause rollout / Roll back release | Records the selected local response and ends the incident | The model intentionally includes only these two sample paths |
| Timeline | Timeline page | Shows local timestamped decisions, changed-evidence snapshots, Go withdrawals after a required regression, and simulated responses; each event has a distinct stored identity | An unchanged focus/blur creates no event; the local trail is not an audit system |
| Recovery | Reset sample | Explains that the current local session will be replaced, then restores the original fixtures and removes saved local state only after explicit confirmation | Keep current session leaves the plan untouched; no shared release system changes |
| Export | Export summary | Downloads the fictional plan, readiness state, timeline, current phase, recorded decision, and blockers as JSON | The file and completion message say it is a fictional simulation with no production action; no upload or notification occurs |
| Persistence and accessibility | Browser storage, native controls, labels, focus outlines | Restores valid sample state; supports keyboard operation and responsive layout | Blank or ambiguous identities, duplicate prerequisite links, impossible phase/incident combinations, and unavailable storage show a warning while the current tab remains usable |
| Persistence | Incompatible saved session | Keeps the raw browser payload untouched and displays the sample plan with a warning | Explicit Reset sample is the replacement boundary |
| Persistence | Restored decision consistency | Rejects a pre-launch Go when current required blockers remain | A reviewer must reconstruct a valid decision from the sample state |
| Export | Stale notice recovery | Clears the export completion notice after any plan edit; the JSON is built from one readiness snapshot | The notice never implies that an earlier export represents the current plan |
# September 21 control clarifications

| Control | Product behavior | Evidence boundary |
| --- | --- | --- |
| Snapshot fidelity | Export includes schema version 1 and a detached copy of the current plan. | Unit test; fictional state only. |
| Timeline integrity | Duplicate event IDs are ignored case-insensitively. | Unit test; does not prove storage recovery. |
| Reset messaging | Reset clears export status and returns seeded blockers after confirmation. | UI behavior requires browser verification. |
| Dialog access | Reset confirmation exposes a labelled description and modal focus behavior. | Existing browser coverage plus local markup. |
