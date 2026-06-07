# Queue Guide

This guide explains how queues work in Vona within the Cabloy monorepo.

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
  async execute(
    data: TypeQueueAddJobData,
    _options?: IQueuePushOptions,
  ): Promise<TypeQueueAddJobResult> {
    return data.a + data.b;
  }
}
```

The important point is that queue jobs are strongly typed at both input and output boundaries.

## Push jobs

Two main modes are supported:

- `push` for fire-and-forget jobs
- `pushAsync` for jobs where the caller awaits a result

Representative patterns:

```typescript
this.scope.queue.add.push({ a: 1, b: 2 });
```

```typescript
const result = await this.scope.queue.add.pushAsync({ a: 1, b: 2 });
```

This is important because it gives queue usage a clear business-level interface.

## Push options and propagated context

`push` and `pushAsync` both support queue-push options.

Representative option areas include:

- `queueNameSub`
- `jobName`
- `jobOptions`
- `dbInfo`
- `locale`
- `instanceName`
- `extraData`

This matters because a queue push can propagate more than business payload alone. It can also carry runtime context that affects how the worker executes the job.

A practical push-context reading is:

| Field           | Typical purpose                                     |
| --------------- | --------------------------------------------------- |
| `data`          | business payload                                    |
| `queueNameSub`  | refine queue routing                                |
| `jobName`       | identify the job kind                               |
| `jobOptions`    | pass BullMQ job options                             |
| `dbInfo`        | control datasource/runtime database context         |
| `locale` / `tz` | preserve request-oriented locale/timezone context   |
| `instanceName`  | preserve instance-aware execution context           |
| `extraData`     | pass selected request metadata or auxiliary context |

## Datasource-level isolation and deadlock avoidance

One of the most important distributed queue details is datasource-level isolation.

A common risk looks like this:

1. a request opens a database transaction
2. the request pushes a queue job and awaits its result
3. the worker handling the job also needs a database connection
4. both sides could wait on the same constrained datasource pool

Vona avoids this by using datasource levels so queue work can run with an isolated datasource context.

A useful practical rule is:

- ordinary request code uses the current datasource level
- queued job execution is pushed to `current.level + 1`

Representative pattern:

```typescript
await this.scope.queue.add.pushAsync(data);
```

This behaves like passing:

```typescript
await this.scope.queue.add.pushAsync(data, {
  dbInfo: {
    level: this.bean.database.current.level + 1,
  },
});
```

So queue behavior is not only “run later.” It also participates in connection-pool isolation and distributed consistency design.

A practical refinement is:

- queue push helpers prepare and carry runtime context explicitly before execution
- that is why queue jobs can preserve datasource, locale, and instance-aware behavior without forcing the business payload itself to hold every context field

For the surrounding datasource architecture, also see [Multi-Database and Datasource Guide](/backend/multi-database-datasource) and [Dynamic Datasource Guide](/backend/dynamic-datasource-guide).

## Extra data and header passthrough

Queue pushes can also include `extraData`.

Representative pattern:

```typescript
this.scope.queue.add.push(data, {
  extraData: {
    request: {
      headers: {
        'x-custom': 'xxxx',
      },
    },
  },
});
```

The job can then read the propagated header value from request context:

```typescript
@Queue()
class QueueAdd {
  async execute(data, _options) {
    console.log(this.ctx.headers['x-custom']);
  }
}
```

Vona also provides a header passthrough convention: headers prefixed with `x-vona-data-` are appended automatically to extra data and passed through to the job context.

This is useful when background work needs selected request metadata without manually copying every field into the main business payload.

## Queue options

The queue system supports options around:

- concurrency
- transaction behavior
- Bull queue/worker/job options
- redlock-backed serial execution behavior

Representative decorator pattern:

```typescript
@Queue({
  concurrency: false,
  transaction: false,
  options: {
    queue: {},
    worker: {},
    job: {},
    redlock: {},
  },
})
class QueueAdd {}
```

That means queue behavior is not only asynchronous. It also participates in concurrency, isolation, and consistency policy.

## Configure queues in app config

Queue options can also be overridden in app config.

Representative pattern:

```typescript
config.onions = {
  queue: {
    'demo-student:add': {
      concurrency: false,
      transaction: false,
      options: {
        queue: {},
        worker: {},
        job: {},
        redlock: {},
      },
    },
  },
};
```

## Enable/disable and environment scoping

Queues can also be enabled or limited by environment metadata such as flavor or mode.

Representative pattern:

```typescript
@Queue({
  meta: {
    flavor: 'normal',
    mode: 'dev',
  },
})
class QueueAdd {}
```

This is especially important in Cabloy because runtime environment and flavor are first-class concepts.

## Relationship to startup, election, and broadcast

Read this guide together with:

- [Backend Startup Guide](/backend/startup-guide)
- [Election Guide](/backend/election-guide)
- [Broadcast Guide](/backend/broadcast-guide)
- [Worker Guide](/backend/worker-guide)
- [Schedule Guide](/backend/schedule-guide)
- [Redlock Guide](/backend/redlock-guide)

A practical split is:

- startup initializes queue workers and other runtime capabilities
- election decides which worker should own singleton-like responsibilities
- queue handles asynchronous point-to-point work
- broadcast sends the same message to multiple workers
- redlock helps serialize queue behavior when concurrent execution must be restricted

## Inspection

The queue system can expose the effective queue list for inspection, which is useful for debugging and operational visibility.

Representative pattern:

```typescript
this.bean.onion.queue.inspect();
```

## Implementation checks for background-job changes

When asked to move work into the background, ask:

1. is this a queue job instead of an inline request-path operation?
2. should the caller use `push` or `pushAsync`?
3. does the queue need transactional, serialized, or datasource-isolated behavior?
4. does the job need request metadata through `extraData` or header passthrough?
5. should enable/disable rules depend on flavor or mode?

That keeps background work aligned with Vona’s distributed execution model.
