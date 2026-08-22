# Prompt Processing Protocol

## Purpose
Pre-process every user prompt through `mikey_prompt_process` to extract protocol triggers and context hints before responding.

## Status: **Active Foundation Protocol**
- **Tier**: 0 (Meta - runs before all others)
- **Version**: 1.0.0
- **Priority**: Critical

## Trigger Conditions (MUST ACTIVATE)

Activate this protocol when:
- **WHEN**: Any new user message is received
- **WHEN**: Starting to process a user request
- **EXCEPTION**: Skip for system messages and tool results
- **IMMEDIATE**: Yes - must be first action before any response
- **PRIORITY**: Critical - highest priority

## Core Principle

**"Process prompt first, then respond"**

Every user prompt should go through the `mikey_prompt_process` tool before generating a response. This ensures:
- Relevant protocols are identified automatically
- Context hints are captured
- Simple prompts are fast-tracked
- Complex prompts get proper protocol support

## Workflow

### Step 1: Receive User Prompt
When a user message arrives, before doing anything else:

```
mikey_prompt_process(prompt: "the user's message")
```

### Step 1b: Is this one task, or several? (added 2026-08-22)

Mikey, 2026-08-21: "One of the first things done for a prompt should be decomposition.
Then do protocols."

A prompt is not always one task. Step 1 routed the WHOLE message as a single thing, so a
message holding three requests gets one muddled ranking where it needed three sharp ones,
and the parts that matter least drag down the score of the parts that matter most.

- **GATE FIRST, and cheaply.** Most turns are one task. Go straight to Step 2 when the
  prompt is short, conversational, a single question, or a direct follow-up. This step must
  cost nothing on an ordinary turn.
- **WHEN THE GATE OPENS**, name the pieces in one line, then re-run `mikey_prompt_process`
  per piece and union the results. Say which protocol came from which piece, so the routing
  stays auditable — that is the whole reason protocols are matched rather than self-loading.
- **SAY WHICH ANSWER YOU REACHED.** "One task" is a real answer and costs a line.
- `decompose` (`mcp__decomposer__decompose`) is there when the split itself is hard, and
  `classify` when the shape of the problem is unclear. Do not reach for either when naming
  the pieces yourself is quicker.
- **The failure mode is OVER-decomposition** — turning a two-minute job into six coordinated
  ones. If the pieces would need each other's results in order to be written, that is a
  PLAN, not a decomposition: write the plan and do not split.

WHY THIS IS PROSE AND NOT YET CODE: the real fix is for the matcher to decompose before
routing, inside `mcp-protocols-lean`. That puts a model call on the critical path of every
turn unless the gate is cheap, and whether it can be made cheap is a measurement nobody has
taken. Run it by hand first, notice what the gate should have been, and graduate it to code
on the evidence rather than shipping a guessed heuristic into the hot path.

### Step 1c: A protocol matched by MEANING is still a match (added 2026-08-22)

When keyword matching comes back weak, the matcher asks the engrams — 261 embedded past
prompts — whether they can see something the words missed. That rescue now reaches
`relevant_protocols` like any other hit, and a rescue on a TIER 0 or 1 protocol at
similarity 0.70 or above is moved to the front and named in the directive.

**Treat a promoted engram hit as recommended, not incidental.** Its `why` will say
`engram rescue <score> — TIER n, keywords missed it entirely`. That phrasing is the
signal: the protocol's own trigger words are absent from the prompt, which is exactly
when a session is most likely to skip it.

WHY THE THRESHOLD IS 0.70 AND THE SCOPE IS TIERS 0-1: higher than the 0.65 rescue floor
so only strong hits promote, and narrow enough that tier-2 guesses cannot flood the list.
Tiers 0 and 1 are the always-on meta rules and the safety rules; those are the ones where
a miss costs something that cannot be taken back.

WHAT THIS FIXED, worth keeping because the failure was invisible: on 2026-08-21 the prompt
"it should be a repo if it's anonymized" scored `github-anonymization` at ZERO on keywords
— the message contains none of push, github, publish, remote or origin — while the engram
saw it at 0.759, the highest of that session. It is a tier 1 protocol governing what gets
published to the internet, and it never appeared in the response. The cause was a plain
bug: the rescue pushed onto a filtered COPY of the hit list, so it was computed and
discarded. The next action on the table was creating a public repository from a directory
holding an ssh config block.

DO NOT FIX A MISS LIKE THIS BY ADDING KEYWORDS. "repo" belongs to create-project, and the
2026-08-19 addendum measured that harvesting words from missed prompts re-introduced a bug
deliberately deleted in June — 9 of 15 candidates were either already-removed words or
ordinary English. The hybrid exists so the fix lives on the engram side.

### Step 2: Evaluate Response
The tool returns:
- `skip_processing: true` → Quick response, proceed directly
- `triggered_protocols: [...]` → Load these protocols before responding
- `context_hints: [...]` → Consider these while responding

### Step 3: Load Triggered Protocols (if any)
For each protocol in `triggered_protocols`:
```
mikey_protocol_read <protocol_id>
```

### Step 4: Respond with Protocol Guidance
Now respond to the user with the protocol guidance in mind.

## Tool Response Format

```json
{
  "processed": true,
  "skip_processing": false,
  "prompt_length": 42,
  "matched_keywords": ["create project", "new"],
  "triggered_protocols": [
    {
      "id": "create-project",
      "name": "Create Project Protocol",
      "tier": 3,
      "purpose": "Guide creation of new software projects",
      "load_command": "mikey_protocol_read create-project"
    }
  ],
  "context_hints": [
    "Polite request - user expects action"
  ],
  "recommendation": "Load 1 protocol(s) before proceeding"
}
```

## Quick Response Patterns

The tool automatically skips processing for:
- Simple acknowledgments: "yes", "no", "ok", "thanks"
- File operations: "open...", "show...", "reveal..."
- Single numbers or very short responses

This prevents unnecessary latency on trivial interactions.

## Keyword Trigger Mapping

The tool maps keywords to protocols:
- Error/problem words → error-recovery
- "create project", "new project" → create-project
- "write article", "medium" → medium-article
- "mcp", "tool" → naming-linter, mcp-permissions
- "protocol" → continuous-documentation

## Benefits

1. **Consistency**: Protocol selection is deterministic, not interpretive
2. **Completeness**: No protocols are forgotten
3. **Efficiency**: Simple prompts skip the overhead
4. **Logging**: Every prompt and its triggers are trackable
5. **Evolution**: Keyword mappings can be refined over time

## Anti-Patterns to Avoid

- **Skipping the tool**: Don't respond without processing first
- **Ignoring triggered protocols**: If protocols are triggered, load them
- **Over-processing**: Trust the skip_processing flag for quick responses

## Quality Checks

Before responding to any user prompt, verify:
- ✅ Called `mikey_prompt_process` with the prompt
- ✅ Loaded any triggered protocols
- ✅ Considered context hints in response

## Response Timestamp

**Every response must begin with a timestamp.**

Format: `**[YYYY-MM-DD HH:MM TZ]**`

Example: `**[2026-01-14 18:16 PST]**`

This provides:
- Timeline visibility for the user
- Time context after session compaction
- Record of when work happened

To get current time, check system or use `date` command if needed.

---

**Created**: 2026-01-14
**Status**: Active - Critical Meta Protocol
**Tool**: `mikey_prompt_process`

## Related Protocols
[[continuous-documentation]] · [[reflect]] · [[chat-analysis]]
