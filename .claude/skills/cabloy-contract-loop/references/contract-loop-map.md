# Contract Loop Map

Use this reference when a task crosses the backend/frontend contract boundary.

## Typical triggers

### Backend contract changed

Common examples:

- DTO shape changed
- controller request/response changed
- validation changed
- `@Api.field` or OpenAPI metadata changed
- inferred DTO output changed

Likely next step:

- verify backend OpenAPI output
- regenerate the frontend consumer path

### Frontend consumer drift

Common examples:

- generated SDK no longer matches backend
- schema-driven UI expects old shape
- model or API service types are stale

Likely next step:

- confirm whether backend contract really changed
- regenerate instead of hand-patching

## Module-local OpenAPI generation boundary

When generating a module-local OpenAPI SDK, do not leave the module config effectively unconstrained if the module should only own a narrow resource surface.

Preferred rule:

- set `operations.match` in `openapi.config.ts` so the module generates only the intended API operations

Reason:

- an unconstrained or overly broad generation pass can pull unrelated APIs into the module
- that expands generated SDK files, metadata exports, and downstream type surfaces far beyond the module’s real ownership boundary
- the result may still compile, but it weakens module boundaries and makes maintenance harder

Representative example:

- `zova/src/module/demo-student/cli/openapi.config.ts`
- narrow the generated surface with a matcher such as `operations.match: [/^DemoStudent_*/]`

Practical check after generation:

- confirm the generated API files only contain the intended resource operations
- confirm the module metadata and exports were not polluted by unrelated APIs

## Shared rule

The sequence is usually:

1. change backend contract
2. verify backend contract output
3. regenerate frontend artifacts
4. inspect frontend consumers
5. verify end to end

## Anti-pattern

Do not patch frontend generated artifacts first when the backend contract is the real source of truth.
