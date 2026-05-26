# User

To balance the `out-of-the-box` and `flexible customization` architectural design principles, VonaJS divides the user system into two parts:

- Module `a-user`: Provides general capabilities

- Module `home-user`: Provides customization capabilities

## a-user: IUser

The module `a-user` provides the interface `IUser`, defining the basic fields of the User.

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

The module `a-user` provides the global Bean `bean.user`, providing a general calling convention for business logic.

```typescript
// find user
const user = await this.bean.user.findOneById(userId);
// activate user
this.bean.user.activate(user);
```

- `bean.user` Method List

| Name              | Description                                                                    |
| ----------------- | ------------------------------------------------------------------------------ |
| activate          | Activate user                                                                  |
| register          | Register user                                                                  |
| registerByProfile | Register user using profile data, profile data comes from OAuth authentication |
| createAnonymous   | Create anonymous user                                                          |
| findOneByName     | Find user by `name`                                                            |
| findOneById       | Find user by `id`                                                              |
| findOne           | Find user                                                                      |
| updateById        | Update user by `id`                                                            |
| update            | Update user                                                                    |
| removeById        | Delete user by `id`                                                            |
| remove            | Delete user                                                                    |

## home-user adapter: ServiceUserAdapter

The module `home-user` provides the adapter `ServiceUserAdapter`, which allows us to customize the user operation logic. The business logic calls `bean.user`, which in turn calls `ServiceUserAdapter`, thus achieving a perfect combination of `out-of-the-box` and `flexible customization`

`src/suite/a-home/modules/home-user/src/service/userAdapter.ts`

| Name            | Description                  |
| --------------- | ---------------------------- |
| create          | Create user                  |
| userOfProfile   | Convert profile data to user |
| createAnonymous | Create anonymous user        |
| findOneByName   | Find user by `name`          |
| findOne         | Find user                    |
| update          | Update user                  |
| remove          | Delete user                  |
| setActivated    | Set activation status        |

## Get the current user

### 1. Parameter decorator

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

## Anonymous User

When an anonymous user accesses the API, the system automatically creates an anonymous user object.

```diff
class ControllerStudent {
  @Web.get('test')
  test(@Arg.user() user: IUser) {
+   console.log(user.anonymous);
  }
}
```

## Register User

You can call `bean.user.register` to register a new user. This method will trigger the `a-user:register` event. The `home-user` module listens for this event, thus enabling customized logic.

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

- `@EventListener`: This decorator is used to implement `event listener`

- First, call `next` to complete the default registration logic

- Then, determine if email activation is required; if so, call the `emailConfirm` method

| Name  | Type                               | Description                |
| ----- | ---------------------------------- | -------------------------- |
| match | string\|regexp\|(string\|regexp)[] | Which events to listen for |

## Activate User

Users can be activated by calling `bean.user.activate`. This method will trigger the `a-user:activate` event. The module `home-user` listens for this event, thus enabling logic customization.

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

- Assign a role to the user first
- Then call `next` to complete the default activation logic

## Disable activation operation

By default, newly registered users need to perform an activation operation.

You can enable the `autoActivate` configuration in App Config.

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

## User: admin

Automatically create the `admin` user in the `meta.version` of the module `home-user`

- See: [Migration and Changes](../../rest-api/version.md)

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

- `bean.auth.authenticate`: This is the unified authentication method provided by module `a-auth`

- `authenticate`: This method calls `bean.user.register` to register a new user

## Default Password

The default password for the `admin` user is `123456`, which can be modified in the app config.

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
