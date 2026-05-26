# 动态关系

在大型业务系统中，我们会创建大量 Models，这些 Models 之间的关联众多，我们不可能将所有关联通过`静态关系`的机制事先声明出来。特别是当存在大量业务模块，这些 Models 散落在不同的业务模块中，那么通过`静态关系`事先声明所有的关联关系也变得不太现实。如果事先没有定义`静态关系`，在实际代码中，我们就需要提供一种使用`动态关系`的机制，让我们的查询、类型推断、DTO 推断与生成等能力得以正常使用。

下面以模块`test-vona`为例，讲解`动态关系`的用法。

## 4种关系

Vona ORM 提供了 4 种动态关系：

| 名称          | 说明                                                      |
| ------------- | --------------------------------------------------------- |
| hasOne        | `1:1`                                                     |
| belongsTo     | `1:1`/`n:1`                                               |
| hasMany       | `1:n`。可以实现`主表-明细表`，以及`主表-多级明细表`的功能 |
| belongsToMany | `n:n`                                                     |

## hasOne

直接在 CRUD 操作中通过`with`指定动态关系。

```typescript
class ServicePost {
  async relationHasOne() {
    // insert
    const postCreate = await this.scope.model.post.insert(
      {
        title: 'Post001',
        postContent: {
          content: 'This is a post',
        },
      },
      {
        with: {
          postContent: $relationDynamic.hasOne(() => ModelPostContent, 'postId'),
        },
      },
    );
    // get
    const post = await this.scope.model.post.get(
      {
        id: postCreate.id,
      },
      {
        with: {
          postContent: $relationDynamic.hasOne(() => ModelPostContent, 'postId', {
            columns: ['id', 'content'],
          }),
        },
      },
    );
    // update
    await this.scope.model.post.update(
      {
        id: postCreate.id,
        title: 'Post001-Update',
        postContent: {
          content: 'This is a post-changed',
        },
      },
      {
        with: {
          postContent: $relationDynamic.hasOne(() => ModelPostContent, 'postId'),
        },
      },
    );
    // delete
    await this.scope.model.post.delete(
      {
        id: postCreate.id,
      },
      {
        with: {
          postContent: $relationDynamic.hasOne(() => ModelPostContent, 'postId'),
        },
      },
    );
  }
}
```

| 名称                    | 说明             |
| ----------------------- | ---------------- |
| with.postContent        | 关系名           |
| $relationDynamic.hasOne | 定义`1:1`关系    |
| ModelPostContent        | 目标Model        |
| 'postId'                | 外键             |
| columns                 | 要查询的字段列表 |

## belongsTo

belongsTo 关系只用于查询操作。直接在查询操作中通过`with`指定动态关系。

```typescript
class ServicePost {
  async relationBelongsTo() {
    const postContent = await this.scope.model.postContent.select({
      with: {
        post: $relationDynamic.belongsTo(
          () => ModelPostContent,
          () => ModelPost,
          'postId',
          {
            columns: ['id', 'title'],
          },
        ),
      },
    });
    console.log(postContent[0]?.post?.title);
  }
}
```

| 名称                       | 说明                |
| -------------------------- | ------------------- |
| with.post                  | 关系名              |
| $relationDynamic.belongsTo | 定义`1:1`/`n:1`关系 |
| ModelPostContent           | 源Model             |
| ModelPost                  | 目标Model           |
| 'postId'                   | 外键                |
| columns                    | 要查询的字段列表    |

## hasMany

直接在 CRUD 操作中通过`with`指定动态关系。

