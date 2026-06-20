# Tool Selection Protocol

## Metadata
- **ID**: tool-selection
- **Version**: 2.0.0
- **Tier**: 2 (Foundation)
- **Status**: active
- **Purpose**: Select the correct tool for file access and command execution across BOTH the Cowork desktop environment and classic Claude Code/desktop sessions. Never give up reaching Mikey's Mac just because a built-in tool is sandboxed.
- **Created**: 2025-11-02
- **Updated**: 2026-06-09 (rewrite: brain_execute removed; added Cowork enhanced-FS / system_exec fallbacks)

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: Need to read/write a file anywhere under `/Users/bard` or `/Volumes`
- **WHEN**: Need to execute a shell command in Mikey's REAL environment (his Mac, his LAN, his CLI tools, his SSH)
- **WHEN**: A built-in tool fails with "outside connected folders", "cannot access", "No such file or directory", "command not found", or has no route to the LAN
- **WHEN**: About to tell Mikey "I can't reach that file/host" or to ask him to paste a file — STOP and check the fallbacks below first
- **PRIORITY**: Critical
- **Trigger keywords**: file, files, read, write, edit, open, log, logs, path, folder, directory, filesystem, command, execute, run, shell, bash, ssh, remote, pop, pop-os, mac, gpu, box, server, config, cannot, access, reach, paste, brain_execute, system_exec, enhanced.

## Core Principle (2026-06)

**The built-in Read/Write/Edit tools and the default bash are SANDBOXED. They are NOT Mikey's Mac. When they can't reach something, switch to the MCP servers that run ON the Mac — don't conclude it's impossible.**

Two execution contexts exist; the same instinct applies to both:

| Context | Built-ins (fenced/sandboxed) | Reach the real Mac via |
|---|---|---|
| **Cowork desktop** | `Read`/`Write`/`Edit` (only connected folders), `mcp__workspace__bash` (isolated cloud VM, no LAN route) | `filesystem-enhanced` (files), `system` → `system_exec` (commands) |
| **Classic Claude Code** | container bash | `system_exec` / filesystem MCP |

> **DEPRECATED:** `brain_execute` no longer exists. `brain-unified` was removed and replaced by `mcp-brain-lean` (memory-only: init/remember/recall/search/recent/forget/reflect/stats). Do not look for `brain_execute` — use `system_exec` instead.

## Decision Tree

```
Need to touch a FILE under /Users/bard or /Volumes?
│  └─ Built-in Read/Write failed ("outside connected folders")?
│       → use filesystem-enhanced: read_text_file / write_file /
│         edit_file / list_directory  (allowed roots: /Users/bard, /Volumes)
│
Need to RUN a command in Mikey's real environment?
│  └─ (git auth, npm/uv, ssh, launchctl, nvidia-smi, anything on his Mac/LAN)
│       → use system server: system_exec   (runs as user `bard` on Schmooey.local)
│
Pure throwaway compute, no Mac/LAN access needed?
     → mcp__workspace__bash (Cowork sandbox) is fine
```

## filesystem-enhanced (file access on the Mac)
- **Allowed roots**: `/Users/bard`, `/Volumes` (confirm with `list_allowed_directories`)
- **Reaches things the Cowork Read tool refuses**, e.g. `~/Library/Logs/Claude/*.log`, `~/.ssh/config`, `~/Library/Application Support/Claude/claude_desktop_config.json`, anything under `~/Code`.
- Key tools: `read_text_file` (supports `head`/`tail`), `write_file`, `edit_file`, `list_directory`, `search_files`, `get_file_info`.
- **Lesson learned 2026-06-09**: when asked to "look at the log", the built-in Read errored ("outside connected folders") but `filesystem-enhanced.read_text_file` read it instantly. Don't ask Mikey to paste files that live under an allowed root — just read them.

## system_exec (command execution on the Mac)
- Server `system`, tool `system_exec(command, cwd?, env?)`. Runs on `Schmooey.local` as user `bard`.
- This is the executor that replaced `brain_execute`. Use it for: git w/ auth, `gh`, `npm`, `uv`, `launchctl`, diagnostics (`ping`, `arp`, `nc`), and **SSH to the GPU box**.
- Per Mikey's standing preference: *don't tell me what to run — just run it.*

### SSH to the Pop!_OS / RTX 5070 Ti box
```
system_exec(command="ssh bard@192.168.12.174 'nvidia-smi'")
```
- **Authoritative invocation (Mikey, 2026-06-09): `ssh bard@192.168.12.174`.**
- The `~/.ssh/config` block (`Host pop-os Pop` → 192.168.12.175, User bee) is STALE / case-sensitive (`pop` ≠ `Pop`). Prefer `bard@192.168.12.174`.
- If it times out: check the box is online — `ping -c2 192.168.12.174`, `arp -n 192.168.12.174` (an `incomplete` ARP entry = host not on the LAN, i.e. powered off/asleep or DHCP moved it).

## Anti-Patterns to Avoid
- 🚫 **The Sandbox Surrender** — concluding a file/host is unreachable because the built-in tool was fenced, without trying filesystem-enhanced / system_exec.
- 🚫 **The Paste Request** — asking Mikey to paste a file that sits under `/Users/bard` (just read it).
- 🚫 **The Ghost Tool** — reaching for `brain_execute` (gone) instead of `system_exec`.
- 🚫 **The Path Assumer** — assuming Cowork sandbox paths (`/sessions/.../mnt/...`) equal Mac paths (`/Users/bard/...`).

## Quality Checks
- ✅ Tried filesystem-enhanced before saying a file is unreachable
- ✅ Used system_exec (not a sandboxed bash) for anything needing the real Mac/LAN
- ✅ Used `ssh bard@192.168.12.174` (not the stale config alias)
- ✅ Did NOT ask Mikey to do something a tool could do

---

**Remember**: built-ins are fenced; the MCP servers run on the Mac. When a built-in says "can't", the answer is almost always filesystem-enhanced (files) or system_exec (commands).

**Status**: Active - Critical Foundation Protocol
