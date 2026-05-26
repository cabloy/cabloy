# API

## $useStateData

Create a Query object and return it directly if it already exists.

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
  - Ensure local cache uniqueness
  - Namespaces are added automatically. For example, the Bean identifier of ModelTodo is `demo-basic.model.todo`, then the complete queryKey is `['demo-basic.model.todo', 'select']`
- queryFn
  - Required
  - Invoke this function at the appropriate time to fetch server data
- meta
  - Optional
  - Extended parameters

### Returns

- See: [tanstack: useQuery](https://tanstack.com/query/latest/docs/framework/vue/reference/useQuery)

## $useMutationData

Create a Mutation object and return it directly if it already exists.

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
  - Ensure local cache uniqueness
  - Namespaces are added automatically. For example, the Bean identifier of ModelTodo is `demo-basic.model.todo`, then the complete mutationKey is `['demo-basic.model.todo', 'insert']`
- mutationFn
  - Required
  - Used to perform mutation operation
- onSuccess
  - Optional
  - Will be invoked onSuccess
- onError
  - Optional
  - Will be invoked onError
- onSettled
  - Optional
  - Will be invoked onSuccess or onError

### Returns

- See: [tanstack: useMutation](https://tanstack.com/query/latest/docs/framework/vue/reference/useMutation)

## $invalidateQueries

Invalidate the Query object in order to re-fetch the data.

```typescript
this.$invalidateQueries({ queryKey: ['select'] });
this.$invalidateQueries({ queryKey: ['get', params.id] });
```

### Query Filters

- See: [tanstack: Query Filters](https://tanstack.com/query/latest/docs/framework/vue/guides/filters#query-filters)

## $useStateLocal

Create a Query object based on localstorage.

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
  - Extended parameters

## $useStateCookie

Create a Query object based on cookie.

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
  - Extended parameters

## $useStateMem

Create a Query object based on memory.

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
  - Extended parameters

## Query Meta

When creating a Query object, you can pass in the `meta` extension parameters.

For example, we can store the current theme's `darkMode` in a cookie. The type of darkMode is `true | false | 'auto'`, but when storing cookies, the types are all strings, so conversion operation is required the next time the value is retrieved from the cookie.

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
  - serialize：Custom serialization method
  - deserialize：Custom deserialization method
- meta.defaultData
  - Provides default values, which are only valid for `sync data`
