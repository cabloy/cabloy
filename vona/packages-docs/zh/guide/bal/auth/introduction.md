# 认证体系

模块`a-auth`提供了通用的认证体系，使用`Auth Provider`支持各种认证方式。

## 特性

- `Auth Provider`：使用`Auth Provider`支持各种认证方式，如：用户名/密码认证、OAuth 认证，等等
- `Clients`：同一个 Provider 可以提供多个凭证
- `关联认证`：可以为同一个用户关联多个认证方式
- `迁移认证`：可以将一个用户的认证方式迁移到另一个用户

## bean.auth

模块`a-auth`提供了全局 Bean `bean.auth`，可以通过统一的方式使用所有 Provider 提供的认证能力。

- 举例：`用户名/密码`认证

```typescript
class ControllerStudent {
  @Web.get('login')
  @Passport.public()
  async login() {
    const jwt = await this.bean.auth.authenticate('auth-simple:simple', {
      clientOptions: { username: 'admin', password: '123456' },
    });
    return jwt;
  }
}
```

- 举例：`OAuth`认证

```typescript
class ControllerStudent {
  @Web.get('login')
  @Passport.public()
  async login() {
    await this.bean.auth.authenticate('auth-oauth:oauth', { clientName: 'github', state: { redirect: '/' } });
  }
}
```

## 设置OAuth认证凭据

以`OAuth`认证为例，在 App Config 中设置认证凭据。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  authProvider: {
    'auth-oauth:oauth': {
      clients: {
        github: {
          clientID: 'xxxxxx',
          clientSecret: 'xxxxxxx',
        },
      },
    },
  },
};
```

- `clients.github`: 一个 Provider 可以设置多个 Clients，当前内置了`github`

### 如何添加新的OAuth Client凭据

以添加`google`为例：

1. 安装对应的 Strategy npm 库

```bash
$ pnpm add passport-google-oauth20 -w
```

2. 采用接口合并机制添加 Client 类型定义

在 VSCode 编辑器中，输入代码片段`recordauthclient`，自动生成代码骨架:

```typescript
declare module 'vona-module-x-x' {
  export interface IAuthProvider_xxx_ClientRecord {
    : never;
  }
}
```

调整代码:

```typescript
declare module 'vona-module-auth-oauth' {
  export interface IAuthProviderOauthClientRecord {
    google: never;
  }
}
```

3. 在 App Config 中设置认证凭据，指定对应的`Strategy`

```typescript
import StrategyGoogle from 'passport-google-oauth20';

// onions
config.onions = {
  authProvider: {
    'auth-oauth:oauth': {
      clients: {
        github: {
          clientID: 'xxxxxx',
          clientSecret: 'xxxxxxx',
        },
        google: {
          Strategy: StrategyGoogle,
          clientID: 'yyyyyy',
          clientSecret: 'yyyyyyy',
        },
      },
    },
  },
};
```

## OAuth认证Callback URL

在使用 OAuth 认证时，需要在 OAuth 网站提供系统的 Callback URL。

VonaJS 提供了统一的 Callback URL 值，并且在开发阶段直接输出在控制台，方便我们直接使用。

![](../../../assets/img/bal/auth-1.png)

## bean.auth.authenticate

### 方法定义

```typescript
async authenticate<T extends keyof IAuthProviderRecord>(
  authProviderName: T,
  options?: IAuthenticateOptions<IAuthProviderRecord[T]>,
): Promise<IJwtToken | undefined>{}
```

### 返回值

- 对于不需要 redirect 的认证方式，当认证成功后返回 jwt token
- 对于需要 redirect 的认证方式，当认证成功后直接转向 redirect

### 参数

| 名称                  | 说明                                              |
| --------------------- | ------------------------------------------------- |
| authProviderName      | Provider名称                                      |
| options.clientName    | Client名称，缺省为`default`                       |
| options.clientOptions | Client选项，不同的Provider有各自不同的Options定义 |
| options.state         | 本次认证的状态值                                  |

- options.clientOptions

对于 OAuth 认证，有以下基本字段：

| 名称         | 说明               |
| ------------ | ------------------ |
| clientID     | 凭证ID             |
| clientSecret | 凭证密钥           |
| scope        | 授权范围           |
| confirmed    | 用户是否为确认状态 |

::: tip
`confirmed`: 一般而言，对于新用户，如果 OAuth 认证返回了有效的 email，可以认为`confirmed=true`，从而不必执行后续的`用户激活`操作。根据业务的需求，可以灵活定制`confirmed`的判断规则
:::

- options.state

| 名称      | 类型                                              | 说明                          |
| --------- | ------------------------------------------------- | ----------------------------- |
| intention | 'register' \| 'login' \| 'associate' \| 'migrate' | 本次认证的意图，默认为`login` |
| redirect  | string \| undefined                               | 本次认证成功后需要转向的 URL  |

::: tip
`redirect`: OAuth 认证成功后会返回`code`值，该值会附加到 URL Query 中，形如：`/?x-vona-oauth-code=xxxxxx`

前端取得`x-vona-oauth-code`值，再调用后端 api 换取`jwt token`
:::

## Passport API

模块`home-user`提供了一组`开箱即用`的 Passport API，也可以在此基础之上扩展自定义的业务逻辑。

`src/suite/a-home/modules/home-user/src/controller/passport.ts`

| 名称                          | 说明                                                |
| ----------------------------- | --------------------------------------------------- |
| current                       | 获取当前Passport                                    |
| logout                        | 退出登录                                            |
| register                      | 注册新用户                                          |
| login                         | 登录                                                |
| loginOauth                    | OAuth认证                                           |
| associate                     | 关联认证                                            |
| migrate                       | 迁移认证                                            |
| createPassportJwtFromOauthCode | 使用 OAuth 认证返回的 code 换取 jwt token 和 Passport |
| refreshAuthToken              | 使用 refreshToken 刷新 authToken                    |
| createTempAuthToken           | 创建临时 authToken                                  |
