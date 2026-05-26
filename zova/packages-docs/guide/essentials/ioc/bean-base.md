# BeanBase

`BeanBase` is the base class for all beans. By inheriting from `BeanBase`, we can easily access commonly used tools and capabilities when writing code.

`BeanBase` itself provides some built-in members and allows other modules to inject extended members through the `monkey` mechanism.

## Why is Zova's IOC container code more concise?

The reason is to prioritize the use of the `dependency lookup` strategy, resulting in fewer decorator functions and fewer type annotations. Injecting system capability objects into `BeanBase` is one of the mechanisms for implementing `dependency lookup` strategies.

## Built-in Members

| Name     | Description                                                                     |
| -------- | ------------------------------------------------------------------------------- |
| sys      | Sys object                                                                      |
| app      | App object                                                                      |
| ctx      | The Context object which the current bean instance belongs to                   |
| bean     | The bean container which the current bean instance belongs to                   |
| scope    | The Scope object of the module which the current bean instance belongs to       |
| $el      | The dom element of the Vue component which the current bean instance belongs to |
| $event   | Global event object                                                             |
| $ssr     | SSR object                                                                      |
| $useMeta | Meta data for SEO                                                               |

## Page

| Name    | Description             |
| ------- | ----------------------- |
| $params | Typed params parameters |
| $query  | Typed query parameters  |

## Component

| Name   | Description |
| ------ | ----------- |
| $props | props       |

## Extended Members

When a project is created, there will be some modules present in the project, providing us with basic capabilities for further development.

| Name                                                   | Description                                        |
| ------------------------------------------------------ | -------------------------------------------------- |
| [$fetch](../../techniques/server-data/fetch.md)        | Fetch object provided by module `a-fetch`          |
| [$scopeBase](../../essentials/scope/introduction.md)   | Scope object provided by module `home-base`        |
| [$cssBase](../../techniques/css-in-js/css.md)          | Global style object provided by module `home-base` |
| [$queryClient](../../techniques/model/introduction.md) | QueryClient object provided by module `a-model`    |
| [$router](../../page/navigation-guards.md)             | Router object provided by module `a-router`        |
| [$style](../../techniques/css-in-js/style.md)          | Style method provided by module `a-style`          |
| [$theme](../../techniques/css-in-js/theme.md)          | Theme object provided by module `a-style`          |
| [$token](../../techniques/css-in-js/token.md)          | Token object provided by module `a-style`          |

Zova can be used with any UI library and comes with built-in project templates for several UI libraries, making it easy to use out of the box. Different UI libraries will also inject objects into the `BeanBase` base class according to their own needs.

| 名称     | 说明                                            |
| -------- | ----------------------------------------------- |
| $q       | Provided by module `quasar-adapter` of Quasar   |
| $vuetify | Provided by module `vuetify-adapter` of Vuetify |

## BeanBaseSimple

`BeanBase` inherits from `BeanBaseSimple`

### Built-in Members

| Name          | Description     |
| ------------- | --------------- |
| $beanFullName | Bean Identifier |
| $beanOptions  | Bean Options    |
| $onionName    | Onion Name      |
| $onionOptions | Onion Options   |
