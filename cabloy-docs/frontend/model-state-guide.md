# Model State Guide

This page migrates the highest-value parts of the legacy Zova model/state-management documentation for server data.

## Why the model layer exists

Zova uses model-based state management on top of API access so remote data can participate in a more unified caching and usage model.

The legacy docs emphasized that this improves runtime performance and developer experience by building on top of TanStack Query rather than exposing only raw request flows.

## Create a model

Example: create a model named `menu` in module `demo-student`.

```bash
npm run zova :create:bean model menu -- --module=demo-student
```

## Model definition

Representative pattern:

```typescript
@Model()
export class ModelMenu {
  retrieveMenus() {
    return this.$useStateData({
      queryKey: ['retrieveMenus'],
      queryFn: async () => {
        return await this.$api.homeBaseMenu.retrieveMenus({
          params: { publicPath: '' },
        });
      },
    });
  }
}
```

This pattern is important because it shows that model logic is not just local state. It is also the place where cached remote data becomes a reusable abstraction.

## Using a model

Representative pattern:

```typescript
@Use()
$$modelMenu: ModelMenu;

protected render() {
  const { data, error } = this.$$modelMenu.retrieveMenus();
  if (error) return <div>{error.message}</div>;
  return <div>{data}</div>;
}
```

## Relationship to the server-data ladder

In the new docs, think about the layers like this:

- `$fetch` → direct request access
- `$api` → business-oriented service methods
- `Model` → cached, reusable, UI-friendly remote state

That makes the model layer one of the most important bridges between backend contracts and frontend rendering.

## Why this matters for AI workflows

When AI sees repeated frontend data usage, caching concerns, or UI state that depends on remote data, it should ask whether the right abstraction is a model instead of a direct API call in the page.

That usually leads to cleaner SSR behavior, cleaner reuse, and a more Cabloy-native structure.
