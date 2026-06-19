# Server Data

This guide explains the server-data abstraction layers in Zova within the Cabloy monorepo.

## Why this layer exists

Zova provides several levels of abstraction for accessing server data.

The point is not to force one access style for every problem. The point is to let developers choose the right level of abstraction for the current business need while still staying within a coherent framework model.

## The abstraction ladder

These layers define the server-data abstraction ladder:

| Name          | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| `$fetch`      | low-level request wrapper                                       |
| `$api`        | business-oriented API services on top of `$fetch`               |
| `Model`       | remote-data state and caching patterns on top of service access |
| `OpenAPI SDK` | generated client SDK based on backend Swagger/OpenAPI metadata  |
| `$apiSchema`  | direct access to API schema metadata                            |
| `$sdk`        | more generalized schema-driven access using model patterns      |

## How to think about the layers

### `$fetch`

Use `$fetch` when you need a relatively direct HTTP-oriented access path.

When the transport concern itself needs framework-level handling such as auth headers, response-envelope normalization, SSR short-circuiting, or mock fallback, read [Fetch Interceptor Guide](/frontend/fetch-interceptor-guide) together with this page.

### `$api`

Use `$api` when you want business-oriented service access rather than scattering request details across pages and components.

### `Model`

Use model-based patterns when caching, shared remote state, and a more unified usage model matter.

### `OpenAPI SDK`

Use OpenAPI SDK generation when you want backend-generated API contracts to drive frontend calling patterns more directly.

### `$apiSchema` and `$sdk`

Use schema-driven layers when metadata itself needs to participate in higher-level frontend behavior such as validation or automatic rendering.

## Why this matters for Cabloy

This abstraction ladder is one of the key links between Zova and Vona.

Vona emits backend-side metadata and OpenAPI information.
Zova can consume that information through SDK and schema-driven layers.

That makes server data a core fullstack integration topic, not just a frontend utility topic.

A practical contract-consumption reading is:

- [OpenAPI Guide](/backend/openapi-guide) explains backend contract emission
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk) explains the fullstack contract bridge
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide), [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen), [API Schema Guide](/frontend/api-schema-guide), and [SDK Guide](/frontend/sdk-guide) explain different frontend consumption layers
- [A-OpenAPI Under the Hood](/frontend/a-openapi-under-the-hood) explains the lower-level runtime behind `$sdk`, bootstrap, permissions, and schema extraction

## Implementation checks for frontend data-loading changes

When adding frontend data access, avoid jumping straight to ad hoc request logic.

Instead, it should ask:

1. is `$fetch` enough?
2. should this be a business-oriented `$api` service?
3. should this become model-managed state?
4. is there already an OpenAPI or schema-driven route for this integration?

That decision usually produces cleaner, more Cabloy-native code.

When the real backend contract is temporarily unavailable, frontend-side mocks can provide a short-lived bridge for page, API, or model development; see [Mock Guide](/frontend/mock-guide).
