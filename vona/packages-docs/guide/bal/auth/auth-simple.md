# Username/Password Authentication

The module `auth-simple` provides out-of-the-box username/password authentication.

## How to Use

### 1. Register a New User

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

`confirmed`: If `true`, it means the user has already confirmed and no further `activation` operation is needed.

### 2. Login

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

### 3. Logout

```typescript
await this.bean.passport.signout();
```

### 4. Configuration

The module `auth-simple` uses [password-hash-salt](https://www.npmjs.com/package/password-hash-salt) to hash the password.

Configuration can be modified in App Config.

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

## Source Code Analysis

This section analyzes the core source code of the module `auth-simple` to explain how to develop a new Auth Provider.

For example, create an Auth Provider in the module `auth-simple`: `simple`

### 1. CLI Command

```bash
$ vona :create:bean authProvider simple --module=auth-simple
```

### 2. Menu Command

::: tip
Context Menu - [Module Path]: `Vona Bean/Auth Provider`
:::

## Auth Provider Definition

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

- `IAuthProviderSimpleClientRecord`: Defines multiple Clients, with a default definition for `default`
- `IAuthProviderSimpleClientOptions`: Defines Client options
- `IAuthProviderOptionsSimple`: Defines the parameters of the Auth Provider
- `verify`: Processes `register` and `login`, returning Profile data

## Profile

1. The Provider's `verify` only needs to return Profile data. The system will generate a User object based on the Profile data
2. Both `register` and `login` must return the same `id` field value
3. Ensure that a unique `id` value is generated for each user

Profile has a unified interface definition:

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

- `confirmed`: If `true`, it means the user has confirmed and no further `activation` operation is needed
