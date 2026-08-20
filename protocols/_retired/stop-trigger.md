# Stop-Trigger Protocol v1.0.0

## Metadata
- **ID**: stop-trigger
- **Version**: 1.0.0
- **Tier**: 1 (Critical)
- **Status**: active
- **Purpose**: Counter step repetition / not learning / circular fixes (FM-1.3, REC-3, REC-5).
- **Created**: 2026-06-24
- **Source**: MAST FM-1.3 / REC-3 (step repetition / not learning). "Same fix twice = stop" adapted from an open-source MAS contract (Apache-2.0). See agent-failure-modes.

## Purpose
Repeating the same (or cosmetically varied) fix is the single most common multi-agent failure (~17% of MAST traces). Iterating harder on a wrong model wastes turns and grows the damage. The countermeasure is mechanical: detect the repeat, stop.

## Trigger Conditions
- **WHEN**: about to apply the same or near-same fix a second time
- **WHEN**: the second consecutive attempt of one approach has failed
- **WHEN**: fix A broke B, and fixing B is about to re-break A (circular)
- **Trigger keywords**: try again, still failing, that didn't work either, that didn't work, one more time, let me adjust, circular, keeps breaking, same fix.

## Core Principle
"Same fix twice → stop and rethink." A repeated failure usually means the mental model — or the spec — is wrong, not that the code needs another nudge. Treat it as a broken spec, not broken code.

## Execution Steps
1. Track the last fix attempt and its target. If the new attempt is the same shape, HALT.
2. Re-derive the assumptions behind the approach — which one is false?
3. Consider that the requirement/spec is wrong, not the implementation.
4. Change approach materially, or escalate via `struggle-protocol`. Do not iterate the same idea a third time.

## Notes
- Complements `tool-auto-repair` (3× tool-failure threshold) and `error-recovery`. This one is about *logic/fix* repeats, not tool errors.

## Form (required fields)
Machine-checkable schema in `forms.json` (id `stop-trigger`). Required: repeated_action, assumption_to_recheck, new_approach. Validate a filled form with `python3 form_validate.py stop-trigger form.json` (use `-` for stdin; add `--log` to record to harness/forms_log.jsonl). Completeness only — pair with verification-loop for truth.

## Edges
Typed links (see `edges.json`; query `python3 edges.py neighbors stop-trigger`). Not matcher-wired.
- escalates-to: [[struggle-protocol]]
- pairs-with: [[tool-auto-repair]]
- governs (incoming): [[form-first]]
- pairs-with (incoming): [[struggle-protocol]]
- indexes (incoming): [[agent-failure-modes]]
