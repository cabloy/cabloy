# Backend Contract Emission Source Reading Map

This page is a practical source-reading companion for one narrow backend question:

> if my question is no longer “how one module is wired” but “how controller, entity, and DTO metadata become emitted OpenAPI contract,” which files should I read first, and in what order?

Use this page together with:

- [OpenAPI Guide](/backend/openapi-guide)
- [DTO Infer and Generation](/backend/dto-infer-generation)
- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)

> [!TIP]
> **Backend emission reading path**
>
> 1. **[Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)** — understand how one real module is wired
> 2. **[DTO Infer and Generation](/backend/dto-infer-generation)** — understand how DTO shapes are chosen and wrapped
> 3. **[Backend Contract Emission Source Reading Map](/backend/backend-contract-emission-source-reading-map)** — trace how those surfaces become emitted OpenAPI contract
>
> **You are here:** step 3.
> **Previous recommended pages:** [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain) and [DTO Infer and Generation](/backend/dto-infer-generation).

## Why this page exists

The current backend docs already explain:

- how one backend module is wired
- how DTO helpers and generated metadata work
- why OpenAPI matters as a backend contract bridge

What was still missing was one source-order page that isolates the emission branch itself.

This page fills that gap.

It is a file-order map for contract emission, not another broad OpenAPI concept page.

## How to use this page

Use this rule of thumb:

1. start with the conceptual pages first
2. read the first source file to identify the contract input surface
3. follow the emission path only until you understand where the emitted backend contract comes from
4. stop and hand off to the fullstack forward bridge once the question becomes frontend generation or consumption

## The shortest accurate mental model

A practical backend emission path looks like this:

1. controllers define route/action request and response contracts
2. DTOs and entities define named and shared field/metadata surfaces
3. validation and `v` helpers refine the emitted shape
4. OpenAPI generation reads those combined surfaces into machine-readable contract output
5. that emitted contract then hands off to the forward-chain fullstack bridge

That means the emission branch is not the same as the module wiring branch.

It starts from the authored contract surfaces, then stops when the emitted backend contract is ready for downstream consumers.

## Source-confirmed reading path

Use this order:

1. `vona/src/module/demo-student/src/controller/student.ts`
2. `vona/src/module/demo-student/src/dto/studentCreate.tsx`
3. `vona/src/module/demo-student/src/dto/studentUpdate.tsx`
4. `vona/src/module/demo-student/src/dto/studentView.tsx`
5. `vona/src/module/demo-student/src/dto/studentSelectReq.tsx`
6. `vona/src/module/demo-student/src/dto/studentSelectRes.tsx`
7. `vona/src/module/demo-student/src/dto/studentSelectResItem.tsx`
8. `vona/src/module/demo-student/src/entity/student.tsx`
9. `vona/src/module/demo-student/src/.metadata/index.ts`
10. then return to the conceptual emission surface in [OpenAPI Guide](/backend/openapi-guide)

That order starts from the route/action contract surface, descends through the DTO and entity metadata that shape the emitted contract, and then returns to the OpenAPI-specific conceptual layer once the inputs are clear.

## What each source surface clarifies

### `controller/student.ts`

This file shows the route/action contract entry layer:

- `@Web.*` action declarations
- `@Arg.*` request extraction
- `@Api.body(...)` response contract surfaces
- action-level request/response DTO references

Read this file first when the question is:

- which action contracts are even supposed to emit into OpenAPI?

### `dto/*.tsx`

These files show the named request/response contract artifacts that OpenAPI can emit.

Representative distinctions to keep in mind:

- create/update/view DTOs are operation-facing named artifacts
- select request DTOs may also carry filter-specific shaping and transform logic
- list/count DTOs may wrap row-item DTOs into emitted list contracts

Read these files when the question is:

- which DTO shape is part of the emitted backend contract?

### `entity/student.tsx`

This file shows the shared field contract surface:

- `@Api.field(...)`
- validation-oriented field rules
- OpenAPI-facing titles and metadata
- field-level render metadata that still belongs to the broader contract story

Read this file when the question is:

- which parts of the emitted contract are shared field truth rather than DTO-local additions?

### `.metadata/index.ts`

This file is not the main emission engine, but it still matters as a generated registry surface.

Read it when the question is:

- how do the DTO/controller/entity contract artifacts become visible as a coherent module-level generated surface?

Its value here is limited and specific:

- it confirms the DTO/controller/entity registrations exist together
- it shows those artifacts are not isolated local files only

Then stop and move back to the OpenAPI emission docs instead of re-reading the whole module chain.

## What this page does not re-explain

This page deliberately does **not** re-teach:

- full module wiring and generated registration inventory -> see [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
- explicit vs inferred DTO strategy -> see [DTO Infer and Generation](/backend/dto-infer-generation)
- frontend SDK generation and consumption -> see [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- general OpenAPI concepts -> see [OpenAPI Guide](/backend/openapi-guide)

Its job is only to show the shortest file-order path through the backend contract-emission inputs.

## Where to read next

- If you need the broader conceptual emission page, continue with [OpenAPI Guide](/backend/openapi-guide).
- If you want one concrete emitted action thread before widening back out, continue with [Backend Contract Emission Specimen](/backend/backend-contract-emission-specimen).
- If you want a backend-side proof or diagnosis companion for the source-reading path itself, continue with [Backend Source Reading Verify Playbook](/backend/backend-source-reading-verify-playbook) and [Backend Source Reading Debug Checklist](/backend/backend-source-reading-debug-checklist).
- If you want to inspect the emitted output surfaces themselves after the source-order path, continue with [Backend Contract Emission Output Inspection](/backend/backend-contract-emission-output-inspection).
- If your next question is still about DTO helper and wrapping mechanics, return to [DTO Infer and Generation](/backend/dto-infer-generation).
- If your next question is about how one real module is wired before emission, return to [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain).
- If your next question is about how the emitted backend contract becomes generated frontend consumers, continue with [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).

## Final takeaway

The cleanest way to read backend contract emission is not to stay only in conceptual OpenAPI docs and not to reread the whole module chain every time.

Start from controller + DTO + entity contract inputs, confirm how those surfaces shape the emitted contract, then hand off to the forward-chain bridge once the emitted backend truth is clear.
