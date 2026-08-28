# One-to-One Companion Resource Architecture

<Badge type="tip" text="Common" />

This guide defines a reusable fullstack pattern for a resource that owns an optional, one-to-one companion record. It applies to both Cabloy Basic and Cabloy Start.

The pattern is useful for rich content, localized content, large or rarely used fields, derived projections, and data whose read or authorization boundary differs from the parent resource. It is not a requirement to split every optional field into another table.

## The short version

A companion resource should have these properties:

- the parent remains the aggregate owner;
- the companion stores the parent identity and is normally not an independent public CRUD aggregate;
- the parent model exposes a static `hasOne` relation;
- the companion model exposes the inverse `belongsTo` relation;
- read and edit consumers use deliberately bounded projections;
- source values and derived values have different authorities;
- the parent service owns creation, update, blank-value behavior, and deletion;
- the one-row-per-parent invariant is explicitly designed and tested;
- relation, DTO, and renderer changes follow the contract loop.

A typical shape is:

```text
Parent
└── ParentContent
    ├── parentId
    ├── sourceMarkdown
    └── renderedHtml
```

The names are illustrative. A companion does not have to contain Markdown; the same ownership and projection rules apply to settings, localized values, profile extensions, or other optional subresources.

## When to use a companion resource

Keep a field on the parent when it is short, always needed, has the same lifecycle and authorization as the parent, and does not require a separate read projection.

Consider a companion when one or more of the following is true:

- the data is optional or relatively large;
- most list queries do not need it;
- the data has a different public or authorization boundary;
- a server-derived projection is stored alongside an editable source;
- the data is likely to evolve independently from the parent’s ordinary fields;
- the data is naturally a separate schema or rendering concern.

Do not extract a companion merely to create a second CRUD endpoint. If the parent owns the data, a separate endpoint can accidentally create a second aggregate with unclear authorization, caching, and deletion semantics.

## Common-first and edition-aware design

The parent/companion architecture is shared by Basic and Start. Edition differences belong at the presentation and operational edges, not in the domain model.

Before copying an example, detect the active edition using the repository marker:

| Edition      | Marker             | UI baseline            |
| ------------ | ------------------ | ---------------------- |
| Cabloy Basic | `__CABLOY_BASIC__` | DaisyUI + Tailwind CSS |
| Cabloy Start | `__CABLOY_START__` | Vuetify                |

Explain the shared model once, then substitute edition-specific renderer IDs, package names, flavors, and generated paths. Do not silently apply Basic UI assumptions to Start.

For broader edition guidance, see [Editions Overview](/editions/overview) and [Edition Differences in Fullstack Collaboration](/fullstack/edition-collaboration-differences).

## Aggregate ownership

A companion table can have its own entity and model while remaining owned by the parent aggregate.

The parent service should normally be the authority for:

- creating the companion when parent creation includes companion data;
- updating or upserting companion data;
- deciding whether blank content means “no companion”;
- deleting or soft-deleting the companion when the parent is deleted;
- force-deleting the companion when the parent is force-deleted;
- repairing historical orphan rows through an explicit maintenance operation.

The companion may expose a `belongsTo` relation for navigation and query composition. That relation does not, by itself, make the companion an independently writable business resource.

If the domain genuinely requires independent companion lifecycle, document that as a separate aggregate decision. Define its authorization, API, cache ownership, deletion behavior, and consistency boundary explicitly rather than inferring them from the ORM relation.

## Persistence shape and invariants

A companion entity commonly contains the normal Vona basic fields plus a parent identity:

```typescript
export class EntityParentContent extends EntityBase {
  @Api.field(v.tableIdentity(), ZovaRender.visible(false))
  parentId: TableIdentity;

  sourceMarkdown?: string;
  renderedHtml?: string;
}
```

The actual field decorators, validation, comments, and renderer metadata belong to the business module.

### Parent identity and indexing

Use the child’s `parentId` as the lookup key and add an ordinary index for the access path used by `hasOne` and service operations. In a shared-database multitenant deployment:

