# 异步数据

TanStack Query 的核心是对服务端数据进行管理。下面，我们演示如何在 Model 中实现 CRUD 功能。

- 完整代码示例，请参见：[demo-todo](https://github.com/zovajs/zova/blob/main/zova-dev/src/suite/a-demo/modules/demo-todo/src/bean/model.todo.ts)

## 数据获取：select

### 如何定义

```typescript
@Model()
export class ModelTodo {
  select() {
    return this.$useStateData({
      queryKey: ['select'],
      queryFn: async () => {
        return this.scope.api.todo.select();
      },
    });
  }
}
```

- 调用$useStateData 创建 Query 对象
  - 为何不使用`$useQuery`方法？因为异步数据一般是在需要时才进行异步加载。因此我们需要确保在多次调用`select`方法时始终返回同一个 Query 对象，所以必须使用`$useStateData`方法
- 传入 queryKey，确保本地缓存的唯一性
- 传入 queryFn，在合适的时机调用此函数获取服务端数据
  - service.todo.select：参见[Api服务](../../essentials/scope/api.md)

### 如何使用

`demo-todo/src/page/todo/controller.ts`

```typescript
import { ModelTodo } from '../../bean/model.todo.js';

export class ControllerPageTodo {
  @Use()
  $$modelTodo: ModelTodo;
}
```

- 注入 Model Bean 实例：$$modelTodo

`demo-todo/src/page/todo/render.tsx`

```typescript
export class RenderTodo {
  render() {
    const todos = this.$$modelTodo.select();
    return (
      <div>
        <div>isLoading: {todos.isLoading}</div>
        <div>
          {todos.data?.map(item => {
            return <div>{item.title}</div>;
          })}
        </div>
      </div>
    );
  }
}
```

- 调用 select 方法获取 Query 对象
  - render 方法会多次执行，重复调用 select 方法返回的是同一个 Query 对象
- 直接使用 Query 对象中的状态和数据
  - 参见：[TanStack Query: Queries](https://tanstack.com/query/latest/docs/framework/vue/guides/queries)

### 如何支持SSR

在 SSR 模式下，我们需要这样使用异步数据：在服务端加载状态数据，然后通过 render 方法渲染成 html 字符串。状态数据和 html 字符串会同时发送到客户端，客户端在进行水合时仍然使用此相同的状态数据，从而保持状态的一致性。

要实现以上逻辑，在 Zova Model 中只需要执行一个步骤：

`demo-todo/src/page/todo/controller.ts`

```typescript{8-10}
import { ModelTodo } from '../../bean/model.todo.js';

export class ControllerPageTodo {
  @Use()
  $$modelTodo: ModelTodo;

  protected async __init__() {
    const queryTodos = this.$$modelTodo.select();
    await queryTodos.suspense();
    if (queryTodos.error) throw queryTodos.error;
  }
}
```

- 只需要在`__init__`方法中调用`suspense`等待异步数据加载完成

## 数据获取：get

### 如何定义

```typescript
@Model()
export class ModelTodo {
  get(params?: ApiTodoGetParams) {
    if (!params) return undefined;
    return this.$useStateData({
      queryKey: ['get', params.id],
      queryFn: async () => {
        return this.scope.api.todo.get(params);
      },
    });
  }
}
```

- 调用$useStateData 创建 Query 对象
- 传入 queryKey，确保本地缓存的唯一性
  - 由于是单条数据，需要指定条目的关键字段值
- 传入 queryFn，在合适的时机调用此函数获取服务端数据

### 如何使用

```typescript
export class RenderTodo {
  render() {
    const params = { id: '1' };
    const todo = this.$$modelTodo.get(params);
    return (
      <div>
        <div>todo title: {todo?.data?.title}</div>
        <div>{todo?.error?.message}</div>
      </div>
    );
  }
}
```

- 调用$$modelTodo.get()获取 Query 对象
  - 重复调用此方法返回的是同一个 Query 对象
- 直接使用 Query 对象中的状态和数据

### 如何支持SSR

同`select`

## 数据变更：insert

### 如何定义

```typescript
@Model()
export class ModelTodo {
  insert() {
    return this.$useMutationData<void, ApiTodoIntertParams>({
      mutationKey: ['insert'],
      mutationFn: async params => {
        return this.scope.api.todo.insert(params);
      },
      onSuccess: () => {
        this.$invalidateQueries({ queryKey: ['select'] });
      },
    });
  }
}
```

- 调用$useMutationData 创建 Mutation 对象
- 传入 mutationKey，确保本地缓存的唯一性
- 传入 mutationFn，用于执行变更操作
- 响应 onSuccess 方法，当数据创建成功后，将`select` query 设为无效，以便重新获取数据

### 如何使用

```typescript
async addTodo() {
  const todo = {
    id: this.app.util.uuid(),
    title: this.newTitle,
    done: false,
  };
  await this.$$modelTodo.insert().mutateAsync(todo);
}
```

- 准备新数据 todo
- 调用$$modelTodo.insert()获取 Mutation 对象
  - 重复调用此方法返回的是同一个 Mutation 对象
- 直接使用 Mutation 对象的方法 mutateAsync 完成异步操作

## 数据变更：update

### 如何定义

```typescript
@Model()
export class ModelTodo {
  update() {
    return this.$useMutationData<void, ApiTodoUpdateParams>({
      mutationKey: ['update'],
      mutationFn: async params => {
        return this.scope.api.todo.update(params);
      },
      onSuccess: (_data, params) => {
        this.$invalidateQueries({ queryKey: ['select'] });
        this.$invalidateQueries({ queryKey: ['get', params.id] });
      },
    });
  }
}
```

- 调用$useMutationData 创建 Mutation 对象
- 传入 mutationKey，确保本地缓存的唯一性
- 传入 mutationFn，用于执行变更操作
- 响应 onSuccess 方法，当数据创建成功后，将`select`和`get` query 设为无效，以便重新获取数据

### 如何使用

```typescript
async completeTodo(item: ApiTodoEntity) {
  const todo = { ...item, done: true };
  await this.$$modelTodo.update().mutateAsync(todo);
}
```

- 准备好数据 todo
- 调用$$modelTodo.update()获取 Mutation 对象
  - 重复调用此方法返回的是同一个 Mutation 对象
- 直接使用 Mutation 对象的方法 mutateAsync 完成异步操作

## 数据变更：delete

### 如何定义

```typescript
@Model()
export class ModelTodo {
  delete() {
    return this.$useMutationData<void, ApiTodoDeleteParams>({
      mutationKey: ['delete'],
      mutationFn: async params => {
        return this.scope.api.todo.delete(params);
      },
      onSuccess: (_data, params) => {
        this.$invalidateQueries({ queryKey: ['select'] });
        this.$invalidateQueries({ queryKey: ['get', params.id] });
      },
    });
  }
}
```

- 调用$useMutationData 创建 Mutation 对象
- 传入 mutationKey，确保本地缓存的唯一性
- 传入 mutationFn，用于执行变更操作
- 响应 onSuccess 方法，当数据创建成功后，将`select`和`get` query 设为无效，以便重新获取数据

### 如何使用

```typescript
async deleteTodo(item: ApiTodoEntity) {
  await this.$$modelTodo.delete().mutateAsync({ id: item.id });
}
```

- 调用$$modelTodo.delete()获取 Mutation 对象
  - 重复调用此方法返回的是同一个 Mutation 对象
- 直接使用 Mutation 对象的方法 mutateAsync 完成异步操作
