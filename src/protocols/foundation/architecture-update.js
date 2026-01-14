// Architecture Update Protocol - Maintain living documentation
module.exports = {
  id: 'architecture-update',
  name: 'Architecture Update Protocol',
  version: '1.0.0',
  tier: 1,  // Critical system protocol - impacts all other work
  purpose: 'Ensure architectural documentation stays synchronized with system changes',
  triggers: [
    'Created a new project or MCP tool',
    'Moved or relocated a system component',
    'Changed file paths or directory structure',
    'Added a new MCP server',
    'Deprecated or removed a system',
    'Changed how a system is accessed',
    'Modified protocol registry',
    'Updated system configuration paths'
  ],
  status: 'active',
  location: '/Users/bard/Code/mcp-protocols',
  content: `# Architecture Update Protocol v1.0.0

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: Created a new project, tool, or MCP server
- **WHEN**: Moved, renamed, or relocated any system component
- **WHEN**: Changed directory structure or file paths
- **WHEN**: Added, modified, or deprecated a protocol
- **WHEN**: Changed configuration file locations
- **WHEN**: Modified how systems integrate with each other
- **PRIORITY**: Critical (Tier 1) - Stale docs cause future errors

## Core Principle
"Living architecture" - Documentation must reflect reality. Stale documentation
is worse than no documentation because it causes trust erosion and wasted time.

---

## IMMUTABLE - What Must Be Updated

### After Creating New Projects
1. **Master Architecture Index** (if significant project)
   - Location: Obsidian vault or arch_get_document master-architecture-index
   - Add project with description, location, and integration points

2. **System Paths Reference** (virtual doc in mcp-architecture)
   - Location: /Users/bard/Code/mcp-architecture/src/index.js
   - Add to appropriate section of system-paths document

3. **MCP Tools Registry** (if MCP tool)
   - Location: /Users/bard/Code/mcp-architecture/src/index.js
   - Add to mcp-tools-registry virtual document

### After Moving/Relocating Systems
1. Update ALL references to old path:
   - system-paths virtual document
   - Any protocols that reference the path
   - Any tools that have hardcoded paths
   - README files
   - Configuration files

2. Search for hardcoded paths:
   \`\`\`
   grep -r "old/path" /Users/bard/Code/
   \`\`\`

### After Adding New Protocols
1. **Protocol Registry**
   - /Users/bard/Code/mcp-protocols/src/registry.js

2. **Protocol Triggers Reference**
   - mcp-architecture virtual doc: protocol-triggers

3. **Protocol System Guide**
   - Update protocol count in protocol-system-guide

### After Adding New MCP Tools
1. **MCP Tools Registry**
   - /Users/bard/Code/mcp-architecture/src/index.js (mcp-tools-registry)

2. **Claude Settings** (if read-only tool needing auto-approval)
   - /Users/bard/.claude/settings.local.json

---

## IMMUTABLE - Architecture Update Checklist

When you modify the system, go through this checklist:

\`\`\`
[ ] Did I create something new?
    → Update Master Architecture Index
    → Update system-paths in mcp-architecture

[ ] Did I move something?
    → Update ALL path references
    → Search for hardcoded paths
    → Update any configs

[ ] Did I add an MCP tool?
    → Update mcp-tools-registry
    → Update Claude settings.local.json if read-only
    → Add to relevant protocol triggers

[ ] Did I add a protocol?
    → Update registry.js imports and PROTOCOLS
    → Update MASTER_PROTOCOL_INDEX in registry.js
    → Update protocol-triggers in mcp-architecture
    → Update protocol-system-guide protocol count

[ ] Did I change how something is accessed?
    → Update all documentation showing old access method
    → Update any protocols that describe access
\`\`\`

---

## EDITABLE - Locations to Update

### Primary Architecture Documents
| Document | Location | Update When |
|----------|----------|-------------|
| Master Architecture Index | Obsidian vault | New significant systems |
| system-paths | mcp-architecture/src/index.js | Any path changes |
| mcp-tools-registry | mcp-architecture/src/index.js | New MCP tools |
| protocol-system-guide | mcp-architecture/src/index.js | Protocol changes |
| protocol-triggers | mcp-architecture/src/index.js | New protocols |
| Protocol Registry | mcp-protocols/src/registry.js | Protocol add/remove |

### Secondary Documentation
| Document | Location | Update When |
|----------|----------|-------------|
| Claude settings | ~/.claude/settings.local.json | New read-only tools |
| Project README | Each project | Significant changes |
| ARCHITECTURE.md | Projects with them | Structural changes |

---

## EDITABLE - Integration with Tools

### Tools That Should Trigger This Protocol

These tools modify the system and should remind about architecture updates:

1. **mikey_create_project** - Creates new projects
   - Reminder: "Don't forget to update Master Architecture Index if this is a significant project"

2. **mikey_create_research** - Creates research projects
   - Same reminder as above

3. **Any file move operations** - If moving system components
   - Reminder: "Update system-paths and search for hardcoded path references"

4. **Protocol creation** - When new protocols are added
   - Reminder: "Update protocol-triggers and protocol-system-guide in mcp-architecture"

---

## EDITABLE - Quick Commands

### Check Architecture Server Content
\`\`\`
arch_get_document system-paths
arch_get_document mcp-tools-registry
arch_get_document protocol-system-guide
arch_get_document protocol-triggers
\`\`\`

### Find Hardcoded Paths
\`\`\`bash
grep -r "/Users/bard/Code/specific-project" /Users/bard/Code/mcp-*/
\`\`\`

### Edit Architecture Server
\`\`\`
/Users/bard/Code/mcp-architecture/src/index.js
\`\`\`
Look for ARCHITECTURAL_DOCS object and update virtual documents.

---

## Why This Matters

**The cost of stale documentation:**
- Time wasted searching for things that moved
- Errors from using outdated paths
- Trust erosion ("the docs are always wrong")
- New sessions start confused
- Protocols reference non-existent locations

**The value of living architecture:**
- AI can find anything instantly
- New conversations start productive
- Protocols remain accurate
- System is self-documenting
- Changes are tracked

---

## Quick Reference

**Trigger**: System modification (create, move, add, change)
**Action**: Update relevant architecture docs
**Primary locations**: mcp-architecture/src/index.js, mcp-protocols/src/registry.js
**Verification**: Use arch_get_document to confirm updates

---
**Status**: Active - v1.0.0
**Related**: protocol-writing, create-project, naming-linter`
};
