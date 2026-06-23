# Create Project Protocol

## Metadata
- **ID**: create-project
- **Version**: 2.1.0
- **Tier**: 3 (Task-specific)
- **Status**: active
- **Purpose**: Guide the setup of a new project — either (Mode A) a new standalone repo with version control and GitHub-over-SSH, or (Mode B) a new experiment/phase inside an existing research repo (e.g. HRS). Ensures project setup is a recognized, logged step instead of an ad-hoc one, and that "set up a project" doesn't reflexively create a separate repo when the work is really one experiment in an existing codebase.
- **Created**: 2026-06-20 (ported from the legacy foundation `create-project.js`, which was never in the live markdown library)
- **Updated**: 2026-06-21 — added Mode B (experiment/phase inside an existing repo), the missing case for the HRS chat→Code phase-spec workflow; "set up a project" used to dead-end at `gh repo create`. (Mikey, 2026-06-21.)

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: User asks to create a new project, repo, or codebase (→ Mode A)
- **WHEN**: User says "make a git repo", "push this to GitHub", "set up a new repo", "scaffold a project" (→ Mode A)
- **WHEN**: An existing local directory needs to become a tracked GitHub repo (→ Mode A)
- **WHEN**: User asks to "set up a project/experiment" that is really a new experiment, phase, ablation, or sweep inside a repo that already exists (→ Mode B)
- **PRIORITY**: Standard (Tier 3)
- **Trigger keywords**: repo, repository, project, create, new, scaffold, init, git, github, push, gh, experiment, phase, spec, ablation, sweep, set up, set up a project, set up an experiment, set up a new, new experiment, new phase.
## Core Principle
"Ask before assuming, then just do it." Confirm the few decisions that actually
matter (name, visibility — or for Mode B, which repo and which phase number), then
run the workflow with the tools on the Mac rather than telling Mikey what to type.

## Which mode?
- **Mode A — new standalone repo**: a genuinely new codebase that should become its own GitHub repo (a new tool, server, library, app).
- **Mode B — new experiment/phase inside an existing repo**: the work is one more experiment in a project that already exists (HRS adapter/address-space work, a new ablation, a sweep). **No new repo.** Spinning up a separate repo here fragments the research — don't.

If unsure, ask one question: "new repo, or a phase inside an existing project?"

---

# Mode A — new standalone repo

## Prerequisites (verify first)
- `git --version`, `gh --version`, and `gh auth status` all succeed.
- GitHub auth uses **SSH** (`gh auth status` shows `Git operations protocol: ssh`).
  Mikey's account is `MikeyBeez`; SSH remotes look like `git@github.com:MikeyBeez/<name>.git`.
- Decide where the project lives (default `~/Code/<name>`).

## Decisions to confirm
1. **Name** — lowercase, hyphens, no spaces. Check the dir and `gh repo view MikeyBeez/<name>` don't already exist.
2. **Visibility** — default **private** for personal infra/tools; public only if asked.
3. (Optional) description, license (MIT default), primary language.

## Workflow
1. **Hygiene first** — add a `.gitignore` and a short `README.md` before the first commit.
   Exclude runtime state and noise: databases (`*.db`, `*.db-wal`, `*.db-shm`), `logs/`,
   `__pycache__/`, `*.pyc`, and any auto-generated/session artifacts.
2. **Init + commit**: `git init -b main` → `git add -A` → `git commit -m "<meaningful message>"`.
   Review `git status --short` before committing so nothing unwanted (data, secrets) is staged.
3. **Create + push in one step (SSH)**:
   `gh repo create MikeyBeez/<name> --private --source=. --remote=origin --push`
   (use `--public` only if confirmed).
4. **Verify**: `git remote -v` shows the `git@github.com:` SSH remote and `gh repo view MikeyBeez/<name>`
   returns the expected name/visibility/url.

## After creation
- Report the URL, visibility, and what was/wasn't committed (e.g. DB left out by design).
- Update architecture/registry docs if it's a new MCP tool or significant project (see `architecture-update`).
- This step should produce a harness trace (source → `create-project` protocol span) so repo
  creation is visible in the ledger, not invisible.

## Mode A anti-patterns
- 🚫 Committing a live database or logs (state, not source — gitignore them).
- 🚫 Using an HTTPS remote when the account is configured for SSH.
- 🚫 Creating a repo without first reviewing `git status` for secrets/large files.
- 🚫 Doing it silently — if there's a create-project step, it should be logged.

---

# Mode B — new experiment/phase inside an existing repo

**When**: the work is a new experiment in a repo that already exists — not a new codebase. The deliverable is a *spec* in the right place and numbered correctly, ready for the runner (Claude Code on the GPU box) to execute. See the `chat-code-handoff` skill for the full HRS convention.

1. **Find the home, don't invent one.** Use `project-finder` / filesystem to locate the repo. Reuse the existing topic directory and the project's own file conventions; create a new topic/subdir only if the work genuinely doesn't fit. (HRS: adapter/address-space work lives in `experiments/identity_ae/`.)
2. **Number sequentially.** List the directory first; the next phase is `max(existing) + 1`. Variants/follow-ups get a letter (`phase77b_*`). Never guess a number — a collision silently overwrites.
3. **Write the spec, not the runner.** Author `phase<NN>_spec.md` matching the repo's spec precedent. For HRS that is: **hypothesis → setup (with named cached paths, reused datasets, frozen base in eval mode) → numbered procedure → named metrics with aggregation → pre-committed predictions with probabilities → files-to-create with full paths → directive for Code → runtime budget.** Chat designs the spec; the runner writes the execution script.
4. **Name every reused artifact by path** so the runner never has to ask back (cached models, datasets, prior-phase results like `results/identity_ae/phase47/...`).
5. **Hand off, then manage the run.** If it's a GPU run longer than ~10 min, follow `training-run-management` (register in `pop-active-jobs`, open a ledger trace, enable `monitor-pop` at launch / disable at exit, step-stamped checkpoints) and reuse the box's env per `gpu-project-env-setup` (don't reinstall torch).
6. **Sync is git, not repo-create.** New spec/script/results are committed and pushed to the *existing* remote, gated by `github-anonymization` (check before pushing). No `gh repo create`.

## Mode B anti-patterns
- 🚫 `gh repo create` for what is really one experiment in an existing project.
- 🚫 Inventing a new topic directory when an established one fits.
- 🚫 Writing the execution script in chat instead of a spec the runner executes.
- 🚫 Non-sequential or colliding phase numbers (read the directory first).
- 🚫 A spec that makes the runner ask back — unnamed paths, vague metrics, no pass/fail bar.

---

## Quick Reference
**Mode A** — new repo: `gh repo create MikeyBeez/<name> --private --source=. --remote=origin --push` (default **private**).
**Mode B** — new phase in an existing repo: locate repo → next sequential `phase<NN>` in the right topic dir → write `phase<NN>_spec.md` in the repo's spec format → hand to Code → manage run (`training-run-management`) → commit/push gated by `github-anonymization`.
**Decide first**: new repo, or a phase inside an existing project?

---
**Status**: Active - v2.1.0

## Related Protocols
[[gpu-project-env-setup]] · [[training-run-management]] · [[github-anonymization]] · [[tool-selection]]
Skill: `chat-code-handoff` (HRS chat→Code phase-spec workflow)
