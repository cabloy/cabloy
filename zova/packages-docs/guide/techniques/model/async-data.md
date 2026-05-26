# Async Data

The core of TanStack Query is to manage server-side data. Below, we demonstrate how to implement CRUD functionality in Model.

- For complete code examples, please see: [demo-todo](https://github.com/zovajs/zova/blob/main/zova-dev/src/suite/a-demo/modules/demo-todo/src/bean/model.todo.ts)

## Data Query: select

### How to define

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

- Invoke `$useStateData` to create a Query object
  - Why not use the `$useQuery` method? Because asynchronous data is generally loaded asynchronously when needed. Therefore, we need to ensure that the same Query object is always returned when the `select` method is invoked multiple times, so the `$useStateData` method must be used
- Pass in `queryKey` to ensure the uniqueness of the local cache
- Pass in `queryFn` and call this function at the appropriate time to obtain server data
  - service.todo.select: see [Api service](../../essentials/scope/api.md)

### How to use

`demo-todo/src/page/todo/controller.ts`

```typescript
import { ModelTodo } from '../../bean/model.todo.js';

export class ControllerPageTodo {
  @Use()
  $$modelTodo: ModelTodo;
}
```

- Inject Model Bean instance: `$$modelTodo`

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

- Invoke `select` method to obtain the Query object
  - The render method will be executed multiple times, and repeated calls to the `select` method return the same Query object
- Directly use the state and data of the Query object
  - See: [TanStack Query: Queries](https://tanstack.com/query/latest/docs/framework/vue/guides/queries)

### How to support SSR

In SSR mode, we need to use asynchronous data like this: load the state data on the server, and then render it into an HTML string through the render method. The state data and HTML string will be sent to the client at the same time, and the client will still use the same state data when hydrating so as to maintain state consistency.

To implement the above logic, only one step is required in Zova Model:

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

- Just invoke `suspense` in the `__init__` method to wait for asynchronous data loading to complete

## Data Query: get

### How to define

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

- Invoke `$useStateData` to create a Query object
- Pass in `queryKey` to ensure the uniqueness of the local cache
  - Since it is a single piece of data, the key field value of the entry needs to be specified
- Pass in `queryFn` and call this function at the appropriate time to obtain server data

### How to use

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

- Invoke `$$modelTodo.get()` to get the Query object
  - Repeated calls to this method return the same Query object
- Directly use the state and data of the Query object

### How to support SSR

Same as `select`

## Data Mutation: insert

### How to define

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

- Invoke `$useMutationData` to create a Mutation object
- Pass in `mutationKey` to ensure the uniqueness of the local cache
- Pass in `mutationFn` to perform the mutation operation
- Listen to the `onSuccess` method, when the data is created successfully, set the `select` query to invalid in order to re-fetch the data

### How to use

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

- Prepare new data todo
- Invoke `$$modelTodo.insert()` to obtain the Mutation object
  - Repeated calls to this method return the same Mutation object
- Directly use the `mutateAsync` method of the Mutation object to complete asynchronous operations

## Data Mutation: update

### How to define

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

- Invoke `$useMutationData` to create a Mutation object
- Pass in `mutationKey` to ensure the uniqueness of the local cache
- Pass in `mutationFn` to perform the mutation operation
- Listen to the `onSuccess` method, when the data is created successfully, set the `select` and `get` queries to invalid in order to re-fetch the data

### How to use

```typescript
async completeTodo(item: ApiTodoEntity) {
  const todo = { ...item, done: true };
  await this.$$modelTodo.update().mutateAsync(todo);
}
```

- Prepare data todo
- Invoke `$$modelTodo.update()` to obtain the Mutation object
  - Repeated calls to this method return the same Mutation object
- Directly use the `mutateAsync` method of the Mutation object to complete asynchronous operations

## Data Mutation: delete

### How to define

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

- Invoke `$useMutationData` to create a Mutation object
- Pass in `mutationKey` to ensure the uniqueness of the local cache
- Pass in `mutationFn` to perform the mutation operation
- Listen to the `onSuccess` method, when the data is created successfully, set the `select` and `get` queries to invalid in order to re-fetch the data

### How to use

```typescript
async deleteTodo(item: ApiTodoEntity) {
  await this.$$modelTodo.delete().mutateAsync({ id: item.id });
}
```

- Invoke `$$modelTodo.delete()` to obtain the Mutation object
  - Repeated calls to this method return the same Mutation object
- Directly use the `mutateAsync` method of the Mutation object to complete asynchronous operations
