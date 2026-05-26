# Page Route

When creating a page, the system will automatically create a route record.

```typescript
import { ZPageCounter } from './.metadata/page/counter.js';

export const routes: IModuleRoute[] = [
  {
    name: 'counter',
    path: 'counter/:id?',
    component: ZPageCounter,
  },
];
```

## Route Fields

| Name      | Description            |
| --------- | ---------------------- |
| path      | route's path           |
| name      | route's name           |
| component | route's page component |
| alias     | route's alias          |
| meta      | route's meta fields    |

- meta

| Name             | Type                             | Default      | Description                                                                           |
| ---------------- | -------------------------------- | ------------ | ------------------------------------------------------------------------------------- |
| absolute         | boolean                          | false        | Whether absolute path or not                                                          |
| layout           | string \| false                  | 'default'    | layout component                                                                      |
| requiresAuth     | boolean                          | true         | Whether auth required                                                                 |
| locale           | boolean                          | false        | Whether support multi-language                                                        |
| locales          | map<string,string>               | undefined    | List of supported languages. If empty, the system-provided language list will be used |
| componentKeyMode | 'nameOnly' \| 'withParams'       | 'withParams' | When generating componentKey, is it necessary to include Params?                      |
| componentKey     | function \| string               | auto         | A custom function can be provided to generate componentKey                            |
| tabKey           | function \| string               | auto         | A custom function can be provided to generate tabKey                                  |
| keepAlive        | function \| boolean              | true         | A custom function can be provided to generate keepAlive                               |
| transferCache    | false \| ISsrConfigTransferCache | false        | Whether to set `cache-control` when performing SSR rendering                          |

## path

`path` is the route path, and the system will automatically add the module prefix to generate an absolute path. For example, the route record of the page component `counter` is as follows:

```typescript
export const routes: IModuleRoute[] = [
  //
  { path: 'counter', component: ZPageCounter },
];
```

- Since the page component belongs to the module `demo-student`, its absolute path is: `/demo/student/counter`

## name

If the page has a `params` parameter, then `name` needs to be provided. For example:

```typescript
export const routes: IModuleRoute[] = [
  {
    name: 'counter',
    path: 'counter/:id?',
    component: ZPageCounter,
  },
];
```

## component

`component` refers to a page component. If the component name is `counter`, the system will automatically generate a component wrapper: `ZPageCounter`

## alias

Specify an `alias` for the route. However We cannot specify the route alias in the module's route record, but must specify it in the global config.

- See: [Route Alias](./route-alias.md)

## meta.absolute

`absolute` specifies whether the current path is an absolute path. If it is an absolute path, the module prefix will not be added. For example, one absolute route is defined in the module `home-base`:

```typescript
export const routes: IModuleRoute[] = [
  {
    path: '/:catchAll(.*)*',
    component: ZPageErrorNotFound,
    meta: {
      absolute: true,
      layout: 'empty',
      requiresAuth: false,
    },
  },
];
```

| Name                      | Description                                      |
| ------------------------- | ------------------------------------------------ |
| path: '/:catchAll(.\*)\*' | Catch all unmatched paths and display a 404 page |

## meta.layout

`layout` can specify layout component for this route. If `layout` is not set, the default layout component will be used.

- See: [Layout](./page-layout.md)

## meta.requiresAuth

`requiresAuth` identifies whether the route requires authentication. You can add relevant logic in `Navigation Guards`
