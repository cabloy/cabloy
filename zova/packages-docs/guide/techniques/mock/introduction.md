# Mock

Zova provides an out-of-the-box `Mock` mechanism based on [vite-plugin-fake-server](https://github.com/condorheroblog/vite-plugin-fake-server/), which can also support `development environment` and `production environment`

## Create Mock Files

::: tip
Context Menu - [Module Path]: `Zova Create/Mock`
:::

Enter the name of mock according to the prompt, such as `menu`. The VSCode extension will automatically create the code skeleton of `mock`

For example, the module `home-layout` needs to get the menu through the API: `/home/layout/menu/select`, then you can directly provide the corresponding mock file in `home-layout` as follows:

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

- The mock file extension is `.fake.ts`
- The `defineFakeRoute` method is used to support type auto-completion

## Configuration

Mock can be configured through `.env` file.

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

| Name              | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| MOCK_ENABLED      | Whether to enable mock                                      |
| MOCK_LOGGER       | Whether to enable logger                                    |
| MOCK_BASE_NAME    | URL prefix, default is `/api`                               |
| MOCK_BUILD        | Whether to generate an independently deployable fake server |
| MOCK_BUILD_PORT   | The port of fake server                                     |
| MOCK_BUILD_OUTPUT | The output directory of fake server                         |
| MOCK_BUILD_CORS   | Whether to enable `cors`                                    |

## Production environment

By default, the production environment does not generate the fake server. If want fake server to be generated during building, just turn on `MOCK_BUILD` as well.

```bash
$ npm run build
```

- The generated fake server is automatically output to the directory specified by `MOCK_BUILD_OUTPUT`
- For the principle of fake server, see: [vite-plugin-fake-server](https://github.com/condorheroblog/vite-plugin-fake-server/)
