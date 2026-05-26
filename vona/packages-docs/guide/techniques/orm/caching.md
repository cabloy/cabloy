# Caching

Many frameworks use the simplest use cases to demonstrate high performance, ignoring the performance challenges presented by business complexity. As business grows and changes, project performance plummets, and various optimization and mitigation measures lead to cumbersome and lengthy code. Vona, however, addresses the complexity of large-scale businesses and incorporates caching strategies into the framework's core, implementing mechanisms such as `two-layer cache`, `query cache`, and `entity cache`. This makes it easy to develop large-scale business systems, ensuring that code remains elegant and intuitive.

## Out-of-the-Box

Vona ORM provides an `out-of-the-box` caching mechanism. Simply operate the ORM as usual, and the system will handle caching internally and ensure cached data consistency.

## Entity Cache

`Entity Cache` Rules:

| Key       | Value       |
| --------- | ----------- |
| Entity Id | Entity Data |

#### Example

```typescript
class ServiceUser extends BeanBase {
  async getUser() {
    const user = await this.scope.model.user.get({ id: 1 });
    return user;
  }

  async updateUser() {
    await this.scope.model.user.update({ id: 1, name: 'Tom' });
  }

  async deleteUser() {
    await this.scope.model.user.delete({ id: 1 });
  }
}
```

1. When the `user.get` method is executed, the system automatically creates a cache: `1 -> user`. If the cache already exists, the cache is returned directly
2. When the `user.update` method is executed, the system automatically deletes the cache: `key: 1`
3. When the `user.delete` method is executed, the system automatically deletes the cache: `key: 1`

## Query Cache

### 1. Normal Query

Normal queries have two steps:

1. First, retrieve the `Id array` of the target data
2. Then, use the `Id array` to retrieve the final data from the `Entity Cache`

Therefore, the `query cache` rules for normal queries are as follows:

| Key                  | Value        |
| -------------------- | ------------ |
| Hash of query clause | Array of Ids |

- `Cache Key`: To save cache space and improve cache query performance, the system generates a `Hash` from the `query clause` as the cache key
- `Cache Value`: The system uses the `Id array` of the target data retrieved as the cache value

#### Example

```typescript
class ServiceUser extends BeanBase {
  async findUsers() {
    const users = await this.scope.model.user.select({
      where: {
        age: { _gt_: 18 },
      },
    });
    return users;
  }
}
```

- When the `user.select` method is executed, the system executes the following logic:
  1. Calculate the Hash: `xxxxxx` based on the `where` clause
  2. Use the Hash: `xxxxxx` to determine whether the `query cache` exists
     - If it exists, directly retrieve the `Id array`
     - If it doesn't exist, retrieve the `Id array` using the `where` clause and create a cache
  3. Use the `Id array` to retrieve the final data from the `Entity cache`

### 2. Aggregate and Group

`Aggregate and Group` only requires one step, directly saving the query results to the cache.

Therefore, the `Query Cache` rules for `Aggregate and Group` are as follows:

| Key                  | Value  |
| -------------------- | ------ |
| Hash of query clause | Result |

#### Example

```typescript
class ServiceUser extends BeanBase {
  async userStats() {
    const userStats = await this.scope.model.user.aggregate({
      aggrs: {
        count: '*',
        sum: 'scores',
        max: 'age',
        min: 'age',
      },
      where: {
        scores: { _gt_: 30 },
      },
    });
    return userStats;
  }
}
```

- When the `user.aggregate` method is executed, the system executes the following logic:
  1. Calculates the hash `xxxxxx` based on `where` + `aggrs`
  2. Determines whether a `query cache` exists using hash `xxxxxx`
     - If it exists, directly retrieves the cache as the final data
     - If it doesn't exist, retrieves the final data using `where` + `aggrs` and creates a cache

## Cache Configuration

For `out-of-the-box` performance, the system provides a default cache configuration. Custom configurations are also available.

### 1. Model Options

You can configure the cache in Model Options, for example:

```typescript
@Model({
  entity: EntityUser,
  cache: {
    entity: {
      mode: 'redis',
      redis: {
        ttl: 2 * 3600 * 1000, // 2h
      },
    },
    query: {
      mode: 'all',
      redis: {
        ttl: 3 * 3600 * 1000, // 3h
      },
      mem: {
        max: 5000,
        ttl: 1 * 3600 * 1000, // 1h
      },
    },
  },
})
class ModelUser {}
```

- The complete configuration is as follows:

| Name                    | Description                                                                                                                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| cache.entity            | Entity cache configuration. See `Summer (Two-layer Cache)` configuration                                                                                                                                                                                     |
| cache.query             | Query cache configuration. See `Summer (Two-layer Cache)` configuration                                                                                                                                                                                      |
| cache.modelsClear       | When the query cache data is cleared, the query caches of other related models are also cleared                                                                                                                                                              |
| cache.modelsClearedBy   | When the query cache data of other models is cleared, the query cache of the current model is also cleared                                                                                                                                                   |
| cache.modelsClearedByFn | When the query cache data of other models is cleared, a custom function can be executed to implement customized clearing logic. For example, in the case of dynamic table sharding, this mechanism can be used to clear the query cache for different tables |

### 2. App Config

Model options can be configured in App Config.

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  model: {
    'test-vona:user': {
      cache: {
        entity: {
          mode: 'redis',
          redis: {
            ttl: 2 * 3600 * 1000, // 2h
          },
        },
        query: {
          mode: 'all',
          redis: {
            ttl: 3 * 3600 * 1000, // 3h
          },
          mem: {
            max: 5000,
            ttl: 1 * 3600 * 1000, // 1h
          },
        },
      },
    },
  },
};
```

## FAQ: Does the query cache occupy a large amount of Redis space?

1. Because the Query Cache only caches the `Id array` and `statistics data`, and the cache key is a `hash`, its cache space usage is very small, even lighter than the `Entity Cache`

2. All models can have custom cache parameters, allowing you to set different `ttl` based on the data characteristics of different businesses and user access frequency

## FAQ: How do I maintain cached data consistency?

1. When a model method is called to perform a mutate operation (including Create/Update/Delete), the system automatically deletes the `Entity Cache` for the changed data and clears all `Query Cache` corresponding to the model

2. You can set the options `modelsClear/modelsClearedBy/modelsClearedByFn` to clear the `Query Cache` of related models when clearing the `Query Cache`

For example, the `UserStats` and `UserStatsGroup` models are related to the `User` model and are specifically used to query aggregated and grouped data for users, respectively. When we `Create/Update/Delete` user data, we need to clear not only the `Query cache` of Model `User`, but also the `Query cache` of Model `UserStats` and Model `UserStatsGroup`. Then, you can configure it as follows:

```typescript
import { ModelUserStats } from './userStats.ts';
import { ModelUserStatsGroup } from './userStatsGroup.ts';

@Model({
  entity: EntityUser,
  cache: {
    modelsClear: [() => ModelUserStats, () => ModelUserStatsGroup],
  },
})
class ModelUser {}
```

3. Database Transactions and Cache Data Consistency

The Vona system adapts to database transaction and caching. When a database transaction fails, it automatically performs cache compensation operations, ensuring that database and cache data remain consistent.

- See: [Transaction and Cache Data Consistency](./transaction.md#transaction-cache-consistency)
