# BeanBase

`BeanBase` 是所有 bean 的基类。通过继承自`BeanBase`，可以在书写代码时便利的访问到常用的工具和能力。

`BeanBase`本身提供了一些`内置成员`，也允许其他模块通过`monkey`机制注入`扩展成员`

## Zova 的 IOC 容器为何代码更简洁？

原因就是优先使用`依赖查找`策略，从而使用更少的装饰器函数，使用更少的类型标注。向`BeanBase`注入系统能力对象，就是践行`依赖查找策略`的机制之一。

## 内置成员

| 名称     | 说明                                        |
| -------- | ------------------------------------------- |
| sys      | Sys 对象                                    |
| app      | App 对象                                    |
| ctx      | 当前 bean 实例所归属的 Context 对象         |
| bean     | 当前 bean 实例所归属的 bean 容器            |
| scope    | 当前 bean 实例所归属模块的 Scope 对象       |
| $el      | 当前 bean 实例所归属 Vue 组件的 dom element |
| $event   | 全局事件对象                                |
| $ssr     | SSR对象                                     |
| $useMeta | 用于SEO的Meta data                          |

## 页面

| 名称    | 说明                   |
| ------- | ---------------------- |
| $params | params参数，支持类型化 |
| $query  | query参数，支持类型化  |

## 组件

| 名称   | 说明  |
| ------ | ----- |
| $props | props |

## 扩展成员

当创建好一个项目时，项目中就会存在一些模块，为我们进一步开发提供了基础能力。

| 名称                                                   | 说明                                 |
| ------------------------------------------------------ | ------------------------------------ |
| [$fetch](../../techniques/server-data/fetch.md)        | 由模块`a-fetch`提供的fetch对象       |
| [$scopeBase](../../essentials/scope/introduction.md)   | 由模块`home-base`提供的scope对象     |
| [$cssBase](../../techniques/css-in-js/css.md)          | 由模块`home-base`提供的全局样式对象  |
| [$queryClient](../../techniques/model/introduction.md) | 由模块`a-model`提供的queryClient对象 |
| [$router](../../page/navigation-guards.md)             | 由模块`a-router`提供的router对象     |
| [$style](../../techniques/css-in-js/style.md)          | 由模块`a-style`提供的style方法       |
| [$theme](../../techniques/css-in-js/theme.md)          | 由模块`a-style`提供的theme对象       |
| [$token](../../techniques/css-in-js/token.md)          | 由模块`a-style`提供的token对象       |

Zova 可以搭配任何 UI 库使用，并且内置了几款 UI 库的项目模版，便于开箱即用。不同的 UI 库也会根据自身需要向`BeanBase`基类注入对象。

| 名称     | 说明                                 |
| -------- | ------------------------------------ |
| $q       | 由Quasar的模块`quasar-adapter`提供   |
| $vuetify | 由Vuetify的模块`vuetify-adapter`提供 |

## BeanBaseSimple

`BeanBase`继承自`BeanBaseSimple`

### 内置成员

| 名称          | 说明          |
| ------------- | ------------- |
| $beanFullName | Bean标识      |
| $beanOptions  | Bean Options  |
| $onionName    | Onion名称     |
| $onionOptions | Onion Options |
