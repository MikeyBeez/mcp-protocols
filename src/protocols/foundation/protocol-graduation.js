// Protocol Graduation Protocol - Converting text protocols to programmatic tools
module.exports = {
  id: 'protocol-graduation',
  name: 'Protocol Graduation Protocol',
  version: '1.0.0',
  tier: 1,
  purpose: 'Guide the conversion of text protocols into programmatic MCP tools',
  triggers: [
    'Protocol is used frequently (weekly or more)',
    'Protocol execution is consistent with little variation',
    'Protocol has multiple steps prone to error',
    'User suggests a protocol should become a tool',
    'Reviewing protocol usage patterns',
    'Protocol complexity warrants automation'
  ],
  status: 'active',
  location: '/Users/bard/Code/mcp-protocols/src/protocols/foundation/protocol-graduation.js',
  content: `# Protocol Graduation Protocol v1.0.0

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: A protocol is executed frequently (weekly or more)
- **WHEN**: Protocol execution follows the same steps with minimal variation
- **WHEN**: Multiple steps create opportunity for human/AI error
- **WHEN**: User explicitly suggests graduating a protocol
- **WHEN**: Reviewing which protocols should become tools
- **PRIORITY**: Critical (Tier 1) - reduces uncertainty in system

## Core Principle
"Protocols document the what and why; tools implement the how."
Graduation makes execution deterministic - the tool either runs or it doesn't.

---

## IMMUTABLE - Graduation Criteria

A protocol should graduate to a tool when ALL of these are true:

1. **Frequency**: Executed regularly (weekly or more often)
2. **Consistency**: Same steps every time with minimal variation
3. **Complexity**: Multiple steps with potential for error
4. **Automation**: Steps can be executed programmatically

A protocol should REMAIN as text when ANY of these are true:

1. **Rare**: Executed infrequently (monthly or less)
2. **Variable**: Each execution is significantly different
3. **Judgment**: Steps require human assessment
4. **Simple**: Only 2-3 steps that are easily remembered

---

## IMMUTABLE - Graduation Process

### Step 1: Identify Candidate
- Review protocol usage frequency
- Check if execution varies significantly
- Assess if steps are automatable

### Step 2: Design Tool Interface
- Define required parameters (user MUST provide)
- Define optional parameters with sensible defaults
- Identify what decisions the AI should gather via conversation

### Step 3: Implement Tool
- Create tool in appropriate MCP server (usually mcp-brain-manager)
- Tool accepts parameters, executes steps, returns results
- Include validation and error handling
- Tool should NOT assume preferences - accept them as parameters

### Step 4: Update Protocol
- Keep the protocol document (explains why/when)
- Add "GRADUATED TO TOOL" marker
- Point to the tool for execution
- Protocol becomes documentation, tool becomes implementation

### Step 5: Update Architecture
- Update mcp-tools-registry in mcp-architecture
- Update protocol-triggers reference
- Mark tool as "GRADUATED PROTOCOL" in registry

---

## EDITABLE - Tool Design Principles

When converting protocol to tool:

1. **Make required inputs explicit** - Don't guess at names, types, etc.
2. **Provide sensible defaults** - Most common choices should be defaults
3. **Support customization** - Power users can override any default
4. **Validate early** - Check prerequisites before starting
5. **Provide feedback** - Return clear success/failure information
6. **Support rollback** - If step N fails, don't leave partial state

---

## EDITABLE - Interactive Prompting Pattern

The AI assistant's role when using graduated tools:

1. **Detect** that the workflow is needed
2. **Gather** user preferences through conversation
3. **Validate** prerequisites
4. **Invoke** the tool with collected parameters
5. **Report** results to the user

Example:
\`\`\`
User: Create a new MCP tool for bookmarks

AI: I'll help create that. A few questions:
- What should I name it?
- Public or private repo?
- Which license?

User: bookmark-brain, public, MIT

AI: [Invokes mikey_create_project with parameters]
Done! Created at ~/Code/bookmark-brain
\`\`\`

---

## EDITABLE - Current Graduation Candidates

Based on usage patterns, these protocols may be ready for graduation:

| Protocol | Frequency | Consistency | Complexity | Ready? |
|----------|-----------|-------------|------------|--------|
| create-project | High | High | High | ✅ GRADUATED |
| error-recovery | High | Medium | Medium | Maybe |
| architecture-update | Medium | High | Medium | Maybe |
| medium-article | Low | High | High | Not yet |

---

## Post-Graduation

After a protocol graduates:

1. The TEXT protocol remains as documentation
2. The TOOL handles execution
3. Triggers in protocol point to tool
4. Less uncertainty about "did it trigger correctly?"
5. Execution becomes deterministic

---

## Related Protocols
- protocol-lifecycle - Manages protocol optimization
- protocol-writing - Creates new protocols
- architecture-update - Updates docs after graduation

---
**Status**: Active - v1.0.0`
};
