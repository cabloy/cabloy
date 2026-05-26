# Global Filter

## Create Filter

For example, create a global filter `test` in the module demo-student to customize the log output for the custom error `demo-student:1001`

### 1. Cli command

```bash
$ vona :create:bean filter test --module=demo-student --boilerplate=global
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Aspect/Filter Global`
:::

## Filter Definition

```typescript
export interface IFilterOptionsTest extends IDecoratorFilterOptionsGlobal {}

@Filter<IFilterOptionsTest>()
@Global()
class FilterTest {
  async log(err: Error, _options: IFilterOptionsTest, next: Next): Promise<boolean> {
    // next
    if ((await next()) === true) return true;
    // custom
    if (err.code === 'demo-student:1001') {
      console.error(`Custom Error: ${err.code}, ${err.message}`);
      return true;
    }
    return false;
  }
}
```

- First call `next()`. If it returns true, the error has been handled, and then return directly
- Handle the specified error. If true is returned, it means it has been handled, ignoring the system's default logging behavior

## Using Filter

Unlike local filter, the system automatically loads global filters and makes them effective.

## Filter Parameters

You can define parameters for filter, allowing for more flexible configuration of filter logic.

For example, define the `prefix` parameter for the test filter to customize the format of the log output.

### 1. Defining parameter types

```diff
export interface IFilterOptionsTest extends IDecoratorFilterOptionsGlobal {
+ prefix: string;
}
```

### 2. Providing default values ​​for parameters

```diff
@Filter<IFilterOptionsTest>({
+ prefix: 'Custom Error',
})
```

### 3. Using Parameters

```diff
export interface IFilterOptionsTest extends IDecoratorFilterOptionsGlobal {
  prefix: string;
}

@Filter<IFilterOptionsTest>({
  prefix: 'Custom Error',
})
export class FilterTest extends BeanBase implements IFilterLog {
  async log(err: Error, options: IFilterOptionsTest, next: Next): Promise<boolean> {
    // next
    if ((await next()) === true) return true;
    // custom
    if (err.code === 'demo-student:1001') {
-     console.error(`Custom Error: ${err.code}, ${err.message}`);
+     console.error(`${options.prefix}: ${err.code}, ${err.message}`);
      return true;
    }
    return false;
  }
}
```

### 4. Specify parameters when using

You can specify global filter parameters for a specific API.

```diff
class ControllerStudent {
  @Web.post()
+ @Aspect.filterGlobal('demo-student:test', { prefix: 'Test Error' })
  async create(){}
}
```

- When using filter, just provide the parameter value directly

### 5. App Config

Filter parameters can be configured in App Config.

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  filter: {
    'demo-student:test': {
      prefix: 'Test Error',
    },
  },
};
```

### 6. Parameter precedence

`Specify parameters when using` > `App Config` > `Default values`

## Filter Order

Since global filters ard loaded and enabled by default, VonaJS provides two parameters to control the order in which filter is loaded.

### 1. dependencies

For example, the system has a built-in global filter `a-error:error`, and we hope that the loading order is as follows: `a-error:error` > `Current`

```diff
@Filter({
+ dependencies: 'a-error:error',
  prefix: 'Custom Error',
})
class FilterTest {}
```

### 2. dependents

The order of `dependents` is just the opposite of `dependencies`. We hope that the loading order is as follows: `Current` > `a-error:error`

```diff
@Filter({
+ dependents: 'a-error:error',
  prefix: 'Custom Error',
})
class FilterTest {}
```

## Filter Enable/Disable

You can control `enable/disable` of global filter for certain APIs.

### 1. Enable

- Disable for an API

```diff
class ControllerStudent {
  @Web.post()
+ @Aspect.filterGlobal('demo-student:test', { enable: false })
  async create() {}
}
```

- Disable for all APIs

`src/backend/config/config/config.ts`

```diff
// onions
config.onions = {
  filter: {
    'demo-student:test': {
+     enable: false,
    },
  },
};
```

### 2. Meta

Allows global filter to take effect in a specified operating environment.

| Name   | Type             | Description                                                                           |
| ------ | ---------------- | ------------------------------------------------------------------------------------- |
| flavor | string\|string[] | See: [Runtime Environments and Flavors](../../env-config/mode-flavor/introduction.md) |
| mode   | string\|string[] | See: [Runtime Environments and Flavors](../../env-config/mode-flavor/introduction.md) |

- Example

```diff
@Filter({
+ meta: {
+   flavor: 'normal',
+   mode: 'dev',
+ },
})
class FilterTest {}
```

### 3. match/ignore

You can enable/disable global filter for some specific APIs.

| Name   | Type                               | Description               |
| ------ | ---------------------------------- | ------------------------- |
| match  | string\|regexp\|(string\|regexp)[] | For which APIs to enable  |
| ignore | string\|regexp\|(string\|regexp)[] | For which APIs to disable |

## Inspect

You can directly inspect the currently effective global filter list in the Controller action.

```diff
class ControllerStudent {
  @Web.post()
  async create() {
+   this.bean.onion.filter.inspect();
  }
}
```

- `this.bean.onion`: Get the global Service instance `onion`
- `.filter`: Get the Service instance related to the filter
- `.inspect`: Output the currently effective global filter list

When accessing the `create` API, the current list of global filter in effect will be automatically output to the console, as shown below:

![](../../../assets/img/aop/filter-1.png)
