# 用户

VonaJS 为了兼顾`开箱即用`与`灵活定制`的架构设计理念，将用户体系分为两个部分：

- 模块`a-user`: 提供通用能力
- 模块`home-user`: 提供定制能力

## a-user: IUser

模块`a-user`提供了接口`IUser`，约定了 User 的基础字段。

```typescript
export interface IUser {
  id: TableIdentity;
  name: string;
  avatar?: string;
  email?: string;
  mobile?: string;
  activated?: boolean;
  locale?: keyof ILocaleRecord | undefined;
  anonymous?: boolean;
}
```

## a-user: bean.user

模块`a-user`提供了全局 Bean `bean.user`，为业务提供了通用的调用规范。

```typescript
// find user
const user = await this.bean.user.findOneById(userId);
// activate user
this.bean.user.activate(user);
```

- `bean.user`方法清单

| 名称              | 说明                                              |
| ----------------- | ------------------------------------------------- |
| activate          | 激活用户                                          |
| register          | 注册用户                                          |
| registerByProfile | 使用profile数据注册用户，profile数据来自OAuth认证 |
| createAnonymous   | 创建匿名用户                                      |
| findOneByName     | 通过`name`查找用户                                |
| findOneById       | 通过`id`查找用户                                  |
| findOne           | 查找用户                                          |
| updateById        | 通过`id`更新用户                                  |
| update            | 更新用户                                          |
| removeById        | 通过`id`删除用户                                  |
| remove            | 删除用户                                          |

## home-user适配器: ServiceUserAdapter

模块`home-user`提供了适配器`ServiceUserAdapter`，允许我们定制用户的操作逻辑。业务代码调用`bean.user`，`bean.user`调用`ServiceUserAdapter`，从而实现了`开箱即用`与`灵活定制`的完美结合。

`src/suite/a-home/modules/home-user/src/service/userAdapter.ts`

| 名称            | 说明                    |
| --------------- | ----------------------- |
| create          | 创建用户                |
| userOfProfile   | 将profile数据转换为user |
| createAnonymous | 创建匿名用户            |
| findOneByName   | 通过`name`查找用户      |
| findOne         | 查找用户                |
| update          | 更新用户                |
| remove          | 删除用户                |
| setActivated    | 设置激活状态            |

## 获取当前用户

### 1. 参数装饰器

```diff
import type { IUser } from 'vona-module-a-user';

class ControllerStudent {
  @Web.get('test')
+ test(@Arg.user() user: IUser) {
    console.log(user);
  }
}
```

### 2. bean.passport

```diff
class ControllerStudent {
  @Web.get('test')
  test() {
+   const user = this.bean.passport.currentUser;
    console.log(user);
  }
}
```

### 3. ctx.user

```diff
class ControllerStudent {
  @Web.get('test')
  test() {
+   const user = this.ctx.user;
    console.log(user);
  }
}
```

## 匿名用户

当匿名用户访问 API 时，系统会自动创建一个匿名 user 对象。

```diff
class ControllerStudent {
  @Web.get('test')
  test(@Arg.user() user: IUser) {
+   console.log(user.anonymous);
  }
}
```

## 注册用户

可以调用`bean.user.register`注册一个新用户，该方法会引发`a-user:register`事件，模块`home-user`监听该事件，从而实现逻辑定制。

`src/suite/a-home/modules/home-user/src/bean/eventListener.register.ts`

```typescript
@EventListener({ match: 'a-user:register' })
class EventListenerRegister {
  async execute(data, next) {
    // next: registered
    const user = (await next()) as IUser;
    // mail: activate
    if (!data.autoActivate && user.email) {
      await this.bean.mailConfirm.emailConfirm(user);
    }
    return user;
  }
}
```

- `@EventListener`: 此装饰器用于实现`事件监听`
- 先调用`next`完成缺省的注册逻辑
- 然后判断是否需要使用 email 激活，如果需要就调用`emailConfirm`方法

| 名称  | 类型                               | 说明         |
| ----- | ---------------------------------- | ------------ |
| match | string\|regexp\|(string\|regexp)[] | 监听哪些事件 |

## 激活用户

可以调用`bean.user.activate`激活用户，该方法会引发`a-user:activate`事件，模块`home-user`监听该事件，从而实现逻辑定制。

`src/suite/a-home/modules/home-user/src/bean/eventListener.activate.ts`

```typescript
@EventListener({ match: 'a-user:activate' })
class EventListenerActivate {
  async execute(data, next) {
    const user = data as IUser;
    if (user.name === 'admin') {
      // role: admin
      const roleAdmin = await this.scope.model.role.get({ name: 'admin' });
      // userRole: admin
      await this.scope.model.roleUser.insert({
        userId: user.id,
        roleId: roleAdmin!.id,
      });
    }
    // next
    return next();
  }
}
```

- 先为用户分配角色
- 然后调用`next`完成缺省的激活逻辑

## 禁用激活操作

在默认情况下，新注册用户需要进行激活操作。

可以在 App Config 中启用`自动激活`配置。

`src/backend/config/config/config.local.ts`

```typescript
// modules
config.modules = {
  'a-user': {
    user: {
      autoActivate: true,
    },
  },
};
```

## 用户: admin

在模块`home-user`的`meta.version`中自动创建`admin`用户。

- 参见：[迁移与变更](../../rest-api/version.md)

`src/suite/a-home/modules/home-user/src/bean/meta.version.ts`

```typescript
async init(options) {
  if (options.version === 1) {
    // user: admin
    await this.bean.auth.authenticate('auth-simple:simple', {
      clientOptions: {
        username: 'admin',
        password: options.password || this.scope.config.passwordDefault.admin,
        avatar: ':emoji:flower',
        confirmed: true,
      },
      state: { intention: 'register' },
      clientName: 'default',
    });
  }
}
```

- `bean.auth.authenticate`: 是模块`a-auth`提供的统一认证方法
- `authenticate`: 该方法会调用`bean.user.register`注册一个新用户

## 默认密码

`admin`用户的默认密码为`123456`，可以在 app config 中修改。

`src/backend/config/config/config.ts`

```typescript
// modules
config.modules = {
  'home-user': {
    passwordDefault: {
      admin: 'xxxxxx',
    },
  },
};
```
