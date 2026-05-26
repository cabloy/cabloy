# API

## $useStateData

创建 Query 对象，如果已经存在则直接返回。

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

### Options

- queryKey
  - Required
  - 确保本地缓存的唯一性
  - 自动添加命名空间。比如，ModelTodo 的 Bean 标识是`demo-basic.model.todo`，那么完整的 queryKey 就是`['demo-basic.model.todo', 'select']`
- queryFn
  - Required
  - 在合适的时机调用此函数获取服务端数据
- meta
  - Optional
  - 扩展参数

### Returns

- 参见: [tanstack: useQuery](https://tanstack.com/query/latest/docs/framework/vue/reference/useQuery)

## $useMutationData

创建 Mutation 对象，如果已经存在则直接返回。

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

### Options

- mutationKey
  - Required
  - 确保本地缓存的唯一性
  - 自动添加命名空间。比如，ModelTodo 的 Bean 标识是`demo-basic.model.todo`，那么完整的 mutationKey 就是`['demo-basic.model.todo', 'insert']`
- mutationFn
  - Required
  - 用于执行变更操作
- onSuccess
  - Optional
  - 变更操作成功时调用
- onError
  - Optional
  - 变更操作失败时调用
- onSettled
  - Optional
  - 变更操作成功或失败均调用

### Returns

- 参见: [tanstack: useMutation](https://tanstack.com/query/latest/docs/framework/vue/reference/useMutation)

## $invalidateQueries

将 Query 对象设为失效，以便重新获取数据。

```typescript
this.$invalidateQueries({ queryKey: ['select'] });
this.$invalidateQueries({ queryKey: ['get', params.id] });
```

### Query Filters

- 参见: [tanstack: Query Filters](https://tanstack.com/query/latest/docs/framework/vue/guides/filters#query-filters)

## $useStateLocal

创建基于 localstorage 的 Query 对象。

```typescript
export class ModelUser extends BeanModelBase {
  user?: ApiUserEntity;

  protected async __init__() {
    this.user = this.$useStateLocal({
      queryKey: ['user'],
    });
  }
}
```

### Options

- queryKey
  - Required
- meta
  - Optional
  - 扩展参数

## $useStateCookie

创建基于 cookie 的 Query 对象。

```typescript
export class ModelUser extends BeanModelBase {
  token?: string;

  protected async __init__() {
    this.token = this.$useStateCookie({
      queryKey: ['token'],
    });
  }
}
```

### Options

- queryKey
  - Required
- meta
  - Optional
  - 扩展参数

## $useStateMem

创建基于 memory 的 Query 对象。

```typescript
export class ModelTheme extends BeanModelBase {
  cBrand: string;

  protected async __init__() {
    this.cBrand = this.$useStateMem({
      queryKey: ['cBrand'],
    });
  }
}
```

### Options

- queryKey
  - Required
- meta
  - Optional
  - 扩展参数

## Query Meta

在创建 Query 对象时，可以传入 meta 扩展参数。

比如，我们可以把当前主题的`darkMode`属性存入 cookie。darkMode 的类型是`true | false | 'auto'`，但是在存入 cookie 时类型均是字符串，那么在下次从 cookie 取值时就需要进行转换操作。

```typescript
darkMode: ThemeDarkMode; // auto/true/false

protected async __init__() {
  this.darkMode = this.$useStateCookie({
    queryKey: ['themedark'],
    meta: {
      persister: {
        deserialize: (value, deserializeDefault) => {
          if (value === 'auto') value = cookieThemeDarkDefault;
          return deserializeDefault(value);
        },
      },
      defaultData: 'auto',
    },
  });
}
```

- meta.persister
  - serialize：自定义序列化方法
  - deserialize：自定义反序列化方法
- meta.defaultData
  - 提供缺省值，只针对同步数据有效
