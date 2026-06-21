# MCP Server Shell-Out Hardening Protocol

## Metadata
- **ID**: mcp-server-shellout-hardening
- **Version**: 1.0.0
- **Tier**: 2 (Foundation Operational)
- **Status**: active
- **Purpose**: Build MCP servers (and other launchd/Desktop-spawned long-running processes) that shell out to CLI tools or write to a database WITHOUT silent failures — especially the class of bug where everything works in dev but the writes silently no-op after a real restart.
- **Created**: 2026-06-21
- **Source**: harness telemetry buildout, 2026-06-20 (Cowork) — the ledger / tap / in-server-hook work and its 50-assertion test suite. See brain notes telemetry-suite-green-mercury-repointed-2026-06-20, telemetry-architecture-decision-2026-06-20, mcp-tap-built-2026-06-20, enforcement-phase4-built-2026-06-20.

## Purpose
Make MCP servers that spawn CLI tools (sqlite3, git, python, node) or write telemetry/data robust against silent, restart-only failures. Catch the bugs that never show up in an interactive terminal but break the moment Claude Desktop / launchd respawns the server with a different environment, so observability and side-effect writes actually land in production.

## Trigger Conditions (MUST ACTIVATE)
- **WHEN** writing or editing an MCP server that shells out to a CLI tool (sqlite3, git, gh, python3, node) via execFile / exec / spawn / subprocess.
- **WHEN** an MCP server or a launchd/LaunchAgent process writes to a SQLite file, a ledger, spans, telemetry, or logs.
- **WHEN** "it works when I run it by hand / in dev, but does nothing after a Desktop restart" — a silent no-op that only appears after restart.
- **WHEN** debugging a best-effort / try-catch-swallowed write that seems to drop rows (UNIQUE constraint failed, database is locked).
- **WHEN** building a test harness or smoke test for an MCP server.
- **Trigger keywords**: mcp server, mcp, server, shell out, shellout, subprocess, execFile, exec, spawn, stdio, json-rpc, sqlite, sqlite3, database, ledger, span, spans, telemetry, write, writes, no-op, silent, silently, fails, failure, restart, launchd, launchagent, plist, PATH, absolute path, binary, busy_timeout, unique constraint, locked, best-effort, swallow, test harness, smoke test, hook, wrapper, tap.

## Core Principle

**The environment that spawns your server at restart is NOT your shell. Resolve every binary to an absolute path, never trust an inherited PATH, and never let a best-effort write swallow the error that proves it failed.**

## Hardening Rules

### 1. Absolute paths for every shelled-out binary
A Desktop/launchd-spawned MCP server inherits a MINIMAL env PATH — usually not your interactive `$PATH`. A bare `sqlite3` / `git` / `python3` resolves fine in your terminal and in a hand-run test, then **silently fails to launch after a real restart** (command-not-found → caught → no-op).
- Resolve to the absolute path: `/usr/bin/sqlite3`, `/opt/homebrew/bin/python3`, `/opt/homebrew/bin/node`, etc. (confirm with `which <tool>`).
- This bit the harness: bare `sqlite3` worked in dev and would have made every ledger write a silent no-op after restart. Fixed by pinning `/usr/bin/sqlite3`.

### 2. Best-effort writes must still surface failures somewhere
Off-the-data-path writes are correctly wrapped so they NEVER throw into the caller — but a blanket swallow also hides real bugs (UNIQUE constraint, locked DB).
- Construct unique ids so they cannot collide: do NOT truncate the key the id derives from. (Harness bug: span id `sp-<slug(trace_id)>-<seq>` truncated `trace_id` to 24 chars, chopping the hex suffix → two traces in the SAME SECOND produced identical span ids and the 2nd write silently failed.)
- For concurrent writers, set `PRAGMA busy_timeout=3000` so lock contention retries instead of dropping the row.
- During development, log swallowed errors (even to stderr) so you can SEE them. Keep the swallow on the data path; add visibility.

### 3. Degrade safe, not silent, on optional dependencies
If the server optionally imports a logging/telemetry helper, a missing or broken helper must disable logging but still BOOT the load-bearing server. Pattern used in the lean servers: `let noteCall = () => {}; try { ({ noteCall } = await import('../harness/ledger_log.mjs')); } catch {}`. Never let an observability add-on take down the real server. (And never wrap `system` / `filesystem-enhanced` themselves — never risk self-repair tooling.)

### 4. Test the REAL on-disk server, spawned the way Desktop will
An in-process unit test of your functions does NOT catch PATH/env/restart bugs. The test harness that caught the bugs above:
- Spawns the REAL server binary with the SAME interpreter Desktop uses (e.g. `/opt/homebrew/bin/node`), env-pointed at a THROWAWAY copy of the DB (never the live one).
- Drives it over real JSON-RPC: `initialize` → `tools/list` → `tools/call`.
- Asserts each call wrote the expected DB row — not just "returned ok".
- Covers failure modes too: malformed input, junk args, skip-when-no-open-turn, and transparency (a stdio wrapper must forward bytes byte-for-byte; `initialize` serverInfo and `tools/list` must be identical wrapped vs. unwrapped).
- Run example: `node ~/Code/harness/test_suite.mjs` → must be fully green BEFORE relying on a restart to activate changes.

### 5. On-disk edits activate on the NEXT restart, not now
Editing the server file does not change the RUNNING process — Desktop/launchd loaded it at launch. In-server hooks and config-wired wrappers take effect only when the server is next spawned. Say "activates on next restart" in the brain note and record a post-restart verification query.

## Examples
- **PATH bug**: `execFile('sqlite3', [...])` works in dev, no-ops after restart → `execFile('/usr/bin/sqlite3', [...])`. ✅
- **Collision bug**: `id = 'sp-' + slug(traceId).slice(0,24) + '-' + seq` → two same-second traces collide and the 2nd write is silently dropped → use the FULL untruncated slug. ✅
- **Verify after restart** (harness ledger): `sqlite3 ~/Code/harness/ledger.db "SELECT name,COUNT(*) FROM spans WHERE json_extract(meta,'$.via')='tap' GROUP BY name;"` should show rows.
- **Safe rollout**: back up `claude_desktop_config.json` before wrapping servers (`*.bak-<ts>`); confirm all servers still parse; keep an `unwrap-all` escape hatch.

## Anti-Patterns to Avoid
- 🚫 **Bare-binary trust** — calling `sqlite3` / `git` / `python3` by name from a spawned server, assuming the restart env has them on PATH.
- 🚫 **Silent swallow** — try/catch that drops every error, so a UNIQUE / locked failure looks like success.
- 🚫 **Truncated unique keys** — slicing the id source so same-second / same-prefix records collide.
- 🚫 **In-process-only tests** — testing functions you import, never the spawned server, so PATH/env/restart bugs survive to production.
- 🚫 **Testing against the live DB** — always point tests at a throwaway copy/backup.
- 🚫 **Assuming edits are live** — forgetting the running process predates your edit; changes need a restart.

## Quality Checks
- ✅ Every shelled-out binary is an absolute path (`which`-confirmed).
- ✅ Unique ids can't collide (no truncation of the source key); `busy_timeout` set for concurrent writers.
- ✅ Optional telemetry import can fail without taking down the server.
- ✅ A test harness spawns the real server over JSON-RPC against a throwaway DB and asserts rows landed — and it's green.
- ✅ The brain note says "activates on next restart" and records a post-restart verification query.

---

**Status**: Active — Foundation Operational Protocol

## Related Protocols
[[tool-auto-repair]] · [[code-review]] · [[verification-loop]]
