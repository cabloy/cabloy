# Static

在 VonaJS 框架中，每个模块都可以提供静态资源，可以通过 URL 访问。

## 初始化代码骨架

### 1. Cli命令

```bash
$ vona :init:static demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Init/Assets Static`
:::

### 3. 添加静态资源

执行上述命令会自动创建目录: `assets/static`

根据业务需求添加静态资源，比如添加两张图片：

```bash
src/module/demo-student/assets/static/img/vona.png
src/module/demo-student/assets/static/img/vona.svg
```

### 4. URL

可以通过如下 URL 访问静态资源：

```bash
http://localhost:7102/api/static/demo/student/img/vona.png
http://localhost:7102/api/static/demo/student/img/vona.svg
```

可以使用`meta.static`通过类型化的方式获取静态资源的 URL 地址。

## 创建meta.static

比如，在模块 demo-student 中创建`meta.static`

### 1. Cli命令

```bash
$ vona :create:bean meta static --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Meta/Static`
:::

## meta.static定义

```typescript
export type TypeStaticGetPath = 'img/vona.png' | 'img/vona.svg';

@Meta()
export class MetaStatic extends BeanStaticBase<TypeStaticGetPath> {}
```

- `TypeStaticGetPath`: 定义静态资源的类型

## 获取静态资源Path

```typescript
class ControllerStudent {
  test() {
    const path = this.scope.static.get('img/vona.png');
    assert.equal(path, '/api/static/demo/student/img/vona.png');
  }
}
```

- `static.get`：传入静态资源`img/vona.png`，生成 Path`/api/static/demo/student/img/vona.png`

## 获取静态资源URL

```typescript
class ControllerStudent {
  test() {
    const url = this.scope.static.getURL('img/vona.png');
    assert.equal(url, 'http://localhost:7102/api/static/demo/student/img/vona.png);
  }
}
```

- `static.getURL`：传入静态资源`img/vona.png`，生成 URL`http://localhost:7102/api/static/demo/student/img/vona.png`

## URL配置

`http://localhost:7102`是系统根据当前 API 的上下文动态推断出来的。在一些应用场景，API Server 的 URL 与对外提供服务的域名可能并不相同。这时可以通过`App Config`或者`Instance Config`修改 URL 配置。

### 1. App Config

`src/backend/config/config/config.ts`

```typescript
// server
config.server = {
  serve: {
    protocol: 'https',
    host: 'cabloy.com',
  },
};
```

这时再执行方法`static.getURL`，得到的 URL 是`https://cabloy.com/api/static/demo/student/img/vona.png`

### 2. Instance Config

VonaJS 支持`多实例/多租户`，可以为具体的实例指定不同的配置。

`src/backend/config/config/config.ts`

```typescript
// instance
config.instance = {
  instances: {
    '': {
      password: '',
      title: '',
      config: {
        server: {
          serve: {
            protocol: 'https',
            host: 'cabloy.com',
          },
        },
      },
    },
  },
};
```
