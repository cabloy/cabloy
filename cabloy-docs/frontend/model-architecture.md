# Model Architecture

This guide explains the overall model architecture in Zova within the Cabloy monorepo.

## Why Zova models matter

Zova uses a unified `Model` mechanism to manage several kinds of data that other frontend stacks often split across unrelated tools.

This is one of the most important architectural ideas in Zova.

## Four kinds of global state

The model architecture can be understood through four common data categories:

- asynchronous data, usually from the server
- local storage data
- cookie data
- in-memory data

In Zova, these can all participate in one broader model-centered system instead of forcing developers to switch between unrelated mental models.

## Relationship to TanStack Query

One key point is explicit: the base of Zova Model is TanStack Query.

That matters because Zova is not discarding the strengths of TanStack Query. It is building a more unified and framework-friendly usage model on top of it.

## Key model capabilities

Several important capabilities remain central in the unified docs:

### 1. Support for async and sync data

The model system is not limited to server data. It also extends the same broader mechanism to synchronous data categories.

### 2. Automatic caching

Remote data can be cached locally, while local-storage or cookie-backed data can be accessed through unified model patterns.

### 3. Automatic update behavior

The model system supports data freshness and update behavior instead of treating state as static snapshots.

### 4. Reduced duplicate requests

When multiple parts of the app need the same data, the framework avoids unnecessary repeated requests.

### 5. Memory optimization

Model-managed data does not need to occupy memory forever. Cache lifecycle and release behavior matter, especially for large long-running applications.

### 6. Persistence

Model-managed data can participate in persistence strategies so refreshes do not always mean starting from nothing.

### 7. SSR support

The model system helps smooth out SSR differences across data categories and makes hydration more natural.

### 8. Namespace isolation

Because data is managed through model beans, the bean identity itself helps provide namespace isolation and reduces collision risk.

## Create a model bean

Representative pattern:

```typescript
import { Model } from 'zova';
import { BeanModelBase } from 'zova-module-a-model';

@Model()
export class ModelTodo extends BeanModelBase {}
```

## Practical implications for frontend state design

When asked to add frontend state, do not immediately assume a generic Vue/Pinia-style answer.

A better default is to ask:

1. is this state already a good fit for a Zova model?
2. is the data async or sync, and does that distinction matter to the model choice?
3. does SSR or persistence make the model layer especially valuable here?
4. is there already a model bean that should own this state instead of adding a new ad hoc state container?

That keeps the code aligned with Zova’s actual architecture.
