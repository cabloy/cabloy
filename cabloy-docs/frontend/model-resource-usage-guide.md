# Using `ModelResource` in Your Module

This guide explains the two recommended ways to use `ModelResource` in application code.

It is the practical follow-up to [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern).

For review guardrails and design checks after applying the pattern, continue with [Resource Model Best Practices and Anti-Patterns](/frontend/model-resource-best-practices).

For implementation templates covering common extension scenarios, continue with [Resource Model Cookbook](/frontend/model-resource-cookbook).

Use this page when the main question is not only “what does `ModelResource` do?”, but also:

- when should I use it directly?
- when should I add a thin business facade?
- which responsibilities should remain in the existing resource-owner?
- where should custom business logic live?

## Why this page exists

After reading the `rest-resource` source, the next practical step is usually application.

A frontend developer often needs one of these outcomes:

1. use `ModelResource` directly
2. add a thin business facade over the existing resource-owner

This page explains those two choices.

## The base specimen

The base resource-owner model is:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts`

Representative consumers that use it through selector-based lookup include:

- `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`

Those consumers are important because they show that UI blocks can depend on the resource-owner contract without needing to know the low-level resource logic.

## The first decision: use directly or add a thin facade?

A practical decision rule is:

### Use `ModelResource` directly when

- the resource is close to standard CRUD
- default `select` / `view` / `create` / `update` / `delete` behavior is already enough
- form schema and permission ownership can follow the generic resource path
- generic blocks can consume the resource-owner surface as-is
- you mainly want the existing resource-owner facade without extra business semantics

### Add a thin facade over the existing resource-owner when

- the resource cache owner already exists through `rest-resource`
- the business module needs a semantic frontend surface such as `summary(...)`, `selectArchived(...)`, or `deleteForce(...)`
- you want to follow Cabloy’s bidirectional contract loop **forward chain**
- the right frontend move is to reuse the existing resource-owner instead of creating a competing cache owner

In that case, a thin business model facade is often better than creating a second resource-level state owner.

The key point is that the business model does **not** become the cache owner itself.

Instead, it delegates row/list/mutation ownership to the existing `ModelResource` instance.

## The key architectural rule

The goal is usually **not** to create another resource-owner surface for the same resource.

The goal is to keep one stable owner boundary and add business-specific semantics on top of it only when needed.

A good mental model is:

- `ModelResource` owns the generic resource contract
- your business-facing model owns semantic convenience methods only when the UI needs them

## Pattern 1: use `ModelResource` directly

This is the cleanest option when the generic resource owner already matches the real business shape.

Typical signs:

- the resource mostly needs standard CRUD
- generic pages or forms already work well
- no extra semantic query or mutation surface is needed yet
- the team benefits more from uniformity than from additional business naming

In this mode, the best abstraction is often no extra abstraction.

## Pattern 2: add a thin business facade over the existing resource-owner

This is the right option when business semantics appear, but ownership should stay centralized in the existing resource-owner.

A representative shape is:

```typescript
const StudentResource = 'demo-student:student';

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
        const res = await this.scope.api.demoStudent.summary({ params: { id } });
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
        await this.scope.api.demoStudent.deleteForce({ params: { id } });
      },
    });
  }
}
```

What this pattern preserves:

- one cache owner
- one selector-based resource identity model
- one list/item invalidation policy
- one resource-level state boundary

What this pattern adds:

- semantic business-facing methods
- better UI readability
- a cleaner place for forward-chain frontend follow-up

## What should remain owned by `ModelResource`

In both usage modes, these parts should remain conceptually owned by the existing resource-owner pattern:

- resource bootstrap
- `resourceApi` resolution
- select/view/create/update/delete conventions
- form schema resolution
- permission/schema/form-provider surfaces
- generic list/item invalidation structure

That does not mean you can never customize behavior.

It means the customization should still reuse the same owner boundary instead of competing with it.

## The safest extension points

The safest extension points are usually **new business-facing methods** that delegate to the existing resource-owner helper surfaces.

Typical examples:

- additional item queries through `queryItem(...)`
- additional list queries through `selectGeneral(...)`
- business actions through `mutationItem(...)`
- resource-specific computed helpers
- schema or permission convenience helpers

This keeps the generic resource contract intact while adding local business semantics.

## Pattern 3: add a row-level custom query through the facade

Use this when the resource has a domain-specific query that is not just `select` or `view`.

Representative shape:

```typescript
summary(id: TableIdentity) {
  return this.$$modelResource.queryItem({
    id,
    action: 'summary',
    queryFn: async () => {
      const res = await this.scope.api.demoStudent.summary({ params: { id } });
      return res ?? null;
    },
  });
}
```

Why this is a good pattern:

- it reuses `queryItem(...)`
- it stays under the existing resource-owner cache-key structure
- it keeps row-level query ownership centralized

## Pattern 4: add a list-level query variant through the facade

Use this when the resource needs a second list-style endpoint beyond the default `select(query)`.

Representative shape:

```typescript
selectArchived(query?: ITableQuery) {
  return this.$$modelResource.selectGeneral('archived', query);
}
```

Why this is a good pattern:

- it reuses `selectGeneral(...)`
- it stays under the existing resource-owner list-key structure
- it keeps list-level semantics inside the same resource boundary

## Pattern 5: add a custom mutation through the facade

Use this when the resource needs business actions beyond create/update/delete.

Representative shape:

```typescript
deleteForce(id: TableIdentity) {
  return this.$$modelResource.mutationItem<void, void>({
    id,
    action: 'deleteForce',
    mutationFn: async () => {
      await this.scope.api.demoStudent.deleteForce({ params: { id } });
    },
  });
}
```

Why this is a good pattern:

- it reuses `mutationItem(...)`
- it inherits centralized invalidation behavior
- it keeps mutation ownership under the same resource owner

## Where custom business logic should live

A practical placement rule is:

### Put it in the thin business facade when

- it is resource semantics
- it affects query or mutation ownership through the existing resource-owner
- it affects resource-level invalidation expectations
- multiple pages or blocks should reuse it
- it gives the UI a clearer business-facing surface

### Keep it out of the business facade when

- it is only local page presentation logic
- it is one-off UI formatting with no resource ownership meaning
- it is unrelated to the resource boundary

## A good layering pattern

A clean layering often looks like this:

- `ModelResource` → generic resource-owner runtime
- `ModelStudent` / `ModelArticle` / `ModelOrder` → thin business facade over the existing owner
- page/component controllers → consume the model and focus on page flow

That layering keeps the model architecture expressive without turning every page into a mini resource framework.

## Common mistakes to avoid

For the broader review-oriented version of these mistakes, see [Resource Model Best Practices and Anti-Patterns](/frontend/model-resource-best-practices).

The usage mistakes to remember here are:

### Mistake 1: creating a competing cache owner

If the business model starts owning the same list/item resource state independently, the architecture loses its single resource-owner boundary.

### Mistake 2: bypassing the model with ad hoc `$fetch` in pages

If a page keeps calling the same resource endpoints directly while a resource-owner model already exists, the ownership boundary becomes inconsistent.

### Mistake 3: adding wrapper classes with no semantic value

If a business model does not add real business-facing semantics, the wrapper may create extra maintenance without improving clarity.

## A practical evolution path

A healthy evolution path often looks like this:

1. start with direct `ModelResource` usage
2. let generic pages/forms consume it directly
3. add a thin business facade only when real business semantics appear
4. keep generic page and form blocks consuming the stable resource-owner surface
5. keep frontend follow-up thin during forward-chain contract evolution

This path keeps the abstraction proportional to the real problem and reduces mental overhead.

## Source-reading checklist for application

When deciding how to apply `ModelResource`, ask:

1. is the generic resource-owner already enough?
2. does the UI need semantic business-facing methods?
3. can the new behavior delegate to `queryItem`, `selectGeneral`, or `mutationItem`?
4. which invalidation rules should remain centralized?
5. which generic consumers should continue to work unchanged?

If you can answer those clearly, your application of the pattern is usually on the right track.

## Final takeaway

The most important practical insight is simple:

> use `ModelResource` directly when the generic owner already fits; add a thin facade only when the UI needs clearer business semantics.

That approach keeps the programming model more uniform and reduces mental burden.