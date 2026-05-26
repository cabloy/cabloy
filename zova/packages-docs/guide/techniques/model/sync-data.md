# Sync Data

Zova uses TanStack Query's data management mechanism to manage synchronous data, making it easier for us to write and read synchronous data in cookies and localstorage, and also to directly manage memory-based state data.

Below, we demonstrate how to manage user data in Model.

- For complete code examples, see:
  - [home-user](https://github.com/zovajs/zova/blob/main/zova-dev/src/suite/a-home/modules/home-user/src/bean/model.user.ts)
  - [a-style](https://github.com/zovajs/zova/blob/main/zova-dev/src/suite-vendor/a-zova/modules/a-style/src/bean/bean.theme.ts)

## Create Model Bean

::: tip
Context Menu - [Module Path]: `Zova Create/Bean: Model`
:::

Enter the name of model bean according to the prompt, such as `user`. The VSCode extension will automatically create the code skeleton of `model bean`

`demo-basic/src/bean/model.user.ts`

```typescript
import { Model } from 'zova';
import { BeanModelBase } from 'zova-module-a-model';

@Model()
export class ModelUser extends BeanModelBase {}
```

- Use `@Model` decorator
- Inherited from base class `BeanModelBase`

## localstorage

Since the server does not support `window.localStorage`, the localstorage state data does not participate in the SSR hydration process.

The following demonstrates storing user information in localstorage, and the state will be retained when the page is refreshed.

### How to define

```typescript
export class ModelUser extends BeanModelBase {
  user?: ApiUserEntity;

  protected async __init__() {
    this.user = this.$useStateLocal({
      queryKey: ['user'],
    });
  }
}
```

- Unlike `async data` definition, `sync data` is defined directly in the initialization method `__init__`
- Invoke `$useStateLocal` to create a Query object
- Pass in `queryKey` to ensure the uniqueness of the local cache

### How to use

Read and set data directly like regular variables.

```typescript
const user = this.user;
this.user = newUser;
```

## cookie

Cookies in `Request Header` are automatically used on the server side, and `document.cookie` is automatically used on the client side, thus automatically ensuring the consistency of cookie state data during SSR hydration.

The following demonstrates storing the user Token in a cookie, and the state will be retained when the page is refreshed. Thus, in SSR mode, both the client and the server can use the same `jwt token` to access the backend API services.

### How to define

```typescript
export class ModelUser extends BeanModelBase {
  token?: string;

  protected async __init__() {
    this.token = this.$useStateCookie({
      queryKey: ['token'],
    });
  }
}
```

- Unlike `async data` definition, `sync data` is defined directly in the initialization method `__init__`
- Invoke `$useStateCookie` to create a Query object
- Pass in `queryKey` to ensure the uniqueness of the local cache

### How to use

Read and set data directly like regular variables.

```typescript
const token = this.token;
this.token = newToken;
```

## memory

In SSR mode, the global state data defined by the server will be synchronized to the client and automatically complete the hydration.

The following demonstrates the memory-based global state data.

### How to define

`zova-ui-quasar/src/suite-vendor/a-quasar/modules/quasar-adapter/src/bean/model.theme.ts`

```typescript
export class ModelTheme extends BeanModelBase {
  cBrand: string;

  protected async __init__() {
    this.cBrand = this.$useStateMem({
      queryKey: ['cBrand'],
    });
  }
}
```

- Unlike `async data` definition, `sync data` is defined directly in the initialization method `__init__`
- Invoke `$useStateMem` to create a Query object
- Pass in `queryKey` to ensure the uniqueness of the local cache

### How to use

Read and set data directly like regular variables.

```typescript
const cBrand = this.cBrand;
this.cBrand = newValue;
```
