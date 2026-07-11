# Fullstack File Workflow

This page follows a Cabloy Basic file field from Vona contract truth to Zova interaction. It is the forward contract loop for `a-file` and `basic-file`.

> Read this with [Backend File Guide](/backend/file-guide), [Frontend File Guide](/frontend/file-guide), and [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).

## One business field, two consumer surfaces

A file-backed business field persists IDs, while a DTO relation carries completed-file presentation data. The training-record module is the reference pattern:

```ts
// Vona scene: one trusted business capability
@FileScene({
  public: false,
  upload: {
    maxSize: 20 * 1024 * 1024,
    mimeTypes: ['application/pdf', 'application/zip', 'text/plain'],
    extensions: ['.pdf', '.zip', '.txt'],
    multiple: true,
  },
})
export class FileSceneDossierFile extends BeanBase {}

// Entity: persist only IDs and attach Zova resource renderers
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

// Consumer DTO: resolve completed display/delivery data
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

Keep the persisted field, resolved relation, `relationName`, and scene name aligned. `DtoFileView` is a consumer projection; it does not replace ID persistence. The serializer verifies the optional scene while resolving IDs, preventing a relation from silently consuming a file from another business capability.

## Three ingestion paths and readiness

### 1. Ordinary local upload

```text
Zova field
→ authenticated POST /file/upload(fileScene, file)
→ Vona validates received multipart file and resolves scene/provider
→ provider storage
→ ready action response
→ ID field and relation update
```

The backend owns validation and storage. The response is ready immediately after backend storage; this is the portable Native-compatible path and needs no file upload token.

### 2. Remote HTTPS URL import

```text
authorized server/API consumer
→ POST /file/upload-url
→ provider capability check
→ secure HTTPS remote-fetch boundary
→ provider storage
→ ready action response
```

Remote import is not built into the browser field. It is a server/provider operation: the selected provider validates remote URL safety and actual content before storage. Native does not support this path; Cloudflare R2 does. A browser must not implement its own unrestricted remote fetch.

### 3. Third-party direct upload

```text
policy.directUpload
→ POST /file/direct-upload
→ Cabloy draft + raw-body provider target
→ browser transfers raw File without Cabloy credentials
→ POST /file/direct-upload/finalize
→ provider metadata verification + ready state
→ ID field and relation update
```

A direct target is draft-only, not a completed file. Finalization is the only promotion to `ready`; drafts cannot resolve views, be downloaded, or enter business IDs/relations. The frontend uses returned method/headers for raw file transfer and stores only the finalized response.

## Forward contract loop

When a File contract changes, work from backend truth toward generated consumers:

1. define or update the Vona `@FileScene`, persisted ID field, controller/DTO policy, and `a-file:resolveView(s)` relation;
2. regenerate Vona metadata and inspect the emitted Swagger/OpenAPI contract;
3. regenerate the filtered `basic-file` OpenAPI consumer;
4. keep hand-authored Zova behavior in `ModelFile`, `ControllerFormFieldFile`, and `TableCellFile` thin and policy-driven;
5. build the affected Admin and Web flavors, then run `npm run deps:vona` for the reverse dependency handoff.

Generated contract outputs include:

```text
zova/.../basic-file/src/api/file.ts
zova/.../basic-file/src/apiSchema/file.ts
zova/.../basic-file/src/api/openapi/types.ts
zova/.../basic-file/src/api/openapi/schemas.ts
```

Do not hand-edit these generated files. `ModelFile`, the form-field controller, the table cell, and Vona render metadata are hand-authored extension points.

## Cross-layer invariants

| Layer             | Owns                                                                                                     | Must not own                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Vona `a-file`     | scene policy, provider/client selection, actual validation, lifecycle, storage, visibility, and delivery | browser-controlled provider or storage choices                     |
| DTO serializer    | safe `DtoFileView` projection and scene matching                                                         | persistence replacement or storage metadata disclosure             |
| Zova `basic-file` | picker UX, local UX checks, policy-driven transport, ID/relation synchronization                         | provider selection, storage URL construction, or draft persistence |
| Provider transfer | raw body transfer for a direct target                                                                    | Cabloy session credential forwarding                               |

The frontend reads `downloadUrl` from a resolved view; it never constructs delivery URLs from IDs, buckets, or object keys. Upload-policy capability is semantic (`directUpload`), so frontend code never branches on provider identity.

## Verification checklist

For a File contract or workflow change, verify:

1. the scene policy and persisted ID field match the intended business capability;
2. create/view/list DTO schemas expose the matching `DtoFileView` relation and serializer transform;
3. Swagger/OpenAPI contains the expected policy, multipart, direct-finalize, and URL-import actions;
4. regenerated `basic-file` API/schema output is used rather than hand-patched;
5. Native reports no direct/URL-import capability while the configured Cloudflare R2 scene advertises direct upload only when creation and finalization are both available;
6. a draft cannot resolve a view or download URL, and the form updates only after finalization;
7. private/public delivery still uses resolved URLs without leaking provider/storage data;
8. run the affected Admin and Web builds and then `npm run deps:vona` after a generated frontend handoff.
