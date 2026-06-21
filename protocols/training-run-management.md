# Training Run Management Protocol

## Metadata
- **ID**: training-run-management
- **Version**: 1.3.0
- **Tier**: 2 (Foundation)
- **Status**: active
- **Purpose**: Launch, monitor, and recover GPU training runs (on pop or any box) without losing work to divergence, checkpoint overwrites, OOM, invisible processes, or runs that silently stall/segfault unnoticed. Written from the HyperPEER session 2026-06-10 where a 20k-step run diverged at step 5200 and was saved only because the pre-divergence checkpoint had not yet been overwritten.
- **Created**: 2026-06-10
- **Updated**: 2026-06-18 — added proactive 15-min scheduled monitor (rule 15) and the tmux send-keys queueing/stall gotcha (launch rule 1a + failure mode), both from mid-June HyperPEER/HyperExpert sessions. 2026-06-20 — added the pop-active-jobs registry lifecycle: register at launch (rule 4a) and deregister at exit (rule 14a), wired to the hourly monitor-pop reconciler; added registry/launch trigger keywords. 2026-06-20 (later) — harness Phase 1: rule 4b OPENs a ledger trace (pipeline `pop-training-run`, `trace_id` stashed in the registry) and rule 14a CLOSEs it with the checkable exit outcome; declared pipeline at /Users/bard/Code/harness/pipelines/pop-training-run.md.

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: Launching any training, distillation, or fine-tuning run longer than ~10 minutes
- **WHEN**: A training loss/KL suddenly spikes, plateaus way above its recent trend, or a run "goes NaN"
- **WHEN**: Scaling up a model (wider, deeper, more latents) that previously trained fine at a smaller size
- **WHEN**: Resuming, restarting, or warm-starting from a checkpoint
- **WHEN**: A run must survive ssh disconnects or needs to be visible to Mikey
- **WHEN**: A long job (training, sweep, or Claude Code build/debug) is running and Mikey is NOT actively watching it — set up a proactive monitor instead of waiting to be asked
- **WHEN**: A job is launched on pop that the hourly monitor must be able to track — register it in `pop-active-jobs` at launch (rule 4a) and deregister it at exit (rule 14a)
- **Trigger keywords**: train, training, run, launch, distill, fine-tune, finetune, steps, checkpoint, ckpt, resume, restart, warm-start, diverge, divergence, spike, NaN, loss, KL, OOM, memory, GPU, cuda, lr, learning rate, tmux, send-keys, nohup, wandb, monitor, monitoring, scheduled, sweep, segfault, stall, stalled, queued, hung, eta, pop, register, registry, deregister, pop-active-jobs, registry entry, job launch, launch protocol, start a run, started, finished, done, ledger, trace, harness, pipeline.

## Launch rules
1. **Visible by default**: run it in Mikey's attached tmux session (`tmux send-keys -t gram:<window> "<cmd>" Enter`), `2>&1 | tee <log>`. Out-of-pane `setsid nohup` is only for probes that must not disturb a foreground run.
   - **1a. Never queue with separate send-keys calls when the pane state is uncertain.** `tmux send-keys` into a pane that is AT A PROMPT (or whose foreground process exits between two sends) stacks multiple command-lines UNEXECUTED in the zsh/zle multiline editing buffer — the Enters don't fire and the job sits dead looking "queued" (cost: the WikiText teacher launch sat idle at a prompt for hours, 2026-06-12). Always chain the whole launch into ONE send-keys with `;` or `&&`. If a pane is in an unknown state, first send `C-c` then `C-u` to clear the line editor, then send the single combined command. Detection: `capture-pane` shows the command text *after* the prompt symbol (not above it with output) while `nvidia-smi` sits idle.
2. **Native W&B** for metrics (project per repo). Never hand-roll a TensorBoard bridge. Print the run URL into the log; Mikey will ask for it.
3. **Verify liftoff**: after launching, sleep 30-40s and capture the pane / tail the log. A run that dies in the first 30 seconds (missing module, OOM, bad path) must be caught in the same breath as the launch, not an hour later. pip-install missing modules into the run's OWN venv.
4. **Estimate and state the ETA** from the first steps/s reading.
   - **4a. Register the launch in the `pop-active-jobs` registry — this is what makes a run monitorable.** Immediately after liftoff is verified (rule 3), append an entry to brain key `pop-active-jobs` via `mcp__brain__brain_remember`, status `running`: `{name, tmux (session:window or null), log (abs path on pop), process_match (ps grep pattern), heartbeat (a log substring that should keep advancing, e.g. "eval @"), started (ISO local), eta, trace_id (harness ledger trace id, set by rule 4b; null if pre-2026-06-20), status:"running"}`. The hourly `monitor-pop` scheduled task reconciles this list against the box's real processes/logs: a run that is never registered is invisible to it, and a registered run that dies or stalls is exactly what it alerts on. If `pop-active-jobs` does not exist yet, create it as `{"updated": <now>, "jobs": []}` first, then append.
   - **4b. Open a harness ledger trace.** Right after 4a, insert one trace into `/Users/bard/Code/harness/ledger.db` via `mcp__database__db_query` with `pipeline='pop-training-run'`, then write the returned `trace_id` back into this run's registry entry (the new `trace_id` field) so `monitor-pop` and rule 14a can attach to it. Exact SQL and id scheme: `/Users/bard/Code/harness/pipelines/pop-training-run.md`. A run with no trace is invisible to `v_pipeline_health` the same way an unregistered run is invisible to the monitor.

