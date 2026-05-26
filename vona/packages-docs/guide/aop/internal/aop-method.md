# AOP Method

`AOP Method` allows us to extend the logic directly on the Class Method through decorators.

## Create AOP Method

For example, we create a AOP Method `log` in the module demo-student to output the execution time of method.

### 1. Cli command

```bash
$ vona :create:bean aopMethod log --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Aspect/AOP Method`
:::

## AOP Method Definition

```typescript
export interface IAopMethodOptionsLog extends IDecoratorAopMethodOptions {}

@AopMethod<IAopMethodOptionsLog>()
class AopMethodLog {
  async execute(
    _options: IAopMethodOptionsLog,
    _args: [],
    next: Next | NextSync,
    _receiver: any,
    _prop: string,
  ): Promise<any> {
    const timeBegin = Date.now();
    const res = await next();
    const timeEnd = Date.now();
    console.log('time:', timeEnd - timeBegin);
    return res;
  }
}
```

- `IAopMethodOptionsLog`: Defines aop method parameters
- `execute`: Outputs execution time

## Using AOP Method

### 1. Annotating controller actions

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
class ControllerStudent {
  @Web.get()
+ @Aspect.aopMethod('demo-student:log')
  async findMany() {}
}
```

- `@Aspect.aopMethod`: This decorator is used to use AOP Method. Simply pass the AOP Method name
  - The log AOP Method belongs to the `demo-student` module, so the full name is `demo-student:log`

### 2. Annotating service methods

```diff
import { Aspect } from 'vona-module-a-aspect';

@Service()
class ServiceStudent {
+ @Aspect.aopMethod('demo-student:log')
  async findMany(){}
```

## AOP Method Parameters

You can define parameters for AOP Method, allowing for more flexible configuration of AOP Method logic.

For example, define the `prefix` parameter for the log AOP Method to control the output format.

### 1. Defining parameter types

```diff
export interface IAopMethodOptionsLog extends IDecoratorAopMethodOptions {
+ prefix: string;
}
```

### 2. Providing default values ​​for parameters

```diff
@AopMethod<IAopMethodOptionsLog>({
+ prefix: 'time',
})
```

### 3. Using Parameters

```diff
export interface IAopMethodOptionsLog extends IDecoratorAopMethodOptions {
  prefix: string;
}

@AopMethod<IAopMethodOptionsLog>({
  prefix: 'time',
})
class AopMethodLog {
  async execute(options: IAopMethodOptionsLog, _args: [], next: Next | NextSync, _receiver: any, _prop: string): Promise<any> {
    const timeBegin = Date.now();
    const res = await next();
    const timeEnd = Date.now();
-   console.log('time:', timeEnd - timeBegin);
+   console.log(`${options.prefix}:`, timeEnd - timeBegin);
    return res;
  }
}
```

### 4. Specify parameters when using

You can specify AOP Method parameters for any specific Class Method.

```diff
class ControllerStudent {
  @Web.get()
+ @Aspect.aopMethod('demo-student:log', { prefix: 'elapsed' })
  async findMany() {}
}
```

- When using AOP Method, just provide the parameter value directly

### 5. App Config

AOP Method parameters can be configured in App Config.

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  aopMethod: {
    'demo-student:log': {
      prefix: 'elapsed',
    },
  },
};
```

### 6. Parameter precedence

`Specify parameters when using` > `App Config` > `Default values`

## AOP Method Enable/Disable

You can control `enable/disable` of AOP Method.

### 1. Enable

- Disable for an Class Method

```diff
class ControllerStudent {
  @Web.get()
+ @Aspect.aopMethod('demo-student:log', { enable: false })
  async findMany() {}
}
```

- Disable for Class Methods

`src/backend/config/config/config.ts`

```diff
// onions
config.onions = {
  aopMethod: {
    'demo-student:log': {
+     enable: false,
    },
  },
};
```

### 2. Meta

Allows AOP Method to take effect in a specified operating environment.

| Name   | Type             | Description                                                                           |
| ------ | ---------------- | ------------------------------------------------------------------------------------- |
| flavor | string\|string[] | See: [Runtime Environments and Flavors](../../env-config/mode-flavor/introduction.md) |
| mode   | string\|string[] | See: [Runtime Environments and Flavors](../../env-config/mode-flavor/introduction.md) |

- Example

```diff
@AopMethod({
+ meta: {
+   flavor: 'normal',
+   mode: 'dev',
+ },
})
class AopMethodLog {}
```
