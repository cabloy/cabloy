# Resource Model Cookbook

This cookbook collects common extension scenarios for resource-oriented models built on top of `ModelResource`.

It is the practical companion to:

- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- [Using `ModelResource` in Your Module](/frontend/model-resource-usage-guide)
- [Resource Model Best Practices and Anti-Patterns](/frontend/model-resource-best-practices)

Use this page when you want implementation templates instead of only architectural explanation.

## Why this page exists

The earlier pages explain the architecture, application model, and review rules.

The next practical need is usually:

> show me the common cases I will actually implement.

This page focuses on that need.

## How to use this cookbook

Unless a recipe says otherwise, the examples below assume the thin-facade pattern from Recipe 1.

That means the business-facing model delegates resource ownership to `this.$$modelResource` instead of becoming another `ModelResource` owner itself.

For each recipe below:

1. identify whether the scenario is query-oriented, mutation-oriented, or invalidation-oriented
2. keep the resource semantics either on `ModelResource` directly or in a thin facade that delegates to it
3. reuse `queryItem(...)`, `mutationItem(...)`, `select(...)`, `view(...)`, and the existing key structure when possible
4. keep generic page or form blocks compatible unless you have a real reason to break that contract

## Forward-chain principle: prefer a thin business facade over a competing cache owner

In Cabloy’s bidirectional contract loop, this cookbook most often applies to the **forward chain**:

- backend contract truth changes first
- frontend API consumers are regenerated or refreshed from that truth
- frontend follow-up stays thin and semantic

For resource-oriented frontend work, that usually means:

> create a thin business model facade and reuse the existing resource-owner instead of creating a competing cache owner.

A strong pattern is:

- let `ModelResource` continue to own cache identity, list/item invalidation, and resource-level state
- let the business-facing model add semantic methods such as `summary(...)` or `deleteForce(...)`
- let custom cells, commands, or page controllers consume the thin business model facade, not invent a second owner for the same resource state

That pattern is especially important after forward-chain contract evolution, because it keeps generated or contract-aligned resource ownership centralized while still giving the business module a clean semantic API.

## Recipe 1: add a thin business facade over the existing resource-owner

### Use this when

The business module needs custom semantic methods, but the resource cache owner already exists and should remain authoritative.

Typical forward-chain case:

- backend adds a custom action such as `summary` or `deleteForce`
- frontend contract is regenerated or refreshed
- frontend needs a clean business-facing model method
- but should **not** create a second cache owner for the same resource

### Recommended shape

```typescript
const StudentResource = 'training-student:student';

@Model()
export class ModelStudent extends BeanModelBase {
  @Use({ beanFullName: 'rest-resource.model.resource' })
  protected get $$modelResource(): ModelResource {
    return usePrepareArg(StudentResource, true);
  }

  summary(id: TableIdentity) {
    return this.$$modelResource.queryItem({
      id,
      action: 'summary',
      queryFn: async () => {
        const res = await this.scope.api.trainingStudent.summary({ params: { id } });
        return res ?? null;
      },
      meta: {
        disableSuspenseOnInit: true,
      },
    });
  }

  deleteForce(id: TableIdentity) {
    return this.$$modelResource.mutationItem<void, void>({
      id,
      action: 'deleteForce',
      mutationFn: async () => {
        await this.scope.api.trainingStudent.deleteForce({ params: { id } });
      },
    });
  }
}
```

### Why this works well

- the business module gets a semantic model surface
- the existing `rest-resource` owner remains the single cache owner
- item keys, invalidation policy, and selector-based resource identity stay centralized
- custom UI code can call `ModelStudent.summary(...)` without rebuilding resource semantics locally

### Typical consumer shape

A custom cell or command can consume the thin facade and trigger the semantic method:

```typescript
const modelStudent = (await ctx.bean._getBean(
  'training-student.model.student',
  true,
)) as ModelStudent;
const querySummary = modelStudent.summary(id);

await querySummary.refetch();
$host.$appModal.dialog({
  slotDefault: () => <ZMarkdownHtml html={querySummary.data?.descriptionHtml ?? ''} />,
});
```

`refetch()` is the interaction-time freshness wait for this command. The dialog remains bound to `querySummary.data`, so the model-owned query remains the source of its ongoing render state rather than transferring ownership to an awaited-result snapshot.

### Avoid

Do not create a second model that independently caches the same student resource list/item state just because a custom action was added.

That usually creates competing cache ownership and makes forward-chain maintenance harder.

