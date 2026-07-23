# Sprint Backlog: Launch Control

## Sprint Goal
Deliver the core Launch Checklist dashboard with real-time UI updates (using React State) and basic dependency blocking.

## Current Sprint (Sprint 12)

### 1. [Feature] React UI Dashboard (5 Story Points)
**Description:** Implement the `LaunchChecklist.tsx` component.
**Acceptance Criteria:**
- Render the checklist tasks based on the mock data.
- Checkboxes must update the global "Launch Readiness" progress bar dynamically.
- The UI must use the new dark-mode glassmorphic design system (`bg-zinc-900/50 backdrop-blur`).
**Assignee:** David L. (Frontend)

### 2. [Feature] Dependency Blocking Logic (3 Story Points)
**Description:** Tasks must be disabled if their prerequisites are not met.
**Acceptance Criteria:**
- Write a utility function `checkDependencies(taskId, state)` that traverses the DAG (Directed Acyclic Graph) of tasks.
- If a task is locked, render a lock icon and a tooltip explaining which upstream task is blocking it.
**Assignee:** Marcus T. (Fullstack)

### 3. [Design] Post-Launch Confetti (1 Story Point)
**Description:** When the Launch Readiness bar hits 100% and the user clicks "INITIATE LAUNCH", trigger a massive confetti explosion.
**Acceptance Criteria:**
- Integrate `react-confetti`.
- Trigger only once per successful launch sequence.
**Assignee:** Sarah J. (Design/UX)

## Backlog (Next Sprint)
- [Integration] Connect LaunchDarkly API to auto-toggle feature flags upon "INITIATE LAUNCH".
- [Security] Implement Role-Based Access Control (RBAC) so only "Release Managers" can override dependencies.
