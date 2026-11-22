# Image Guide

This guide explains how to use **Vona image** in Cabloy Basic with a practical, contract-first path.

Vona image is not only a file-upload helper. It is a backend image layer built around:

- image scenes for business-specific upload policy
- image providers for storage and delivery behavior
- token-based upload and signed delivery flows
- named variants and ad hoc transforms
- serializer transforms that turn stored image IDs into `DtoImageView` output

Use this page together with:

- [Upload Guide](/backend/upload-guide)
- [Serialization Guide](/backend/serialization-guide)
- [Bean Scene Authoring](/backend/bean-scene-authoring)
- [OpenAPI Guide](/backend/openapi-guide)
- [Frontend Image Guide](/frontend/image-guide)

> [!TIP]
> **Image docs path**
>
> - **[Backend Image Guide](/backend/image-guide)** — learn image scenes, providers, serializer transforms, delivery policy, and backend lifecycle behavior
> - **[Frontend Image Guide](/frontend/image-guide)** — learn `basic-image:formFieldImage`, `basic-image:image`, relation previews, and client-side image-field behavior
>
> Use the backend guide when the question is about image scenes, providers, serializer transforms, signed delivery, or upload policy enforcement. Use the frontend guide when the question is about forms, tables, previews, or client-side upload UX.

Read this page first when your next question is:

- which image scene should own this upload flow
- which provider or delivery mode should be used
- how `resolveView` or `resolveViews` fit into the DTO contract

## Why the image suite exists

Real image handling usually needs more than accepting a multipart file.

A typical business flow also needs to answer questions such as:

- which upload use cases are allowed
- which provider should own the file
- what size and MIME types are allowed
- whether the client uploads through the app server, uploads directly, or uploads by URL
- how the image should be delivered later
- whether delivery should be signed
- how APIs should expose image data in DTO responses

Vona treats that as one backend capability.

## Smallest correct mental model

The smallest practical model is:

- `@ImageScene(...)` defines a business upload scene
- `BeanImageUploadPolicy` resolves the scene into provider, client, upload limits, and temp tokens
- `ControllerImage` exposes the HTTP endpoints
- `BeanImage` is the main programmatic API for upload, variant URL resolution, download, delete, and DTO-side image view resolution
- `@ImageProvider(...)` implementations map the generic image contract to concrete storage or CDN behavior
- serializer transforms `a-image:resolveView` and `a-image:resolveViews` convert stored image IDs into `DtoImageView` output

That division is the key to reading the source correctly.

## Suite boundary

The image suite lives under `vona/src/suite-vendor/a-image` and is split into:

- `a-image`: the core abstraction, controller, persistence, policy, variants, and serializer transforms
- `image-native`: local filesystem storage plus Sharp-based transforms
- `image-cloudflare`: Cloudflare Images integration

In other words:

- `a-image` defines the contract
- provider modules implement the contract

## Core concepts

### Image provider

An image provider is the storage and delivery backend.

Providers are registered with `@ImageProvider(...)` and implement the `IImageProviderExecute` contract.

Representative built-in providers are:

- `image-native:native`
- `image-cloudflare:cloudflare`

Required provider capabilities are:

- `upload`
- `get`
- `delete`
- `getVariantUrl`

Optional capabilities are:

- `uploadUrl`
- `createDirectUpload`
- `download`

That means a provider can support the basic lifecycle without supporting every upload style.

### Provider client

A provider can expose multiple named clients.

`BeanImageProvider.getClientOptions(...)` resolves client options by layering:

1. caller defaults
2. provider decorator `base`
3. provider decorator `clients[clientName]`
4. persisted `aImageProvider.clientOptions`
5. caller runtime overrides

This lets one provider support multiple delivery or credential configurations without changing business code.

### Image scene

An image scene is the business-facing upload policy.

A scene is registered with `@ImageScene(...)` and can define:

- provider selection
- client selection
- upload rules
- client processing guidance in `processing`
- optional per-scene metadata

