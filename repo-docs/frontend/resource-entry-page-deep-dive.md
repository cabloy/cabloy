# Resource Entry Page Deep Dive

This guide explains the runtime path of a resource entry page in Zova through the current public Cabloy Basic source.

Use this page when you want to understand:

- how a `/rest/resource/...` entry route becomes a working entry page
- where the thin `rest-resource` page shell stops
- how `basic-pageentry` takes over the deeper entry runtime
- where `blockForm` and `blockToolbarRow` fit into that runtime
- how submit flow and page-meta updates connect back to the routed shell

## Why this page exists

Several existing docs already explain important parts of the story:

- [Generated Contract Consumption: Entry Branch](/frontend/generated-contract-consumption-entry-branch) explains the consumer-side handoff before the deeper runtime begins
- [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood) explains the module-level runtime bridge
- [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map) explains the shortest file path into the module
- [Form Guide](/frontend/form-guide) and [Zova Form Under the Hood](/frontend/zova-form-under-the-hood) explain the form runtime
- [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide) explains the cross-layer `formScene -> formMeta -> pageMeta` chain

What those pages do not isolate directly is the one cohesive entry-page runtime path from route entry into the deeper Basic form/page runtime.

That is the gap this page fills.

## The shortest accurate mental model

A practical mental model is:

1. `rest-resource` declares generic resource entry routes
2. generated page wrappers bind those routes to `ControllerPageEntry`
3. `ControllerPageEntry` is a thin shell that resolves `resource`, `id`, and `formScene`
4. that shell derives `formMeta`, loads `formSchema`, and renders `formSchema.rest.blocks`
5. those blocks usually enter `basic-pageentry:blockPageEntry`
6. `blockPageEntry` becomes the deeper runtime owner for `ModelResource`, `formData`, submit flow, and page-meta updates
7. `blockForm` bridges into `ZForm`
8. `blockToolbarRow` renders the action row from the shared page-entry render context

That means the entry page is not “one big page controller that does everything.” It is a route-shell plus downstream reusable block runtime.

This page focuses only on the entry-page branch. For the broader module-level shell-to-runtime map shared by both list and entry pages, keep [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map) as the general reference.

## Source-confirmed reading path

When reading this topic, use this order:

1. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/routes.ts`
2. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/.metadata/page/entry.ts`
3. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx`
4. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/.metadata/index.ts`
5. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`
6. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockForm/controller.tsx`
7. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockToolbarRow/controller.tsx`

That order moves from public route surface, to route wrapper, to resource entry shell, to Basic block registry, to the real entry-page runtime owner, then to the form bridge and action row.

## Runtime path by layer

### 1. Route entry

The public route surface lives in:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/routes.ts
```

The entry routes are:

- `:resource/create`
- `:resource/:id/:formScene?`

This already shows the public entry-page contract:

- resource identity comes from the route
- row identity comes from `id`
- scene can come explicitly from `formScene`, or later fall back by runtime rule

The shared `tabKey(route)` also shows that entry pages stay grouped under one resource-oriented workspace rather than creating a brand-new workspace per row.

### 2. Generated page wrapper

The route component wrapper lives in:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/.metadata/page/entry.ts
```

This file is thin but important.

It shows that the page does not enter runtime through ad hoc local setup code. Instead, it enters the standard Zova page-controller path through:

- `createZovaComponentPage(ControllerPageEntry, ...)`

That means the route entry is still controller-oriented from the beginning.

### 3. Thin `rest-resource` entry shell

The actual entry shell lives in:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx
```

Its main jobs are:

- resolve `resource`
- resolve `entryId`
- resolve `formScene`
- derive `formMeta`
- resolve `formProvider`
- resolve `formSchema`
- ensure form API schemas are loaded
- render `formSchema?.rest?.blocks`

This is the first key architectural boundary:

- `ControllerPageEntry` is a **thin shell**
- it does not own the whole entry runtime by itself

