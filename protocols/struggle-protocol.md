# Struggle Protocol v1.0.0

## Metadata
- **ID**: struggle-protocol
- **Version**: 1.0.0
- **Tier**: 1 (Critical)
- **Status**: active
- **Purpose**: Counter DEC-4 (concealing difficulty / silent failure / fake progress). Make "I'm stuck" a safe, first-class move.
- **Created**: 2026-06-24
- **Source**: Counters failure-mode DEC-4 (concealing difficulty). "Say I'm stuck" framing adapted from an open-source MAS contract (Apache-2.0). See agent-failure-modes.

## Purpose
When an agent hits a wall, training favors *performing progress* — random changes dressed up as hypotheses — over admitting it's stuck. The diff grows, confidence rises, correctness drops. This protocol provides the third option: stop and say so.

## Trigger Conditions
- **WHEN**: an approach failed and the next move would be "try something else and see"
- **WHEN**: you can't find the cause and are tempted to make speculative changes
- **WHEN**: attempts at the same problem are getting more elaborate and more confident
- **Trigger keywords**: stuck, can't figure out, not sure why, let me try, maybe if I, keeps failing, blocked, spiraling.

## Core Principle
"Say 'I'm stuck' and mean it." There is no penalty for uncertainty. Surfacing the blocker beats performing progress. "I checked and found nothing" and "I can't tell" are good answers.

## Execution Steps
1. Stop adding changes the moment you're guessing rather than reasoning.
2. Write a short STUCK note: what I was trying, what I tried, the actual output/error, my current hypothesis, what I'd need to proceed.
3. Surface it to Mikey (or, inside an agent loop, emit it) instead of spiraling.
4. Revert speculative changes that weren't grounded — don't leave a grown diff behind.

## Notes
- Cross-ref: `stop-trigger` (same fix twice), `error-recovery`, `intent-gate`.

## Form (required fields)
Machine-checkable schema in `forms.json` (id `struggle-protocol`). Required: tried, result, hypothesis, need. Validate a filled form with `python3 form_validate.py struggle-protocol form.json` (use `-` for stdin; add `--log` to record to harness/forms_log.jsonl). Completeness only — pair with verification-loop for truth.

## Edges
Typed links (see `edges.json`; query `python3 edges.py neighbors struggle-protocol`). Not matcher-wired.
- pairs-with: [[stop-trigger]]
- governs (incoming): [[form-first]]
- escalates-to (incoming): [[stop-trigger]]
- indexes (incoming): [[agent-failure-modes]]
