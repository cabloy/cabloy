# a-image Refactor Checklist

This note records the recommended execution checklist for the next `a-image` refactor pass.

Use it when working on any of these areas:

- `a-image` delivery and download semantics
- direct-upload lifecycle completion
- `image-native` variant generation behavior
- upload-policy validation reuse
- provider/client option typing and merge boundaries

## Goal

Reduce the current semantic coupling in `a-image` without trying to redesign the whole subsystem at once.

The refactor should converge on these outcomes:

- delivery URL resolution and content download have distinct, explicit semantics
- direct-upload draft resources have a complete lifecycle instead of a half-open creation path
- `image-native` uses a **lazy-only** variant strategy
- upload validation rules live in one shared place instead of being duplicated across layers
- provider option merging remains extensible but has tighter type boundaries

## Locked decisions for this refactor

These decisions are already established and should be treated as requirements for the work.

### 1. `image-native` is lazy-only

Do not introduce an eager/lazy switch.

Required rule:

- `image-native` named variants and custom transforms should be generated on demand and then reused from cache
- upload should store the original image without pre-generating variants
- configuration should not expose a strategy toggle that brings eager generation back

Reason:

- it reduces mental overhead
- it keeps upload-time cost independent from the number of configured variants
- it makes the native provider easier to explain and maintain

### 2. Delivery cleanup comes before broad feature expansion

The next pass should focus on semantic clarity and lifecycle completion, not on adding new provider capabilities.

### 3. Contract-surface edits still require the contract loop

If this refactor changes controller DTOs, route behavior, or backend contract truth, treat it as contract-loop work and run the usual regeneration and verification path.

## Scope order

Recommended implementation order:

1. low-risk internal cleanup
2. delivery/download semantic split
3. `image-native` lazy-only conversion
4. direct-upload lifecycle completion
5. optional view/resource assembly cleanup

This order keeps the first pass small while setting up the later lifecycle work on a cleaner base.

## Phase 1: low-risk internal cleanup

### 1.1 Extract shared upload validation helpers

Primary files:

- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.imageUploadPolicy.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/controller/image.ts`
- new helper under `vona/src/suite-vendor/a-image/modules/a-image/src/lib/`

Tasks:

- extract MIME-type validation
- extract extension derivation and validation
- extract size / MIME / extension rule enforcement
- make policy resolution and controller upload entrypoints reuse the same helper surface

Acceptance checks:

- validation rules are not duplicated in multiple high-level flows
- upload-token, direct-upload, and upload-url remain aligned on the same rule set
- existing behavior stays unchanged for current passing tests

### 1.2 Tighten provider option typing

Primary files:

- `vona/src/suite-vendor/a-image/modules/a-image/src/types/imageProvider.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.imageProvider.ts`

Tasks:

- make `base` and `clients` typing explicit
- avoid loose fallback objects that erase option shape
- keep provider-specific extension points while preserving stronger inference in shared code

Acceptance checks:

- provider option merge code is easier to read and reason about
- downstream provider modules get more stable type guidance
- merge precedence remains unchanged

## Phase 2: split delivery URL semantics from content download semantics

### 2.1 Clarify the public bean API

Primary file:

- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.image.ts`

Tasks:

- preserve current behavior compatibility where needed
- introduce clearer internal or public method boundaries such as:
  - delivery URL resolution
  - variant URL resolution
  - raw content download
- reduce the amount of provider-specific branching exposed at the top-level bean surface

Acceptance checks:

- callers can distinguish “give me a URL” from “give me bytes” without reading multiple branches
- signed and unsigned behavior stays explicit
- proxy-signed and provider-signed flows remain consistent with the existing architecture rules

### 2.2 Reduce controller responsibility in delivery handling

Primary files:

- `vona/src/suite-vendor/a-image/modules/a-image/src/controller/image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.imageUploadPolicy.ts`

Tasks:

- keep the controller focused on request parsing, auth, and response shaping
- move delivery-strategy branching back into `a-image` orchestration where possible
- keep `/image/delivery/:imageId` constrained to token verification plus redirect behavior for proxy-signed delivery

Acceptance checks:

- delivery policy is not fragmented between controller and bean layers
- proxy-token flow remains the only shareable path for native signed delivery

## Phase 3: convert `image-native` to lazy-only variants

### 3.1 Remove eager variant generation from upload-time flow

Primary file:

- `vona/src/suite-vendor/a-image/modules/image-native/src/service/imageNative.ts`

Tasks:

- stop pre-generating named variants during upload
- keep original-image persistence as the only required upload-time storage step
- remove or refactor eager-only helper paths

Acceptance checks:

- upload-time work no longer scales with configured named variants
- original upload behavior remains correct

### 3.2 Generate named variants on demand

Primary file:

- `vona/src/suite-vendor/a-image/modules/image-native/src/service/imageNative.ts`

Tasks:

- when a named variant or custom transform is requested, generate it if missing
- cache generated outputs using the existing native file strategy or a compatible replacement
- reuse cached files on later requests

Acceptance checks:

- named variants and custom transforms follow the same lazy mental model
- repeated requests reuse generated files instead of recomputing them every time

### 3.3 Simplify native configuration

Primary files:

- `vona/src/suite-vendor/a-image/modules/image-native/src/config/config.ts`
- any related type/config files in `image-native`

Tasks:

- remove any strategy surface that implies eager support remains available
- keep configuration focused on variant definitions and cache behavior only