## Checkpoint rules (the step-5000 lesson)
5. **Step-stamped checkpoints, not a single rolling file.** A rolling `checkpoint.pt` WILL eventually be overwritten by a post-divergence save. Save `ckpt_step{N}.pt` at least at milestones, or immediately `cp` the rolling file to a stamped name when a run starts looking good (or bad).
6. **Checkpoint cadence <= eval cadence**, so there is always a checkpoint at or before the last known-good eval.
7. **On divergence: act before the next scheduled save overwrites the good state.** Kill the run first (`tmux send-keys C-c`), then copy the checkpoint, then diagnose at leisure.

## Stability rules
8. **Scaling up the model => scale DOWN the lr.** 1e-4 was fine for a 3.8M-param hypernet and detonated an 11M one at the same task (KL 0.10 -> 2.6 in 250 steps). First retry after any spike-divergence: warm-start from the last good checkpoint at lr/3.
9. **Grad-clip does not prevent divergence**, it only slows it. NaN-skip guards catch non-finite losses but a finite-but-exploding loss sails through; the eval trace is the real tripwire — read it, don't just check the process is alive.
10. **Divergence != bug.** Warm-start + lower lr recovered cleanly; do that before rewriting code.
11. **OOM on a per-token hypernet/Perceiver**: memory scales with batch*seq, not batch. Fixes in order: torch.utils.checkpoint the BARE generator/hypernet call (use_reentrant=False) — never the whole transformer block (saved-tensor mismatch with hooks inside); then shrink ctx; then batch. `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True` helps fragmentation only.

## Monitoring rules
12. Poll the LOG (`grep "eval @" <log> | tail`), not just the pane — panes scroll away.
13. When Mikey asks "how is it going", report: current step / total, ETA, the headline metric trend, and any gap/overfit signal — with numbers, not adjectives.
14. After every run (success or failure) write a brain memory: config, result numbers, lessons. Failures get their own memory keyed `*-divergence-*` or `*-postmortem-*`.
   - **14a. Deregister at exit.** On clean finish set the run's `pop-active-jobs` entry status to `done`; on divergence/kill/OOM set it to `failed`. Keep the entry (do not delete) so the monitor and any postmortem can see the transition. The hourly monitor will also flip a registered run to `done`/`failed` when it detects the change, but the launcher should do it promptly so a clean finish is not mis-reported as a stall. Then **close the run's ledger trace** — `UPDATE traces SET closed_at, final_outcome (done→success, failed→failure), surprise, failure_class WHERE id=<trace_id>` (SQL in the pop-training-run pipeline file). The exit status is the checkable signal that sets `final_outcome`; it overrides any subjective reflect read.
15. **Proactive 15-min monitor for long jobs (don't wait to be asked).** When a long job is running on pop — training run, sweep, or a Claude Code build/debug — check it every ~15 minutes proactively rather than waiting for Mikey to ask "how is this going". Implement with an `mcp__scheduled-tasks` task that SSHes to pop, checks processes / logs / GPU, and reports concisely: one line when healthy, detailed when a job crashes, stalls, or finishes. Turn the scheduled monitor OFF when no long job is running. Motivating incident (2026-06-16): the HyperExpert c-vs-r sweep segfaulted on its FIRST config and sat dead until Mikey noticed — that lag between failure and discovery is exactly what this rule removes. Rule 3 covers the first 30s; rule 15 covers the long tail and multi-config sweeps where a later config can die silently.

## Failure modes
- **Silent checkpoint clobber**: divergence at step N, rolling save at N+k overwrites the good state. Mitigated by rules 5-7.
- **Launch-and-walk-away**: run died at t+10s, discovered at t+1h. Mitigated by rule 3.
- **Adjective monitoring**: "looks fine" without reading eval numbers. Mitigated by rules 12-13.
- **Stalled-at-prompt (tmux queue)**: separate `send-keys` calls leave commands stacked unexecuted in the line editor; the job never starts but looks launched. Mitigated by launch rule 1a (chain into one send-keys; `C-c` `C-u` to clear) + rule 3.
- **Silent mid-sweep death**: a multi-config sweep segfaults/OOMs on one config and the rest of the queue sits dead, unnoticed for hours. Mitigated by rule 15 (proactive 15-min scheduled monitor that reports crashes/stalls/finishes).

## Related Protocols
[[gpu-project-env-setup]] · [[pop-os-rebuild]]
