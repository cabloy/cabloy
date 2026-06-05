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

## Shared rule

The sequence is usually:

1. change backend contract
2. verify backend contract output
3. regenerate frontend artifacts
4. inspect frontend consumers
5. verify end to end

## Anti-pattern

Do not patch frontend generated artifacts first when the backend contract is the real source of truth.
