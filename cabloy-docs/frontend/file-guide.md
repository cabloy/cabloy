# File Guide

This guide explains the Zova `basic-file` contract in Cabloy Basic. It is a metadata-driven, relation-backed field: the backend defines a file scene, the business field persists IDs, and DTO relations supply completed-file display and delivery data.

> Read this with [Backend File Guide](/backend/file-guide) and [Fullstack File Workflow](/fullstack/file-workflow). For the surrounding Zova architecture, see the [Frontend Source Reading Roadmap](/frontend/frontend-source-reading-roadmap) and [Zova Source Reading Map](/frontend/zova-source-reading-map).

## Persisted IDs and resolved relations

The primary form value is a file ID, never a storage URL:

| Shape            | Contract                                                                |
| ---------------- | ----------------------------------------------------------------------- |
| Single file      | `TableIdentity`; an empty field is `''`                                 |
| Multiple files   | `TableIdentity[]`                                                       |
| Display relation | DTO-resolved `DtoFileView` data, such as `dossierFiles?: DtoFileView[]` |

`IFilePreviewItem` is an internal `basic-file` display-normalization shape. It is not a public backend DTO contract. Persist IDs and expose a `DtoFileView` relation for rendering.

The training-record example aligns one scene, ID field, and relation name:

```ts
// EntityRecord: persisted field and resource renderers
@Api.field(
  ZovaRender.field('basic-file:formFieldFile', {
    fileScene: 'training-record:dossierFile',
    relationName: 'dossierFiles',
    maxCount: 3,
  }),
  ZovaRender.cell('basic-file:file', { relationName: 'dossierFiles' }),
  v.array(v.tableIdentity()),
)
dossierFileIds?: TableIdentity[];

// DtoRecordView: consumer projection
@Api.field(
  v.optional(),
  v.serializerTransform('a-file:resolveViews', {
    fieldName: 'dossierFileIds',
    fileScene: 'training-record:dossierFile',
  }),
  v.array(DtoFileView),
)
dossierFiles?: DtoFileView[];
```

The default naming convention maps `fooId` to `foo` and `fooIds` to `foos`. This inference is mechanical; provide `relationName` when the business name differs.

## Built-in resources

- `basic-file:formFieldFile` manages browser selection, local checks, transport selection, completed-file cards, and form/relation synchronization.
- `basic-file:file` renders a resolved relation in a table.
- `ModelFile` owns shared upload-policy query state. The field controller owns only interaction and upload state.

The table cell does not resolve metadata from IDs. With one resolved item it renders a download link; with several it displays the first filename and a `+N` selection surface. Without a resolved relation it can only fall back to the raw cell value.

## Configure `basic-file:formFieldFile`

`fileScene` has an optional TypeScript type but is operationally required before a user can select/upload a file.

| Option         | Purpose and precedence                                                                             |
| -------------- | -------------------------------------------------------------------------------------------------- |
| `fileScene`    | Required backend scene for policy lookup and upload.                                               |
| `relationName` | Explicit resolved-relation field; otherwise infer `fooId → foo` or `fooIds → foos`.                |
| `multiple`     | Local override; otherwise uses scene policy.                                                       |
| `maxCount`     | Frontend-only retained-item limit. Defaults to `1`; single mode is always one.                     |
| `accept`       | Browser accept string or tokens. When present, it overrides composed MIME/extension accept values. |
| `mimeTypes`    | Local client restriction; falls back to scene policy when omitted.                                 |
| `extensions`   | Local client restriction; falls back to scene policy when omitted.                                 |
| `maxSize`      | Local client maximum; falls back to scene policy when omitted.                                     |
| `minSize`      | Frontend-only minimum size.                                                                        |
| `placeholder`  | Empty-field text.                                                                                  |

For composed browser acceptance, explicit `accept` wins. Otherwise local MIME types and extensions are used by category, falling back to policy values for omitted categories. The server always validates the real upload; browser validation is UX, not a security or storage boundary.

A scene can publish `multiple: true` while the field still retains only one item: set `maxCount` above `1` when the UI should allow multiple files.

