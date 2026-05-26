# AOP Method

`AOP Method`允许我们直接在 Class Method 上通过装饰器切入逻辑。

## 创建AOP Method

比如，在模块 demo-student 中创建一个 AOP Method: `log`，用于输出方法的执行时长。

### 1. Cli命令

```bash
$ vona :create:bean aopMethod log --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Aspect/Aop Method`
:::

## AOP Method定义

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

- `IAopMethodOptionsLog`: 定义 AOP Method 参数
- `execute`: 输出执行时长

## 使用AOP Method

可以在任何 Class 的任何方法上使用 AOP Method。

### 1. 标注Controller方法

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
class ControllerStudent {
  @Web.get()
+ @Aspect.aopMethod('demo-student:log')
  async findMany() {}
}
```

- `@Aspect.aopMethod`: 此装饰器用于使用 AOP Method，只需传入 AOP Method 的名称
  - log AOP Method 属于模块`demo-student`，因此完整的名称是`demo-student:log`

### 2. 标注Service方法

```diff
import { Aspect } from 'vona-module-a-aspect';

@Service()
class ServiceStudent {
+ @Aspect.aopMethod('demo-student:log')
  async findMany(){}
```

## AOP Method参数

可以为 AOP Method 定义参数，通过参数更灵活的配置 AOP Method 逻辑。

比如，为 log AOP Method 定义`prefix`参数，用于控制输出格式。

### 1. 定义参数类型

```diff
export interface IAopMethodOptionsLog extends IDecoratorAopMethodOptions {
+ prefix: string;
}
```

### 2. 提供参数缺省值

```diff
@AopMethod<IAopMethodOptionsLog>({
+ prefix: 'time',
})
```

### 3. 使用参数

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

### 4. 使用时指定参数

可以针对某个 Class Method 单独指定 AOP Method 的参数。

```diff
class ControllerStudent {
  @Web.get()
+ @Aspect.aopMethod('demo-student:log', { prefix: 'elapsed' })
  async findMany() {}
}
```

- 在使用 AOP Method 时直接提供参数值即可

### 5. App Config

可以在 App Config 中配置 AOP Method 参数。

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

### 6. 参数优先级

`使用时指定参数` > `App Config` > `参数缺省值`

## AOP Method启用/禁用

可以针对某些 Class Method 控制 AOP Method 的`启用/禁用`

### 1. Enable

- 针对某个 Class Method 禁用

```diff
class ControllerStudent {
  @Web.get()
+ @Aspect.aopMethod('demo-student:log', { enable: false })
  async findMany() {}
}
```

- 针对所有 Class Methods 禁用

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

可以让 AOP Method 在指定的运行环境生效。

| 名称   | 类型             | 说明                                                                   |
| ------ | ---------------- | ---------------------------------------------------------------------- |
| flavor | string\|string[] | 参见: [运行环境与Flavor](../../env-config/mode-flavor/introduction.md) |
| mode   | string\|string[] | 参见: [运行环境与Flavor](../../env-config/mode-flavor/introduction.md) |

- 举例

```diff
@AopMethod({
+ meta: {
+   flavor: 'normal',
+   mode: 'dev',
+ },
})
class AopMethodLog {}
```
