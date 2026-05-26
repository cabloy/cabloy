# Caching Decorator

Uses decorators to provide caching capabilities for any method of any class.

A Summer Cache `demo-student:student` was created in the document [Summer Cache (Two-Layer Cache)](./summer.md). The following demonstrates how to use Summer Cache with the Caching decorator.

## Simplest usage

```diff
import { Caching } from 'vona-module-a-caching';

@Service()
class ServiceStudent {
+ @Caching.get({ cacheName: 'demo-student:student' })
  async findOne(id: TableIdentity): Promise<EntityStudent | undefined> {
    return await this.scope.model.student.getById(id);
  }
```

`@Caching.get` will automatically use Summer Cache. The pseudocode is as follows:

```typescript
const cacheKey = 'xxx';
const cacheValue = await this.scope.summerCache.student.get(cacheKey, {
  get: () => findOne(id),
});
```

The system will automatically generate a unique `cacheKey`

## More Parameters 1

```typescript
@Caching.get({
  cacheName: 'demo-student:student',
  ttl: 2 * 3600 * 1000,
  broadcastOnSet: 'del',
  updateAgeOnGet: true,
  ignoreNull: false,
  mode: 'all',
})
```

| Name           | Type                      | Description                                                                                                                       |
| -------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| cacheName      | string                    | Cache name                                                                                                                        |
| ttl            | number                    | Cache expiration time                                                                                                             |
| broadcastOnSet | boolean \| 'del'          | Whether to broadcast changes to other Workers when setting the cache. Set to `del` to broadcast deletion to other Workers’ caches |
| updateAgeOnGet | boolean                   | Whether to update the ttl when reading from the cache                                                                             |
| ignoreNull     | boolean                   | Whether to ignore `null` values                                                                                                   |
| mode           | 'all' \| 'mem' \| 'redis' | Cache mode                                                                                                                        |

## More Parameters 2

```typescript
@Caching.get({
  cacheName: 'demo-student:student',
  enable: true,
  meta: {
    flavor: 'normal',
    mode: 'dev',
  },
})
```

| Name   | Type             | Description                                                                           |
| ------ | ---------------- | ------------------------------------------------------------------------------------- |
| enable | boolean          | Enable/Disable Cache                                                                  |
| flavor | string\|string[] | See: [Runtime Environments and Flavors](../../env-config/mode-flavor/introduction.md) |
| mode   | string\|string[] | See: [Runtime Environments and Flavors](../../env-config/mode-flavor/introduction.md) |

## More Parameters 3

```typescript
@Caching.get({
  cacheName: 'demo-student:student',
  cacheKeyFn: 'customCacheKey',
})
```

| Name       | Type             | Description                         |
| ---------- | ---------------- | ----------------------------------- |
| cacheKeyFn | function\|string | Used to generate a custom cache key |

## Custom cache key

You can specify the `cacheKeyFn` parameter to generate a custom cache key.

```diff
class ServiceStudent {
+ customCacheKey(info: ICachingActionKeyInfo) {
+   return info.args[0];
+ }

  @Caching.get({
    cacheName: 'demo-student:student',
+   cacheKeyFn: 'customCacheKey',
  })
  async findOne(id: TableIdentity): Promise<EntityStudent | undefined> {
    return await this.scope.model.student.getById(id);
  }
}
```

If `cacheKeyFn` returns `undefined/null`, the cache will be ignored.

## Caching Decorators

| Name           | Description      |
| -------------- | ---------------- |
| @Caching.get   | Read cache       |
| @Caching.set   | Set cache        |
| @Caching.del   | Delete cache     |
| @Caching.clear | Clear all caches |

## Complete example

```diff
class ServiceStudent {
+ @Caching.del({ cacheName: 'demo-student:student', intention: 'create' })
  async create(student: DtoStudentCreate): Promise<EntityStudent> {
    return await this.scope.model.student.insert(student);
  }

+ @Caching.get({ cacheName: 'demo-student:student' })
  async findOne(id: TableIdentity): Promise<EntityStudent | undefined> {
    return await this.scope.model.student.getById(id);
  }

+ @Caching.set({ cacheName: 'demo-student:student' })
  async update(id: TableIdentity, student: DtoStudentUpdate) {
    return await this.scope.model.student.updateById(id, student);
  }

+ @Caching.del({ cacheName: 'demo-student:student' })
  async remove(id: TableIdentity) {
    return await this.scope.model.student.deleteById(id);
  }
}
```

- `create`: If the frontend first retrieves student data by Id and the student data does not exist at that time, a `null` value will be stored in the cache to improve performance. Therefore, when creating a new student, the cache corresponding to the Id needs to be deleted
  - `intention: 'create'`: Indicates that @Caching.del should obtain the Id value from the return value of the create method

::: warning
The `@Caching.xxx` decorators added here are for demonstration purposes only. In actual business scenarios, there is no need to use `@Caching.xxx` in the Service, because the Model itself has a more complete built-in caching mechanism.

- See: [Vona ORM: Caching](../orm/caching.md)
  :::
