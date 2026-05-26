# env

Zova SSR 提供了常用的 env 环境变量，可以非常方便的配置某些功能和特性的表现行为。

## 可配置环境变量

| 名称                         | 说明                                |
| ---------------------------- | ----------------------------------- |
| SSR_COOKIE                   | SSR是否启用Cookie                   |
| SSR_COOKIE_THEMEDARK_DEFAULT | 当SSR_COOKIE为true时ThemeDark缺省值 |
| SSR_BODYREADYOBSERVER        | 是否监测Body元素的加载过程          |
| SSR_API_BASE_URL             | 在服务端访问API用的BaseURL          |
| SSR_PROD_PORT                | SSR生产服务的端口号                 |

## 动态环境变量

以下是根据运行环境动态设定的环境变量：

| 名称   | 说明           |
| ------ | -------------- |
| SSR    | 是否是SSR模式  |
| DEV    | 是否是开发环境 |
| PROD   | 是否是生产环境 |
| CLIENT | 是否是客户端   |
| SERVER | 是否是服务端   |
