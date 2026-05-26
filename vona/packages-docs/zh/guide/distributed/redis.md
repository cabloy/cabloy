# Redis

VonaJS 基于[ioredis](https://github.com/redis/node-redis)提供了强大而灵活的 Redis 客户端。

## App Config

可以在 App Config 中进行 Redis 配置：

`src/backend/config/config/config.ts`

```typescript
// redis
config.redis = {
  base: {
    host: env.REDIS_DEFAULT_HOST,
    port: Number.parseInt(env.REDIS_DEFAULT_PORT!),
    password: env.REDIS_DEFAULT_PASSWORD,
    db: Number.parseInt(env.REDIS_DEFAULT_DB!),
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  },
  clients: {
    default: { keyPrefix: true },
    cache: { keyPrefix: true },
    io: { keyPrefix: true },
    summer: { keyPrefix: true },
    model: { keyPrefix: true },
    redlock: {},
    queue: {},
    broadcast: {},
  },
};
```

| 名称    | 说明                                                           |
| ------- | -------------------------------------------------------------- |
| base    | 基础配置，为所有Clients提供通用的基础配置                      |
| clients | 配置多个Clients。针对不同应用场景，系统提供了大量内置的Clients |

- `keyPrefix`: 为 Client 提供`keyPrefix`，从而实现键值空间的隔离
  - 比如，在本机有多个 VonaJS 项目，使用同一个 Redis 服务，因为提供了不同的`keyPrefix`，从而确保多个 VonaJS 项目不会相互干扰
  - `redlock/queue/broadcast`在内部提供了`keyPrefix`能力，因此不必在配置文件中设置

## env配置

可以在 env 文件中提供`base`配置：

`env/.env`

```typescript
# redis
REDIS_DEFAULT_HOST = 127.0.0.1
REDIS_DEFAULT_PORT = 6379
REDIS_DEFAULT_PASSWORD =
REDIS_DEFAULT_DB = 0
```

## 独立配置

所有分布式组件默认使用相同的 Redis 配置。

对于大型项目，可以为不同的组件提供独立的配置。

`src/backend/config/config/config.ts`

```typescript
// redis
config.redis = {
  clients: {
    // broadcast
    broadcast: {
      host: 'host1',
    },
    // queue/schedule
    queue: {
      host: 'host2',
    },
    // redlock
    redlock: {
      host: 'host3',
    },
  },
};
```

## 添加新Client

### 1. 添加类型定义

采用接口合并机制添加新 Client 的类型定义，比如`order`，为订单业务提供独立的 Redis Client，使用独立的 Redis 服务，从而提升系统性能。

在 VSCode 编辑器中，输入代码片段`recordredisclient`，自动生成代码骨架:

```typescript
declare module 'vona-module-a-redis' {
  export interface IRedisClientRecord {
    : never;
  }
}
```

调整代码，然后添加`order`

```diff
declare module 'vona-module-a-redis' {
  export interface IRedisClientRecord {
+   order: never;
  }
}
```

### 2. 增加Client配置

`src/backend/config/config/config.ts`

```typescript
// redis
config.redis = {
  clients: {
    order: {
      keyPrefix: true,
      host: 'xx.xx.xx.xx',
      port: 6379,
      password: 'xxxxxx',
    },
  },
};
```

## 获取Redis Client实例

```typescript
class ControllerStudent {
  @Web.get('test')
  async test() {
    const redisDefault = this.bean.redis.get('default');
    const redisCache = this.bean.redis.get('cache');
    const redisOrder = this.bean.redis.get('order');
  }
}
```

## 使用Redis Client

```diff
class ControllerStudent {
  @Web.get('test')
  async test() {
    const redisOrder = this.bean.redis.get('order');
+   await redisOrder.set('order1', JSON.stringify({ id: '1', name: 'Order1' }));
+   const value = await redisOrder.get('order1');
    const order = value ? JSON.parse(value) : undefined;
    assert.deepEqual(order, { id: '1', name: 'Order1' });
  }
}
```

- 更多用法，参见：[ioredis](https://github.com/redis/node-redis)
