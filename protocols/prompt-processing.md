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
- "write article", "medium" → medium-article, document-writing
- "mcp", "tool" → naming-linter, mcp-permissions
- "protocol" → protocol-writing, protocol-lifecycle

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

---

**Created**: 2026-01-14
**Status**: Active - Critical Meta Protocol
**Tool**: `mikey_prompt_process`
