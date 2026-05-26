# Datasource Level

In distributed scenarios, it's crucial to avoid deadlocks caused by datasource contention.

VonaJS uses `Async Local Storage` to provide different `datasource level` for different contexts, thereby creating different database connection pools and preventing datasource contention.

::: warning
`Sqlite3` only supports one write connection, so `datasource level` is not supported
:::

## Scenario Description

### 1. Worker A

Execute the following code in Worker A:

```typescript
class ControllerStudent {
  async test() {
    const result = await this.ctx.db.transaction.begin(async () => {
      const data = { a: 1, b: 2 };
      return await this.scope.queue.add.pushAsync(data);
    });
    console.log(result);
  }
}
```

- First, create a database transaction
- Push a job within the database transaction and await for the job to return the result

### 2. Worker B

Execute the following code in Worker B:

```diff
class QueueAdd {
  async execute(data, _options) {
+   await this.scope.model.student.update({ id: 1, name: 'student name' });
    console.log(process.pid, data.a + data.b);
    return data.a + data.b;
  }
}
```

- Modifying student data in the job

### 3. Potential Deadlock Analysis

1. When Worker A starts a database transaction, the number of available connections in the database connection pool is `0`. The transaction will only be completed after the job returns the result, thus releasing the database connection
2. When Worker B modifies student data, it needs to obtain a connection object from the database connection pool. Since the connection count is `0`, it will wait indefinitely
3. `Worker A` and `Worker B` wait for each other, leading to a deadlock

## Solution

In fact, the above potential deadlock situation will not occur in VonaJS. Because VonaJS provides a `datasource level` mechanism.

VonaJS uses `Async Local Storage` to provide different `datasource level` for different contexts, thereby creating different database connection pools and avoiding datasource contention.

::: tip
In VonaJS, in a distributed scenario, setting the connection maximum of the database connection pool to `1` will not cause deadlocks due to datasource contention
:::

```typescript
class ControllerStudent {
  async test() {
    await this.scope.model.student.select();
    const dbLevel = this.bean.database.current.level;
    await this.bean.database.switchDb(
      async () => {
        await this.scope.model.student.select();
        const dbLevel1 = this.bean.database.current.level;
        console.log(dbLevel, dbLevel1);
      },
      { level: dbLevel + 1 },
    );
  }
}
```

- `this.bean.database.current.level`: Gets the current datasource level
- `switchDb`: Creates a new context by passing in the new `level`
- `student.select`: Executes in different contexts, thus using different datasource levels and correspondingly different database connection pools

### Shorthand Method

```diff
class ControllerStudent {
  async test() {
+   await this.bean.database.switchDbIsolate(async () => {
+   });
  }
}
```

- `switchDbIsolate`: Automatically passes in the parameter `current.level + 1`, thus implementing datasource leveling

## Push Job

When using the `push/pushAsync` method to push a job, the system automatically passes in `current.level + 1`, thus implementing datasource leveling and avoiding deadlocks.

```typescript
await this.scope.queue.add.pushAsync(data);
```

is equivalent to:

```typescript
await this.scope.queue.add.pushAsync(data, {
  dbInfo: {
    level: this.bean.database.current.level + 1,
  },
});
```
