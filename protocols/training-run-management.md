# Training Run Management Protocol

## Metadata
- **ID**: training-run-management
- **Version**: 1.0.0
- **Tier**: 2 (Foundation)
- **Status**: active
- **Purpose**: Launch, monitor, and recover GPU training runs (on pop or any box) without losing work to divergence, checkpoint overwrites, OOM, or invisible processes. Written from the HyperPEER session 2026-06-10 where a 20k-step run diverged at step 5200 and was saved only because the pre-divergence checkpoint had not yet been overwritten.
- **Created**: 2026-06-10
- **Updated**: 2026-06-10

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: Launching any training, distillation, or fine-tuning run longer than ~10 minutes
- **WHEN**: A training loss/KL suddenly spikes, plateaus way above its recent trend, or a run "goes NaN"
- **WHEN**: Scaling up a model (wider, deeper, more latents) that previously trained fine at a smaller size
- **WHEN**: Resuming, restarting, or warm-starting from a checkpoint
- **WHEN**: A run must survive ssh disconnects or needs to be visible to Mikey
- **Trigger keywords**: train, training, run, launch, distill, fine-tune, finetune, steps, checkpoint, ckpt, resume, restart, warm-start, diverge, divergence, spike, NaN, loss, KL, OOM, memory, GPU, cuda, lr, learning rate, tmux, nohup, wandb, monitor, eta, pop.

## Launch rules
1. **Visible by default**: run it in Mikey's attached tmux session (`tmux send-keys -t gram:<window> "<cmd>" Enter`), `2>&1 | tee <log>`. Out-of-pane `setsid nohup` is only for probes that must not disturb a foreground run.
2. **Native W&B** for metrics (project per repo). Never hand-roll a TensorBoard bridge. Print the run URL into the log; Mikey will ask for it.
3. **Verify liftoff**: after launching, sleep 30-40s and capture the pane / tail the log. A run that dies in the first 30 seconds (missing module, OOM, bad path) must be caught in the same breath as the launch, not an hour later. pip-install missing modules into the run's OWN venv.
4. **Estimate and state the ETA** from the first steps/s reading.

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

## Failure modes
- **Silent checkpoint clobber**: divergence at step N, rolling save at N+k overwrites the good state. Mitigated by rules 5-7.
- **Launch-and-walk-away**: run died at t+10s, discovered at t+1h. Mitigated by rule 3.
- **Adjective monitoring**: "looks fine" without reading eval numbers. Mitigated by rules 12-13.
