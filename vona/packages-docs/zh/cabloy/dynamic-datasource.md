# 动态数据源

模块`a-datasource`允许在系统运行时动态创建数据源，从而管理第三方的数据库数据。

## 安装模块

```bash
$ pnpm add vona-module-a-datasource -w
```

## 创建数据源

模块将动态创建的数据源存储在数据表中。

```typescript
const entityDatasource = await this.bean.datasource.create({
  title: 'test001',
  config: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres',
      password: '',
      database: 'xxxx',
    },
  },
});
```

- `bean.datasource`: 模块提供的全局 Service 实例

## 使用数据源

### 1. 一般用法

```typescript
const db = await this.bean.datasource.getDb({ id: entityDatasource.id });
const modelTest = this.scope.model.test.newInstance(db);
const items = await modelTest.select();
```

- `getDb`: 获取数据源对象
- `newInstance`: 传入数据源对象，创建新的 Model 实例

### 2. 数据库事务

```typescript
const db = await this.bean.datasource.getDb({ id: entityDatasource.id });
const modelTest = this.scope.model.test.newInstance(db);
await db.transaction.begin(async () => {
  const item = await modelTest.insert({ title: 'test' });
  await modelTest.delete(item);
});
```

- `db.transaction.begin`: 启动 db 的数据库事务

## 更新数据源

```typescript
await this.bean.datasource.update({
  id: entityDatasource.id,
  config: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'postgres-new',
      password: 'new',
      database: 'xxxx-new',
    },
  },
});
```

- `update`: 该操作执行以下逻辑:
  1. 更新数据表中的数据
  2. 更新系统中已经创建的数据源对象的状态信息

## 删除数据源

```typescript
await this.bean.datasource.remove(entityDatasource.id);
```

- `remove`: 该操作执行以下逻辑:
  1. 删除数据表中的数据
  2. 销毁系统中已经创建的数据源对象
