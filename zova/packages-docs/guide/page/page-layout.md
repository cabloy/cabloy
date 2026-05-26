# Page Layout

Zova allows you to specify which page layout component to use in the `page routes`. If not specified, the `default` layout component will be used by default.

```diff
export const routes: IModuleRoute[] = [
  {
    path: 'counter',
    component: ZPageCounter,
    meta: {
+     layout: 'default',
    },
  },
];
```

## System Layout Components

To provide an out-of-the-box experience, the system includes two built-in layout components: `empty` and `default`:

| Name    | Description                                                                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| empty   | Empty layout, generally used for displaying system pages like Login                                                                                     |
| default | Default layout, usually provides sections such as Header, Sidebar, Footer, and Content, with page components typically displayed in the Content section |

## env

`empty` and `default` are merely placeholders for layout components. You can configure the actual layout components through the env configuration.

`env/.env`

```txt
LAYOUT_COMPONENT_EMPTY = home-layout:layoutEmpty
LAYOUT_COMPONENT_DEFAULT = home-layout:layoutTabs
```
