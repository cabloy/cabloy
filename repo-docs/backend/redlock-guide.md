# Redlock Guide

This guide explains how Redlock works in Vona within the Cabloy monorepo.

## Why redlock matters

In distributed systems, some operations need mutual exclusion across workers or nodes.

Vona provides a Redlock-based distributed lock abstraction so that mutual exclusion can be expressed as a framework-level capability rather than improvised with ad hoc coordination code.

## Create a redlock definition

Example: create redlock metadata in module `training-student`.

```bash
npm run vona :create:bean meta redlock -- --module=training-student
```

## Lock resource types

One important design point is that lock resources should be typed.

Representative areas include:

- lock resources for `lock`
- lock resources for `lockIsolate`

This is valuable because lock identity becomes part of the typed contract rather than a random string scattered across the codebase.

## `lock` vs `lockIsolate`

Two lock methods are supported:

- `lock`
- `lockIsolate`

The key difference is that `lockIsolate` incorporates datasource-level isolation to help avoid deadlocks related to datasource contention.

That is a very important Vona-specific detail.

## Template-literal resource names

Lock-resource types can also use template literal patterns such as per-user lock names.

This is important because it lets the code remain both flexible and typed.

## Inspection

The effective redlock list can be inspected, which is useful for debugging and operational understanding.

## Implementation checks for distributed-lock changes

When asked to protect a distributed critical section, ask:

1. does this need a distributed lock at all?
2. should it use `lock` or `lockIsolate`?
3. what should the lock resource identity be?
4. does the resource identity need a typed or templated naming scheme?

That keeps distributed locking aligned with Vona’s intended concurrency model.
