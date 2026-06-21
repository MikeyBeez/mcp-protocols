# GitHub Anonymization Protocol (Pre-Push Safety)

## Metadata
- **ID**: github-anonymization
- **Version**: 1.0.0
- **Tier**: 1 (Critical System Protocol)
- **Status**: active
- **Purpose**: Before ANY push to a remote — especially a public one — check the content for secrets and personal information. Never push un-anonymized or sensitive content. Check BEFORE pushing, not after.
- **Created**: 2026-06-21
- **Source**: Mikey directive 2026-06-21 — "make sure anything pushed to a repo is anonymized" / "you have to check before pushing." (Written after a backup pass pushed to public repos with no pre-push scan.)

## Purpose
A push is irreversible exposure. Treat every push as a publish decision and gate it on a check that runs first, every time.

## Core Principle
**Once it is on GitHub it can be cloned, cached, and scraped before you can pull it back. So the check happens BEFORE the push, on the files that will actually be pushed, and a public repo gets a stricter bar than a private one. When in doubt, keep it private.**

## Trigger Conditions
- **WHEN** about to push, publish, or create a remote repo, or back anything up to GitHub.
- **Trigger keywords**: push, git push, github, commit and push, publish, make public, gh repo create, backup to github, back up repo, remote, origin, share the repo, push to a repo.

## Execution Steps

### 1. Know the destination
Check the remote's visibility first: `gh repo view <owner>/<repo> --json visibility`. PUBLIC → strict scan. PRIVATE → still scan, lower bar. A personal-system / infrastructure repo defaults to PRIVATE.

### 2. Scan the TRACKED files (not the working dir)
Use `git ls-files` — gitignored content (node_modules, .env, *.db) is not pushed, so scanning the working directory both misses what is tracked and false-alarms on what is not. In the tracked set, look for:
- **SECRETS (block, always)**: API keys (sk-…, ghp_…, AKIA…, AIza…, xox?-…, Bearer …), private keys (BEGIN … PRIVATE KEY), passwords, tokens, .env values, connection strings.
- **PII (anonymize for public)**: home paths (`/Users/<name>/…`), real email, real name, LAN/host IPs, private project or people names, machine names.

### 3. On a secret → STOP
Do not push. Remove it; if it was ever committed, rotate the credential and scrub it from history. A secret in a "private" repo is still a secret.

### 4. On PII in a public repo → anonymize or privatize
Replace home paths with `$HOME`/`~`/`<you>`, redact IPs, use placeholders — OR make the repo private. Do not anonymize a live config in a way that breaks it; prefer env vars / templating, or keep that repo private.

### 5. Anonymize commit identity
Use a GitHub noreply email (e.g. `<user>@users.noreply.github.com`) so commit metadata does not leak the real address.

### 6. Only after the scan is clean → push
Never the other way around. Never auto-push on a schedule without a per-push scan.

## Anti-Patterns
- Pushing first and checking after.
- Pushing to a repo without knowing whether it is public.
- Scanning the working dir instead of the tracked files.
- Leaving a committed secret because "the repo is private."
- A scheduled auto-push with no per-push scan.

## Quality Checks
- Did you check the repo's visibility BEFORE pushing?
- Did you scan the TRACKED files for secrets and PII?
- Did you block on any secret and anonymize PII for public repos?
- Was the content clean before the push happened?

## Related Protocols
[[error-recovery]] · [[tool-selection]] · [[code-review]]

---
**Status**: Active — Critical System Protocol