Acceptance checks:

- the public configuration story for native variants is: lazy generation only
- no eager/lazy user choice remains

## Phase 4: complete the direct-upload lifecycle

### 4.1 Introduce durable draft-state tracking

Primary files:

- `vona/src/suite-vendor/a-image/modules/a-image/src/entity/image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/meta.version.ts`
- any related DTO/type files under `src/types/` and `src/dto/`

Tasks:

- add an explicit resource status model such as `draft`, `ready`, `failed`, or equivalent
- add expiry/cleanup metadata needed to distinguish unfinished direct-upload resources from usable images
- keep the schema aligned with the existing persistence style in `a-image`

Important checkpoint:

- if this phase adds persisted fields to an existing backend resource, ask whether `vonaModule.fileVersion` should be incremented before changing `meta.version.ts`
- if the answer is yes, create a new migration version and bump `fileVersion`
- if the answer is no, fold the schema change into the current version path

Acceptance checks:

- the database can distinguish incomplete direct-upload drafts from ready images
- later cleanup and finalize logic has durable state to work from

### 4.2 Add an explicit finalize path

Primary files:

- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/controller/image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/types/image.ts`

Tasks:

- make direct-upload creation produce a draft resource, not an implicitly ready image
- add a finalize action that confirms the provider upload completed and promotes the resource into ready state
- allow provider-specific confirmation hooks where appropriate, but keep the shared lifecycle in `a-image`

Acceptance checks:

- direct-upload resources have a clear path from draft to ready
- callers do not treat “upload session created” as “image already available”

### 4.3 Add orphan-draft cleanup rules

Primary areas:

- `a-image` service/bean cleanup entrypoint or scheduled maintenance path
- direct-upload-related provider cleanup if provider-side orphan removal is supported

Tasks:

- define when a draft expires
- define whether cleanup removes only DB drafts or also remote/provider-side orphan resources
- keep cleanup semantics explicit and testable

Acceptance checks:

- abandoned direct-upload drafts do not accumulate forever
- cleanup behavior is deterministic and documented

## Phase 5: optionally reduce `resolveView` complexity

Primary file:

- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.image.ts`

Tasks:

- split resource assembly from delivery assembly
- keep DTO/view construction separate from storage-provider resolution
- make future delivery-policy work less likely to bloat `resolveView`

Acceptance checks:

- `resolveView` is easier to trace
- future contributors can change delivery or resource assembly with less cross-branch risk

## Suggested first implementation slice

If the work should be split into a safe first PR, use this slice:

1. extract shared upload validation helpers
2. tighten provider option typing
3. split delivery/download semantics in `bean.image`
4. convert `image-native` to lazy-only

Why this slice first:

- it gives immediate clarity gains
- it avoids schema changes in the first PR
- it removes the native eager complexity early
- it prepares cleaner ground for the later direct-upload lifecycle work

## Verification checklist

### Narrow verification first

Run the smallest checks that correspond to the touched area:

- targeted `test-image` cases for provider merge behavior
- targeted `test-image` cases for upload behavior
- targeted `test-image` cases for native variant behavior
- targeted `test-image` cases for Cloudflare mapping and signed delivery behavior

Representative test files:

- `vona/src/suite-vendor/a-test/modules/test-image/test/imageProvider.test.ts`
- `vona/src/suite-vendor/a-test/modules/test-image/test/imageUpload.test.ts`
- `vona/src/suite-vendor/a-test/modules/test-image/test/imageNative.test.ts`
- `vona/src/suite-vendor/a-test/modules/test-image/test/imageCloudflareMapping.test.ts`

### Contract-loop verification when backend contract truth changes

If DTOs, controller payloads, or route contracts change:

1. update backend contract source
2. run the relevant metadata/dependency refresh
3. run `npm run build:zova:admin`
4. run `npm run deps:vona` if the backend consumer path depends on refreshed generated outputs
5. rerun targeted tests

### Full verification when schema or migration changes are included

If `meta.version.ts` changes, run:

- `npm run test`

This is required so the test database is rebuilt and schema/data consistency issues surface early.

## Files most likely to change during the refactor

### Shared `a-image`

- `vona/src/suite-vendor/a-image/modules/a-image/src/types/image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/types/imageProvider.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.imageProvider.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.imageUploadPolicy.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/controller/image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/entity/image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/meta.version.ts`

### Native provider

- `vona/src/suite-vendor/a-image/modules/image-native/src/service/imageNative.ts`
- `vona/src/suite-vendor/a-image/modules/image-native/src/config/config.ts`
- `vona/src/suite-vendor/a-image/modules/image-native/src/bean/imageProvider.native.ts`

### Tests

- `vona/src/suite-vendor/a-test/modules/test-image/test/imageProvider.test.ts`
- `vona/src/suite-vendor/a-test/modules/test-image/test/imageNative.test.ts`
- `vona/src/suite-vendor/a-test/modules/test-image/test/imageCloudflareMapping.test.ts`
- `vona/src/suite-vendor/a-test/modules/test-image/test/imageUpload.test.ts`

## Summary for future contributors

Keep these invariants intact while refactoring:

- signed delivery is a shared `a-image` concern, not a provider-specific API leak
- `image-native` should remain lazy-only for variant generation
- delivery URL resolution and raw content download should not be conflated
- advanced upload flows must still respect scene upload policy
- direct-upload resources should have an explicit lifecycle instead of implied readiness
- controller contract changes must follow the contract loop
