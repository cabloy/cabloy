# Resource Public Contract Exposure

This note records the shared rule for deciding which backend resource fields belong in public DTO / View / OpenAPI contracts.

Use it when work touches resource-style modules such as `a-image`, `a-file`, or any future backend module that exposes both:

- a richer internal provider/persistence/resource model
- a narrower public HTTP / serializer contract

## Purpose

This rule exists to prevent a recurring drift problem:

- internal provider, client, scene, lifecycle, or storage details enter public DTO / View / OpenAPI shapes too early
- generated frontend consumers then start depending on those details
- later cleanup becomes more expensive because public contract shrink now looks like a breaking change

The goal is to keep public contracts small, stable, and consumer-oriented, while still allowing backend internals to remain richer where the runtime genuinely needs them.

## Core rule

Public resource contracts should expose **stable consumer-facing semantics**, not every field that happens to exist in the internal resource model.

That means a public DTO / View / OpenAPI response should answer questions such as:

- what resource is this?
- what user-facing name or dimensions does it have?
- how can the consumer display, download, or continue uploading it?
- is the resulting delivery URL signed or public?

It should not automatically expose fields just because the backend currently stores them.

## Default exposure buckets

### Usually public

These fields are usually appropriate in public action/view contracts when the consumer actually needs them:

- stable resource identity such as `id`
- user-facing naming fields such as `filename`
- consumer-facing presentation data such as `width`, `height`, `contentType`, `size`
- delivery fields such as `url`, `downloadUrl`, `signed`
- flow-completion fields required by the current API step such as `uploadUrl`, `headers`, `method`
- business-visible access semantics such as `public` when callers genuinely care about them

### Usually internal

These fields should stay internal by default unless a concrete public caller proves otherwise:

- provider client routing details such as `clientName`
- scene/policy identifiers such as `imageScene` or `fileScene`
- provider storage coordinates such as `bucket`, `objectKey`, `storagePath`, `deliveryBaseUrl`
- provider bookkeeping such as `etag`
- raw provider payloads such as `raw`
- internal lifecycle state such as `status`, `draft`, `draftExpiresAt`, `finalizedAt`
- provider configuration echoes or other debugging-oriented fields

### Case-by-case

Some fields need explicit judgment rather than a blanket rule:

- `provider`
- `resourceId`
- `meta`
- `uploadedAt`

These can remain public when they carry durable consumer-facing meaning, but they should not stay public merely because earlier implementations exposed them.

## Runtime enforcement rule

DTO / View / OpenAPI declarations are not enough by themselves.

If runtime response builders still spread rich internal resource objects into HTTP responses, then the actual JSON contract remains wider than the documented one.

Preserve this invariant:

- the documented public contract and the runtime-emitted JSON must match

Recommended pattern:

- keep internal resource/provider types rich where needed
- introduce explicit public response/view types when helpful
- build public responses with allowlisted field-by-field objects
- avoid `{ ...resource }` in controller or bean paths that produce public responses

## Separation from persistence/versioning work

Public-contract shrink and persistence schema work are separate classes of change.

Default rule:

- do not mix public DTO / View / OpenAPI shrink with DB schema removal unless there is a clear need

So when the task is only contract reduction:

- keep `meta.version.ts` unchanged
- keep `vonaModule.fileVersion` unchanged
- keep internal entity/provider/resource shapes intact unless correctness requires otherwise

If a later task decides to physically remove persisted fields, treat that as a separate migration/versioning decision.

## Contract-loop rule

When backend public contract truth changes, complete the normal Vona → Zova contract loop.

That means:

1. change backend truth first
2. regenerate frontend consumer surfaces
3. keep frontend follow-up thin
4. verify the affected Admin/Web builds as needed

Do not hand-patch generated consumer surfaces as a substitute for backend contract cleanup.

## Current examples

### `a-image`

`a-image` is the first completed example of this rule.

Its recent public-contract shrink:

- removed internal lifecycle/provider fields from public DTO / View / OpenAPI responses
- kept internal persistence and provider-resource shapes rich
- moved enforcement into runtime response builders so actual JSON matched the narrower contract

Representative files:

- `vona/src/suite-vendor/a-image/modules/a-image/src/bean/bean.image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/types/image.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/dto/imageUploadResponse.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/dto/imageDirectUploadResponse.ts`
- `vona/src/suite-vendor/a-image/modules/a-image/src/dto/imageView.ts`

### `a-file`

`a-file` is the next application target.

The main cleanup target is to stop spread-based public response assembly and converge its DTO/view/runtime surfaces toward the same allowlisted contract style already used by `a-image`.

Representative files:

- `vona/src/suite-vendor/a-file/modules/a-file/src/controller/file.ts`
- `vona/src/suite-vendor/a-file/modules/a-file/src/bean/bean.file.ts`
- `vona/src/suite-vendor/a-file/modules/a-file/src/dto/fileUploadResponse.ts`
- `vona/src/suite-vendor/a-file/modules/a-file/src/dto/fileDirectUploadResponse.ts`
- `vona/src/suite-vendor/a-file/modules/a-file/src/dto/fileView.ts`

## Quick checklist

Before exposing a backend resource field publicly, ask:

- is this field part of stable consumer-facing semantics, or only backend implementation detail?
- does the current API step genuinely require this field to complete its flow?
- would removing this field later be hard because generated consumers would start depending on it?
- does the runtime response builder actually enforce the same narrow shape as DTO / OpenAPI?
- am I accidentally mixing public-contract shrink with persistence/versioning work?

## Related guidance

- `repo-docs-internal/architecture/backend-resource-field-workflow.md`
- `repo-docs-internal/architecture/a-image-public-contract-followup-checklist.md`
- `repo-docs/fullstack/contract-loop-playbook.md`
- `CLAUDE.md`
