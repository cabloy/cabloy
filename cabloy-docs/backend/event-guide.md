# Event Guide

## Why events matter in Vona

Vona provides a framework-native event mechanism so backend code can publish extensible business signals without hardwiring every downstream action into one method body.

That matters because registration, activation, auditing, notifications, and other backend workflows often need layered reactions that should remain composable.

## Core event model

Vona’s event system is built around two concepts:

- **event**
- **event listener**

An event can have multiple listeners, and listeners execute with an onion-style chaining model.

That means listeners can:

- observe the event
- modify the event data before passing it onward
- wrap the next listener or default method
- contribute to the final result

## Event definition

An event is defined as a typed bean.

Representative generation workflow:

```bash
npm run vona :create:bean event echo -- --module=training-student
```

Representative pattern:

```typescript
export type TypeEventEchoData = string;
export type TypeEventEchoResult = string | undefined;

@Event()
export class EventEcho extends BeanEventBase<TypeEventEchoData, TypeEventEchoResult> {}
```

This makes event payload and result types part of the framework model instead of untyped side-channel data.

## Emitting events

### Asynchronous emit

```typescript
const result = await this.scope.event.echo.emit('Hello World');
```

### Synchronous emit

```typescript
const result = this.scope.event.echo.emitSync('Hello World');
```

## Default method support

Both `emit` and `emitSync` can accept a default method.

Representative pattern:

```typescript
const result = await this.scope.event.echo.emit('Hello World', async data => {
  return `default: ${data}`;
});
```

The default method receives the latest event data after listener processing, which is important because listeners can transform the payload before passing it onward.

## Event listener definition

Event listeners attach through `@EventListener({ match: ... })`.

Representative generation workflow:

```bash
npm run vona :create:bean eventListener echo -- --module=training-student
```

Representative pattern:

```typescript
@EventListener({ match: 'training-student:echo' })
export class EventListenerEcho implements IEventExecute<TypeEventData, TypeEventResult> {
  execute(data: TypeEventData, next: NextEventSync<TypeEventData, TypeEventResult>) {
    const dataNew = `${data}!`;
    return next(dataNew);
  }
}
```

This pattern shows the key ideas:

- listeners match one or more named events
- listeners can transform event data
- listeners pass control onward through `next(...)`

A practical typing rule is to import the event’s data/result types into the listener instead of redefining them independently, so the event contract stays coupled at the type level while remaining decoupled at the execution level.

## Event ordering

Multiple listeners can attach to the same event.

Vona supports execution ordering through:

- `dependencies`
- `dependents`

That allows event listener chains to stay explicit instead of relying on accidental load order.

A useful rule of thumb is:

- use `dependencies` when another listener must run before the current one
- use `dependents` when the current listener must run before another named listener

## Enable/disable and runtime scope

Event listeners can be controlled through:

- app-config enable/disable
- `mode`
- `flavor`

This is important because some event-driven behavior should only apply in certain environments.

## Inspection

Vona can inspect the effective event-listener list for a named event.

Representative pattern:

```typescript
this.bean.onion.eventListener.inspectEventListener('training-student:echo');
```

This is useful for debugging event composition and verifying which listeners are active.

That inspect step is especially valuable before changing ordering metadata, because it lets you confirm the effective chain first instead of guessing from module load order.

## Relationship to user-access workflows

The event model is especially important in user-access flows.

Representative examples include:

- registration events
- activation events
- post-registration follow-up such as email confirmation
- role-assignment follow-up logic

Mail delivery is a common downstream effect in these flows; see [Mail Guide](/backend/mail-guide).

Read this together with [User Access Guide](/backend/user-access-guide) when the event flow is tied to identity lifecycle behavior.

## When to use events instead of direct calls

Use events when:

- one business action may need multiple follow-up behaviors
- extension logic should remain decoupled from the initiating method
- you want project-level customization without rewriting the original flow

Use direct calls when:

- the behavior is tightly bound to the core logic and should not be extensible as a chain

A practical example from the user-access layer is registration and activation: the core user flow can stay small, while follow-up concerns such as mail confirmation or role assignment move into listeners.

## Implementation checks for event-driven backend changes

When editing event-driven backend behavior, ask:

1. should this be an event instead of a direct call chain?
2. is the payload/result shape already captured by an existing typed event?
3. does the workflow need synchronous or asynchronous event emission?
4. should listener ordering, enable/disable, or runtime environment rules be explicit?

That helps AI keep extension logic aligned with Vona’s event model instead of embedding it into unrelated service methods.
