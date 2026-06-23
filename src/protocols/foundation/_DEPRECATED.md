# ⚠️ DEPRECATED — this directory is DEAD

Nothing reads `src/protocols/foundation/*.js` anymore. The live protocol system
(`mcp-protocols-lean` + the Brain Monitor) reads ONLY the Markdown library at:

    ~/Code/mcp-protocols/protocols/*.md

A protocol that exists only as `.js` in this tree is INVISIBLE to
`mikey_prompt_process`, `mikey_protocol_triggers`, and the dashboard. These files
are kept for history only (also backed up to GitHub). Do NOT edit them expecting
the live system to change — author in the `.md` library instead.

## Disposition (resolved 2026-06-23 consolidation pass)

Every `.js` here was triaged keep-vs-retire. PORTED = now lives in the live `.md`
library. RETIRED = left here as history; reason given.

### Ported to the live library
- `create-project.js`        → protocols/create-project.md (ported 2026-06-20)
- `error-recovery.js`        → protocols/error-recovery.md (ported earlier)
- `prompt-processing.js`     → protocols/prompt-processing.md (ported earlier)
- `naming-linter.js`         → protocols/naming-linter.md (ported 2026-06-23; registry at ~/Code/mikey-naming-registry verified live)
- `mcp-permissions.js`       → protocols/mcp-permissions.md (ported 2026-06-23; stale server inventory dropped)
- `medium-article.js`        → protocols/medium-article.md (ported 2026-06-23; trimmed generic filler)

### Retired (history only — reason)
- `active-inference.js`        — superseded by reflect.md + the automated harness (surprise/reflection/proposals).
- `architecture-update.js`     — references abandoned mcp-architecture virtual docs + registry.js; the "don't let docs go stale" core is in continuous-documentation.md.
- `document-writing.js`        — generic wrapper; the one real rule (Medium = plain text) lives in medium-article.md.
- `information-integration.js` — generic multi-source synthesis; source routing is covered by web-search-decision.md.
- `kaggle-aimo3-submission.js` — AIMO3 deadline was 2026-04-15; competition concluded. One-off runbook, not a live workflow.
- `maintenance.js`             — manual "audit due?" prompting superseded by the harness daily eval + the scheduled consolidation pass.
- `progress-communication.js`  — generic; emoji-template style conflicts with Mikey's brevity preference.
- `protocol-error-correction.js` — tied to the dead .js module format; overlaps error-recovery.md + stale-note-correction.md.
- `protocol-graduation.js`     — the graduation TOOLING (mikey_graduation_track + chunk tools) was abandoned in the lean rewrite, so the protocol's steps invoke tools that no longer exist. NOT redundant, though: its still-valid DECISION (when a recurring/stable/automatable procedure should graduate from text to an MCP tool) was FOLDED into continuous-documentation.md's PROTOCOL CHECK step (1.3.0), so the idea survives.
- `protocol-lifecycle.js`      — same dead graduation/chunking tooling (every command is a now-nonexistent tool: mikey_graduation_track, mikey_protocol_chunk_*, mikey_trigger_*). Graduation-criteria nugget preserved in continuous-documentation.md.
- `protocol-selection.js`      — superseded by prompt-processing.md + tool-selection.md.
- `protocol-writing.js`        — describes the dead .js authoring model; replaced by continuous-documentation.md + skill-creator.
- `system-audit.js`            — docs-vs-reality audit superseded by code-review.md's method + the automated harness.
- `task-approach.js`           — generic intent-vs-literal advice; covered by prompt-processing.md.
- `user-communication.js`      — generic style framework; conflicts with the brevity preference; covered by prompt-processing.md.

If a retired protocol ever proves needed again, port it to `protocols/<id>.md`
in the house format (don't revive it in place).
