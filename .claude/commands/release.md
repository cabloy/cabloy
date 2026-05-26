---
name: release
description: Run the cabloy release workflow. Use when the user asks to "release", "publish", "deploy", "bump version", "create release", "release patch", "release minor", or "release major". Handles version bump, AI changelog generation, npm publish, and GitHub release creation.
version: 1.0.0
---

# Cabloy Release

Run the release workflow for the cabloy package. The release script at `scripts/release.ts` performs 4 steps:

1. **Version bump** — Detects changes since last `cabloy@*` tag, bumps `package.json` version, commits + tags + pushes
2. **AI Changelog** — Calls Anthropic API to summarize commits into categorized changelog, writes to `CHANGELOG.md`
3. **npm publish** — Publishes the package to npm registry
4. **GitHub release** — Creates a GitHub release with changelog notes

## Commands

| Command | Description |
|---------|-------------|
| `pnpm release-patch` | Full release with patch version bump |
| `pnpm release-minor` | Full release with minor version bump |
| `pnpm release-major` | Full release with major version bump |
| `pnpm release` | Full release with default patch bump |
| `pnpm release:dry-run` | Preview what would happen without executing |
| `pnpm release:changelog` | Only generate changelog (no version bump) |
| `pnpm release:publish` | Only publish to npm |
| `pnpm release:github` | Only create GitHub release |

## CLI Options

| Option | Description |
|--------|-------------|
| `--dry-run` | Show what would happen without executing |
| `--changelog-only` | Only generate changelog (no version bump) |
| `--publish-only` | Only publish to npm |
| `--release-only` | Only create GitHub release |
| `--skip-changelog` | Skip changelog generation |
| `--skip-publish` | Skip npm publish |
| `--skip-release` | Skip GitHub release |
| `--no-ai` | Use raw commit list instead of AI for changelog |

## Execution

Run the appropriate command based on the user's request. Default to `pnpm release-patch` if no specific bump type is mentioned.

Before running, check if the working tree is clean (the script will also check). If there are uncommitted changes, ask the user to commit or stash first.

If a step fails partway through, the remaining steps can be run individually using the `--changelog-only`, `--publish-only`, or `--release-only` flags.

### Environment Requirements

- `ANTHROPIC_AUTH_TOKEN` — Required for AI changelog generation
- `ANTHROPIC_BASE_URL` — Optional, defaults to `https://api.anthropic.com`
- `ANTHROPIC_MODEL` — Optional, defaults to `claude-sonnet-4-20250514`
- `gh` CLI — Required for GitHub release, must be authenticated
