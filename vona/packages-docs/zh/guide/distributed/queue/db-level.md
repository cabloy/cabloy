# 数据源分级

在分布式场景中，需要避免因数据源竞争而引发的死锁问题。

VonaJS 采用`Async Local Storage`为不同的上下文提供不同的`数据源分级`，从而创建不同的数据库连接池，避免数据源竞争的发生。

::: warning
`Sqlite3`只支持一个写连接，因此不支持`数据源分级`
:::

## 场景描述

### 1. Worker A

在 Worker A 中执行如下代码：

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

- 首先创建一个数据库事务
- 在数据库事务当中推送任务，并等待任务返回结果

### 2. Worker B

在 Worker B 中执行如下代码：

```diff
class QueueAdd {
  async execute(data, _options) {
+   await this.scope.model.student.update({ id: 1, name: 'student name' });
    console.log(process.pid, data.a + data.b);
    return data.a + data.b;
  }
}
```

- 在任务中修改学生数据

### 3. 潜在死锁分析

1. Worker A 在启动数据库事务时，数据库连接池可用连接数为`0`。只有任务返回结果之后才会完成事务，从而释放数据库连接
2. Worker B 在修改学生数据时，需要从数据库连接池中获取连接对象。而此时连接数为`0`，就会一致等待
3. `Worker A`和`Worker B`相互等待，从而导致死锁发生

## 解决方案

事实上，以上的潜在死锁情况在 VonaJS 中是不会发生的。因为 VonaJS 提供了`数据源分级`的机制。

VonaJS 采用`Async Local Storage`为不同的上下文提供不同的`数据源分级`，从而创建不同的数据库连接池，避免数据源竞争的发生。

::: tip
在 VonaJS 中，在分布式场景下，将数据库连接池的最大连接数设为`1`，也不会发生因数据源竞争而导致的死锁情况
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

- `this.bean.database.current.level`: 获取当前数据源分级
- `switchDb`: 传入新的`level`创建新的上下文
- `student.select`: 在不同的上下文执行，从而使用了不同的数据源分级，相应的也就使用了不同的数据库连接池

### 简写方式

```diff
class ControllerStudent {
  async test() {
+   await this.bean.database.switchDbIsolate(async () => {
+   });
  }
}
```

- `switchDbIsolate`: 自动传入参数`current.level + 1`，从而实现数据源分级

## 推送任务

当使用`push/pushAsync`方法推送任务时，系统会自动传入`current.level + 1`，从而实现数据源分级，避免死锁发生。

```typescript
await this.scope.queue.add.pushAsync(data);
```

等价于：

```typescript
await this.scope.queue.add.pushAsync(data, {
  dbInfo: {
    level: this.bean.database.current.level + 1,
  },
});
```
