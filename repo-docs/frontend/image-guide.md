# Image Guide

This guide explains how to use **Zova image** in Cabloy Basic with a practical, contract-first path.

Zova image is not only a file input. It is a frontend image layer built around:

- the built-in form-field renderer `basic-image:formFieldImage`
- the built-in table-cell renderer `basic-image:image`
- resolved relation fields such as `image` and `sceneImages`
- policy-selected ordinary or provider-hosted direct upload through the generated image API
- optional crop and resize behavior in the browser
- shared preview dialogs for form and table usage

Use this page together with:

- [Form Guide](/frontend/form-guide)
- [Table Guide](/frontend/table-guide)
- [TableCell Authoring Cookbook](/frontend/table-cell-cookbook)
- [API Schema Guide](/frontend/api-schema-guide)
- [SSR ClientOnly](/frontend/ssr-client-only)
- [Backend Image Guide](/backend/image-guide)

> [!TIP]
> **Image docs path**
>
> - **[Frontend Image Guide](/frontend/image-guide)** — learn `basic-image:formFieldImage`, `basic-image:image`, relation previews, and client-side image-field behavior
> - **[Backend Image Guide](/backend/image-guide)** — learn image scenes, providers, serializer transforms, delivery policy, and backend lifecycle behavior
>
> Use the frontend guide when the question is about forms, tables, previews, or client-side upload UX. Use the backend guide when the question is about image scenes, providers, serializer transforms, signed delivery, or upload policy enforcement.

Read this page first when your next question is:

- how to wire `basic-image:formFieldImage` into a form
- how to show image thumbnails in a table with `basic-image:image`
- why an image field has IDs on one side and resolved relation fields on the other

## What you should learn first

If you only remember one idea, remember this one:

> In Zova, an image field usually stores image ID data, while resolved relation fields provide the `DtoImageView` objects that the built-in image renderers use for previews, dialogs, and richer display.

That leads to two closely related data surfaces:

- persisted value such as `imageId` or `sceneImageIds`
- resolved relation field such as `image` or `sceneImages`

The built-in image resources work best when both surfaces are present and named consistently.

## What `basic-image` provides on the frontend

The `basic-image` module exposes two main public rendering resources.

### `basic-image:formFieldImage`

Use this as the standard image field renderer for forms.

It supports:

- single-image and multi-image fields
- policy-selected ordinary or direct upload
- frontend file validation
- optional crop
- optional resize and re-encode before upload
- readonly image cards
- relation-backed preview refresh after upload

### `basic-image:image`

Use this as the standard image table-cell renderer.

It supports:

- thumbnail rendering
- relation-first preview lookup
- fallback URL preview behavior
- multi-image count badges
- shared preview dialog opening from the table cell

### Shared preview behavior

Both resources use the same preview conventions:

- preview URLs are normalized against `sys.config.api.baseURL` when needed
- preview titles use the field title when available
- multi-image preview supports keyboard left/right navigation

## Minimum backend/frontend contract

The frontend image resources depend on a small but important backend contract.

A practical minimum is:

1. the backend field stores image ID data such as `imageId` or `sceneImageIds`
2. the backend field metadata points to the built-in render resources
3. the backend DTO exposes resolved relation fields such as `image?: DtoImageView` or `sceneImages?: DtoImageView[]`
4. the backend image scene defines upload limits and shared client `processing` guidance, returned by the upload-policy endpoint

Representative contract pattern:

```typescript
ZovaRender.field('basic-image:formFieldImage', {
  imageScene: 'training-student:studentImage',
  relationName: 'image',
});

ZovaRender.cell('basic-image:image', {
  relationName: 'image',
});
```

And on the DTO side:

```typescript
v.serializerTransform('a-image:resolveView', {
  fieldName: 'imageId',
  imageScene: 'training-student:studentImage',
});
```

In the resource schema, `rest.form.options.imageScene` selects the registered scene; `rest.form.options.relationName` remains resource metadata pairing the stored identity with its preview relation. The browser reads upload limits and `processing` from the scene's current policy instead of duplicating type, size or crop/resize settings on each resource field.

A practical rule is:

- frontend validation, crop, and resize improve UX
- `processing` is client behavior guidance, not server normalization, dimension enforcement or a storage guarantee
- backend image scenes and authenticated upload validation remain the true policy boundary

For the backend side of that contract, read [Backend Image Guide](/backend/image-guide), especially the sections on image scenes, authenticated multipart upload, and DTO-side image view resolution.

## One running example through this guide: Student image

To keep the guide concrete, the first example uses the Student resource.

The Student entity stores one image field:

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

And the DTO exposes a resolved relation field:

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

This gives the frontend a clean split:

- `imageId` is the submitted field value
- `image` is the resolved relation field
- `training-student:studentImage` owns upload limits and `processing`: crop enabled, aspect ratio `1`, rectangular crop, and resize to `512 × 512` with `fit: 'cover'`, JPEG and quality `90`

