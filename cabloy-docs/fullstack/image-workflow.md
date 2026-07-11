# Fullstack Image Workflow

This page explains the fullstack image workflow in Cabloy Basic with a practical, contract-chain path.

In this page, **resolved relation field** means the DTO-side field such as `image` or `sceneImages` that carries `DtoImageView` data for frontend preview and display.

It fills the gap between the layer-specific image guides:

- [Backend Image Guide](/backend/image-guide)
- [Frontend Image Guide](/frontend/image-guide)

Use this page when the real question is not only backend image policy and not only frontend image rendering, but the bridge between the two.

Use this page together with:

- [Contract Loop Playbook](/fullstack/contract-loop-playbook)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions)
- [Backend Image Guide](/backend/image-guide)
- [Frontend Image Guide](/frontend/image-guide)
- [Upload Guide](/backend/upload-guide)
- [Serialization Guide](/backend/serialization-guide)
- [Form Guide](/frontend/form-guide)
- [Table Guide](/frontend/table-guide)

> [!TIP]
> **Image workflow docs path**
>
> - **[Fullstack Image Workflow](/fullstack/image-workflow)** — learn the cross-stack chain from backend image field contract and scene policy to frontend `basic-image` consumption
> - **[Backend Image Guide](/backend/image-guide)** — learn image scenes, providers, serializer transforms, delivery policy, and backend lifecycle behavior
> - **[Frontend Image Guide](/frontend/image-guide)** — learn `basic-image:formFieldImage`, `basic-image:image`, relation previews, and client-side image-field behavior
>
> Use this page when the question is about how one image field travels across the full stack rather than only one layer.

## Why this page exists

The repository now has a backend image guide and a frontend image guide.

What contributors and AI workflows often still need is one continuous answer to this narrower question:

> how does one image field travel from backend entity and DTO metadata to frontend form and table rendering?

This page answers that question by treating image handling as one contract chain rather than as disconnected snippets.

## The shortest correct mental model

If you only remember one idea, remember this one:

> backend code owns the image field contract, image scene policy, and DTO-side image view resolution, while frontend `basic-image` resources consume that resolved contract for upload, preview, and display.

That means an image field usually has two connected surfaces:

- a stored identity field such as `imageId` or `sceneImageIds`
- a resolved relation field such as `image` or `sceneImages`

The fullstack workflow works best when both surfaces are authored deliberately and kept aligned.

## The fullstack chain in one view

A practical image workflow usually looks like this:

1. the backend entity stores image identity data such as `imageId` or `sceneImageIds`
2. backend field metadata points to the frontend image resources with `ZovaRender.field(...)` and `ZovaRender.cell(...)`
3. the backend image scene defines upload policy such as MIME type, size, and multiple-image rules
4. the backend DTO resolves image IDs into `DtoImageView` or `DtoImageView[]` through `a-image:resolveView` or `a-image:resolveViews`
5. the shared contract exposes both the stored ID field and the resolved relation field to frontend consumers
6. frontend `basic-image:formFieldImage` binds the stored ID field while reusing the resolved relation field for preview cards and dialogs
7. frontend `basic-image:image` uses the same resolved relation field to render thumbnails in list pages

This is not only a forward chain and not only a reverse chain.

Instead, it is one concrete business thread where backend contract truth, shared metadata, and frontend resource consumption cooperate.

For the broader decision model, read [Contract Loop Playbook](/fullstack/contract-loop-playbook).

## Specimen A: single image on Student

The Student resource is the best single-image specimen because it shows the complete chain with the smallest number of moving parts.

### Backend entity field

The Student entity stores one image identity field and points to the built-in image resources:

