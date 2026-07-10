# a-image Public Contract Follow-up Checklist

This note records the **still-open follow-up items** around `a-image` contract exposure after the public-contract shrink pass.

Use it when future work touches any of these areas:

- `a-image` DTO / View / OpenAPI design
- direct-upload lifecycle exposure
- `a-image` vs `a-file` contract consistency
- frontend direct-upload adoption
- internal-vs-public resource boundaries

## Purpose

The recent refactor intentionally narrowed the public `a-image` contract surface, but it did **not** attempt to solve every related design question in one pass.

This checklist exists so later contributors can distinguish:

- what was intentionally left unchanged
- what still needs discussion
- what remains a candidate for a second contraction pass

Without this note, future work is likely to accidentally assume that the current public-contract shrink already settled the broader `a-image` design.

## What the recent shrink pass already did

The recent public-contract pass removed these fields from public `a-image` DTO / View / OpenAPI responses where they were not needed by current frontend runtime consumers:

- `clientName`
- `variants`
- `imageScene`
- `status`
- `draftExpiresAt`
- `finalizedAt`
- `draft` on direct-upload create response

The refactor also moved enforcement to the runtime response builders so actual HTTP JSON is narrowed, not only the documented DTO surface.

Representative source files:

- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/dto/imageUploadResponse.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/dto/imageDirectUploadResponse.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/dto/imageView.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/types/image.ts`

## Checklist A: intentionally not included in that refactor

These are not omissions. They were discussed and deliberately left out of the shrink pass.

### A1. Internal persistence and internal resource shapes were not shrunk

Status: **not included**

Still intentionally retained internally:

- `clientName`
- `imageScene`
- `status`
- `draftExpiresAt`
- `finalizedAt`
- `variants`

Primary files:

- `vona/src/suite-vendor/a-image/modules/a-image/src/entity/image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/types/image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.image.ts`

Reason:

- these fields still have internal value for provider lookup, lifecycle enforcement, scene validation, and variant resolution
- the goal of the shrink pass was public contract reduction first, not DB/model redesign

Follow-up question:

- is there a later pass that should also reduce internal resource width, or should that remain intentionally richer than the public contract?

### A2. Cloudflare direct-upload lifecycle internals were not simplified further

Status: **not included**

Still intentionally preserved internally:

- draft lifecycle state
- finalize flow
- draft expiry
- draft cleanup scheduling

Representative files:

- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/schedule.imageDraftPrune.ts`
- `vona/src/suite-vendor/a-image/modules/image-cloudflare/src/service/imageCloudflare.ts`

Reason:

- Cloudflare still needs a true provider-hosted direct-upload lifecycle
- the public contract was shrunk without removing the internal lifecycle model

Follow-up question:

- is the current Cloudflare lifecycle already the minimum viable shared model, or is there still internal lifecycle simplification left to do later?

### A3. Upload topology was not changed

Status: **not included**

The following route split remains intentionally unchanged:

- `/image/upload-token`
- `/image/upload`
- `/image/direct-upload`
- `/image/direct-upload/finalize`
- `/image/upload-url`

Reason:

- earlier analysis concluded that Cloudflare direct-upload should not be collapsed into `/image/upload-url`
- `/image/upload-token` and `/image/upload-url` serve different flows and should not be merged blindly
- native still keeps the ordinary tokened upload flow

Follow-up question:

- none unless a future provider model changes the topology assumptions themselves

## Checklist B: still-open discussion items

These areas were discussed but were not formalized as repo-wide design rules yet.

### B1. Promote the contract-exposure rule into a broader design principle

Status: **addressed**

Resolved by:

- `.docs-internal/architecture/resource-public-contract-exposure.md`

That note now records the shared rule for:

- when resource fields should stay internal vs enter public DTO / View / OpenAPI
- why runtime response builders must enforce the same narrow shape as the documented contract
- why public-contract shrink should stay separate from persistence/versioning work

Follow-through still required:

- apply the new rule consistently in future contract-loop work involving resource DTOs
- use `a-file` as the next concrete convergence target

### B2. Align `a-file` and `a-image` public contract philosophy

Status: **still open**

Observation:

- `a-image` now exposes a slimmer public surface than before
- `a-file` may still expose fields that deserve the same scrutiny, such as `clientName`, `fileScene`, or `meta`

Representative files for future comparison:

- `vona/src/suite-vendor/a-file/modules/a-file/src/types/file.ts`
- `vona/src/suite-vendor/a-file/modules/a-file/src/dto/fileView.ts`
- `vona/src/suite-vendor/a-file/modules/a-file/src/bean/bean.file.ts`

Checklist:

