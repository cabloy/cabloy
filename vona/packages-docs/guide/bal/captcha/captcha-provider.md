# Captcha Provider

This section analyzes the core source code of the module `captcha-simple` to illustrate how to develop a new Captcha Provider.

## Creating a Captcha Provider

For example, creating a Captcha Provider: `imageText` within the module `captcha-simple`

### 1. CLI Command

```bash
$ vona :create:bean captchaProvider imageText --module=captcha-simple
```

### 2. Menu Command

::: tip
Context Menu - [Module Path]: `Vona Bean/Captcha Provider`
:::

## Captcha Provider Definition

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

- `TypeCaptchaProviderImageTextToken`: Token type; different providers may have different token types

- `TypeCaptchaProviderImageTextPayload`: Payload type; different providers may have different payload types

- `TypeCaptchaProviderImageTextData`: Captcha Data type corresponding to the current provider

- `ICaptchaProviderOptionsImageText`: Parameters of the current provider. Different providers can offer different parameter configurations. For example, this provider implements image-text Captcha capabilities based on [svg-captcha](https://github.com/produck/svg-captcha), therefore it provides the following parameters required by svg-captcha: `type/fontPath/opts`
- `create`: Creates captcha data
- `verify`: Verifies the captcha token's correctness

## App Config

Captcha Provider parameters can be configured in the App Config.

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
