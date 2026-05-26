# Captcha Scene

使用`Captcha Scene`支持不同场景的验证码使用策略。比如，在某个场景下，可以在多个 Captcha Provider 中进行轮替，或者根据用户状态使用不同难度的 Captcha Provider，等等。

这里对模块`captcha-simple`的核心源码进行解析，从而说明如何开发一个新的 Captcha Scene。

## 创建Captcha Scene

比如，在模块`captcha-simple`中创建一个 Captcha Scene: `simple`

### 1. Cli命令

```bash
$ vona :create:bean captchaScene simple --module=captcha-simple
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Bean/Captcha Scene`
:::

## Captcha Scene定义

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

- `resolver`: 解析方法。根据业务需求在 Providers 清单中提取一个
- `providers`: 当前 Scene 可以使用的 Providers 清单

* provider 类型

| 名称   | 说明          |
| ------ | ------------- |
| true   | 启用 Provider |
| false  | 禁用 Provider |
| object | Provider 参数 |

## App Config

可以在 App Config 中配置 Captcha Scene 参数。

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

- 可以为 Captcha Scene 动态配置可以支持的 Providers 清单，包括:
  - 启用/禁用某个 Provider
  - 修改某个 Provider 的参数配置
  - 添加新的 Provider
