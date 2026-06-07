# SSR Init Data

This guide explains how SSR init data works in Zova within the Cabloy monorepo.

## Why init data matters

SSR needs data to be ready on the server before the rendered result is sent to the client.

Zova’s SSR model makes this feel natural by letting controllers prepare the needed data in `__init__`, while model-based state handles synchronization and hydration.

## Representative pattern

A representative pattern looks like this:

```typescript
@Controller()
export class ControllerPageTodo {
  @Use()
  $$modelTodo: ModelTodo;

  protected async __init__() {
    const queryTodos = this.$$modelTodo.select();
    await queryTodos.suspense();
    if (queryTodos.error) throw queryTodos.error;
  }
}
```

## What is happening here

1. a model bean encapsulates the data access path
2. the controller injects the model
3. `__init__` prepares the data on the server
4. model-based SSR support synchronizes that data to the client and completes hydration automatically

## Implementation checks for SSR data-loading changes

When changing SSR pages, avoid inventing parallel data-loading patterns unless there is a real reason.

A better default is:

- use the existing model abstraction
- prepare data in `__init__`
- let hydration reuse the server-prepared cache on the client

That keeps SSR code aligned with Zova’s intended flow.