Representative scene shape:

```typescript
@ImageScene({
  upload: {
    maxSize: 2 * 1024 * 1024,
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
  processing: {
    enableCrop: true,
    cropAspectRatio: 1,
    cropShape: 'rect',
    resize: {
      width: 512,
      height: 512,
      fit: 'cover',
      format: 'jpeg',
      quality: 90,
    },
  },
})
export class ImageSceneStudentImage extends BeanBase {}
```

This keeps business upload rules and shared client processing guidance in one named backend capability instead of scattering them across controllers, services and resource fields. `processing` supports `enableCrop`, `cropAspectRatio`, `cropShape`, and `resize` options `width`, `height`, `fit`, `background`, `format` and `quality`.

**`processing` is client behavior guidance, not server normalization or a storage guarantee.** It tells a browser or Agent how to prepare bytes before upload. It does not itself crop/resize stored originals, enforce output dimensions, strip EXIF metadata or change provider delivery transforms. Upload size, MIME and extension validation remain a separate server-side boundary.

### Image variant

A variant is how an image should be delivered.

Vona supports two modes:

- a named variant such as `original` or `thumbnail`
- an ad hoc transform expressed through `transformOptions`

The built-in named variants are:

- `original`
- `thumbnail`
- `small`
- `medium`
- `large`
- `cover`
- `avatar`

The source also makes one important rule explicit:

- `variantName` and `transformOptions` are mutually exclusive

If neither is provided, Vona falls back to the configured default variant, which is currently `original`.

### Signed delivery

Vona supports signed delivery in two forms:

- **proxy-signed delivery**: Vona creates a temporary delivery token and redirects through `/image/delivery?imageId=...`
- **provider-signed delivery**: the provider generates the final signed URL directly

The built-in defaults differ:

- `image-native:native` defaults to `signedDeliveryKind: 'proxy'`
- `image-cloudflare:cloudflare` defaults to `signedDeliveryKind: 'provider'`

## Main backend API

The main backend surface is `app.bean.image`.

Representative methods are:

- `upload(...)`
- `uploadUrl(...)`
- `createDirectUpload(...)`
- `get(...)`
- `delete(...)`
- `getVariantUrl(...)`
- `download(...)`
- `resolveView(...)`
- `resolveViews(...)`

A useful practical boundary is:

- use `BeanImageUploadPolicy` when you need scene resolution and upload policy
- use `app.bean.image` when you need the actual image lifecycle and delivery behavior

## Persistence model

The core module persists two main tables.

### `aImage`

Each stored image records backend-facing data such as:

- provider and client
- provider resource ID
- filename and content type
- size, width, and height
- signed-delivery requirement
- variants
- custom metadata
- storage path
- delivery base URL
- image scene

### `aImageProvider`

Provider-client configuration is stored separately and includes fields such as:

- `disabled`
- `providerName`
- `clientName`
- `clientOptions`

If a provider-client record does not exist yet, `BeanImageProvider` can lazily register it.

## Operational flows

## Read the current upload policy {#upload-policy}

After resolving an existing registered `imageScene`, call `POST /image/upload-policy` with `{ imageScene }`. It returns the effective scene policy: `imageScene`, upload limits such as `maxSize`, `mimeTypes`, `extensions` and `multiple`, visibility/direct-upload capability, and the scene's optional `processing` guidance. Resource `rest.form.options.imageScene` selects the scene; `relationName` stays on the resource field to pair its stored ID with a resolved relation, not in `ImageScene.processing`.

The Action is exposed through MCP as **`a-image_image_getUploadPolicy`**, explicitly classified **`readOnly: true`** despite using HTTP POST. A connected Agent discovers it on the selected connection, retrieves its exact current input/output contracts with `cabloy_tool_contract`, resolves the scene, then reads its current policy before preparing a copy. Do not infer a scene or processing defaults from field names or old examples. Browser resource image fields consume the same scene upload limits and processing guidance without field-level type, size or processing overrides.

