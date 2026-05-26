# Passport

When a user accesses the backend API, the system verifies the JWT token. If the verification passes, a `Passport` is created. This passport contains information such as the current user and authentication info.

## a-user: IPassport

The module `a-user` provides the interface `IPassport`, which defines the basic fields of the Passport.

```typescript
export interface IPassport {
  user?: IUser;
  auth?: IAuth;
  roles?: IRole[];
}
```

## a-user: bean.passport

The module `a-user` provides the global Bean `bean.passport`, providing a common calling convention for business logic.

```typescript
// get the current passport
const passport = this.bean.passport.current;
// mock signin for test
this.bean.passport.signinMock();
```

- `bean.passport` Method List

| Name                | Description                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| isAuthenticated     | Checks if the current user is authenticated (not anonymous)                                          |
| isActivated         | Checks if the current user is activated                                                              |
| isAdmin             | Checks if the current user is an `admin` user                                                        |
| setCurrent          | Sets the current Passport                                                                            |
| getCurrent          | Gets the current Passport                                                                            |
| getCurrentUser      | Gets the current user                                                                                |
| getCurrentAuth      | Gets the current authentication                                                                      |
| getCurrentRoles     | Gets the current role                                                                                |
| signin              | Completes the login logic for the passport and returns a JWT token                                   |
| signout             | Logs out                                                                                             |
| signinSystem        | Logs in as a system user                                                                             |
| signinMock          | Mock login for testing                                                                               |
| signinWithAnonymous | Logs in as an anonymous user                                                                         |
| kickOut             | Kicks out the user                                                                                   |
| checkAuthToken      | Validates the JWT token; creates a Passport if validation is successful                              |
| refreshAuthToken    | Refreshes the JWT token                                                                              |
| createTempAuthToken | Generates a temporary JWT token with a short expiration time, typically used in URL query parameters |

## home-user adapter: ServicePassportAdapter

The `home-user` module provides the adapter `ServicePassportAdapter`, allowing us to customize the passport operation logic. The business logic calls `bean.passport`, which in turn calls `ServicePassportAdapter`, thus achieving a perfect combination of `out-of-the-box` and `flexible customization`

`src/suite/a-home/modules/home-user/src/service/passportAdapter.ts`

| Name        | Description                                                       |
| ----------- | ----------------------------------------------------------------- |
| isAdmin     | Checks if the current user is an `admin` user                     |
| setCurrent  | Sets the current Passport                                         |
| serialize   | Serializes the Passport into a payload, storing it in a JWT token |
| deserialize | Deserializes the Passport from the payload                        |

## Get the current Passport

```diff
class ControllerStudent {
  @Web.get('test')
  test() {
+   const passport = this.bean.passport.current;
    console.log(passport);
  }
}
```

Or:

```diff
class ControllerStudent {
  @Web.get('test')
  test() {
+   const passport = this.ctx.passport;
    console.log(passport);
  }
}
```

## a-user: Passport Decorators

The `a-user` module provides a set of Passport decorators for verifying permissions for the current user.

For many small to medium-sized projects, this set of Passport decorators is sufficient to meet their needs. For more advanced permission verification, you can develop your own `Guard`. See:

- [Local Guard](../../aop/controller/guard-local.md)
- [Global Guard](../../aop/controller/guard-global.md)

| Name      | Description                                        |
| --------- | -------------------------------------------------- |
| public    | Whether to allow anonymous users to access the API |
| activated | Whether to allow inactive users to access the API  |
| userName  | Checks the current username                        |
| roleName  | Checks the current user's role name                |
| admin     | Checks if the current user's role name is `admin`  |

This only lists common syntax. For detailed information, see: [Built-in Guard](../../aop/controller/guard-builtin.md)

```typescript
import { Passport } from 'vona-module-a-user';

@Passport.public()
@Passport.activated(false)
@Passport.userName({ name: 'admin' })
@Passport.roleName({ name: 'admin' })
@Passport.admin()
```

## home-user: Passport API

The `home-user` module provides a set of Passport APIs `out of the box`, and custom business logic can be extended on top of this.

`src/suite/a-home/modules/home-user/src/controller/passport.ts`

| Name                           | Description                                                                                          |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| current                        | Get the current Passport                                                                             |
| logout                         | Log out                                                                                              |
| register                       | Register a new user                                                                                  |
| login                          | Log in                                                                                               |
| loginOauth                     | OAuth authentication                                                                                 |
| associate                      | Associate authentication                                                                             |
| migrate                        | Migrate authentication                                                                               |
| refreshAuthToken               | Refresh JWT token                                                                                    |
| createPassportJwtFromOauthCode | Generate a JWT token using the code. This code is returned by OAuth authentication                   |
| createTempAuthToken            | Generates a temporary JWT token with a short expiration time, typically used in URL query parameters |
