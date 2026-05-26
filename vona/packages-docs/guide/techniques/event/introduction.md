# Events

VonaJS provides an event mechanism, consisting of `Event` and `Event listener`

An `event` can have multiple `event listeners`, which execute using the `onion model`

## Create Event

For example, create an event: `echo` in the module `demo-student`, passing the event parameter `Hello World` when the event is emitted.

### 1. Cli command

```bash
$ vona :create:bean event echo --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Bean/Event`
:::

## Event Definition

```typescript
export type TypeEventEchoData = string;

export type TypeEventEchoResult = string | undefined;

@Event()
export class EventEcho extends BeanEventBase<TypeEventEchoData, TypeEventEchoResult> {}
```

- `TypeEventEchoData`: Defines the parameter type
- `TypeEventEchoResult`: Defines the result type

## Emitting Asynchronous Event: emit

### 1. emit

Passing the event parameter `Hello World` when emitting the event, and returning the result.

```diff
class ControllerStudent {
  @Web.get('test')
  async test() {
+   const result = await this.scope.event.echo.emit('Hello World');
    console.log(result);
  }
}
```

- `this.scope.event.echo`: Gets the `echo` event instance through the Scope object

### 2. Default Method

A default method can be provided when emitting the event.

```diff
class ControllerStudent {
  @Web.get('test')
  async test() {
+   const result = await this.scope.event.echo.emit('Hello World', async data => {
+     return `default: ${data}`;
+   });
    console.log(result);
  }
}
```

- Default method parameter `data`: Event listeners can modify event parameters during execution, so the `data` parameter is required to ensure that the current method uses the latest event parameters

## Emitting Synchronous Event: emitSync

### 1. emitSync

Pass the event parameter `Hello World` when emitting the event and return the result.

```diff
class ControllerStudent {
  @Web.get('test')
  async test() {
+   const result = this.scope.event.echo.emitSync('Hello World');
    console.log(result);
  }
}
```

- `this.scope.event.echo`: Get the `echo` event instance through the Scope object

### 2. Default method

A default method can be provided when emitting the event.

```diff
class ControllerStudent {
  @Web.get('test')
  async test() {
+   const result = this.scope.event.echo.emitSync('Hello World', data => {
+     return `default: ${data}`;
+   });
    console.log(result);
  }
}
```

- Default method parameter `data`: Event listeners can modify event parameters during execution, so the `data` parameter is required to ensure that the current method uses the latest event parameters