## Recipe 2: inside that facade, add a row-level custom query

### Use this when

You already chose the thin-facade pattern from Recipe 1, and the business module needs more than the standard `view(id)` query.

Examples:

- summary detail
- audit detail
- timeline detail
- metrics detail

### Recommended shape

```typescript
summary(id: TableIdentity) {
  return this.$$modelResource.queryItem({
    id,
    action: 'summary',
    queryFn: async () => {
      const res = await this.scope.api.trainingStudent.summary({ params: { id } });
      return res ?? null;
    },
    meta: {
      disableSuspenseOnInit: true,
    },
  });
}
```

### Why this works well

- the thin facade adds business semantics without becoming a second owner
- row-level cache identity still stays under the existing resource-owner
- item-level key structure and selector-based isolation remain centralized in `rest-resource`

### Avoid

Do not rewrite this as an independent `$useStateData(...)` owner in the business model when the same row already belongs to the existing resource-owner.

## Recipe 3: inside that facade, add a list-level query variant

### Use this when

You already chose the thin-facade pattern from Recipe 1, and the business module needs a second list-style endpoint beyond the default `select(query)`.

Examples:

- archived list
- pending list
- dashboard list
- lightweight picker list

### Recommended shape

```typescript
selectArchived(query?: ITableQuery) {
  return this.$$modelResource.selectGeneral('archived', query);
}
```

### Why this works well

- the business-facing model stays thin
- list-level cache identity still belongs to the existing resource-owner
- list variants remain compatible with the same invalidation and selector semantics

### Avoid

Do not create another list owner with a parallel `keySelect(...)` convention when the list is still part of the same resource boundary.

## Recipe 4: inside that facade, add a row-level custom mutation

### Use this when

You already chose the thin-facade pattern from Recipe 1, and the business module needs a business action beyond create/update/delete.

Examples:

- deleteForce
- archive
- publish
- approve
- restore

### Recommended shape

```typescript
deleteForce(id: TableIdentity) {
  return this.$$modelResource.mutationItem<void, void>({
    id,
    action: 'deleteForce',
    mutationFn: async () => {
      await this.scope.api.trainingStudent.deleteForce({ params: { id } });
    },
  });
}
```

### Why this works well

- mutation ownership still stays under the existing resource-owner
- item/list invalidation remains centralized
- the business-facing model exposes semantic actions without competing for cache ownership

## Recipe 5: customize invalidation for a special mutation

### Use this when

A custom mutation should not follow the default invalidation strategy, but cache ownership should still remain inside the existing resource-owner.

### Recommended shape

```typescript
publish(id: TableIdentity) {
  return this.$$modelResource.mutationItem<void, void>({
    id,
    action: 'publish',
    invalidateSelect: false,
    mutationFn: async () => {
      await this.scope.api.trainingStudent.publish({ params: { id } });
    },
    onSuccess: async () => {
      await this.$$modelResource.$invalidateQueries({ queryKey: ['select'] });
      await this.$$modelResource.$invalidateQueries({ queryKey: ['item', id] });
      await this.$$modelResource.$invalidateQueries({ queryKey: ['select', 'dashboard'] });
    },
  });
}
```

### Why this works well

- the existing resource-owner remains the source of truth for consistency rules
- special cache dependencies stay explicit
- pages do not need to remember hidden follow-up refetch rules

### Avoid

Do not spread this invalidation policy across page code, modal code, and button handlers.

## Recipe 6: expose permission-oriented helpers

### Use this when

Several screens need the same permission-based business decision.

Examples:

- can archive this resource?
- can publish this row?
- should a bulk action be visible?

### Recommended shape

```typescript
canArchive() {
  return this.$computed(() => {
    return !!this.$$modelResource.permissions?.actions?.archive;
  });
}
```

Or row-oriented logic:

```typescript
canPublishRow(row: Entity) {
  return !!this.$$modelResource.permissions?.actions?.publish && row.status === 'draft';
}
```

### Why this works well

- permission semantics stay close to the existing resource owner
- multiple pages reuse the same rule
- UI code gets simpler and more consistent

## Recipe 7: expose schema-oriented convenience helpers

### Use this when

Multiple forms or blocks need the same schema-based interpretation.

Examples:

- whether a field should be hidden in a certain scene
- whether a resource uses a special title field
- default schema chosen for a custom scene

### Recommended shape

