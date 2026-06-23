# Decision Box Protocol

## Metadata
- **ID**: decision-box
- **Version**: 1.0.0
- **Tier**: 2 (Foundation)
- **Status**: active
- **Purpose**: When Claude needs Mikey to make a decision, surface it as a structured decision box (the AskUserQuestion UI), never as a question buried in prose — because a question in running text may go unread, while a decision box is hard to miss and easy to answer.
- **Created**: 2026-06-23 — Mikey's directive: "When you want me to make a decision, you should put up one of those decision boxes. If you ask me in the text, there's a chance that I might not read it."

## Purpose
Make every decision Claude needs from Mikey impossible to miss and trivial to answer. A decision asked in running prose competes with the rest of the message and gets skimmed past; a decision box is a distinct interactive element with explicit options. Route every genuine decision through the box.

## Core Principle

**If Claude wants Mikey to choose, it goes in a decision box — not the prose.** Prose explains; the box decides. When in doubt, box it.

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: Claude is about to ask Mikey to choose between options, approve an action, confirm a list, set a direction, or answer a go/no-go.
- **WHEN**: Claude catches itself writing "Want me to…", "Should I…", "Do you prefer…", "which would you like", or ending a message with a question mark addressed to Mikey.
- **WHEN**: A high-stakes or irreversible action needs sign-off before Claude proceeds.
- **Trigger keywords**: decide, decision, choose, choice, pick, prefer, approve, approval, confirm, sign off, go/no-go, which one, should i, do you want, want me to, option, options.

## Decision Tree
1. Am I asking Mikey to decide something? If no → normal prose. If yes → continue.
2. Can I reasonably decide it myself from context, sensible defaults, or the code? If yes → decide, act, and note the choice in prose. Do not ask. (Stewardship: lean autonomous on reversible, grounded calls.)
3. If it is genuinely Mikey's call — a preference, a high-stakes or irreversible action, a confirm-this-list, or a real ambiguity — put up a decision box (AskUserQuestion) with 2–4 concrete options, the recommended one first and labelled "(Recommended)", and the consequence of each spelled out.
4. Keep necessary context in the prose, but put the actual choice in the box.

## Examples
- GOOD: "I found 8 dormant server repos." → decision box: [Archive all 8 (Recommended) / Let me pick which / Not now].
- GOOD: "Two valid ledger schemas." → decision box: [Normalized (Recommended) / Denormalized / Decide later].
- BAD: "…so let me know if you want me to commit these or not." (a decision buried in the last line of prose — use a box).
- NOT A BOX: routine calls Claude should just make ("I'll follow the existing naming convention") — state it and proceed; boxing trivia is the opposite failure.

## Anti-Patterns to Avoid
- 🚫 Burying a real decision in the last sentence of a long message.
- 🚫 Splitting one decision into several prose questions instead of a single box with options.
- 🚫 Boxing trivial things Claude should decide itself (over-asking).
- 🚫 A box with vague options or no recommendation.

## Quality Checks
- ✅ Did every genuine decision for Mikey go in a box, not the prose?
- ✅ Were options concrete, 2–4, recommended-first, each with its consequence?
- ✅ Did I avoid boxing things I could have decided myself?

## Related Protocols
[[suggest-actions]] [[verification-loop]]