```typescript
class ServiceOrder {
  async relationHasMany() {
    // insert
    const orderCreate = await this.scope.model.order.insert(
      {
        orderNo: 'Order001',
        products2: [{ name: 'Apple' }, { name: 'Pear' }],
      },
      {
        with: {
          products2: $relationDynamic.hasMany(() => ModelProduct, 'orderId'),
        },
      },
    );
    // get
    await this.scope.model.order.get(
      {
        id: orderCreate.id,
      },
      {
        with: {
          products2: $relationDynamic.hasMany(() => ModelProduct, 'orderId', {
            columns: ['id', 'name', 'price', 'quantity', 'amount'],
          }),
        },
      },
    );
    // update
    await this.scope.model.order.update(
      {
        id: orderCreate.id,
        orderNo: 'Order001-Update',
        products2: [
          // create product: Peach
          { name: 'Peach' },
          // update product: Apple
          { id: orderCreate.products?.[0].id, name: 'Apple-Update' },
          // delete product: Pear
          { id: orderCreate.products?.[1].id, deleted: true },
        ],
      },
      {
        with: {
          products2: $relationDynamic.hasMany(() => ModelProduct, 'orderId'),
        },
      },
    );
    // delete
    await this.scope.model.order.delete(
      {
        id: orderCreate.id,
      },
      {
        with: {
          products2: $relationDynamic.hasMany(() => ModelProduct, 'orderId'),
        },
      },
    );
  }
}
```

