# Model Architecture

This guide explains the architecture of Zova Model in the Cabloy monorepo.

It focuses on the Zova-native role of Model first, then connects that role to the current `a-model` source implementation.

## Why Zova models matter

Zova uses a unified `Model` mechanism to manage several kinds of frontend state that other stacks often split across unrelated tools.

This is one of the most important architectural ideas in Zova.

The key point is not only caching remote data.

The deeper point is that Zova gives state a dedicated bean-oriented home with:

- framework-managed identity
- query-key namespacing
- persistence options
- SSR-aware hydration behavior
- reuse across pages, components, and services

## Zova-native role of a model

A Zova model is a **model bean**.

It is not only a generic Vue composable and it is not only a thin request wrapper.

Its architectural job is to own data that benefits from broader lifecycle and reuse behavior, especially when that data is:

- asynchronous server data
- local-storage data
- cookie-backed data
- in-memory cache-oriented data
- persistence-aware state that should survive page transitions or refreshes

In practice, a model often sits above `$api` and below page rendering:

- `$fetch` handles transport-oriented access
- `$api` handles business-oriented service methods
- `Model` handles cached, reusable, UI-friendly state ownership

Read together with [Server Data](/frontend/server-data) when deciding which abstraction layer a feature should use.

If you want the larger docs-style overview of how ownership, scope, persistence, cache semantics, and SSR behavior connect in big Vue applications, read [State Architecture for Vue Developers](/frontend/state-architecture-for-vue-developers) before diving deeper into model internals.

If your next question is how the generic lower-level model runtime works beneath these abstractions, continue with [A-Model Under the Hood](/frontend/a-model-under-the-hood).

## Relationship to TanStack Query

One current-source fact is explicit: Zova Model is built on top of TanStack Query.

That matters because Zova is not replacing TanStack Query with a separate state engine.

Instead, Zova wraps TanStack Query inside a model-bean architecture so that:

- query and mutation APIs fit naturally into the bean system
- sync and async state categories can use one broader model surface
- persistence and SSR behavior are expressed in one place
- model identity becomes part of cache identity

## Public authoring surface

Representative model definition:

```typescript
import { Model } from 'zova';
import { BeanModelBase } from 'zova-module-a-model';

@Model()
export class ModelTodo extends BeanModelBase {}
```

At source level, `@Model()` is a bean decorator factory:

- `zova/src/suite-vendor/a-zova/modules/a-model/src/lib/model.ts`

That file shows that a model is registered on the `model` onion/scene rather than being a special-case standalone mechanism.

### A practical thin-facade example

This subsection is the first layer of a small source-reading chain around same-resource model facades.

Use the three related pages in this order when your question is specifically about a same-resource custom facade:

1. this page for the broader role of Zova Model
2. [Generated Contract Consumption: Entry Branch](/frontend/generated-contract-consumption-entry-branch) for the consumer-side handoff into the owner
3. [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive) for the owner internals that make that handoff work

A current example of a model staying intentionally thin is:

- `zova/src/suite/a-training/modules/training-student/src/model/student.ts`

That file is useful for one specific architectural point:

- `ModelResource` remains the stable resource owner
- the module model adds resource-specific methods such as `summary(id)` and `deleteForce(id)`
- those methods still delegate to owner-level helpers such as `queryItem(...)` and `mutationItem(...)`

A compact source-reading path for this pattern is:

1. `zova/src/suite/a-training/modules/training-student/src/model/student.ts`
2. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts`
3. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx`

This is a good pattern when custom frontend behavior still belongs to the same resource and should continue to participate in resource-owned query, mutation, and form semantics.

For the entry-branch consumer path that uses this owner-preserving pattern, continue with [Generated Contract Consumption: Entry Branch](/frontend/generated-contract-consumption-entry-branch).
For the deeper owner internals behind `queryItem(...)`, `mutationItem(...)`, and form-derived helpers, continue with [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive).

It is not the whole story of Zova Model.
It is a narrow example of resource-owner-preserving facade design inside the broader model architecture.

## The core architectural idea

The most important current-source insight is this:

> Zova unifies remote state and several local state categories around query-cache semantics, then exposes that system through model beans.

That is why model APIs look broader than a normal “data fetching helper”.

Even local, cookie, db, and mem state are expressed through model helpers that still participate in model-owned keying, restore, invalidation, and SSR rules.

## Five state families in the current model layer

The `a-model` source exposes five main state families through `BeanModelBase` helpers:

- `data` → remote/query-style state through `$useStateData(...)`
- `mem` → in-memory state through `$useStateMem(...)`
- `local` → local-storage state through `$useStateLocal(...)`
- `cookie` → cookie-backed state through `$useStateCookie(...)`
- `db` → async persisted state through `$useStateDb(...)`

This is why Zova Model is better understood as a **unified model-state layer** rather than only a remote-data wrapper.

## How the runtime is assembled

A compact source-confirmed runtime path is:

1. `@Model()` registers the class as a model bean
2. the `a-model` module monkey bootstraps a shared `QueryClient`
3. the monkey injects `$queryClient` onto bean instances
4. `BeanModelBase` composes query, mutation, state, and persistence helpers
5. helper calls automatically prefix query keys with model identity
6. persistence and SSR behavior are applied from model metadata and module config

### 1. `@Model()` registers a model bean

Source:

- `zova/src/suite-vendor/a-zova/modules/a-model/src/lib/model.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/types/model.ts`