Its role is to interpret route context, resolve resource/form schema state, and let schema-defined blocks take over the deeper behavior.

### 4. `basic-pageentry` block registry

The Basic block registry lives in:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/.metadata/index.ts
```

This file shows the reusable entry-page runtime surface exported by the module:

- `basic-pageentry:blockPageEntry`
- `basic-pageentry:blockForm`
- `basic-pageentry:blockToolbarRow`

That matters because the deeper entry-page behavior is not hidden inside one giant page file.

It is split into reusable controller-backed blocks.

### 5. `blockPageEntry` becomes the deeper runtime owner

The most important current Basic file is:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx
```

This is the deeper entry runtime owner.

Its main jobs are:

- resolve selector-backed `ModelResource`
- derive `formMeta` and `schemaScene`
- derive `formProvider`, `formSchema`, and `formData`
- prepare the shared JSX render context
- ensure view/query data is loaded
- own submit flow through `submitData(...)`
- update page meta through `setPageMeta(...)`
- expose `$$pageEntry` into the render context for downstream blocks

This is the second key architectural boundary:

- the route shell chooses the resource/scene context
- `blockPageEntry` owns the deeper entry-page runtime once blocks are rendered

### 6. `blockForm` bridges into `ZForm`

The form bridge lives in:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockForm/controller.tsx
```

This controller does not re-derive entry-page state.

Instead, it consumes `$$pageEntry` from the host render context and passes the canonical page-entry-owned values into `ZForm`, including:

- `data`
- `schema`
- `schemaScene`
- `formMeta`
- `formProvider`
- `formScope`
- submit callback
- change callback

This is the clearest source-confirmed proof that `blockForm` is a bridge, not the main owner of entry-page orchestration.

A resource DTO can provide a nested `basic-form:blockFormLayout` block here to arrange the schema fields into sections, groups, or tabs. That block only owns structural placement; read [Form Layout Guide](/frontend/form-layout-guide) for the DTO grammar and keep this page focused on the entry runtime handoff.

### 7. `blockToolbarRow` renders the action row

The action row lives in:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockToolbarRow/controller.tsx
```

Its role is to consume the same `$$pageEntry` render context and render action buttons based on:

- current permissions
- current `formScene`
- action render definitions

This is important because it shows that action visibility and entry-page state stay attached to the same host context, instead of being recomputed independently by unrelated components.

## The shared handoff model

A useful rule is:

- the route shell resolves context
- schema blocks choose which entry-page runtime pieces should appear
- `blockPageEntry` becomes the shared host runtime owner
- `blockForm` and `blockToolbarRow` are specialized consumers of that host-owned context

That means the shared handoff is through `$$pageEntry`, not through scattered local state.

## Submit flow and page-meta flow

The entry runtime also connects cleanly to the wider shell/task model.

Inside `blockPageEntry`:

- data loading initializes page state
- submit flow delegates to `ModelResource` mutation logic
- `setPageMeta(...)` updates the routed shell title / dirty / form-scene state

This is why the entry-page runtime should be read together with [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide) and [Page Meta Guide](/frontend/page-meta-guide).

## Recovering unsaved create/edit drafts

Cabloy Basic's generic resource entry runtime enables draft recovery by default for **create and edit** forms. View forms do not save drafts, and this capability does not automatically extend to standalone `ZForm` usages such as login or password-change forms.

Eligible input is saved silently through a Zova Model using asynchronous IndexedDB persistence: ordinary saves do not show a saved-draft banner. On page entry or after a browser reload, an initial persisted candidate offers **Recover** and **Discard** controls once client hydration and form initialization have finished. This is a one-shot recovery decision, not an active-draft toolbar. Successful recovery dismisses the banner and changes the live form only: it never creates or updates a business record and never submits the form automatically.

The ownership boundaries remain separate:

