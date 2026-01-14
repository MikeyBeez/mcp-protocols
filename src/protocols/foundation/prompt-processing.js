// Prompt Processing Protocol - Pre-process prompts to extract protocol triggers
module.exports = {
  id: 'prompt-processing',
  name: 'Prompt Processing Protocol',
  version: '1.0.0',
  tier: 0,  // Meta-protocol - runs before others
  purpose: 'Pre-process every user prompt through mikey_prompt_process to extract protocol triggers and context hints before responding',
  triggers: [
    'Any new user message',
    'Starting to process a user request',
    'Before generating any response',
    'First action on receiving prompt'
  ],
  status: 'active',
  location: '/Users/bard/Code/mcp-protocols',
  content: `# Prompt Processing Protocol v1.0.0

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: Any new user message is received
- **WHEN**: Starting to process a user request
- **EXCEPTION**: Skip for system messages and tool results
- **IMMEDIATE**: Yes - must be first action before any response
- **PRIORITY**: Critical (Tier 0)

## Core Principle
"Process prompt first, then respond" - Every user prompt should go through mikey_prompt_process before generating a response.

## IMMUTABLE - Processing Workflow

### Step 1: Receive User Prompt
When a user message arrives, before doing anything else:

mikey_prompt_process(prompt: "the user's message")

### Step 2: Evaluate Response
The tool returns:
- skip_processing: true → Quick response, proceed directly
- triggered_protocols: [...] → Load these protocols before responding
- context_hints: [...] → Consider these while responding

### Step 3: Load Triggered Protocols (if any)
For each protocol in triggered_protocols:
  mikey_protocol_read <protocol_id>

### Step 4: Respond with Protocol Guidance
Now respond to the user with the protocol guidance in mind.

## Tool Response Format

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

## Quick Response Patterns (Automatic Skip)

The tool automatically skips processing for:
- Simple acknowledgments: "yes", "no", "ok", "thanks"
- File operations: "open...", "show...", "reveal..."
- Single numbers or very short responses

This prevents unnecessary latency on trivial interactions.

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
- ✅ Called mikey_prompt_process with the prompt
- ✅ Loaded any triggered protocols
- ✅ Considered context hints in response

---
**Status**: Active Meta Protocol - v1.0.0
**Tool**: mikey_prompt_process`
};
