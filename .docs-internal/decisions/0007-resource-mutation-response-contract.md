# ADR 0007: Resource Mutation Response Contract

## Status

Accepted.

## Background

Vona resource controllers delegate mutations to service and model layers. Model update operations can return prepared mutation data and relation-operation details that are useful to internal orchestration. However, that value is not necessarily a canonical, freshly read representation of the persisted resource.

Historically, generated resource controllers returned delegated `update` results directly. Vona's normal body responder serializes a controller return value into the standard JSON success envelope, so this accidentally exposed internal mutation data through the public HTTP API.

The standard Zova resource owner already treats resource update and delete operations as value-less mutations: consumers wait for success and invalidate or reread affected data rather than merging an update result into cache.

## Decision

### Standard resource mutations are command-style actions

Generated resource `update` and `delete` controller actions return `Promise<void>`. They await their service call without returning its result. Custom resource mutation actions, such as `deleteForce`, follow the same convention unless their public contract intentionally requires a payload.

```ts
async update(id: TableIdentity, data: DtoResourceUpdate): Promise<void> {
  await this.scope.service.resource.update(id, data);
}
```

The controller is the public HTTP contract boundary. A service or model may retain and return internal mutation data for backend callers; it must not become a client-facing payload by incidental controller pass-through.

### Successful no-result mutations use the normal Vona response wrapper

Vona keeps its existing success protocol for standard resource command mutations:

```text
HTTP 200
Content-Type: application/json

{ code: 0, message: 'success', data: null }
```

The body responder maps a controller result of `undefined` to `null` inside the normal success envelope. Tests using `app.bean.executor.performAction(...)` receive the unwrapped `null` value and should assert it when verifying the public action contract.

Vona does not adopt HTTP `204 No Content` as the default mutation response. A uniform JSON success envelope keeps controller actions, error handling, and client response processing on one transport protocol.

### Intentional mutation payloads are explicit contracts

An action may return data when consumers need it, for example:

- a response DTO representing canonical post-update state;
- a version token for optimistic concurrency;
- a server-computed result; or
- an asynchronous job handle.

Such an action must declare a deliberate response DTO/schema with `@Api.body(...)`, and use `@Core.serializer()` when serializer transformations define its exposed shape. It must not forward raw ORM mutation data as a substitute for an API DTO.

## Rationale

### Preserve layer responsibilities

- **ORM/model:** owns persistence mechanics and may return mutation-specific data for internal composition.
- **Service:** owns domain orchestration and can preserve an internal operation result.
- **Controller:** chooses the public HTTP and OpenAPI response contract.
- **Body responder:** normalizes no-result completion to the framework's JSON envelope with `data: null`.
- **Zova resource facade:** exposes a value-less mutation to application code and refreshes resource state through its normal query lifecycle.

### Avoid treating mutation input as a resource representation

The ORM update result can include prepared input, automatic fields, and relation-operation data. It does not by itself guarantee a canonical response representation, accurately signal a zero-row update, or remain stable if ORM internals evolve. Requiring an explicit DTO for a payload prevents those implementation details from becoming accidental public API.

### Keep a consistent framework success protocol

HTTP permits both `200 OK` and `204 No Content` for successful update operations. The framework nevertheless chooses `200` with the existing JSON envelope to avoid creating a second success-response protocol for default resource mutations. This is compatible with command-style API design and with existing Zova consumers, which do not rely on mutation payloads.

## Alternatives Considered

### Return the ORM update result from every resource controller

Rejected. It leaks implementation-level mutation data, encourages consumers to treat it as a canonical resource representation, and couples public APIs to ORM behavior.

### Change service and model update methods to return `void`

Rejected. Service/model results can remain useful to internal workflows, relation-aware operations, auditing, and specialized controllers. HTTP response policy belongs at the controller boundary.

### Use HTTP 204 for all no-result mutations

Rejected as the default. It would introduce a bodyless success path alongside Vona's established wrapped JSON response protocol. A future framework-wide transport decision could add explicit 204 support, but it must not be introduced implicitly by generated resource actions.

### Return a freshly reread resource from every update

Rejected as a default. It adds read cost and cache semantics where callers often only need completion. It remains appropriate for an endpoint that deliberately declares a post-mutation DTO response.

## Consequences

### Benefits

- Default resource mutations have clear, value-less public semantics.
- Service and model layers remain free to return useful internal data.
- Generated CRUD controllers and Zova resource behavior align around command-style mutations.
- Tests can distinguish public response semantics (`null`) from persistence verification (read-back assertions).
- Public APIs avoid accidental ORM coupling.

### Trade-offs

- A client that needs canonical post-mutation state must use a subsequent read or a purpose-built response DTO action.
- The default OpenAPI reflection path cannot recover the `void` generic argument from `Promise<void>` at runtime. Command-style resource controllers and CRUD templates therefore declare `@Api.body(z.null())` explicitly. Vona's normal response wrapper emits `data: { type: 'null' }`, and regenerated Zova SDK contracts expose `data: null` rather than `unknown`.

## Implementation note

`@Api.body(z.null())` is metadata for OpenAPI generation and, when enabled, schema-guided serialization. It does not validate response values at runtime, change the body responder, alter HTTP status handling, or constrain service/model methods. The controller's `Promise<void>` signature and `await`-without-`return` body remain the enforcement point that prevents accidental mutation-result exposure.

This contract change follows the forward controller-to-frontend loop: change backend contract source first, regenerate affected frontend consumers, and build the appropriate Zova outputs. No Vona dependency refresh is required because this is not a reverse frontend-to-backend handoff.

## Related Records

- `cabloy-docs/backend/controller-guide.md`
- `cabloy-docs/backend/crud-workflow.md`
- `cabloy-docs/backend/unit-testing.md`
- `cabloy-docs/fullstack/openapi-to-sdk.md`
- `.docs-internal/architecture/resource-public-contract-exposure.md`
