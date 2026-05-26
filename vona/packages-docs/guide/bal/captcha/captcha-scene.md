# Captcha Scene

Use `Captcha Scene` to support different captcha usage strategies in different scenarios. For example, in a given scenario, you can rotate between multiple Captcha Providers, or use Captcha Providers of varying difficulty based on the user's state, etc.

This section analyzes the core source code of the module `captcha-simple` to illustrate how to develop a new Captcha Scene.

## Creating a Captcha Scene

For example, creating a Captcha Scene in the module `captcha-simple`: `simple`

### 1. CLI Command

```bash
$ vona :create:bean captchaScene simple --module=captcha-simple
```

### 2. Menu Command

::: tip
Context Menu - [Module Path]: `Vona Bean/Captcha Scene`
:::

## Captcha Scene Definition

```typescript
@CaptchaScene({
  resolver: async (_ctx, _providers) => {
    return 'captcha-simple:imageText';
  },
  providers: {
    'captcha-simple:imageText': true,
  },
})
export class CaptchaSceneSimple extends BeanBase {}
```

- `resolver`: Resolves one from the Providers list based on business needs
- `providers`: A list of Providers available for the current Scene

* Provider Type

| Name   | Description         |
| ------ | ------------------- |
| true   | Enable Provider     |
| false  | Disable Provider    |
| object | Provider Parameters |

## App Config

Captcha Scene parameters can be configured in the App Config.

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  captchaScene: {
    'captcha-simple:simple': {
      providers: {
        'captcha-simple:imageText': {
          opts: {
            size: 4,
            color: true,
          },
        },
      },
    },
  },
};
```

- You can dynamically configure the Providers that can be supported for the Captcha Scene, including:
  - Enabling/disabling a Provider
  - Modifying the parameters of a Provider
  - Adding a new Provider