## Model-owned policy state

`ModelFile.getUploadPolicy(fileScene)` creates scene-keyed `$useStateData(...)` state using `['uploadPolicy', 'file', fileScene]` and `disableSuspenseOnInit: true`.

Rendering establishes this query without suspending the initial form. The upload button is disabled while a real scene policy is pending. At the file-selection boundary, the controller calls `$QueryEnsureLoaded(...)` before it chooses cardinality, checks policy-backed constraints, or selects a transport. Fields with the same scene reuse the same model-owned policy state.

## Upload behavior

### Ordinary scenes

When policy does not advertise direct upload, the field uses the generated API action:

```ts
await scope.api.file.upload({ fileScene, file });
```

This is one authenticated multipart request. The completed response is ready, so the field updates its ID value and resolved relation together.

### Direct-capable scenes

When policy publishes `directUpload: true`, the field performs:

```text
create target
→ raw File fetch using returned method and headers
→ finalize through Cabloy
→ update form state from finalized response
```

The browser branches only on `directUpload`, never on provider identity. It sends raw `File` bytes with the returned method and headers; current R2 targets use `PUT`. Do not add Cabloy credentials, cookies, or guessed headers to the provider request. Provider CORS must allow the frontend origin, method, and returned headers.

The component supports raw-body `PUT`/`POST` targets, not HTML-form/presigned-POST field protocols. It intentionally has no progress reporting, cancellation, retry, timeout, parallel transfer, or rollback UI. A direct draft ID never enters the ID field or relation; only the final ready response does.

`ApiFile.uploadUrl()` exists for authorized custom consumers. `basic-file:formFieldFile` has no remote URL-import UI and never fetches a remote URL itself.

## Relation synchronization and batch behavior

After a ready ordinary upload or ready direct finalization, the controller rebuilds the ID value and relation in the same form operation. It keeps resolved data already supplied by the DTO, merges newly returned upload data, and uses an ID-only fallback only when metadata is unavailable.

Removing an item changes form state only. It does not call a file-delete API or remove stored provider content.

Multiple selected files are processed sequentially and are not transactional:

- local validation failures can be skipped while later files continue;
- a thrown upload or finalization failure prevents the current batch from committing its new IDs to the form;
- an earlier successfully stored file is not automatically rolled back if a later file fails;
- failed direct transfers/finalizations can leave a backend draft or object for lifecycle cleanup.

Do not describe the form-state boundary as a storage rollback guarantee.

## Delivery and SSR

Render the resolved `downloadUrl`; never derive a provider URL from an ID, bucket, or storage key. `basic-file` prefixes a relative `/api/...` URL with configured `api.baseURL`; absolute CDN and provider-signed URLs pass through unchanged.

For a private Admin relation that the backend resolves with `deliveryOptions.audience: true`, the browser adds a short-lived, path-scoped passport code only when the user opens a download. The code is model-owned, shared by the current user for the file-download route family, and is not written back into the DTO URL. The delivery URL also remains resource-bound, so the code cannot authorize a different file. SSR never requests or serializes this passport code.

The hidden native file input is inside `ClientOnly`. Existing relation cards and raw download anchors can render during SSR, but file selection, direct provider transfer, and user-bound download URL decoration are browser-only. Policy lookup itself is model-owned rather than wrapped in `ClientOnly`, while the selection boundary waits for strict policy readiness.

## File UI remains file-specific

The field presents filename, content type, human-readable size, upload time, download, and removal. It intentionally does not inherit image crop, resize, thumbnail, gallery, variant, or transform behavior.

## Frontend checklist

1. Define the backend `fileScene` before configuring the field.
2. Persist ID values and expose matching `DtoFileView` relations.
3. Keep `relationName`, persisted field, serializer transform, and scene name aligned.
4. Let `ModelFile` own policy state and branch only on semantic policy capability.
5. Configure `maxCount` explicitly for multi-file UI.
6. Update IDs/relations only from ready/finalized responses.
7. Render resolved `downloadUrl` values rather than storage-derived paths.