- `ModelResource` owns current server data, schema and mutations.
- `basic-pageentry`'s selector-backed `ModelDraft` owns each local snapshot and its persistence status.
- `BeanDraftCoordinator` owns draft identities, session invalidation and explicit route/task-close cleanup. Client application initialization registers this coordinator without preloading draft Models or browser snapshots, so even unopened inactive tasks can be cleaned up.
- `ZForm` owns editable values and validation.
- `blockPageEntry` coordinates recovery, submission and explicit abandonment through the coordinator.

### Draft lifecycle

| Action                                       | Draft behavior                                                                                             |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Edit eligible fields                         | Silently save the complete current local unsaved snapshot.                                                 |
| Enter new parent-form input with a candidate | Dismiss the candidate and replace it with the current form snapshot, without merging old candidate values. |
| Recover a candidate successfully             | Apply it to the live form and dismiss the banner; subsequent saves stay silent.                            |
| Switch between still-open tasks              | Retain input and draft state without reopening a dismissed banner.                                         |
| Reload the browser                           | Retain the draft and offer recovery on returning to the same form.                                         |
| Ordinary Back                                | Delete the outgoing form's draft.                                                                          |
| Explicitly close a task or its workspace     | Delete the drafts of the removed tasks, including inactive tasks.                                          |
| Successfully submit                          | Delete the corresponding create/edit draft.                                                                |
| Validation or submission fails               | Retain the draft.                                                                                          |
| Discard a recovery candidate                 | Delete that candidate and leave the current baseline form unchanged.                                       |
| Component unmount or cache pruning           | Not, by itself, an explicit draft discard.                                                                 |

Reloading while the list or another task is active preserves the inactive form's draft too. Returning through its restored create/edit task offers recovery after the current schema and page route are ready; restored workspace metadata does not restore the live form values or imply automatic recovery.

A new parent `onChanged` event takes over an undecided recovery candidate. The next snapshot contains the complete current live form, not a field-by-field merge with the old candidate. Input entered before asynchronous candidate discovery wins too: discovery must not reopen the old banner or replace that newer input. To recover the replacement later, reload and explicitly choose Recover.

There is no active-draft Discard button, toolbar or other UI entry after recovery or new-input takeover. The internal `discardDraft()` reset method remains available to the runtime; candidate Discard is the visible recovery action, and ordinary Back or explicit task/workspace close still performs abandonment cleanup.

Edit recovery checks the current accessible record at the interaction boundary: a changed, deleted or inaccessible record must not receive stale recovered values. Recovery errors remain with the candidate controls; storage failures use a separate compact inline status rather than a saved-draft banner. Expired or structurally incompatible snapshots are not applied. Locale-only label changes do not invalidate compatible drafts.

### Locale refresh is not draft recovery

The resource form enables `ZForm`'s narrow `localePresentationRefresh` policy with a stable resource/record/scene identity. Schema refresh still updates field options and **always resets field state**. A compatible language change can then restore the current live value before the readiness callback; it does not read IndexedDB, replay a recovery candidate, preserve old validation errors, or skip new validation rules.

