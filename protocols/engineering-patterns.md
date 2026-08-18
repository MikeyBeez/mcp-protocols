# Engineering Patterns Store

**Tier**: 2 (Foundation)
**Created**: 2026-07-11, from the seaborn-3407 SWE-bench post-mortem

## Purpose
One canonical store of pattern-level engineering knowledge that the whole
system shares — harness agents, coding sessions, Claude itself. "Correct
once, never again," applied to engineering judgment instead of behavior.

## Canonical store
`~/Code/LLMOS/engineering-patterns.json` — a JSON list of short strings,
git-tracked, synced to both machines through the repo. The SWE-bench fix
phase injects it automatically (trace_consumers.patterns_load merges it
with runtime-local `~/swe/patterns.json`).

## Triggers
- About to fix a bug (any language, any repo): load the store first.
- A scored/verified failure reveals a general lesson: ADD the lesson.
- Reviewing a diff before submit/commit: check it against the store.

## Rules for entries
1. PATTERN-LEVEL ONLY: knowledge an engineer would carry between jobs.
   Never instance-specific fixes (for benchmarks that is oracle leakage;
   for real work it is just useless specificity).
2. Short, imperative, self-contained. One lesson per entry.
3. Provenance note in the git commit, not the entry.

## Seed entries (2026-07-11)
np.array-of-tuples 2-D footgun; MultiIndex tuple labels; never fix a
lookup by changing data identity; public-type-change diff smell;
smallest-patch preference.

## Counting honesty (benchmarks)
The store is legitimate knowledge — but if a lesson was learned from an
instance's own scoring feedback, a rerun of THAT instance is
oracle-informed. Report such reruns transparently (footnote), count
everything else normally. The goal is a better system, not a better score.
