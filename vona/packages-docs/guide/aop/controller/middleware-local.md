# Local Middleware

## Create Middleware

For example, we create a Local Middleware `logger` in the module demo-student.

### 1. Cli command

```bash
$ vona :create:bean middleware logger --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Aspect/Middleware`
:::

## Middleware Definition

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

- `IMiddlewareOptionsLogger`: Defines middleware parameters
- `execute`: Outputs execution time

## Using Middleware

### 1. Annotating controller actions

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
class ControllerStudent {
  @Web.get()
+ @Aspect.middleware('demo-student:logger')
  async findMany() {}
}
```

- `@Aspect.middleware`: This decorator is used to use local middleware. Simply pass the middleware name
  - The logger middleware belongs to the `demo-student` module, so the full name is `demo-student:logger`

### 2. Annotating controller class

You can use middleware for controller classes so that all actions in the class will apply this middleware.

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
+ @Aspect.middleware('demo-student:logger')
class ControllerStudent {
  @Web.get()
  async findMany() {}
}
```

## Middleware Parameters

You can define parameters for middleware, allowing for more flexible configuration of middleware logic.

For example, define the `prefix` parameter for the logger middleware to control the output format.

### 1. Defining parameter types

```diff
export interface IMiddlewareOptionsLogger extends IDecoratorMiddlewareOptions {
+ prefix: string;
}
```

### 2. Providing default values ​​for parameters

```diff
@Middleware<IMiddlewareOptionsLogger>({
+ prefix: 'time',
})
```

### 3. Using Parameters

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

### 4. Specify parameters when using

You can specify local middleware parameters for a specific API.

```diff
class ControllerStudent {
  @Web.get()
+ @Aspect.middleware('demo-student:logger', { prefix: 'elapsed' })
  async findMany() {}
}
```

- When using middleware, just provide the parameter value directly

### 5. App Config

Middleware parameters can be configured in App Config.

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

### 6. Parameter precedence

`Specify parameters when using` > `App Config` > `Default values`
