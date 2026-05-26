# Sharding

The module `a-datasharding` allows us to provide a set of `write-datasources` and a set of `read-datasources`. When a user accesses the backend API, the system automatically selects a `write-datasource` or a `read-datasource` based on the rules and accesses the corresponding database, thereby allocating workloads and improving system performance.

## Installing the module

```bash
$ pnpm add vona-module-a-datasharding -w
```

## Adding datasources

First, you need to add a set of datasources.

### 1. Adding type definitions

Adding type definitions for the new datasources.

`src/backend/config/config/config.ts`

```typescript
declare module 'vona-module-a-orm' {
  export interface IDatabaseClientRecord {
    read1: never;
    read2: never;
    write1: never;
    write2: never;
  }
}
```

### 2. Adding datasources configuration

`src/backend/config/config/config.ts`

```typescript
// database
config.database = {
  clients: {
    read1: {
      client: 'pg',
      connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: '',
        database: 'xxxx-read1',
      },
    },
    read2: {...},
    write1: {...},
    write2: {...},
  },
};
```

## Configure the read-datasources and write-datasources

Then configure the module's read-datasources and write-datasources.

`src/backend/config/config/config.ts`

```typescript
// modules
config.modules = {
  'a-datasharding': {
    client: {
      reads: ['read1', 'read2'],
      writes: ['write1', 'write2'],
      randomRead: undefined,
      randomWrite: undefined,
    },
  },
};
```

| Name        | Description                                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| reads       | Specifies a set of read-datasources                                                                                                        |
| writes      | Specifies a set of write-datasources                                                                                                       |
| randomRead  | Specifies a custom function to extract a read-datasource from `reads`. Defaults to `undefined`, which is randomly selected by the system   |
| randomWrite | Specifies a custom function to extract a write-datasource from `writes`. Defaults to `undefined`, which is randomly selected by the system |

## Sharding Mechanism

Once the `read-datasources` and `write-datasources` are configured, the sharding mechanism automatically takes effect.

Now, let's explain how sharding works:

> The module provides a global interceptor `a-datasharding:datasharding`. This interceptor determines the current API method. If it is `POST/PATCH/DELETE/PUT`, the `write-datasource` is used; otherwise, the `read-datasource` is used

## Data Consistency: Cache `write-datasource`

### Scenario Analysis: The Same User

Data inconsistencies may occur due to database synchronization delays. For example, a user accesses the `Write-API` to write data to the `Write-Database`. Then, when the user accesses the `Read-API`, the `Read-Database` has not yet been synchronized, and the old data will be read.

To address this issue, the module automatically provides a mechanism: when a user accesses the `Write-API`, the `Write-Datasource` is automatically stored in the `two-layer cache` and an expiration time is set. During this time, the user accessing the `Read-API` will continue to use the same `Write-Datasource`, ensuring he can always read the latest data after writing.

### Modifying the Expiration Time

The name of the `two-layer cache` is `a-datasharding:datasourceWrite`. You can modify the expiration time in the App Config:

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  summerCache: {
    'a-datasharding:datasourceWrite': {
      mem: {
        ttl: 5 * 1000, // 5s
      },
      redis: {
        ttl: 5 * 1000, // 5s
      },
    },
  },
};
```

| Name      | Description                                         |
| --------- | --------------------------------------------------- |
| mem.ttl   | Mem cache expiration time, default is `3` seconds   |
| redis.ttl | Redis cache expiration time, default is `3` seconds |

## Data Consistency: Cache-Double-Delete

### Scenario Analysis: Different Users

Vona ORM provides an out-of-the-box caching mechanism. See: [Caching](../guide/techniques/orm/caching.md)

Due to database synchronization delays, cache inconsistencies can occur. For example, user A accesses the `Write-API`, writes data to the `Write-Database`, and automatically deletes the cache. Subsequently, user B accesses the `Read-API`. At this point, the `Read-Database` has not yet been synchronized, so the old data is read and stored in the cache.

To address this issue, the `a-orm` module provides a `cache-double-delete` mechanism: when user A accesses the `Write-API`, the data is written to the `Write-Database` and the cache is automatically deleted. The cache is then deleted again after a specified timeout, ensuring it always has the latest data.

### Enabling cache-double-delete

`src/backend/config/config/config.ts`

```typescript
// modules
config.modules = {
  'a-orm': {
    sharding: {
      cache: {
        doubleDelete: true,
      },
    },
  },
};
```

### Modifying the cache-double-delete delay time

The system uses a queue task to perform `cache-double-delete`. The queue name is `a-orm:doubleDelete`. You can modify the `cache-double-delete` delay time in App Config:

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  queue: {
    'a-orm:doubleDelete': {
      options: {
        job: {
          delay: 5 * 1000, // 5s
        },
      },
    },
  },
};
```

| Name      | Description                                                                                    |
| --------- | ---------------------------------------------------------------------------------------------- |
| job.delay | Specifies the delay time for performing `cache-double-delete` jobs. The default is `3` seconds |
