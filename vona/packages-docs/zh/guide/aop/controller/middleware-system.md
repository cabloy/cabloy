# 系统中间件

系统中间件与全局中间件和局部中间件的区别：

1. `系统中间件`: 在路由匹配之前执行
2. `全局中间件`/`局部中间件`: 在路由匹配之后执行

## 创建中间件

比如，在模块 demo-student 中创建一个系统中间件: `logger`

### 1. Cli命令

```bash
$ vona :create:bean middlewareSystem logger --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Aspect/Middleware System`
:::

## 中间件定义

```typescript
export interface IMiddlewareOptionsLogger extends IDecoratorMiddlewareOptions {}

@Middleware<IMiddlewareOptionsLogger>()
export class MiddlewareLogger extends BeanBase implements IMiddlewareExecute {
  async execute(_options: IMiddlewareOptionsLogger, next: Next) {
    const timeBegin = Date.now();
    const res = await next();
    const timeEnd = Date.now();
    console.log('time: ', timeEnd - timeBegin);
    return res;
  }
}
```

- `IMiddlewareOptionsLogger`: 定义中间件参数
- `execute`: 输出执行时长

## 使用中间件

与局部中间件不同，系统会自动加载系统中间件，并使其生效。

## 中间件参数

可以为中间件定义参数，通过参数更灵活的配置中间件逻辑。

比如，为 logger 中间件定义`prefix`参数，用于控制输出格式。

### 1. 定义参数类型

```diff
export interface IMiddlewareSystemOptionsLogger extends IDecoratorMiddlewareSystemOptions {
+ prefix: string;
}
```

### 2. 提供参数缺省值

```diff
@MiddlewareSystem<IMiddlewareSystemOptionsLogger>({
+ prefix: 'time',
})
```

### 3. 使用参数

```diff
export interface IMiddlewareSystemOptionsLogger extends IDecoratorMiddlewareSystemOptions {
  prefix: string;
}

@MiddlewareSystem<IMiddlewareSystemOptionsLogger>({
  prefix: 'time',
})
class MiddlewareSystemLogger {
  async execute(options: IMiddlewareSystemOptionsLogger, next: Next) {
    const timeBegin = Date.now();
    const res = await next();
    const timeEnd = Date.now();
-   console.log('time: ', timeEnd - timeBegin);
+   console.log(`${options.prefix}: `, timeEnd - timeBegin);
    return res;
  }
}
```

### 4. App Config

可以在 App Config 中配置中间件参数。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  middlewareSystem: {
    'demo-student:logger': {
      prefix: 'elapsed',
    },
  },
};
```

### 5. 参数优先级

`App Config` > `参数缺省值`

## 中间件顺序

由于系统中间件是默认加载并生效的，所以，VonaJS 提供了两个参数，用于控制中间件的加载顺序。

### 1. dependencies

比如，系统有一个内置系统中间件`a-core:notfound`，希望加载顺序如下：`a-core:notfound` > `Current`

```diff
@MiddlewareSystem({
+ dependencies: 'a-core:notfound',
  prefix: 'time',
})
class MiddlewareSystemLogger {}
```

### 2. dependents

`dependents`的顺序刚好与`dependencies`相反，希望加载顺序如下：`Current` > `a-core:notfound`

```diff
@MiddlewareSystem({
+ dependents: 'a-core:notfound',
  prefix: 'time',
})
class MiddlewareSystemLogger {}
```

## 中间件启用/禁用

可以针对某些 API 控制系统中间件的`启用/禁用`

### 1. Enable

- 针对所有 API 禁用

`src/backend/config/config/config.ts`

```diff
// onions
config.onions = {
  middlewareSystem: {
    'demo-student:logger': {
+     enable: false,
    },
  },
};
```

### 2. Meta

可以让系统中间件在指定的运行环境生效。

| 名称   | 类型             | 说明                                                                   |
| ------ | ---------------- | ---------------------------------------------------------------------- |
| flavor | string\|string[] | 参见: [运行环境与Flavor](../../env-config/mode-flavor/introduction.md) |
| mode   | string\|string[] | 参见: [运行环境与Flavor](../../env-config/mode-flavor/introduction.md) |

- 举例

```diff
@MiddlewareSystem({
+ meta: {
+   flavor: 'normal',
+   mode: 'dev',
+ },
})
class MiddlewareSystemLogger {}
```

### 3. match/ignore

可以针对指定的 API 启用/禁用系统中间件。

| 名称   | 类型                               | 说明            |
| ------ | ---------------------------------- | --------------- |
| match  | string\|regexp\|(string\|regexp)[] | 针对哪些API启用 |
| ignore | string\|regexp\|(string\|regexp)[] | 针对哪些API禁用 |

系统中间件与全局中间件都支持`match`和`ignore`，但是传入的 API Path 格式不同，以 ControllerStudent 的 findMany API 为例：

- 系统中间件：`/api/demo/student`
- 全局中间件：`/demo/student`

- 关于 API Path 的更多信息，参见: [Controller](../../rest-api/controller.md)

## 查看当前生效的系统中间件清单

可以直接在 Controller action 中输出当前生效的系统中间件清单。

```diff
class ControllerStudent {
  @Web.get()
  async findMany() {
+   this.bean.onion.middlewareSystem.inspect();
  }
}
```

- `this.bean.onion`: 取得全局 Service 实例 `onion`
- `.middlewareSystem`: 取得与中间件相关的 Service 实例
- `.inspect`: 输出当前生效的系统中间件清单

当访问`findMany` API 时，会自动在控制台输出当前生效的系统中间件清单，效果如下：

![](../../../assets/img/aop/middleware-2.png)