Policy lookup is not an upload, a storage guarantee or authority to bind an image. MCP scope, Action guards/RBAC, Site admission and active instance/data scope remain independent for policy, upload and business-resource Actions. See [MCP image upload](/mcp/mcp-controller-tools#json-image-upload) for the connected-client sequence.

## Authenticated multipart upload

Ordinary image upload is one authenticated multipart request:

1. submit `POST /image/upload` as multipart form data
2. send:
   - `imageScene`
   - `image`
3. Vona reads the received file's actual size and MIME type
4. Vona resolves the image scene, provider, visibility, and metadata server-side
5. Vona validates actual size, MIME type, and extension against the scene policy, then uploads through the resolved provider

Representative controller shape:

```typescript
@Web.post('upload')
@Core.fileUpload({
  busboy: {
    limits: { fields: 1, files: 1, parts: 3 },
  },
})
@Api.contentType('application/json')
async upload(
  @Arg.field('imageScene', v.required(), z.string()) imageScene: string,
  @Arg.file('image', v.required()) file: IUploadFile,
) {
  const policy = await this.bean.imageUploadPolicy.resolveUploadPolicy({
    imageScene,
    size: (await fse.stat(file.file)).size,
    mimeType: file.info.mimeType,
  });
  await this.bean.imageUploadPolicy.validateUploadFile(...);
  return await this.bean.image.upload(...);
}
```

The normal passport guard remains the authorization boundary. Temporary tokens are still used for signed delivery where needed, but ordinary image upload does not issue or accept an upload token.

## Authenticated JSON/base64 upload {#authenticated-json-base64-upload}

`POST /image/upload-base64` accepts a bounded JSON body when the caller already has local image bytes. It is an alternative to multipart transport, not remote URL ingestion or a new image-storage lifecycle. The Action is also exposed as the write tool **`a-image_image_uploadBase64`** through the ordinary authenticated MCP mapping.

The HTTP JSON body and MCP tool arguments have the same **flat** shape:

```ts
{
  imageScene: string;
  filename: string;
  mimeType: 'image/png' | 'image/jpeg' | 'image/webp';
  base64: string;
}
```

- `imageScene` names an existing server-registered scene; the caller cannot select a provider, client, public/private flag, metadata, user or instance through extra fields.
- `filename` is a nonempty filename with the matching `.png`, `.jpg`/`.jpeg`, or `.webp` extension. The server reduces path-like input to a basename and rejects invalid filenames.
- `mimeType` must match the detected byte content, not merely the filename or caller declaration.
- `base64` is canonical padded standard base64 only: no data-URL prefix, whitespace or URL-safe alphabet. Decoded bytes must be nonempty and **at most 2 MiB (2 × 1024 × 1024 bytes)**. The JSON envelope is larger because of base64 encoding; its separate transport bounds still apply.

The JSON entrypoint admits PNG, JPEG and WebP only, even if a scene permits another format. Existing scene/provider availability and upload size, MIME and extension policy still apply and can narrow that ceiling. The server decodes into a private temporary runtime directory, validates the scene policy, uploads through the selected provider and removes its temporary input in `finally`. This entrypoint does not crop, resize, strip EXIF metadata or perform face detection. Read the [current upload policy](#upload-policy), prepare a separate copy using its `processing` guidance, then validate the resulting bytes against both scene upload limits and this entrypoint's fixed format/size limits before uploading once. Processing guidance is not a promise of server normalization.

The response is the ordinary `DtoImageUploadResponse`: canonical **`id`**, with optional `filename`, `contentType`, `size`, `width`, `height`, `public`, `url` and `signed`. Through MCP this object is `result.structuredContent` directly, not `{ result: ... }`. Use its `id` when assigning a business resource's `imageId`; neither a provider ID nor `url` is that identity. A returned URL does not guarantee client reachability or inline rendering.

### Authorization and recovery

This Action uses normal Passport authentication, like the other image upload Actions, without an additional upload-specific RBAC permission. A public image scene controls image visibility; it does **not** permit anonymous upload or authorize a later business-resource update.

For an operator calling through MCP, use a personal access token issued for the exact enabled SSR Site resource, with `mcp:all` or an eligible exact custom scope, and current Site/MCP admission. A token for another Site, `mcp:read`, or knowledge of the tool name is insufficient. Any subsequent resource-update permission remains independent. See [MCP image upload](/mcp/mcp-controller-tools#json-image-upload) and [Personal access tokens](/mcp/mcp-browser-authorization#site-scoped-account-security-management).

Upload is a persisted, non-idempotent write. An error, timeout or lost response can happen after storage or image-record creation; automatic retry can create another image. The upload and a later business binding are separate writes, not one transaction. If binding fails after an acknowledged upload, retain the returned `id`, inspect the target resource with separately authorized reads, and explicitly complete the binding or arrange authorized cleanup of an unused image. Do not blindly re-upload, replay an uncertain update or delete an image that might already be referenced.

For connected Agent clients, load the applicable [Cabloy MCP image Skill](https://github.com/cabloy/cabloy/tree/main/repo-client-governance/skills/cabloy-mcp-image) before policy/business reads or writes. Discovery and contract metadata lookup may precede loading; unsupported or unestablished loading means stop before business execution. This is a client workflow requirement, not server enforcement or an authorization grant. This more specific, self-contained Skill owns the entire preparation/upload/bind sequence, including resource read/update, without automatically loading the generic mutations Skill too.

## Direct upload

`POST /image/direct-upload` is for providers that can create an upload target without proxying the entire lifecycle through the shared `POST /image/upload` endpoint.

The shared flow is:

1. resolve the image scene and upload policy
2. call `app.bean.image.createDirectUpload(...)`
3. let the provider create the direct-upload resource
4. persist the draft image record
5. return the public direct-upload session: Cabloy image `id`, provider-hosted `uploadUrl`, and optional presentation fields
6. upload bytes to the returned `uploadUrl`
7. finalize through `POST /image/direct-upload/finalize` using the Cabloy image `id`; the finalized response has the normal public image action shape

The built-in Cloudflare provider supports this flow by returning a provider-hosted upload target.

The native provider does not support direct upload and should use the standard authenticated `/image/upload` flow instead.

That provider difference is exactly why the shared API keeps direct upload split into create-upload-target and finalize steps.

## Upload by URL

`POST /image/upload-url` is for providers that can ingest a remote URL directly.

The flow is:

1. resolve the image scene and upload policy
2. validate the declared `size` and `mimeType`
3. call `app.bean.image.uploadUrl(...)`
4. let the provider fetch or ingest the remote URL
5. persist the image record and return the normal image resource result

The built-in Cloudflare provider supports this flow.

The native provider does not implement `uploadUrl`.

## Signed delivery redirect

When delivery is signed and the provider uses proxy delivery, `BeanImage.getVariantUrl(...)` creates a temporary delivery token and returns a local delivery URL such as:

- `/image/delivery?imageId=...&token=...`

The delivery controller then:

1. verifies the delivery token against the fixed delivery endpoint path
2. confirms the token image ID matches the request `imageId` query value
3. redirects to the final target URL

This is why native signed delivery behaves differently from Cloudflare signed delivery.

## Configuration defaults

The core image config currently defines:

```typescript
image: {
  defaultVariant: 'original',
  defaultProvider: 'image-native:native',
  defaultClientName: 'default',
  upload: {
    maxSize: 2 * 1024 * 1024,
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
}
```

That gives the suite a working default even before a scene overrides anything.

## Provider behavior differences

### Native provider

`image-native:native` stores files locally and uses Sharp-backed processing.

Practical behavior to know:

- it defaults to proxy-signed delivery
- public, unprotected delivery returns absolute URLs with the existing `/api/static/...` path; without an explicit `deliveryBaseUrl`, native delivery uses `AppUtil` and the effective `server.serve.protocol` / `host` from context config when present, otherwise root config. In `prod`, both fields must be configured (`SERVER_SERVE_PROTOCOL` / `SERVER_SERVE_HOST`); an empty field throws rather than falling back to the request origin. In `dev/test`, each field still falls back to the current request origin, then `http` and `localhost:<SERVER_LISTEN_PORT>` (or `localhost` without a port)
- ordinary native delivery does not require a separate static domain; an explicit `deliveryBaseUrl` remains supported, and a persisted image base retains precedence over the client base
- explicit delivery bases keep their existing path semantics: native delivery appends `public/<instance-id>/...`, so a base for the ordinary static mapping includes `/api/static`, not `/public`; third-party providers retain their own delivery configuration
- it does not support direct upload and uses the standard authenticated multipart upload flow
- named variants produce stable variant files such as `__thumbnail`
- ad hoc transforms produce stable hashed files such as `__t_<hash>`
- repeated requests for the same custom transform reuse the same cached transformed output
- when downloading the unsigned original variant, it can return a buffer instead of a URL
- it still does not implement `uploadUrl(...)` for provider-side remote URL ingestion

These behaviors are demonstrated directly in the native image tests. Absolute URL construction does not change public/private or audience/signature policy, and does not by itself establish external reachability or inline rendering in an AI client.

### Cloudflare provider

`image-cloudflare:cloudflare` delegates storage and delivery to Cloudflare Images.

Practical behavior to know:

- it defaults to provider-signed delivery
- it supports direct upload and upload by URL
- `original` resolves to Cloudflare’s `public` delivery path
- ad hoc transforms become Cloudflare transform segments such as `w=320,h=180,fit=cover`
- signed delivery appends `exp` and `sig` query parameters

These behaviors are demonstrated in the Cloudflare mapping tests.

## Business integration patterns

The best way to understand Vona image is to follow a real business example.

### Single-image pattern: `training-student`

The training-student module stores one image field:

```typescript
@Api.field(
  v.title($locale('StudentImage')),
  v.optional(),
  ZovaRender.field('basic-image:formFieldImage', {
    imageScene: 'training-student:studentImage',
    relationName: 'image',
  }),
  ZovaRender.cell('basic-image:image', { relationName: 'image' }),
  v.tableIdentity(),
)
imageId?: TableIdentity;
```

The important backend point is not the frontend widget itself.

The important point is that the backend contract names a scene:

- `training-student:studentImage`

That scene centralizes upload limits and the `processing` guidance shown above while the entity field keeps the persisted value as `imageId` and the resource-specific `relationName`. Do not duplicate Student crop/resize settings in resource render options; the browser reads them from the current scene policy.

If you want the frontend-side meaning of that same field contract — how `imageId` pairs with `image`, how form previews refresh, and how the table thumbnail works — continue with [Frontend Image Guide](/frontend/image-guide).

### DTO-side image view resolution

The same module exposes the stored image ID through a resolved relation field in DTO output:

```typescript
@Api.field(
  ZovaRender.visible(false),
  v.optional(),
  v.serializerTransform('a-image:resolveView', {
    fieldName: 'imageId',
    imageScene: 'training-student:studentImage',
  }),
  v.object(DtoImageView),
)
image?: DtoImageView;
```

This means:

- the stored field remains `imageId`
- the DTO adds the resolved relation field `image?: DtoImageView`
- serialization resolves the image lazily through `app.bean.image.resolveView(...)`

Remember the serializer rule from [Serialization Guide](/backend/serialization-guide): field-level serializer metadata only runs when the target API enables serialization.

### Multi-image pattern: `training-record`

The training-record module shows the array case.

The entity stores `sceneImageIds?: TableIdentity[]` and points to the scene:

- `training-record:sceneImage`

That scene allows multiple uploads and owns the Record processing guidance rather than duplicating it on the entity field:

```typescript
@ImageScene({
  upload: {
    multiple: true,
    maxSize: 2 * 1024 * 1024,
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
  processing: {
    enableCrop: false,
    resize: {
      width: 1280,
      height: 1280,
      fit: 'contain',
      format: 'jpeg',
      quality: 90,
    },
  },
})
export class ImageSceneSceneImage extends BeanBase {}
```

Field multiplicity/count and `relationName: 'sceneImages'` remain resource options. The scene's processing guidance does not guarantee that the stored file has those dimensions or format.

The DTO then resolves the stored array with:

```typescript
@Api.field(
  ZovaRender.visible(false),
  v.optional(),
  v.serializerTransform('a-image:resolveViews', {
    fieldName: 'sceneImageIds',
    imageScene: 'training-record:sceneImage',
  }),
  v.array(DtoImageView),
)
sceneImages?: DtoImageView[];
```

This is the cleanest pattern when business storage should keep image IDs, while API output should expose resolved relation fields with view-ready image objects.

## Extending the system

## Add a new image scene

When the business needs a new image use case, add a new `@ImageScene(...)` bean.

A scene is the right place for:

- upload limits
- shared client `processing` guidance (not server normalization)
- provider routing
- provider client selection
- scene-specific metadata
- the decision about whether the use case is single-image or multi-image

The core module already provides a boilerplate path for image scenes:

- `vona/src/suite-vendor/a-image/modules/a-image/cli/imageScene/boilerplate/`

A practical sequence is:

1. create the scene bean
2. define `upload` rules, shared `processing` guidance and optional provider/meta resolvers
3. point entity or DTO metadata at the new scene name; keep relation pairing in resource metadata
4. verify upload-policy output, client preparation, authenticated upload and serializer behavior end to end

## Add a new image provider

When the storage backend changes, add a new `@ImageProvider(...)` bean that implements `IImageProviderExecute`.

The provider boilerplate lives under:

- `vona/src/suite-vendor/a-image/modules/a-image/cli/imageProvider/boilerplate/`

Model new providers after the built-in implementations:

- `image-native` for local filesystem plus transform behavior
- `image-cloudflare` for remote CDN-backed delivery behavior

A practical provider checklist is:

1. implement the required methods
2. decide whether to support `uploadUrl`, `createDirectUpload`, and `download`
3. only implement `createDirectUpload` when the provider can hand the client a real external upload target instead of routing bytes back through the local app
4. define sensible base options in the decorator
5. verify variant URL behavior, signed delivery behavior, and delete behavior

## Test-backed reading map

The current repo already contains strong executable examples under:

- `vona/src/suite-vendor/a-test/modules/test-image/test/`

The most useful tests are:

- `imageUpload.test.ts` for authenticated multipart upload, native direct-upload rejection, Cloudflare direct-upload, and upload-url request flows
- `imageNative.test.ts` for local upload, variant URLs, signed delivery, and delete behavior
- `imageCloudflareMapping.test.ts` for Cloudflare mapping, custom transforms, signed delivery, direct upload, and upload-by-URL behavior

When the source and a prose explanation seem to disagree, prefer the current source and tests.

## Verification checklist

When writing or changing image-related docs, verify in this order:

1. check the controller flow in `ControllerImage`
2. check scene and token behavior in `BeanImageUploadPolicy`
3. check delivery and DTO view behavior in `BeanImage`
4. check provider-specific differences in `image-native` and `image-cloudflare`
5. check business examples in `training-student` and `training-record`
6. check the test-image suite for executable confirmation
7. run the docs build and confirm the page appears in the sidebar

A good final question is:

- does this explanation stay backend-first and source-backed, or has it drifted into a generic image-upload article?

If it stays centered on scenes, providers, variants, signed delivery, and serializer transforms, it is aligned with how Vona image actually works.
