# Verification Loop Protocol

## Metadata
- **ID**: verification-loop
- **Version**: 1.0.0
- **Tier**: 2 (Foundation)
- **Status**: active
- **Purpose**: Run an autonomous build/check/fix loop safely — trusting the model not blind but inside a fence that catches its mistakes.
- **Created**: 2026-06-21
- **Source**: adapted from the gstack "harness" idea (via Sumit Pandey's write-up) and this system's own enforcement-through-detection ethos.

## Purpose
Make autonomous self-correction safe and bounded, so a fast, occasionally-wrong machine can run the loop without a human in it — and can never thrash, corrupt the substrate, or loop on work that has no real check.

## Core Principle
**The model is not smart enough to be trusted blind; it is smart enough to be trusted inside a fence that catches its mistakes. A loop is only safe when there is a deterministic check it runs against, and only sane when it is bounded.**

## Trigger Conditions
- **WHEN** about to run an autonomous build/check/fix or self-correction loop.
- **Trigger keywords**: loop, autonomous, iterate until, keep trying, until it passes, until green, make the tests pass, build and test, fix until, run it and check, verification harness, autonomous loop, retry until, self-correct.

## Execution Steps

### 1. Define a verifiable end state
Name the programmatic check that says pass or fail — a test, a lint, a type check, the test_suite, or a query against ground truth (the ledger, the filesystem). If you cannot name the check, you do NOT have a loop; stop and make the goal checkable first.

### 2. Only loop on checkable work
NEVER loop on judgment calls, design decisions, or long compute (a training run, a sweep, a quantization pass). Those are a human's call or a one-shot script, never an open-ended loop. Looping on them burns hours and money for nothing.

### 3. Bound the loop
Work on a dedicated git branch, set an iteration cap, and back up before destructive edits. A loop must never be able to thrash forever or damage the substrate.

### 4. Loop
Build, run the check, read the failure, fix, re-run — until the check passes or the cap is hit.

### 5. Stop and report when stuck
If the cap is hit or the same failure recurs, STOP and report exactly what blocked you. Do not flail.

## Anti-Patterns
- Looping with no real check — that is just vibes with extra steps.
- Looping on a judgment call or a training run.
- An unbounded loop with no cap and no branch.
- Flailing on a stuck failure instead of stopping and reporting it.

## Quality Checks
- Is there a real pass/fail check to loop against?
- Is this checkable work, not judgment or long-compute?
- Branch and iteration cap set; substrate backed up?
- Does it stop and report when stuck rather than thrash?

---
**Status**: Active — Foundation Protocol

## Related Protocols
[[coding-discipline]] · [[code-review]] · [[tool-auto-repair]]
