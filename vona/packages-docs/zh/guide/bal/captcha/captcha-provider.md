# Captcha Provider

这里对模块`captcha-simple`的核心源码进行解析，从而说明如何开发一个新的 Captcha Provider。

## 创建Captcha Provider

比如，在模块`captcha-simple`中创建一个 Captcha Provider: `imageText`

### 1. Cli命令

```bash
$ vona :create:bean captchaProvider imageText --module=captcha-simple
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Bean/Captcha Provider`
:::

## Captcha Provider定义

```typescript
export type TypeCaptchaProviderImageTextToken = string;
export type TypeCaptchaProviderImageTextPayload = string;
export type TypeCaptchaProviderImageTextData = ICaptchaProviderData<
  TypeCaptchaProviderImageTextToken,
  TypeCaptchaProviderImageTextPayload
>;

export type TypeCaptchaProviderImageTextType = 'char' | 'math';
const CaptchaProviderImageTextTypes = ['char', 'math'] as const;
export interface ICaptchaProviderOptionsImageText extends IDecoratorCaptchaProviderOptions {
  type?: TypeCaptchaProviderImageTextType;
  fontPath?: string;
  opts: ConfigObject;
}

@CaptchaProvider<ICaptchaProviderOptionsImageText>({
  opts: {
    size: 4,
    color: true,
  },
})
class CaptchaProviderImageText {
  async create(options) {
    this._confirmFont(options);
    let type = options.type;
    if (!type) {
      type = CaptchaProviderImageTextTypes[getRandomInt(2, 0)];
    }
    const captcha =
      type === 'char' ? svgCaptcha.create(options.opts) : svgCaptcha.createMathExpr(options.opts);
    return { token: captcha.text, payload: svg64(captcha.data) };
  }

  async verify(token, tokenInput, _options) {
    return !!tokenInput && !!token && tokenInput.toLowerCase() === token.toLowerCase();
  }
}
```

- `TypeCaptchaProviderImageTextToken`: token 类型，不同的 Provider 可能有不同的 token 类型
- `TypeCaptchaProviderImageTextPayload`: payload 类型，不同的 Provider 可能有不同的 payload 类型
- `TypeCaptchaProviderImageTextData`: 当前 Provider 对应的 Captcha Data 类型
- `ICaptchaProviderOptionsImageText`: 当前 Provider 的参数。不同的 Provider 可以提供不同的参数配置。比如，该 Provider 基于[svg-captcha](https://github.com/produck/svg-captcha)实现文字图片的验证码能力，因此相应的提供 svg-captcha 所需的参数: `type/fontPath/opts`
- `create`: 创建 captcha 数据
- `verify`: 校验 captcha token 是否正确

## App Config

可以在 App Config 中配置 Captcha Provider 参数。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  captchaProvider: {
    'captcha-simple:imageText': {
      type: 'char',
      opts: {
        size: 4,
        color: true,
      },
    },
  },
};
```
