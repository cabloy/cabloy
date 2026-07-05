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
- optional per-scene metadata

Representative scene shape:

```typescript
@ImageScene({
  upload: {
    maxSize: 2 * 1024 * 1024,
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
})
export class ImageSceneStudentImage extends BeanBase {}
```

This keeps business upload rules in one named backend capability instead of scattering them across controllers and services.

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

- **proxy-signed delivery**: Vona creates a temporary delivery token and redirects through `/image/delivery/:imageId`
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

- use `BeanImageUploadPolicy` when you need scene resolution and upload-token policy
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

## Upload-token + multipart upload

The tokened upload flow is the most important request path.

The flow is:

1. call `POST /image/upload-token`
2. Vona resolves the image scene and validates the declared `size` and `mimeType`
3. Vona issues a temporary upload token that is bound to the upload path
4. submit `POST /image/upload` as multipart form data
5. send:
   - `token`
   - `image`
6. the controller verifies the token, re-checks file size, MIME type, and extension, then uploads through the resolved provider

Representative controller shape:

```typescript
@Web.post('upload-token')
async createUploadToken(@Arg.body() data: DtoImageUploadTokenRequest) {
  return await this.bean.imageUploadPolicy.createUploadToken(data);
}

@Web.post('upload')
@Core.fileUpload()
@Api.contentType('application/json')
async upload(@Arg.field('token') token: string, @Arg.file('image') file: IUploadFile) {
  const payload = await this.bean.imageUploadPolicy.verifyUploadToken(
    token,
    this.ctx.route.routePathRaw,
  );
  await this._validateUploadFile(file, payload);
  return await this.bean.image.upload(...);
}
```

This flow reuses the normal Vona upload model from [Upload Guide](/backend/upload-guide), but adds image-scene policy and a path-bound temporary token.

## Direct upload

`POST /image/direct-upload` is for providers that can create an upload target without proxying the image through the app server.

The flow is:

1. resolve the image scene and upload policy
2. call `app.bean.image.createDirectUpload(...)`
3. let the provider create the direct-upload resource
4. persist the image record
5. return provider information plus `uploadUrl`

The built-in Cloudflare provider supports this flow.

The native provider does not implement `createDirectUpload`.

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

- `/image/delivery/:imageId?token=...`

The delivery controller then:

1. verifies the delivery token against the request path
2. confirms the token image ID matches the request image ID
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
- it can return local static URLs under `/api/static/...`
- named variants produce stable variant files such as `__thumbnail`
- ad hoc transforms produce stable hashed files such as `__t_<hash>`
- repeated requests for the same custom transform reuse the same cached transformed output
- when downloading the unsigned original variant, it can return a buffer instead of a URL

These behaviors are demonstrated directly in the native image tests.

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
    accept: ['image/png', 'image/jpeg', 'image/webp'],
    maxSize: 2 * 1024 * 1024,
    enableCrop: true,
    cropAspectRatio: 1,
    relationName: 'image',
    resize: {
      width: 512,
      height: 512,
      fit: 'cover',
      format: 'jpeg',
      quality: 90,
    },
  }),
  ZovaRender.cell('basic-image:image', { relationName: 'image' }),
  v.tableIdentity(),
)
imageId?: TableIdentity;
```

The important backend point is not the frontend widget itself.

The important point is that the backend contract names a scene:

- `training-student:studentImage`

That scene centralizes the upload policy while the entity field keeps the persisted value as `imageId`.

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

That scene allows multiple uploads.

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
- provider routing
- provider client selection
- scene-specific metadata
- the decision about whether the use case is single-image or multi-image

The core module already provides a boilerplate path for image scenes:

- `vona/src/suite-vendor/a-image/modules/a-image/cli/imageScene/boilerplate/`

A practical sequence is:

1. create the scene bean
2. define `upload` rules and optional provider/meta resolvers
3. point entity or DTO metadata at the new scene name
4. verify upload-token and serializer behavior end to end

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
3. define sensible base options in the decorator
4. verify variant URL behavior, signed delivery behavior, and delete behavior

## Test-backed reading map

The current repo already contains strong executable examples under:

- `vona/src/suite-vendor/a-test/modules/test-image/test/`

The most useful tests are:

- `imageUpload.test.ts` for upload-token, upload, direct-upload, and upload-url request flows
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
