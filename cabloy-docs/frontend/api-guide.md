# API Guide

This guide explains how `$api` works in Zova within the Cabloy monorepo.

## What `$api` is for

Zova provides business-oriented API services on top of lower-level request access.

That means frontend code does not need to scatter raw request details everywhere. Instead, API calls can be encapsulated into named services that match business intent.

## Create an API service

Example: create an API service named `menu` in module `training-student`.

```bash
npm run zova :create:bean api menu -- --module=training-student
```

## API definition

Representative pattern:

```typescript
export interface ApiMenuRetrieveMenusResult {
  title: string;
  link: string;
}

@Api()
export class ApiMenu extends BeanApiBase {
  retrieveMenus() {
    return this.$fetch.get<any, ApiMenuRetrieveMenusResult>('/home/base/menu/');
  }
}
```

This shows the intended layering clearly:

- `$fetch` handles the lower-level request
- the API service exposes a business-oriented method such as `retrieveMenus()`

If the lower-level request path itself needs transport middleware such as headers, JWT handling, mock fallback, SSR short-circuiting, or response normalization, see [Fetch Interceptor Guide](/frontend/fetch-interceptor-guide).

API is also one of the core module-scope resource categories; see [Module Scope](/frontend/module-scope).

## Using the API through module scope

Typical pattern:

```typescript
class ControllerTest {
  async retrieveMenus() {
    const menus = await this.scope.api.menu.retrieveMenus();
  }
}
```

## Cross-module API access

Cross-module usage is also supported through scope injection.

Representative pattern:

```typescript
@UseScope()
$$scopeTrainingStudent: ScopeModuleTrainingStudent;

const menus = await this.$$scopeTrainingStudent.api.menu.retrieveMenus();
```

## Built-in `$api` access

The framework also supports accessing certain API services through `this.$api` on bean instances.

Representative pattern:

```typescript
const menus = await this.$api.homeBaseMenu.retrieveMenus({
  params: { publicPath: '' },
});
```

## Implementation checks for frontend data-access changes

When adding frontend data access, avoid jumping straight from UI code to ad hoc request logic.

A better default is:

1. decide whether the request belongs in a named API service
2. create or reuse that API service
3. let pages, components, or models consume the API service instead of duplicating request details

That keeps the frontend code more business-oriented and easier to evolve.

When the backend contract is not ready yet, a temporary frontend-side mock route may be the right bridge; see [Mock Guide](/frontend/mock-guide).
