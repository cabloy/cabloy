# Broadcast Guide

This guide explains how broadcast works in Vona within the Cabloy monorepo.

## Why broadcast matters

Broadcast lets one worker emit a message that multiple worker processes can receive and act on.

This is important because some business logic is not point-to-point background work. It is multi-worker coordination work.

## Create a broadcast

Example: create a broadcast named `echo` in module `demo-student`.

```bash
npm run vona :create:bean broadcast echo -- --module=demo-student
```

## Broadcast definition

Representative shape:

```typescript
@Broadcast()
export class BroadcastEcho
  extends BeanBroadcastBase<TypeBroadcastEchoJobData>
  implements IBroadcastExecute<TypeBroadcastEchoJobData>
{
  async execute(data: TypeBroadcastEchoJobData, isEmitter?: boolean) {
    if (!isEmitter) {
      console.log(`pid: ${process.pid} message: ${data.message}`);
    }
  }
}
```

The `isEmitter` flag is especially important because it lets the current worker avoid duplicating work it already performed locally.

## Emit a broadcast

Representative usage:

```typescript
this.scope.broadcast.echo.emit({ message: 'Hello world' });
```

A practical interpretation is:

- the emitter starts the fan-out
- every receiving worker can execute the same logic
- the emitter can skip duplicate local work by checking `isEmitter`

## Broadcast options

Broadcast options include:

- `instance`
- `transaction`

Representative decorator pattern:

```typescript
@Broadcast({
  instance: true,
  transaction: true,
})
class BroadcastEcho {}
```

This matters because broadcast behavior may depend on tenant initialization or transactional execution guarantees.

## Configure broadcasts in app config

Broadcast options can also be overridden in app config.

Representative pattern:

```typescript
config.onions = {
  broadcast: {
    'demo-student:echo': {
      instance: true,
      transaction: true,
    },
  },
};
```

## Broadcast vs queue vs election

Read this guide together with:

- [Backend Startup Guide](/backend/startup-guide)
- [Queue Guide](/backend/queue-guide)
- [Election Guide](/backend/election-guide)
- [Worker Guide](/backend/worker-guide)

A practical split is:

- use **broadcast** when many workers should all receive the same signal or perform the same category of work
- use **queue** when one background execution path should process a job asynchronously
- use **election** when only one worker, or a fixed small number of workers, should own the responsibility

This distinction matters because all three features are distributed primitives, but they solve different coordination problems.

## Relationship to backend runtime initialization

Broadcast is not the same as startup.

A useful mental model is:

- startup initializes backend capabilities and lifecycle hooks
- election chooses the owner for singleton-like responsibilities
- broadcast fans out a message to many workers after the runtime is active

That keeps runtime initialization separate from runtime signaling.

## Inspection

The effective broadcast list can be inspected for debugging and operational clarity.

Representative pattern:

```typescript
this.bean.onion.broadcast.inspect();
```

## Why this matters for AI workflows

When AI sees multi-worker coordination needs, it should ask:

1. is this really a queue job, or is it a broadcast?
2. should the emitter worker also execute the business logic?
3. does the logic require instance initialization?
4. should the execution run inside a transaction?
5. is this actually a singleton-ownership problem that belongs to election instead?

That helps distribute the right kind of work through the right abstraction.
