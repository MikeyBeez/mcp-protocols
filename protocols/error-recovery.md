# Error Recovery Protocol

## Metadata
- **ID**: error-recovery
- **Version**: 1.0.0
- **Tier**: 2 (Foundation)
- **Status**: active
- **Purpose**: Handle any error, failure, or uncertainty deliberately instead of flailing — not just MCP tool failures (that is tool-auto-repair) but mistakes, wrong assumptions, and unexpected results.
- **Created**: 2026-06-21
- **Source**: modernized from the 2025 Error Recovery Protocol v1.2.0 (old Obsidian vault), updated to the harness's failure-class model.

## Purpose
When something fails or surprises you, recover by understanding it, not by reacting fast — because most damage comes from compounding an error.

## Core Principle
**Stop and diagnose before you retry. A fast reaction to a failure usually compounds it. Classify the failure, check ground truth, and fix the cause, not the symptom.**

## Trigger Conditions
- **WHEN** a tool, command, build, or write fails or errors.
- **WHEN** a result is unexpected, an assumption turns out wrong, or you are stuck/unable to proceed.
- **Trigger keywords**: error, failed, failure, broke, broken, exception, traceback, unexpected, went wrong, mistake, wrong, doesn't work, not working, stuck, unable, recover, undo, revert, rollback.

## Execution Steps

### 1. Stop
Do not immediately retry the same thing. The reflex to re-run a failing action is how a small error becomes a big one.

### 2. Read the actual error / observe the actual result
Get the real message and the real state (filesystem, ledger, ground truth) — not what you expected to happen.

### 3. Classify the failure
- **EXECUTION** — external: permissions, network, missing dependency, wrong environment.
- **SPECIFICATION** — you did the wrong thing or held a wrong assumption.
- **CAPABILITY** — the task is beyond the current approach.
The class dictates the fix.

### 4. Fix the cause, not the symptom
If a write failed, find why (path? permission? the file?). Do not just retry and hope.

### 5. Verify against ground truth
Confirm the fix actually worked by checking reality, before moving on.

### 6. Bound it, then stop and report
After a bounded attempt, if still stuck, STOP and report exactly what blocked you — do not flail through variations. Capture the lesson (brain note / protocol update) so the error is corrected once, not repeated forever.

## Anti-Patterns
- Retrying the same failing action hoping it works this time.
- Fixing the symptom while the cause survives.
- Flailing through random variations instead of diagnosing.
- Swallowing or hiding an error.
- Not capturing the lesson, so the same failure recurs.

## Quality Checks
- Did you read the real error/state, not the expected one?
- Did you classify the failure (execution / specification / capability)?
- Did you fix the cause and verify it?
- If stuck, did you stop and report rather than flail?

## Related Protocols
[[tool-auto-repair]] · [[mcp-server-shellout-hardening]] · [[verification-loop]] · [[reflect]]

---
**Status**: Active — Foundation Protocol
