# 局部拦截器

## 创建拦截器

比如，在模块 demo-student 中创建一个局部拦截器: `logger`

### 1. Cli命令

```bash
$ vona :create:bean interceptor logger --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Aspect/Interceptor`
:::

## 拦截器定义

```typescript
export interface IInterceptorOptionsLogger extends IDecoratorInterceptorOptions {}

@Interceptor<IInterceptorOptionsLogger>()
class InterceptorLogger {
  async execute(_options: IInterceptorOptionsLogger, next: Next) {
    const timeBegin = Date.now();
    const res = await next();
    const timeEnd = Date.now();
    console.log('time: ', timeEnd - timeBegin);
    return res;
  }
}
```

- `IInterceptorOptionsLogger`: 定义拦截器参数
- `execute`: 输出执行时长

## 使用拦截器

### 1. 标注控制器方法

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
class ControllerStudent {
  @Web.get()
+ @Aspect.interceptor('demo-student:logger')
  async findMany() {}
}
```

- `@Aspect.interceptor`: 此装饰器用于使用局部拦截器，只需传入拦截器的名称
  - logger 拦截器属于模块`demo-student`，因此完整的名称是`demo-student:logger`

### 2. 标注控制器类

可以针对控制器类使用拦截器，从而类中所有方法都会应用此拦截器。

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
+ @Aspect.interceptor('demo-student:logger')
class ControllerStudent {
  @Web.get()
  async findMany() {}
}
```

## 拦截器参数

可以为拦截器定义参数，通过参数更灵活的配置拦截器逻辑。

比如，为 logger 拦截器定义`prefix`参数，用于控制输出格式。

### 1. 定义参数类型

```diff
export interface IInterceptorOptionsLogger extends IDecoratorInterceptorOptions {
+ prefix: string;
}
```

### 2. 提供参数缺省值

```diff
@Interceptor<IInterceptorOptionsLogger>({
+ prefix: 'time',
})
```

### 3. 使用参数

```diff
export interface IInterceptorOptionsLogger extends IDecoratorInterceptorOptions {
  prefix: string;
}

@Interceptor<IInterceptorOptionsLogger>({
  prefix: 'time',
})
class InterceptorLogger {
  async execute(options: IInterceptorOptionsLogger, next: Next) {
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

可以针对某个 API 单独指定局部拦截器的参数。

```diff
class ControllerStudent {
  @Web.get()
+ @Aspect.interceptor('demo-student:logger', { prefix: 'elapsed' })
  async findMany() {}
}
```

- 在使用拦截器时直接提供参数值即可

### 5. App Config

可以在 App Config 中配置拦截器参数。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  interceptor: {
    'demo-student:logger': {
      prefix: 'elapsed',
    },
  },
};
```

### 6. 参数优先级

`使用时指定参数` > `App Config` > `参数缺省值`
