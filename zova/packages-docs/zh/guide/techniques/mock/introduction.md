# Mock

Zova 基于[vite-plugin-fake-server](https://github.com/condorheroblog/vite-plugin-fake-server/)提供了开箱即用的`Mock`机制，可同时支持`开发环境`和`生产环境`

## 创建Mock文件

::: tip
右键菜单 - [模块路径]: `Zova Create/Mock`
:::

依据提示输入 mock 的名称，比如`menu`，VSCode 插件会自动添加 mock 的代码骨架。

比如，模块 home-layout 需要通过 API：`/home/layout/menu/select`获取菜单，那么可以直接在 home-layout 中提供对应的 mock 文件如下：

`src/suite/a-home/modules/home-layout/mock/menu.fake.ts`

```typescript
import { defineFakeRoute } from 'vite-plugin-fake-server-turbo/client';

export default defineFakeRoute([
  {
    url: '/home/layout/menu/select',
    method: 'get',
    response: () => {
      return {
        code: 0,
        message: 'Success',
        data: [],
      };
    },
  },
]);
```

- 文件后缀名是`.fake.ts`
- 使用`defineFakeRoute`方法是为了支持类型智能提示

## 配置

可以通过`.env`文件配置 mock。

`env/.env`

```txt
MOCK_ENABLED = true
MOCK_LOGGER = false
MOCK_BASE_NAME = $API_PREFIX
MOCK_BUILD = false
MOCK_BUILD_PORT = 8888
MOCK_BUILD_OUTPUT = dist-mock
MOCK_BUILD_CORS = true
```

| 名称              | 说明                         |
| ----------------- | ---------------------------- |
| MOCK_ENABLED      | 是否启用mock                 |
| MOCK_LOGGER       | 是否启用logger               |
| MOCK_BASE_NAME    | url前缀，默认是`/api`        |
| MOCK_BUILD        | 是否生成独立可部署的fake服务 |
| MOCK_BUILD_PORT   | fake服务的端口号             |
| MOCK_BUILD_OUTPUT | fake服务的输出目录           |
| MOCK_BUILD_CORS   | 是否启用`cors`跨域支持       |

## 生产环境

默认情况下，生产环境并不生成 fake 服务。如果需要在进行构建时生成 fake 服务，只需开启`MOCK_BUILD`即可。

```bash
$ npm run build
```

- 生成的 fake 服务自动输出到`MOCK_BUILD_OUTPUT`指定的目录中
- fake 服务的工作原理，请参见：[vite-plugin-fake-server](https://github.com/condorheroblog/vite-plugin-fake-server/)
