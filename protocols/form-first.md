# Form-First Protocol v1.0.0

## Metadata
- **ID**: form-first
- **Version**: 1.0.0
- **Tier**: 1 (Critical — runs before task execution)
- **Status**: active
- **Purpose**: Decide, BEFORE running a task, whether to build/fill a required-field form first. If a form would assure the right fields get populated, build it before executing. If not, a normal request.
- **Created**: 2026-06-24
- **Source**: Mikey directive 2026-06-24 — "we should have a protocol for building forms; if we can build a form for something before we run it, we should do that." Builds on forms.json + form_validate.py + intent-gate.

## Purpose
Forms assure completeness — that the fields which MUST be populated for a task to be done right are actually present (intent, validation, evidence, decision criteria, …). This protocol makes form-use a reflex: before running a non-trivial task, prefer to build the form first, fill it, and let it guide the work — instead of discovering a missing field after the fact.

## Trigger Conditions
- **WHEN**: about to execute any non-trivial task or protocol
- **WHEN**: the task is multi-step, irreversible, decision/spec/goal-heavy, or its answer must cite evidence/sources
- **WHEN**: a protocol fires that has — or should have — required fields
- **Trigger keywords**: form, forms, schema, required fields, before running, build a form, template, populate, fields, checklist.

## Core Principle
"Build the form before you run the task — when a form helps. No form, and one wouldn't help? Normal request. A form guarantees the fields are PRESENT, not that they are TRUE (pair with verification-loop)."

## Execution Steps
1. **CHECK** for an existing form in `forms.json` for this task/protocol. If one exists → fill it and validate (`python3 form_validate.py <id> -`), then proceed. If you cannot honestly fill a required field, that is the signal you are not ready — stop and get what's missing (see struggle-protocol).
2. **DECIDE** (no form yet): would required-field completeness materially help? Build a form when a missing field would be a real failure — multi-step or irreversible work, decisions / specs / goals, or an answer that must carry evidence.
   - **BUILD**: define the MINIMAL required fields (only those whose absence = a real failure), add an entry to `forms.json` (id, required, fields; `conditional_required` if needed), optionally add a `## Form` section to the protocol's .md. Then run the task *using* the form.
   - **SKIP** (the fallback): trivial, conversational, exploratory, or one-shot tasks → normal request, no form.
3. **Keep forms minimal.** Over-forming becomes box-checking (failure-mode GAM-3) and makes the model fill fields perfunctorily. Fewer required fields, each load-bearing.
4. **Completeness ≠ correctness.** A built or filled form is paired with `verification-loop` — the form ensures the `evidence`/`validation` field EXISTS, not that it is true.
5. **Forms are additive and reversible.** Once built, a form lives in `forms.json`, so next time it already exists — the library of forms grows ("correct once, never again").

## Form (required fields)
Machine-checkable in `forms.json` (id `form-first`). Required: task, existing_form, decision (use | build | skip). Validate: `python3 form_validate.py form-first -`.

## Notes
- The fallback is explicit: no applicable form → normal request. The Gemma tab already behaves this way (structured/review are opt-in; default = normal).
- Cross-ref: `intent-gate` (itself a form for actions), `verification-loop` (truth, not just completeness), `agent-failure-modes` (GAM-3 box-checking, FM-3 verification), `decision-box` (the human-input form).

## Edges
Typed links (see `edges.json`; query `python3 edges.py neighbors form-first`). Not matcher-wired.
- governs: [[intent-gate]] [[struggle-protocol]] [[stop-trigger]] [[verification-loop]] [[reflect]]
- uses: [[forms.json]] [[form_validate.py]]
