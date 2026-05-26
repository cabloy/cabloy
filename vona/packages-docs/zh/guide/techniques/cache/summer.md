# Summer缓存(二级缓存)

`Summer缓存`基于 Mem 缓存和 Redis 缓存实现。

## 创建Summer缓存

比如，在模块 demo-student 中创建一个 Summer 缓存: `student`，用于缓存学生数据。

### 1. Cli命令

```bash
$ vona :create:bean summerCache student --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Bean/Summer Cache`
:::

## Summer缓存定义

```typescript
export type TSummerCacheStudentKey = string;
export interface TSummerCacheStudentData {
  id: string;
  name: string;
}

@SummerCache()
export class SummerCacheStudent
  extends BeanSummerCacheBase<TSummerCacheStudentKey, TSummerCacheStudentData>
  implements ISummerCacheGet<TSummerCacheStudentKey, TSummerCacheStudentData>
{
  async getNative(
    key?: TSummerCacheStudentKey,
    _options?: TSummerCacheActionOptions<TSummerCacheStudentKey, TSummerCacheStudentData>,
  ): Promise<TSummerCacheStudentData | undefined> {
    const student = await this.scope.model.student.getById(key!);
    if (!student) return;
    return { id: student.id as string, name: student.name };
  }
}
```

- `TSummerCacheStudentKey`: 定义缓存 Key 的类型
- `TSummerCacheStudentData`: 定义缓存 Data 的类型

## getNative

读取 Summer 缓存的一般流程：

1. 先读取 Mem 缓存
2. 如果 Mem 缓存不存在，则读取 Redis 缓存
3. 如果 Redis 缓存不存在，则调用`getNative`方法
   - 比如，在`getNative`方法中查询 db 数据

## mgetNative

可以提供`mgetNative`方法支持同时读取多个缓存。

如果没有提供`mgetNative`方法，在同时读取多个缓存时，系统会自动循环调用`getNative`方法。

```diff
export class SummerCacheStudent
  extends BeanSummerCacheBase<TSummerCacheStudentKey, TSummerCacheStudentData>
  implements
    ISummerCacheGet<TSummerCacheStudentKey, TSummerCacheStudentData>,
+   ISummerCacheMGet<TSummerCacheStudentKey, TSummerCacheStudentData> {
  async getNative(
    key?: TSummerCacheStudentKey,
    _options?: TSummerCacheActionOptions<TSummerCacheStudentKey, TSummerCacheStudentData>,
  ): Promise<TSummerCacheStudentData | undefined> {
    ...
  }

+ async mgetNative(
+   keys: TSummerCacheStudentKey[],
+   _options?: TSummerCacheActionOptions<TSummerCacheStudentKey, TSummerCacheStudentData>,
+ ): Promise<Array<TSummerCacheStudentData | undefined>> {
+   const students = await this.scope.model.student.mget(keys);
+   return students.map(student => {
+     return { id: student.id as string, name: student.name };
+   });
+ }
}
```

## Summer缓存参数

可以为 Summer 缓存配置参数。

```typescript
@SummerCache({
  preset: 'all',
  mode: 'all',
  mem: {
    max: 500,
    ttl: 2 * 3600 * 1000,
  },
  redis: {
    ttl: 2 * 3600 * 1000,
  },
  ignoreNull: false,
})
class SummerCacheStudent {}
```

| 名称       | 类型                      | 默认值 | 说明                                                                                                                                     |
| ---------- | ------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| preset     | 'all' \| 'mem' \| 'redis' |        | 预定义配置，是`mode/mem/redis`参数的组合                                                                                                 |
| mode       | 'all' \| 'mem' \| 'redis' | 'all'  | 缓存模式                                                                                                                                 |
| mem        |                           |        | Mem 缓存的配置                                                                                                                           |
| redis      |                           |        | Redis 缓存的配置                                                                                                                         |
| ignoreNull | boolean                   | false  | 是否忽略`null`值。当`ignoreNull=true`时，如果从Mem缓存/Redis缓存中读取的数据为`null`则忽略掉，然后调用`getNative/mgetNative`方法获取新值 |

- mode

