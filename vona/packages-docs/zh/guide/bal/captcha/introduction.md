# 验证码体系

模块`a-captcha`提供了通用的验证码体系，使用`Captcha Provider`支持各种验证码方式，并且使用`Captcha Scene`支持不同场景的验证码使用策略。

## 特性

- `Captcha Provider`：使用`Captcha Provider`支持各种验证码方式，如：文字图形验证码、短信验证码，等等
- `Captcha Scene`：使用`Captcha Scene`支持不同场景的验证码使用策略。比如，在某个场景下，可以在多个 Captcha Provider 中进行轮替，或者根据用户状态使用不同难度的 Captcha Provider，等等
- `立即验证`：前端可以对用户输入的验证码进行立即验证。`立即验证`之后在提交表单时仍然要进行`二次验证`
- `表单验证`：前端可以将用户输入的验证码与表单数据一起发往后端验证

## bean.captcha

模块`a-captcha`提供了全局 Bean `bean.captcha`，可以通过统一的方式使用所有 Provider/Scene 提供的验证码能力。

模块`captcha-simple`提供了一个 Provider `captcha-simple:imageText`，基于[svg-captcha](https://github.com/produck/svg-captcha)实现文字图片的验证码能力。

模块`captcha-simple`提供了一个 Scene `captcha-simple:simple`。该 Scene 只使用一个 Provider，即`captcha-simple:imageText`

下面演示如何使用模块`captcha-simple`提供的验证码能力。

### 1. create

```typescript
// create captcha
const captcha = await this.bean.captcha.create('captcha-simple:simple');
```

- 返回值类型：`ICaptchaData`

```typescript
export interface ICaptchaData {
  id: string;
  provider: keyof ICaptchaProviderRecord;
  token?: unknown;
  payload: unknown;
}
```

| 名称     | 说明                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------- |
| id       | 本次验证码数据的id标识                                                                               |
| provider | 本次验证码所使用的Provider名称                                                                       |
| token    | 本次验证码数据的token，用于比对用户输入值。在开发环境可以通过修改系统配置，将token发往前端，用于调试 |
| payload  | 本次验证码的负载内容，不同的Provider有不同的payload类型                                              |

### 2. refresh

```typescript
// refresh captcha
const captchaNew = await this.bean.captcha.refresh(captchaId, 'captcha-simple:simple');
```

- 如果一个 Scene 配置了多个 Provider，那么在刷新 capthca 时可以基于策略选取不同的 Provider

### 3. verify

```typescript
// verify captcha
const passed = await this.bean.captcha.verify(captchaId, '1234', 'captcha-simple:simple');
```

### 4. verifyImmediate

前端可以对用户输入的验证码进行`立即验证`。`立即验证`之后在提交表单时仍然要进行`二次验证`

```typescript
// verifyImmediate captcha
const tokenOrFalse = await this.bean.captcha.verifyImmediate(captchaId, '1234');
```

- 如果立即验证失败，返回`false`
- 如果立即验证成功，返回`二次token`
- 前端需要将`二次token`与表单数据一起发往后端进行`二次验证`

## interceptor.captchaVerify

模块`a-captcha`提供了一个局部拦截器`a-captcha:captchaVerify`，可以针对 API 启用验证码校验。

`src/suite/a-home/modules/home-user/src/controller/passport.ts`

```diff
import { Core } from 'vona-module-a-core';

class ControllerPassport {
  @Web.post('login')
+ @Core.captchaVerify({ scene: 'captcha-simple:simple' })
  async login(@Arg.body() data) {}
}
```

- `@Core.captchaVerify`: 用于使用局部拦截器`a-captcha:captchaVerify`，传入需要使用的 Scene 名称
- 该拦截器支持`表单验证`和`二次验证`

## Captcha API

模块`a-captcha`提供了一组`开箱即用`的 Captcha API，对`bean.captcha`的能力进行了封装。

`src/suite-vendor/a-vona/modules/a-captcha/src/controller/captcha.ts`

| 名称            | 说明 |
| --------------- | ---- |
| create          |      |
| refresh         |      |
| verifyImmediate |      |

::: tip
为何没有提供`verify`API？

因为`bean.captcha.verify`方法用于局部拦截器`a-captcha:captchaVerify`
:::

## 参数配置

可以在 App Config 中修改模块`a-captcha`的参数配置。

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

| 名称                         | 说明                                                                |
| ---------------------------- | ------------------------------------------------------------------- |
| captcha.showToken            | 是否显示token。如果为true，就将token发往前端，用于调试。默认为false |
| captchaProvider.ttl          | captcha token的过期时间                                             |
| captchaProvider.ttlSecondary | 二次token的过期时间                                                 |
