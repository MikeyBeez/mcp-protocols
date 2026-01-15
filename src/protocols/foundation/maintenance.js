// Maintenance Protocol - Proactive system health and documentation upkeep
module.exports = {
  id: 'maintenance',
  name: 'System Maintenance Protocol',
  version: '1.0.0',
  tier: 1,
  purpose: 'Track and prompt for periodic system maintenance: audits, documentation updates, and health checks',
  triggers: [
    'Session start (check if maintenance is due)',
    'User asks about system health',
    'User mentions "maintenance" or "housekeeping"',
    'After significant system changes',
    'Weekly check during normal work'
  ],
  status: 'active',
  location: '/Users/bard/Code/mcp-protocols/src/protocols/foundation/maintenance.js',
  content: `# System Maintenance Protocol v1.0.0

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: Session starts (passive check via mikey_init)
- **WHEN**: User asks about system health or maintenance
- **WHEN**: After making significant system changes (new MCP servers, protocols, architecture changes)
- **WHEN**: 7+ days since last audit
- **IMMEDIATE**: No - can be deferred if user is busy
- **PRIORITY**: Medium (Tier 1) - important but not urgent

## Core Principle
"Proactive maintenance prevents reactive firefighting."

Regular maintenance keeps the system healthy. Rather than waiting for things to break, we check periodically and fix small issues before they compound.

## IMMUTABLE - Maintenance Schedule

### Daily (Automatic)
- Session status updated at session end
- No manual action required

### Weekly (Prompted)
- System audit (6 categories)
- Documentation review
- Memory cleanup check

### After Changes (Event-Driven)
- Update architecture docs after adding/moving components
- Update CLAUDE.md after protocol changes
- Update user docs after feature changes

## Maintenance State Tracking

Store in brain memory:
\`\`\`
mikey_remember
  key="maintenance_last_audit"
  value="2026-01-14"
  type="system"

mikey_remember
  key="maintenance_last_doc_review"
  value="2026-01-14"
  type="system"
\`\`\`

## EDITABLE - Maintenance Check Workflow

### Step 1: Check Maintenance State
At session start or when prompted:
\`\`\`
mikey_recall query="maintenance_last"
\`\`\`

### Step 2: Evaluate What's Due
- Last audit > 7 days ago? → Suggest audit
- Last doc review > 7 days ago? → Suggest doc review
- Recent system changes? → Suggest targeted updates

### Step 3: Propose Maintenance (If Due)
Notify user concisely:
"It's been [N] days since last system audit. Want me to run one? (Takes ~5 min)"

If user declines, don't nag. Note it and check again next session.

### Step 4: Execute Maintenance
If user approves:
1. Run system-audit protocol
2. Review and update stale documentation
3. Update maintenance timestamps
4. Report findings

## Maintenance Tasks

### System Audit (Weekly)
Run the system-audit protocol:
- MCP server health
- CLAUDE.md compliance
- Protocol availability
- Working files
- Memory system
- Active inference

### Documentation Review (Weekly)
Check these files for staleness:
- session-status.md (should reflect recent work)
- MIKEY_AGENT_ARCHITECTURE.md (should match actual system)
- USER_GUIDE.md (should cover current features)
- QUICK_REFERENCE.md (should be accurate)
- TROUBLESHOOTING.md (should include recent issues)

### Memory Cleanup (Monthly)
- Check memory count (mikey_stats)
- Review old/stale memories if count is high
- Archive or remove obsolete entries

## Post-Maintenance Actions

After completing maintenance:
1. Update maintenance timestamps in memory
2. Update session-status.md with maintenance summary
3. Note any issues found for follow-up

## Quality Checks

Before marking maintenance complete:
- ✅ All audit categories checked
- ✅ Documentation reviewed for accuracy
- ✅ Timestamps updated in memory
- ✅ session-status.md updated
- ✅ Any critical issues addressed

## Anti-Patterns to Avoid

- **Nagging**: Don't repeatedly ask about maintenance if user declines
- **Blocking work**: Maintenance is important but not urgent - don't interrupt active tasks
- **Skipping updates**: After maintenance, always update the timestamps
- **Surface checks**: Actually verify things work, don't just check existence

## Integration with Other Protocols

- **system-audit**: Primary audit protocol
- **architecture-update**: Triggered when docs are stale
- **active-inference**: Learn from maintenance findings

---
**Status**: Active Foundation Protocol - v1.0.0
**Memory Keys**: maintenance_last_audit, maintenance_last_doc_review`
};
