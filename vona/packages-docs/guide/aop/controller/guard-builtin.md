# Built-in Guard

## Local Guard

| Name            | Description                             |
| --------------- | --------------------------------------- |
| a-user:userName | Determines the current user name        |
| a-user:roleName | Determines the current user's role name |

## Global Guard

| Name            | Description                                                        |
| --------------- | ------------------------------------------------------------------ |
| a-user:passport | Initializes the current user information and performs basic checks |

## Allow anonymous users to access the API

By default, only authenticated users can access the API. To allow anonymous users to access the API, the code is as follows:

- General usage:

```typescript
import { Aspect } from 'vona-module-a-aspect';

@Aspect.guardGlobal('a-user:passport', { public: true })
```

- Shorthand:

```typescript
import { Passport } from 'vona-module-a-user';

@Passport.public()
```

- Shorthand principle:

`@Passport.public` still calls `@Aspect.guardGlobal` internally. The code is as follows:

```typescript
function Public(_public: boolean = true): ClassDecorator & MethodDecorator {
  return Aspect.guardGlobal('a-user:passport', { public: _public });
}
```

## Allow inactive users to access the API

By default, only activated users can access the API. To allow inactive users to access the API, the code is as follows:

- General usage:

```typescript
import { Aspect } from 'vona-module-a-aspect';

@Aspect.guardGlobal('a-user:passport', { activated: false })
```

- Shorthand:

```typescript
import { Passport } from 'vona-module-a-user';

@Passport.activated(false)
```

## Determine the current username

Determine the current username. If it is `admin`, complete the check. If it is not, throw an exception.

- General usage:

```typescript
import { Aspect } from 'vona-module-a-aspect';

@Aspect.guard('a-user:userName', { name: 'admin' })
```

- Shorthand:

```typescript
import { Passport } from 'vona-module-a-user';

@Passport.userName({ name: 'admin' })
```

## Determine the current user's role name

Determine the current role name. If it is `admin`, complete the check. If it is not, throw an exception.

- General usage:

```typescript
import { Aspect } from 'vona-module-a-aspect';

@Aspect.guard('a-user:roleName', { name: 'admin' })
```

- Shorthand method:

```typescript
import { Passport } from 'vona-module-a-user';

@Passport.roleName({ name: 'admin' })
```

## Determine whether the role name is `admin`

Because determining whether the role name is `admin` is frequently used, we have provided a shorthand method as follows:

```typescript
import { Passport } from 'vona-module-a-user';

@Passport.admin()
```

## Combining Uses

For example, let's use both the local guards `a-user:userName` and `a-user:roleName`. The check rules are as follows:

- If one condition is met, the check is completed

```typescript
@Passport.roleName({ name: 'admin' })
@Passport.userName({ name: 'admin', rejectWhenDismatched: false })
```

::: warning
Check order: @Passport.userName > @Passport.roleName
:::

- If both conditions are met, the check is completed

```typescript
@Passport.roleName({ name: 'admin' })
@Passport.userName({ name: 'admin', passWhenMatched: false })
```

| Name                 | Description                                                       |
| -------------------- | ----------------------------------------------------------------- |
| rejectWhenDismatched | Whether to throw an exception when dismatched. Defaults to `true` |
| passWhenMatched      | Whether to complete the check when matched. Defaults to `true`    |
