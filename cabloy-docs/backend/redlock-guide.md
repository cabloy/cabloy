# Redlock Guide

This page migrates the highest-value ideas from the legacy Vona redlock documentation.

## Why redlock matters

In distributed systems, some operations need mutual exclusion across workers or nodes.

Vona provides a Redlock-based distributed lock abstraction so that mutual exclusion can be expressed as a framework-level capability rather than improvised with ad hoc coordination code.

## Create a redlock definition

Example: create redlock metadata in module `demo-student`.

```bash
npm run vona :create:bean meta redlock -- --module=demo-student
```

## Lock resource types

The legacy docs make an important design point: lock resources should be typed.

Representative areas include:

- lock resources for `lock`
- lock resources for `lockIsolate`

This is valuable because lock identity becomes part of the typed contract rather than a random string scattered across the codebase.

## `lock` vs `lockIsolate`

The legacy docs distinguish two lock methods:

- `lock`
- `lockIsolate`

The key difference is that `lockIsolate` incorporates datasource-level isolation to help avoid deadlocks related to datasource contention.

That is a very important Vona-specific detail.

## Template-literal resource names

The legacy docs also highlight that lock-resource types can use template literal patterns such as per-user lock names.

This is important because it lets the code remain both flexible and typed.

## Inspection

The effective redlock list can be inspected, which is useful for debugging and operational understanding.

## Why this matters for AI workflows

When AI is asked to protect a distributed critical section, it should ask:

1. does this need a distributed lock at all?
2. should it use `lock` or `lockIsolate`?
3. what should the lock resource identity be?
4. does the resource identity need a typed or templated naming scheme?

That keeps distributed locking aligned with Vona’s intended concurrency model.
