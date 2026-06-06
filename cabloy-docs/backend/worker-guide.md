# Worker Guide

This guide explains how workers fit into Vona within the Cabloy monorepo.

## Why workers matter

Vona uses a distributed worker-process architecture, which means the backend runtime is naturally multi-process rather than assuming one long-lived server instance only.

This matters because operational behavior, reload behavior, queue execution, broadcast, and auth-sensitive runtime logic can all depend on worker semantics.

## `bean.worker`

A global worker-management bean provides capabilities such as:

- get current worker id
- exit current worker
- exit all workers
- reload current worker
- reload all workers
- manage alive state

This makes worker control part of the application’s operational surface.

## `SERVER_WORKERS`

Worker count can be controlled through env or command-line setup.

Representative idea:

- development often uses multiple workers to expose distributed-environment issues earlier
- single-worker modes still matter for Docker or simpler execution scenarios

A practical runtime reading in the current repo is:

- `SERVER_WORKERS` becomes part of backend server config
- `npm run dev` and `cd vona && npm run dev` normally exercise multi-worker behavior
- `dev:one`, `start:one`, and Docker-oriented single-worker flows remain important when you want simpler runtime shape or one-worker debugging

## Worker control behavior

At a high level:

- `reload()` targets the current worker
- `reloadAll()` broadcasts reload intent across workers
- `exit()` closes the current app process and exits
- `exitAll()` broadcasts a process-exit intent across workers

This matters because worker control belongs to runtime behavior, not only to deployment tooling.

## Why this matters for AI workflows

When AI touches runtime or operational backend behavior, it should ask:

1. does this assume a single-process runtime incorrectly?
2. does the behavior change across worker count or worker lifecycle?
3. is this a place where reload or worker-control operations matter?
4. should the verification path consider multi-worker behavior explicitly?

That keeps backend reasoning aligned with Vona’s actual runtime architecture.
