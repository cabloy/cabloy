# 同步数据

Zova 利用 TanStack Query 的数据管理机制，实现了对同步数据的管理，从而方便我们在 cookie 和 localstorage 中同步写入和读取数据，也可以直接管理基于内存的数据。

下面，我们演示如何在 Model 中管理用户的数据。

- 完整代码示例，请参见：
  - [home-user](https://github.com/zovajs/zova/blob/main/zova-dev/src/suite/a-home/modules/home-user/src/bean/model.user.ts)
  - [a-style](https://github.com/zovajs/zova/blob/main/zova-dev/src/suite-vendor/a-zova/modules/a-style/src/bean/bean.theme.ts)

## 创建Model Bean

::: tip
右键菜单 - [模块路径]: `Zova Create/Bean: Model`
:::

依据提示输入 model bean 的名称，比如`user`，VSCode 插件会自动添加 model bean 的代码骨架。

`demo-basic/src/bean/model.user.ts`

```typescript
import { Model } from 'zova';
import { BeanModelBase } from 'zova-module-a-model';

@Model()
export class ModelUser extends BeanModelBase {}
```

- 使用@Model 装饰器
- 继承自基类 BeanModelBase

## localstorage

由于服务端不支持`window.localStorage`，因此 localstorage 状态数据不参与 SSR 的水合过程。

下面演示把用户信息存入 localstorage，当页面刷新时也会保持状态。

### 如何定义

```typescript
export class ModelUser extends BeanModelBase {
  user?: ApiUserEntity;

  protected async __init__() {
    this.user = this.$useStateLocal({
      queryKey: ['user'],
    });
  }
}
```

- 与`异步数据`定义不同，同步数据直接在初始化方法`__init__`中定义
- 调用$useStateLocal 创建 Query 对象
- 传入 queryKey，确保本地缓存的唯一性

### 如何使用

直接像常规变量一样读取和设置数据。

```typescript
const user = this.user;
this.user = newUser;
```

## cookie

在服务端会自动使用`Request Header`中的 Cookies，在客户端会自动使用`document.cookie`，因此会自动保证 SSR 水合过程中 cookie 状态数据的一致性。

下面演示把用户 Token 存入 cookie，当页面刷新时也会保持状态。这样，在 SSR 模式下，客户端和服务端都可以使用相同的`jwt token`访问后端 API 服务。

### 如何定义

```typescript
export class ModelUser extends BeanModelBase {
  token?: string;

  protected async __init__() {
    this.token = this.$useStateCookie({
      queryKey: ['token'],
    });
  }
}
```

- 与`异步数据`定义不同，同步数据直接在初始化方法`__init__`中定义
- 调用$useStateCookie 创建 Query 对象
- 传入 queryKey，确保本地缓存的唯一性

### 如何使用

直接像常规变量一样读取和设置数据。

```typescript
const token = this.token;
this.token = newToken;
```

## 内存

在 SSR 模式下，服务端定义的全局状态数据会同步到客户端，并自动完成水合。

下面演示基于内存的全局状态数据。

### 如何定义

`zova-ui-quasar/src/suite-vendor/a-quasar/modules/quasar-adapter/src/bean/model.theme.ts`

```typescript
export class ModelTheme extends BeanModelBase {
  cBrand: string;

  protected async __init__() {
    this.cBrand = this.$useStateMem({
      queryKey: ['cBrand'],
    });
  }
}
```

- 与`异步数据`定义不同，同步数据直接在初始化方法`__init__`中定义
- 调用$useStateMem 创建 Query 对象
- 传入 queryKey，确保本地缓存的唯一性

### 如何使用

直接像常规变量一样读取和设置数据。

```typescript
const cBrand = this.cBrand;
this.cBrand = newValue;
```
