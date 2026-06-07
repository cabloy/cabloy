# Mock Guide

## Why mock matters in Zova

Zova provides an out-of-the-box mock mechanism so frontend development can continue even when a real backend integration path is incomplete or intentionally decoupled.

That matters because page, API, and server-data workflows often need stable response shapes before the final backend contract is available.

## Core mock model

The Zova mock mechanism is based on `vite-plugin-fake-server` and is integrated into the frontend development workflow.

A mock route is typically defined in a `.fake.ts` file inside the relevant module.

## Mock file structure

Representative example:

```typescript
import { defineFakeRoute } from 'vite-plugin-fake-server-turbo/client';

export default defineFakeRoute([
  {
    url: '/home/layout/menu/select',
    method: 'get',
    response: () => {
      return {
        code: 0,
        message: 'Success',
        data: [],
      };
    },
  },
]);
```

Key points:

- mock files use the `.fake.ts` extension
- `defineFakeRoute(...)` provides the route definition shape
- each mock route describes the request path, method, and response

## Where mock files belong

Mocks belong near the frontend module that consumes or defines the route shape.

Representative example:

- `src/suite/a-home/modules/home-layout/mock/menu.fake.ts`

This keeps mock behavior close to the page, API, or business module that depends on it.

## Relationship to frontend APIs and server data

Mocking fits naturally with:

- [API Guide](/frontend/api-guide)
- [Server Data](/frontend/server-data)
- [Page Guide](/frontend/page-guide)

A common workflow is:

1. define or update the frontend page or API contract
2. provide a mock route with the expected response shape
3. build page, component, or model behavior against that mock response
4. later replace the mock-backed path with the real backend contract when ready

## Configuration

Mock behavior is configured through environment variables such as:

- `MOCK_ENABLED`
- `MOCK_LOGGER`
- `MOCK_BASE_NAME`
- `MOCK_BUILD`
- `MOCK_BUILD_PORT`
- `MOCK_BUILD_OUTPUT`
- `MOCK_BUILD_CORS`

These settings control whether mocks are enabled, whether a standalone fake server should be built, and how the mock server behaves.

## Development and production behavior

By default, production builds do not generate the fake server.

If a standalone fake server should be generated during build, `MOCK_BUILD` must be enabled.

That means mock support can be used in development only, or intentionally packaged for separate deployment when needed.

## When to use mock

Use mock when:

- frontend page or API work needs stable response data before the backend is ready
- you want to prototype UI behavior against an expected contract
- you want repeatable local demo or development behavior without a live backend dependency

Do not treat mock as the final source of truth for the contract when a real backend/OpenAPI path already exists.

## Implementation checks for mock-versus-contract decisions

When editing frontend integration paths, ask:

1. is the real backend contract available yet?
2. should this flow use a temporary mock route or a real `$api`/OpenAPI path?
3. does the mock response shape match the intended page, API, or model contract?
4. should mock be enabled only for development, or is a standalone fake server also needed?

That helps AI keep frontend development moving without confusing temporary mock behavior with final backend truth.
