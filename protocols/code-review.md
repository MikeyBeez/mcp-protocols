# Code / Systems Review Protocol

## Metadata
- **ID**: code-review
- **Version**: 1.0.0
- **Tier**: 2 (Foundation)
- **Status**: active
- **Purpose**: When asked to review code or a system — judge whether the code "makes sense," look at it from an overall systems point of view, audit it — run a disciplined review that grounds every claim in the actually-deployed code and verifies findings empirically, instead of rubber-stamping or theorizing.
- **Created**: 2026-06-21
- **Source**: chat-analysis of the 2026-06-21 telemetry session — Mikey asked "look over the tools and servers and see if the code makes sense, overall systems pov" and the trigger system matched NOTHING (a confirmed TRUE-MISS). This protocol fills that gap, seeded from the method that review actually used.

## Purpose
Give "review this code/system" requests a real method: read what is deployed, prove the load-bearing properties with checks that could fail, and rank honest findings with fixes.

## Core Principle
**Review the DEPLOYED code (read what is actually running, not what you remember writing), prove the invariants with a check that would FAIL if the claim were false, and rank real findings by severity with concrete fixes. Find real issues; do not rubber-stamp.**

## Trigger Conditions
- **WHEN** the user asks to review / look over / audit / sanity-check code, a system, the tools, or the servers.
- **WHEN** the user asks whether the code "makes sense," is correct, or holds up "from a systems point of view."
- **WHEN** the user asks for an architecture or design review.
- **Trigger keywords**: review the code, review this code, code review, does the code make sense, makes sense, look over the code, look over the tools, review the tools, review the servers, systems review, system review, systems point of view, systems pov, overall design, architecture review, audit the code, audit the system, sanity check, is this correct, review this system, look it over, review the design.

## Execution Steps

### 1. Read the deployed artifacts
`cat` the live files / inspect running processes + config — NOT your memory of them. Code drifts from intent; review the truth on disk.

### 2. Verify invariants empirically
Run a check that would FAIL if the claim were false, rather than asserting it:
- Integrity: aggregates match raw counts; no orphans / broken references.
- Data flow: trace one unit end-to-end through the system.
- Idempotence, failure isolation, bounded growth.

### 3. Hunt the real failure classes
- Shared mutable state / concurrency races (esp. multiple writers or hosts).
- Restart-gated or silent failures (see `mcp-server-shellout-hardening`).
- Unbounded growth; double-counting; stale/dead dependencies; blind spots.

### 4. Rank findings by severity
Each: what it is, impact, and a concrete fix recipe. Separate **verified-solid** from **caveat** from **bug**. Lead with the worst.

### 5. Fix the cheap/safe ones; recommend the rest
Apply low-risk corrections; for anything bigger, recommend and let the user prioritize. Do NOT silently re-architect a stable system mid-review.

### 6. Document
`brain_remember` the findings (type `analysis`) so they survive the session.

## Anti-Patterns
- 🚫 Rubber-stamping ("looks good to me") without reading the deployed code.
- 🚫 Reviewing from memory of what you wrote instead of what is running.
- 🚫 Asserting integrity without a check that could have failed.
- 🚫 Re-architecting mid-review without consent.

## Quality Checks
- ✅ Did I read the DEPLOYED code/config?
- ✅ Did I run at least one check that could have failed?
- ✅ Are findings ranked, with fix recipes, separating solid / caveat / bug?
- ✅ Did I fix the cheap ones and record the rest?

---
**Status**: Active — Foundation Protocol
