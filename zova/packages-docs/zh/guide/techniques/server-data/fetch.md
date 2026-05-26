# $fetch

Zova 对[axios](https://axios-http.com)进行了封装。

## this.$fetch

Zova 在`BeanBase`基类中注入了`$fetch`对象，从而可以在任何 bean 实例中通过`this.$fetch`访问`axios`实例。

比如，获取菜单数据：

```diff
class ControllerTest extends BeanBase {
  async retrieveMenus() {
+   const menus = await this.$fetch.get('/home/base/menu/');
  }
}
```

## app.meta.$fetch

也可以在 bean 实例的外部通过`app.meta.$fetch`访问`axios`实例。

```diff
async retrieveMenus(app: ZovaApplication) {
+ const menus = await app.meta.$fetch.get('/home/base/menu/');
}
```

## baseURL

`this.$fetch`和`app.meta.$fetch`使用缺省的 baseURL，可通过 env 修改。

`env/.env`

```txt
API_BASE_URL = http://localhost:7102
API_PREFIX = /api
SSR_API_BASE_URL = $API_BASE_URL
```

在 SSR 场景，Server 与 Client 可能采用不同的 baseURL。

## Config配置

可以使用项目级别的 Config 修改`axios`实例的配置。

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

## 拦截器

Zova 通过拦截器来扩展$fetch 的能力。目前，内置如下拦截器：

| 名称          | 说明                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------- |
| mock          | 当API调用失败时自动使用mock数据                                                                |
| headers       | 自动添加`locale`和`timezone`头部信息                                                           |
| jwt           | 自动添加Authorization头部数据；如果accessToken过期自动使用refreshToken续期                     |
| performAction | 如果在Vona中进行SSR渲染，可以直接执行后端的performAction方法，而不是调用HTTP API，从而提升性能 |
| body          | 从AxiosResponse中拆解出data数据                                                                |
