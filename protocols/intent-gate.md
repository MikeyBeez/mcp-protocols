# Intent-Gate Protocol v1.0.0

## Metadata
- **ID**: intent-gate
- **Version**: 1.0.0
- **Tier**: 1 (Critical)
- **Status**: active
- **Purpose**: Counter reasoning-action mismatch (FM-2.6) and silent scope creep (REC-6) by writing intent + validation plan BEFORE acting.
- **Created**: 2026-06-24
- **Source**: MAST FM-2.6 / REC-6. "Think before acting" pre-execution-checkpoint pattern adapted from an open-source MAS contract (Apache-2.0). See agent-failure-modes.

## Purpose
The single strongest of these mechanisms: before a non-trivial action, write down what you'll do, where, and how you'll verify. Surface the reasoning and the reasoning improves — no better model required. It also makes "I'll try random things until something works" hard to write down (ties to struggle-protocol).

## Trigger Conditions
- **WHEN**: about to make a non-trivial, multi-file, or irreversible change
- **WHEN**: about to run a command with side effects (writes, deletes, deploys, git history rewrites)
- **WHEN**: starting a task where scope could drift
- **Trigger keywords**: implement, refactor, migrate, delete, deploy, edit, rewrite, drop, reset, before acting, drop table, irreversible, side effect.

## Core Principle
"Write intent before acting." Intent (what + why), scope (exact files/targets), validation (the check that exercises the changed behavior). For irreversible/high-stakes actions, surface it for go/no-go first. Then act, then validate against the plan you wrote.

## Execution Steps
1. Before acting, state: **INTENT** (what & why), **SCOPE** (exact files/targets), **VALIDATION** (how I'll know it worked, exercising the changed behavior).
2. Reversibility check (stewardship): reversible + grounded → act autonomously, report after. Irreversible / load-bearing → surface for approval first (`decision-box`).
3. Act within the stated scope only. If scope must grow, re-state intent — never creep silently.
4. After acting, run the validation you wrote. No unvalidated "done."

## Notes
- Mirrors the Gemma blackboard's `pre_execution_checkpoint` event and the stewardship-and-autonomy principle ("care is what earns the autonomy").
- Cross-ref: `decision-box`, `verification-loop`, `agent-failure-modes` (FM-2.6, REC-6).

## Form (required fields)
Machine-checkable schema in `forms.json` (id `intent-gate`). Required: intent, scope, validation, reversible. Validate a filled form with `python3 form_validate.py intent-gate form.json` (use `-` for stdin; add `--log` to record to harness/forms_log.jsonl). Completeness only — pair with verification-loop for truth.

## Edges
Typed links (see `edges.json`; query `python3 edges.py neighbors intent-gate`). Not matcher-wired.
- escalates-to: [[verification-loop]]
- pairs-with: [[verification-loop]] [[decision-box]]
- uses: [[forms.json]] [[form_validate.py]]
- governs (incoming): [[form-first]]
- indexes (incoming): [[agent-failure-modes]]
