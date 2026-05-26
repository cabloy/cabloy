# 读写分离

模块`a-datasharding`允许我们提供一组`写数据源`和一组`读数据源`。当用户访问后端 API 时，系统会按照规则自动选择`写数据源`或`读数据源`，访问相应的数据库，从而分摊压力，提升系统性能。

## 安装模块

```bash
$ pnpm add vona-module-a-datasharding -w
```

## 添加数据源

首先，需要添加一组数据源。

### 1. 添加类型定义

为新数据源添加类型定义。

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

### 2. 增加数据源配置

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

## 配置读写数据源

然后配置模块的读写数据源。

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

| 名称        | 说明                                                                              |
| ----------- | --------------------------------------------------------------------------------- |
| reads       | 指定一组读数据源                                                                  |
| writes      | 指定一组写数据源                                                                  |
| randomRead  | 可指定自定义函数，从`reads`中提取一个读数据源。默认为`undefined`，由系统随机提取  |
| randomWrite | 可指定自定义函数，从`writes`中提取一个写数据源。默认为`undefined`，由系统随机提取 |

## 读写分离的运行机制

当配置好读写数据源之后，读写分离机制就自动生效了。

现在，解释一下读写分离的运行机制：

> 模块提供了一个全局拦截器`a-datasharding:datasharding`。该拦截器判断当前 API Method，如果是`POST/PATCH/DELETE/PUT`，那么就使用`写数据源`，否则使用`读数据源`

## 数据一致性: 缓存`写数据源`

### 场景分析：同一个用户

由于数据库同步有延时，会出现数据不一致性的情况。比如，用户访问`Write-API`，将数据写入`写数据库`。接下来，用户访问`Read-API`，此时`读数据库`还没有同步，那么就会读到旧数据。

为了解决以上问题，模块自动提供了一个机制：当用户访问`Write-API`时，会自动将`写数据源`存入`二级缓存`，并设置过期时间。在这个时间之内，用户访问`Read-API`时，也会继续使用同一个`写数据源`，从而确保在写入数据后总是可以读取到最新的数据。

### 修改过期时间

`二级缓存`的名称是`a-datasharding:datasourceWrite`，可以在 App Config 中修改过期时间：

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

| 名称      | 说明                             |
| --------- | -------------------------------- |
| mem.ttl   | Mem缓存的过期时间，默认为`3`秒   |
| redis.ttl | Redis缓存的过期时间，默认为`3`秒 |

## 数据一致性: 缓存双删

### 场景分析：不同用户

Vona ORM 提供了开箱即用的缓存机制，参见：[缓存](../guide/techniques/orm/caching.md)

由于数据库同步有延时，会出现缓存不一致性的情况。比如，用户 A 访问`Write-API`，将数据写入`写数据库`，并自动删除缓存。接下来，用户 B 访问`Read-API`，此时`读数据库`还没有同步，那么就会读到旧数据，并存入缓存。

为了解决以上问题，模块`a-orm`提供了`缓存双删`机制：当用户 A 访问`Write-API`时，将数据写入`写数据库`，并自动删除缓存。然后在指定时间之后再次删除缓存，从而确保缓存总是最新数据。

### 启用缓存双删

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

### 修改缓存双删延迟时间

系统采用队列任务执行缓存双删，`队列`名称是`a-orm:doubleDelete`，可以在 App Config 中修改缓存双删延迟时间：

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

| 名称      | 说明                                          |
| --------- | --------------------------------------------- |
| job.delay | 指定延迟多长时间执行缓存双删任务，默认为`3`秒 |
