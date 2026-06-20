# GPU Project Env Setup Protocol

## Metadata
- **ID**: gpu-project-env-setup
- **Version**: 1.0.0
- **Tier**: 2 (Foundation Operational)
- **Status**: active
- **Purpose**: Stand up a Python/ML environment for a new project on Mikey's pop-os GPU box quickly, by reusing an existing working venv instead of reinstalling heavy deps.
- **Created**: 2026-06-09
- **Source**: Mikey correction 2026-06-09 — "next time you can just copy the environment from another project" (after a fresh torch nightly install pulled ~619MB).

## Purpose
Stand up a working torch+CUDA environment for a NEW project on pop-os (RTX 5070 Ti) without re-downloading multi-GB torch/CUDA wheels — reuse an existing project's venv.

## Trigger Conditions
- **WHEN**: creating/setting up a new Python or ML project on pop-os (192.168.12.174) that needs torch / CUDA / GPU.
- **WHEN**: about to run `pip install torch` or a fresh `python -m venv` + heavy install on the GPU box.
- **WHEN**: a new experiment repo needs the same stack an existing project already has.
- **Trigger keywords**: venv, virtualenv, environment, env, setup, install, torch, pytorch, cuda, gpu, pop-os, pip, requirements, new project, dependencies, conda, uv.

## Core Principle
**Reuse a known-good environment before building a new one. A working venv already exists — don't re-download gigabytes.**

## Known-good environments on pop-os
- `/home/bard/Code/HRS/.venv` — torch `2.11.0+cu130`, CUDA verified on the RTX 5070 Ti. The reference env.
- (Add others here as discovered.)

## Decision Tree
```
New project on pop needs torch/CUDA?
│
├─ Quick experiment / smoke test only?
│     → just call an existing interpreter directly:
│       ~/Code/HRS/.venv/bin/python your_script.py      (no new env at all)
│
├─ Project needs its own env but same stack?
│     → recreate a venv and `pip install` the SAME torch — pip uses its local
│       cache, so no multi-GB re-download. Or use `uv venv` / virtualenv-clone.
│
└─ Genuinely different/conflicting stack?
      → only then do a fresh install (expect a long torch download).
```

## Anti-Patterns to Avoid
- 🚫 **Fresh-install reflex** — running `pip install torch` from scratch when HRS/.venv already has a working build (≈619MB wheel, minutes lost).
- 🚫 **cp -r a venv and using its pip/activate** — venvs hardcode absolute paths; the activate script and pip break at the new path. Calling the python *binary* directly is fine; pip/activate are not.
- 🚫 **Assuming the box has no torch** — check `~/Code/*/.venv/bin/python -c "import torch"` first.

## Quality Checks
- ✅ Checked for an existing working venv before installing torch.
- ✅ For a smoke test, reused an interpreter directly rather than building a new env.
- ✅ If a fresh env was unavoidable, recorded why (genuine stack conflict).

---
**Status**: Active — Foundation Operational