```typescript
@Api.field(
  v.title($locale('StudentImage')),
  v.optional(),
  ZovaRender.field('basic-image:formFieldImage', {
    imageScene: 'training-student:studentImage',
    relationName: 'image',
    accept: ['image/png', 'image/jpeg', 'image/webp'],
    maxSize: 2 * 1024 * 1024,
    enableCrop: true,
    cropAspectRatio: 1,
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

This already defines two important truths:

- the stored field is `imageId`
- the frontend resource identities are `basic-image:formFieldImage` and `basic-image:image`

### Backend image scene

The Student image scene defines the upload policy:

```typescript
@ImageScene({
  upload: {
    maxSize: 2 * 1024 * 1024,
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
  },
})
export class ImageSceneStudentImage extends BeanBase {}
```

This means the backend owns the true upload policy even when the frontend also performs convenience validation.

### DTO-side image resolution

The Student DTO resolves the stored ID into a resolved relation field:

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

This is the bridge that turns:

- stored value: `imageId`
- resolved preview data: `image?: DtoImageView`

The same list-page branch is also visible in `DtoStudentSelectResItem`, where the row DTO resolves `image` for table usage.

### Frontend consumption

On the frontend side, the built-in resources consume that contract shape:

- `basic-image:formFieldImage` binds the ID field and reuses the `image` resolved relation field for preview cards
- `basic-image:image` uses the same resolved relation field to render thumbnails in tables

This is the cleanest single-image chain in the repo.

## Specimen B: multiple images on Record

The Record resource shows the plural branch.

### Backend entity field

The Record entity stores an array of image IDs and points to the same built-in resources:

```typescript
@Api.field(
  v.title($locale('ScenePhotos')),
  v.optional(),
  ZovaRender.field('basic-image:formFieldImage', {
    imageScene: 'training-record:sceneImage',
    multiple: true,
    maxCount: 9,
    relationName: 'sceneImages',
    accept: ['image/png', 'image/jpeg', 'image/webp'],
    maxSize: 2 * 1024 * 1024,
    enableCrop: false,
    resize: {
      width: 1280,
      height: 1280,
      fit: 'contain',
      format: 'jpeg',
      quality: 90,
    },
  }),
  ZovaRender.cell('basic-image:image', { relationName: 'sceneImages' }),
  v.array(v.tableIdentity()),
)
sceneImageIds?: TableIdentity[];
```

### Backend image scene

The matching scene enables multi-image upload policy:

```typescript
@ImageScene({
  upload: {
    maxSize: 2 * 1024 * 1024,
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    multiple: true,
  },
})
export class ImageSceneSceneImage extends BeanBase {}
```

### DTO-side image resolution

The DTO resolves many IDs into many preview objects:

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

The same pattern also appears in `DtoRecordSelectResItem`, which makes the relation data available for list-page thumbnails.

### Why this branch matters

This branch proves that the same workflow scales from:

- one ID -> one relation object
- many IDs -> many relation objects

without changing the overall contract-chain model.

## Backend authoring responsibilities

The backend owns the contract truth.

For image workflows, that usually means:

- the entity field defines the stored data shape
- `ZovaRender.field(...)` chooses the form-side frontend resource identity
- `ZovaRender.cell(...)` chooses the table-side frontend resource identity
- the image scene bean defines upload policy
- the DTO serializer transform resolves stored IDs into preview-ready image view objects

A practical rule is:

- when the business meaning of the image field changes, start by changing backend truth first

For the backend-authoring details, read [Backend Image Guide](/backend/image-guide).

## What crosses the contract boundary

The most important thing that crosses the fullstack boundary is not only the raw image ID.

What really crosses the boundary is the pairing of:

- stored identity field
- resolved preview field

In the single-image branch, that pair is usually:

- `imageId`
- `image?: DtoImageView`

In the multi-image branch, that pair is usually:

- `sceneImageIds`
- `sceneImages?: DtoImageView[]`

This is why the DTO serializer step matters so much.

It turns backend-owned identity data into frontend-friendly preview data without changing the persistence model.

## Frontend consumption responsibilities

The frontend does not redefine the image field contract.

Instead, it consumes the contract through the built-in image resources.

### `basic-image:formFieldImage`

The form-side resource is responsible for:

- selecting files
- performing frontend validation
- optionally cropping and resizing in the browser
- selecting the policy-supported ordinary or direct upload transport
- binding the finalized stored image ID field
- synchronizing the relation preview only after upload completion
- synchronizing the resolved relation field for immediate UI refresh

### Upload transport selection

The form field waits for the backend image-scene upload policy and selects one of two server-authorized paths:

- ordinary scenes create an upload token and submit the image to Cabloy multipart upload;
- direct-capable scenes create a direct-upload session, send the image to the returned provider URL without Cabloy credentials, and finalize using the returned Cabloy image ID.

The browser does not branch on provider identity. In both paths, it updates the stored ID field and resolved relation preview only after it has a completed image response; a direct-upload draft is never used as the form value.

### `basic-image:image`

The table-side resource is responsible for:

- resolving relation-backed preview data first
- falling back to URL-style values when needed
- rendering thumbnails
- opening the shared preview dialog

### Why `relationName` matters

The built-in frontend image resources work best when the resolved relation field is named predictably.

Common pairings are:

- `imageId` -> `image`
- `sceneImageIds` -> `sceneImages`

When your field names are nonstandard, set `relationName` explicitly so backend DTO resolution and frontend preview lookup stay aligned.

For the frontend runtime details, read [Frontend Image Guide](/frontend/image-guide).

## Single-image vs multi-image differences

The contract chain stays the same, but three details change.

### 1. Stored value shape

- single image: scalar ID such as `imageId`
- multiple images: ID array such as `sceneImageIds`

### 2. DTO serializer transform

- single image: `a-image:resolveView`
- multiple images: `a-image:resolveViews`

### 3. Relation preview shape

- single image: one `DtoImageView`
- multiple images: `DtoImageView[]`

That is the main branching point the fullstack doc should make explicit.

## Where this page sits in the contract loop

This workflow is easiest to understand when you keep the contract-loop vocabulary precise.

- backend field metadata and DTO/image-scene changes belong to backend contract truth
- image DTO resolution is part of the backend-authored handoff
- frontend `basic-image` resources are consumers of that truth
- frontend-specific render behavior is not a reason to duplicate the backend contract

That is why this page sits between:

- [Contract Loop Playbook](/fullstack/contract-loop-playbook)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions)

It is a bridge page for one concrete business thread rather than a general direction guide.

## Verification workflow

When writing or changing image workflow docs, verify in this order.

1. confirm the entity field still points to:
   - `basic-image:formFieldImage`
   - `basic-image:image`
2. confirm the image scene still matches the specimen field
3. confirm the DTO still uses:
   - `a-image:resolveView` for single-image fields
   - `a-image:resolveViews` for multi-image fields
4. confirm the list-row DTOs still expose the same resolved relation fields for table usage
5. confirm the frontend image resources still consume the same relation-name pattern
6. confirm the page stays bridge-focused rather than duplicating the backend or frontend guides
7. run the docs build and confirm the page appears under `Fullstack / Architecture & Integration`

## Read together with

Use the surrounding docs based on which layer now needs deeper attention.

### Backend policy and authoring details

- [Backend Image Guide](/backend/image-guide)
- [Upload Guide](/backend/upload-guide)
- [Serialization Guide](/backend/serialization-guide)
- [Controller Guide](/backend/controller-guide)

### Frontend runtime and rendering details

- [Frontend Image Guide](/frontend/image-guide)
- [Form Guide](/frontend/form-guide)
- [Table Guide](/frontend/table-guide)
- [TableCell Authoring Cookbook](/frontend/table-cell-cookbook)

### Broader fullstack bridge and contract-loop decisions

- [Contract Loop Playbook](/fullstack/contract-loop-playbook)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions)

A good final question is:

- am I debugging one layer, or am I debugging the handoff between layers?

If the answer is the handoff, this page is the right place to start.
