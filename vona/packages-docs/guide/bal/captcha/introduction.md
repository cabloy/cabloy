# Captcha System

The `a-captcha` module provides a general Captcha system. It uses `Captcha Provider` to support various Captcha methods and `Captcha Scene` to support Captcha usage strategies for different scenarios.

## Features

- `Captcha Provider`: Supports various Captcha methods, such as image-text Captcha, SMS Captcha, etc

- `Captcha Scene`: Supports Captcha usage strategies for different scenarios. For example, in a given scenario, multiple Captcha Providers can be rotated, or different difficulty Captcha Providers can be used based on the user's status, etc

- `Immediate Verification`: The frontend can immediately verify the Captcha token entered by the user. Even after `immediate verification`, a second verification is still required when submitting the form

- `Form verification`: The frontend can send the user-entered Captcha token along with the form data to the backend for verification

## bean.captcha

The module `a-captcha` provides a global Bean `bean.captcha`, which allows for unified use of Captcha capabilities provided by all Providers/Scenes.

The module `captcha-simple` provides a Provider `captcha-simple:imageText`, which implements image-text Captcha capabilities based on [svg-captcha](https://github.com/produck/svg-captcha)

The module `captcha-simple` provides a Scene `captcha-simple:simple`. This scene uses only one Provider, `captcha-simple:imageText`

The following demonstrates how to use the Captcha capability provided by the module `captcha-simple`

### 1. create

```typescript
// create captcha
const captcha = await this.bean.captcha.create('captcha-simple:simple');
```

- Return value type: `ICaptchaData`

```typescript
export interface ICaptchaData {
  id: string;
  provider: keyof ICaptchaProviderRecord;
  token?: unknown;
  payload: unknown;
}
```

| Name     | Description                                                                                                                                                                                   |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id       | The ID identifier of this Captcha data                                                                                                                                                        |
| provider | The name of the Provider used for this Captcha                                                                                                                                                |
| token    | The token of this Captcha data, used to compare the user input value. In the development environment, you can modify the system configuration to send the token to the frontend for debugging |
| Payload  | The payload content of this Captcha. Different Providers have different payload types                                                                                                         |

### 2. refresh

```typescript
// refresh captcha
const captchaNew = await this.bean.captcha.refresh(captchaId, 'captcha-simple:simple');
```

- If a Scene has multiple Providers configured, different Providers can be selected based on a strategy when refreshing the captcha

### 3. verify

```typescript
// verify captcha
const passed = await this.bean.captcha.verify(captchaId, '1234', 'captcha-simple:simple');
```

### 4. verifyImmediate

The frontend can perform `immediate verification` on the user-entered Captcha token. Even after `immediate verification`, `secondary verification` is still required when submitting the form.

```typescript
// verifyImmediate captcha
const tokenOrFalse = await this.bean.captcha.verifyImmediate(captchaId, '1234');
```

- Returns `false` if immediate verification fails
- Returns a `secondary token` if immediate verification succeeds
- The frontend needs to send the `secondary token` along with the form data to the backend for `secondary verification`

## interceptor.captchaVerify

The module `a-captcha` provides a local interceptor `a-captcha:captchaVerify`, which can enable Captcha verification for the API.

`src/suite/a-home/modules/home-user/src/controller/passport.ts`

```diff
import { Core } from 'vona-module-a-core';

class ControllerPassport {
  @Web.post('login')
+ @Core.captchaVerify({ scene: 'captcha-simple:simple' })
  async login(@Arg.body() data) {}
}
```

- `@Core.captchaVerify`: Used to apply the local interceptor `a-captcha:captchaVerify`, passing in the Scene name to be used
- This interceptor supports both `form verification` and `secondary verification`

## Captcha API

The module `a-captcha` provides a set of `out-of-the-box` Captcha APIs, encapsulating the capabilities of `bean.captcha`

`src/suite-vendor/a-vona/modules/a-captcha/src/controller/captcha.ts`

| Name            | Description |
| --------------- | ----------- |
| create          |             |
| refresh         |             |
| verifyImmediate |             |

::: tip
Why isn't a `verify` API provided?

Because the `bean.captcha.verify` method is used for the local interceptor `a-captcha:captchaVerify`
:::

## Configuration

You can modify the configuration of the module `a-captcha` in the App Config.

`src/backend/config/config/config.ts`

```typescript
// modules
config.modules = {
  'a-captcha': {
    captcha: {
      showToken: false,
    },
    captchaProvider: {
      ttl: 20 * 60 * 1000,
      ttlSecondary: 20 * 60 * 1000,
    },
  },
};
```

| Name                         | Description                                                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| captcha.showToken            | Whether to display the token. If `true`, the token will be sent to the frontend for debugging. The default is `false` |
| captchaProvider.ttl          | Captcha token expiration time                                                                                         |
| captchaProvider.ttlSecondary | Secondary token expiration time                                                                                       |