```typescript
getTitleField() {
  return this.$computed(() => {
    return this.$$modelResource.schemaRow?.properties?.title ? 'title' : 'name';
  });
}
```

### Why this works well

- schema interpretation stays reusable
- pages do not duplicate metadata reading logic
- metadata ownership still stays under the existing resource-owner

## Recipe 8: add custom default form data

### Use this when

Create forms need richer default values than the generic schema default alone.

### Recommended shape

```typescript
getCreateDefaultData() {
  const data = this.$$modelResource.getQueryDataDefaultValue(this.$$modelResource.schemaCreate) ?? {};
  return {
    ...data,
    status: 'draft',
    enabled: true,
  };
}
```

Then integrate it through the business-facing form helper:

```typescript
getFormData(formMeta: IFormMeta, id?: TableIdentity) {
  if (formMeta.formMode === 'edit' && formMeta.editMode === 'create') {
    return this.getCreateDefaultData();
  }
  return this.$$modelResource.getFormData(formMeta, id);
}
```

### Why this works well

- create defaults stay resource-owned
- form behavior remains consistent across entry points
- the thin facade only adds semantic customization on top of the existing form flow

## Recipe 9: add batch action support

### Use this when

The resource supports multi-row operations.

Examples:

- batch delete
- batch archive
- batch enable/disable

### Recommended shape

```typescript
batchArchive(ids: TableIdentity[]) {
  return this.$$modelResource.$useMutationData<void, TableIdentity[]>({
    mutationKey: ['batchArchive'],
    mutationFn: async ids => {
      await this.scope.api.trainingStudent.batchArchive({ ids });
    },
    onSuccess: async () => {
      await this.$$modelResource.$invalidateQueries({ queryKey: ['select'] });
    },
  });
}
```

### Why this works well

- batch behavior stays modeled explicitly
- list invalidation policy remains visible
- cache ownership still stays with the existing resource-owner even when row-level helpers are not the right fit

## Recipe 10: keep generic blocks working while adding resource semantics

### Use this when

You want richer resource behavior but still rely on generic blocks such as page or page-entry consumers.

### Recommended approach

- preserve stable surfaces like `select`, `view`, `schemaFilter`, `schemaRow`, `getFormSchema`, and `getFormData`
- add new methods around those stable surfaces instead of replacing them
- keep custom semantics additive where possible

### Why this works well

You get stronger business behavior without sacrificing reusable infrastructure.

## Recipe 11: move repeated page logic back into the model

### Use this when

You notice the same resource-specific logic appearing across several page controllers.

Typical signals:

- repeated action visibility checks
- repeated fetches to the same custom endpoint
- repeated default-form preparation
- repeated manual invalidation after the same mutation

### Recommended refactor direction

1. identify the repeated resource semantic
2. add one model method or computed helper for it
3. update pages to consume that stable model surface
4. keep the invalidation or schema logic centralized in the model

### Why this works well

It restores the resource-owner boundary and reduces drift.

## Recipe 12: start direct, then add a thin facade only when semantics appear

### Use this when

A resource does not yet need custom business methods, but you expect it may later.

### Recommended approach

- start with direct `ModelResource` usage
- let generic pages or forms consume the existing resource-owner surface
- add a thin business facade only when the UI really needs semantic methods such as `summary(...)` or `deleteForce(...)`

### Why this works well

- the programming model stays more uniform
- you avoid premature wrapper growth
- later business semantics can still be added without changing the single-owner boundary

## Recipe 13: decide whether logic belongs in model or page

### Put it in the model when

- it is resource semantics
- multiple pages should share it
- it affects query or mutation ownership
- it affects invalidation or form/schema decisions

### Keep it in the page when

- it is only local presentation flow
- it has no resource reuse value
- it is temporary UI behavior with no resource meaning

### Quick test

Ask:

> if another screen reused this resource, should it inherit the same rule?

If yes, the logic probably belongs in the model.

## A compact cookbook workflow

When adding a new resource behavior, use this decision order:

1. Is this list-level, row-level, batch-level, or form-level?
2. Can I reuse `selectGeneral`, `queryItem`, or `mutationItem`?
3. Does the behavior need custom invalidation?
4. Should generic pages or forms keep working unchanged?
5. Is this resource semantics or only page presentation?

That sequence usually leads to a cleaner implementation.

## Final takeaway

The most useful cookbook habit is simple:

> when a resource behavior repeats, give it a named model-owned surface instead of letting pages rediscover it independently.

That is how a resource model grows in a clean and Zova-native way.
