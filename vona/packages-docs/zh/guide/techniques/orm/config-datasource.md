# 数据源配置

## App Config

可以在 App Config 中进行数据源配置：

`src/backend/config/config/config.ts`

```typescript
// orm
config.database = {
  base: {},
  defaultClient: 'pg',
  clients: {},
};
```

| 名称          | 说明                                     |
| ------------- | ---------------------------------------- |
| base          | 基础配置，为所有数据源提供通用的基础配置 |
| defaultClient | 默认数据源，默认为`pg`                   |
| clients       | 配置多个数据源                           |

## 内置数据源

为了开箱即用，系统内置了三个数据源：`sqlite3/pg/mysql`，配置如下：

`src/backend/config/config/config.ts`

```typescript
// database
config.database = {
  clients: {
    sqlite3: {
      client: 'better-sqlite3',
      connection: {
        filename: env.DATABASE_CLIENT_SQLITE3_FILENAME,
      },
    },
    pg: {
      client: 'pg',
      connection: {
        host: env.DATABASE_CLIENT_PG_HOST,
        port: Number.parseInt(env.DATABASE_CLIENT_PG_PORT!),
        user: env.DATABASE_CLIENT_PG_USER,
        password: env.DATABASE_CLIENT_PG_PASSWORD,
        database: env.DATABASE_CLIENT_PG_DATABASE,
      },
    },
    mysql: {
      client: 'mysql2',
      connection: {
        host: env.DATABASE_CLIENT_MYSQL_HOST,
        port: Number.parseInt(env.DATABASE_CLIENT_MYSQL_PORT!),
        user: env.DATABASE_CLIENT_MYSQL_USER,
        password: env.DATABASE_CLIENT_MYSQL_PASSWORD,
        database: env.DATABASE_CLIENT_MYSQL_DATABASE,
      },
    },
  },
};
```

- Vona ORM 底层使用的是[Knex](https://knexjs.org/)，因此，数据源的配置直接继承自`Knex.Config`
  - 参见：[Configuration Options](https://knexjs.org/guide/#configuration-options)

- `clients.sqlite3.client`: 使用方言 `better-sqlite3`
- `clients.pg.client`：使用方言`pg`
- `clients.mysql.client`：使用方言`mysql2`

## env配置

为了方便配置，内置数据源从 env 环境变量获取配置参数。因此，对于内置数据源我们可以直接通过 env 来提供配置信息。

`env/.env`

```typescript
# database

DATABASE_DEFAULT_CLIENT = 'sqlite3' # sqlite3/pg/mysql

DATABASE_CLIENT_PG_HOST = 127.0.0.1
DATABASE_CLIENT_PG_PORT = 5432
DATABASE_CLIENT_PG_USER = postgres
DATABASE_CLIENT_PG_PASSWORD =
DATABASE_CLIENT_PG_DATABASE = postgres

DATABASE_CLIENT_MYSQL_HOST = 127.0.0.1
DATABASE_CLIENT_MYSQL_PORT = 3306
DATABASE_CLIENT_MYSQL_USER = root
DATABASE_CLIENT_MYSQL_PASSWORD =
DATABASE_CLIENT_MYSQL_DATABASE = mysql
```

## 添加新数据源

如果要添加一个新的数据源，名称为`pgOrder`，使用数据库方言`pg`，那么，可以如下操作：

### 1. 添加类型定义

采用接口合并机制添加新数据源的类型定义。

在 VSCode 编辑器中，输入代码片段`recorddatabaseclient`，自动生成代码骨架:

`src/backend/config/config/config.ts`

```typescript
declare module 'vona-module-a-orm' {
  export interface IDatabaseClientRecord {
    : never;
  }
}
```

调整代码，然后添加`pgOrder`

```diff
declare module 'vona-module-a-orm' {
  export interface IDatabaseClientRecord {
+   pgOrder: never;
  }
}
```

### 2. 增加数据源配置

`src/backend/config/config/config.ts`

```typescript
// database
config.database = {
  clients: {
    pgOrder: {
      client: 'pg',
      connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: '',
        database: 'xxxx',
      },
    },
  },
};
```

## 如何使用数据源

### 1. 获取指定数据源

```typescript
const pg = app.bean.database.getDb('pg');
const mysql = app.bean.database.getDb('mysql');
const pgOrder = app.bean.database.getDb('pgOrder');
```

### 2. 获取默认数据源

默认数据源由配置项`defaultClient`决定。

```typescript
const dbDefault = app.bean.database.getDb('default');
```

### 3. 获取数据源对应的 knex 实例

系统为不同的数据源创建了不同的 knex 实例，使用 knex 实例操作数据库。

```typescript
const pg = app.bean.database.getDb('pg');
const items = pg.connection.select('*').from('tableName');

const dbDefault = app.bean.database.getDb('default');
const items = dbDefault.connection.select('*').from('tableName');
```

### 4. 获取当前数据源

在实际的代码上下文中，可能使用任何一个数据源，那么可以通过以下代码获取上下文中的当前数据源：

```typescript
const current = app.bean.database.current;
const items = current.connection.select('*').from('tableName');
```

## 默认数据源的高级定制

`config.database.defaultClient`还可以传入自定义函数。可以通过自定义函数根据请求的上下文自行决定使用哪个数据源：

`src/backend/config/config/config.ts`

```typescript
// database
config.database = {
  defaultClient: (ctx?: VonaContext) => {
    if (ctx?.headers.xxx === 'yyy') return 'pg';
    return 'mysql';
  },
};
```
