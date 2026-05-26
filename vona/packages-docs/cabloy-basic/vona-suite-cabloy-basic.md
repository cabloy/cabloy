# vona-suite-cabloy-basic

This suite includes the following modules:

| Name            | Description               |
| --------------- | ------------------------- |
| basic-siteadmin | Used to implement `Admin` |

## basic-siteadmin

This module includes the following components:

### 1. SsrSite: Admin

```typescript
@SsrSite({
  publicPath: '',
  bundlePath: 'ssr-cabloyBasicAdmin-5.0.0',
})
export class SsrSiteAdmin {}
```

| Name       | Description                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------- |
| publicPath | Specifies the publicPath of the admin website URL                                              |
| bundlePath | Specifies the path of the JS bundle. Copied here after building from the Zova frontend project |

### 2. SsrMenu: Home

```typescript
@SsrMenu({
  item: {
    title: $locale('Home'),
    order: $order(1, 'core'),
    icon: '::home',
    link: '/',
  },
  site: ['basic-siteadmin:admin'],
})
export class SsrMenuHome {}
```

| Name | Description                          |
| ---- | ------------------------------------ |
| item | Menu information                     |
| site | Binds the menu to the specified site |

### 3. SsrMenuGroup: Management

```typescript
@SsrMenuGroup({
  item: {
    title: $locale('Management'),
    order: $order(2),
  },
  site: ['basic-siteadmin:admin'],
})
export class SsrMenuGroupManagement {}
```

| Name | Description                                |
| ---- | ------------------------------------------ |
| item | Menu group information                     |
| site | Binds the menu group to the specified site |
