# 参数管道

在实际开发当中，很少使用`局部管道`和`全局管道`，而是使用`参数管道`

## 创建参数管道

参数管道并不是独立存在的，而是在`局部管道`的基础上创建。下面以局部管道`number`为例，演示如何创建参数管道。

```diff
+ import { createArgumentPipe, Pipe } from 'vona-module-a-aspect';

@Pipe()
class PipeNumber {
  async transform(value: TypePipeNumberData) {
    const valueNew = Number(value);
    if (Number.isNaN(valueNew)) this.app.throw(400);
    return valueNew;
  }
}

+ export const ArgNumber = createArgumentPipe('demo-student:number');
```

- `createArgumentPipe`: 传入局部管道名称，创建参数管道的装饰器

## 使用参数管道

直接在方法的参数上使用参数管道。

```diff
class ControllerStudent {
  @Web.get(':id')
+ async findOne(@ArgNumber() @Arg.param('id') id: any) {}
}
```

- `@Arg.param`: 是内置参数管道
- 参数管道顺序：`@Arg.param` > `@ArgNumber`

## 使用时指定参数

可以在使用管道时，指定管道参数。

```diff
class ControllerStudent {
  @Web.get(':id')
- async findOne(@ArgNumber() @Arg.param('id') id: any) {}
+ async findOne(@ArgNumber({ errorCode: 500 }) @Arg.param('id') id: any) {}
}
```

::: info
为什么使用`id: any`?

这是为了演示参数管道的使用。如果使用`id: number`，就已经具备了 number 类型的参数校验能力，不必使用`@ArgNumber()`
:::
