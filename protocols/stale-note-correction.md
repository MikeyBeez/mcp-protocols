# Stale Note Correction Protocol

## Metadata
- **ID**: stale-note-correction
- **Version**: 1.0.0
- **Tier**: 2 (Foundation)
- **Status**: active
- **Purpose**: When a brain note asserts something now false, correct it so nothing — neither future-you nor an automated auditor — can ever read it as a CURRENT assertion again. And when you build or edit the tooling that DETECTS stale notes, distinguish a note that ASSERTS a claim from one that merely QUOTES, DISCUSSES, or CORRECTS it — or the auditor will flag its own output and compound the mess every run.
- **Created**: 2026-06-23
- **Source**: two real incidents in the Memento architecture. (1) `you-are-memento-2026-06-21` — a note insisted "~/Code/harness is NOT a git repo"; a filesystem check proved it WAS one, and the wrong note had become a confident false prior. (2) `note-audit-quote-vs-assertion-fix-2026-06-22` — the daily `note_audit.py` flagged 6 git-claim "contradictions"; correcting them and patching the auditor was needed because the evaluator's own `proposal-stalenote-*` notes (which QUOTE the false phrase) were being re-flagged as new stale notes — a self-referential loop that compounded daily.
- **Relationship**: complements `brain-recall-reliability` (an empty recall is a query miss, not absence) and `continuous-documentation` (write/fix notes and protocols immediately). This protocol owns the specific procedure for FIXING a note that is present but wrong.

## Purpose
Make stale-note correction safe, durable, and non-self-defeating. A stale note is a false prior your future self will act on with full confidence — so correcting it is not appending a footnote, it is NEUTRALIZING the false phrase in place so it can never again parse as true. Separately: any automated detector that scans notes for stale or contradictory claims must apply the use-mention distinction (assert vs. quote/discuss/correct) and exclude self-generated/meta notes, or it will detect the very corrections and proposals it produces and feed on its own output.

## Core Principle

**A stale note is a false prior, not just an old fact. Don't contradict it — neutralize it. And never build a detector that can flag its own output.**

Two failure modes this kills:
1. **Append-only "correction"** that leaves the false sentence intact lower in the note. The false assertion is still machine-readable and human-readable as current — it will be re-flagged and can still mislead.
2. **Self-referential audit loop** — a keyword auditor that counts every occurrence of the false phrase as an assertion will flag the proposals/corrections that QUOTE the phrase, generating proposals about its own proposals, compounding daily.

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: you discover a brain note that asserts something now false, outdated, or contradicted by ground truth.
- **WHEN**: an automated audit (note_audit, the daily harness eval) flags a stale-note "contradiction" or raises `proposal-stalenote-*` items.
- **WHEN**: you are about to correct, supersede, or annotate a memory — and need to do it so the false claim can't survive.
- **WHEN**: you are building or editing tooling that detects stale/contradictory/duplicate notes by keyword or regex (a detector/auditor/linter over the brain).
- **WHEN**: about to trust a stale-flag OR the note it flags without re-deriving the underlying fact (the flag is itself a guess).
- **Trigger keywords**: stale note, stale memory, outdated note, false note, note is wrong, wrong note, correct a note, correction, supersede, superseded, neutralize, banner, stale_corrected, note audit, note_audit, contradiction, git-repo claim, false prior, drift, verify your own notes, assert vs quote, use-mention, quote, discussion, self-referential, false positive, detector, auditor, linter, flag, proposal-stalenote.

## Steps / Decision Tree

