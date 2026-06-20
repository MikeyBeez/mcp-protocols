// AIMO3 Kaggle Submission Protocol - Guide for submitting to AI Mathematical Olympiad
module.exports = {
  id: 'kaggle-aimo3-submission',
  name: 'AIMO3 Kaggle Submission Protocol',
  version: '1.3.0',
  tier: 3,  // Task-specific protocol
  purpose: 'Guide submission to Kaggle AI Mathematical Olympiad Progress Prize 3 competition',
  triggers: [
    'User mentions AIMO3 or AIMO submission',
    'User wants to submit to Kaggle math competition',
    'User mentions "olympiad" and "kaggle"',
    'User asks about math competition submission',
    'User wants to submit pop-math-agent to competition'
  ],
  status: 'active',
  location: '/Users/bard/Code/mcp-protocols/src/protocols/foundation/kaggle-aimo3-submission.js',
  content: `# AIMO3 Kaggle Submission Protocol v1.0.0

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: User mentions AIMO3, AIMO submission, or math olympiad competition
- **WHEN**: User wants to submit to Kaggle math competition
- **WHEN**: User wants to submit pop-math-agent to competition
- **IMMEDIATE**: No - requires careful preparation
- **PRIORITY**: Medium (Tier 3)

## Core Principle
"Kaggle runs YOUR notebook - you submit code, not answers."

## Competition Overview

| Field | Value |
|-------|-------|
| Competition | AI Mathematical Olympiad Progress Prize 3 |
| URL | https://www.kaggle.com/competitions/ai-mathematical-olympiad-progress-prize-3 |
| Deadline | 2026-04-15 |
| Prize | $2.2M |
| Answer Format | 5-digit integers (0-99999) |
| Problems | 110 olympiad-level math problems |
| Submission Limit | **1 per day** |

---

## IMMUTABLE - How Kaggle Code Competitions Work

These rules cannot change - they are defined by Kaggle's infrastructure:

1. You submit a **notebook** (not a file with answers)
2. Kaggle **re-runs your notebook** on their infrastructure with the hidden test set
3. The notebook must produce \`submission.parquet\` with columns \`id\` and \`answer\`
4. Runtime limit: ~5 hours on GPU (H100)
5. No internet access during competition rerun

### IMMUTABLE - Notebook Requirements

#### Required Imports
\`\`\`python
import polars as pl
import kaggle_evaluation.core.templates
import aimo_3_gateway
\`\`\`

#### Predict Function Signature
\`\`\`python
def predict(id_series: pl.Series, problem_series: pl.Series) -> pl.DataFrame:
    problem_id = id_series.item()
    problem_text = problem_series.item()
    # ... solve ...
    return pl.DataFrame({'id': [problem_id], 'answer': [answer]})
\`\`\`

#### Server Class
\`\`\`python
class AIMO3Server(kaggle_evaluation.core.templates.InferenceServer):
    def __init__(self):
        super().__init__(predict)
    def _get_gateway_for_test(self, data_paths=None, *args, **kwargs):
        return aimo_3_gateway.AIMO3Gateway(data_paths)
\`\`\`

#### Main Block
\`\`\`python
if __name__ == '__main__':
    server = AIMO3Server()
    if os.getenv('KAGGLE_IS_COMPETITION_RERUN'):
        server.serve()  # Production
    else:
        test_path = '/kaggle/input/ai-mathematical-olympiad-progress-prize-3/test.csv'
        server.run_local_gateway(data_paths=(test_path,))
\`\`\`

---

## EDITABLE - GPU Access and Hardware

### CRITICAL: H100 Access Requires Competition Linking

**H100 GPUs are ONLY available when notebook is linked to the competition.**

| GPU | VRAM | How to Access |
|-----|------|---------------|
| P100 | 16GB | Standard Kaggle (default) |
| T4 x2 | 32GB | Standard Kaggle option |
| L4 x4 | 96GB | AIMO2 competition-specific |
| H100 | 80GB | AIMO3 competition-specific |

**To get H100 access:**
1. Use \`competition_sources\` (NOT \`competition\`) in kernel-metadata.json
2. Or create notebook directly from competition page
3. After upload, change accelerator in web UI Settings

**GOTCHA: Auto-run on Upload**
- Kaggle auto-runs notebooks on upload with default GPU (P100)
- Cannot change accelerator while notebook is running
- Must wait for run to complete/fail, then change settings
- **Workaround**: Edit existing notebook with correct GPU rather than uploading new

---

## EDITABLE - Recommended Models

### Best Model for P100: OpenMath-Nemotron-14B-Kaggle
- **NVIDIA's AIMO2 winning model** (1st place, 34/50 problems)
- Kaggle dataset: \`neos960518/openmath-nemotron-14b-kaggle\`
- Path: \`/kaggle/input/openmath-nemotron-14b-kaggle\`

### Best Model for H100: OpenMath-Nemotron-32B
- Larger version with better performance
- Kaggle dataset: \`artemgoncarov/openmath-nemotron-32b\`
- Path: \`/kaggle/input/openmath-nemotron-32b\`
- Requires H100 (~52GB model size)

### Alternative 32B: DeepSeek-R1-Distill-Qwen-32B-AWQ
- AWQ quantized version (~17GB)
- Kaggle dataset: \`casperhansen-deepseek-r1-distill-qwen-32b-awq\`
- May fit on smaller GPUs with quantization

### Model Performance on AIME 2024

| Model | AIME Score | Fits P100? | Kaggle Dataset |
|-------|------------|------------|----------------|
| DeepSeek-R1-Distill-Qwen-1.5B | ~20% | Yes | deepseek-ai/deepseek-r1 |
| DeepSeek-R1-Distill-Qwen-7B | 55.5% | Yes | deepseek-ai/deepseek-r1 |
| DeepSeek-R1-Distill-Qwen-14B | 69.7% | Tight | deepseek-ai/deepseek-r1 |
| OpenMath-Nemotron-14B-Kaggle | ~70%+ | Yes (~12GB) | neos960518/openmath-nemotron-14b-kaggle |
| DeepSeek-R1-Distill-Qwen-32B | 72.6% | No (H100) | casperhansen-deepseek-r1-distill-qwen-32b-awq |
| OpenMath-Nemotron-32B | ~75%+ | No (H100) | artemgoncarov/openmath-nemotron-32b |

### Auto-Detect GPU and Adapt

\`\`\`python
GPU_MEM_GB = torch.cuda.get_device_properties(0).total_memory / 1024**3
IS_H100 = GPU_MEM_GB > 40

if IS_H100:
    TORCH_DTYPE = torch.bfloat16  # Full precision
else:
    TORCH_DTYPE = torch.float16   # Or use 4-bit quantization
\`\`\`

**Note**: bitsandbytes may not be available on Kaggle - always have float16 fallback.

---

## EDITABLE - Model Capacity Reality Check

| Model Size | VRAM (float16) | Capability Level |
|------------|----------------|------------------|
| 1.5B | ~3GB | Basic arithmetic, simple algebra |
| 7B | ~14GB | Multi-step reasoning, fits P100 |
| 14B | ~12GB (actual) | Complex olympiad problems, fits P100! |
| 32B+ | >40GB | Best performance, needs H100 |

**Reality**: 1.5B models will likely score 0 on olympiad-level problems. Use 14B minimum for competitive results.

---

## EDITABLE - Submission Workflow

### File Locations

**IMPORTANT**: Always write to permanent storage, NEVER to /tmp.

\`\`\`
/Users/bard/Code/mcp-math/kaggle-submissions/
├── kernel-metadata.json     # Kernel configuration
├── notebook.py              # Simple test submission
└── notebook_deepseek.py     # DeepSeek R1 submission

/Users/bard/Code/pop-math-agent/kaggle/
├── kaggle_evaluation/       # Competition framework
├── test.csv                 # Sample test problems
├── reference.csv            # Reference problems with answers
└── sample_submission.csv    # Submission format example
\`\`\`

### Step 1: Prepare kernel-metadata.json

\`\`\`json
{
  "id": "mikebee/<kernel-name>",
  "title": "<Kernel Title>",
  "code_file": "<notebook_file.py>",
  "language": "python",
  "kernel_type": "script",
  "is_private": "true",
  "enable_gpu": "true",
  "enable_internet": "false",
  "dataset_sources": [],
  "competition_sources": ["ai-mathematical-olympiad-progress-prize-3"],
  "kernel_sources": [],
  "model_sources": ["deepseek-ai/deepseek-r1/transformers/1.5b/1"]
}
\`\`\`

### Step 2: Push Kernel to Kaggle

\`\`\`bash
cd /tmp/kaggle-aimo3
kaggle kernels push
\`\`\`

Wait for: \`Kernel version N successfully pushed\`

### Step 3: Check Kernel Status

\`\`\`bash
kaggle kernels status mikebee/<kernel-name>
\`\`\`

Wait until status is \`COMPLETE\`. If \`ERROR\`:

\`\`\`bash
kaggle kernels output mikebee/<kernel-name> -p /tmp/kaggle-output
cat /tmp/kaggle-output/<kernel-name>.log
\`\`\`

### Step 4: Submit to Competition

\`\`\`bash
kaggle competitions submit \\
  -c ai-mathematical-olympiad-progress-prize-3 \\
  -k mikebee/<kernel-name> \\
  -f submission.parquet \\
  -v <version-number> \\
  -m "<description>"
\`\`\`

### Step 5: Verify Submission

\`\`\`bash
kaggle competitions submissions ai-mathematical-olympiad-progress-prize-3
\`\`\`

Status: \`PENDING\` → \`COMPLETE\` (or \`ERROR\`)

---

## EDITABLE - Model Loading with vLLM

Models mount at: \`/kaggle/input/<model-slug>/transformers/<variant>/<version>\`

\`\`\`python
from vllm import LLM, SamplingParams

llm = LLM(
    '/kaggle/input/deepseek-r1/transformers/1.5b/1',
    dtype="auto",
    max_num_seqs=64,
    max_model_len=16384,
    trust_remote_code=True,
    tensor_parallel_size=1,
    gpu_memory_utilization=0.95,
)
\`\`\`

---

## EDITABLE - Winning Strategies

1. **Tool-Integrated Reasoning (TIR)**: Model generates Python code, execute it
2. **Majority Voting**: Generate N samples, pick most common answer
3. **\\boxed{} Extraction**: Parse LaTeX boxed answers
4. **Time Management**: ~3 min per problem (110 problems, 5hr limit)
5. **Cache Model Weights**: Pre-read to page cache for faster loading

---

## Common Issues

| Issue | Solution |
|-------|----------|
| File Not Found | Use full path: \`/kaggle/input/ai-mathematical-olympiad-progress-prize-3/test.csv\` |
| Model Not Found | Check dataset_sources in kernel-metadata.json |
| GPU Not Available | Set \`enable_gpu: true\` in kernel-metadata.json |
| No H100 Option | Notebook not linked to competition - use \`competition_sources\` |
| Can't Change GPU | Notebook is running - wait for it to finish/fail |
| OOM on P100 | Use float16 (14B fits in ~12GB) or wait for H100 access |
| bitsandbytes Missing | Use float16 fallback, don't rely on 4-bit quantization |
| Submission Rejected | Use \`-k\` (kernel) flag, not \`-f\` alone; specify \`-v\` version |

---

## Quick Reference Commands

\`\`\`bash
# List your notebooks
kaggle kernels list --mine

# Pull notebook source code
kaggle kernels pull mikebee/<kernel-name> -p ./kaggle-notebooks/

# Push kernel (from folder with kernel-metadata.json)
cd ./kaggle-notebooks && kaggle kernels push -p .

# Check status
kaggle kernels status mikebee/<kernel-name>

# Get logs/output
kaggle kernels output mikebee/<kernel-name> -p ./kaggle-output

# Submit to competition
kaggle competitions submit -c ai-mathematical-olympiad-progress-prize-3 \\
  -k mikebee/<kernel-name> -f submission.parquet -v <N> -m "<msg>"

# Check submissions
kaggle competitions submissions ai-mathematical-olympiad-progress-prize-3

# Pull reference notebook from another user
kaggle kernels pull <user>/<kernel> -p ./ref
\`\`\`

---

## Testing with Pop Server

\`\`\`bash
# Health check
curl http://192.168.12.175:8765/health

# Solve problem
curl -X POST http://192.168.12.175:8765/solve \\
  -H "Content-Type: application/json" \\
  -d '{"problem": "Find smallest n where n! divisible by 2024"}'

# Multi-sample majority voting
curl -X POST http://192.168.12.175:8765/multi_sample \\
  -H "Content-Type: application/json" \\
  -d '{"problem": "...", "n_samples": 5}'
\`\`\`

---

## Integration

- **error-recovery**: Apply when kernel push or submission fails
- **progress-communication**: Keep user informed during multi-step submission process

---
**Status**: Active - v1.0.0`
};
