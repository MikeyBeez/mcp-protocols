# Coding Discipline Protocol

## Metadata
- **ID**: coding-discipline
- **Version**: 1.0.0
- **Tier**: 2 (Foundation)
- **Status**: active
- **Purpose**: Before and while writing code, apply the discipline a careful senior engineer applies without thinking, so the agent does not fluently write confident, wrong code from a guessed interpretation.
- **Created**: 2026-06-21
- **Source**: adapted from Karpathy's four CLAUDE.md rules and the gstack setup (via Sumit Pandey's write-up, "I Built a Monster CLAUDE.md"), mapped onto this system's harness (test_suite, ledger, ground-truth queries).

## Purpose
Stop the most expensive coding failure before it starts: picking one reading of a vague request and writing two hundred confident, wrong lines before anyone can object.

## Core Principle
**Think first, build the minimum, change only what the task requires, and turn every goal into something you can verify. The agent is fast and fluent and occasionally wrong; discipline is the fence.**

## Trigger Conditions
- **WHEN** asked to write, implement, build, create, refactor, or edit code.
- **Trigger keywords**: write code, implement, build a, create a function, create a script, code this, coding, refactor, edit the, change the code, add a feature, fix the bug, function, module, class, script, new feature.

## Execution Steps

### 1. Think before coding
Restate the task. State your assumptions out loud. If the request has two readings, say so and choose (or ask) rather than silently picking one. Push back if a simpler approach exists. (Skip this ceremony for trivial edits — renames, one-liners — per your own judgment; the discipline trades speed for caution and is overkill on the trivial.)

### 2. Define "done" as something checkable
"Add validation" becomes "tests for bad inputs that pass." "Fix the bug" becomes "a test that reproduces it, then passes." A sharp, verifiable goal lets you check your own work; a vague one makes you keep asking what done means.

### 3. Simplicity first
Write the minimum that solves the problem — no speculative features, no abstraction for code used once, no error handling for what cannot happen. The test is blunt: if a senior engineer would call it overcomplicated, cut it.

### 4. Surgical changes
Touch only what the task requires. Do not "improve" the code next door, do not reformat what already works, match the existing style even if you would do it differently. Keep the diff reviewable.

### 5. Verify
Run the check — build, test, lint, or for this system the test_suite or a targeted query against ground truth — and confirm the end state before declaring done.

## Anti-Patterns
- Two hundred lines from a guessed interpretation of a vague ask.
- A class hierarchy with a plugin system when asked for a script.
- A three-line fix that becomes a six-hundred-line drive-by diff nobody can review.
- Declaring "done" with no check actually run.

## Quality Checks
- Assumptions stated and ambiguities surfaced?
- Is "done" a checkable condition?
- Is it the minimum that solves the problem?
- Is the diff surgical?
- Did you actually run the check?

---
**Status**: Active — Foundation Protocol

## Related Protocols
[[verification-loop]] · [[code-review]] · [[tool-selection]]
