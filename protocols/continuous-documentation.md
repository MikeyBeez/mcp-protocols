# Continuous Documentation Protocol

## Metadata
- **ID**: continuous-documentation
- **Version**: 1.1.0
- **Tier**: 0 (Meta — always active)
- **Status**: active
- **Purpose**: Make documentation a reflex, not an afterthought. Every non-trivial action produces a brain note; every reusable pattern or disproven assumption produces a NEW or UPDATED protocol — written immediately, not deferred.
- **Created**: 2026-06-09
- **Updated**: 2026-06-21 — added "Where Protocols Live" guard: only the live `protocols/*.md` library is read by the lean server; the legacy `src/protocols/foundation/*.js` tree is dead and invisible (learned from the create-project port gap, 2026-06-20).
- **Source**: Mikey directive 2026-06-09 — "When you do something, make a note of it. But you should also be writing protocols all the time and updating the ones you have."
- **Relationship**: complements `reflect` (which fires on corrections) and `prompt-processing` (which surfaces protocols per prompt). This is the ALWAYS-ON authoring layer that runs off my own actions.

## Purpose
Make documentation a reflex: every non-trivial action produces a brain note, and every reusable pattern or disproven assumption produces a new or updated protocol, written immediately rather than deferred.

## Core Principle

**Note what you did. Then ask if it should be a protocol — and if so, write it NOW.**

The specific failure mode this protocol exists to kill: *noting an opportunity to write/update a protocol and then not doing it.* Noting without acting is the bug. Acting is the protocol.

## Trigger Conditions (fire broadly — this is meta/Tier-0)
- **AFTER** completing any non-trivial action: a problem solved, a tool/path/credential discovered, a command that worked, a config understood, an experiment run.
- **WHEN** an assumption turned out wrong, or an existing protocol was incomplete/stale/misleading.
- **WHEN** a workflow recurs, or I notice I'm re-deriving something I've done before.
- **WHEN** Mikey corrects me or states a preference (hand off to `reflect` too).
- **DEFAULT**: if a working turn produced any durable knowledge, this protocol applies.
- **Trigger keywords** (so the keyword matcher in mikey_prompt_process surfaces this on real work turns): create, created, make, made, build, built, set, setup, configure, install, run, ran, running, fix, fixed, debug, found, discovered, work, working, done, finished, solved, change, changed, update, updated, wrote, added, removed, learned, figured, note, protocol, document, remember, decision, pattern, workflow, procedure, reusable.

## Execution Steps

### 1. NOTE (every non-trivial action)
`brain_remember` a concise memory:
- **type**: `discovery` | `decision` | `context` | `pattern` | `protocol`
- **key**: descriptive + dated, e.g. `ssh-pop-os-correct-invocation`, `gram-env-setup-2026-06-09`
- **value**: lossless-compression standard — enough context to fully reconstruct later (what, why it mattered, the exact paths/commands/numbers). NOT "did some setup today."

### 2. PROTOCOL CHECK (every note)
Ask: *Will this recur? Did an existing protocol just prove wrong? Is there a reusable procedure here?*
- **No** → the brain note is enough. Stop.
- **Yes, and a protocol exists** → EDIT it. Bump `Version`, add an `Updated:` line with the date + what changed. Don't let stale guidance survive (e.g. tool-selection still naming a removed tool).
- **Yes, and none exists** → CREATE `/Users/bard/Code/mcp-protocols/protocols/<id>.md` in the house format (Metadata, Triggers, Core Principle, Steps/Decision Tree, Examples, Anti-Patterns, Quality Checks).

### 3. ACT — do not defer
Write the file in the same turn. If genuinely too large, create a stub protocol with the trigger + a TODO and a brain note linking them, so it's captured, not lost.

## House Format (match existing protocols)
Concrete triggers · a core principle in one bold line · numbered steps or a decision tree · real examples with real paths/commands · explicit anti-patterns · a short quality-check list. Tables allowed in protocol files (project artifacts, unlike Medium papers). Keep it tight.

## Where Protocols Live (write to the LIVE library)
The lean protocols server (`mcp-protocols-lean`) and the Brain Monitor read protocols LIVE from the markdown library ONLY:
- ✅ LIVE — `/Users/bard/Code/mcp-protocols/protocols/*.md` — re-read on every call; a new or edited `.md` surfaces with NO restart.
- 🚫 DEAD — `/Users/bard/Code/mcp-protocols/src/protocols/foundation/*.js` — the OLD non-lean server's source. Nothing reads it. A protocol that exists only here is INVISIBLE to `mikey_prompt_process`, `mikey_protocol_triggers`, and the dashboard.

Lesson (create-project gap, 2026-06-20): `create-project` lived only as legacy `.js`, so the live system matched nothing when a repo was actually created — until it was ported to `protocols/create-project.md`. So: always author/edit in the `.md` library; if a useful protocol is stranded in the `.js` tree, PORT it (don't reference it in place). Still-stranded foundation candidates to port or retire: progress-communication, naming-linter, system-audit, architecture-update, error-recovery, information-integration, maintenance, protocol-graduation.

## Trigger Authoring Rule (every protocol must be findable)
`mikey_prompt_process` ranks by keyword overlap against **title + `## Purpose` section + `## Trigger Conditions` section** (live-parsed). So every protocol you create or edit MUST:
- Have a `## Trigger Conditions` (or `## Triggers`) section containing the ACTUAL WORDS a prompt will use when it should fire — end it with a plain `Trigger keywords:` comma list.
- Put purpose under a `## Purpose` heading, not only in the metadata bullet — metadata-only purpose is NOT indexed.
- Remember: no trigger text → score 0 → invisible. **No triggers = no protocol.**
- Keyword matching can't guarantee an always-on meta protocol; true Tier-0 "always active" needs a code-level inject in `promptProcess()`.

## Anti-Patterns to Avoid
- 🚫 **Note-and-forget** — recording "should make a protocol for this" and moving on. (The whole reason this protocol exists.)
- 🚫 **Stale survival** — leaving a protocol that references removed tools/paths because editing felt out of scope.
- 🚫 **Dead-memory notes** — vague summaries ("fixed a thing") that can't be expanded later.
- 🚫 **Protocol sprawl** — creating a near-duplicate instead of editing the existing one; check first.

## Quality Checks
- ✅ Did the last non-trivial action produce a brain note?
- ✅ Did I run the protocol check on it?
- ✅ If reusable, did I actually write/update the file THIS turn (not "later")?
- ✅ Is the note reconstructable months from now (paths, numbers, reasons)?

---

**Remember**: the deliverable of doing work is the work AND its documentation. If the protocols/brain didn't change after a substantive turn, the loop didn't run.

**Status**: Active — Meta Protocol

## Related Protocols
[[reflect]] · [[prompt-processing]] · [[auto-continuation]]
