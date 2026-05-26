# 局部管道

## 创建管道

比如，在模块 demo-student 中创建一个局部管道: `number`，将请求参数转换为`number`类型。

### 1. Cli命令

```bash
$ vona :create:bean pipe number --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Aspect/Pipe`
:::

## 管道定义

```typescript
export type TypePipeNumberData = unknown;

export type TypePipeNumberResult = number;

export interface IPipeOptionsNumber extends IDecoratorPipeOptions {}

@Pipe<IPipeOptionsNumber>()
class PipeNumber {
  async transform(
    value: TypePipeNumberData,
    _metadata: RouteHandlerArgumentMeta,
    _options: IPipeOptionsNumber,
  ): Promise<TypePipeNumberResult> {
    const valueNew = Number(value);
    if (Number.isNaN(valueNew)) this.app.throw(400);
    return valueNew;
  }
}
```

- `TypePipeNumberData`: 入参类型
- `TypePipeNumberResult`: 结果类型
- `IPipeOptionsNumber`: 定义管道参数
- `transform`: 对参数进行判断和转换

## 使用管道

### 1. 标注控制器方法

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
class ControllerStudent {
  @Web.get(':id')
+ @Aspect.pipe('demo-student:number')
  async findOne(id: number) {}
}
```

- `@Aspect.pipe`: 此装饰器用于使用局部管道，只需传入管道的名称
  - number 管道属于模块`demo-student`，因此完整的名称是`demo-student:number`

### 2. 标注控制器类

可以针对控制器类使用管道，从而类中所有方法都会应用此管道。

```diff
import { Aspect } from 'vona-module-a-aspect';

@Controller()
+ @Aspect.pipe('demo-student:number')
class ControllerStudent {
  @Web.get(':id')
  async findOne(id: number) {}
}
```

## 管道参数

可以为管道定义参数，通过参数更灵活的配置管道逻辑。

比如，为 number 管道定义`errorCode`参数，如果传入的请求参数不是 number 类型就抛出异常，错误代码为`errorCode`

### 1. 定义参数类型

```diff
export interface IPipeOptionsNumber extends IDecoratorPipeOptions {
+ errorCode: number;
}
```

### 2. 提供参数缺省值

```diff
@Pipe<IPipeOptionsNumber>({
+ errorCode: 400,
})
```

### 3. 使用参数

```diff
export interface IPipeOptionsNumber extends IDecoratorPipeOptions {
  errorCode: number;
}

@Pipe<IPipeOptionsNumber>({
  errorCode: 400,
})
export class PipeNumber extends BeanBase implements IPipeTransform<TypePipeNumberData, TypePipeNumberResult> {
  async transform(value: TypePipeNumberData, _metadata: RouteHandlerArgumentMeta, options: IPipeOptionsNumber): Promise<TypePipeNumberResult> {
    const valueNew = Number(value);
-    if (Number.isNaN(valueNew)) this.app.throw(400);
+    if (Number.isNaN(valueNew)) this.app.throw(options.errorCode);
    return valueNew;
  }
}
```

### 4. 使用时指定参数

可以针对某个 API 单独指定局部管道的参数。

```diff
class ControllerStudent {
  @Web.get(':id')
+ @Aspect.pipe('demo-student:number', { errorCode: 500 })
  async findOne(id: number) {}
}
```

- 在使用管道时直接提供参数值即可

### 5. App Config

可以在 App Config 中配置管道参数。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  pipe: {
    'demo-student:number': {
      errorCode: 500,
    },
  },
};
```

### 6. 参数优先级

`使用时指定参数` > `App Config` > `参数缺省值`
