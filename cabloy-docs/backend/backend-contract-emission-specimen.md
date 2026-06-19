# Backend Contract Emission Specimen

This page is a concrete backend specimen for one narrow question:

> how does one real controller action become one emitted backend contract slice?

It uses one emitted path only:

- `GET /demo/student/summary/:id`

Use this page together with:

- [OpenAPI Guide](/backend/openapi-guide)
- [Backend Contract Emission Source Reading Map](/backend/backend-contract-emission-source-reading-map)
- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
- [DTO Infer and Generation](/backend/dto-infer-generation)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)

> [!TIP]
> **Backend emission reading path**
>
> 1. **[OpenAPI Guide](/backend/openapi-guide)** — understand backend contract emission conceptually
> 2. **[Backend Contract Emission Specimen](/backend/backend-contract-emission-specimen)** — inspect one real emitted controller-action thread
> 3. **[Backend Contract Emission Source Reading Map](/backend/backend-contract-emission-source-reading-map)** — widen back out to the broader file-order emission path
>
> **You are here:** step 2.
> **Previous recommended page:** [OpenAPI Guide](/backend/openapi-guide).

## Why this specimen exists

The current backend docs already explain several adjacent parts of the story:

- `OpenAPI Guide` explains why OpenAPI matters conceptually
- `Backend Resource/Module Contract Chain` explains how one module is wired
- `DTO Infer and Generation` explains how DTO shapes are chosen and wrapped
- `Backend Contract Emission Source Reading Map` explains the broader file-order path for emission inputs

What was still missing was one compact specimen that stays on a single emitted thread.

This page fills that gap.

It is not another broad OpenAPI guide and not another full module walkthrough. It is a specimen page for one emitted backend contract slice.

## The shortest accurate mental model

For this specimen, the emitted backend contract comes from three main authored surfaces:

1. the controller action declares the route and response contract entry
2. the DTO class declares the named response body shape
3. the module’s generated metadata surface exposes the registered route and DTO presence together

That is enough to answer the practical question:

- which action is being emitted?
- which DTO shape is part of that emitted contract?
- where can I confirm the route path and DTO registration in the generated module surface?

## Source-confirmed reading path

Use this order:

1. `vona/src/module/demo-student/src/controller/student.ts`
2. `vona/src/module/demo-student/src/dto/studentSummary.tsx`
3. `vona/src/module/demo-student/src/.metadata/index.ts`

That order is intentionally small.

It starts at the emitted action contract entry, moves into the DTO response shape, then ends at the generated module-level registration surface.

## 1. Controller action: the emitted route and response entry

The first source to read is:

- `vona/src/module/demo-student/src/controller/student.ts`

Representative source facts:

- `@Web.get('summary/:id')`
- `@Api.body(v.optional(), v.object(DtoStudentSummary))`
- action method `summary(...)`

This file answers the first emission question:

- which route/action contract is supposed to be emitted?

For this specimen, the answer is clear:

- the route is `summary/:id`
- the response contract is declared through `DtoStudentSummary`

A practical reading takeaway is:

> the controller action is the contract entry point for the emitted backend slice.

## 2. DTO surface: the named emitted response shape

The next source to read is:

- `vona/src/module/demo-student/src/dto/studentSummary.tsx`

Representative source facts:

- `@Dto<IDtoOptionsStudentSummary>()`
- fields such as `id`, `name`, `mobile`, `level`, `levelTitle`, `description`, `descriptionLength`, and `summaryText`
- `@Api.field(...)` metadata on each field

This file answers the second emission question:

- which named response body shape is part of the emitted contract?

It is also a useful boundary reminder.

This page is not about infer-vs-explicit DTO strategy in general. It is only showing that this concrete action emits a concrete named DTO artifact.

A practical reading takeaway is:

> for this emitted slice, `DtoStudentSummary` is the clearest response-shape truth to inspect.

## 3. Generated module surface: route path and DTO registration together

The final source to read is:

- `vona/src/module/demo-student/src/.metadata/index.ts`

Representative source facts for this specimen:

- the DTO registry includes `demo-student:studentSummary`
- the generated API path record includes `'/demo/student/summary/:id'`

This file is not the emission engine itself, but it is still useful because it confirms that the action and DTO are visible together in the generated module-level surface.

For this specimen, it answers the third emission question:

- where can I confirm the summary route path and DTO presence together without re-reading the whole controller and DTO directories?

A practical reading takeaway is:

> `.metadata/index.ts` is the compact generated confirmation surface after you already know which action and DTO you are tracing.

## What this specimen does not cover

This page deliberately does **not** re-teach:

- the whole backend module wiring chain -> see [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
- explicit vs inferred DTO mechanics -> see [DTO Infer and Generation](/backend/dto-infer-generation)
- general OpenAPI concepts and `bean.openapi` capabilities -> see [OpenAPI Guide](/backend/openapi-guide)
- frontend generation and consumption after emission -> see [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)

Its job is only to keep one emitted action thread small and concrete.

## Where to read next

- If you want the broader conceptual emission page, continue with [OpenAPI Guide](/backend/openapi-guide).
- If you want a backend-side proof or diagnosis companion for this emitted-thread path, continue with [Backend Source Reading Verify Playbook](/backend/backend-source-reading-verify-playbook) and [Backend Source Reading Debug Checklist](/backend/backend-source-reading-debug-checklist).
- If you want to inspect the emitted output itself after this authored specimen, continue with [Backend Contract Emission Output Inspection](/backend/backend-contract-emission-output-inspection).
- If you want the broader file-order path through emission inputs, continue with [Backend Contract Emission Source Reading Map](/backend/backend-contract-emission-source-reading-map).
- If you want the full module wiring specimen around this action, continue with [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain).
- If you want to follow this emitted backend contract into generated frontend consumers, continue with [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).

## Final takeaway

The cleanest way to understand one emitted backend contract slice is not to reread the entire module or stay only in broad OpenAPI concepts.

For the `summary/:id` specimen, read:

- the controller action for the emitted route/response entry
- the DTO for the emitted response body shape
- the generated module surface for route and DTO confirmation

That keeps the backend emission story concrete without flattening it into a much larger module walkthrough.
