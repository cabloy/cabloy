# Queue Guide

This page migrates the highest-value ideas from the legacy Vona queue documentation.

## Why queues matter

Vona provides a queue component based on BullMQ so business logic can be executed asynchronously and reliably through framework-native job handling.

This is one of the main bridges between synchronous application code and distributed background execution.

## Create a queue

Example: create a queue named `add` in module `demo-student`.

```bash
npm run vona :create:bean queue add -- --module=demo-student
```

## Queue definition

Representative shape:

```typescript
@Queue()
export class QueueAdd
  extends BeanQueueBase<TypeQueueAddJobData, TypeQueueAddJobResult>
  implements IQueueExecute<TypeQueueAddJobData, TypeQueueAddJobResult>
{
  async execute(data: TypeQueueAddJobData): Promise<TypeQueueAddJobResult> {
    return data.a + data.b;
  }
}
```

The important point is that queue jobs are strongly typed at both input and output boundaries.

## Push jobs

The legacy docs distinguish two main modes:

- `push` for fire-and-forget jobs
- `pushAsync` for jobs where the caller awaits a result

This is important because it gives queue usage a clear business-level interface.

## Queue options

The queue system supports options around:

- concurrency
- transaction behavior
- Bull queue/worker/job options
- redlock-backed serial execution behavior

That means queue behavior is not only “run later.” It also participates in concurrency and consistency policy.

## Enable/disable and environment scoping

The legacy docs also show that queues can be enabled or limited by environment metadata such as flavor or mode.

This is especially important in Cabloy because runtime environment and flavor are first-class concepts.

## Inspection

The queue system can expose the effective queue list for inspection, which is useful for debugging and operational visibility.

## Why this matters for AI workflows

When AI is asked to move work into the background, it should ask:

1. is this a queue job instead of an inline request-path operation?
2. should the caller use `push` or `pushAsync`?
3. does the queue need transactional or serialized behavior?
4. should enable/disable rules depend on flavor or mode?

That keeps background work aligned with Vona’s distributed execution model.
