# Tutorial 5: One Contract Surface, Four Uses

<Badge type="info" text="Basic" />

This tutorial closes the series by showing Cabloy’s core fullstack idea: one field-oriented contract surface can drive several behaviors across backend and frontend.

## Goal

By the end of this tutorial, you will understand how one business field can participate in:

1. validation
2. OpenAPI generation
3. table and form rendering
4. serialization or desensitization

## Why this matters

Many frameworks force developers to repeat the same field knowledge in many places:

- validation rules
- backend DTOs
- API documentation
- frontend forms
- frontend tables
- response masking logic

Cabloy tries to reduce that duplication through a field-oriented contract and metadata model.

## Copy-first command block

If you want the shortest possible start, inspect and refine these files first:

- `vona/src/module/demo-student/src/entity/student.tsx`
- `vona/src/module/demo-student/src/dto/studentCreate.tsx`
- `vona/src/module/demo-student/src/dto/studentUpdate.tsx`
- `vona/src/module/demo-student/src/controller/student.ts`

A practical follow-up verification step is:

```bash
npm run zova :openapi:generate demo-student
```

## The two teaching fields

Use these two fields together:

- `student.level` for render-driven behavior
- `student.mobile` for validation and serialization behavior

This is more practical for beginners than trying to force one field to demonstrate every possible concern equally well.

## Step 1: Start from the backend field definition

The safest beginner habit is to begin with the backend contract surface, not with scattered UI code.

Representative source anchor:

- `vona/src/module/demo-student/src/entity/student.tsx`

This is where you can already see how a field may collect multiple concerns such as:

- title
- required or optional rules
- order
- form-field render metadata
- table-cell render metadata

## Use 1: Validation

Validation lives in the same contract surface as the backend field definition.

Representative backend patterns already show:

- `v.required()`
- `v.optional()`
- `v.min(...)`

That means a field definition is not only a persistence concern. It is also part of the request-contract story.

For `student.mobile`, this is the place to decide rules such as requiredness, minimum length, or basic formatting expectations.

## Use 2: OpenAPI generation

The same contract thread also feeds machine-readable API output.

That is why DTO, entity, and validation changes can affect what frontend SDK generation sees later.

Read this as one continuous path:

1. define or refine the backend field contract
2. expose that contract through controller and DTO surfaces
3. let OpenAPI emit the machine-readable contract
4. regenerate frontend artifacts from the emitted contract when needed

## Use 3: Table and form rendering

Some field metadata is not only about backend rules.

For example, render-oriented metadata such as:

- `ZovaRender.order(...)`
- `ZovaRender.field(...)`
- `ZovaRender.cell(...)`

lets the same business field participate in schema-driven table or form behavior.

That is where `student.level` is especially useful as a teaching example.

A practical reading path is:

1. define the field in backend metadata
2. point the field at the right frontend render resource
3. let schema-driven form or table layers consume that contract

## Use 4: Serialization and desensitization

Response exposure rules can also live in the same metadata-oriented ecosystem.

For `student.mobile`, a common beginner example is partial masking or controlled output shaping.

Representative serializer helpers include:

- `v.serializerExclude()`
- `v.serializerReplace(...)`
- `v.serializerGetter(...)`
- `v.serializerCustom(...)`

A representative field-oriented pattern could look like this:

```typescript
@Api.field(
  v.title($locale('Mobile')),
  v.required(),
  v.serializerReplace(value => `${value.slice(0, 3)}****${value.slice(-4)}`),
)
mobile: string;
```

This example is intentionally small, but it demonstrates the key teaching point clearly:

- the field still belongs to the backend contract surface
- validation still lives there
- serialization policy can also live there
- the frontend can still consume the resulting contract through the normal OpenAPI and render flows

This means response shaping can stay close to the field contract instead of becoming ad hoc controller or service post-processing.

A practical beginner verification step is to use the same shared verification rhythm and check both the UI-visible result and the returned data behavior after your contract changes:

1. make sure the local dev workflow is running:

```bash
npm run dev
```

2. open `http://localhost:7102/admin/`
3. return to the **Student** list page or related Student form
4. verify that `student.level` shows the expected render-driven behavior
5. verify that any `student.mobile` exposure now follows the validation and serialization policy you defined

## A practical beginner walkthrough

For this tutorial series, a good mental walkthrough is:

1. add or refine `student.mobile` in the entity and related DTO surfaces
2. attach validation rules there
3. expose the field through the controller and OpenAPI flow
4. regenerate the frontend contract if needed
5. decide whether serialized output should show the raw mobile value, a masked value, or no value at all
6. separately let `student.level` demonstrate form and table rendering reuse

## Expected result after this tutorial

At the end of this tutorial, a beginner should be able to point to four different reuse surfaces for the same business thread:

1. entity or DTO field metadata for validation
2. controller and DTO flow for OpenAPI output
3. `ZovaRender.*` metadata for table or form rendering
4. `v.serializer*` helpers for response exposure policy

You do not need a giant abstract example. You need one small field-oriented story that touches all four surfaces clearly.

## The full mental model

At this point in the series, the important idea is not “one magical schema file does everything.”

The more accurate Cabloy idea is:

- one field-oriented contract surface
- expressed across entity, DTO, validation, render, OpenAPI, and serializer metadata
- reused by both backend and frontend workflows

That wording matches the current source and docs more accurately than a vague promise of “one schema everywhere.”

## How the five tutorials now fit together

1. a module owns the business boundary
2. CRUD generation creates the first backend thread
3. frontend render resources can flow back into backend field metadata
4. backend contracts can flow forward into generated frontend SDKs
5. the same field-oriented contract surface supports several behaviors without repeating everything manually

That is the main beginner mental model this series is designed to teach.

## Checkpoint

After finishing the series, make sure you can answer these questions:

1. have you reopened `http://localhost:7102/admin/`, returned to the relevant **Student** page, and verified both the visible `level` rendering result and the exposed `mobile` output behavior?
2. where would you add a new validation rule for `student.mobile`?
3. where would you attach a custom render choice for `student.level`?
4. which workflow regenerates frontend contract artifacts after backend contract changes?
5. when is serialization a better fit than changing the service result directly?

## Read together with

- [Validation Guide](/backend/validation-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [API Schema Guide](/frontend/api-schema-guide)
- [Server Data](/frontend/server-data)
- [Serialization Guide](/backend/serialization-guide)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend)

## What to do next

After finishing this series, choose the next path based on your current task:

- if you want deeper backend contract detail, continue with [Entity Guide](/backend/entity-guide) and [DTO Guide](/backend/dto-guide)
- if you want deeper frontend contract consumption, continue with [OpenAPI SDK Guide](/frontend/openapi-sdk-guide) and [API Schema Guide](/frontend/api-schema-guide)
- if you want more CLI-oriented workflow depth, continue with [CLI Reference](/reference/cli-reference)