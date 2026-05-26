# Datasource Config

## App Config

We can configure the Datasources in App Config:

`src/backend/config/config/config.ts`

```typescript
// orm
config.database = {
  base: {},
  defaultClient: 'pg',
  clients: {},
};
```

| Name          | Description                                                                |
| ------------- | -------------------------------------------------------------------------- |
| base          | Base configuration, provides common base configuration for all datasources |
| defaultClient | Default datasource, defaults to `pg`                                       |
| clients       | Configure multiple datasources                                             |

## Built-in Datasources

For out-of-the-box usage, three datasources are built-in: `sqlite3/pg/mysql`. The configuration is as follows:

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

- Vona ORM uses [Knex](https://knexjs.org/) under the hood, so the datasource configuration inherits directly from `Knex.Config`
  - See: [Configuration Options](https://knexjs.org/guide/#configuration-options)

- `clients.sqlite3.client`: Uses the dialect `better-sqlite3`
- `clients.pg.client`: Uses the dialect `pg`
- `clients.mysql.client`: Uses the dialect `mysql2`

## env

For ease of configuration, built-in datasources obtain configuration parameters from environment variables. Therefore, for built-in datasources, we can directly provide configuration information through `env`

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

## Add a New Datasource

If we want to add a new datasource, named `pgOrder`, using the database dialect `pg`, we can do the following:

### 1. Add Type Definitions

Using the interface merging mechanism to add the type definition for the new datasource.

In the VSCode editor, enter the code snippet `recorddatabaseclient` to automatically generate a code skeleton:

`src/backend/config/config/config.ts`

```typescript
declare module 'vona-module-a-orm' {
  export interface IDatabaseClientRecord {
    : never;
  }
}
```

Adjust the code and add `pgOrder`

```diff
declare module 'vona-module-a-orm' {
  export interface IDatabaseClientRecord {
+   pgOrder: never;
  }
}
```

### 2. Add Datasource Configuration

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

## How to Use Datasource

### 1. Obtaining a Specified Datasource

```typescript
const pg = app.bean.database.getDb('pg');
const mysql = app.bean.database.getDb('mysql');
const pgOrder = app.bean.database.getDb('pgOrder');
```

### 2. Obtaining the Default Datasource

The default datasource is determined by the `defaultClient` configuration option.

```typescript
const dbDefault = app.bean.database.getDb('default');
```

### 3. Obtaining the Knex Instance Corresponding to the Datasource

The system creates different Knex instances for different datasources. Use these Knex instances to operate the database.

```typescript
const pg = app.bean.database.getDb('pg');
const items = pg.connection.select('*').from('tableName');

const dbDefault = app.bean.database.getDb('default');
const items = dbDefault.connection.select('*').from('tableName');
```

### 4. Obtaining the Current Datasource

In real-world code, we might use any datasource. We can use the following code to get the current datasource in the context:

```typescript
const current = app.bean.database.current;
const items = current.connection.select('*').from('tableName');
```

## Advanced Customization of the Default Datasource

`config.database.defaultClient` can also be passed a custom function. We can use this custom function to determine which datasource to use based on the request context:

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