- [ ] run the same public-contract review against `a-file`
- [ ] decide whether `a-file` should converge toward the same exposure standard as `a-image`
- [ ] document any intentional divergences instead of leaving them implicit

### B3. Document why the public contract was shrunk

Status: **still open**

Observation:

- source code and generated consumers now reflect the smaller contract
- but the architectural reason for the shrink is not yet explained in a durable internal note or user-facing trimmed explanation

Checklist:

- [ ] add a short rationale note in the appropriate internal doc when the next `a-image` design update happens
- [ ] if user-facing docs mention response contracts, keep that explanation trimmed and avoid exposing internal rationale unnecessarily

## Checklist C: second-round contraction candidates

These are not automatic removals. They are the next fields worth re-evaluating if a later pass wants to shrink the public contract further.

### C1. Re-evaluate the remaining action-response fields

Status: **candidate for later review**

Current public action responses still keep fields such as:

- `provider`
- `resourceId`
- `contentType`
- `size`
- `public`
- `uploadedAt`

Representative files:

- `vona/src/suite-vendor/a-image/modules/a-image/src/dto/imageUploadResponse.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.image.ts`

Checklist:

- [ ] confirm which of these are truly consumed by real callers
- [ ] identify which are stable public semantics vs provider/resource leakage
- [ ] shrink only if the remaining fields do not carry durable business meaning

### C2. Re-evaluate the remaining image-view fields

Status: **candidate for later review**

Current public image view still keeps:

- `provider`
- `public`
- `uploadedAt`

Representative files:

- `vona/src/suite-vendor/a-image/modules/a-image/src/dto/imageView.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.image.ts`

Checklist:

- [ ] verify whether embedded image views really need all three fields
- [ ] decide whether preview-focused consumers only need `id`, `url`, `filename`, `width`, `height`, and `signed`

### C3. Re-evaluate whether `resourceId` should remain public

Status: **candidate for later review**

Observation:

- `resourceId` may still be useful for some tooling or integration scenarios
- but it is also a provider/resource-facing identifier rather than a pure UI-facing field

Checklist:

- [ ] identify real consumers of `resourceId`
- [ ] decide whether it belongs in the stable public contract or in a more privileged/admin/debug surface only

## Checklist D: still-missing end-to-end frontend adoption work

### D1. Cloudflare direct-upload still lacks a proven frontend completion path

Status: **still open**

Observation:

- backend capability remains available for provider-hosted direct upload
- contract shrink updated backend + generated consumers
- but there is still no established frontend flow that clearly performs:
  1. create direct-upload session
  2. upload bytes to the provider
  3. call finalize
  4. write back the finalized image relation/value

Representative frontend area:

- `zova/src/suite/cabloy-basic/modules/basic-image/src/component/formFieldImage/controller.tsx`

Checklist:

- [ ] decide whether Cabloy Basic should officially ship a Cloudflare direct-upload frontend path
- [ ] if yes, implement and verify the full client flow
- [ ] if no, document that the capability is backend-ready but not yet wired into the standard frontend image field

## Checklist E: future verification reminders

Use this whenever later work reopens `a-image` contract changes.

### E1. Public contract edits must still follow the contract loop

Checklist:

- [ ] treat backend DTO/controller changes as backend contract truth changes
- [ ] regenerate frontend OpenAPI consumers after backend contract edits
- [ ] verify both Admin and Web builds when frontend generated surfaces change
- [ ] keep frontend follow-up thin and reuse the existing image resource-owner where possible

### E2. Internal schema changes are a separate class of work

Checklist:

- [ ] do not mix public-contract shrink with DB schema changes unless there is a clear need
- [ ] if persisted fields are added/removed later, revisit `fileVersion` and `meta.version.ts`
- [ ] run `npm run test` whenever `meta.version.ts` changes

## Quick checklist for the next contributor

Before changing `a-image` again, ask these questions in order:

- [ ] am I changing only public DTO / View / OpenAPI, or also internal persistence/resource shapes?
- [ ] am I accidentally exposing provider/client/scene/lifecycle details again?
- [ ] should the same rule also be applied to `a-file` for consistency?
- [ ] is this work reopening the still-missing frontend Cloudflare direct-upload completion path?
- [ ] if backend contract truth changed, did I complete the contract loop and verify the generated frontend consumers?

## Summary

The recent shrink pass solved the **first public-contract problem**:

- too many internal lifecycle/provider fields were reaching DTO / View / OpenAPI and generated consumers

It did **not** yet solve these broader questions:

- how far internal `a-image` models should also be narrowed
- whether `a-file` should follow the same public-contract rules
- whether the remaining public fields should be shrunk again later
- whether Cabloy Basic should provide a first-class frontend Cloudflare direct-upload completion flow

Treat this note as the standing checklist for those follow-up questions.
