# $fetch

Zova wraps [axios](https://axios-http.com)

## this.$fetch

Zova injects the `$fetch` object into the `BeanBase` base class, allowing any bean instance to access the axios instance through `this.$fetch`

For example, fetching menu data:

```diff
class ControllerTest extends BeanBase {
  async retrieveMenus() {
+   const menus = await this.$fetch.get('/home/base/menu/');
  }
}
```

## app.meta.$fetch

You can also access the axios instance via `app.meta.$fetch`

```diff
async retrieveMenus(app: ZovaApplication) {
+ const menus = await app.meta.$fetch.get('/home/base/menu/');
}
```

## baseURL

`this.$fetch` and `app.meta.$fetch` use the default baseURL, which can be modified through env.

`env/.env`

```txt
API_BASE_URL = http://localhost:7102
API_PREFIX = /api
SSR_API_BASE_URL = $API_BASE_URL
```

In SSR scenarios, the Server and Client may use different baseURL.

## Config

The project's Config can be used to modify the `axios` instance configuration.

`src/front/config/config/config.ts`

```typescript
// modules
config.modules = {
  'a-fetch': {
    axios: {
      config: {},
    },
  },
};
```

## Interceptors

Zova extends `$fetch` capabilities through interceptors. Currently, the following interceptors are built-in:

| Name          | Description                                                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| mock          | Automatically uses mock data when an API call fails                                                                                                 |
| headers       | Automatically adds `locale` and `timezone` headers                                                                                                  |
| jwt           | Automatically adds `Authorization` header; if `accessToken` expires, it automatically uses `refreshToken` to renew                                  |
| performAction | If doing SSR rendering in `Vona`, it can directly execute the backend `performAction` method instead of calling the HTTP API, improving performance |
| body          | Extracts the `data` from AxiosResponse                                                                                                              |
