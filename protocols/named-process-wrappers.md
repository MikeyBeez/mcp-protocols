# Named Process Wrappers Protocol

## Metadata
- **ID**: named-process-wrappers
- **Version**: 1.0.0
- **Tier**: 2 (Foundation Operational)
- **Status**: active
- **Purpose**: Any LaunchAgent/LaunchDaemon that runs a bare interpreter or generic binary (`bash`, `python`, `python3`, `node`, `ssh`, ...) shows up in macOS **Login Items -> App Background Activity** and Activity Monitor under the interpreter's name — or, for a signed bare binary, under the code-signer's company name. Neither tells you what the item actually is. Wrap each such agent in a tiny named `.app` bundle so the login item is attributed to a recognizable bundle name (`BrainMonitor`, `GemmaTunnel`, ...).
- **Created**: 2026-06-26 (from the login-items cleanup: wrapped BrainMonitor, GemmaTunnel, Reachi, Subconscious, ConfigBackup, ContextMonitor, ClaudeBrainLegacy; verified on-screen that bare agents showed as `bash`/`python3`/`node`/`ssh` while `.app` bundles showed clean names).
- **Source**: empirical — macOS Background Task Management attributes login items by bundle, not by plist Label; confirmed in System Settings on 2026-06-26.

## Purpose
Make every background process Mikey runs identifiable in Login Items. A LaunchAgent that execs a bare interpreter is anonymous: macOS labels it `python3` / `bash` / `node` / `ssh` (the executable), or by the signing company (Ollama's binary shows as "Infra Technologies, Inc"). Wrapping the agent's program in a named `.app` bundle makes the OS show the bundle name instead. Operational: the cost of skipping it is a Login Items list full of indistinguishable `python3`/`bash` rows you can't safely turn off.

## Core Principle

**If you can't tell what a login item is, it isn't named. Every background agent that launches an interpreter gets its own named `.app` wrapper.**

The macOS Login Items pane attributes a background item to the **bundle** that owns its executable — not to the `Label` in the plist (which is never displayed). So the fix is structural: put the launched program inside a `Name.app` bundle.

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: creating or installing a new LaunchAgent/LaunchDaemon that runs `bash`, `python`, `python3`, `node`, `ssh`, or any interpreter/generic binary.
- **WHEN**: auditing or cleaning up Login Items / "App Background Activity".
- **WHEN**: a login item shows as `bash`, `python`, `python3`, `node`, `ssh`, `diskutil`, a bare binary name, or a signer's company name ("... Inc — unidentified developer").
- **WHEN**: Mikey asks "what is this login item?" — name it so the question doesn't recur.
- **Trigger keywords**: login item, login items, launchd, launchagent, launchdaemon, app background activity, background item, named wrapper, loginlaunchers, exec -a, programarguments, unidentified developer, startup item, runs at login, plist.

## The Wrapper Recipe
Wrappers live in `~/Library/LoginLaunchers/<Name>.app`. For an agent whose `ProgramArguments` are `[prog, arg1, ...]`:

1. **Bundle skeleton**: `~/Library/LoginLaunchers/<Name>.app/Contents/{Info.plist, MacOS/<Name>}`.
2. **Info.plist**: `CFBundleName`/`CFBundleDisplayName`/`CFBundleExecutable` = `<Name>`; a `CFBundleIdentifier`; `CFBundlePackageType=APPL`; `LSUIElement` + `LSBackgroundOnly` = true (no Dock icon).
3. **Launcher** `Contents/MacOS/<Name>` (chmod 755):
   ```bash
   #!/bin/bash
   exec -a <Name> <prog> <arg1> <arg2> ...
   ```
4. **Ad-hoc sign** for a stable identity: `codesign --force --deep -s - <Name>.app`.
5. **Back up + repoint the plist**: copy the plist to `*.bak-<timestamp>`, then set `ProgramArguments = ["/Users/bard/Library/LoginLaunchers/<Name>.app/Contents/MacOS/<Name>"]`.
6. **Refresh registration ONLY if the agent is currently loaded**:
   ```bash
   uid=$(id -u)
   launchctl bootout   "gui/$uid/<label>" 2>/dev/null
   launchctl bootstrap "gui/$uid" ~/Library/LaunchAgents/<label>.plist
   ```

## Known Facts (verified 2026-06-26)
- **Login Items pane = bundle-based.** Wrapping reliably renames the item there (`python3` -> `BrainMonitor`, `ssh` -> `GemmaTunnel`).
- **Activity Monitor / `ps` may still show the interpreter.** Python re-execs to its framework binary and discards the `exec -a` argv[0], so it still reads "Python"; `ssh` keeps the name. Wrap for the Login Items pane; do not promise an Activity-Monitor rename for re-execing runtimes.
- **Don't revive the dead.** If the agent is dormant (not in `launchctl list`), only rewrite the plist — do NOT `bootstrap` it, or you start a retired service. The name still refreshes at next login.
- **Bootstrap race.** A `bootstrap` immediately after `bootout` can fail with "Boot-out failed: No such process"; just bootstrap again.
- **Always back up the plist** before editing; wrapper bundle + `.bak` make it fully reversible.

## Examples
- `com.mikey.harness-dashboard` ran `python3 dashboard_server.py`, showed as **python3** -> wrapped as `BrainMonitor.app` -> shows as **BrainMonitor**.
- `com.mikey.gemma-tunnel` ran `ssh -N -L ...`, showed as **ssh** -> `GemmaTunnel.app` -> **GemmaTunnel** (and `pgrep` shows `GemmaTunnel`, since ssh keeps argv[0]).
- A bare signed binary (`/opt/homebrew/bin/ollama`) showed as its signer **"Infra Technologies, Inc"** — same problem; wrap it, or accept it since it is a vendor binary, not ours.

## Anti-Patterns to Avoid
- 🚫 **A LaunchAgent that execs a bare interpreter with no wrapper** — instant anonymity in Login Items.
- 🚫 **Renaming the plist `Label` and expecting the UI to change** — the Label is never displayed.
- 🚫 **`bootstrap`-ing a dormant/retired agent just to rename it** — resurrects a dead service. Rewrite the plist only.
- 🚫 **Editing the plist without a backup** — you lose the original `ProgramArguments`.
- 🚫 **Promising an Activity-Monitor rename for Python/Node** — they re-exec; only the Login Items pane is guaranteed.

## Quality Checks
- ✅ Does every custom background agent point `ProgramArguments` at a `~/Library/LoginLaunchers/<Name>.app` launcher?
- ✅ Is the launcher `chmod +x` and ad-hoc signed?
- ✅ Did I back up the plist before repointing it?
- ✅ For dormant agents, did I avoid bootstrapping (no accidental revival)?
- ✅ Verified on screen that Login Items now shows the name?

---

**Remember**: the Label is invisible; the bundle is what you see. Wrap the interpreter, name the bundle, and a login item you can't identify becomes one you can turn off with confidence.

**Status**: Active — Foundation Operational Protocol

## Related Protocols
[[naming-linter]] · [[mcp-permissions]] · [[mcp-server-shellout-hardening]] · [[tool-auto-repair]]
