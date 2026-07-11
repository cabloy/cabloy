# File Guide

This guide describes the Vona file contract in Cabloy Basic: scenes, providers, file lifecycle, delivery, and DTO-side file views.

Use it with [Frontend File Guide](/frontend/file-guide) and [Fullstack File Workflow](/fullstack/file-workflow).

## Core model

A file use case is a named backend capability:

- `@FileScene(...)` defines the business upload policy;
- `app.bean.file` owns storage orchestration and lifecycle;
- a provider owns storage and provider-native delivery;
- entities persist file IDs, while serializer transforms resolve consumer-facing file views.

The client supplies a `fileScene`, never a provider identity, client configuration, visibility decision, bucket, or storage key.

## Three ingestion models

### Authenticated multipart upload

`POST /file/upload` is the portable default. It accepts one authenticated multipart request:

```text
fileScene + file
```

Vona reads the received temporary file, resolves the scene server-side, validates actual size, MIME type, and extension, stores the file through the selected provider, and returns a ready file action response. The Native provider supports this model.

### Remote HTTPS URL import

`POST /file/upload-url` is provider capability-based. Native does not support it. The R2 provider imports only after Cabloy applies its shared remote-fetch boundary:

- HTTPS and port 443 only, without URL credentials;
- every hop is DNS-resolved and checked against private, loopback, link-local, multicast, unspecified, reserved, and documentation address ranges;
- redirects are bounded and validated again at every hop;
- connection, response, read, and whole-transfer timeouts apply;
- transfer bytes stream to a private temporary directory with scene-derived actual-byte limits;
- fetched filename, response MIME type, size, and extension are validated before storage;
- temporary files are cleaned on success and failure.

Request-declared size, MIME type, content type, and object key are admission hints, not stored remote-file truth.

### Direct provider upload

A direct-capable R2 scene uses an explicit completion lifecycle:

```text
create draft → browser raw PUT to R2 → finalize → ready
```

1. `POST /file/direct-upload` creates a time-limited draft and returns a presigned raw-body target.
2. The browser sends the raw file using the returned method and headers, without Cabloy credentials.
3. `POST /file/direct-upload/finalize` verifies the persisted R2 bucket/key with `HeadObject`.
4. Vona validates final size and content type, persists final ETag metadata, and promotes the file to `ready`.

A `draft` is not downloadable, resolvable as a file view, or eligible for a business relation. Expired drafts are pruned by a bounded scheduled job and become `expired`.

## File scenes and provider capability

Use `@FileScene(...)` for per-use-case maximum size, MIME types, extensions, public/private policy, metadata, and provider selection. The public upload policy exposes only semantic capability such as `directUpload`; it does not disclose provider, client, bucket, or storage keys.

Direct upload is advertised only when the selected provider implements both target creation and finalization. Native therefore reports `directUpload: false`.

## Persist IDs; resolve views

Business entities persist `TableIdentity` values. DTOs expose display and delivery data with `a-file:resolveView` or `a-file:resolveViews`:

```ts
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

The resolved view provides filename, content type, size, upload time, visibility, signed state, and `downloadUrl`. Provider routing, object keys, ETags, lifecycle state, and storage paths remain internal.

## Delivery and attachments

Files are private by default. Private delivery can be:

- a temporary Cabloy proxy URL when a provider uses proxy signing;
- a provider-signed R2 URL when R2 uses provider signing.

`GET /file/download/:fileId` is route-public so signed links work, but private file access still requires a route- and file-bound token. When Cabloy streams bytes, it sets the attachment filename. When it redirects to a provider URL, download-versus-inline behavior is controlled by the provider response.

## Backend checklist

1. define a `@FileScene(...)` for each business file capability;
2. use one authenticated multipart upload unless policy advertises direct upload;
3. use remote URL import only through a provider that implements the shared secure fetch boundary;
4. persist IDs and resolve `DtoFileView` relations for consumers;
5. write business relations only from a ready/finalized result;
6. preserve signed delivery and attachment semantics when changing providers.
