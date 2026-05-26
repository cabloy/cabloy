# Dynamic Datasource

The module `a-datasource` allows dynamic creation of datasources during system runtime, thereby managing third-party database data.

## Installing the module

```bash
$ pnpm add vona-module-a-datasource -w
```

## Create datasource

The module stores the dynamically created datasource in the data table.

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

- `bean.datasource`: Global service instance provided by the module

## Using datasource

### 1. General usage

```typescript
const db = await this.bean.datasource.getDb({ id: entityDatasource.id });
const modelTest = this.scope.model.test.newInstance(db);
const items = await modelTest.select();
```

- `getDb`: Get the datasource object
- `newInstance`: Passes the datasource object and returns a new model instance

### 2. Transaction

```typescript
const db = await this.bean.datasource.getDb({ id: entityDatasource.id });
const modelTest = this.scope.model.test.newInstance(db);
await db.transaction.begin(async () => {
  const item = await modelTest.insert({ title: 'test' });
  await modelTest.delete(item);
});
```

- `db.transaction.begin`: Start a database transaction on db

## Update datasource

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

- `update`: This operation performs the following logic:
  1. Updates the data in the data table
  2. Updates the status of the datasource object that has been created in the system

## Delete datasource

```typescript
await this.bean.datasource.remove(entityDatasource.id);
```

- `remove`: This operation performs the following logic:
  1. Deletes the data in the data table
  2. Dispose the datasource object that has been created in the system
