# vona-suite-cabloy-basic

该套件包含如下模块：

| 名称            | 说明                  |
| --------------- | --------------------- |
| basic-siteadmin | 用于实现`Admin中后台` |

## basic-siteadmin

该模块包含如下组件：

### 1. SsrSite: Admin

```typescript
@SsrSite({
  publicPath: '',
  bundlePath: 'ssr-cabloyBasicAdmin-5.0.0',
})
export class SsrSiteAdmin {}
```

| 名称       | 说明                                              |
| ---------- | ------------------------------------------------- |
| publicPath | 指定网站URL的publicPath                           |
| bundlePath | 指定JS Bundle的路径。由Zova前端项目构建后拷贝至此 |

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

| 名称 | 说明                 |
| ---- | -------------------- |
| item | 菜单信息             |
| site | 将菜单与指定网站绑定 |

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

| 名称 | 说明                   |
| ---- | ---------------------- |
| item | 菜单组信息             |
| site | 将菜单组与指定网站绑定 |
