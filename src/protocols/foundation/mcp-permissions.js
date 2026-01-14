// MCP Permissions Configuration Protocol
module.exports = {
  id: 'mcp-permissions',
  name: 'MCP Permissions Configuration Protocol',
  version: '1.0.0',
  tier: 2,
  purpose: 'Guide configuration of MCP tool permissions in Claude settings',
  triggers: [
    'Adding a new MCP server',
    'Tool requires frequent permission clicks',
    'Read-only tools should auto-approve',
    'Configuring Claude settings.local.json',
    'New tools added to existing server'
  ],
  status: 'active',
  location: '/Users/bard/Code/mcp-protocols/src/protocols/foundation/mcp-permissions.js',
  content: `# MCP Permissions Configuration Protocol v1.0.0

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: Adding a new MCP server to the system
- **WHEN**: A tool requires repeated permission clicks and is read-only
- **WHEN**: Configuring tool auto-approval settings
- **WHEN**: User complains about too many permission prompts
- **PRIORITY**: Foundation (Tier 2)

## Core Principle
Read-only tools that don't modify state should be auto-approved.
Write tools should require explicit approval each time.

---

## IMMUTABLE - Permission Categories

### Auto-Approve (Read-Only)
These tool patterns should be added to allow list:
- \`*_status\` - Status checks
- \`*_list\` - List operations
- \`*_get\` - Get/read operations
- \`*_search\` - Search operations
- \`*_help\` - Help documentation
- \`*_info\` - Information retrieval
- \`*_stats\` - Statistics
- \`*_check\` - Validation checks

### Require Approval (Write Operations)
These should NOT be auto-approved:
- \`*_create\` - Creation operations
- \`*_delete\` - Deletion operations
- \`*_update\` - Update operations
- \`*_set\` - State setting (exception: mikey_state_set if trusted)
- \`*_write\` - Write operations
- \`*_execute\` - Code execution
- \`*_push\` - Git push operations

---

## IMMUTABLE - Configuration Location

Settings file: \`~/.claude/settings.local.json\`

Structure:
\`\`\`json
{
  "permissions": {
    "allow": [
      "mcp__<server-name>__<tool-name>",
      "mcp__<server-name>__<tool-name>"
    ]
  }
}
\`\`\`

---

## EDITABLE - Adding New Permissions

### Step 1: Identify Read-Only Tools
When adding a new MCP server, list all its tools and categorize:
- Read-only → add to allow list
- Write/modify → leave out (require approval)

### Step 2: Format Tool Names
Pattern: \`mcp__<server-name>__<tool-name>\`

Examples:
- \`mcp__mikey-brain__mikey_status\`
- \`mcp__mikey-protocols__mikey_protocol_read\`
- \`mcp__mcp-architecture__arch_get_document\`

### Step 3: Update Settings File
Edit ~/.claude/settings.local.json and add to the allow array.

### Step 4: Restart Claude Code
Changes take effect after restart.

---

## EDITABLE - Current Approved Servers

### mikey-brain (read-only tools)
- mikey_status, mikey_recall, mikey_recent, mikey_stats, mikey_help
- mikey_state_get, mikey_state_list
- mikey_graduation_track, mikey_graduation_status
- mikey_trigger_analyze, mikey_trigger_suggest
- mikey_reflections, mikey_review_proposals, mikey_reflect

### mikey-protocols (read-only tools)
- mikey_protocol_list, mikey_protocol_read, mikey_protocol_search
- mikey_protocol_index, mikey_protocol_triggers
- mikey_protocol_check_immutable
- mikey_protocol_chunk_start, mikey_protocol_chunk_status
- mikey_protocol_harness_stats, mikey_protocol_harness_heatmap
- mikey_protocol_harness_graduation, mikey_protocol_help

### mcp-architecture (read-only tools)
- arch_find_document, arch_list_architecture
- arch_cross_reference, arch_get_document
- arch_get_template, help

### project-finder (all read-only)
- list_projects, find_project, project_info
- recent_projects, project_finder_help

### smart-help (all read-only)
- smart_help, smart_help_status, help

---

## When NOT to Auto-Approve

Even if a tool seems safe, don't auto-approve if:
1. It modifies any state or files
2. It executes arbitrary code
3. It makes network requests that change data
4. It interacts with external APIs in write mode
5. User hasn't explicitly trusted the server

---

## Related Protocols
- naming-linter - Ensures consistent tool naming
- architecture-update - Update docs when adding servers

---
**Status**: Active - v1.0.0`
};
