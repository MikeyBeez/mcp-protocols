# Naming Linter Protocol

## Metadata
- **ID**: naming-linter
- **Version**: 1.1.0
- **Tier**: 2 (Foundation Operational)
- **Status**: active
- **Purpose**: Keep every custom MCP tool and server under the `mikey_`/`mikey-` namespace so nothing collides with Anthropic's built-in tools (Bash, search, help, ...) or another server's tools. A name collision is a silent runtime failure — the wrong tool answers, or the server won't load.
- **Created**: 2026-06-23 (ported from the legacy `src/protocols/foundation/naming-linter.js`, v1.0.0; commands re-verified against `~/Code/mikey-naming-registry/package.json` on port).
- **Source**: the `mikey-naming-registry` linter (`~/Code/mikey-naming-registry/lint.js` + `registry.json` + `PROTOCOL.md`), Mikey's canonical naming authority.

## Purpose
Prevent MCP tool-name collisions. **CORRECTED 2026-08-19 — the rule this protocol used to enforce is dead.** It required a `mikey_` prefix on every custom tool. The system abandoned that in June 2026 when the brain server was rewritten as mcp-brain-lean and its tools became `brain_*` deliberately; `tool-contract.json` records the rename. The old rule would now flag the system's own correct names as violations. The PURPOSE survives — collisions are real — but the prescribed fix does not. Run the registry linter before committing any MCP server change, and namespace every new tool/server at creation time. This is operational: the failure it prevents (collision) shows up at runtime as the wrong tool firing or a server failing to register, not as a lint warning you can ignore.

## Core Principle

**Namespace by SERVER DOMAIN, and never ship a bare generic name.**

The live convention is a domain prefix matching the server: `brain_*`, `git_*`, `db_*`, `safe_*`, `arch_*`, `continuation_*`, `task_*`, `mikey_protocol_*`. Not a personal prefix — a functional one. A tool called `search` or `execute` is the hazard; `brain_search` is fine.

**Live violation to fix:** `help` is exposed by NINE servers (advanced-math-tools, database, decomposer, filesystem-enhanced, git, mcp-architecture, mcp-github-research, random, reasoning-tools, smalledit, system). It only works today because the client prefixes by server name. It breaks the moment anything fronts these servers behind one gateway. Rename to `<domain>_help`.

Generic names (`search`, `analyze`, `execute`, `help`, `init`, `run`, `get`, `list`) overlap with built-ins or with each other. A domain prefix is what makes a tool unambiguous. (`brain_*` was listed here as a name to AVOID — that was written before it became the system's own convention. Fixed 2026-08-19.)

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: creating a new MCP server, or adding/renaming a tool on an existing one.
- **WHEN**: about to commit changes to any MCP tool code (lint first).
- **WHEN**: reviewing MCP server code, or starting work on any file under `mcp-*` / `claude-*`.
- **WHEN**: a tool name "doesn't resolve", the wrong tool answers, or a server fails to register — suspect a collision.
- **Trigger keywords**: naming, namespace, prefix, mikey_, mikey-, MCP tool, MCP server, tool name, rename, collision, collide, reserved, registry, lint, linter, naming-registry, register tool, new server, new tool, add tool, mcp__.

## Naming Rules
| Type | Prefix | Pattern | Example |
|------|--------|---------|---------|
| Tools | `mikey_` | `mikey_<noun>_<verb>` | `mikey_state_get` |
| Servers | `mikey-` | `mikey-<purpose>` | `mikey-brain` |
| Protocol tools | `mikey_protocol_` | `mikey_protocol_<action>` | `mikey_protocol_read` |

**Forbidden bare prefixes (high collision risk — always add `mikey_`):** `brain_`, `state_`, `manager_`, `protocol_`, `execute`, `help`, `init`, `search`, `analyze`.

## Steps

### Commands (run from the registry)
```bash
cd ~/Code/mikey-naming-registry
node lint.js /path/to/file-or-dir   # check one file or directory
npm run lint                        # scan all registered servers (node lint.js --scan-all)
npm run report                      # compliance report (node lint.js --report)
```
Registry of canonical names: `~/Code/mikey-naming-registry/registry.json`.

### When creating a new TOOL
1. Choose a `mikey_<noun>_<verb>` name.
2. Check for conflicts: grep `registry.json` for the proposed name.
3. Implement it.
4. `node lint.js /path/to/your/file.js`.
5. If it passes, add it to `registry.json`.

### When creating a new SERVER
1. Name it `mikey-<purpose>`; add a server entry to `registry.json`.
2. Add it to the Claude Desktop / Code config.
3. Implement tools under the naming convention.
4. `npm run lint` before deploying.

### Error resolution
- *"Tool uses reserved prefix"* → rename `brain_foo` → `mikey_foo`.
- *"High collision risk"* → add the `mikey_` prefix.
- *"Not in canonical registry"* → add the tool to `registry.json`.

## Examples
- Adding a status tool to a new server: name it `mikey_<server>_status`, not `status` (which collides with everything). Lint, then register.
- The telemetry/harness buildout (2026-06) added several MCP tools — each shelled-out server tool kept the `mikey_`/server-scoped prefix so the live matcher and Desktop config resolved them unambiguously.

## Anti-Patterns to Avoid
- 🚫 **Bare generic names** — `search`, `analyze`, `execute`, `help` on a custom tool. Collision with built-ins.
- 🚫 **Skipping the lint before commit** — the collision surfaces at runtime, not in code review.
- 🚫 **Implementing without registering** — an unregistered name drifts out of the canonical set and the next tool can duplicate it.
- 🚫 **`brain_`/`state_` prefixes** — reserved-looking; always `mikey_`-wrap.

## Quality Checks
- ✅ Does every new tool start with `mikey_` (or `mikey_protocol_`) and every server with `mikey-`?
- ✅ Did I grep `registry.json` for the name before implementing?
- ✅ Did `node lint.js` / `npm run lint` pass before committing?
- ✅ Is the new name added to `registry.json`?

---

**Remember**: the collision is silent until it isn't. Lint before you commit, namespace before you implement.

**Status**: Active — Foundation Operational Protocol

## Related Protocols
[[mcp-permissions]] · [[mcp-server-shellout-hardening]] · [[continuous-documentation]]
