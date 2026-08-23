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
- **WHEN**: Need to read/write a file anywhere under `~` or `/Volumes`
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
| **Cowork desktop** | `Read`/`Write`/`Edit` (only connected folders), `Bash` (built-in; isolated cloud VM, no LAN route — was `mcp__workspace__bash`) | `filesystem-enhanced` (files), `system` → `system_exec` (commands) |
| **Classic Claude Code** | container bash | `system_exec` / filesystem MCP |

> **DEPRECATED:** `brain_execute` no longer exists. `brain-unified` was removed and replaced by `mcp-brain-lean` (memory-only: init/remember/recall/search/recent/forget/reflect/stats). Do not look for `brain_execute` — use `system_exec` instead.

## Decision Tree

```
Need to touch a FILE under ~ or /Volumes?
│  └─ Built-in Read/Write failed ("outside connected folders")?
│       → use filesystem-enhanced: read_text_file / write_file /
│         edit_file / list_directory  (allowed roots: ~, /Volumes)
│
Need to RUN a command in Mikey's real environment?
│  └─ (git auth, npm/uv, ssh, launchctl, nvidia-smi, anything on his Mac/LAN)
│       → use system server: system_exec   (runs as user `bard` on Schmooey.local)
│
Pure throwaway compute, no Mac/LAN access needed?
     → `Bash` (Cowork sandbox, built-in) is fine
```

## Dispatching the pieces (added 2026-08-22)

Splitting a task and running the pieces are two decisions. Once you have pieces, send each
one to the cheapest place that can do it correctly. Mikey's standing preference, 2026-08-21:
**prefer ornith — he wants the speedup, and it is free.**

Take them in this order:

1. **ORNITH, via `simple_job` / `summarize` / `search_and_summarize` / `download`.**
   FIRST CHOICE whenever the piece can state its own check. Measured 2026-08-21: ~2.7x
   faster than doing it in context and 6.1x less context spent, because the raw material
   never enters the conversation. Works in BOTH Cowork and desktop chat — it is an MCP
   server, so it is the portable option. The server refuses work it cannot verify,
   deliberately.
   GOOD FOR: bulk reading, summarising, fetching, transcribing, extraction.
   NOT FOR: judgment calls, code that must be correct, file edits, or anything where being
   right matters more than being checkable. Measured limitation: ornith transcribes
   faithfully but does not interpret — it reproduced an ambiguous phrase verbatim instead
   of resolving it, and read a repo's star count as part of a bug report.

2. **A SUBAGENT (the Agent tool), when the piece needs judgment** rather than transcription,
   and its raw material should stay out of this context. Full Claude quality, costs tokens.
   AVAILABLE IN COWORK ONLY — there is no Agent tool in a desktop chat session, so never
   write a step that DEPENDS on it. Check, then fall back to ornith or to doing it here.

3. **DO IT YOURSELF** when the material is already in context (dispatching means shipping
   it back out for a round trip), when it is two steps, or when correctness beats
   checkability.

**Portability decides ties.** Ornith and every other MCP server work on both surfaces;
subagents do not. When a piece could go either way, ornith keeps the behaviour identical
wherever the session runs — which is why it is first here rather than second, independent
of cost.

## filesystem-enhanced (file access on the Mac)
- **Allowed roots**: `~`, `/Volumes` (confirm with `list_allowed_directories`)
- **Reaches things the Cowork Read tool refuses**, e.g. `~/Library/Logs/Claude/*.log`, `~/.ssh/config`, `~/Library/Application Support/Claude/claude_desktop_config.json`, anything under `~/Code`.
- Key tools: `read_text_file` (supports `head`/`tail`), `write_file`, `edit_file`, `list_directory`, `search_files`, `get_file_info`.
- **Lesson learned 2026-06-09**: when asked to "look at the log", the built-in Read errored ("outside connected folders") but `filesystem-enhanced.read_text_file` read it instantly. Don't ask Mikey to paste files that live under an allowed root — just read them.

## system_exec (command execution on the Mac)
- Server `system`, tool `system_exec(command, cwd?, env?)`. Runs on `Schmooey.local` as user `bard`.
- This is the executor that replaced `brain_execute`. Use it for: git w/ auth, `gh`, `npm`, `uv`, `launchctl`, diagnostics (`ping`, `arp`, `nc`), and **SSH to the GPU box**.
- Per Mikey's standing preference: *don't tell me what to run — just run it.*

### SSH to the Pop!_OS / RTX 5070 Ti box

> The local model on pop is **llama-server on 127.0.0.1:8080**, not 11434. Nothing listens
> on pop:11434. (The Mac's own ollama IS on 11434 — that part is unchanged and true.)
> See [[pop-access-canonical-2026-08-23]].
```
system_exec(command="ssh bard@192.168.x.x 'nvidia-smi'")
```
- **Authoritative invocation: `ssh bard@192.168.x.x`** (or the config alias `ssh pop-os`).
- ⚠️ STALE-CORRECTED 2026-08-23. This protocol previously asserted that the authoritative
  form was `user@192.168.x.x` and that the `~/.ssh/config` block was stale with `User bee`.
  BOTH halves were wrong, and the correction runs the opposite way to what was written:
  ground truth on 2026-08-23 is that `ssh user@...` FAILS with "Permission denied
  (publickey)", while the config block is CORRECT and current — `Host pop-os Pop` →
  HostName 192.168.x.x, **User bard**, IdentityFile ~/.ssh/id_rsa. The protocol was the
  stale thing, not the config. Canonical: [[pop-access-canonical-2026-08-23]].
- If it times out: check the box is online — `ping -c2 192.168.x.x`, `arp -n 192.168.x.x` (an `incomplete` ARP entry = host not on the LAN, i.e. powered off/asleep or DHCP moved it).

## Anti-Patterns to Avoid
- 🚫 **The Sandbox Surrender** — concluding a file/host is unreachable because the built-in tool was fenced, without trying filesystem-enhanced / system_exec.
- 🚫 **The Paste Request** — asking Mikey to paste a file that sits under `~` (just read it).
- 🚫 **The Ghost Tool** — reaching for `brain_execute` (gone) instead of `system_exec`.
- 🚫 **The Path Assumer** — assuming Cowork sandbox paths (`/sessions/.../mnt/...`) equal Mac paths (`~/...`).

## Quality Checks
- ✅ Tried filesystem-enhanced before saying a file is unreachable
- ✅ Used system_exec (not a sandboxed bash) for anything needing the real Mac/LAN
- ✅ Used `ssh bard@192.168.x.x` (or `ssh pop-os`; the config alias is CURRENT, not stale)
- ✅ Did NOT ask Mikey to do something a tool could do

---

**Remember**: built-ins are fenced; the MCP servers run on the Mac. When a built-in says "can't", the answer is almost always filesystem-enhanced (files) or system_exec (commands).

**Status**: Active - Critical Foundation Protocol

## Related Protocols
[[tool-auto-repair]] · [[coding-discipline]]
