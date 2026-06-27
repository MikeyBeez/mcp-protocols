# GPU Preflight: Free Ollama Before Experiments

## Metadata
- **ID**: gpu-preflight-ollama
- **Version**: 1.0.0
- **Tier**: 2 (Foundation Operational)
- **Status**: active
- **Purpose**: Before launching any GPU experiment on pop, reliably free VRAM by STOPPING the ollama systemd service (not merely unloading the model), verify the GPU is clear, run the experiment, then RESTART ollama afterward so reachi comes back. Prevents the mid-run OOM where ollama reloads a model while a run is starting.
- **Updated**: 2026-06-27 — scoped to POP ONLY (never the Mac's ollama); added reachi keep-alive via the Mac's ollama, per Mikey.
- **Created**: 2026-06-27
- **Source**: HyperPEER perceiver-size sweep, 2026-06-27 — the StarCoder2-3b run OOM'd twice because `ollama stop` only unloaded gemma4 and reachi immediately re-triggered a reload (~12.5GB) during the corpus-buffer build; stopping the ollama *service* fixed it. Mikey: "You need a protocol for running experiments that unloads ollama and stops the ollama service."

## Purpose
pop has a 16GB RTX 5070 Ti. A loaded ollama model (e.g. gemma4:26b, ~13GB on the GPU) and a real training/eval run (e.g. StarCoder2-3b, ~10GB) cannot coexist in 16GB. Any GPU experiment must therefore run with ollama fully OFF the GPU — and it must stay off for the whole run, not just at launch.

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: about to launch any training, distillation, fine-tune, sweep, or eval that loads a model onto pop's GPU
- **WHEN**: a pop run dies with `CUDA out of memory` / OOM and nvidia-smi shows an ollama / llama-server process holding VRAM
- **WHEN**: nvidia-smi shows ~13GB used at 0% util on pop with no training process (an idle ollama model squatting on the GPU)
- **Trigger keywords**: ollama, reachi, gemma, vram, VRAM, OOM, out of memory, cuda out of memory, free gpu, unload, unload ollama, stop ollama, llama-server, gpu memory, peakVRAM, preflight, pre-flight, pop gpu, free vram, nvidia-smi, keep_alive, sweep, training run, experiment.

## Procedure
1. **Check the GPU first.** `ssh -i ~/.ssh/id_rsa bard@192.168.12.174 'nvidia-smi --query-gpu=memory.used,memory.free,utilization.gpu --format=csv,noheader'` and `... --query-compute-apps=pid,process_name,used_memory --format=csv,noheader`. If a `llama-server` / ollama process holds VRAM, it WILL OOM the run.
2. **`ollama stop` is NOT enough.** Unloading the model (`ollama stop <model>`) frees VRAM only momentarily — reachi (or any ollama client) re-triggers a reload within seconds, and that reload lands mid-startup (e.g. during the corpus-buffer build) and OOMs the run at model-load. This was the exact 2026-06-27 failure, twice.
3. **Stop the service.** `sudo -n systemctl stop ollama`. This kills the llama-server (frees its VRAM) AND makes client requests fail fast instead of reloading. Verify: `pgrep -af 'ollama|llama-server'` is empty and `nvidia-smi` shows the VRAM freed (expect >15GB free on the 5070 Ti).
4. **Flag the side effect.** reachi (the voice assistant) is OFFLINE while ollama is stopped. Tell Mikey; it is expected. If he needs reachi back mid-run, restarting ollama will OOM/pause the experiment — that is the tradeoff.
5. **Launch the experiment**, then follow [[training-run-management]]: verify liftoff in the first 30-40s, register in pop-active-jobs, open the ledger trace, monitor.
6. **Restart ollama when the run finishes — always, even unattended.** `sudo systemctl start ollama`, then verify `systemctl is-active ollama` returns `active` (reachi restored). WIRE THIS INTO THE RUN'S MONITOR / FINALIZER so it happens on completion OR crash, not only when you remember.

## Failure Modes
- **Unloaded-but-reloaded**: used `ollama stop` only; a client re-triggered a model reload mid-run -> OOM. Mitigated by stopping the *service* (step 3).
- **Left-ollama-down**: experiment finished but ollama was never restarted -> reachi silently dead for hours. Mitigated by step 6 + baking the restart into the finalizer.
- **Coexistence attempt**: assuming a ~13GB ollama model and a ~10GB run fit together in 16GB — they do not. One must be fully down.
- **No passwordless sudo**: if `sudo -n systemctl stop ollama` needs a password, fall back to stopping the client (reachi) instead, or ask Mikey to free the GPU.

## Scope: stop ollama on POP only — never on the Mac

The experiment runs on pop, so only **pop's** GPU must be freed. Do NOT stop the **Mac's** ollama (`127.0.0.1:11434`) — it serves other things and is unrelated to the pop run. (Mikey, 2026-06-27.)

reachi / Mycroft runs on the Mac, but its `GEMMA_HOST` defaults to `http://127.0.0.1:11435` — an SSH tunnel to **pop's** ollama — so stopping pop's ollama for an experiment also kills Mycroft's brain. Keep Mycroft alive during pop experiments by pointing reachi at the **Mac's** ollama (which has `gemma4:latest`): in `~/Code/reachi/.env` set

    GEMMA_HOST=http://127.0.0.1:11434
    GEMMA_MODEL=gemma4:latest

then `launchctl kickstart -k gui/$uid/com.reachi.assistant`. Verified 2026-06-27: reachi warmed `gemma4:latest @ 11434` and kept working while the perceiver-size sweep ran on pop.

## Related Protocols
[[training-run-management]] · [[gpu-project-env-setup]] · [[pop-os-rebuild]]
