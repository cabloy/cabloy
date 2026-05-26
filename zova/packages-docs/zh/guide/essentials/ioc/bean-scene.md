# Bean Scene

Zova 提供了一组装饰器函数，用于声明 Bean Class 是可注入的。不同的装饰器函数代表不同的使用场景，同时也约定了默认的注入范围。

- a-bean

| 名称        | 说明                       | Scene      | 默认注入范围 |
| ----------- | -------------------------- | ---------- | ------------ |
| @Sys        | Sys Bean                   | sys        | sys          |
| @Aop        | Aop Bean                   | aop        | sys          |
| @AopMethod  | AopMethod Bean             | aopMethod  | sys          |
| @Tool       | Tool Bean                  | tool       | app          |
| @Controller | Controller Bean            | controller | ctx          |
| @Render     | Render Bean                | render     | ctx          |
| @Style      | Style Bean                 | style      | ctx          |
| @Service    | Service for Component/Page | service    | ctx          |
| @Bean       | General Service            | bean       | ctx          |
| @Data       | Data Bean                  | data       | new          |

- a-command

| 名称     | 说明         | Scene   | 默认注入范围 |
| -------- | ------------ | ------- | ------------ |
| @Command | Command Bean | command | sys          |

- a-api

| 名称       | 说明           | Scene     | 默认注入范围 |
| ---------- | -------------- | --------- | ------------ |
| @Api       | Api Bean       | api       | app          |
| @ApiMeta   | ApiMeta Bean   | apiMeta   | app          |
| @ApiSchema | ApiSchema Bean | apiSchema | app          |

- a-behavior

| 名称      | 说明          | Scene    | 默认注入范围 |
| --------- | ------------- | -------- | ------------ |
| @Behavior | Behavior Bean | behavior | new          |

- a-fetch

| 名称         | 说明             | Scene       | 默认注入范围 |
| ------------ | ---------------- | ----------- | ------------ |
| @Interceptor | Interceptor Bean | interceptor | new          |

- a-meta

| 名称  | 说明      | Scene | 默认注入范围 |
| ----- | --------- | ----- | ------------ |
| @Meta | Meta Bean | meta  | app          |

- a-model

| 名称   | 说明                                                 | Scene | 默认注入范围 |
| ------ | ---------------------------------------------------- | ----- | ------------ |
| @Model | [Model Bean](../../techniques/model/introduction.md) | model | ctx          |

- a-style

| 名称   | 说明                                              | Scene | 默认注入范围 |
| ------ | ------------------------------------------------- | ----- | ------------ |
| @Css   | [Css Bean](../../techniques/css-in-js/css.md)     | css   | app          |
| @Theme | [Theme Bean](../../techniques/css-in-js/theme.md) | theme | app          |

- a-table

| 名称       | 说明           | Scene     | 默认注入范围 |
| ---------- | -------------- | --------- | ------------ |
| @TableCell | TableCell Bean | tableCell | sys          |
