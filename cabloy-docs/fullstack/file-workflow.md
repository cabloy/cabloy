# Fullstack File Workflow

This page follows a Cabloy Basic file field from Vona contract truth to Zova interaction.

Use it with [Backend File Guide](/backend/file-guide), [Frontend File Guide](/frontend/file-guide), and [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).

## One field, two consumer surfaces

A file field normally carries:

- persisted scalar or array ID values, such as `dossierFileIds`;
- a DTO-resolved display relation, such as `dossierFiles?: DtoFileView[]`.

The relation is a consumer projection, not a replacement persistence shape. It provides completed-file metadata and `downloadUrl`.

```ts
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

## Three ingestion paths

### 1. Ordinary local upload

```text
Zova field
→ POST /file/upload(fileScene, file)
→ Vona validates actual multipart file and resolves scene/provider
→ provider storage
→ ready action response
→ IDs and relation update
```

This is the portable Native-compatible default. It is one authenticated multipart request; no file upload token participates.

### 2. Remote HTTPS URL import

```text
authorized API call
→ POST /file/upload-url
→ provider capability check
→ secure HTTPS remote fetch and actual policy validation
→ provider storage
→ ready action response
```

Native is unsupported. R2 import runs through the backend security boundary, including redirect/DNS/IP checks, streamed limits, timeouts, actual metadata validation, and temporary-file cleanup. A UI must not add its own unrestricted remote fetch.

### 3. Third-party direct upload

```text
Zova policy directUpload
→ POST /file/direct-upload
→ Cabloy draft + R2 raw PUT target
→ browser sends raw File to R2
→ POST /file/direct-upload/finalize
→ HeadObject verification + ready state
→ IDs and relation update
```

A direct target is not a completed file. The form field retains its previous value while creation, provider transfer, or finalization fails. Only the finalized response becomes a stored business ID and resolved relation. Expired drafts are pruned asynchronously.

## Contract-loop order

This workflow is a forward contract chain:

1. change Vona controller, DTO, policy, provider, and serializer truth first;
2. regenerate Vona metadata and inspect Swagger/OpenAPI;
3. regenerate Zova OpenAPI consumers instead of hand-editing generated API files;
4. keep the hand-authored Zova follow-up inside `ModelFile` and `ControllerFormFieldFile`;
5. build Admin and Web outputs, then refresh Vona dependencies when the generated frontend handoff changes.

The backend remains the authority for scene policy, selected provider, visibility, storage location, actual file validation, direct readiness, and signed delivery. The frontend owns interaction and writes state only from a completed result.

## Delivery

Use the DTO-resolved `downloadUrl`; do not derive URLs from IDs. A private view can resolve to a Cabloy proxy token URL or an R2 signed URL. Cabloy can attach a filename only when it streams bytes; a provider redirect follows provider/browser disposition behavior.

## Verification checklist

1. ordinary multipart sends exactly `fileScene` and `file`;
2. direct policy selection does not reveal provider identity;
3. a direct draft cannot resolve a view or download URL;
4. form state changes only after finalization;
5. private/public completed delivery still works;
6. generated File API includes policy capability and finalization;
7. Admin and Web builds plus dependency handoff are refreshed after generated changes.
