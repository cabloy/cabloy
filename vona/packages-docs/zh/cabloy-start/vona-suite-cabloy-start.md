# vona-suite-cabloy-start

该套件包含两个模块：

| 名称            | 说明                  |
| --------------- | --------------------- |
| start-siteadmin | 用于实现`Admin中后台` |
| start-siteweb   | 用于实现`Web网站`     |

## start-siteadmin

该模块包含如下组件：

### 1. SsrSite: Admin

```typescript
@SsrSite({
  publicPath: 'admin',
  bundlePath: 'ssr-cabloyStartAdmin-5.0.0',
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
  site: ['start-siteadmin:admin'],
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
  site: ['start-siteadmin:admin'],
})
export class SsrMenuGroupManagement {}
```

| 名称 | 说明                   |
| ---- | ---------------------- |
| item | 菜单组信息             |
| site | 将菜单组与指定网站绑定 |

## start-siteweb

该模块包含如下组件：

### 1. SsrSite: Web

```typescript
@SsrSite({
  publicPath: '',
  bundlePath: 'ssr-cabloyStartWeb-5.0.0',
})
export class SsrSiteWeb {}
```

| 名称       | 说明                                              |
| ---------- | ------------------------------------------------- |
| publicPath | 指定网站URL的publicPath                           |
| bundlePath | 指定JS Bundle的路径。由Zova前端项目构建后拷贝至此 |
