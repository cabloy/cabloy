# Local Interceptor

## Create Interceptor

For example, we create a Local Interceptor `logger` in the module demo-student.

### 1. Cli command

```bash
$ vona :create:bean interceptor logger --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Aspect/Interceptor`
:::

## Interceptor Definition

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

- `IInterceptorOptionsLogger`: Defines interceptor parameters
- `execute`: Outputs execution time

## Using Interceptor

### 1. Annotating controller actions

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
class ControllerStudent {
  @Web.get()
+ @Aspect.interceptor('demo-student:logger')
  async findMany() {}
}
```

- `@Aspect.interceptor`: This decorator is used to use local interceptor. Simply pass the interceptor name
  - The logger interceptor belongs to the `demo-student` module, so the full name is `demo-student:logger`

### 2. Annotating controller class

You can use interceptor for controller classes so that all actions in the class will apply this interceptor.

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
+ @Aspect.interceptor('demo-student:logger')
class ControllerStudent {
  @Web.get()
  async findMany() {}
}
```

## Interceptor Parameters

You can define parameters for interceptor, allowing for more flexible configuration of interceptor logic.

For example, define the `prefix` parameter for the logger interceptor to control the output format.

### 1. Defining parameter types

```diff
export interface IInterceptorOptionsLogger extends IDecoratorInterceptorOptions {
+ prefix: string;
}
```

### 2. Providing default values ​​for parameters

```diff
@Interceptor<IInterceptorOptionsLogger>({
+ prefix: 'time',
})
```

### 3. Using Parameters

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

### 4. Specify parameters when using

You can specify local interceptor parameters for a specific API.

```diff
class ControllerStudent {
  @Web.get()
+ @Aspect.interceptor('demo-student:logger', { prefix: 'elapsed' })
  async findMany() {}
}
```

- When using interceptor, just provide the parameter value directly

### 5. App Config

Interceptor parameters can be configured in App Config.

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

### 6. Parameter precedence

`Specify parameters when using` > `App Config` > `Default values`