- use normal Vona model access so instance scoping remains active;
- distinguish the physical parent identity from the instance/tenant boundary;
- do not use a global database unique constraint casually to express tenant-scoped business uniqueness;
- keep lookup indexing separate from uniqueness enforcement.

### `hasOne` is not a physical uniqueness constraint

`hasOne` tells the ORM how to read a relation. It does not prevent the database from containing two child rows with the same `parentId`.

The one-row-per-parent invariant therefore needs an explicit strategy. Choose according to the consistency requirements:

- serialize writes through a transaction and a suitable row or application lock;
- use a database uniqueness constraint only when its tenant scope, dialect behavior, migration path, and error handling are intentionally designed;
- use an application-level uniqueness check only when the deployment and concurrency model make that guarantee sufficient;
- if the design intentionally accepts best-effort semantics, state that duplicate rows are possible and define a repair strategy.

A normal `get({ parentId })` followed by `insert(...)` is not enough under concurrent first writes: two callers can both observe no row. This race must be handled by the selected invariant strategy and covered by a test.

## Relation metadata

Declare stable business relations in model metadata. The parent commonly has two projections when consumers need different fields:

```typescript
@Model({
  entity: EntityParent,
  relations: {
    parentContent: $relation.hasOne('example:parentContent', 'parentId', {
      columns: ['id', 'parentId', 'sourceMarkdown', 'renderedHtml'],
    }),
    parentContentForm: $relation.hasOne('example:parentContent', 'parentId', {
      columns: ['id', 'parentId', 'sourceMarkdown'],
    }),
  },
})
class ModelParent {}
```

The companion model declares the inverse relation:

```typescript
@Model({
  entity: EntityParentContent,
  relations: {
    parent: $relation.belongsTo('example:parentContent', 'example:parent', 'parentId'),
  },
})
class ModelParentContent {}
```

The names `parentContent` and `parentContentForm` are conventions, not framework keywords. Use names that make the projection and authority clear.

### Why separate projections matter

A full/read projection can include both source and derived values. An edit projection should normally include only the editable source. Positive `columns` selections make that boundary visible and reduce accidental contract widening.

A projection can be used for:

- an Admin form that edits `sourceMarkdown`;
- a public detail response that exposes only `renderedHtml`;
- an internal read that needs both values;
- a summary that deliberately returns a small compatibility facade.

Use `include` for declared static relations. Use `with` for relations that are genuinely dynamic or situational. Read [Relations Guide](/backend/relations-guide), [ORM Select Guide](/backend/orm-select-guide), and [ORM Mutation Guide](/backend/orm-mutation-guide) for the underlying ORM behavior.

Relation metadata changes can affect inferred DTOs, OpenAPI, generated metadata, and frontend consumers. Regenerate those artifacts from source after changing a relation.

## Markdown source and derived HTML

Markdown is a common example of a source/projection pair:

```text
Admin Markdown field
  → nested source value in the DTO
  → parent service normalizes the source
  → backend Markdown bean renders and sanitizes HTML
  → source + derived HTML are persisted
  → Admin receives source
  → Web/public detail receives derived HTML
  → trusted HTML component displays the projection
```

The authority boundary is strict:

- Markdown is the editable source of truth.
- HTML is a server-derived presentation projection.
- Every authoritative write path must derive HTML again.
- Client-submitted HTML must be ignored or overwritten.
- The trusted HTML display component is not a sanitizer.
- Public contracts should not expose editable Markdown unless that is intentional and authorized.

A service operation is conceptually:

```typescript
const markdown = sourceMarkdown?.trim();

if (!markdown) {
  // The business policy decides whether to delete the companion row.
  return;
}

const renderedHtml = this.bean.markdown.renderHtml(markdown);
await saveCompanion({
  parentId,
  sourceMarkdown: markdown,
  renderedHtml,
});
```

The backend Markdown module owns rendering and sanitization, not business persistence. See [Backend Markdown Guide](/backend/markdown-guide) and [Frontend Markdown Guide](/frontend/markdown-guide).

### Blank-content policy

`renderHtml('')` returning an empty string does not automatically mean that a database row should be deleted. The business module must choose and document its policy. Common choices are:

