// AIMO3 Kaggle Submission Protocol - Guide for submitting to AI Mathematical Olympiad
module.exports = {
  id: 'kaggle-aimo3-submission',
  name: 'AIMO3 Kaggle Submission Protocol',
  version: '1.0.0',
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

## EDITABLE - Submission Workflow

### File Locations

\`\`\`
/tmp/kaggle-aimo3/
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
| Model Not Found | Check model_sources in kernel-metadata.json |
| GPU Not Available | Set \`enable_gpu: true\` in kernel-metadata.json |
| Submission Rejected | Use \`-k\` (kernel) flag, not \`-f\` alone; specify \`-v\` version |

---

## Quick Reference Commands

\`\`\`bash
# Push kernel
cd /tmp/kaggle-aimo3 && kaggle kernels push

# Check status
kaggle kernels status mikebee/<kernel-name>

# Get logs
kaggle kernels output mikebee/<kernel-name> -p /tmp/kaggle-output

# Submit
kaggle competitions submit -c ai-mathematical-olympiad-progress-prize-3 \\
  -k mikebee/<kernel-name> -f submission.parquet -v <N> -m "<msg>"

# Check submissions
kaggle competitions submissions ai-mathematical-olympiad-progress-prize-3

# Pull reference notebook
kaggle kernels pull <user>/<kernel> -p /tmp/ref
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
