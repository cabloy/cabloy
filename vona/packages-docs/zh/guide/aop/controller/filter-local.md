# 局部过滤器

## 创建过滤器

比如，在模块 demo-student 中创建一个局部过滤器: `test`，对自定义错误`demo-student:1001`定制日志输出。

### 1. Cli命令

```bash
$ vona :create:bean filter test --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Aspect/Filter`
:::

## 过滤器定义

```typescript
export interface IFilterOptionsTest extends IDecoratorFilterOptions {}

@Filter<IFilterOptionsTest>()
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

- 先调用`next()`，如果返回 true，说明 Error 已经被处理，那么就直接返回
- 处理指定的 Error，返回 true，就意味着已经处理，忽略系统默认的日志输出行为

## 使用过滤器

### 1. 标注控制器方法

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
class ControllerStudent {
  @Web.post()
+ @Aspect.filter('demo-student:test')
  async create() {}
}
```

- `@Aspect.filter`: 此装饰器用于使用局部过滤器，只需传入过滤器的名称
  - test 过滤器属于模块`demo-student`，因此完整的名称是`demo-student:test`

### 2. 标注控制器类

可以针对控制器类使用过滤器，从而类中所有方法都会应用此过滤器。

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
+ @Aspect.filter('demo-student:test')
class ControllerStudent {
  @Web.post()
  async create() {}
}
```

## 过滤器参数

可以为过滤器定义参数，通过参数更灵活的配置过滤器逻辑。

比如，为 test 过滤器定义`prefix`参数，用于定制日志输出的格式。

### 1. 定义参数类型

```diff
export interface IFilterOptionsTest extends IDecoratorFilterOptions {
+  prefix: string;
}
```

### 2. 提供参数缺省值

```diff
@Filter<IFilterOptionsTest>({
+ prefix: 'Custom Error',
})
```

### 3. 使用参数

```diff
export interface IFilterOptionsTest extends IDecoratorFilterOptions {
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

### 4. 使用时指定参数

可以针对某个 API 单独指定局部过滤器的参数。

```diff
class ControllerStudent {
  @Web.post()
+ @Aspect.filter('demo-student:test', { prefix: 'Test Error' })
  async create(){}
}
```

- 在使用过滤器时直接提供参数值即可

### 5. App Config

可以在 App Config 中配置过滤器参数。

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

### 6. 参数优先级

`使用时指定参数` > `App Config` > `参数缺省值`