- delete the optional companion row;
- retain a row as an explicit empty state;
- reject blank input;
- retain the source while omitting a derived projection.

If blank means “absent,” normalize first, delete an existing row, and leave no new empty row behind. Test both the existing-row and no-existing-row cases.

## Parent service lifecycle

The service should separate parent fields from nested companion input before passing data to the parent model. A typical flow is:

### Create

1. Validate the parent and nested source contract.
2. Insert the parent.
3. If companion input is supplied, normalize and persist the companion.
4. Return the response projection expected by the action.

Whether steps 2 and 3 are atomic is a deliberate consistency choice described below.

### Update

1. Validate the parent and nested source contract.
2. Update parent fields.
3. If companion input is supplied, normalize it.
4. Delete the companion for the selected blank policy, or update/insert source and derived values.
5. Return a bounded response rather than an accidental full model object.

An update that does not include companion input should not silently erase existing companion content unless the API explicitly defines replacement semantics.

### Delete

Delete or soft-delete the companion before deleting the parent, unless a deliberately configured database cascade owns the same invariant. Force-delete must use the matching force-delete behavior for the child. Child-before-parent cleanup makes ownership explicit and prevents orphans when the ORM does not cascade the operation.

If historical orphans exist, clean them through a deliberate, auditable maintenance path. Do not assume that future parent deletion will repair rows whose parent is already gone.

## Consistency modes and concurrency

There are two valid implementation modes. The module must choose one rather than accidentally combining their guarantees.

### Simple non-transactional mode

Use this only when the domain accepts partial-failure semantics and low contention. The service may insert the parent and then persist the companion without a transaction. Document that a failure between those operations can leave a parent without its intended companion, and that concurrent first writes may require a repair strategy.

This mode is appropriate for a deliberately simple resource when those limitations are acceptable. It must not be described as atomic or duplicate-proof.

### Transactional and contention-safe mode

Use a transaction when parent and companion must commit or roll back together. `@Core.transaction()` uses `REQUIRED` by default: it starts a transaction when none exists and joins the current datasource transaction otherwise.

When competing writes can target the same companion:

- select an explicit serialization point, usually the parent row or existing companion row;
- call `getForUpdate()` or `getByIdForUpdate()` only inside an active transaction;
- handle the first-insert race when no companion row exists;
- use `@Core.retryable(...)` only with an explicit transient-error allowlist;
- place retry around the transaction boundary when the complete operation must be replayed;
- ensure the operation is replay-safe;
- never retry an external side effect as if it were a database mutation.

The essential race is:

```text
request A: no companion found ─┐
                                ├─ both try to insert
request B: no companion found ─┘
```

A row lock on an existing child cannot protect a row that does not yet exist. Use parent serialization, a deliberate uniqueness/error-retry strategy, or another documented mechanism for the first insert. Add a test that begins with no companion row and proves the chosen invariant.

See [Transaction Guide](/backend/transaction-guide), [Field Indexes](/backend/field-indexes), and [Unit Testing](/backend/unit-testing).

## Cache coherence

If a parent query can include companion data, a companion mutation can make a warmed parent query stale. Configure the companion model’s cache dependency so child writes clear the affected parent model’s query cache when appropriate.

The dependency should be directional:

```text
companion mutation → parent query cache invalidation
```

