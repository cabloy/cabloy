# 初始化数据

Zova SSR 以非常直观的方式在服务端准备好初始数据，并同步到客户端，自动完成水合。

## \_\_init\_\_与Model

下面以模块`demo-todo`的页面组件`todo`为例：

`src/suite/a-demo/modules/demo-todo/src/page/todo/controller.ts`

```typescript
import { ModelTodo } from '../../bean/model.todo.js';

@Controller()
export class ControllerPageTodo {
  @Use()
  $$modelTodo: ModelTodo;

  protected async __init__() {
    // todos
    const queryTodos = this.$$modelTodo.select();
    await queryTodos.suspense();
    if (queryTodos.error) throw queryTodos.error;
  }
}
```

1. 创建一个 model bean：`ModelTodo`，参见：[Model: 异步数据](../model/async-data.md)
2. 通过`@Use`注入 ModelTodo
3. 直接在`__init__`方法中调用 `suspense` 方法准备好数据

## 原理分析

1. Model bean 底层基于 [TanStack Query](../model/introduction.md)，自动支持 SSR，服务端的数据会同步到客户端，自动完成水合
2. `__init__`支持异步调用，在服务端初始化数据，在客户端再次执行时，会自动从水合后的缓存中取得服务端准备好的数据