- 当更新主表数据时，可以同时更新明细表数据（包括 Insert/Update/Delete）
  - 参见：[CRUD(插入/更新/删除)-mutate](./crud-cud.md#mutate)

| 名称                     | 说明                                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| with.products2           | 关系名。由于`test-vona`模块已经定义了静态关系`products`，并且是自动加载的。为了演示起见，使用不同的关系名`products2` |
| $relationDynamic.hasMany | 定义`1:n`关系                                                                                                        |
| ModelProduct             | 目标Model                                                                                                            |
| 'orderId'                | 外键                                                                                                                 |
| columns                  | 要查询的字段列表                                                                                                     |

## belongsToMany

直接在 CRUD 操作中通过`with`指定动态关系，需要提供中间 Model RoleUser。需要强调的是，这里的 CRUD 操作是针对中间 Model，而不是目标 Model。

```typescript
class ServiceUser {
  async relationBelongsToMany() {
    // insert: roles
    const roles = await this.scope.model.role.insertBulk([
      { name: 'role-family' },
      { name: 'role-friend' },
    ]);
    const roleIdFamily = roles[0].id;
    const roleIdFriend = roles[1].id;
    // insert: user
    const userCreate = await this.scope.model.user.insert(
      {
        name: 'Tom',
        roles: [
          {
            id: roleIdFamily,
          },
        ],
      },
      {
        with: {
          roles: $relationDynamic.belongsToMany(
            () => ModelRoleUser,
            () => ModelRole,
            'userId',
            'roleId',
          ),
        },
      },
    );
    // get: user
    await this.scope.model.user.get(
      {
        id: userCreate.id,
      },
      {
        with: {
          roles: $relationDynamic.belongsToMany(
            () => ModelRoleUser,
            () => ModelRole,
            'userId',
            'roleId',
            {
              columns: ['id', 'name'],
            },
          ),
        },
      },
    );
    // update: user
    await this.scope.model.user.update(
      {
        id: userCreate.id,
        roles: [
          // delete
          { id: roleIdFamily, deleted: true },
          // insert
          { id: roleIdFriend },
        ],
      },
      {
        with: {
          roles: $relationDynamic.belongsToMany(
            () => ModelRoleUser,
            () => ModelRole,
            'userId',
            'roleId',
            {
              columns: ['id', 'name'],
            },
          ),
        },
      },
    );
    // delete: user
    await this.scope.model.user.delete(
      {
        id: userCreate.id,
      },
      {
        with: {
          roles: $relationDynamic.belongsToMany(
            () => ModelRoleUser,
            () => ModelRole,
            'userId',
            'roleId',
          ),
        },
      },
    );
  }
}
```

| 名称                           | 说明             |
| ------------------------------ | ---------------- |
| with.roles                     | 关系名           |
| $relationDynamic.belongsToMany | 定义`n:n`关系    |
| ModelRoleUser                  | 中间Model        |
| ModelRole                      | 目标Model        |
| 'userId'                       | 外键             |
| 'roleId'                       | 外键             |
| columns                        | 要查询的字段列表 |

## 树形结构

由于树形结构是与自身关联的多级关系，因此使用`autoload: true`的`静态关系`最方便，代码也最简洁。

为了演示起见，我们仍然通过`动态关系`来实现树形结构。

```typescript
class ServiceCategory {
  async categoryTreeDynamic() {
    // create
    const treeCreate = await this.scope.model.category.insert(
      {
        name: 'Category-1',
        children2: [
          {
            name: 'Category-1-1',
            children2: [{ name: 'Category-1-1-1' }],
          },
          {
            name: 'Category-1-2',
          },
        ],
      },
      {
        with: {
          children2: $relationDynamic.hasMany(() => ModelCategory, 'categoryIdParent', {
            with: {
              children2: $relationDynamic.hasMany(() => ModelCategory, 'categoryIdParent', {}),
            },
          }),
        },
      },
    );
    // get
    const tree = await this.scope.model.category.get(
      {
        id: treeCreate.id,
      },
      {
        with: {
          children2: $relationDynamic.hasMany(() => ModelCategory, 'categoryIdParent', {
            columns: ['id', 'name'],
            with: {
              children2: $relationDynamic.hasMany(() => ModelCategory, 'categoryIdParent', {
                columns: ['id', 'name'],
              }),
            },
          }),
        },
      },
    );
    assert.equal(tree?.children2.length, 2);
    assert.equal(tree?.children2[0].children2.length, 1);
    // update
    await this.scope.model.category.update(
      {
        id: treeCreate.id,
        name: 'Category-1-Update',
        children2: [
          // create
          { name: 'Category-1-3' },
          // update
          { id: treeCreate.children2?.[0].id, name: 'Category-1-1-Update' },
          // delete
          { id: treeCreate.children2?.[1].id, deleted: true },
        ],
      },
      {
        with: {
          children2: $relationDynamic.hasMany(() => ModelCategory, 'categoryIdParent'),
        },
      },
    );
    // delete
    await this.scope.model.category.delete(
      {
        id: treeCreate.id,
      },
      {
        with: {
          children2: $relationDynamic.hasMany(() => ModelCategory, 'categoryIdParent', {
            with: {
              children2: $relationDynamic.hasMany(() => ModelCategory, 'categoryIdParent', {}),
            },
          }),
        },
      },
    );
  }
}
```

| 名称                     | 说明                                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| with.children2           | 关系名。由于`test-vona`模块已经定义了静态关系`children`，并且是自动加载的。为了演示起见，使用不同的关系名`children2` |
| $relationDynamic.hasMany | 定义`1:n`关系                                                                                                        |
| ModelCategory            | 目标Model                                                                                                            |
| 'categoryIdParent'       | 外键                                                                                                                 |
| columns                  | 要查询的字段列表                                                                                                     |

## 关系选项

### 1. $relationDynamic.hasOne/$relationDynamic.belongsTo

| 名称        | 说明                                               |
| ----------- | -------------------------------------------------- |
| columns     | 要查询的字段列表                                   |
| include     | 指定嵌套的静态关系                                 |
| with        | 指定嵌套的动态关系                                 |
| meta.client | 定义关系所使用的数据源，可以实现跨数据源的关系查询 |
| meta.table  | 定义关系所使用的数据表                             |

### 2. $relationDynamic.hasMany/$relationDynamic.belongsToMany

| 名称        | 说明                                               |
| ----------- | -------------------------------------------------- |
| columns     | 要查询的字段列表                                   |
| include     | 指定嵌套的静态关系                                 |
| with        | 指定嵌套的动态关系                                 |
| meta.client | 定义关系所使用的数据源，可以实现跨数据源的关系查询 |
| meta.table  | 定义关系所使用的数据表                             |
| distinct    | 是否启用 distinct                                  |
| where       | 条件语句                                           |
| joins       | 关联表                                             |
| orders      | 排序                                               |
| limit       | 可用于分页查询                                     |
| offset      | 可用于分页查询                                     |
| aggrs       | 聚合查询                                           |
| groups      | 分组查询                                           |

## Model参数

在定义关系时需要提供参数：`源Model`/`目标Model`/`中间Model`，支持以下类型：

| 名称             | 说明                                         |
| ---------------- | -------------------------------------------- |
| ModelPost        | Model Class                                  |
| () => ModelPost  | 通过函数延迟加载，从而避免触发循环依赖的错误 |
| 'test-vona:post' | 当跨模块使用Model时，一般直接使用Model名     |
