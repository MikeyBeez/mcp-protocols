// System Audit Protocol - Modular data file
module.exports = {
  id: 'system-audit',
  name: 'System Audit Protocol',
  version: '1.0.0',
  tier: 1,
  purpose: 'Systematically compare expected system behaviors against actual implementation to identify gaps',
  triggers: [
    'User requests a system audit',
    'Discovering multiple behaviors that do not work as documented',
    'After making significant changes to system configuration',
    'Periodic health check (monthly recommended)',
    'Before major refactoring or upgrades'
  ],
  status: 'active',
  location: '/Users/bard/Code/mcp-protocols/src/protocols/foundation/system-audit.js',
  content: `# System Audit Protocol v1.0.0

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: User requests a system audit
- **WHEN**: Discovering multiple behaviors that don't work as documented
- **WHEN**: After making significant changes to system configuration
- **WHEN**: Periodic health check (monthly recommended)
- **WHEN**: Before major refactoring or upgrades
- **IMMEDIATE**: No - requires thorough analysis
- **PRIORITY**: High (Tier 1)

## Core Principle
"Documentation is aspiration; implementation is reality. The audit reveals the gap."

## IMMUTABLE - Audit Structure

### Phase 1: Extract Expected Behaviors
1. Read all configuration files (CLAUDE.md, system configs)
2. Read architectural documentation
3. Create exhaustive list of claimed behaviors
4. Categorize by type:
   - **Automatic**: Should happen without explicit invocation
   - **Tool-enforced**: Happens when tool is called
   - **Text instruction**: Relies on LLM following directions
   - **Manual**: Requires user action

### Phase 2: Trace Implementation
For each expected behavior:
1. Identify WHERE it should be implemented (tool code, config, prompt)
2. READ the actual implementation
3. Note any discrepancies between documented and coded behavior
4. Flag behaviors with NO implementation

### Phase 3: Test Reality
For each behavior:
1. Attempt to trigger it
2. Observe what actually happens
3. Document: WORKS / PARTIAL / GAP

### Phase 4: Gap Analysis Report
Produce table with columns:
- Expected Behavior
- Implementation Location
- Status (WORKS/PARTIAL/GAP)
- Gap Description
- Priority to Fix

### Phase 5: Recommendations
Prioritize fixes:
- **High**: Behaviors claimed but not implemented
- **Medium**: Behaviors that work inconsistently
- **Low**: Minor discrepancies

## EDITABLE - Audit Categories

### Configuration Files to Check
- ~/.claude/CLAUDE.md - Global Claude Code instructions
- Project CLAUDE.md files - Project-specific instructions
- MCP server configs - Tool behaviors
- Protocol definitions - Workflow expectations

### Common Gap Patterns
1. **Text vs Tool**: Instruction says to do X, but no tool enforces it
2. **Initialization gaps**: Session start behaviors not in init code
3. **Session end gaps**: Cleanup behaviors not automated
4. **Search hierarchy**: Documentation says one thing, habits differ
5. **Memory integration**: Tools exist but not auto-invoked

### Status Definitions
- **WORKS**: Tool-enforced or consistently happens
- **PARTIAL**: Tools exist but depend on LLM remembering
- **GAP**: Text instruction only, no enforcement

## Output Format

\`\`\`markdown
## System Audit Report
**Date**: [YYYY-MM-DD HH:MM TZ]

### Summary
| Category | Count | Percentage |
|----------|-------|------------|
| WORKS | N | X% |
| PARTIAL | N | X% |
| GAP | N | X% |

### Detailed Findings
| # | Expected Behavior | Implementation | Status | Gap |
|---|-------------------|----------------|--------|-----|
| 1 | ... | ... | ... | ... |

### Recommendations
**High Priority:**
1. ...

**Medium Priority:**
1. ...

**Low Priority:**
1. ...
\`\`\`

## Integration with Other Protocols

- **Architecture Update**: After audit, update docs to match reality or fix implementation
- **Protocol Error Correction**: Use audit findings to correct broken protocols
- **Active Inference**: Reflect on why gaps occurred
- **Protocol Graduation**: Audit identifies behaviors that should become tools

## Post-Audit Actions

1. File audit report in session-status.md
2. Create tasks for high-priority fixes
3. Update documentation if behavior won't be implemented
4. Schedule next audit (30 days recommended)

---
**Status**: Active Core Protocol - v1.0.0`
};
