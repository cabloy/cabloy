# Tutorial 6: One Contract Surface, Four Uses

<Badge type="info" text="Basic" />

In this tutorial, one prompt lets AI close the series by showing Cabloy’s core fullstack idea: one field-oriented contract surface can drive several behaviors across backend and frontend.

This time the main teaching field is `mobile`, while `level` stays as the supporting example for table and form rendering.

## Goal

By the end of this tutorial, you will understand how one business field thread can participate in:

1. validation
2. OpenAPI generation
3. table and form rendering
4. serialization or desensitization

## AI Prompt

Give AI a prompt like this:

```text
Act as my Cabloy Project pair programmer.

Task:
I already built the demo-student module through the previous tutorials in this monorepo. Help me refine and explain the Student mobile field as one complete business contract thread.

The result should make it clear how the same field shows up in:
- validation
- API contract exposure
- response masking or serialization

You can use level only as the supporting example for form and table rendering.

Focus for this tutorial:
- keep the explanation concrete and source-anchored
- use mobile as the main capstone field
- keep level only as the supporting rendering example

When you finish, return your answer in this format:
- Files inspected or changed
- Validation surface
- OpenAPI surface
- Rendering surface
- Serialization surface
- Why mobile is the main capstone field
- What I should verify next
```
Optional follow-up prompt if you need to correct the result:

```text
Keep the explanation concrete. Show how the Student mobile field behaves across validation, contract exposure, and masking, and use level only where rendering needs a supporting example.
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

1. regenerate the frontend contract if needed:

```bash
npm run zova :openapi:generate demo-student
```

2. make sure the local dev workflow is running:

```bash
npm run dev
```

3. open `http://localhost:7102/admin/`
4. enter the relevant **Student** page
5. verify that `level` still shows the expected render-driven behavior
6. verify that `mobile` follows the validation and serialization policy you defined
7. inspect these anchors and confirm that the four-use story is concrete rather than abstract:
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
