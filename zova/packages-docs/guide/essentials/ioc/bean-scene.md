# Bean Scene

Zova provides a set of decorator functions for declaring that a Bean Class is injectable. Different decorator functions represent different usage scenarios, and they also specify the default injection scope.

- a-bean

| Name        | Description                | Scene      | Default Injection Scope |
| ----------- | -------------------------- | ---------- | ----------------------- |
| @Sys        | Sys Bean                   | sys        | sys                     |
| @Aop        | Aop Bean                   | aop        | sys                     |
| @AopMethod  | AopMethod Bean             | aopMethod  | sys                     |
| @Tool       | Tool Bean                  | tool       | app                     |
| @Controller | Controller Bean            | controller | ctx                     |
| @Render     | Render Bean                | render     | ctx                     |
| @Style      | Style Bean                 | style      | ctx                     |
| @Service    | Service for Component/Page | service    | ctx                     |
| @Bean       | General Service            | bean       | ctx                     |
| @Data       | Data Bean                  | data       | new                     |

- a-command

| Name     | Description  | Scene   | Default Injection Scope |
| -------- | ------------ | ------- | ----------------------- |
| @Command | Command Bean | command | sys                     |

- a-api

| Name       | Description    | Scene     | Default Injection Scope |
| ---------- | -------------- | --------- | ----------------------- |
| @Api       | Api Bean       | api       | app                     |
| @ApiMeta   | ApiMeta Bean   | apiMeta   | app                     |
| @ApiSchema | ApiSchema Bean | apiSchema | app                     |

- a-behavior

| Name      | Description   | Scene    | Default Injection Scope |
| --------- | ------------- | -------- | ----------------------- |
| @Behavior | Behavior Bean | behavior | new                     |

- a-fetch

| Name         | Description      | Scene       | Default Injection Scope |
| ------------ | ---------------- | ----------- | ----------------------- |
| @Interceptor | Interceptor Bean | interceptor | new                     |

- a-meta

| Name  | Description | Scene | Default Injection Scope |
| ----- | ----------- | ----- | ----------------------- |
| @Meta | Meta Bean   | meta  | app                     |

- a-model

| Name   | Description                                          | Scene | Default Injection Scope |
| ------ | ---------------------------------------------------- | ----- | ----------------------- |
| @Model | [Model Bean](../../techniques/model/introduction.md) | model | ctx                     |

- a-style

| Name   | Description                                       | Scene | Default Injection Scope |
| ------ | ------------------------------------------------- | ----- | ----------------------- |
| @Css   | [Css Bean](../../techniques/css-in-js/css.md)     | css   | app                     |
| @Theme | [Theme Bean](../../techniques/css-in-js/theme.md) | theme | app                     |

- a-table

| Name       | Description    | Scene     | Default Injection Scope |
| ---------- | -------------- | --------- | ----------------------- |
| @TableCell | TableCell Bean | tableCell | sys                     |
