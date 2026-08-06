# Vona Error Code and HTTP Status Evolution

## Purpose

Vona currently uses one scalar value for two different concerns: a module error's stable application identity and its HTTP transport status. This note defines the compatibility-preserving evolution that separates those concerns.

The delivery order is part of the contract:

1. implement and release the core capability in Cabloy Basic;
2. upgrade Cabloy Start to the released Basic/Vona version without changing existing Start error declarations;
3. migrate existing Start business errors module by module, removing local status workarounds only when each API contract is verified.

This record defines the target architecture and migration gates. It does not itself change Vona runtime code, dependency versions, generated metadata, or Start error declarations.

## Current contract

Module errors are currently declared as number-only maps:

```ts
export const errors = {
  RoleNameAlreadyInUse: 1001,
} as const;
```

The error resource resolves the named entry, localizes its message, and combines module-scoped business codes above the HTTP range into a namespaced application code such as `admin-role:1001`. The current `ErrorClass` then derives the initial HTTP status from the final code:

- a direct numeric HTTP code such as `404` produces application code `404` and status `404`;
- a namespaced module business code such as `admin-role:1001` is a string and falls back to status `500`;
- a module entry declared as `409` uses `409` as both the application code and HTTP status, so it does not preserve a separate namespaced business identity.

This behavior is simple and remains valid for direct protocol errors. It is incomplete for a domain error that needs both a stable client-facing identity and an intentional HTTP category. A duplicate business name, for example, should be able to produce:

```text
application code: admin-role:1001
HTTP status:       409
```

without requiring every service to catch the generated error and mutate `error.status`.

The response boundary already keeps these values conceptually separate: the error filter reads the effective `Error.status` for the HTTP response and `Error.code` for the JSON application code. The missing capability is the declaration and construction path that should populate both values consistently.

## Target declaration contract

The module error declaration must remain backwards compatible while accepting an explicit descriptor:

```ts
export const errors = {
  // Legacy declaration. Its current behavior is preserved.
  LegacyBusinessError: 1001,

  // New declaration. Business code and HTTP status are independent.
  RoleNameAlreadyInUse: {
    code: 1001,
    status: 409,
  },
} as const;
```

The structured declaration means:

```text
JSON application code: admin-role:1001
HTTP response status:  409
localized message:     the module business-error message
```

The framework must not infer HTTP status from business-code ranges, names, or namespace strings. `code` is the stable application identity; `status` is the initial HTTP transport decision.

Legacy declarations remain valid. If a legacy declaration has no explicit status, the framework retains the current fallback behavior rather than silently changing the API contract. In particular, existing scalar `1001` entries continue to resolve as namespaced business codes with their current initial status until that module is deliberately migrated.

Direct HTTP errors remain supported:

```ts
this.app.throw(404, 'Role not found');
```

For this protocol-oriented form, application code and HTTP status can continue to be `404`.

## Error resolution and transport boundary

The Basic core implementation should normalize both declaration forms into one internal result containing independent values:

```ts
{
  code: string | number,
  status: number,
  message: string,
}
```

The resolution sequence is:

1. resolve a named error entry from the module error map;
2. normalize a legacy scalar or structured descriptor;
3. resolve the localized message using the existing module/error-key lookup rules;
4. namespace the business code using the existing module-code convention;
5. carry the resolved status separately through `fail()` and `throw()`;
6. serialize the existing `{ code, message }` error body while using the effective status for the HTTP response.

The `status` field must be consumed by both direct failure responses and constructed `Error` instances. The legacy status calculation remains the fallback only when no explicit descriptor status exists. The implementation must continue to support externally supplied `Error` objects and the existing status detection/normalization boundary.

No new error body shape is required by this evolution. The standard JSON error body remains:

```json
{
  "code": "admin-role:1001",
  "message": "The role name is already in use"
}
```

The HTTP status is carried by the response envelope, not duplicated into the application error code.

## Type and registration boundaries

The core type changes must cover the entire declaration-to-scope path rather than only the runtime parser:

- module resource error types must accept `number | { code: number; status: number }`;
- generated module metadata and scope augmentation must preserve the descriptor shape;
- scoped error-code types must extract the descriptor's `code` field instead of treating an object as an application code;
- module error loading and merging must preserve descriptor objects and their status;
- scoped error proxies must continue exposing the same `.throw()` / `.fail()` operations;
- locale lookup must continue using the named module error identity and must not stringify a descriptor as `[object Object]`.

The public error identity remains the resolved numeric or namespaced code. The descriptor is declaration metadata and must not leak into the JSON error body unless a future, separately approved error-detail contract requires it.

## Final-filter ownership

An explicit declaration status is the initial transport decision, not an immutable value. Final error filters remain the owner of request-context-dependent policy.

The existing unauthenticated authorization transformation is an important example: a `403` may become `401` when no authenticated Passport is present. Such a filter may intentionally update both `error.status` and `error.code` because the client-visible error identity has changed as well.

This boundary must remain intact:

- module error descriptors define the default semantics of a domain/API error;
- authorization filters may revise status for authentication context;
- response-format filters may choose JSON, HTML, or text presentation;
- the final formatter uses post-filter status detection;
- logging and telemetry should retain the stable business code while recording the effective HTTP status separately.

A descriptor status must not bypass final filters, and a final filter must not require business services to know the request-context policy it enforces.

## Status semantics

Use the status that describes the API meaning, not the implementation layer that detected the condition:

