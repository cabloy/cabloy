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
4. successful eligible Query Cache state is captured in the SSR handoff
5. client SSR pre-hydration restores that cache before the client model consumes it

## What hydration reuses

The initial SSR handoff reuses model Query Cache data, not only `$useStateData(...)` results. A successful eligible `$useStateMem(...)` value can also transfer from the server to the initial client runtime even though it has no browser persistence backend.

Client reuse requires the model call to resolve to the same effective query key: Zova prefixes the logical key with Model identity and, for selector-enabled models, selector identity. State marked with `meta.ssr.dehydrate: false` is excluded. This handoff does not make memory state durable across a later browser reload, and it does not guarantee that every client query avoids fetching.

For helper selection, read [Model State Guide](/frontend/model-state-guide). For the dehydration filter and QueryClient lifecycle, read [A-Model Under the Hood](/frontend/a-model-under-the-hood).

## Implementation checks for SSR data-loading changes

When changing SSR pages, avoid inventing parallel data-loading patterns unless there is a real reason.

A better default is:

- use the existing model abstraction
- prepare data in `__init__`
- let hydration reuse the server-prepared cache on the client

That keeps SSR code aligned with Zova’s intended flow.
