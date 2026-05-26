# 通行证

当用户访问后端 API 时，系统会校验 jwt token，如果校验通过就会创建一个通行证`Passport`。该通行证包含`当前用户`和`认证`等信息。

## a-user: IPassport

模块`a-user`提供了接口`IPassport`，约定了 Passport 的基础字段。

```typescript
export interface IPassport {
  user?: IUser;
  auth?: IAuth;
  roles?: IRole[];
}
```

## a-user: bean.passport

模块`a-user`提供了全局 Bean `bean.passport`，为业务提供了通用的调用规范。

```typescript
// get the current passport
const passport = this.bean.passport.current;
// mock signin for test
this.bean.passport.signinMock();
```

- `bean.passport`方法清单

| 名称                | 说明                                                   |
| ------------------- | ------------------------------------------------------ |
| isAuthenticated     | 判断当前用户是否已认证（不是匿名用户）                 |
| isActivated         | 判断当前用户是否已激活                                 |
| isAdmin             | 判断当前用户是否是`admin`身份                          |
| setCurrent          | 设置当前Passport                                       |
| getCurrent          | 获取当前Passport                                       |
| getCurrentUser      | 获取当前用户                                           |
| getCurrentAuth      | 获取当前认证                                           |
| getCurrentRoles     | 获取当前角色                                           |
| signin              | 完成passport的登录逻辑，返回jwt token                  |
| signout             | 退出登录                                               |
| signinSystem        | 以某个系统用户的身份实现登录                           |
| signinMock          | 模拟登录，用于测试场景                                 |
| signinWithAnonymous | 以匿名用户的身份实现登录                               |
| kickOut             | 踢出用户                                               |
| checkAuthToken      | 对jwt token进行校验，校验通过后创建Passport            |
| refreshAuthToken    | 刷新jwt token                                          |
| createTempAuthToken | 生成临时jwt token，过期时间短，一般用于url query参数中 |

## home-user适配器: ServicePassportAdapter

模块`home-user`提供了适配器`ServicePassportAdapter`，允许我们定制 Passport 的操作逻辑。业务代码调用`bean.passport`，`bean.passport`调用`ServicePassportAdapter`，从而实现了`开箱即用`与`灵活定制`的完美结合。

`src/suite/a-home/modules/home-user/src/service/passportAdapter.ts`

| 名称        | 说明                                           |
| ----------- | ---------------------------------------------- |
| isAdmin     | 判断当前用户是否是`admin`身份                  |
| setCurrent  | 设置当前Passport                               |
| serialize   | 将Passport序列化为payload，从而存入jwt token中 |
| deserialize | 从payload反序列化出Passport                    |

## 获取当前Passport

```diff
class ControllerStudent {
  @Web.get('test')
  test() {
+   const passport = this.bean.passport.current;
    console.log(passport);
  }
}
```

或者:

```diff
class ControllerStudent {
  @Web.get('test')
  test() {
+   const passport = this.ctx.passport;
    console.log(passport);
  }
}
```

## a-user: Passport装饰器

模块`a-user`提供了一组 Passport 装饰器，用于对当前用户进行权限校验。

对于许多中小型项目，这套 Passport 装饰器足以应对需求。如需更高级的权限校验，可以自行开发`Guard`，参见：

- [局部守卫](../../aop/controller/guard-local.md)
- [全局守卫](../../aop/controller/guard-global.md)

| 名称      | 说明                              |
| --------- | --------------------------------- |
| public    | 是否允许匿名用户访问API           |
| activated | 是否允许非激活用户访问API         |
| userName  | 判断当前用户名                    |
| roleName  | 判断当前用户的角色名              |
| admin     | 判断当前用户的角色名是否为`admin` |

这里仅列出常用写法，具体信息参见: [内置守卫](../../aop/controller/guard-builtin.md)

```typescript
import { Passport } from 'vona-module-a-user';

@Passport.public()
@Passport.activated(false)
@Passport.userName({ name: 'admin' })
@Passport.roleName({ name: 'admin' })
@Passport.admin()
```

## home-user: Passport API

模块`home-user`提供了一组`开箱即用`的 Passport API，也可以在此基础之上扩展自定义的业务逻辑。

`src/suite/a-home/modules/home-user/src/controller/passport.ts`

| 名称                           | 说明                                                   |
| ------------------------------ | ------------------------------------------------------ |
| current                        | 获取当前Passport                                       |
| logout                         | 退出登录                                               |
| register                       | 注册新用户                                             |
| login                          | 登录                                                   |
| loginOauth                     | OAuth认证                                              |
| associate                      | 关联认证                                               |
| migrate                        | 迁移认证                                               |
| refreshAuthToken               | 刷新jwt token                                          |
| createPassportJwtFromOauthCode | 使用code生成jwt token。此code由OAuth认证返回           |
| createTempAuthToken            | 生成临时jwt token，过期时间短，一般用于url query参数中 |
