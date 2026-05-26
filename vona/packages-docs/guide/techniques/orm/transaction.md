# Transaction

Vona ORM provides comprehensive support for database transaction, offering intuitive, elegant, and powerful features:

1. Enabling transaction using decorator
2. Transaction propagation mechanism
3. Transaction compensation mechanism
4. Ensuring database and cache data consistency

## Enabling transaction using decorator

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

## Manually Enabling Transaction

### 1. Using the current datasource

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

### 2. Using the specified datasource

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

## Transaction parameters

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

## Transaction parameter: isolationLevel

| Name             | Description                              |
| ---------------- | ---------------------------------------- |
| DEFAULT          | Database-specific default isolationLevel |
| READ_UNCOMMITTED |                                          |
| READ_COMMITTED   |                                          |
| REPEATABLE_READ  |                                          |
| SERIALIZABLE     |                                          |
| SNAPSHOT         |                                          |

## Transaction parameter: propagation

Vona ORM supports database transaction propagation mechanism.

| Name          | Description                                                                                                                                                                                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQUIRED      | Default transaction propagation level. If a transaction currently exists, join it. If no transaction currently exists, create a new one                                                                                                                                            |
| SUPPORTS      | If a transaction currently exists, join it. If no transaction currently exists, continue in non-transactional mode                                                                                                                                                                 |
| MANDATORY     | Mandatory. If a transaction currently exists, join it. If no transaction currently exists, throw an exception                                                                                                                                                                      |
| REQUIRES_NEW  | Create a new transaction. If a transaction currently exists, suspend the current one. This means that regardless of whether the external method starts a transaction, a new transaction is always started. These transactions are independent and do not interfere with each other |
| NOT_SUPPORTED | Runs in non-transactional mode. If a transaction already exists, the current transaction is suspended (not used)                                                                                                                                                                   |
| NEVER         | Runs in non-transactional mode. If a transaction already exists, an exception is thrown                                                                                                                                                                                            |

## Transaction Compensation Mechanism

Executes logic when a transaction succeeds or fails.

### 1. Success Compensation

```typescript
this.bean.database.current.commit(async () => {
  // do something when success
});
```

### 2. Failure Compensation

```typescript
this.bean.database.current.compensate(async () => {
  // do something when failed
});
```

## Transaction and Cache Data Consistency {#transaction-cache-consistency}

Many frameworks use minimal use cases to demonstrate high performance, ignoring the performance challenges brought about by business complexity. As business grows and changes, project performance can plummet. Various optimization and mitigation measures can lead to cumbersome and lengthy code. Vona, however, addresses the complexity of large-scale businesses by integrating caching strategies into its core framework. It implements mechanisms such as `two-layer cache`, `query cache`, and `entity cache`, making it easy to develop large-scale business systems while maintaining elegant and intuitive code.

The Vona system adapts database transactions to the cache. When a database transaction fails, it automatically performs cache compensation operations, ensuring that the database data and cached data always remain consistent.

For this scenario, Vona provides a built-in solution.

### 1. Using the current datasource

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

- When new data is created, it is cached in Redis. If an exception occurs in this transaction, the data will be rolled back, and the cached data will also be rolled back, ensuring that the database data is consistent with the cached data

### 2. Using the specified datasource

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

- If operations are performed on a specific database, the database object `db` must be passed to the cache, allowing the cache to perform corresponding compensation operations on the database object `db`. When the database transaction is rolled back, the database data is kept consistent with the cached data
