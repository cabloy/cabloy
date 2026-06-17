# Model Resource Owner Pattern

This guide explains the resource-owner pattern built on top of Zova Model.

It uses the current `rest-resource` model as the main source specimen:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts`

Read [Model Architecture](/frontend/model-architecture) and [Model State Guide](/frontend/model-state-guide) first if you want the broader Model runtime and helper surface.

If your next question is how to apply this pattern in your own module, continue with [Using `ModelResource` in Your Module](/frontend/model-resource-usage-guide).

If your next question is how to review or constrain that pattern in a larger codebase, continue with [Resource Model Best Practices and Anti-Patterns](/frontend/model-resource-best-practices).

If your next question is which common extension shapes to implement first, continue with [Resource Model Cookbook](/frontend/model-resource-cookbook).

## Why this page exists

Many examples of Zova Model start from a small feature model:

- one list query
- one item query
- one or two mutations

Those examples are useful, but they can accidentally make Model look smaller than it really is.

The `rest-resource` specimen shows a larger pattern:

> a model can become the stable owner of one whole resource domain boundary.

That means the model is no longer only a query wrapper.

It becomes the place that owns:

- resource bootstrap
- schema access
- permissions access
- form integration
- query state
- mutation state
- cache invalidation policy

This page explains that pattern explicitly.

## What “resource owner” means in Zova

In this context, a resource-owner model is a model bean that becomes the reusable frontend boundary for one backend resource.

It is responsible for presenting one coherent surface to the rest of the UI.

Instead of asking every page, table, form, and action to individually know:

- how to resolve the resource API path
- how to fetch list data
- how to fetch row data
- how to submit create/update/delete requests
- how to obtain schema metadata
- how to choose invalidation rules

those decisions are centralized inside the model.

A practical reading takeaway is:

> the resource-owner model is the frontend resource facade.

## The source specimen

The main example is:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts`

This class is generic:

```typescript
export class ModelResource<
  Entity = any,
  EntityCreate = Partial<Entity>,
  EntityUpdate = Partial<Entity>,
> extends BeanModelBase {}
```

That already tells you something important.

This model is designed to be reused across many resource types rather than tied to one page.

## Why `enableSelector` is essential

The class is decorated like this:

```typescript
@Model<IModelOptionsResource>({
  enableSelector: true,
})
```

This matters because one generic `ModelResource` class needs to serve many different resources.

The resource name is passed into initialization:

```typescript
protected async __init__(resource: string) {
  await super.__init__(resource);
  this.resource = resource;
  ...
}
```

That means the selector becomes the runtime identity for the concrete resource instance.

So even when many consumers reuse the same generic class, each resource instance stays isolated.

This is not only conceptual isolation.

It also affects cache identity.

Because Zova Model prefixes query keys by bean identity and selector, the effective cache keys are separated by resource.

So logical keys such as:

```typescript
['select', '', hashkey(query)]
['item', id, 'view']
```

can safely exist for many resources without colliding.

## Bootstrap before normal state usage

A small feature model often starts using queries immediately.

`ModelResource` adds a bootstrap step first:

```typescript
protected async __init__(resource: string) {
  ...
  await this._bootstrap();
}
```

And `_bootstrap()` uses:

```typescript
const queryBootstrap = await $QueryAutoLoad(() => this.$sdk.getBootstrap(this.resource));
```

Then it resolves:

```typescript
this.resourceApi = this.sys.util.parseResourceApi(this.resource, queryBootstrap.data.apiPath);
```

This is an important pattern.

The model does not assume that the final operational API path is already known as a hardcoded constant.

Instead, it loads resource metadata first, then turns that metadata into the stable runtime resource API boundary.

That is one reason this model is better understood as infrastructure rather than only CRUD sugar.

## The model owns resource metadata surfaces

Inside `__init__`, the model exposes several computed resource-level surfaces:

- `permissions`
- `formProvider`
- `schemaView`
- `schemaCreate`
- `schemaUpdate`
- `schemaFilter`
- `schemaRow`
- `schemaPages`

These are not random conveniences.

They show that the model owns not only request state, but also the metadata that resource UIs need in order to render and behave correctly.

For example:

- permissions affect whether UI actions are available
- schemas affect view/create/edit/filter rendering
- form provider affects how forms are assembled

This is exactly the kind of cross-cutting ownership that fits a resource-owner model.

## Query ownership pattern

The query side is organized around a reusable internal structure.

### List/query state

The model exposes list-style querying through:

- `selectGeneral(actionPath?, query?)`
- `select(query?)`

