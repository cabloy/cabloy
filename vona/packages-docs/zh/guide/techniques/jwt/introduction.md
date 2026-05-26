# JWT

VonaJS 基于[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)提供了强大而灵活的 JWT。

## App Config

可以在 App Config 中进行 JWT 配置：

`src/backend/config/config/config.ts`

```typescript
// modules
config.modules = {
  'a-jwt': {
    tempAuthToken: {
      signOptions: { expiresIn: 5 * 60 },
    },
    base: {
      secret: undefined,
      signOptions: { issuer: env.APP_NAME },
      verifyOptions: { issuer: env.APP_NAME },
    },
    clients: {
      access: {
        signOptions: { expiresIn: 2 * 60 * 60 },
      },
      refresh: {
        signOptions: { expiresIn: 7 * 24 * 60 * 60 },
      },
    },
  },
};
```

| 名称          | 说明                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------- |
| tempAuthToken | 临时accessToken的配置                                                                         |
| base          | 基础配置，为所有Clients提供通用的基础配置                                                     |
| clients       | 配置多个Clients。系统提供了内置的`access/refresh` Clients，用于生成`accessToken/refreshToken` |

- `signOptions`: 参见: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)

## 添加新Client

下面通过添加新 Client 解释 Client 的配置。

### 1. 添加类型定义

采用接口合并机制添加新 Client 的类型定义，比如`test`，为测试场景生成 JWT token。

在 VSCode 编辑器中，输入代码片段`recordjwtclient`，自动生成代码骨架:

```typescript
declare module 'vona-module-a-jwt' {
  export interface IJwtClientRecord {
    : never;
  }
}
```

调整代码，然后添加`test`

```diff
declare module 'vona-module-a-jwt' {
  export interface IJwtClientRecord {
+   test: never;
  }
}
```

### 2. 增加Client配置

`src/backend/config/config/config.ts`

```typescript
// modules
config.modules = {
  'a-jwt': {
    clients: {
      test: {
        secret: 'xxxx',
        signOptions: { expiresIn: 2 * 60 * 60 },
      },
    },
  },
};
```

- `secret`: 可以为 Client 提供独立的`secret`值
  - 如果为空，则使用`base.secret`值
  - 如果`base.secret`也为空，则使用`this.app.config.server.keys[0]`

### 3. SERVER_KEYS

`env/.env`

```typescript
# server

SERVER_KEYS = vona__1596889047267_3245
```

`src/backend/config/config/config.ts`

```typescript
// server
config.server = {
  keys: (env.SERVER_KEYS || '').split(','),
};
```

## 获取JWT Client实例

```typescript
class ControllerStudent {
  @Web.get('test')
  async test() {
    const jwtAccess = this.bean.jwt.get('access');
    const jwtRefresh = this.bean.jwt.get('refresh');
    const jwtTest = this.bean.jwt.get('test');
  }
}
```

## 生成accessToken

```typescript
class ControllerStudent {
  @Web.get('test')
  async test() {
    const jwtAccess = this.bean.jwt.get('access');
    const accessToken = await jwtAccess.sign({ userId: '1' });
  }
}
```

## 生成JWT Tokens

可以同时生成`accessToken/refreshToken`

```typescript
class ControllerStudent {
  @Web.get('test')
  async test() {
    const jwtTokens = await this.bean.jwt.create({ userId: '1' });
    console.log(jwtTokens);
  }
}
```

如下图所示：

![](../../../assets/img/jwt/jwt-1.png)

## 生成临时accessToken

在一些场景中，需要在 URL Query 中使用 accessToken。这时就需要生成临时 accessToken。临时 accessToken 的`expiresIn`比常规 accessToken 小，因而更加安全。

生成临时 accessToken 有两种方式:

- `方式1`

```typescript
class ControllerStudent {
  @Web.get('test')
  async test() {
    const jwtAccess = this.bean.jwt.get('access');
    const accessToken = await jwtAccess.sign({ userId: '1' }, { temp: true });
  }
}
```

- `方式2`

```typescript
class ControllerStudent {
  @Web.get('test')
  async test() {
    const accessToken = await this.bean.jwt.createTempAuthToken({ userId: '1' });
  }
}
```

## JWT校验

```diff
class ControllerStudent {
  @Web.get('test')
  async test() {
    const jwtAccess = this.bean.jwt.get('access');
    const accessToken = await jwtAccess.sign({ userId: '1' });
+   const payload = await jwtAccess.verify(accessToken);
    assert.deepEqual(payload, { userId: '1' });
  }
}
```
