# Reference

This page is the reference hub for shared monorepo commands, package lookup, directory lookup, and shared terminology.

## What Reference is responsible for

- shared monorepo command entrypoints
- CLI lookup and command-surface discovery
- package lookup across the repository
- backend and frontend directory lookup
- shared terminology and glossary support

## How to approach reference work

For contributor and automation workflows in this repository, prefer this order:

1. inspect the root `package.json` when you need the shared workflow entrypoints
2. inspect the CLI reference before inferring command families from memory
3. use package and directory lookup pages when the task is about locating code, modules, or shared terms
4. pair Reference pages with Backend, Frontend, or Fullstack guides when lookup alone is not enough

## Reference reading paths

Use Reference as the lookup area for shared commands, package discovery, directory lookup, and shared terminology.

### Workflow entry path

Start here when you first need the shared monorepo command surface:

- [Repo Scripts](/reference/repo-scripts)
- [CLI Reference](/reference/cli-reference)
- [Fullstack CLI](/fullstack/cli)

### Structure and lookup path

Use this path when you need to find where packages, backend directories, frontend directories, or shared terms live:

- [Package Map](/reference/package-map)
- [Backend Directory Structure](/reference/backend-directory-structure)
- [Frontend Directory Structure](/reference/frontend-directory-structure)
- [Glossary](/reference/glossary)

## Edition impact

Cabloy Start keeps the same high-level workflow pattern while using different frontend flavors such as `cabloyStartAdmin` and `cabloyStartWeb`, plus its own SSR site baselines and project assets in its separate public repository.

When documenting or automating flavor-specific commands, always confirm the active repo first.