These methods use `$useStateData(...)` and place query ownership inside the model.

That means the page does not own the fetch details or cache-key policy.

### Row-specific query state

The model exposes item-style querying through:

- `queryItem(...)`
- `view(id)`

Again, the page consumes a stable model API rather than building row fetch rules ad hoc.

A practical reading takeaway is:

> pages consume resource semantics; the model owns query semantics.

## Mutation ownership pattern

The mutation side follows the same idea.

The model does not expose only one-off raw mutation calls.

Instead, it builds a reusable mutation layer:

- `create()`
- `update(id)`
- `delete(id)`
- `mutationItem(...)`

This gives the model one place to enforce mutation-key conventions and invalidation rules.

That is an important architectural advantage.

Without this model boundary, every page or dialog could invent slightly different invalidation behavior.

## Cache-key design

One of the best design lessons in this specimen is the cache-key structure.

The class defines three related key helpers:

```typescript
protected keySelect(actionPath?: string, query?: ITableQuery) {
  return ['select', actionPath ?? '', hashkey(query)] as const;
}

protected keyItemRoot(id: TableIdentity) {
  return ['item', id] as const;
}

protected keyItem(id: TableIdentity, action: string) {
  return ['item', id, action] as const;
}
```

This separates resource state into three layers:

- list/query scope
- row root scope
- row action scope

That structure gives the model precise invalidation control.

## Invalidation policy as model-owned policy

The model also centralizes invalidation behavior.

### Create

`create()` invalidates:

- `['select']`

That makes sense because a new row affects list-level state first.

### Update/Delete

`mutationItem(...)` invalidates:

- `['select']`
- `keyItemRoot(id)`

That means:

- list views refresh when row mutations change aggregate list state
- row-specific state refreshes when one row changes

This is a very important design point.

The model itself defines consistency rules for resource state.

That keeps cache policy close to resource semantics rather than scattering it across UI code.

## Form integration pattern

`ModelResource` also owns form-facing behavior.

Representative methods:

- `getFormSchema(formMeta)`
- `getFormApiSchemas(formMeta)`
- `getFormMutationSubmit(formMeta, id?)`
- `getFormData(formMeta, id?)`
- `getQueryDataDefaultValue(schemaName?)`

This is what makes the model a real resource facade instead of only a transport helper.

The model translates resource semantics into form semantics.

For example:

- create form → use create schema and create mutation
- update form → use update schema and update mutation
- view form → use view schema and row data query

This keeps form orchestration aligned with the same resource owner that already owns queries and mutations.

## Relationship to `$fetch`, `$sdk`, and OpenAPI

`ModelResource` also shows how multiple frontend data layers can be composed cleanly.

Inside one model boundary it uses:

- `$fetch` for direct REST request execution
- `$sdk` for bootstrap, schema, permissions, and default-value helpers
- model helpers for cached query/mutation state

That composition matters.

It shows that the server-data ladder is not a set of isolated choices.

A higher-level model can combine those layers into one coherent business-facing API.

## When to use this pattern

Use a resource-owner model when:

- many screens or widgets depend on the same backend resource
- schema metadata, permissions, and CRUD behavior should stay aligned
- form behavior should stay aligned with the same resource owner
- cache invalidation rules should be centralized
- you want one stable frontend boundary for resource-level business semantics

This pattern is especially strong for admin-style, resource-driven UIs.

## When not to use this pattern

Do not reach for this pattern by default when:

- the state is truly page-local and disposable
- the feature only needs one tiny query with no reusable semantics
- there is no meaningful resource-level schema/permission/form ownership
- adding a generic resource facade would be heavier than the real business problem

In those cases, a smaller feature model may be the better fit.

## A useful comparison

A compact comparison is:

- `demo-todo` → minimal feature model pattern
- `home-passport` → SSR-sensitive state ownership pattern
- `rest-resource` → generic reusable resource-owner pattern

Use these three together when reading how far Zova Model can scale.

## Source-reading checklist

When you read `ModelResource`, focus on these questions:

1. where does the selector identity come from?
2. where does `resourceApi` become available?
3. which state belongs to list scope vs row scope?
4. which invalidation rules belong to each mutation?
5. which responsibilities are query-related and which are schema/form-related?
6. what would become duplicated across pages if this model did not exist?

Those questions will help you see the architectural pattern, not only the method list.

## Final takeaway

The most important insight is simple:

> a Zova model can be more than a data hook wrapper. `ModelResource` can become the stable owner of one whole frontend resource boundary.

In application code, prefer using that owner directly or adding a thin facade over it, rather than creating a competing second owner for the same resource.