| 名称  | 说明                       |
| ----- | -------------------------- |
| all   | 使用 Mem 缓存和 Redis 缓存 |
| mem   | 仅使用Mem 缓存             |
| redis | 仅使用Redis 缓存           |

## App Config

可以在 App Config 中配置 Summer 缓存参数。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  summerCache: {
    'demo-student:student': {
      preset: 'all',
      mode: 'all',
      mem: {
        max: 500,
        ttl: 2 * 3600 * 1000,
      },
      redis: {
        ttl: 2 * 3600 * 1000,
      },
      ignoreNull: false,
    },
  },
};
```

## Summer缓存启用/禁用

可以控制 Summer 缓存的`启用/禁用`

### 1. Enable

`src/backend/config/config/config.ts`

```diff
// onions
config.onions = {
  summerCache: {
    'demo-student:student': {
+     enable: true,
    },
  },
};
```

### 2. Meta

可以让 Summer 缓存在指定的运行环境生效。

| 名称   | 类型             | 说明                                                                   |
| ------ | ---------------- | ---------------------------------------------------------------------- |
| flavor | string\|string[] | 参见: [运行环境与Flavor](../../env-config/mode-flavor/introduction.md) |
| mode   | string\|string[] | 参见: [运行环境与Flavor](../../env-config/mode-flavor/introduction.md) |

- 举例

```diff
@SummerCache({
+ meta: {
+   flavor: 'normal',
+   mode: 'dev',
+ },
})
class SummerCacheStudent {}
```

## 使用Summer缓存

```typescript
class ControllerStudent {
  @Web.get('test')
  async test() {
    const studentByDb = await this.scope.model.student.getById('2');
    const studentBySummer = await this.scope.summerCache.student.get('2');
    assert.equal(studentByDb?.id, studentBySummer?.id);
    assert.equal(studentByDb?.name, studentBySummer?.name);
  }
}
```

- `this.scope.summerCache.student`: 通过模块 scope 取得缓存实例

## 缓存方法参数

以`get方法`为例介绍缓存方法的参数。

```typescript
await this.scope.summerCache.student.get('2', {
  ttl: 2 * 3600 * 1000,
  broadcastOnSet: 'del',
  updateAgeOnGet: true,
  ignoreNull: false,
  mode: 'all',
  force: false,
  disableTransactionCompensate: false,
  db: this.ctx.db,
  enable: true,
  get: async (_key?: string) => {
    return undefined;
  },
  mget: async (_keys: string[]) => {
    return [];
  },
});
```

| 名称                         | 类型                      | 说明                                                                                                  |
| ---------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------- |
| ttl                          | number                    | 缓存的过期时间                                                                                        |
| broadcastOnSet               | boolean \| 'del'          | 当设置缓存时，是否需要通过广播设置其他Workers的缓存。设置为`del`，那么就通过广播删除其他Workers的缓存 |
| updateAgeOnGet               | boolean                   | 当读取缓存时是否更新ttl                                                                               |
| ignoreNull                   | boolean                   | 是否忽略`null`值                                                                                      |
| mode                         | 'all' \| 'mem' \| 'redis' | 缓存模式                                                                                              |
| force                        | boolean                   | 强制读取新值                                                                                          |
| disableTransactionCompensate | boolean                   | 是否禁止事务补偿                                                                                      |
| db                           | ServiceDb                 | 在进行事务补偿时，会用到此db对象。在默认情况下，自动使用上下文中的db对象                              |
| enable                       | boolean                   | 是否禁用Summer缓存                                                                                    |
| get                          | Function                  | 覆盖`getNative`方法                                                                                   |
| mget                         | Function                  | 覆盖`mgetNative`方法                                                                                  |

- `db`: VonaJS 支持多数据库/多数据源，因此可以通过`db`精确控制事务补偿能力

## 缓存方法清单

| 名称  | 说明                      |
| ----- | ------------------------- |
| get   | 读取缓存                  |
| mget  | 同时读取多个缓存          |
| peek  | 拣取缓存，不更新缓存的ttl |
| set   | 设置缓存                  |
| mset  | 同时设置多个缓存          |
| del   | 删除缓存                  |
| mdel  | 同时删除多个缓存          |
| clear | 清理所有缓存              |
