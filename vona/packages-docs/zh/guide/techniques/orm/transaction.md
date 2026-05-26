# 数据库事务

Vona ORM 对数据库事务提供了完整的支持，提供了直观、优雅、强大的特性：

1. 使用装饰器启用事务
2. 事务传播机制
3. 事务补偿机制
4. 确保数据库与缓存数据一致性

## 使用装饰器启用事务

```typescript
import { Core } from 'vona-module-a-core';

class ServicePost {
  @Core.transaction()
  async transaction() {
    // insert
    const post = await this.scope.model.post.insert({
      title: 'Post001',
    });
    // update
    await this.scope.model.post.update({
      id: post.id,
      title: 'Post001-Update',
    });
  }
}
```

## 手工启用事务

### 1. 使用当前数据源

```typescript
class ServicePost {
  async transactionManually() {
    const db = this.bean.database.current;
    await db.transaction.begin(async () => {
      await this.scope.model.post.update({ id: 1, title: 'Post001_Update' });
    });
  }
}
```

### 2. 使用指定数据源

```typescript
class ServicePost {
  async transactionManually() {
    const db = this.bean.database.getDb({ clientName: 'default' });
    await db.transaction.begin(async () => {
      const modelPost = this.scope.model.post.newInstance(db);
      await modelPost.update({ id: 1, title: 'Post001_Update' });
    });
  }
}
```

## 事务参数

```diff
class ServicePost {
  @Core.transaction({
+   isolationLevel: 'READ_COMMITTED',
+   propagation: 'REQUIRED'
  })
  async transaction() {
    ...
  }
}
```

```diff
class ServicePost {
  async transactionManually() {
    const db = this.bean.database.getDb({ clientName: 'default' });
    await db.transaction.begin(
      async () => {
        ...
      },
      {
+       isolationLevel: 'READ_COMMITTED',
+       propagation: 'REQUIRED',
      }
    );
  }
}
```

## 事务参数：isolationLevel

| 名称             | 说明                           |
| ---------------- | ------------------------------ |
| DEFAULT          | 数据库相关的缺省isolationLevel |
| READ_UNCOMMITTED |                                |
| READ_COMMITTED   |                                |
| REPEATABLE_READ  |                                |
| SERIALIZABLE     |                                |
| SNAPSHOT         |                                |

## 事务参数：propagation

Vona ORM 支持数据库事务传播机制。

| 名称          | 说明                                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| REQUIRED      | 默认的事务传播级别。如果当前存在事务, 则加入该事务。如果当前没有事务, 则创建一个新的事务                                                 |
| SUPPORTS      | 如果当前存在事务，则加入该事务. 如果当前没有事务, 则以非事务的方式继续运行                                                               |
| MANDATORY     | 强制性。如果当前存在事务, 则加入该事务。如果当前没有事务，则抛出异常                                                                     |
| REQUIRES_NEW  | 创建一个新的事务。如果当前存在事务, 则把当前事务挂起。也就是说不管外部方法是否开启事务，总是开启新的事务, 且开启的事务相互独立, 互不干扰 |
| NOT_SUPPORTED | 以非事务方式运行。如果当前存在事务，则把当前事务挂起(不用)                                                                               |
| NEVER         | 以非事务方式运行。如果当前存在事务，则抛出异常                                                                                           |

## 事务补偿机制

当事务成功或者失败时执行一些逻辑。

### 1. 成功补偿

```typescript
this.bean.database.current.commit(async () => {
  // do something when success
});
```

### 2. 失败补偿

```typescript
this.bean.database.current.compensate(async () => {
  // do something when failed
});
```

## 事务与Cache数据一致性 {#transaction-cache-consistency}

许多框架使用最简短的用例来证明是否高性能，而忽略了业务复杂性带来的性能挑战。随着业务的增长和变更，项目性能就会断崖式下降，各种优化补救方案让项目代码繁杂冗长。而 Vona 正视大型业务的复杂性，从框架核心引入缓存策略，并实现了`二级缓存`、`Query缓存`和`Entity缓存`等机制，轻松应对大型业务系统的开发，可以始终保持代码的优雅和直观。

Vona 系统对数据库事务与缓存进行了适配，当数据库事务失败时会自动执行缓存的补偿操作，从而让数据库数据与缓存数据始终保持一致。

针对这个场景，Vona 提供了内置的解决方案。

### 1. 使用当前数据源

```typescript
class ServicePost {
  @Core.transaction()
  async transaction() {
    // insert
    const post = await this.scope.model.post.insert({
      title: 'Post001',
    });
    // cache
    await this.scope.cacheRedis.post.set(post, post.id);
  }
}
```

- 当新建数据后，将数据放入 redis 缓存中。如果这个事务出现异常，就会进行数据回滚，同时缓存数据也会回滚，从而让数据库数据与缓存数据保持一致

### 2. 使用指定数据源

```typescript
class ServicePost {
  async transactionManually() {
    const db = this.bean.database.getDb({ clientName: 'default' });
    await db.transaction.begin(async () => {
      const modelPost = this.scope.model.post.newInstance(db);
      const post = await modelPost.insert({ title: 'Post001' });
      await this.scope.cacheRedis.post.set(post, post.id, { db });
    });
  }
}
```

- 如果对指定的数据库进行操作，那么就需要将数据库对象`db`传入缓存，从而让缓存针对数据库对象`db`执行相应的补偿操作。当数据库事务回滚时，让数据库数据与缓存数据保持一致
