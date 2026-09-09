# Control matrix: Launch Control

Every person, dependency, evidence record, event, and release response is fictional. This app has no production connection, authentication, deployment action, traffic control, messaging, or paid service.

| Area | Control | Expected behavior | Recovery and boundary |
| --- | --- | --- | --- |
| Navigation | Command, Timeline, About, brand, View timeline | Changes the local hash view | Browser back and forward work locally |
| Dependencies | Owner list | Assigns or removes the fictional owner for a dependency | Missing owners block related required work |
| Dependencies | State list | Marks a dependency Ready, Watching, or Blocked | A non-ready state locks related checks and launch permission |
| Checks | Readiness checkbox | Marks an unlocked check complete or reopens it | Locked checks remain unavailable until every dependency is Ready and owned |
| Checks | Check owner and evidence fields | Records a fictional owner and text evidence | Required checks need both completion and nonblank evidence |
| Decision | Go choice | Available only when every required gate is clear | It is disabled with an explanation while a blocker remains |
| Decision | No-go choice and rationale | Allows a hold decision with a nonblank reason | It does not permit simulated launch |
| Decision | Record decision | Adds a timestamped local event | A recorded Go is withdrawn if a required dependency or check later regresses; resolving it requires a new Go record |
| Launch | Simulate launch | Runs only in pre-launch state with cleared required gates and a recorded Go | It changes only local sample state |
| Incident | Run sample post-launch issue | Reveals a fictional SEV 2 response choice after launch | No real alert or customer effect occurs |
| Incident | Pause rollout / Roll back release | Records the selected local response and ends the incident | The model intentionally includes only these two sample paths |
| Timeline | Timeline page | Shows local timestamped decisions, evidence, and responses | It is a browser-local trail, not an audit system |
| Recovery | Reset sample | Restores the original fixtures and removes saved local state | No shared release system changes |
| Export | Export summary | Downloads the fictional plan, readiness state, and timeline as JSON | It does not upload or notify anyone |
| Persistence and accessibility | Browser storage, native controls, labels, focus outlines | Restores valid sample state; supports keyboard operation and responsive layout | Invalid or unavailable storage shows a warning and remains usable in the current tab |
