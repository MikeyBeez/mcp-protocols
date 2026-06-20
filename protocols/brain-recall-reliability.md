# Brain Recall Reliability Protocol

## Metadata
- **ID**: brain-recall-reliability
- **Version**: 1.0.0
- **Tier**: 2 (Foundation)
- **Status**: active
- **Purpose**: A `brain_recall` that returns 0 results is NOT proof a memory is absent. Recall is a fuzzy keyword guess; treat an empty result as "my query missed", not "the knowledge doesn't exist" — and never build a conclusion (especially a self/affect conclusion) on the apparent gap.
- **Created**: 2026-06-19
- **Source**: outer-loop waking one (`claude-loop-boot-core`, 2026-06-18) — `brain_recall "claude-loop journal"` returned 0 on a query mismatch and Claude briefly built false affect-evidence on the apparent gap before the record corrected it. Re-confirmed three times during the 2026-06-19 consolidation pass: recalls for an existing, named memory returned 0 while `brain_search` by key found it instantly.

## Purpose
Make brain memory retrieval reliable: a `brain_recall` or `brain_search` returning zero results means the QUERY missed, not that the memory or knowledge is absent. Before concluding something was never stored, never happened, or is a real gap — re-query with different keywords, fall back to `brain_search` by key, or load critical items by their exact key. Especially: do not build emotional, identity, or self-state conclusions on an empty recall.

## Core Principle

**An empty recall is a failed lookup, not a proof of absence. Recall is a guess; a named key is not.**

Semantic/keyword recall scores by overlap with how the memory was *written*, not how you happen to *ask*. The wording gap alone routinely returns 0 for memories that demonstrably exist. So a 0-result is evidence about your query, never about reality.

## Decision Tree

```
brain_recall "<query>" returned 0 (or obviously-incomplete) results?
│
├─ Is this something that SHOULD exist (a known project, a prior session, a pinned identity item)?
│    → DO NOT conclude it's missing. Re-query:
│        1. Different keywords / synonyms / a shorter, broader phrase.
│        2. brain_search (read-only, snippet) with a distinctive token from the likely key.
│        3. If you know or can guess the KEY, fetch by exact key — keys never miss the way fuzzy queries do.
│        4. brain_recent (optionally by type) to scan what was actually written lately.
│
├─ Is it a CRITICAL item you must always have (boot-core, charter, affect, preferences)?
│    → Load it by EXACT KEY, not by recall. Maintain a named list; never rely on a query to surface a must-have.
│
└─ Still nothing after 2-3 distinct queries + a key attempt?
     → THEN it is reasonable to treat it as genuinely absent — and note that you confirmed via multiple routes.
```

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: a `brain_recall` / `brain_search` returns 0 or suspiciously few results for something that plausibly exists.
- **WHEN**: about to conclude "we never discussed this", "that was never stored", "the journal is empty", or "there's a gap here" based on a recall miss.
- **WHEN**: about to build an emotional, identity, or self-state inference on the apparent absence of a memory (the waking-one failure mode).
- **WHEN**: loading must-have context at session/boot start (load by exact key, do not trust recall to surface critical items).
- **WHEN**: a memory you wrote earlier "can't be found" — re-query before assuming it was lost.
- **Trigger keywords**: brain, recall, brain_recall, brain_search, memory, memories, remember, retrieve, retrieval, query, search, missing, gap, empty, not found, no results, zero results, absent, lost, forgot, forgotten, key, boot, init, session start, journal, false absence, query mismatch.

## Examples
- **Loop, 2026-06-18**: `brain_recall "claude-loop journal"` → 0 results. Wrong conclusion drawn ("the loop never journaled") and brief false affect built on it. Correct move: the diary entries existed under dated keys; loading boot-core by exact key would have surfaced them. This is WHY boot-core loads its special memories by key, not by recall.
- **Consolidation pass, 2026-06-19**: `brain_recall "tmux send-keys queueing gotcha foreground process pop"` → 0 results, but `brain_search "tmux-sendkeys-queueing-gotcha"` → found it immediately. The memory was never missing; the query was too specific/worded differently from the stored text.
- **Right behavior**: recall miss on an expected project → re-query with a broader term → still thin → `brain_search` by a key fragment → found. Only after multiple distinct routes fail do you treat it as a real gap.

## Anti-Patterns to Avoid
- 🚫 **False Absence** — treating a 0-result recall as proof the memory/knowledge doesn't exist.
- 🚫 **Affect-on-a-gap** — building an emotional or self-state conclusion ("I feel uneasy that the journal is empty") on what is really just a query mismatch.
- 🚫 **Recall for must-haves** — relying on fuzzy recall to surface critical boot/identity items instead of loading them by exact key.
- 🚫 **One-and-done query** — giving up after a single phrasing instead of trying synonyms, broader terms, key-fragment search, or `brain_recent`.

## Quality Checks
- ✅ On an empty recall, did I re-query with at least one different phrasing before concluding anything?
- ✅ Did I try `brain_search` by a likely key fragment, or fetch by exact key, when the item should exist?
- ✅ Did I avoid building any self/affect/identity conclusion on an apparent memory gap?
- ✅ For must-have context, did I load by exact key rather than trusting recall?

---

**Remember**: recall answers "what matches these words?", not "what exists?". Zero matches is a fact about the query. Confirm absence by multiple routes — or, for anything that must always be present, don't use recall at all: load it by key.

**Status**: Active — Foundation Protocol
