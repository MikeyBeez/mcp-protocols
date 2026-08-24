# Pop Machine Facts

## Metadata
- **ID**: pop-machine-facts
- **Version**: 1.0.0
- **Tier**: 2 (Foundation Operational)
- **Status**: active
- **Purpose**: Answer any question about pop from a GENERATED, current document instead of from memory or a guess — and regenerate it in three seconds when it might be stale.
- **Created**: 2026-08-23
- **Source**: Mikey, 2026-08-23: "You should do an audit of pop and update your documentation for it. Actually, do we have any documentation for pop? You definitely need to have some sort of architectural documentation where you can go and look things up." We did not have any. Then: "You could make it a protocol, a runnable protocol."

## Purpose
Stop answering questions about pop from stale memory. Before this existed, pop was
described only in `SYSTEM_COMPONENT_MAP.md` Part 3, hand-written on 2026-08-19. Five
days later three of its claims were false: `della-server` "running" (its unit no longer
exists), a Django orphan on port 8000 (gone), and "all 21 MCP servers on the Mac" (now
13 wired, 8 collapsed behind `aux`). A hand-written machine map is wrong within a week.

## Core Principle
**The document is generated, so read it rather than remembering — and regenerate rather
than reasoning about whether it drifted. It costs three seconds.**

## Trigger Conditions
- **WHEN** asked what is on pop, what it is running, what it has, or how it is set up.
- **WHEN** about to state any fact about pop's hardware, ports, services, shell, disks, models or toolchains.
- **WHEN** something on pop behaves as if a tool is missing.
- **Trigger keywords**: pop machine, pop hardware, pop map, pop ports, pop services, pop disk, pop shell, node on pop, gpu box, linux box, ornith host, what is running on pop.

## Execution Steps

### 1. Read the generated document first
`~/Code/docs/POP.md`. It carries identity, shell, CPU/RAM/disk, GPU, the llama-server
command line that IS ornith, listening ports, running services, toolchains, node
resolution, models on disk, `~/Code` by last touch, and which MCP servers are absent.

### 2. Regenerate if the answer matters
    aux_run name=pop-map          # ~3 seconds, one ssh round trip
It also refreshes with everything else in the daily `regen` run, so it is rarely more
than a day old.

### 3. Do not expect live gauges — they are deliberately absent
POP.md records what is **installed, configured and enabled**, never current GPU memory,
uptime, load or free RAM. A gauge in a document is stale the moment it is written and
looks authoritative anyway. For live GPU state: `aux_run name=gpu`.

### 4. Use PATH-independent checks when asking whether something exists
This is the failure that produced the protocol. `ssh pop 'which node'` printed nothing
and was reported as "pop has no node at all". pop had node v22.23.2 and had built the
harness with it. **A tool failing to find something is not evidence the thing is absent.**
- `which`, a bare command name → answers "is this on THIS shell's PATH", nothing more.
- `[ -d path ]`, `ls ~/.nvm/versions/node`, `getent passwd`, full-path execution,
  `env -i /bin/sh -c '<cmd>'` → answer whether it exists.

## Facts that keep catching people
- **pop's login shell is zsh** (oh-my-zsh). `~/.bashrc` is never read there. The nvm
  block lived in `.bashrc` until 2026-08-24, so node looked missing in every session.
- **`/usr/local/bin/{node,npm,npx}`** are symlinks to nvm's v22 binaries. That is what
  makes node resolvable to non-interactive spawns; rc files never reach those.
- **The model is at 127.0.0.1:8080 ON pop**, and at 127.0.0.1:8081 from the Mac through
  the SSH tunnel. Same model, different address per machine.
- **No MCP servers live on pop.** A harness run there is model-only.
- **`brain.db` is state, not code.** Copying it to pop forks the memory.

## Anti-Patterns
- Answering a question about pop from a brain memory rather than from POP.md.
- Quoting `SYSTEM_COMPONENT_MAP.md` Part 3 — superseded, and it was wrong within a week.
- Concluding something is not installed because a PATH-dependent lookup came back empty.
- Adding live gauges to POP.md.

## Related Protocols
[[gpu-preflight-ollama]] · [[pop-os-rebuild]] · [[training-run-management]] · [[stale-note-correction]]
