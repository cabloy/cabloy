# Broadcast Guide

This page migrates the highest-value ideas from the legacy Vona broadcast documentation.

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

## Broadcast options

The legacy docs highlight options such as:

- `instance`
- `transaction`

This matters because broadcast behavior may depend on tenant initialization or transactional execution guarantees.

## Inspection

The effective broadcast list can be inspected for debugging and operational clarity.

## Why this matters for AI workflows

When AI sees multi-worker coordination needs, it should ask:

1. is this really a queue job, or is it a broadcast?
2. should the emitter worker also execute the business logic?
3. does the logic require instance initialization?
4. should the execution run inside a transaction?

That helps distribute the right kind of work through the right abstraction.