| Situation                                                | Typical status | Guidance                                                                                                       |
| -------------------------------------------------------- | -------------: | -------------------------------------------------------------------------------------------------------------- |
| Missing addressed resource                               |          `404` | Keep resource absence as not found.                                                                            |
| Resource-state or uniqueness conflict                    |          `409` | Use for duplicate business identity or a protected resource state that conflicts with the requested operation. |
| Well-formed request rejected by domain/content rules     |          `422` | Use when the request cannot be processed because its business content is unacceptable.                         |
| Authenticated caller lacks authority                     |          `403` | Keep authorization semantics at the Passport/policy boundary.                                                  |
| Unauthenticated caller reaches an authenticated boundary |          `401` | Allow the final authentication filter to revise a prior authorization result where required.                   |
| Unexpected infrastructure or programming failure         |          `500` | Do not encode expected domain rejections as server faults.                                                     |

A broad business error such as `InvalidMembership` should be split when clients need different status behavior for duplicate IDs, missing resources, and protected-resource conflicts. Do not force unrelated cases into one status merely because the current scalar error map cannot represent the distinction.

## Compatibility matrix

| Declaration or call                             | Application code     |                     Initial status | Final-filter possibility                         | JSON body                          |
| ----------------------------------------------- | -------------------- | ---------------------------------: | ------------------------------------------------ | ---------------------------------- |
| `app.throw(404, ...)`                           | `404`                |                              `404` | May be revised only by an explicit global policy | `{ code: 404, message }`           |
| Legacy module `SomeError: 1001`                 | `module:1001`        | Existing fallback, currently `500` | Existing filters still apply                     | `{ code: "module:1001", message }` |
| Structured module `{ code: 1001, status: 409 }` | `module:1001`        |                              `409` | Existing filters still apply                     | `{ code: "module:1001", message }` |
| Filter-revised authorization error              | Filter-selected code |             Filter-selected status | Context policy wins                              | `{ code: finalCode, message }`     |

The structured form must improve new or migrated contracts without changing the observable behavior of untouched legacy declarations.

## Delivery and migration phases

### Phase 1: Basic core implementation and release

The Basic core implementation is complete in commit `2bd105ad58`:

- compatibility union for scalar and structured module error declarations;
- descriptor normalization with independent application code and HTTP status;
- status propagation through `fail()` and `throw()`;
- generated scoped error-code typing support; and
- focused runtime and compatibility coverage.

The implementation has passed the focused error tests, Vona type checking, and the complete Basic test suite. The release gate is still open until the corresponding Basic/Vona package version is published. Before publishing:

- prove legacy scalar behavior remains unchanged;
- prove structured declarations produce namespaced business code plus explicit HTTP status;
- prove direct HTTP errors remain unchanged;
- prove locale resolution, JSON serialization, HTML/text handling, and final error filters use the correct values;
- publish the Basic/Vona version containing the complete capability.

### Phase 2: Cabloy Start upgrade

After the Basic release is published, upgrade the Start repository to that version. Do not migrate Start module error declarations in the same dependency-upgrade step. First verify that all existing scalar maps compile and retain their existing runtime behavior.

The upgrade gate is passed only after Start type checking and its existing backend/error tests succeed without local declaration changes.

### Phase 3: Cabloy Start error migration

Inventory each Start module's `config/errors.ts` and existing status wrappers. Migrate one module or coherent error family at a time:

1. identify the intended HTTP status from the endpoint semantics;
2. convert the declaration to `{ code, status }` without renumbering its business code;
3. remove a local `throwConflict`-style workaround only when the core descriptor now supplies the same result;
4. add or update tests for application code, localized message, HTTP status, and relevant final-filter behavior;
5. regenerate affected metadata or consumers only when the source contract requires it;
6. keep unrelated legacy declarations unchanged.

A migrated descriptor may be temporarily reverted to its scalar declaration without renumbering the business code if a release rollback must restore the prior behavior. Such a rollback must be recorded and tested rather than silently changing the API contract.

## Verification gates

The Basic core release must include focused coverage for:

- legacy scalar resolution and fallback status;
- structured descriptor resolution;
- direct numeric HTTP errors;
- module-code namespacing;
- module-localized message lookup;
- `fail()` response status and body;
- `throw()` `Error.code`, `Error.status`, and `Error.message`;
- JSON, HTML, and text response handling;
- final-filter behavior such as unauthenticated `403` to `401` rewriting;
- generated type compatibility for scalar and descriptor maps.

The Start upgrade must run type checking and the existing backend/error test suite before any migration. Each subsequent module migration must verify the endpoint's final application code, localized message, HTTP status, and request-context overrides where applicable.

Verification must also ensure that no local status wrapper remains necessary for a migrated error and that no untouched legacy module changes behavior accidentally.

## Related guidance

- [Resource Public Contract Exposure](./resource-public-contract-exposure.md) — public application-code and runtime-response boundaries.
- [DTO/Model Contract Projection Evolution](./dto-model-contract-projection-evolution.md) — declared contract versus runtime response verification.
- [Vona HTTP Rate Limit Architecture](./vona-http-rate-limit-architecture.md) — deliberate `429` and `503` transport semantics.
- [Resource Mutation Response Contract](../decisions/0007-resource-mutation-response-contract.md) — standard Vona HTTP response ownership.
- [Vona Telemetry Architecture](./vona-telemetry.md) — separation of technical telemetry context from business identifiers.