Keep the cache graph acyclic and avoid duplicate or reverse edges. Cache invalidation is not a lock, a uniqueness constraint, or a transaction. Continue to use normal Model mutation APIs so the framework’s cache behavior remains active. Read [Cross-model query-cache dependencies](/backend/cache-guide#cross-model-query-cache-dependencies) for the graph rules.

## DTO and contract design

The persistence shape does not dictate one universal API shape. Define projections by consumer authority:

| Consumer            | Typical contract                                                   |
| ------------------- | ------------------------------------------------------------------ |
| Admin create/update | Nested editable source, such as `parentContentForm.sourceMarkdown` |
| Admin view          | Nested source projection suitable for editing or review            |
| Public detail       | Derived HTML only, when publication is authorized                  |
| List/select         | Usually no large companion content                                 |
| Internal service    | The smallest projection needed for the operation                   |

For schema-driven forms, the parent DTO can expose a nested relation and map the field to its source value:

```typescript
const contentField = $makeMetadata(
  ZovaRender.fieldSource('parentContentForm.sourceMarkdown'),
  ZovaRender.field('<edition>-markdown:formFieldMarkdown'),
);
```

The exact renderer is edition-specific; the nested source contract is not. This is a valid `$makeMetadata(...)` overlay because `parentContentForm` is already supplied by the inferred relation projection through the DTO relation option type, `include`, and `dtoClass`; its schema exists before the renderer and `fieldSource(...)` metadata is added. `fieldSource(...)` maps the projected field to the nested source path but does not declare `sourceMarkdown`'s type. If a field-map key is instead a true virtual DTO key absent from the inferred projection, define it with `$makeSchema(...)` and an appropriate final concrete schema such as `z.string()`; see [Virtual fields in the DTO fields map](/backend/dto-infer-generation#virtual-fields-in-the-dto-fields-map). Do not add derived HTML to a mutation DTO merely because it exists in the table.

A DTO or OpenAPI declaration is not a substitute for runtime response review. If a service returns an already-built object with extra properties, narrowing the declaration alone may not remove those properties from JSON. Verify the actual action response as well as emitted schema metadata.

## Frontend and SSR boundaries

### Admin editing

The Admin form edits the source value through the active edition’s Markdown field renderer. It should submit Markdown, not browser-generated HTML. The browser-dependent editor and toolbar follow the active edition’s established client-only boundary.

### Web/public display

The Web page should receive the server-derived HTML from an intentionally public DTO and pass it to the active edition’s trusted Markdown HTML component. That component displays HTML; it does not replace backend sanitization.

### SSR

The editor is browser-dependent and normally renders a neutral SSR placeholder until mounted. The read-only HTML display path can be SSR-rendered because it consumes already-generated HTML. Keep server HTML and the hydration-time initial render equivalent, and defer browser-only editor state until the established mount boundary.

Do not infer the final browser theme or other browser-only state from an unauthenticated Web SSR request merely because the page contains Markdown content.

## Basic and Start substitutions

The architecture and backend Markdown bean are shared concepts. Verify concrete names in the active repository before copying commands or imports.

| Concern                   | Cabloy Basic                       | Cabloy Start                       |
| ------------------------- | ---------------------------------- | ---------------------------------- |
| Edition marker            | `__CABLOY_BASIC__`                 | `__CABLOY_START__`                 |
| Form renderer             | `basic-markdown:formFieldMarkdown` | `start-markdown:formFieldMarkdown` |
| HTML display renderer     | `basic-markdown:markdownHtml`      | `start-markdown:markdownHtml`      |
| Frontend Markdown package | `zova-module-basic-markdown`       | `zova-module-start-markdown`       |
| UI baseline               | DaisyUI + Tailwind CSS             | Vuetify                            |
| Admin flavor family       | `cabloyBasicAdmin`                 | `cabloyStartAdmin`                 |
| Web flavor family         | `cabloyBasicWeb`                   | `cabloyStartWeb`                   |

The root command family may look similar, but the resolved flavor, module availability, generated output directory, and SSR baseline can differ. Detect the edition and inspect its `package.json`, CLI entrypoint, and build configuration before giving an operational command.

## Contract-loop implications

A companion relation is a fullstack contract change when it changes DTO shape, exposed fields, renderer metadata, or public projections.

Use the forward chain:

```text
Vona entity/model/DTO/controller source
  → backend metadata and OpenAPI
  → generated Zova SDK/schema/REST consumers
  → Admin/Web models and pages
  → SSR and REST verification
```

The normal workflow is:

1. change backend contract truth first;
2. generate and inspect backend metadata/OpenAPI;
3. regenerate frontend consumers and schema metadata;
4. build the affected Admin or Web flavor as required;
5. synchronize consumers through the repository’s dependency workflow;
6. verify runtime responses and generated contracts;
7. never hand-edit generated metadata, SDK, API schema, REST, or installed dependency copies.

If the change starts in a frontend-owned renderer or metadata surface that backend consumers import, follow the reverse chain: run the relevant full flavor build first, then synchronize backend consumers. For the complete workflow, see [Contract Loop Playbook](/fullstack/contract-loop-playbook), [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk), and [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend).

## Testing checklist

A companion implementation should test the chosen semantics, not just that a relation can be loaded.

### Persistence and lifecycle

- [ ] A nonblank source creates exactly one logical companion.
- [ ] Updating source updates both source and derived projection.
- [ ] Updating an existing companion does not create a second row.
- [ ] Updating with blank or whitespace-only source follows the documented blank policy.
- [ ] Client-supplied derived HTML is ignored or overwritten.
- [ ] Parent deletion removes or soft-deletes the companion as documented.
- [ ] Force deletion applies the matching child behavior.
- [ ] Historical orphan handling has an explicit maintenance path if needed.

### Invariants and concurrency

- [ ] The one-row-per-parent strategy is documented.
- [ ] Concurrent updates leave a valid source/derived pair.
- [ ] Concurrent first insertion cannot silently violate the selected invariant, or the accepted limitation and repair path are tested.
- [ ] Transaction and retry boundaries are tested when those features are used.

### Contracts and consumers

- [ ] `hasOne` and inverse `belongsTo` metadata are emitted correctly.
- [ ] Admin forms expose the nested source field and the correct edition renderer.
- [ ] Mutation contracts do not accept derived HTML as an authority.
- [ ] Public responses expose only the intended projection.
- [ ] List/select responses do not load large companion content accidentally.
- [ ] Runtime JSON matches the DTO/OpenAPI declaration.
- [ ] Companion writes invalidate warmed parent queries when required.
- [ ] SSR output and hydration behavior are verified for applicable Web pages.

### Test data ownership

Persisted tests should own the identities they create, clean them in `finally`, and delete children before parents. Shared durable fixtures should come from the owning module’s seed path and be treated as read-only.

## Reference implementations and related reading

The most complete repository specimen is Commerce Catalog’s `Product` / `ProductContent` flow. In the active repository, inspect the corresponding paths:

- `vona/src/suite/a-commerce/modules/commerce-catalog/src/entity/product.tsx`
- `vona/src/suite/a-commerce/modules/commerce-catalog/src/entity/productContent.tsx`
- `vona/src/suite/a-commerce/modules/commerce-catalog/src/model/product.ts`
- `vona/src/suite/a-commerce/modules/commerce-catalog/src/model/productContent.ts`
- `vona/src/suite/a-commerce/modules/commerce-catalog/src/service/product.ts`
- `vona/src/suite/a-commerce/modules/commerce-catalog/src/dto/productCreate.tsx`
- `vona/src/suite/a-commerce/modules/commerce-catalog/src/dto/productUpdate.tsx`
- `vona/src/suite/a-commerce/modules/commerce-catalog/src/dto/productView.tsx`
- `vona/src/suite/a-commerce/modules/commerce-catalog/src/dto/productPublicDetail.tsx`
- `vona/src/suite/a-commerce/modules/commerce-catalog/test/productContent.test.ts`

The Commerce implementation demonstrates the transaction, row-locking, derived HTML, projection, deletion, and contention-safe variant. A simpler companion-resource example may intentionally omit transactions when its documented consistency requirements allow that choice.

Read this guide together with:

- [Relations Guide](/backend/relations-guide)
- [Backend Markdown Guide](/backend/markdown-guide)
- [Frontend Markdown Guide](/frontend/markdown-guide)
- [DTO Guide](/backend/dto-guide)
- [DTO Infer and Generation](/backend/dto-infer-generation)
- [Transaction Guide](/backend/transaction-guide)
- [Cache Guide](/backend/cache-guide)
- [Contract Loop Playbook](/fullstack/contract-loop-playbook)
- [Edition Differences in Fullstack Collaboration](/fullstack/edition-collaboration-differences)
