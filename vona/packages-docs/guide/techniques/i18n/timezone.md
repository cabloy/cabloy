# Timezone

## 1. Get Current Timezone

```typescript
const tz = this.ctx.tz;
```

## 2. Set Current Timezone

```typescript
this.ctx.tz = 'America/New_York';
```

## Rules for Getting the Current Timezone

When a user accesses the backend API, the backend will automatically obtain the current Timezone according to the rules.

### 1. Module Configuration

I18n is the core capability provided by the module `a-locale`. The module configuration can be modified in the App Config:

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

| Name        | Description                                                                                    |
| ----------- | ---------------------------------------------------------------------------------------------- |
| defaultTz   | Default timezone                                                                               |
| queryField  | Retrieves the current timezone from the request query. The query key defaults to `x-vona-tz`   |
| headerField | Retrieves the current timezone from the request header. The header key defaults to `x-vona-tz` |
| cookieField | Retrieves the current timezone from the request cookie. The cookie key defaults to `tz`        |

### 2. Rule Order

The system determines the current timezone in the following order:

`queryField` > `headerField` > `cookieField` > `user tz` > `defaultTz` > `undefined(system timezone)`
