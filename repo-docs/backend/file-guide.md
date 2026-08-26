# File Guide

This guide describes the Vona file contract in Cabloy Basic: scenes, providers, ingestion, lifecycle, delivery, and DTO-side views.

> Read this with [Frontend File Guide](/frontend/file-guide) and [Fullstack File Workflow](/fullstack/file-workflow). `a-file` is the core module; the built-in provider modules are Native (`file-native`) and Cloudflare R2 (`file-cloudflare`).

## Core model and trust boundary

A file use case is a named backend capability:

- `@FileScene(...)` defines the business policy;
- `app.bean.file` orchestrates provider storage and lifecycle;
- a provider owns storage-specific behavior and delivery;
- business entities persist file IDs, while serializer transforms resolve consumer-facing `DtoFileView` data.

The HTTP client supplies a `fileScene`; it never chooses the provider, client, visibility, bucket, object key, ETag, or storage path. Those values remain backend-owned.

The current defaults are:

| Setting                      | Default              |
| ---------------------------- | -------------------- |
| Provider                     | `file-native:native` |
| Provider client              | `default`            |
| Visibility                   | private              |
| Maximum upload size          | 20 MiB               |
| Direct-upload draft lifetime | 30 minutes           |

Scene `upload` options override global `file.upload` options. Visibility resolves in this order: `FileScene.public`, then the selected provider client's `public`, then global `file.public`, then `false`.

## Define a file scene

Define a scene for every business capability. It owns provider selection, public/private policy, admission constraints, and optional metadata.

```ts
import { BeanBase } from 'vona';
import { FileScene } from 'vona-module-a-file';

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
```

The training-record suite implements this pattern in `FileSceneDossierFile`. Extensions are lowercase and include the leading dot. `provider` can be a fixed `{ providerName, clientName }` pair or an async resolver receiving the current Vona context; `meta` can likewise be static or context-derived. Use those resolvers for trusted tenant or user routing, not browser-provided storage choices.

## Provider capabilities

A provider implements `IFileProviderExecute`. Its capabilities determine what a selected scene can do.

| Capability                                    | Requirement   | Meaning                                                                                    |
| --------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------ |
| `upload`, `get`, `delete`, `getDownloadUrl`   | Required      | Normal storage, retrieval, deletion, and delivery                                          |
| `uploadUrl`                                   | Optional      | Server-side remote URL import                                                              |
| `createDirectUpload` + `finalizeDirectUpload` | Optional pair | Third-party direct upload; both are required before policy advertises `directUpload: true` |
| `download`                                    | Optional      | Provider can stream/return a download result instead of only a URL                         |

The public upload-policy response exposes semantic constraints and `directUpload` only. It never exposes a provider name, client name, bucket, object key, ETag, or provider credentials.

Native supports ordinary multipart upload and proxy-style private delivery. It intentionally does **not** implement remote URL import or direct-upload creation/finalization. Cloudflare R2 is registered as `file-cloudflare:cloudflare`; it supports ordinary upload, secure URL import, and direct upload.

## Three ingestion models

### Authenticated multipart upload

`POST /file/upload` is the portable default:

```text
fileScene + file → backend validation/storage → ready response
```

It accepts one multipart `fileScene` field and one file. Vona reads the received temporary file, resolves the scene, validates actual size, received multipart MIME type, and filename extension, then stores it with the selected provider. The returned action response is already `ready`.

MIME and extension checks are policy checks, not binary magic-byte inspection. Treat them as one layer of admission control rather than a content-safety scanner.

### Remote HTTPS URL import

`POST /file/upload-url` is an authorized, provider-capability operation. Native rejects it. Cloudflare R2 imports through the shared remote-fetch boundary:

- only HTTPS on port 443, with no URL credentials;
- at most three redirects, with URL and DNS/IP checks repeated for every hop;
- each hostname is resolved before connection, all answers must be public, and the validated address is pinned for that request;
- loopback, private, link-local, multicast, unspecified, reserved, shared, and documentation IPv4/IPv6 ranges are rejected;
- connection, response, read, and overall deadlines are enforced;
- bytes stream to a private `0600` temporary file and are limited by the scene's actual-byte policy;
- the filename is sanitized, while response content type and extension are checked against policy;
- temporary files are removed on success and failure.

Request-declared size, MIME type, content type, and object key are not persisted remote-file truth. The response headers, transferred bytes, and resolved filename drive validation and storage. A browser field must not fetch an arbitrary URL and forward it to Cabloy; build an explicitly authorized backend consumer when URL import is needed.

### Third-party direct upload

A direct-capable R2 scene uses an explicit lifecycle:

```text
create draft → browser raw provider transfer → finalize → ready
```

1. `POST /file/direct-upload` creates a draft and returns a presigned raw-body target.
2. The browser sends the raw file with the returned method and headers, without adding Cabloy credentials.
3. `POST /file/direct-upload/finalize` queries the persisted R2 object with `HeadObject`.
4. Vona verifies object existence, the reserved size, and content type; persists final metadata; and promotes the row to `ready`.

A draft cannot resolve to a file view, receive a download URL, be downloaded, or become a business relation. The scheduled prune job runs every 30 minutes, handles at most 100 expired drafts per execution, deletes provider content, and then marks the row `expired`. Finalization and expiration share a per-file Redlock. If provider deletion fails, the draft remains eligible for a later pruning retry.

Direct finalization validates provider metadata; it does not inspect file magic bytes or re-run filename-extension admission after provider transfer.

## Persist IDs; resolve safe views

Business data persists `TableIdentity` values. Consumer DTOs expose a safe projection using `a-file:resolveView` or `a-file:resolveViews`:

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

A resolved `DtoFileView` contains only completed-file presentation and delivery data: ID, filename, content type, size, visibility, upload time, `downloadUrl`, and signed state. Provider/client identities, bucket, object key, ETag, storage path, raw SDK output, metadata, status, and draft timestamps remain internal.

The serializer also checks the optional `fileScene`. A relation with the wrong scene is rejected rather than silently resolving a file from a different business capability.

## Delivery and trusted backend APIs

Files are private by default. Private delivery can be either a temporary Cabloy proxy URL or a provider-signed R2 URL. `GET /file/download?fileId=...` is route-public so a signed link can be opened. Proxy delivery still requires a temporary token bound to the delivery endpoint and a signed payload whose file ID must match the request query.

When Cabloy streams bytes it can set an attachment filename. When Cabloy redirects to a provider URL, download-versus-inline behavior is controlled by that provider response and the browser.

`app.bean.file` is a trusted backend API and can accept provider/client options, visibility, metadata, and object-key inputs. Do not treat that lower-level API as the browser contract or forward untrusted request values into those fields.

## Backend checklist

1. Define one `@FileScene(...)` per business capability.
2. Keep provider, visibility, and storage decisions on the server.
3. Use ordinary multipart upload unless the resolved policy advertises direct upload.
4. Use URL import only through a provider that implements the secure backend fetch boundary.
5. Persist IDs and resolve `DtoFileView` relations for consumers.
6. Write business relations only from ready/finalized responses and preserve signed delivery semantics when changing providers.
