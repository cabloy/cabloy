## `用户名/密码`认证

模块`auth-simple`提供了开箱即用的`用户名/密码`认证。

## 如何使用

### 1. 注册新用户

```typescript
const jwt = await this.bean.auth.authenticate('auth-simple:simple', {
  clientOptions: {
    username: 'tom',
    password: '123456',
    email: 'xxx@xxx.com',
    avatar: ':emoji:flower',
    confirmed: true,
  },
  state: {
    intention: 'register',
  },
});
```

`confirmed`: 如果为`true`，意味着用户已经确认，不需要后续的`激活`操作。

### 2. 登录

```typescript
const jwt = await this.bean.auth.authenticate('auth-simple:simple', {
  clientOptions: {
    username: 'tom',
    password: '123456',
  },
  state: {
    intention: 'login',
  },
});
```

### 3. 退出登录

```typescript
await this.bean.passport.signout();
```

### 4. 参数配置

模块`auth-simple`采用[password-hash-salt](https://www.npmjs.com/package/password-hash-salt)对 Password 进行 hash 处理。

可以在 App Config 中修改参数配置。

`src/backend/config/config/config.ts`

```typescript
// modules
config.modules = {
  'auth-simple': {
    passwordHash: {
      saltlen: 64,
      iterations: 10000,
      keylen: 64,
      digest: 'sha1',
    },
  },
};
```

## 源码解析

这里对模块`auth-simple`的核心源码进行解析，从而说明如何开发一个新的 Auth Provider。

比如，在模块`auth-simple`中创建一个 Auth Provider: `simple`

### 1. Cli命令

```bash
$ vona :create:bean authProvider simple --module=auth-simple
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Bean/Auth Provider`
:::

## Auth Provider定义

```diff
export interface IAuthProviderSimpleClientRecord extends IAuthProviderClientRecord {}

export interface IAuthProviderSimpleClientOptions extends IAuthProviderClientOptions {
  username?: string;
  password?: string;
  email?: string;
  avatar?: string;
  locale?: keyof ILocaleRecord;
}

export interface IAuthProviderOptionsSimple extends IDecoratorAuthProviderOptions<
  keyof IAuthProviderSimpleClientRecord,
  IAuthProviderSimpleClientOptions
> {}

@AuthProvider<IAuthProviderOptionsSimple>()
class AuthProviderSimple {
  async verify(
    _args,
    clientOptions,
    _options,
    state,
  ) {
    if (state?.intention === 'register') {
      if (!clientOptions.username || !clientOptions.password) return this.app.throw(403);
      // authSimple: create
      const authSimple = await this.scope.service.authSimple.create(clientOptions.password);
      // profile
      const profile: IAuthUserProfile = {
        id: authSimple.id.toString(),
        username: clientOptions.username,
      };
      if (clientOptions.email) {
        profile.emails = [{ value: clientOptions.email }];
      }
      if (clientOptions.avatar) {
        profile.photos = [{ value: clientOptions.avatar }];
      }
      if (clientOptions.locale) {
        profile.locale = clientOptions.locale;
      }
      return profile;
    } else {
      if (!clientOptions.username || !clientOptions.password) return this.app.throw(401);
      // user
      const user = await this.bean.user.findOneByName(clientOptions.username);
      if (!user) return this.app.throw(401);
      // verify
      const profileId = await this.scope.service.authSimple.verifyPassword(user.id, clientOptions.password);
      if (!profileId) return this.app.throw(401);
      // profile
      const profile: IAuthUserProfile = {
        id: profileId.toString(),
      };
      return profile;
    }
  }
}
```

- `IAuthProviderSimpleClientRecord`: 定义多个 Clients，默认有`default`的定义
- `IAuthProviderSimpleClientOptions`: 定义 Client options
- `IAuthProviderOptionsSimple`: 定义 Auth Provider 的参数
- `verify`: 对`register`和`login`进行处理，返回 Profile 数据

## Profile

1. Provider 的`verify`只需返回 Profile 数据。系统将根据 Profile 数据生成 User 对象
2. `register`和`login`返回的 Profile 都必须包含相同的`id`字段值
3. 确保为不同的用户生成唯一的`id`值

Profile 具有统一的接口定义:

```typescript
export interface IAuthUserProfile {
  id: string;
  username?: string;
  displayName?: string;
  name?: IAuthUserProfileName;
  gender?: string; // male/female
  profileUrl?: string;
  emails?: IAuthUserProfilePropSlice[];
  photos?: IAuthUserProfilePropSlice[];
  locale?: keyof ILocaleRecord;
  confirmed?: boolean;
}
```

- `confirmed`: 如果为`true`，意味着用户已经确认，不需要后续的`激活`操作
