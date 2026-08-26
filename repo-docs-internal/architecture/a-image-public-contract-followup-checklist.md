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
- `provider`
- `resourceId`
- `uploadedAt`

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

- `/image/upload`
- `/image/direct-upload`
- `/image/direct-upload/finalize`
- `/image/upload-url`

Reason:

- earlier analysis concluded that Cloudflare direct-upload should not be collapsed into `/image/upload-url`
- `/image/upload` and `/image/upload-url` serve different flows and should not be merged blindly
- native uses the ordinary authenticated multipart upload flow

Follow-up question:

- none unless a future provider model changes the topology assumptions themselves

## Checklist B: still-open discussion items

These areas were discussed but were not formalized as repo-wide design rules yet.

### B1. Promote the contract-exposure rule into a broader design principle

Status: **addressed**

Resolved by:

- `repo-docs-internal/architecture/resource-public-contract-exposure.md`

That note now records the shared rule for:

- when resource fields should stay internal vs enter public DTO / View / OpenAPI
- why runtime response builders must enforce the same narrow shape as the documented contract
- why public-contract shrink should stay separate from persistence/versioning work

Follow-through:

- apply the new rule consistently in future contract-loop work involving resource DTOs

### B2. Align `a-file` and `a-image` public contract philosophy

Status: **addressed for the current public field set**

Both modules now keep provider routing and provider-storage identifiers internal. Their public DTO/View/OpenAPI responses are enforced by explicit runtime builders. The intentional remaining difference is that `a-file.uploadedAt` stays public because the standard Basic file field displays it; `a-image.uploadedAt` is absent because it is unused and ambiguous for a direct-upload lifecycle.

### B3. Document why the public contract was shrunk

Status: **addressed**

The durable architecture rationale is recorded in `repo-docs-internal/architecture/resource-public-contract-exposure.md`. Public docs describe only the stable consumer-facing workflow and do not expose internal provider or lifecycle implementation details.

## Checklist C: second-round contraction candidates

These are not automatic removals. They are the next fields worth re-evaluating if a later pass wants to shrink the public contract further.

### C1. Re-evaluate the remaining action-response fields

Status: **candidate for later review**

Current public action responses still keep fields such as:

- `contentType`
- `size`
- `public`

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

- `public`

Representative files:

- `vona/src/suite-vendor/a-image/modules/a-image/src/dto/imageView.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.image.ts`

Checklist:

- [ ] verify whether embedded image views need the remaining `public` field
- [ ] decide whether preview-focused consumers only need `id`, `url`, `filename`, `width`, `height`, and `signed`

## Checklist D: deferred implementation and verification work

### D1. Standard image field direct-upload completion path

Status: **implemented**

`basic-image:formFieldImage` now selects transport from the server-provided semantic `directUpload` upload-policy capability:

1. ordinary scenes use authenticated multipart `upload(imageScene, image)`
2. direct-capable scenes use `createDirectUpload`
3. the browser uploads bytes to the returned provider URL
4. the browser calls `finalizeDirectUpload` with the Cabloy image ID
5. only the finalized response updates the stored field and resolved relation preview

The frontend does not branch on provider identity or receive provider/client/resource identifiers. Failed provider transfers and not-ready finalization leave form state unchanged; the existing draft-expiry lifecycle handles abandoned backend drafts.

Representative frontend area:

- `zova/src/suite/cabloy-basic/modules/basic-image/src/component/formFieldImage/controller.tsx`

### D2. Verify the browser/provider boundary with a real Cloudflare Images account

Status: **deferred: external account required**

The source, contract, focused backend tests, generated consumer, and Admin/Web builds verify the implementation shape. A real browser smoke test remains necessary when a Cloudflare Images account is available:

- [ ] confirm the provider upload URL permits the browser CORS request
- [ ] confirm the provider accepts the multipart `file` field
- [ ] confirm create → provider upload → finalize timing, including a not-ready finalize response
- [ ] confirm crop/resize, multi-image ordering, and native authenticated-upload regression
- [ ] confirm provider-upload or finalize failure leaves the field value and resolved relation preview unchanged

### D3. Design and implement native remote URL import

Status: **deferred: security design and implementation required**

Native remote URL import is an accepted future capability, not a current feature. `image-native` still lacks `uploadUrl(...)`; `image-cloudflare` delegates remote URL ingestion to Cloudflare Images. This documentation pass does not change the current source, public contract, tests, or user-facing documentation.

Before adding Native support, complete the security and lifecycle design recorded in [the deferred native remote URL import boundary](./a-image-cloudflare-signed-delivery-architecture.md#deferred-native-remote-url-import-boundary):

- [ ] define the SSRF policy, including permitted schemes, proxy behavior, DNS/IP validation, protected IPv4/IPv6 ranges, and port rules
- [ ] cap redirect traversal and revalidate every redirect target before connecting
- [ ] enforce scene-derived actual streamed-byte limits and safely abort and clean up over-limit transfers
- [ ] define and test connection, response, idle/read, and total-transfer timeouts with cancellation behavior
- [ ] validate downloaded bytes, decoded image data, and resolved scene policy server-side rather than trusting request metadata
- [ ] define deterministic cleanup for temporary downloads, partial native originals or variants, and persisted image records
- [ ] add focused SSRF, redirect, limit, timeout, malformed-content, policy, and cleanup failure-path coverage
- [ ] only then add the Native provider capability and revisit shared `/image/upload-url` behavior

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
- [ ] does the change preserve the aligned `a-file` / `a-image` public-contract rule?
- [ ] does direct upload still write the field value only after finalization succeeds?
- [ ] if backend contract truth changed, did I complete the contract loop and verify the generated frontend consumers?
- [ ] if Cloudflare browser access is available, did I run the deferred D2 smoke test?
- [ ] am I reopening the explicitly deferred Native remote URL import, and have all D3 security gates been designed before changing provider code?

## Summary

The recent shrink pass solved the **first public-contract problem**:

- too many internal lifecycle/provider fields were reaching DTO / View / OpenAPI and generated consumers

The current work intentionally leaves these follow-ups open:

- how far internal `a-image` models should also be narrowed
- whether the remaining public fields (`contentType`, `size`, and `public`) should be shrunk after a real-consumer audit
- the deferred real-browser Cloudflare verification in D2
- the deferred security design and implementation gates for Native remote URL import in D3

Treat this note as the standing checklist for those follow-up questions.
