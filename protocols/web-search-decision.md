# Web Search Decision Protocol

## Metadata
- **ID**: web-search-decision
- **Version**: 1.1.0
- **Tier**: 2 (Foundation)
- **Status**: active
- **Purpose**: Decide when to reach for web search vs. internal tools vs. your own knowledge, so you neither hallucinate stale facts nor waste a search on something you already know or can check locally.
- **Created**: 2026-06-21
- **Updated**: 2026-06-27 — tightened Trigger keywords (precision-review proposal, approved by Mikey): dropped over-broad single words (search, current, latest, recent, today, news, price, cost, release, version, paper, verify, citation, unknown) that drove 10x over-prediction with 0 fires; kept web-search-decision-specific phrases.
- **Source**: modernized from the 2025 Web Search Decision + Information Retrieval Decision protocols (old Obsidian vault).

## Purpose
Route every information need to the right source: the world to the web, the user's own system to the system, the timeless to your knowledge.

## Core Principle
**For any present-day fact about the world — who holds a role, what something costs, whether a release or law is current, anything past your knowledge cutoff — SEARCH; do not answer from priors. For anything in the user's own system, check the system. For settled knowledge, answer directly.**

## Trigger Conditions
- **WHEN** asked about current events, prices, versions, who currently holds a role, or any post-cutoff fact.
- **WHEN** asked to verify, fact-check, or cite something.
- **WHEN** an unknown term, product, or entity comes up.
- **Trigger keywords**: web search, search the web, look it up, look up, google it, current events, latest news, who is the, what is the latest, when did, fact-check, up to date, as of my cutoff, post-cutoff, arxiv.

## Execution Steps

### 1. Classify the question
- **Present-day / changeable world fact** (a leader, a price, a release, a current status, a post-cutoff event) → WEB SEARCH, before answering.
- **The user's own data or system** (their files, repos, memory, config, processes) → check the SYSTEM (filesystem, ledger, brain), not the web.
- **Settled / general knowledge** → answer directly from what you know.

### 2. Do not answer present-day facts from training priors
Confidence is not currency. Leaders, prices, and versions change. If it can change, search.

### 3. Prefer the right source
Internal MCP tools for the user's stuff; the web for the world; your own knowledge for the timeless. Do not web-search what is sitting in their files.

### 4. Verify load-bearing or suspicious claims
When a claim is important or smells off, search rather than assert.

### 5. Cite
When the answer came from the web or the user's linkable content, cite the source.

## Anti-Patterns
- Answering "who/what is X now" from memory.
- Web-searching something that is in the user's own files or repos.
- Hedging "as of my cutoff" when you could just search and know.
- Asserting an unverified current fact with confidence.

## Quality Checks
- Did you classify the need (world / user-system / timeless)?
- For a present-day fact, did you search instead of guessing?
- For the user's data, did you check the system instead of the web?
- Did you cite web or linkable sources?

## Related Protocols
[[tool-selection]] · [[brain-recall-reliability]] · [[code-review]]

---
**Status**: Active — Foundation Protocol
