# Create Project Protocol

## Metadata
- **ID**: create-project
- **Version**: 2.0.0
- **Tier**: 3 (Task-specific)
- **Status**: active
- **Purpose**: Guide the creation of a new project or repository with proper structure, version control, and GitHub integration over SSH. Ensures repo creation is a recognized, logged step instead of an ad-hoc one.
- **Created**: 2026-06-20 (ported from the legacy foundation `create-project.js`, which was never in the live markdown library)

## Trigger Conditions (MUST ACTIVATE)
- **WHEN**: User asks to create a new project, repo, or codebase
- **WHEN**: User says "make a git repo", "push this to GitHub", "set up a new repo", "scaffold a project"
- **WHEN**: An existing local directory needs to become a tracked GitHub repo
- **PRIORITY**: Standard (Tier 3)
- **Trigger keywords**: repo, repository, project, create, new, scaffold, init, git, github, push, gh.

## Core Principle
"Ask before assuming, then just do it." Confirm the few decisions that actually
matter (name, visibility), then run the workflow with the tools on the Mac rather
than telling Mikey what to type.

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

## Anti-patterns
- 🚫 Committing a live database or logs (state, not source — gitignore them).
- 🚫 Using an HTTPS remote when the account is configured for SSH.
- 🚫 Creating a repo without first reviewing `git status` for secrets/large files.
- 🚫 Doing it silently — if there's a create-project step, it should be logged.

## Quick Reference
**Trigger**: "create/new repo or project", "push to GitHub"
**Prereqs**: git + gh + `gh auth status` (SSH)
**Create**: `gh repo create MikeyBeez/<name> --private --source=. --remote=origin --push`
**Default visibility**: private

---
**Status**: Active - v2.0.0
