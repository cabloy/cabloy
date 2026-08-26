# Tutorial 6: One Contract Surface, Four Uses

<Badge type="info" text="Basic" />

In this tutorial, one prompt lets AI close the series by showing Cabloy’s core fullstack idea: one field-oriented contract surface can drive several behaviors across backend and frontend.

This capstone sits on top of both the forward chain and the reverse chain rather than replacing either one.

This time the main teaching field is `mobile`, while `level` stays as the supporting example for table and form rendering.

> [!NOTE]
> This capstone still uses the standalone `demo-student` sandbox carried through the tutorial series.
> That keeps the final experiment path isolated while preserving a clean comparison against the repo's real suite-owned `a-training/training-student` implementation.

## Goal

By the end of this tutorial, you will understand how one business field thread can participate in:

1. validation
2. OpenAPI generation
3. table and form rendering
4. serialization or desensitization

## AI Prompt

Give AI a prompt like this:

```text
Please add a mobile field to the Student resource. It should be required, be at least 11 characters long, and show the middle 4 digits as asterisks in returned data.
```

## Why this step matters

This is the right capstone step because many frameworks force the same field knowledge to be repeated in many places:

- validation rules
- backend DTOs
- API documentation
- frontend forms
- frontend tables
- response masking logic

Cabloy tries to reduce that duplication through a field-oriented contract and metadata model, and this tutorial lets you inspect that reduction through one concrete field story.

## CLI commands to inspect/use

This tutorial is mainly a source-inspection and verification capstone.

Useful commands include:

```bash
npm run zova :openapi:generate demo-student
npm run dev
```

Usage notes:

- regenerate the frontend contract if your backend field changes affect the generated output
- treat the backend entity and DTO surfaces as the first place to inspect
- use the admin UI to confirm both the visible rendering result and the exposed mobile behavior

## Generated or affected files

The key backend field contract anchor is:

- `vona/src/module/demo-student/src/entity/student.tsx`

By the end of this tutorial, the `mobile` field should show the main capstone pattern:

```typescript
@Api.field(
  v.title($locale('Mobile')),
  v.required(),
  v.min(11),
  studentMobileSerializer(),
  ZovaRender.order(4),
)
mobile: string;
```

The serializer helper lives in:

- `vona/src/module/demo-student/src/lib/studentMobile.ts`

The summary DTO also participates in the same thread:

- `vona/src/module/demo-student/src/dto/studentSummary.tsx`

The supporting render example remains:

- `vona/src/module/demo-student/src/entity/student.tsx`
  - `ZovaRender.field(...)` for `level`
  - `ZovaRender.cell(...)` for `level`

## What those files mean in the business thread

This tutorial works best when you read `mobile` as one continuous contract thread.

That is why `mobile` is the main capstone field, while `level` remains the supporting rendering field.

### Use 1: Validation

In `entity/student.tsx`, `mobile` already carries validation decisions such as:

- `v.required()`
- `v.min(11)`

That means the field definition is part of the request-contract story, not only a persistence concern.

### Use 2: OpenAPI generation

The same field contract participates in DTO and controller flows, which then feed machine-readable API output.

That is why backend field and DTO changes can later affect what frontend regeneration sees.

### Use 3: Table and form rendering

The main rendering example in this series remains `level`, not `mobile`.

That is intentional.

`level` shows how the same field-oriented contract can carry:

- `ZovaRender.field(...)`
- `ZovaRender.cell(...)`
- built-in or custom frontend render resources

This keeps the “four uses” explanation complete without forcing `mobile` to act like the best rendering example.

### Use 4: Serialization and desensitization

The most practical `mobile` lesson is response exposure policy.

In `studentMobile.ts`, the helper:

- defines the masking pattern
- returns `v.serializerReplace(...)`

That keeps the masking rule close to the field contract ecosystem instead of scattering it into ad hoc controller or service post-processing.

## Verification

1. make sure the local dev workflow is running:

```bash
npm run dev
```

2. open `http://localhost:7102/admin/`
3. enter the relevant **Student** page
4. verify that `level` still shows the expected render-driven behavior
5. verify that `mobile` follows the validation and serialization policy you defined
6. inspect these anchors and confirm that the four-use story is concrete rather than abstract:
   - `vona/src/module/demo-student/src/entity/student.tsx`
   - `vona/src/module/demo-student/src/lib/studentMobile.ts`
   - `vona/src/module/demo-student/src/dto/studentSummary.tsx`

## Read more

- [Validation Guide](/backend/validation-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [API Schema Guide](/frontend/api-schema-guide)
- [Server Data](/frontend/server-data)
- [Serialization Guide](/backend/serialization-guide)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend)

## Next step

After finishing this series, choose the next path based on your current task:

- if you want deeper backend contract detail, continue with [Entity Guide](/backend/entity-guide) and [DTO Guide](/backend/dto-guide)
- if you want deeper frontend contract consumption, continue with [OpenAPI SDK Guide](/frontend/openapi-sdk-guide) and [API Schema Guide](/frontend/api-schema-guide)
- if you want more CLI-oriented workflow depth, continue with [CLI Reference](/reference/cli-reference)
