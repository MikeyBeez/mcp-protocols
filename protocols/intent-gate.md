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
- **WHEN**: about to execute any non-trivial task whose answer must cite evidence.
- **Trigger keywords**: form, forms, schema, required fields, before running, build a form, template, populate, fields, checklist, implement, refactor, migrate, delete, deploy, edit, rewrite, drop, reset, before acting, drop table, irreversible, side effect.

## Core Principle
"Write intent before acting." Intent (what + why), scope (exact files/targets), validation (the check that exercises the changed behavior). For irreversible/high-stakes actions, surface it for go/no-go first. Then act, then validate against the plan you wrote.

## Execution Steps
1. Before acting, state: **INTENT** (what & why), **SCOPE** (exact files/targets), **VALIDATION** (how I'll know it worked, exercising the changed behavior).
2. Reversibility check (stewardship): reversible + grounded → act autonomously, report after. Irreversible / load-bearing → surface for approval first (`decision-box`).
3. Act within the stated scope only. If scope must grow, re-state intent — never creep silently.
4. After acting, run the validation you wrote. No unvalidated "done."

### 5. Is there a form for this? (merged from form-first, 2026-08-19)
A form assures COMPLETENESS — that the fields which must be present for the task to be
done right actually are. Intent/scope/validation above IS a form for actions; this step
generalises it to any non-trivial task.

- **CHECK** `forms.json` for this task or protocol. If one exists, fill it and validate:
  `python3 form_validate.py <id> -`. If you cannot honestly fill a required field, that
  is the signal you are not ready — stop and get what is missing (step 8 of
  `error-recovery`).
- **DECIDE** if none exists: would required-field completeness materially help? Build one
  when a missing field would be a real failure — multi-step or irreversible work,
  decisions, specs, goals, or an answer that must carry evidence.
- **BUILD**: define the MINIMAL required fields (only those whose absence is a real
  failure), add an entry to `forms.json`, optionally add a `## Form` section to the
  protocol. Then run the task *using* the form.
- **SKIP**: trivial, conversational, exploratory or one-shot work. Normal request, no form.
- **Keep forms minimal.** Over-forming becomes box-checking (failure mode GAM-3) and gets
  fields filled perfunctorily. Fewer required fields, each load-bearing.
- **Completeness is not correctness.** A filled form guarantees the `evidence` field
  EXISTS, not that it is true. Pair with `verification-loop`.
- Forms are additive and reversible — once built it lives in `forms.json`, so next time
  it already exists. Correct once, never again.

## Merge note
Absorbed `form-first` on 2026-08-19. Both fired on the same moment — "about to do
something non-trivial" — and form-first's own notes already called intent-gate "itself a
form for actions". One protocol, one moment. Retired file in `_retired/`.

## Notes
- Mirrors the Gemma blackboard's `pre_execution_checkpoint` event and the stewardship-and-autonomy principle ("care is what earns the autonomy").
- Cross-ref: `verification-loop`, `agent-failure-modes` (FM-2.6, REC-6).

## Form (required fields)
Machine-checkable schemas in `forms.json`: `intent-gate` (required: intent, scope, validation, reversible) and `form-first` (required: task, existing_form, decision). Validate a filled form with `python3 form_validate.py intent-gate form.json` (use `-` for stdin; add `--log` to record to harness/forms_log.jsonl). Completeness only — pair with verification-loop for truth.

## Edges
Typed links (see `edges.json`; query `python3 edges.py neighbors intent-gate`). Not matcher-wired.
- escalates-to: [[verification-loop]]
- pairs-with: [[verification-loop]] [[decision-box]]
- uses: [[forms.json]] [[form_validate.py]]
- governs (incoming): [[form-first]]
- indexes (incoming): [[agent-failure-modes]]
