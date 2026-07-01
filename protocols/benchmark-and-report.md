# Benchmark: Always Save Results, Then Present

## Metadata
- **ID**: benchmark-and-report
- **Version**: 1.0.0
- **Tier**: 2 (Foundation Operational)
- **Status**: active
- **Purpose**: Whenever a benchmark is run (tok/s, latency, throughput, VRAM split, training step time, any measured number), the RAW output and a compiled comparison MUST be written to a durable, timestamped results file BEFORE the run is considered done — and then presented to Mikey. Completion markers (touch *.done) are never a substitute for the numbers themselves.
- **Created**: 2026-06-30
- **Source**: ornith-35b-benchmark scheduled task, 2026-06-30. The task benchmarked ornith:35b and gemma-4 IQ4_XS, then only `touch`ed /tmp/ornith_bench.done and /tmp/iq4_bench.done and disabled itself. When Mikey asked "what was the result?", the ornith numbers survived only because they happened to be in /tmp/ornith_bench.out, but the IQ4 tok/s were lost (only the warmup log remained) and had to be re-measured. Mikey: "You need a protocol for whenever you run a benchmark to save the results and then present them."

## Purpose
A benchmark that isn't saved is a benchmark you have to run again. Model reloads on pop cost 60-135s each, so re-running to recover a number you already measured is pure waste. Every benchmark must leave behind (a) the raw tool output and (b) a human-readable comparison against the relevant baseline, in a known location, timestamped, before the task ends.

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: about to run any tok/s, throughput, latency, VRAM-split, or step-time measurement
- **WHEN**: comparing two models / quants / configs by speed or memory
- **WHEN**: a scheduled task's job is to benchmark something
- **Trigger keywords**: benchmark, bench, tok/s, tokens per second, throughput, latency, step time, VRAM split, gpu/cpu split, ollama ps, predicted_per_second, eval_count, quant comparison, baseline, measure speed, how fast, re-bench, rebench, present results, save results.

## Procedure
1. **Pick a durable results path FIRST, before measuring.** Use `~/bench_results/<name>-<UTC-timestamp>.txt` on the box the benchmark runs on (create `~/bench_results/` if absent). Never rely on /tmp scratch files or on a `.done` marker to carry the numbers.
2. **Tee everything.** Wrap the whole benchmark in `{ ...; } | tee "$RESULTS"`. Capture: the model id, `ollama ps` (the PROCESSOR / GPU-CPU split and SIZE), all raw repetitions (do not average away the individual runs — save r1/r2/r3), and any sample output.
3. **Compile a comparison block** into the same file: the new numbers next to the stated baseline, the ratio (Nx faster/slower), and the GPU/CPU split delta (did a spill appear/disappear). One paragraph, plain language.
4. **Only then mark done.** A `*.done` marker may be touched AFTER the results file exists and contains real numbers. The marker is a control-flow flag, never the data.
5. **Present to Mikey**: the averaged tok/s per interface (API + raw runner), the split, the baseline delta with the ratio, and any quality caveat. Point at the saved results file path.

## Quoting Gotcha (cost a re-run on 2026-06-30)
Inside `python3 -c "..."` invoked from a shell double-quoted string, parse JSON with ESCAPED DOUBLE QUOTES for dict keys, not single quotes:
- WORKS: `python3 -c "import sys,json;d=json.load(sys.stdin);print(f\"{d[\"eval_count\"]/(d[\"eval_duration\"]/1e9):.1f} tok/s\")"`
- FAILS with `NameError: name 'eval_count' is not defined` when the single quotes get stripped in transit: `... {d['eval_count']} ...`
When writing a reusable bench script to disk, use a quoted heredoc (`<<'EOF'`) so nothing expands, and prefer escaped-double-quote JSON keys inside it.

## Standard Bench Shape (ollama on pop, warm)
Warm the model, capture `ollama ps`, 3x ollama API tok/s (`eval_count / (eval_duration/1e9)`), 3x raw runner tok/s (llama-server `/completion` `timings.predicted_per_second`), optional code/quality sample. Tee to `~/bench_results/`.

## Failure Modes
- **Marker-without-data**: touched `*.done` but never saved tok/s -> numbers lost, forced re-measure. This protocol exists to kill this mode.
- **Averaged-away raw runs**: only the mean was saved; can't see variance or an outlier reload. Save every repetition.
- **Split not captured**: forgot `ollama ps`, so can't tell if it spilled to CPU. Always capture PROCESSOR.
- **Scratch-only**: results only in /tmp and cleared on reboot. Use `~/bench_results/`.

## Related Protocols
[[gpu-preflight-ollama]] · [[training-run-management]] · [[reflect]]
