# 页面路由

在创建页面时，系统会自动创建一条路由记录。

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

## 路由字段

| 名称      | 说明       |
| --------- | ---------- |
| path      | 路由路径   |
| name      | 路由名称   |
| component | 页面组件   |
| alias     | 路由别名   |
| meta      | 路由元数据 |

- meta

| 名称             | 类型                             | 缺省值       | 说明                                               |
| ---------------- | -------------------------------- | ------------ | -------------------------------------------------- |
| absolute         | boolean                          | false        | 是否为绝对路径                                     |
| layout           | string \| false                  | 'default'    | 布局组件                                           |
| requiresAuth     | boolean                          | true         | 是否需要认证                                       |
| locale           | boolean                          | false        | 是否支持多语言                                     |
| locales          | map<string,string>               | undefined    | 支持的多语言清单，如果为空则使用系统提供的语言清单 |
| componentKeyMode | 'nameOnly' \| 'withParams'       | 'withParams' | 在生成componentKey时是否需要带上Params             |
| componentKey     | function \| string               | auto         | 可提供生成componentKey的自定义函数                 |
| tabKey           | function \| string               | auto         | 可提供生成tabKey的自定义函数                       |
| keepAlive        | function \| boolean              | true         | 可提供生成keepAlive的自定义函数                    |
| transferCache    | false \| ISsrConfigTransferCache | false        | 在进行SSR渲染时是否设置`cache-control`             |

## path

`path`是路由路径，系统会自动添加模块前缀，生成绝对路径。比如，页面组件`counter`的路由记录如下：

```typescript
export const routes: IModuleRoute[] = [
  //
  { path: 'counter', component: ZPageCounter },
];
```

- 由于该页面组件属于模块`demo-student`，其绝对路径就是: `/demo/student/counter`

## name

如果页面有`params`参数，那么就需要提供`name`。比如：

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

`component`就是页面组件。如果组件名称为`counter`，那么系统就会自动生成一个组件 Wrapper: `ZPageCounter`

## alias

可以为路由指定别名。但是不能在模块的路由记录中指定路由别名，而是必须在全局 Config 中指定。

- 参见：[路由别名](./route-alias.md)

## meta.absolute

`absolute`指定当前 path 是否为绝对路径。如果是绝对路径就不会添加模块前缀。比如，在模块`home-base`中定义了 1 个绝对路由：

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

| 名称                      | 说明                            |
| ------------------------- | ------------------------------- |
| path: '/:catchAll(.\*)\*' | 捕获所有未匹配路径，显示404页面 |

## meta.layout

`layout`可以为该路由指定布局组件，如果不设置`layout`就会使用默认的布局组件。

- 参见：[页面布局](./page-layout.md)

## meta.requiresAuth

`requiresAuth`标识该路由是否需要认证，可以在`导航守卫`中添加相关的逻辑。
