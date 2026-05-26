# 缓存

许多框架使用最简短的用例来证明是否高性能，而忽略了业务复杂性带来的性能挑战。随着业务的增长和变更，项目性能就会断崖式下降，各种优化补救方案让项目代码繁杂冗长。而 Vona 正视大型业务的复杂性，从框架核心引入缓存策略，并实现了`二级缓存`、`Query缓存`和`Entity缓存`等机制，轻松应对大型业务系统的开发，可以始终保持代码的优雅和直观。

## 开箱即用

Vona ORM 提供了`开箱即用`的缓存机制，我们只需像常规一样操作 ORM，系统内部帮我们对缓存做了处理，并确保缓存数据的一致性。

## Entity缓存

`Entity缓存`的规则：

| Key       | Value       |
| --------- | ----------- |
| Entity Id | Entity Data |

#### 举例

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

1. 当执行`user.get`方法时，系统自动创建缓存：`1 -> user`。如果已经存在缓存，则直接返回缓存
2. 当执行`user.update`方法时，系统自动删除缓存：`key：1`
3. 当执行`user.delete`方法时，系统自动删除缓存：`key：1`

## Query缓存

### 1. 普通查询

普通查询分两步：

1. 先查询出目标数据的`Id数组`
2. 再使用`Id数组`从`Entity缓存`中取得最终数据

因此，`普通查询`的`Query缓存`规则如下：

| Key                  | Value       |
| -------------------- | ----------- |
| Hash of query clause | Array of Id |

- `缓存 Key`：为了节约缓存空间，并且提升缓存查询性能，系统将`查询语句`生成`Hash`，作为缓存 Key
- `缓存 Value`：系统将查询出的目标数据的`Id数组`作为缓存 Value

#### 举例

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

- 当执行`user.select`方法时，系统执行以下逻辑：
  1. 基于 where 计算出 Hash：`xxxxxx`
  2. 通过 Hash：`xxxxxx`判断是否存在 Query 缓存
     - 如果存在，则直接取得`Id数组`
     - 如果不存在，则通过 where 查询出`Id数组`，并创建缓存
  3. 使用`Id数组`从`Entity缓存`中取得最终数据

### 2. 聚合与分组

`聚合与分组`只需一步，直接将查询结果写入缓存数据。

因此，`聚合与分组`的`Query缓存`规则如下：

| Key                  | Value  |
| -------------------- | ------ |
| Hash of query clause | Result |

#### 举例

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

- 当执行`user.aggregate`方法时，系统执行以下逻辑：
  1. 基于 where + aggrs 计算出 Hash：`xxxxxx`
  2. 通过 Hash：`xxxxxx`判断是否存在 Query 缓存
     - 如果存在，则直接取得缓存作为最终数据
     - 如果不存在，则通过 where + aggrs 查询出最终数据，并创建缓存

## 缓存配置

为了实现开箱即用的效果，系统提供了默认的缓存配置。我们也可以提供自定义配置。

### 1. Model Options

可以在 Model Options 中配置缓存，比如：

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

- 完整配置如下：

| 名称                    | 说明                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| cache.entity            | Entity缓存配置。可参考`Summer（二级缓存）`的配置                                                                                                       |
| cache.query             | Query缓存配置。可参考`Summer（二级缓存）`的配置                                                                                                        |
| cache.modelsClear       | 当Query缓存数据被清除时，可以同时清除其他相关Models的Query缓存                                                                                         |
| cache.modelsClearedBy   | 当其他Models的Query缓存数据被清除时，可以同时清除当前Model的Query缓存                                                                                  |
| cache.modelsClearedByFn | 当其他Models的Query缓存数据被清除时，可以执行自定义函数，从而实现定制化的清除逻辑。比如在`动态分表`的场景中，就可以使用此机制清除不同数据表的Query缓存 |

### 2. App Config

可以在 App Config 中配置 Model options。

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

## FAQ: Query缓存是否大量占用Redis空间？

1. 由于`Query缓存`仅缓存`Id数组`和`统计数据`，而且缓存 Key 是 Hash，因此缓存空间占用非常小，甚至比`Entity缓存`还要轻量

2. 所有 Models 都可以定制缓存参数，可以基于不同业务的数据特点和用户访问频率，设置不同的`ttl`时间

## FAQ: 如何保持缓存数据的一致性？

1. 当调用 Model 方法执行变更操作时（包括 Create/Update/Delete），系统会自动删除变更数据的`Entity缓存`，同时清除 Model 对应的所有`Query缓存`

2. 可以设置`modelsClear/modelsClearedBy/modelsClearedByFn`，从而在清除`Query缓存`时，同时清除相关 Models 的`Query缓存`

比如，Model `UserStats`和 Model `UserStatsGroup`分别是与 Model `User`相关的 Model，专门用于查询 User 的聚合和分组数据。当我们`Create/Update/Delete`用户数据时，不仅要清除 Model `User`的`Query缓存`，还要清除 Model `UserStats`和 Model `UserStatsGroup`的`Query缓存`。那么，可以如下配置：

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

3. 数据库事务与 Cache 数据一致性

Vona 系统对数据库事务与缓存进行了适配，当数据库事务失败时会自动执行缓存的补偿操作，从而让数据库数据与缓存数据始终保持一致。

- 参见：[事务与Cache数据一致性](./transaction.md#transaction-cache-consistency)
