# 基于关系的分组

下面以模块`test-vona`为例，讲解`基于关系的分组`的用法。

比如，Model User 和 Model Post 是`1:n`的关系。在查询 User 数据时，可以基于关系查询相应 Post 的分组数据。

## 动态关系

```typescript
class ServiceUser {
  async relationGroup() {
    const users = await this.scope.model.user.select({
      with: {
        posts: $relationDynamic.hasMany(() => ModelPost, 'userId', {
          groups: 'id',
          aggrs: {
            count: '*',
            sum: 'stars',
          },
        }),
      },
    });
    return users;
  }
}
```

Vona ORM 自动推断出`users`的类型。

![](../../../assets/img/orm/aggr-group/aggr-group-5.png)

| 名称                     | 说明                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------- |
| with.posts               | 关系名                                                                                 |
| $relationDynamic.hasMany | 定义`1:n`关系                                                                          |
| ModelPost                | 目标Model                                                                              |
| 'userId'                 | 外键                                                                                   |
| groups                   | 需要分组的字段：`string`/`string[]`                                                    |
| columns                  | 需要显示的分组字段。如果为空，则显示参数`groups`指定的字段                             |
| aggrs                    | 需要聚合的函数和字段。函数：`count`/`sum`/`avg`/`min`/`max`。字段：`string`/`string[]` |

## 静态关系

### 1. 定义关系

为了演示起见，新建一个 Model UserStatsGroup，定义一个静态关系`posts`

```typescript
@Model({
  entity: EntityUser,
  relations: {
    posts: $relation.hasMany(() => ModelPost, 'userId', {
      groups: 'id',
      aggrs: {
        count: '*',
        sum: 'stars',
      },
    }),
  },
})
class ModelUserStatsGroup {}
```

### 2. 使用关系

```typescript
class ServiceUser {
  async relationGroup() {
    const users = await this.scope.model.userStatsGroup.select({
      include: {
        posts: true,
      },
    });
    return users;
  }
}
```

Vona ORM 自动推断出`users`的类型。

![](../../../assets/img/orm/aggr-group/aggr-group-6.png)

## autoload

也可以将静态关系设为`autoload: true`，从而实现自动加载，也可以让代码进一步简化。

### 1. 定义关系

```diff
@Model({
  entity: EntityUser,
  relations: {
    posts: $relation.hasMany(() => ModelPost, 'userId', {
+     autoload: true,
      groups: 'id',
      aggrs: {
        count: '*',
        sum: 'stars',
      },
    }),
  },
})
class ModelUserStatsGroup {}
```

### 2. 使用关系

```typescript
class ServiceUser {
  async relationGroup() {
    const users = await this.scope.model.userStatsGroup.select();
    return users;
  }
}
```
