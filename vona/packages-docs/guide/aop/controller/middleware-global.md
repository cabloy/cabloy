# Global Middleware

## Create Middleware

For example, we create a Global Middleware `logger` in the module demo-student.

### 1. Cli command

```bash
$ vona :create:bean middleware logger --module=demo-student --boilerplate=global
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Aspect/Middleware Global`
:::

## Middleware Definition

```typescript
export interface IMiddlewareOptionsLogger extends IDecoratorMiddlewareOptionsGlobal {}

@Middleware<IMiddlewareOptionsLogger>()
@Global()
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

- `IMiddlewareOptionsLogger`: Defines middleware parameters
- `execute`: Outputs execution time

## Using Middleware

Unlike local middleware, the system automatically loads global middlewares and makes them effective.

## Middleware Parameters

You can define parameters for middleware, allowing for more flexible configuration of middleware logic.

For example, define the `prefix` parameter for the logger middleware to control the output format.

### 1. Defining parameter types

```diff
export interface IMiddlewareOptionsLogger extends IDecoratorMiddlewareOptionsGlobal {
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
export interface IMiddlewareOptionsLogger extends IDecoratorMiddlewareOptionsGlobal {
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

You can specify global middleware parameters for a specific API.

```diff
class ControllerStudent {
  @Web.get()
+ @Aspect.middlewareGlobal('demo-student:logger', { prefix: 'elapsed' })
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

### 6. Parameters precedence

`Specify parameters when using` > `App Config` > `Default values`

## Middleware Order

Since global middlewares ard loaded and enabled by default, VonaJS provides two parameters to control the order in which middleware is loaded.

### 1. dependencies

For example, the system has a built-in global middleware `a-core:gate`, and we hope that the loading order is as follows: `a-core:gate` > `Current`

```diff
@Middleware({
+ dependencies: 'a-core:gate',
  prefix: 'time',
})
class MiddlewareLogger {}
```

### 2. dependents

The order of `dependents` is just the opposite of `dependencies`. We hope that the loading order is as follows: `Current` > `a-core:gate`

```diff
@Middleware({
+ dependents: 'a-core:gate',
  prefix: 'time',
})
class MiddlewareLogger {}
```

## Middleware Enable/Disable

You can control `enable/disable` of global middleware for certain APIs.

### 1. Enable

- Disable for an API

```diff
class ControllerStudent {
  @Web.get()
+ @Aspect.middlewareGlobal('demo-student:logger', { enable: false })
  async findMany() {}
}
```

- Disable for all APIs

`src/backend/config/config/config.ts`

```diff
// onions
config.onions = {
  middleware: {
    'demo-student:logger': {
+     enable: false,
    },
  },
};
```

### 2. Meta

Allows global middleware to take effect in a specified operating environment.

| Name   | Type             | Description                                                                           |
| ------ | ---------------- | ------------------------------------------------------------------------------------- |
| flavor | string\|string[] | See: [Runtime Environments and Flavors](../../env-config/mode-flavor/introduction.md) |
| mode   | string\|string[] | See: [Runtime Environments and Flavors](../../env-config/mode-flavor/introduction.md) |

- Example

```diff
@Middleware({
+ meta: {
+   flavor: 'normal',
+   mode: 'dev',
+ },
})
class MiddlewareLogger {}
```

### 3. match/ignore

You can enable/disable global middleware for some specific APIs.

| Name   | Type                               | Description               |
| ------ | ---------------------------------- | ------------------------- |
| match  | string\|regexp\|(string\|regexp)[] | For which APIs to enable  |
| ignore | string\|regexp\|(string\|regexp)[] | For which APIs to disable |

## Inspect

You can directly inspect the currently effective global middleware list in the Controller action.

```diff
class ControllerStudent {
  @Web.get()
  async findMany() {
+   this.bean.onion.middleware.inspect();
  }
}
```

- `this.bean.onion`: Get the global Service instance `onion`
- `.middleware`: Get the Service instance related to the middleware
- `.inspect`: Output the currently effective global middleware list

When accessing the `findMany` API, the current list of global middleware in effect will be automatically output to the console, as shown below:

![](../../../assets/img/aop/middleware-1.png)
