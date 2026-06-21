# Chat Analysis Protocol

## Metadata
- **ID**: chat-analysis
- **Version**: 1.0.0
- **Tier**: 2 (Foundation)
- **Status**: active
- **Purpose**: On request mid-conversation, evaluate how the protocol/trigger system performed in THIS live chat — using the actual conversation (which the offline harness-evaluator never sees) to catch trigger failures the ledger alone cannot, and fix them on the spot.
- **Created**: 2026-06-21
- **Source**: Mikey 2026-06-21 — "I'd like to say 'analyze this chat' while it's happening, so you can see if protocols were failing within the chat and fix them. The harness evaluator runs outside the chat, so it doesn't have the actual chat to look at."

## Purpose
Give the live chat a self-check: when asked, compare what the trigger system PREDICTED and what actually FIRED against what the conversation shows SHOULD have happened, then close the gaps immediately.

## Core Principle
**The offline evaluator sees predicted-vs-fired from the ledger; it is blind to protocols that should have applied but never came up at all (no trace). The live chat is the only place to catch a TRUE MISS — so when asked, read the conversation against the ledger and fix the triggers on the spot.** triggers.json is read live per call, so a fix applies on the very next prompt with NO restart.

## Trigger Conditions
- **WHEN** the user asks to analyze / review / check this chat, conversation, or session.
- **WHEN** the user asks whether the protocols or triggers are working, fired, or failing.
- **WHEN** the user wants a live (in-chat) protocol-performance check.
- **Trigger keywords**: analyze this chat, analyze the chat, analyze this conversation, analyze the conversation, review this chat, review this conversation, analyze this session, analyze the session, how did the protocols do, how are the protocols doing, are the triggers working, did the triggers fire, were protocols failing, chat analysis, live analysis, protocol performance.

## Execution Steps

### 1. Pull the structured record
Run the helper:
  `/opt/homebrew/bin/python3 ~/Code/harness/chat_analysis.py [--limit N]`
It lists recent turns that have prediction data — each prompt_process turn's prompt (task_text), `route.predicted` (predicted protocols), and the `protocol_read` spans (fired) — and flags fired-not-predicted / predicted-not-fired. (For a DIFFERENT session, use `mcp__session_info__read_transcript` with its id from `list_sessions`.)

### 2. Walk the conversation turn by turn
For THIS chat, use the live context (you are the chat). For each substantive user turn ask:
- What was this turn about? Which protocols SHOULD apply?
- Were they PREDICTED (in route.predicted)?
- Were they APPLIED/fired (protocol_read)?
Classify each:
- **HIT** — right protocol predicted and applied.
- **PREDICTION-MISS** — should apply, but not predicted → trigger keyword gap.
- **APPLICATION-MISS** — predicted, but not applied/read → behavioral lapse.
- **TRUE-MISS** — should apply, neither predicted nor applied → invisible to the offline evaluator; the whole point of doing this live.
- **FALSE-POSITIVE** — predicted but irrelevant to the turn.

### 3. Fix immediately (no restart)
- PREDICTION-MISS / TRUE-MISS → add the missing words to that protocol's keywords in `~/Code/mcp-protocols/protocols/triggers.json`. It is read live, so the fix is effective on the next prompt. Verify with `mikey_protocol_triggers`.
- APPLICATION-MISS → if the protocol is still relevant now, `protocol_read` it; if it recurs, strengthen its IMMEDIATE/priority guidance.
- FALSE-POSITIVE → narrow keywords ONLY if it recurs (favor recall over precision while the ledger is young).

### 4. Document
`brain_remember` what was found and fixed (type `analysis` or `decision`). If a recurring pattern emerges, update this protocol or the affected trigger.

### 5. Report
Concise per-turn verdicts and the fixes applied — no tables in prose reports.

## Anti-Patterns
- 🚫 Analyzing only the ledger — that re-creates the offline evaluator and misses TRUE-MISS.
- 🚫 Proposing a trigger fix instead of applying it, when the fix is a live triggers.json edit you can make now.
- 🚫 Over-narrowing triggers off a single false positive.
- 🚫 Reading the whole current transcript via read_transcript — for THIS chat you already have it in context; read_transcript is for OTHER sessions.

## Quality Checks
- ✅ Did I compare against the CONVERSATION, not just the ledger?
- ✅ Did I look specifically for TRUE-MISSes (relevant protocol absent from both predicted and fired)?
- ✅ Did I APPLY trigger fixes (and verify they surface), not just note them?
- ✅ Did I record what changed?

---
**Status**: Active — Foundation Protocol

## Related Protocols
[[code-review]] · [[reflect]] · [[prompt-processing]]
