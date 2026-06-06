# API Guide

This guide explains how `$api` works in Zova within the Cabloy monorepo.

## What `$api` is for

Zova provides business-oriented API services on top of lower-level request access.

That means frontend code does not need to scatter raw request details everywhere. Instead, API calls can be encapsulated into named services that match business intent.

## Create an API service

Example: create an API service named `menu` in module `demo-student`.

```bash
npm run zova :create:bean api menu -- --module=demo-student
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
$$scopeDemoStudent: ScopeModuleDemoStudent;

const menus = await this.$$scopeDemoStudent.api.menu.retrieveMenus();
```

## Built-in `$api` access

The framework also supports accessing certain API services through `this.$api` on bean instances.

Representative pattern:

```typescript
const menus = await this.$api.homeBaseMenu.retrieveMenus({
  params: { publicPath: '' },
});
```

## Why this matters for AI workflows

When AI adds frontend data access, it should avoid jumping straight from UI code to ad hoc request logic.

A better default is:

1. decide whether the request belongs in a named API service
2. create or reuse that API service
3. let pages, components, or models consume the API service instead of duplicating request details

That keeps the frontend code more business-oriented and easier to evolve.
