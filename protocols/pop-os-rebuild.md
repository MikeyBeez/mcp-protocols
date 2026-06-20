# Pop!_OS GPU Sandbox Rebuild Protocol

## Metadata
- **ID**: pop-os-rebuild
- **Version**: 1.0.0
- **Tier**: 2 (Foundation Operational)
- **Status**: active
- **Purpose**: Rebuild Mikey's disposable pop-os GPU sandbox (RTX 5070 Ti) to a working dev/ML state from scratch.
- **Created**: 2026-06-09
- **Source**: Mikey 2026-06-09 — "pop is my sandbox… if it gets trashed we can set it up again fairly easily. You should have a protocol for how to set that box up."

## Purpose
Bring the pop-os GPU box back to a working state (driver + Python/torch + repos + ssh) after it is wiped, reinstalled, or broken. The box is intentionally disposable; nothing important should live only there.

## Trigger Conditions
- **WHEN**: pop-os was reinstalled / reimaged / reset, or is broken and being rebuilt from scratch.
- **WHEN**: `nvidia-smi` or the GPU/driver is gone, or `ssh bard@192.168.12.174` no longer works.
- **WHEN**: setting up a fresh Pop!_OS box to mirror this environment.
- **Trigger keywords**: pop-os, pop, rebuild, reinstall, reimage, reset, restore, bootstrap, sandbox, trashed, broke, broken, fresh install, set up the box, gpu, nvidia, driver, cuda, 5070.

## Core Principle
**The box is disposable; the source of truth is GitHub. Rebuild = reinstall OS → driver → python/torch → re-clone repos from GitHub → recreate venvs → verify GPU.**

## Known-good state (target to reproduce)
- Host `pop-os`, user `bard`, reached from the Mac via `ssh bard@192.168.12.174` (run through the `system` MCP `system_exec`).
- OS: **Pop!_OS 24.04 LTS**, kernel ~6.18.x. GPU: **NVIDIA GeForce RTX 5070 Ti**, driver **580.126.18** (System76 ships the NVIDIA driver in the Pop ISO).
- **Python 3.12.3** system; `pip3` present. **No `nvcc`/CUDA toolkit** — torch nightly `cu130` bundles its own CUDA runtime, which works with driver 580. `node`/`uv` are NOT installed (add only if a project needs them).
- `~/Code` (symlinked to `/mnt/data/Code`) holds the repos; per-project `.venv`s (torch nightly cu130).

## Rebuild Steps
1. **OS + driver**: install Pop!_OS 24.04 LTS from the System76 ISO (includes the NVIDIA driver). Verify: `nvidia-smi` shows the RTX 5070 Ti.
2. **Base tools**: `sudo apt update && sudo apt install -y git python3-venv python3-pip build-essential`.
3. **SSH key for GitHub** (repos use `git@` SSH remotes): `ssh-keygen -t ed25519 -C bard@pop-os`, add the public key to github.com/MikeyBeez, then `ssh -T git@github.com` to confirm.
4. **Re-clone repos** into `~/Code`:
   - `git@github.com:MikeyBeez/HRS.git`
   - `git@github.com:MikeyBeez/cayley-attention.git`
   - `git@github.com:MikeyBeez/Della.git`
   - `git@github.com:MikeyBeez/Sidon.git`
   - `git@github.com:MikeyBeez/GRAM.git`  *(create this remote + push first — see warning below)*
   - `https://github.com/ggml-org/llama.cpp` (upstream, not Mikey's)
5. **Recreate venvs** (per project, or reuse one — see `gpu-project-env-setup`):
   `python3 -m venv .venv && .venv/bin/pip install --upgrade pip wheel setuptools && .venv/bin/pip install --pre torch torchvision --index-url https://download.pytorch.org/whl/nightly/cu130` then `pip install -r requirements.txt` if present.
6. **Verify GPU + torch**: `~/Code/<proj>/.venv/bin/python -c "import torch; print(torch.__version__, torch.cuda.is_available(), torch.cuda.get_device_name(0))"` → expect `cu130`, `True`, `NVIDIA GeForce RTX 5070 Ti`.
7. **Confirm remote access**: ensure `sshd` is running (`sudo systemctl enable --now ssh`) and `ssh bard@192.168.12.174` works from the Mac (this is what `system_exec` drives).

## Anti-Patterns to Avoid
- 🚫 **Box-only data** — leaving work that exists ONLY on pop. It's disposable; push everything to GitHub. **GRAM currently has NO git remote → push it before relying on the box.**
- 🚫 **Expecting `nvcc`** — it isn't installed; torch ships its own CUDA runtime. Only add the CUDA toolkit if a project must compile CUDA extensions (e.g. adam-atan2).
- 🚫 **Hand-installing a stale torch** — match the working build (`torch … cu130`) and reuse an existing venv where possible.

## Quality Checks
- ✅ `nvidia-smi` shows the 5070 Ti; torch reports CUDA True on it.
- ✅ All MikeyBeez repos re-cloned and have remotes.
- ✅ `ssh bard@192.168.12.174` works from the Mac (system_exec path restored).
- ✅ Nothing critical exists only on pop (GRAM pushed to GitHub).

---
**Status**: Active — Foundation Operational
