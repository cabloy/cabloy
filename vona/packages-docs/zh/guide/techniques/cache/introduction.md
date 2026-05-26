# Vona Cache

VonaJS 提供了非常强大的缓存机制，包括以下 4 个功能:

1. `Mem缓存`: 基于[lru-cache](https://github.com/isaacs/node-lru-cache)实现
2. `Redis缓存`: 基于[Redis](../../distributed/redis.md)实现
3. `Summer缓存（二级缓存）`: 基于 Mem 缓存和 Redis 缓存实现
4. `Caching装饰器`: 使用装饰器为任何 Class 的任何 Method 提供缓存能力

## Model缓存

VonaJS 基于`Summer缓存`为`Model`提供了`开箱即用`的缓存机制。我们只需像常规一样操作 ORM，系统内部帮我们对缓存做了处理，并确保缓存数据的一致性。

- 参见: [Vona ORM: 缓存](../orm/caching.md)

## 事务与Cache数据一致性

Vona 系统对数据库事务与缓存进行了适配，当数据库事务失败时会自动执行缓存的补偿操作，从而让数据库数据与缓存数据始终保持一致。

- 参见: [数据库事务](../orm/transaction.md)