The scene definition is shown in the [backend image-scene example](/backend/image-guide#image-scene). Those values are client preparation guidance read through the current policy, not hardcoded field defaults or a promise about stored originals.

The backend explanation for that pairing lives in [Backend Image Guide](/backend/image-guide), where the same example is described from the scene and serializer-transform perspective.

## Step 1: Choose the right image field style

Before writing code, choose which of these styles matches your field.

### Style A: built-in image resources

Use this when:

- standard upload, preview, and thumbnail behavior is enough
- the field should stay schema-driven
- you want the shortest path to a working CRUD field

This is the preferred default.

### Style B: built-in image field plus custom backend contract

Use this when:

- the frontend UX can stay standard
- but the backend scene, DTO, or relation structure is business-specific
- the field still fits the `basic-image` mental model

### Style C: custom image renderer

Use this when:

- the form interaction is business-specific
- the table thumbnail behavior must be custom
- built-in crop, preview, or value flow is not enough

A practical rule is:

- start with the built-in image resources first
- add custom renderers only when the business UI really needs module-owned image behavior

## Step 2: Understand relation naming and `relationName`

The built-in image resources infer relation names from the stored field name.

Current inference rules are:

- `imageId` -> `image`
- `sceneImageIds` -> `sceneImages`

That is why the Student example can naturally pair:

- `imageId`
- `image`

and the Record example can naturally pair:

- `sceneImageIds`
- `sceneImages`

Use explicit `relationName` when:

- the field name does not follow the `...Id` or `...Ids` pattern
- you want the contract to be more obvious in examples and maintenance
- nested or details flows should avoid any ambiguity

Even when inference would work, setting `relationName` explicitly is often a good public-doc choice because it makes the pairing obvious.

## Step 3: Understand `basic-image:formFieldImage`

`basic-image:formFieldImage` is the main form-side image renderer.

### Default behavior

The field reads file-type and size limits from the selected scene's current upload policy. Its `processing.enableCrop`, `processing.cropAspectRatio`, `processing.cropShape` and `processing.resize` supply the browser's crop/resize guidance. No processing policy means no automatic crop or resize; do not assume the Student `512 × 512` recipe applies to every scene.

Upload limits belong in `@ImageScene({ upload: ... })`, and shared client processing belongs in `@ImageScene({ processing: ... })`. The form field does not expose type, size, crop or resize overrides, so Browser and Agent clients use the same scene policy.

### Important options

#### Required in practice

- `imageScene`

Although optional at the type level, this is required for editing. Without it, the field displays a scene-required message instead of an uploader.

#### Value-shape and count options

- `multiple` — setting `false` restricts the field to a single image. Multi-image mode requires the scene policy to allow `multiple` as well; the field cannot enable it against scene policy.
- `maxCount` — limits the accumulated number of images bound to this field, not just one selection. It defaults to `1`; single-image mode always allows at most one image.

#### Display option

- `placeholder` — custom empty-state text in the editable field.

#### Relation option

- `relationName` — pairs the stored field with its resolved preview relation explicitly.

### Standalone uploader boundary

These are the options of `basic-image:formFieldImage`, not the complete props of `ZImageUploader`. Direct uploader consumers can still supply type/size filters and crop/resize props for their own interactions, such as the account avatar editor. Those props are not exposed as resource form-field overrides.

## Step 4: Understand the upload lifecycle

The built-in form field follows a consistent frontend flow.

1. for the selected file or files, the field resolves its `imageScene` and reads `scope.api.image.getUploadPolicy(...)` before processing
2. the frontend validates image type and size against the scene's current upload limits
3. if enabled by the scene's processing guidance, the crop dialog opens
4. if configured, the browser resizes and re-encodes a copy using the scene's processing guidance
5. the prepared bytes must still satisfy the scene's upload limits; processing is not a server normalization guarantee
6. ordinary scenes call `scope.api.image.upload(...)` with multipart `imageScene` and `image`
7. direct-capable scenes call `scope.api.image.createDirectUpload(...)`, upload multipart data to the returned provider URL without Cabloy credentials, then call `scope.api.image.finalizeDirectUpload(...)`
8. the stored field value is updated from the ordinary upload response or the finalized direct-upload response
9. the resolved relation field is synchronized so the form can preview the completed image immediately

The frontend does not select a provider by name. Vona resolves the scene and publishes upload limits, client processing guidance and whether direct upload is available. A direct-upload draft ID is not written to the form until finalization succeeds.

That finalization boundary is easy to miss, but it is one of the most important behaviors in the current implementation.

The field value stores IDs.

The resolved relation field stores preview-ready image objects.

## Step 5: Readonly and preview behavior

The built-in form field keeps image previews useful even outside edit mode.

### Editable mode

In editable mode, the field shows:

- select/add/replace button
- upload spinner
- validation or upload error message
- preview cards for current images
- preview button per image
- remove button per image

### Readonly mode

In readonly mode, the field still renders preview cards.

If no images are available, it shows a lightweight empty-state message instead of a file input.

### Private Admin delivery

For a private Admin relation resolved with `deliveryOptions.audience: true`, the client obtains a short-lived passport code after hydration and appends it only to the Cabloy image delivery URL. The code is held in the passport model's in-memory, route-scoped cache and is never written into the resolved relation, SSR HTML, or dehydrated state. The backend still verifies the resource-bound delivery token and the issuing user, so another authenticated user cannot reuse a copied URL.

User-bound delivery forces the Cabloy proxy path. A provider redirect after Cabloy authorization can still expose a separate short-lived provider URL; use a streaming proxy when that remaining provider-link window is unacceptable.

### Preview dialog

When an image preview is available, the field opens a shared preview dialog that supports:

- large lead image preview
- filename display
- multi-image thumbnail selection
- `1 / N` style counters
- left/right keyboard navigation

## Step 6: Use the multi-image pattern when the business field is plural

The Record example shows the multi-image case. Its `training-record:sceneImage` scene owns `processing.enableCrop: false` and resize guidance `1280 × 1280`, `fit: 'contain'`, JPEG, quality `90`; see the [backend Record scene](/backend/image-guide#multi-image-pattern-training-record). The resource retains multiplicity, count and relation pairing rather than duplicating processing settings.

Entity pattern:

```typescript
@Api.field(
  v.title($locale('ScenePhotos')),
  v.optional(),
  ZovaRender.field('basic-image:formFieldImage', {
    imageScene: 'training-record:sceneImage',
    multiple: true,
    maxCount: 9,
    relationName: 'sceneImages',
  }),
  ZovaRender.cell('basic-image:image', { relationName: 'sceneImages' }),
  v.array(v.tableIdentity()),
)
sceneImageIds?: TableIdentity[];
```

DTO pattern:

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

This is the cleanest pattern when the business field should store many image IDs while the UI needs many preview-ready image objects.

## Step 7: Understand `basic-image:image` in tables

`basic-image:image` is the standard image table-cell renderer.

### Public options

- `size` — defaults to `40`
- `fit` — defaults to `cover`
- `relationName`

### Runtime behavior

The cell renderer:

- reads the normal table cell value through `next()`
- tries resolved relation field data first
- falls back to treating the cell value as URL or URL array data
- renders a thumbnail
- adds a `+N` badge when multiple images exist
- opens the shared preview dialog on click
- stops row-click propagation while opening the preview

A practical rule is:

- if the table should show reliable image thumbnails from ID-backed fields, make sure the row data includes the matching resolved relation field

## Step 8: Keep details and nested forms relation-aware

There is an important special case in the details flow.

The `basic-details` service currently special-cases `basic-image:formFieldImage` so submitted detail items keep the resolved relation field data.

That matters because nested or detail-based image editing should preserve:

- the stored image ID data
- the resolved relation field data

If your image field appears in details or nested form flows, make sure:

- the matching resolved relation field exists
- the field name follows the expected naming rule, or `relationName` is set explicitly

Without that relation pairing, image IDs may still save correctly while preview behavior becomes weaker or incomplete in the detail UI.

## Step 9: Remember the SSR and client-only boundary

Crop and resize are browser-side behaviors.

The current implementation relies on:

- `ClientOnly`
- browser `File`
- browser `Image`
- browser `canvas`
- object URLs

That means:

- existing preview data can still render in SSR-safe flows
- crop and resize behavior only happens on the client
- the guide should not describe crop or resize as SSR features

For the general boundary, read [SSR ClientOnly](/frontend/ssr-client-only).

## Common mistakes to avoid

When image fields misbehave, these are the first mistakes to check.

1. **Forgetting `imageScene`**
   - the field may render, but upload cannot work correctly
2. **Treating frontend validation as the security boundary**
   - backend image scene policy is still authoritative
3. **Storing only image IDs without exposing resolved relation fields**
   - previews, cards, and table thumbnails become weaker
4. **Relying on inferred relation names when the field name is nonstandard**
   - set `relationName` explicitly instead
5. **Using an array-backed field without multi-image scene support**
   - the scene must allow `multiple`, and the field must not restrict it with `multiple: false`; configure `maxCount` for its intended capacity
6. **Describing crop or resize as backend processing**
   - current crop and resize are frontend preprocessing steps before upload
7. **Ignoring details/nested-form relation behavior**
   - saved data may be correct while preview state becomes fragile

## Verification checklist

When writing or changing frontend image docs, verify in this order.

1. confirm the form-field resource is still `basic-image:formFieldImage`
2. confirm the table-cell resource is still `basic-image:image`
3. confirm option names still match the current controller and table-cell source
4. confirm relation-name inference still matches:
   - `imageId -> image`
   - `...Ids -> ...s`
5. confirm the Student example still shows the single-image pattern
6. confirm the Record example still shows the multi-image pattern
7. confirm the details service still preserves image relation data specially
8. run the docs build and confirm the page appears in navigation

A good final question is:

- does this explanation stay frontend-first and contract-aware, or has it drifted into a backend image internals article?

If it stays centered on image fields, relation previews, table thumbnails, upload lifecycle, and client-side behavior, it matches how Zova image currently works.
