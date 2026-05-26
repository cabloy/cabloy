# Aggregate on Relations

The following uses the `test-vona` module as an example to explain how to use `Aggregate on Relations`

For example, the `User` model and the `Post` model have a `1:n` relation. When querying `User` data, we can query the aggregated data for the corresponding `Post` based on the relation.

## Dynamic Relation

```typescript
class ServiceUser {
  async relationAggregate() {
    const users = await this.scope.model.user.select({
      with: {
        posts: $relationDynamic.hasMany(() => ModelPost, 'userId', {
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

Vona ORM automatically infers the type of `users`

![](../../../assets/img/orm/aggr-group/aggr-group-3.png)

| Name                     | Description                                                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| with.posts               | Relation Name                                                                                                        |
| $relationDynamic.hasMany | `1:n`                                                                                                                |
| ModelPost                | Target Model                                                                                                         |
| 'userId'                 | Foreign key                                                                                                          |
| aggrs                    | The functions and columns to be aggregated. Functions: `count`/`sum`/`avg`/`min`/`max`. Columns: `string`/`string[]` |

## Static Relation

### 1. Define the relation

For demonstration purposes, create a new Model `UserStats` and define a static relation `posts`

```typescript
@Model({
  entity: EntityUser,
  relations: {
    posts: $relation.hasMany(() => ModelPost, 'userId', {
      aggrs: {
        count: '*',
        sum: 'stars',
      },
    }),
  },
})
class ModelUserStats {}
```

### 2. Using relations

```typescript
class ServiceUser {
  async relationAggregate() {
    const users = await this.scope.model.userStats.select({
      include: {
        posts: true,
      },
    });
    return users;
  }
}
```

Vona ORM automatically infers the type of `users`

![](../../../assets/img/orm/aggr-group/aggr-group-4.png)

## autoload

You can also set the static relation to `autoload: true` to achieve automatic loading, which can also further simplify the code.

### 1. Define the relation

```diff
@Model({
  entity: EntityUser,
  relations: {
    posts: $relation.hasMany(() => ModelPost, 'userId', {
+     autoload: true,
      aggrs: {
        count: '*',
        sum: 'stars',
      },
    }),
  },
})
class ModelUserStats {}
```

### 2. Using relations

```typescript
class ServiceUser {
  async relationAggregate() {
    const users = await this.scope.model.userStats.select();
    return users;
  }
}
```
