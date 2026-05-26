# Caching装饰器

使用装饰器为任何 Class 的任何 Method 提供缓存能力。

在文档[Summer缓存(二级缓存)](./summer.md)中创建了一个 Summer Cache `demo-student:student`。下面演示如果通过 Caching 装饰器使用 Summer Cache。

## 最简用法

```diff
import { Caching } from 'vona-module-a-caching';

@Service()
class ServiceStudent {
+ @Caching.get({ cacheName: 'demo-student:student' })
  async findOne(id: TableIdentity): Promise<EntityStudent | undefined> {
    return await this.scope.model.student.getById(id);
  }
```

`@Caching.get`会自动使用 Summer Cache，伪代码如下:

```typescript
const cacheKey = 'xxx';
const cacheValue = await this.scope.summerCache.student.get(cacheKey, {
  get: () => findOne(id),
});
```

系统会自动生成唯一的`cacheKey`

## 更多参数1

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

| 名称           | 类型                      | 说明                                                                                                  |
| -------------- | ------------------------- | ----------------------------------------------------------------------------------------------------- |
| cacheName      | string                    | 缓存名                                                                                                |
| ttl            | number                    | 缓存的过期时间                                                                                        |
| broadcastOnSet | boolean \| 'del'          | 当设置缓存时，是否需要通过广播设置其他Workers的缓存。设置为`del`，那么就通过广播删除其他Workers的缓存 |
| updateAgeOnGet | boolean                   | 当读取缓存时是否更新ttl                                                                               |
| ignoreNull     | boolean                   | 是否忽略`null`值                                                                                      |
| mode           | 'all' \| 'mem' \| 'redis' | 缓存模式                                                                                              |

## 更多参数2

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

| 名称   | 类型             | 说明                                                                   |
| ------ | ---------------- | ---------------------------------------------------------------------- |
| enable | boolean          | 启用/禁用缓存                                                          |
| flavor | string\|string[] | 参见: [运行环境与Flavor](../../env-config/mode-flavor/introduction.md) |
| mode   | string\|string[] | 参见: [运行环境与Flavor](../../env-config/mode-flavor/introduction.md) |

## 更多参数3

```typescript
@Caching.get({
  cacheName: 'demo-student:student',
  cacheKeyFn: 'customCacheKey',
})
```

| 名称       | 类型             | 说明                    |
| ---------- | ---------------- | ----------------------- |
| cacheKeyFn | function\|string | 用于生成自定义的缓存Key |

## 自定义缓存Key

可以指定`cacheKeyFn`参数，用于生成自定义的缓存 Key。

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

如果`cacheKeyFn`返回值是`undefined/null`，则忽略缓存。

## Caching装饰器清单

| 名称           | 说明         |
| -------------- | ------------ |
| @Caching.get   | 读取缓存     |
| @Caching.set   | 设置缓存     |
| @Caching.del   | 删除缓存     |
| @Caching.clear | 清理所有缓存 |

## 完整范例

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

- `create`: 如果前端先通过 Id 获取学生数据，而此时学生数据不存在，则在缓存中存入`null`值，从而提升性能。那么，当创建新学生时，就需要从缓存中删除 Id 对应的缓存
  - `intention: 'create'`: 指示 @Caching.del 从 create 方法的返回值中取得 Id 值

::: warning
这里添加的`@Caching.xxx`装饰器仅用于演示目的。在实际业务当中，不需要在 Service 中使用`@Caching.xxx`。因为 Model 本身内置了更完善的缓存机制。

- 参见: [Vona ORM: 缓存](../orm/caching.md)
  :::
