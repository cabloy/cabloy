# Vona Cache

VonaJS provides a very powerful caching mechanism, including the following four features:

1. `Mem Cache`: Implemented based on [lru-cache](https://github.com/isaacs/node-lru-cache)
2. `Redis Cache`: Implemented based on [Redis](../../distributed/redis.md)
3. `Summer Cache (Two-Layer Cache)`: Implemented based on Mem Cache and Redis Cache
4. `Caching Decorator`: Uses decorators to provide caching capabilities for any method of any class

## Model Caching

VonaJS provides an `out-of-the-box` caching mechanism for `Model` based on `Summer Cache`. We just operate the ORM as usual, and the system handles the caching internally while ensuring consistency of cached data.

- See: [Vona ORM: Caching](../orm/caching.md)

## Transaction and Cache Data Consistency

The Vona system adapts database transactions to the cache. When a database transaction fails, it automatically performs cache compensation operations, ensuring that the database data and cached data always remain consistent.

- See: [Transaction](../orm/transaction.md)
