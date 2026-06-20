# Backend Contract Emission Output Inspection

This page is a practical inspection companion for one narrow backend question:

> after I understand the controller/DTO/entity inputs, how do I inspect the emitted Swagger/OpenAPI output for one backend contract slice?

It uses one concrete emitted thread as the specimen:

- `GET /training/student/summary/:id`

Use this page together with:

- [OpenAPI Guide](/backend/openapi-guide)
- [Backend Contract Emission Specimen](/backend/backend-contract-emission-specimen)
- [Backend Contract Emission Source Reading Map](/backend/backend-contract-emission-source-reading-map)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)

> [!TIP]
> **Backend emission inspection path**
>
> 1. **[OpenAPI Guide](/backend/openapi-guide)** — understand backend emission conceptually
> 2. **[Backend Contract Emission Specimen](/backend/backend-contract-emission-specimen)** — inspect one concrete emitted action thread
> 3. **[Backend Contract Emission Source Reading Map](/backend/backend-contract-emission-source-reading-map)** — trace the broader input-side file order
> 4. **[Backend Contract Emission Output Inspection](/backend/backend-contract-emission-output-inspection)** — inspect the emitted output surfaces themselves
>
> **You are here:** step 4.
> **Previous recommended pages:** [OpenAPI Guide](/backend/openapi-guide), [Backend Contract Emission Specimen](/backend/backend-contract-emission-specimen), and [Backend Contract Emission Source Reading Map](/backend/backend-contract-emission-source-reading-map).

## Why this page exists

The current backend docs already explain three useful layers of the emission story:

- why OpenAPI matters
- how one concrete emitted action thread is authored
- which files to read in source order for the broader emission branch

What was still missing was one page that starts from the **emitted output surfaces themselves**.

This page fills that gap.

It is not another broad OpenAPI concept page and not another source-reading map. It is the companion page for inspecting the emitted artifact directly.

## The shortest accurate mental model

For this specimen, there are three things you should compare:

1. the authored controller/DTO inputs
2. the generated module-level metadata records
3. the emitted OpenAPI output surfaces

If those three surfaces agree, the emitted backend contract slice is usually correct enough to hand off into the forward-chain frontend generation step.

## Which emitted surfaces to inspect

The current backend docs already name the main inspection surfaces:

- Swagger UI
- OpenAPI JSON output
- versioned OpenAPI JSON output
- RapiDoc

For local emitted JSON inspection, the current public repo docs already use this example endpoint:

- `http://localhost:7102/swagger/json?version=V31`

That is the most practical raw inspection surface when you want to confirm the emitted machine-readable contract itself.

## The specimen to keep in mind

Keep one small emitted path in mind while inspecting output:

- `GET /training/student/summary/:id`

The authored/backend anchors for that path are:

- `vona/src/suite/a-training/modules/training-student/src/controller/student.ts`
- `vona/src/suite/a-training/modules/training-student/src/dto/studentSummary.tsx`
- `vona/src/suite/a-training/modules/training-student/src/.metadata/index.ts`

This page is not re-walking those files in depth. It uses them as the comparison baseline for the emitted output.

## What to confirm in emitted output

### 1. Confirm the route path exists

Start by confirming that the emitted OpenAPI output includes the expected route path for the specimen.

For this page, the check is simple:

- the emitted output should expose the summary action path for the Student resource

Compare that against:

- `@Web.get('summary/:id')` in `controller/student.ts`
- the generated path registration in `.metadata/index.ts`

A practical reading takeaway is:

> the controller action and the emitted path should agree before you think about frontend SDK generation.

### 2. Confirm the emitted response shape matches the DTO contract

Next, inspect the response schema for the summary action.

The source truth for the named response shape is:

- `DtoStudentSummary`

Representative fields in that DTO include:

- `id`
- `name`
- `mobile`
- `level`
- `levelTitle`
- `description`
- `descriptionLength`
- `summaryText`

When you inspect the emitted OpenAPI output, the important question is:

- does the response schema still reflect the intended named DTO shape?

A practical reading takeaway is:

> for this specimen, `DtoStudentSummary` is the response-shape baseline that the emitted output should mirror.

### 3. Confirm the generated registry agrees with the emitted slice

The generated module surface in:

- `vona/src/suite/a-training/modules/training-student/src/.metadata/index.ts`

should still agree with what you see in emitted output.

The two most useful checks are:

- the DTO registry includes `training-student:studentSummary`
- the generated API path records include the summary route

That gives you a compact consistency triangle:

- controller action
- DTO registration
- emitted OpenAPI path/schema output

## A practical inspection order

When checking one emitted backend contract slice, use this order:

1. confirm the authored controller action is still the intended source truth
2. confirm the named DTO is still the intended response-shape truth
3. confirm `.metadata/index.ts` still exposes the expected path and DTO registration
4. inspect versioned OpenAPI JSON output
5. only then hand off to frontend generation or bridge diagnostics

That order keeps the inspection process narrow and avoids drifting too early into downstream layers.

## What this page does not re-explain

This page deliberately does **not** re-teach:

- broad OpenAPI concepts -> see [OpenAPI Guide](/backend/openapi-guide)
- the full emitted action specimen narrative -> see [Backend Contract Emission Specimen](/backend/backend-contract-emission-specimen)
- the file-order path into controller/DTO/entity inputs -> see [Backend Contract Emission Source Reading Map](/backend/backend-contract-emission-source-reading-map)
- how emitted backend contract becomes generated frontend consumers -> see [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)

Its job is only to help you inspect the emitted backend output itself.

## Where to read next

- If you need the broader conceptual emission page, continue with [OpenAPI Guide](/backend/openapi-guide).
- If you want a backend-side proof or diagnosis companion after checking emitted output, continue with [Backend Source Reading Verify Playbook](/backend/backend-source-reading-verify-playbook) and [Backend Source Reading Debug Checklist](/backend/backend-source-reading-debug-checklist).
- If you need the concrete authored action thread again, continue with [Backend Contract Emission Specimen](/backend/backend-contract-emission-specimen).
- If you need the broader input-side file-order path, continue with [Backend Contract Emission Source Reading Map](/backend/backend-contract-emission-source-reading-map).
- If the emitted backend output now looks correct and you want the next bridge step, continue with [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).

## Final takeaway

The cleanest way to inspect one emitted backend contract slice is not to stay only in conceptual OpenAPI docs and not to jump immediately into frontend generation.

For the `summary/:id` specimen, compare:

- the controller action
- the named DTO shape
- the generated module registry
- the emitted OpenAPI output surface

If those surfaces agree, the backend contract slice is usually ready for the forward-chain handoff.