These files confirm that:

- models are bean-based
- the scene/onion name is `model`
- model decorator options currently include `enableSelector?: boolean`

### 2. The module bootstraps a shared query client

Source:

- `zova/src/suite-vendor/a-zova/modules/a-model/src/monkey.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/service/storage.ts`

These files show that the module:

- creates a `QueryClient`
- installs `VueQueryPlugin`
- injects `$queryClient` onto bean instances
- owns SSR dehydrate/hydrate behavior for query state

This is important because model code does not manually construct its own query client.

## `BeanModelBase` is a composed capability stack

`BeanModelBase` is a reusable base, not just an empty convenience class.

Representative source path:

- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.modelBase.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/`

The current source composes a layered model base that provides:

- query helpers
- mutation helpers
- state helpers
- persistence helpers
- cookie/local/db adapters
- selector-aware key prefixing

For source reading, the most important files are:

- `bean.model.useQuery.ts`
- `bean.model.useMutation.ts`
- `bean.model.useState.ts`
- `bean.model.query.ts`
- `bean.model.persister.ts`

## Automatic namespacing and selector-aware identity

One of the most important source-level behaviors is automatic key prefixing.

Model helpers do not only use the caller-provided `queryKey`.

They first prefix it with the model bean identity, and when `enableSelector` is enabled they also prefix it with the selector value.

That means a logical user key such as:

```typescript
['list'];
```

becomes model-owned cache identity rather than a globally ambiguous key.

This is one reason model state can scale more safely across larger apps.

## Persistence architecture

The current model layer supports several persistence strategies:

- `mem` → no persistence
- `local` → sync local storage
- `cookie` → sync cookie storage
- `db` → async persisted storage through `localforage`

Representative source files:

- `bean.model.useState.ts`
- `bean.model.persister.ts`
- `bean.model.local.ts`
- `bean.model.cookie.ts`
- `common/cookieWrapper.ts`

A key design detail is that persistence is treated as an extension of model-owned query state rather than as a separate unrelated subsystem.

## SSR behavior

Zova Model is SSR-aware.

Important current-source behavior includes:

- server render dehydrates query state into SSR deferred state
- client pre-hydration hydrates that query state back into the client query client
- mutations are not dehydrated
- sync persisted state such as `local` and `cookie` is not treated the same way as dehydrated async query state
- `db` state is explicitly marked not to dehydrate

Representative source files:

- `service/storage.ts`
- `config/config.ts`
- `types/query.ts`
- `bean.model.useQuery.ts`
- `bean.model.useState.ts`

This matters because a model choice can affect hydration behavior, not only local developer ergonomics.

## When state should live in a model

A model is usually a good fit when one or more of these are true:

- multiple pages or components need the same data
- remote data should be cached and invalidated consistently
- the state has persistence value across route changes or reloads
- SSR and hydration behavior matter
- the data should have a dedicated owner separate from one page controller

A model is often **not** the first choice when:

- the state is purely page-local and short-lived
- the data has no reuse value outside one controller
- plain controller fields already express the intent clearly

That is why Zova asks a different first question than many Vue stacks.

Instead of asking only “should this be a store?”, it is often better to ask:

1. which bean should own this data?
2. does the data need model-level caching or persistence?
3. does SSR or reuse make a model the right boundary?

## Source-reading path for Model

If you want the shortest accurate path from public docs into current source, use this order:

1. this page
2. [Model State Guide](/frontend/model-state-guide)
3. [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
4. [Zova Source Reading Map](/frontend/zova-source-reading-map)
5. `zova/src/suite/a-demo/modules/demo-todo/src/model/todo.ts`
6. `zova/src/suite-vendor/a-zova/modules/a-model/src/lib/model.ts`
7. `zova/src/suite-vendor/a-zova/modules/a-model/src/monkey.ts`
8. `zova/src/suite-vendor/a-zova/modules/a-model/src/service/storage.ts`
9. `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useState.ts`
10. `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.persister.ts`

Use representative real models next when you want a richer case:

- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts`
- `zova/src/suite/a-home/modules/home-passport/src/model/passport.ts`
- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts`

The `rest-resource` model is especially important because it shows that Zova Model is not only for small feature-local caching.

It also supports **generic infrastructure models** that:

- use `enableSelector` to isolate one model instance per resource
- bootstrap resource metadata before normal state usage
- combine `$fetch`, `$sdk`, and model state in one reusable resource owner
- expose schema, permissions, form helpers, and CRUD query/mutation flows through one model boundary
- centralize invalidation rules for list and item-level resource state

That example is a good reading target when you want to understand how Zova Model can become a reusable full-feature resource facade instead of only a thin data wrapper.

## Practical implications for frontend state design

When asked to add frontend state, do not immediately assume a generic Vue/Pinia-style answer.

A better default is to ask:

1. is this state already a good fit for a Zova model?
2. is the data async, mem, local, cookie, or db-oriented?
3. do caching, invalidation, or persistence matter?
4. does SSR or hydration make the model layer especially valuable here?
5. is there already a model bean that should own this state instead of adding a new ad hoc state container?

That keeps the code aligned with Zova’s actual architecture.

## Final takeaway

The most important architectural insight is simple:

> Zova Model is a model-bean layer built on top of TanStack Query that unifies async data, local persistence, cookie state, db persistence, and in-memory state behind one model-owned runtime.

Once that clicks, the model APIs stop looking like isolated helpers and start reading as one coherent state architecture.