Compatibility includes complete resolved validation truth and strict field renderer/options metadata. For example, Student `name` can survive a label/message translation, while Student `level` has localized renderer options and follows normal reset behavior rather than receiving extra value replay. Supported Basic Form Layout tab/group titles are display-only; arbitrary renderer metadata is not. Explicit reset, data replacement, record/scene changes, changed constraints/defaults, and opaque effects invalidate preservation. Read [Form Guide](/frontend/form-guide#initialize-external-state-with-onfieldstateready) for the policy boundaries.

Draft projection supports `anyOf` and `oneOf` unions whose branches are all safe primitives or null, including Student `level` (`1 | 2 | 3`). Eligible branches declare string, boolean, number, integer or null types (including nonempty arrays of these types), or provide an untyped primitive/null `const` or nonempty primitive/null `enum`; defaults and renderer options do not establish eligibility. Safe unfinished values are persisted without enum-membership validation, coercion or branch selection.

Every branch is checked, including null branches, reference wrappers and resolved targets. A sensitive, readonly, write-only, file/upload/binary or `draft: false` branch, an unresolved or cyclic reference, or any unsupported branch excludes the **entire field**; unsafe alternatives are never dropped to persist the remainder. Multi-member unions containing objects or arrays remain excluded, as do `allOf` and simultaneous composition operators. Nullable objects and arrays with a single non-null branch retain their existing nested projection support.

Explicit draft recovery can therefore restore stored Student `level: 2` over server baseline `1`. A later locale refresh with incompatible translated renderer options still resets the live level normally, and an already-dirty draft then saves that current reset value. Primitive-union support does not weaken the locale reset policy. Union operators and every branch's structural contract participate in the draft signature; old incompatible snapshots are rejected rather than migrated or silently replayed.

After field readiness callbacks settle, `ZForm` coalesces an `onSchemaRefreshed` notification using current live values. `blockForm` forwards it to the entry owner, which updates an already-dirty draft so values changed by normal field reset do not leave a stale snapshot. This notification does not mark a clean form dirty, manufacture an input-change event, or overwrite an undecided recovery candidate.

### Disable recovery or change retention

The `basic-pageentry` module configuration defaults to:

```ts
draft: {
  enabled: true,
  maxAge: 24 * 60 * 60 * 1000,
  resources: {},
}
```

Use the application's `config.modules` overrides to disable recovery globally, disable it for selected resources, or change the retention period:

```ts
config.modules = {
  'basic-pageentry': {
    draft: {
      enabled: true,
      maxAge: 24 * 60 * 60 * 1000,
      resources: {
        'training-student:student': false,
      },
    },
  },
};
```

Set `enabled: false` to disable the capability globally. A resource-entry `basic-pageentry:blockPageEntry` block can also specify `draft: false`, and root form `rest.draft: false` metadata disables the whole form. These are opt-outs from the default capability, not a requirement to manually enable every resource.

### Control which fields are persisted

Declared, editable, supported fields are included by default, including nested objects and arrays. The current form scene's effective schema controls projection: create uses `form-create`, while edit uses `form`. Unknown fields and unsafe runtime values are excluded.

Automatic exclusions include readonly fields, passwords and write-only values, obvious secret/key/token/credential/verification-code fields, file/upload/binary fields and unsupported objects such as `File`, `Blob` or DOM nodes. Drafts may hold incomplete safe input without passing submit validation. Nested detail recovery preserves existing row identity and deletion/order semantics rather than turning existing rows into new inserts; excluded server-owned values come from the current baseline.

#### Date-time fields and nested detail dialogs

For an eligible schema field declared as `type: 'string'` with `format: 'date-time'`, a valid runtime `Date` is projected to its ISO string. This is a schema-directed `Date` → ISO conversion, not a general object serializer or submit-time validation: incomplete safe primitive input is preserved without date parsing or coercion. Invalid `Date` instances, `Date` values on ordinary non-date-time fields, and unsupported non-date objects remain excluded.

The draft recovery projection intentionally restores the ISO **string**, without adding a Date reviver. The existing model persistence parser may revive ISO strings before recovery; the projection normalizes eligible Dates back to ISO. Basic Date accepts both runtime Dates and ISO strings, so reopening a recovered Training Record dialog displays the stored Training Time through the same native date control. Its date-only input represents midnight in the browser's local timezone; the projected ISO value expresses that instant in UTC. Clearing an optional date preserves the explicit absence so recovery does not silently restore the server's date.

A nested Details dialog has its own local form. Edits enter the parent resource form—and therefore its draft—only after the dialog's **OK** action. Cancel does not copy them into the parent. Dialog OK is not a business-resource submission: draft persistence and recovery do not create or update server records. Incompatible old snapshots are rejected through the schema signature rather than migrated or revived.

For business-sensitive content that cannot be reliably identified by automatic metadata, declare an explicit exclusion on the backend contract:

```ts
@Api.field(ZovaRender.draft(false))
privateNote: string;

// Exclude this field only in create-form drafts.
@Api.field(ZovaRender.draft(false, 'form-create'))
verificationCode: string;
```

Applied to an object or array field, `draft(false)` excludes the entire subtree. Scene-specific metadata follows the existing shared-form and exact-scene overlay rules. An explicit `draft(true)` does not override automatic sensitive, readonly or unsupported-value exclusions.

`ZovaRender` is generated from frontend-owned metadata. After changing that authoring surface, follow the [Contract Loop Playbook](/fullstack/contract-loop-playbook): build the affected paired SSR/REST flavor outputs before synchronizing Vona dependencies; do not patch generated consumers manually.

### Browser storage boundaries

Drafts use the generic [Model IndexedDB environment isolation](./model-state-guide.md#indexeddb-environment-isolation): application name and `[instanceId, siteId, userId]` belong to the persistence layer, not the draft business selector. The selector contains only `[resource, mode, id ?? null, path]`. Passport supplies the authoritative instance/user identity; draft discovery still requires an authenticated, non-anonymous user. A captured scope/epoch token invalidates old editors and queued cleanup after an instance, site or user switch, including switching away and back. Logout deliberately clears the entire shared Model DB store; it does not transfer another account's drafts into the new form. There is no draft-specific database adapter or legacy-key migration.

IndexedDB is **not encryption**. Automatic exclusions are defensive defaults, not a guarantee that every business-sensitive field can be recognized; exclude additional fields or disable sensitive resources deliberately. Storage failure is nonfatal and does not prevent normal editing or submission, but unfinished writes cannot be guaranteed durable if the browser terminates immediately.

There are no application-level draft-count or byte limits. Browser storage availability and native quota still apply. The same resource/task identity in two browser tabs shares one draft key; independent simultaneous create drafts and cross-tab conflict coordination are not provided.

## What this guide does not re-explain

This page does **not** fully re-explain:

- the internals of `ZForm` itself -> see [Zova Form Under the Hood](/frontend/zova-form-under-the-hood)
- the full `formScene -> formMeta -> pageMeta` bridge -> see [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide)
- the routed-shell host mechanics -> see [Router Tabs Mechanism](/frontend/router-tabs-mechanism)

Its job is only to explain how the entry page runtime is assembled across route shell, Basic blocks, and shared host context.

## Debugging checklist

If a resource entry page behaves unexpectedly, ask:

1. is the route resolving the expected `resource`, `id`, and `formScene`?
2. is `ControllerPageEntry` loading the expected `formSchema.rest.blocks`?
3. is the expected `basic-pageentry:*` block actually present in the schema?
4. is `blockPageEntry` resolving the expected `ModelResource` selector state?
5. is `blockForm` receiving the correct `schemaScene`, `formMeta`, and `formData`?
6. is `blockToolbarRow` consuming the expected `$$pageEntry` context?
7. is submit/page-meta flow failing in `blockPageEntry`, rather than in the outer route shell?

## Where to read next

Use these next steps depending on your question:

- if you want the resource module bridge: [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)
- if you want the shortest source map: [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map)
- if you want the form runtime branch: [Zova Form Under the Hood](/frontend/zova-form-under-the-hood)
- if you want the `formScene -> formMeta -> pageMeta` chain: [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide)
- if you want action visibility rules: [Permission, formScene, and Action Visibility Guide](/frontend/permission-formscene-action-visibility-guide)

## Final takeaway

The most accurate way to read a resource entry page in the current Basic frontend is:

- `rest-resource` entry page is the thin route shell
- schema-defined blocks choose the deeper runtime pieces
- `basic-pageentry:blockPageEntry` owns the real entry runtime
- `blockForm` and `blockToolbarRow` consume the same shared host context
- submit flow and page-meta flow live in that deeper runtime layer

That is the source-confirmed entry-page runtime path in the current Cabloy Basic frontend architecture.
