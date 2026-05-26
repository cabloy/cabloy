# 页面布局

Zova 可以在`页面路由`中指定需要使用的页面布局组件。如果没有指定，就默认使用`default`布局组件。

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

## 系统布局组件

为了达到开箱即用的效果，系统内置了两个布局组件:`empty`和`default`:

| 名称    | 说明                                                                                        |
| ------- | ------------------------------------------------------------------------------------------- |
| empty   | 空布局，一般用于显示Login等系统页面                                                         |
| default | 默认布局，一般会提供Header、Sidebar、Footer、Content等区块，页面组件通常会在Content区块显示 |

## env配置

`empty`和`default`仅仅是布局组件的占位符。可以通过 env 配置实际的布局组件。

`env/.env`

```txt
LAYOUT_COMPONENT_EMPTY = home-layout:layoutEmpty
LAYOUT_COMPONENT_DEFAULT = home-layout:layoutTabs
```
