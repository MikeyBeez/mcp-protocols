# MCP Permissions Configuration Protocol

## Metadata
- **ID**: mcp-permissions
- **Version**: 1.1.0
- **Tier**: 2 (Foundation Operational)
- **Status**: active
- **Purpose**: Decide which MCP tools get auto-approved and wire it correctly in `~/.claude/settings.local.json`, so read-only tools stop prompting on every call while write/destructive tools always require an explicit human OK.
- **Created**: 2026-06-23 (ported from the legacy `src/protocols/foundation/mcp-permissions.js`, v1.0.0; the stale "Current Approved Servers" inventory was dropped on port — the policy and settings mechanics are the durable part).
- **Source**: Mikey's `~/.claude/settings.local.json` auto-approve practice across his MCP servers.

## Purpose
Set MCP tool permissions by a simple, safe rubric: a tool that only READS state may be auto-approved; a tool that WRITES, DELETES, EXECUTES, or PUSHES must require approval every time. The mechanics — the exact `settings.local.json` allow-list structure and the `mcp__<server>__<tool>` naming — are easy to get wrong, so this protocol pins them. The goal is fewer needless prompts without ever auto-approving an irreversible action.

## Core Principle

**Read-only auto-approves. Anything that changes state asks first.**

The cost of a wrong auto-approve is asymmetric: an extra click on a read tool is mild friction; an auto-approved `*_delete` or `*_push` is an irreversible action you never saw. When unsure, leave it OUT of the allow-list.

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: adding a new MCP server and deciding what to auto-approve.
- **WHEN**: a read-only tool prompts for permission on every call and it's annoying.
- **WHEN**: editing `~/.claude/settings.local.json` or the `permissions.allow` list.
- **WHEN**: the user complains about too many permission prompts.
- **Trigger keywords**: permission, permissions, auto-approve, approve, allow list, allowlist, settings.local.json, settings file, prompt, prompts, read-only, write tool, mcp permissions, trust tool, whitelist, mcp__.

## Decision Rubric (by tool suffix)
**Auto-approve (read-only):** `*_status`, `*_list`, `*_get`, `*_search`, `*_help`, `*_info`, `*_stats`, `*_check`, `*_read`, `*_recall`, `*_recent`.

**Require approval (mutating):** `*_create`, `*_delete`, `*_update`, `*_write`, `*_execute`, `*_push`, `*_set` (exception: a trusted state-setter like `mikey_state_set` may be approved deliberately).

When a tool's suffix doesn't make its read/write nature obvious, read what it does before deciding — default to require-approval.

## Configuration Mechanics
File: `~/.claude/settings.local.json`. Structure:
```json
{
  "permissions": {
    "allow": [
      "mcp__<server-name>__<tool-name>",
      "mcp__<server-name>__<tool-name>"
    ]
  }
}
```
Tool name pattern in the allow-list: `mcp__<server-name>__<tool-name>` (double underscores), e.g. `mcp__mikey-brain__mikey_recall`, `mcp__mikey-protocols__mikey_protocol_read`.

## Steps
1. **List the new server's tools** and split them read-only vs. mutating by the rubric above.
2. **Format each read-only tool** as `mcp__<server>__<tool>`.
3. **Add them** to the `permissions.allow` array in `~/.claude/settings.local.json`.
4. **Leave mutating tools out** — they'll prompt, which is correct.
5. **Restart** Claude Desktop / Code for the change to take effect.

## Never auto-approve, even if it looks safe, if the tool:
1. modifies any state or files,
2. executes arbitrary code,
3. makes network requests that change data,
4. writes to an external API,
5. lives on a server the user hasn't explicitly chosen to trust.

## Anti-Patterns to Avoid
- 🚫 **Auto-approving a `*_set`/`*_write`/`*_push`** to save a click — that's the click that matters.
- 🚫 **Guessing read/write from the name alone** when the suffix is ambiguous — verify behavior first.
- 🚫 **Hand-editing without a restart** then concluding it "didn't work."
- 🚫 **Maintaining a server inventory in the protocol** — it goes stale; the live source of truth is `settings.local.json` itself.

## Quality Checks
- ✅ Is every auto-approved tool genuinely read-only?
- ✅ Did I format names as `mcp__<server>__<tool>`?
- ✅ Did I leave every mutating tool out of the allow-list?
- ✅ Did I restart so the change takes effect?

---

**Remember**: friction on reads is cheap; an unseen write is not. The allow-list is for tools that can only look, never touch.

**Status**: Active — Foundation Operational Protocol

## Related Protocols
[[naming-linter]] · [[github-anonymization]] · [[tool-selection]]