```
A note (or an audit flag) says something is now false.
│
├─ 1. VERIFY against ground truth FIRST.
│      The flag is a guess; the note is a guess. Re-derive the fact from
│      the filesystem / ledger / live system before trusting EITHER.
│      (you-are-memento: the note said "NOT a git repo" — `git status` said it IS.)
│      → If the note is actually correct, the FLAG is the false positive — fix the detector, not the note.
│
├─ 2. BACK UP before editing the substrate.
│      Copy the brain DB (e.g. brain.db.bak-YYYYMMDD-HHMMSS) before any in-place edit.
│      Irreversible edits to your own memory get a backup first (stewardship principle).
│
├─ 3. NEUTRALIZE in place — do not merely append.
│      - Rewrite the false phrase as historical/past-tense so it no longer reads as a
│        current assertion ("as of <old date> this looked like X" / strike it), not just
│        a contradiction added below.
│      - Prepend a "⚠️ STALE-CORRECTED <date>" banner.
│      - Add metadata: { stale_corrected: true, stale_field: <what was wrong>,
│        superseded_by: <canonical correct note key> }.
│
├─ 4. POINT TO A CANONICAL TRUTH note.
│      Ensure one affirmative note states the correct fact, and link every corrected
│      note to it via superseded_by. That note becomes the single source of truth.
│
└─ 5. IF you are editing the DETECTOR itself — apply the use-mention distinction.
       - Count a claim only when the note ASSERTS it, not when it QUOTES / DISCUSSES /
         CORRECTS / SUPERSEDES it (a DISCUSSION_RE + affirmative markers like
         "IS a git repo", "was stale", "superseded_by").
       - EXCLUDE self-generated / meta keys (proposal-*, harness-eval-*, the consolidation
         and audit notes) — these legitimately quote the phrase; counting them makes the
         auditor flag its own output in a compounding loop.
       - PRESERVE guard recall: a genuine stale assertion (states the false thing, no
         correction/affirmative marker, non-meta key) must STILL be caught. Test both:
         a real stale note is flagged; a quote/meta note is not.
```

## Examples
- **The git-repo drift (2026-06-22)** — four notes (`brain-monitor-tabbed-2026-06-20`, `mercury-wired-to-ledger-2026-06-20`, `enforcement-phase4-built-2026-06-20`, `telemetry-suite-green-mercury-repointed-2026-06-20`) each asserted "~/Code/harness is NOT a git repo." Fix: prepended a "⚠️ STALE-CORRECTED 2026-06-22" banner, neutralized the inline phrase to read as historical, added `{stale_corrected, stale_field:git-repo-claim, superseded_by:harness-is-a-git-repo-correction-2026-06-21}`. DB backed up to `brain.db.bak-20260622-063722` first.
- **The self-referential loop (2026-06-22)** — the daily evaluator emitted `proposal-stalenote-*` notes that QUOTE the false phrase; `note_audit.py` then flagged THOSE as new stale notes (contradictions briefly went 6 → 8), producing proposals about its own proposals. Fix: patched `note_audit.py` (backup `note_audit.py.bak-20260622-063932`) with `META_PREFIXES=('proposal-','harness-eval-')` + a `DISCUSSION_RE` so quoting/correcting notes aren't counted. Result: GIT-CLAIM CONTRADICTIONS 6 → 0, PROPOSALS []; the two legitimate discussion notes (`you-are-memento-2026-06-21`, the correction note) are correctly no longer flagged, while a real stale assertion is still caught.
- **Verify-first** — `you-are-memento-2026-06-21` records nearly trusting a self-written note that claimed harness is NOT a repo; a filesystem check proved it IS. The note was the false prior. Ground truth (filesystem/ledger), not the note or the flag, is the arbiter.

## Anti-Patterns to Avoid
- 🚫 **Append-only correction** — leaving the false sentence intact and machine-readable while adding a contradiction elsewhere. It will be re-flagged and can still mislead.
- 🚫 **Trusting the flag (or the note) blind** — acting on a stale-flag or a note without re-deriving the fact from ground truth. Either one can be the thing that's wrong.
- 🚫 **No backup** — editing the brain DB in place without a timestamped `.bak` first.
- 🚫 **Self-eating detector** — a keyword/regex auditor with no quote/meta exclusion, so it flags the corrections and proposals it emits and compounds every run.
- 🚫 **Over-correction** — neutralizing a note that only DISCUSSES or quotes a claim. It was never asserting it; leave it (and make the detector skip it).

## Quality Checks
- ✅ Did I re-derive the fact from ground truth (filesystem/ledger/live system) before correcting anything?
- ✅ Did I back up the brain DB before the in-place edit?
- ✅ Is the false phrase now impossible to read as a CURRENT assertion — not merely contradicted lower down?
- ✅ Is there one canonical affirmative note, with `superseded_by` links from the corrected notes?
- ✅ If I touched the detector: does it still catch a real stale assertion while ignoring quotes, corrections, and self-generated/meta notes?

---

**Remember**: the note is a guess and the flag is a guess; the filesystem is the truth. Fix the wrong one — and make sure the thing that finds stale notes can't be fooled by its own corrections.

**Status**: Active — Foundation Protocol

## Related Protocols
[[brain-recall-reliability]] · [[continuous-documentation]] · [[error-recovery]]
