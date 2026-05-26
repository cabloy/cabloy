# Timezone

## 1. 获取当前Timezone

```typescript
const tz = this.ctx.tz;
```

## 2. 设置当前Timezone

```typescript
this.ctx.tz = 'America/New_York';
```

## 获取当前Timezone的规则

当用户访问后端 API 时，后端会自动根据规则获取当前 Timezone。

### 1. 模块配置

I18n 是由模块 a-locale 提供的核心能力，可以在 App Config 中修改模块的配置：

`src/backend/config/config/config.ts`

```typescript
// modules
config.modules = {
  'a-locale': {
    tz: {
      defaultTz: undefined,
      queryField: 'x-vona-tz',
      headerField: 'x-vona-tz',
      cookieField: 'tz',
    },
  },
};
```

| 名称        | 说明                                                            |
| ----------- | --------------------------------------------------------------- |
| defaultTz   | Default timezone                                                |
| queryField  | 从request query中获取当前timezone，query key默认为`x-vona-tz`   |
| headerField | 从request header中获取当前timezone，header key默认为`x-vona-tz` |
| cookieField | 从request cookie中获取当前timezone，cookie key默认为`tz`        |

### 2. 规则次序

系统按以下次序，依次判断当前 timezone。

`queryField` > `headerField` > `cookieField` > `user tz` > `defaultTz` > `undefined(system timezone)`
