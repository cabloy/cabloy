# Mem缓存

`Mem缓存`基于[lru-cache](https://github.com/isaacs/node-lru-cache)实现。

## 创建Mem缓存

比如，在模块 demo-student 中创建一个 Mem 缓存: `student`，用于缓存学生数据。

### 1. Cli命令

```bash
$ vona :create:bean cacheMem student --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Bean/Cache Mem`
:::

## Mem缓存定义

```typescript
export type TCacheMemStudentKey = string;
export interface TCacheMemStudentData {
  id: string;
  name: string;
}

@CacheMem({
  max: 500,
  ttl: 2 * 3600 * 1000,
})
export class CacheMemStudent extends BeanCacheMemBase<TCacheMemStudentKey, TCacheMemStudentData> {}
```

- `TCacheMemStudentKey`: 定义缓存 Key 的类型
- `TCacheMemStudentData`: 定义缓存 Data 的类型

## Mem缓存参数

可以为 Mem 缓存配置参数。

```typescript
@CacheMem({
  max: 500,
  ttl: 2 * 3600 * 1000,
  updateAgeOnGet: true,
  updateAgeOnHas: false,
  broadcastOnSet: false,
  disableInstance: false,
  disableTransactionCompensate: false,
})
class CacheMemStudent {}
```

| 名称                         | 类型             | 默认值 | 说明                                                                                                  |
| ---------------------------- | ---------------- | ------ | ----------------------------------------------------------------------------------------------------- |
| max                          | number           |        | 允许缓存的最大条数                                                                                    |
| ttl                          | number           |        | 缓存的过期时间                                                                                        |
| updateAgeOnGet               | boolean          | true   | 当读取缓存时是否更新ttl                                                                               |
| updateAgeOnHas               | boolean          | false  | 当判断缓存是否存在时是否更新ttl                                                                       |
| broadcastOnSet               | boolean \| 'del' | false  | 当设置缓存时，是否需要通过广播设置其他Workers的缓存。设置为`del`，那么就通过广播删除其他Workers的缓存 |
| disableInstance              | boolean          | false  | 是否禁用实例隔离。在默认情况下，多实例之间的缓存是隔离的                                              |
| disableTransactionCompensate | boolean          | false  | 是否禁止事务补偿。启用事务补偿可以确保缓存数据一致性                                                  |

## App Config

可以在 App Config 中配置 Mem 缓存参数。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  cacheMem: {
    'demo-student:student': {
      max: 500,
      ttl: 2 * 3600 * 1000,
      updateAgeOnGet: true,
      updateAgeOnHas: false,
      broadcastOnSet: false,
      disableInstance: false,
      disableTransactionCompensate: false,
    },
  },
};
```

## Mem缓存启用/禁用

可以控制 Mem 缓存的`启用/禁用`

### 1. Enable

`src/backend/config/config/config.ts`

```diff
// onions
config.onions = {
  cacheMem: {
    'demo-student:student': {
+     enable: true,
    },
  },
};
```

### 2. Meta

可以让 Redis 缓存在指定的运行环境生效。

| 名称   | 类型             | 说明                                                                   |
| ------ | ---------------- | ---------------------------------------------------------------------- |
| flavor | string\|string[] | 参见: [运行环境与Flavor](../../env-config/mode-flavor/introduction.md) |
| mode   | string\|string[] | 参见: [运行环境与Flavor](../../env-config/mode-flavor/introduction.md) |

- 举例

```diff
@CacheMem({
+ meta: {
+   flavor: 'normal',
+   mode: 'dev',
+ },
})
class CacheMemStudent {}
```

## 使用Mem缓存

```typescript
class ControllerStudent {
  @Web.get('test')
  async test() {
    const student = { id: '1', name: 'tom' };
    this.scope.cacheMem.student.set(student, '1');
    const value = this.scope.cacheMem.student.get('1');
    assert.deepEqual(student, value);
  }
}
```

- `this.scope.cacheMem.student`: 通过模块 scope 取得缓存实例

## 缓存方法参数

以`set方法`为例介绍缓存方法的参数。

```typescript
this.scope.cacheMem.student.set(student, '1', {
  ttl: 2 * 3600 * 1000,
  broadcastOnSet: 'del',
  disableTransactionCompensate: true,
  db: this.ctx.db,
});
```

| 名称                         | 类型             | 说明                                                                                                  |
| ---------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------- |
| ttl                          | number           | 缓存的过期时间                                                                                        |
| broadcastOnSet               | boolean \| 'del' | 当设置缓存时，是否需要通过广播设置其他Workers的缓存。设置为`del`，那么就通过广播删除其他Workers的缓存 |
| disableTransactionCompensate | boolean          | 是否禁止事务补偿                                                                                      |
| db                           | ServiceDb        | 在进行事务补偿时，会用到此db对象。在默认情况下，自动使用上下文中的db对象                              |

- `db`: VonaJS 支持多数据库/多数据源，因此可以通过`db`精确控制事务补偿能力

## 缓存方法清单

| 名称   | 说明                      |
| ------ | ------------------------- |
| get    | 读取缓存                  |
| mget   | 同时读取多个缓存          |
| peek   | 拣取缓存，不更新缓存的ttl |
| set    | 设置缓存                  |
| mset   | 同时设置多个缓存          |
| getset | 设置新缓存，并返回旧值    |
| has    | 判断缓存是否存在          |
| del    | 删除缓存                  |
| mdel   | 同时删除多个缓存          |
| clear  | 清理所有缓存              |
