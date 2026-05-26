# 局部中间件

## 创建中间件

比如，在模块 demo-student 中创建一个局部中间件: `logger`

### 1. Cli命令

```bash
$ vona :create:bean middleware logger --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Aspect/Middleware`
:::

## 中间件定义

```typescript
export interface IMiddlewareOptionsLogger extends IDecoratorMiddlewareOptions {}

@Middleware<IMiddlewareOptionsLogger>()
class MiddlewareLogger {
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

### 1. 标注控制器方法

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
class ControllerStudent {
  @Web.get()
+ @Aspect.middleware('demo-student:logger')
  async findMany() {}
}
```

- `@Aspect.middleware`: 此装饰器用于使用局部中间件，只需传入中间件的名称
  - logger 中间件属于模块`demo-student`，因此完整的名称是`demo-student:logger`

### 2. 标注控制器类

可以针对控制器类使用中间件，从而类中所有方法都会应用此中间件。

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
+ @Aspect.middleware('demo-student:logger')
class ControllerStudent {
  @Web.get()
  async findMany() {}
}
```

## 中间件参数

可以为中间件定义参数，通过参数更灵活的配置中间件逻辑。

比如，为 logger 中间件定义`prefix`参数，用于控制输出格式。

### 1. 定义参数类型

```diff
export interface IMiddlewareOptionsLogger extends IDecoratorMiddlewareOptions {
+ prefix: string;
}
```

### 2. 提供参数缺省值

```diff
@Middleware<IMiddlewareOptionsLogger>({
+ prefix: 'time',
})
```

### 3. 使用参数

```diff
export interface IMiddlewareOptionsLogger extends IDecoratorMiddlewareOptions {
  prefix: string;
}

@Middleware<IMiddlewareOptionsLogger>({
  prefix: 'time',
})
class MiddlewareLogger {
  async execute(options: IMiddlewareOptionsLogger, next: Next) {
    const timeBegin = Date.now();
    const res = await next();
    const timeEnd = Date.now();
-   console.log('time: ', timeEnd - timeBegin);
+   console.log(`${options.prefix}: `, timeEnd - timeBegin);
    return res;
  }
}
```

### 4. 使用时指定参数

可以针对某个 API 单独指定局部中间件的参数。

```diff
class ControllerStudent {
  @Web.get()
+ @Aspect.middleware('demo-student:logger', { prefix: 'elapsed' })
  async findMany() {}
}
```

- 在使用中间件时直接提供参数值即可

### 5. App Config

可以在 App Config 中配置中间件参数。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  middleware: {
    'demo-student:logger': {
      prefix: 'elapsed',
    },
  },
};
```

### 6. 参数优先级

`使用时指定参数` > `App Config` > `参数缺省值`
