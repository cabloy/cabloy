# Init Data

Zova SSR prepares the initial data on the server in a very intuitive way and synchronizes it to the client, and automatically completing the hydration.

## \_\_init\_\_与Model

The following takes the page component `todo` of the module `demo-todo` as an example:

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

1. Create a model bean: `ModelTodo`, see: [Model: Async Data](../model/async-data.md)
2. Inject ModelTodo through `@Use`
3. Call the `suspense` method directly in the `__init__` method to prepare the data

## Principle analysis

1. The underlying Model bean is based on [TanStack Query](../model/introduction.md), automatically supports SSR, and the data on the server will be synchronized to the client, and hydration will be completed automatically
2. `__init__` supports asynchronous calls, initializes data on the server, and when the client executes again, it will automatically obtain the data prepared by the server from the hydrated cache
