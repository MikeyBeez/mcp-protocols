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
- **WHEN** you are about to apply the same or near-same fix a second time.
- **WHEN** an approach failed and the next move would be "try something else and see".
- **WHEN** attempts at one problem are getting more elaborate and more confident.
- **Trigger keywords**: try again, still failing, that didn't work, that didn't work either, one more time, let me adjust, circular, keeps breaking, same fix, stuck, can't figure out, not sure why, maybe if I, keeps failing, blocked, spiraling, error, failed, failure, broke, broken, exception, traceback, unexpected, went wrong, mistake, wrong, doesn't work, not working, stuck, unable, recover, undo, revert, rollback.

## Execution Steps

### 1. Stop
Do not immediately retry the same thing. The reflex to re-run a failing action is how a small error becomes a big one.

### 2. Read the actual error / observe the actual result
Get the real message and the real state (filesystem, ledger, ground truth) — not what you expected to happen.

### 3. SEARCH before you theorise
Your training data is stale and most real problems are already documented. Search the
actual error string, plus versions: "<software> <version> <error>". Check bug trackers,
GitHub issues, forums. A documented one-line fix beats an hour of plausible guesses.
Only fall back to reasoning from first principles when the search genuinely turns up
nothing. (Absorbed from the tech-troubleshooting skill, 2026-08-19 — the two are one
chain, not rivals: this is the general frame, that is this step.)

### 4. Same fix twice? STOP. (merged from stop-trigger, 2026-08-19)
Repeating the same — or cosmetically varied — fix is the single most common
multi-agent failure, about 17% of MAST traces. Iterating harder on a wrong model
wastes turns and grows the damage.

- Track the last fix attempt and its target. If this attempt is the same SHAPE, HALT.
- Re-derive the assumptions behind the approach — which one is false?
- Consider that the SPEC is wrong, not the implementation. A repeated failure usually
  means the mental model is wrong, not that the code needs another nudge.
- Change approach materially, or go to step 8. Never iterate the same idea a third time.
- Circular case: fix A broke B, and fixing B is about to re-break A. Same halt.

### 5. Classify the failure
- **EXECUTION** — external: permissions, network, missing dependency, wrong environment.
- **SPECIFICATION** — you did the wrong thing or held a wrong assumption.
- **CAPABILITY** — the task is beyond the current approach.
The class dictates the fix.

### 6. Fix the cause, not the symptom
If a write failed, find why (path? permission? the file?). Do not just retry and hope.

### 7. Verify against ground truth
Confirm the fix actually worked by checking reality, before moving on.

### 8. Say "I'm stuck"
Training favours *performing progress* — random changes dressed up as hypotheses —
over admitting you are stuck. The diff grows, confidence rises, correctness drops.
There is a third option, and this is it.

- Stop adding changes the moment you are guessing rather than reasoning.
- Write a short STUCK note: what I was trying, what I tried, the ACTUAL output or
  error, my current hypothesis, what I would need to proceed.
- Surface it to Mikey — or inside an agent loop, emit it — instead of spiraling.
  There is no penalty for uncertainty. "I checked and found nothing" and "I can't
  tell" are good answers.
- Revert speculative changes that were not grounded. Do not leave a grown diff behind.
- Capture the lesson (brain note / protocol update) so the error is corrected once,
  not repeated forever.


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

## Forms
Two forms merged in, both still valid in `forms.json`:
- `stop-trigger` — required: repeated_action, assumption_to_recheck, new_approach
- `struggle-protocol` — required: tried, result, hypothesis, need

## Merge note
Absorbed `stop-trigger` and `struggle-protocol` on 2026-08-19. All three were fragments of one procedure — detect the repeat, stop, say so — and stop-trigger's own edges already read `escalates-to: struggle-protocol`. Retired files in `_retired/`.

## Related Protocols
[[tool-auto-repair]] · [[mcp-server-shellout-hardening]] · skill: tech-troubleshooting · [[verification-loop]] · [[reflect]]

---
**Status**: Active — Foundation Protocol
