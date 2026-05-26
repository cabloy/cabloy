# 静态关系

下面以模块`test-vona`为例，讲解`静态关系`的用法。

## 4种关系

Vona ORM 提供了 4 种关系：

| 名称          | 说明                                                      |
| ------------- | --------------------------------------------------------- |
| hasOne        | `1:1`                                                     |
| belongsTo     | `1:1`/`n:1`                                               |
| hasMany       | `1:n`。可以实现`主表-明细表`，以及`主表-多级明细表`的功能 |
| belongsToMany | `n:n`                                                     |

## hasOne

### 1. 定义关系

```typescript
import { ModelPostContent } from './postContent.ts';

@Model({
  entity: EntityPost,
  relations: {
    postContent: $relation.hasOne(ModelPostContent, 'postId', { columns: ['id', 'content'] }),
  },
})
class ModelPost {}
```

| 名称                  | 说明             |
| --------------------- | ---------------- |
| relations.postContent | 关系名           |
| $relation.hasOne      | 定义`1:1`关系    |
| ModelPostContent      | 目标Model        |
| 'postId'              | 外键             |
| columns               | 要查询的字段列表 |

::: warning
`relations`节点有任何变更，都需要执行菜单：`Vona Tools: Generate .metadata`，从而同步生成对应的类型定义
:::

### 2. 使用关系

在 Model 中定义的 hasOne 关系可以用于所有 CRUD 操作。通过`include`指定需要操作的关系，比如`postContent: true`，那么，系统在操作 Model Post 的同时，也会操作 Model PostContent。

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
        include: {
          postContent: true,
        },
      },
    );
    // get
    const post = await this.scope.model.post.get(
      {
        id: postCreate.id,
      },
      {
        include: {
          postContent: true,
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
        include: {
          postContent: true,
        },
      },
    );
    // delete
    await this.scope.model.post.delete(
      {
        id: postCreate.id,
      },
      {
        include: {
          postContent: true,
        },
      },
    );
  }
}
```

## belongsTo

### 1. 定义关系

```typescript
@Model({
  entity: EntityPostContent,
  relations: {
    post: $relation.belongsTo(
      () => ModelPostContent,
      () => ModelPost,
      'postId',
      { columns: '*' },
    ),
  },
})
class ModelPostContent {}
```

| 名称                | 说明                |
| ------------------- | ------------------- |
| relations.post      | 关系名              |
| $relation.belongsTo | 定义`1:1`/`n:1`关系 |
| ModelPostContent    | 源Model             |
| ModelPost           | 目标Model           |
| 'postId'            | 外键                |
| columns             | 要查询的字段列表    |

### 2. 使用关系

在 Model 中定义的 belongsTo 关系只用于查询操作。通过`include`指定需要查询的关系，比如`post: true`，那么，系统在查询 Model PostContent 的同时，也会查询 Model Post。

```typescript
class ServicePost {
  async relationBelongsTo() {
    const postContent = await this.scope.model.postContent.select({
      include: {
        post: true,
      },
    });
    console.log(postContent[0]?.post?.title);
  }
}
```

## hasMany

### 1. 定义关系

```typescript
import { ModelProduct } from './product.ts';

@Model({
  entity: EntityOrder,
  relations: {
    products: $relation.hasMany(() => ModelProduct, 'orderId', {
      columns: ['id', 'name', 'price', 'quantity', 'amount'],
    }),
  },
})
class ModelOrder {}
```

| 名称               | 说明             |
| ------------------ | ---------------- |
| relations.products | 关系名           |
| $relation.hasMany  | 定义`1:n`关系    |
| ModelProduct       | 目标Model        |
| 'orderId'          | 外键             |
| columns            | 要查询的字段列表 |

### 2. 使用关系

在 Model 中定义的 hasMany 关系可以用于所有 CRUD 操作。通过`include`指定需要操作的关系，比如`products: true`，那么，系统在操作 Model Order 的同时，也会操作 Model Product。

```typescript
class ServicePost {
  async relationHasMany() {
    // insert
    const orderCreate = await this.scope.model.order.insert(
      {
        orderNo: 'Order001',
        products: [{ name: 'Apple' }, { name: 'Pear' }],
      },
      {
        include: {
          products: true,
        },
      },
    );
    // get
    const _order = await this.scope.model.order.get(
      {
        id: orderCreate.id,
      },
      {
        include: {
          products: true,
        },
      },
    );
    // update
    await this.scope.model.order.update(
      {
        id: orderCreate.id,
        orderNo: 'Order001-Update',
        products: [
          // create product: Peach
          { name: 'Peach' },
          // update product: Apple
          { id: orderCreate.products?.[0].id, name: 'Apple-Update' },
          // delete product: Pear
          { id: orderCreate.products?.[1].id, deleted: true },
        ],
      },
      {
        include: {
          products: true,
        },
      },
    );
    // delete
    await this.scope.model.order.delete(
      {
        id: orderCreate.id,
      },
      {
        include: {
          products: true,
        },
      },
    );
  }
}
```

- 当更新主表数据时，可以同时更新明细表数据（包括 Insert/Update/Delete）
  - 参见：[CRUD(插入/更新/删除)-mutate](./crud-cud.md#mutate)

## belongsToMany

### 1. 定义关系

定义`n:n`关系需要中间 Model。比如，Model User 和 Model Role 是`n:n`，需要提供中间 Model RoleUser。

```typescript
@Model({
  entity: EntityUser,
  relations: {
    roles: $relation.belongsToMany('test-vona:roleUser', 'test-vona:role', 'userId', 'roleId', {
      columns: ['id', 'name'],
    }),
  },
})
class ModelUser {}
```

| 名称                    | 说明             |
| ----------------------- | ---------------- |
| relations.roles         | 关系名           |
| $relation.belongsToMany | 定义`n:n`关系    |
| 'test-vona:roleUser'    | 中间Model        |
| 'test-vona:role'        | 目标Model        |
| 'userId'                | 外键             |
| 'roleId'                | 外键             |
| columns                 | 要查询的字段列表 |

### 2. 使用关系

在 Model 中定义的 belongsToMany 关系可以用于所有 CRUD 操作。需要强调的是，这里的 CRUD 操作是针对中间 Model，而不是目标 Model。通过`include`指定需要操作的关系，比如`roles: true`，那么，系统在操作 Model User 的同时，也会操作中间 Model RoleUser。

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
        include: {
          roles: true,
        },
      },
    );
    // get: user
    await this.scope.model.user.get(
      {
        id: userCreate.id,
      },
      {
        include: {
          roles: true,
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
        include: {
          roles: true,
        },
      },
    );
    // delete: user
    await this.scope.model.user.delete(
      {
        id: userCreate.id,
      },
      {
        include: {
          roles: true,
        },
      },
    );
  }
}
```

## autoload

通过前面的演示可以看到，如果要对关系进行操作，需要通过`include`指定对应的关系选项。

如果需要关联的关系属于频繁操作，那么可以设置关系`autoload: true`，从而省去`include`选项。

## 树形结构

接下来实现一棵目录树，来演示如何利用`autoload`实现一个树形结构。

### 1. 定义关系

```typescript
@Model({
  entity: EntityCategory,
  relations: {
    children: $relation.hasMany(() => ModelCategory, 'categoryIdParent', {
      autoload: true,
      columns: ['id', 'name'],
    }),
  },
})
class ModelCategory {}
```

| 名称               | 说明             |
| ------------------ | ---------------- |
| relations.children | 关系名           |
| $relation.hasMany  | 定义`1:n`关系    |
| ModelCategory      | 目标Model        |
| 'categoryIdParent' | 外键             |
| autoload           | 自动加载         |
| columns            | 要查询的字段列表 |

### 2. 使用关系

- 由于定义了与自身的 hasMany 关系，从而形成树形结构。此树形结构可以用于所有 CRUD 操作
- 由于定义了`autoload: true`，那么，系统在操作主数据的同时，也会自动操作 children

```typescript
class ServiceCategory {
  async categoryTree() {
    // create
    const treeCreate = await this.scope.model.category.insert({
      name: 'Category-1',
      children: [
        {
          name: 'Category-1-1',
          children: [{ name: 'Category-1-1-1' }],
        },
        {
          name: 'Category-1-2',
        },
      ],
    });
    // get
    const tree = await this.scope.model.category.get({
      id: treeCreate.id,
    });
    assert.equal(tree?.children.length, 2);
    assert.equal(tree?.children[0].children.length, 1);
    // update
    await this.scope.model.category.update({
      id: treeCreate.id,
      name: 'Category-1-Update',
      children: [
        // create
        { name: 'Category-1-3' },
        // update
        { id: treeCreate.children?.[0].id, name: 'Category-1-1-Update' },
        // delete
        { id: treeCreate.children?.[1].id, deleted: true },
      ],
    });
    // delete
    await this.scope.model.category.delete({
      id: treeCreate.id,
    });
  }
}
```

## 树形结构（反向查询）

前面演示的是如何从父级向子级查询一棵目录树，接下来演示从子级向父级查询目录树。

### 1. 定义关系

```typescript
@Model({
  entity: EntityCategory,
  relations: {
    parent: $relation.belongsTo(
      () => ModelCategoryChain,
      () => ModelCategoryChain,
      'categoryIdParent',
      {
        autoload: true,
        columns: ['id', 'name', 'categoryIdParent'],
      },
    ),
  },
})
class ModelCategoryChain {}
```

| 名称                | 说明             |
| ------------------- | ---------------- |
| relations.parent    | 关系名           |
| $relation.belongsTo | 定义`n:1`关系    |
| ModelCategoryChain  | 源Model          |
| ModelCategoryChain  | 目标Model        |
| 'categoryIdParent'  | 外键             |
| autoload            | 自动加载         |
| columns             | 要查询的字段列表 |

### 2. 使用关系

- 由于定义了与自身的 belongsTo 关系，从而形成反向的树形结构。此树形结构只用于查询操作
- 由于定义了`autoload: true`，那么，系统在查询子目录的同时，也会自动查询 parent

```typescript
class ServiceCategory {
  async categoryTreeReverse() {
    // create
    const treeCreate = await this.scope.model.category.insert({
      name: 'Category-1',
      children: [
        {
          name: 'Category-1-1',
          children: [{ name: 'Category-1-1-1' }],
        },
        {
          name: 'Category-1-2',
        },
      ],
    });
    // 'Category-1-1-1'
    const subCategoryId = treeCreate.children?.[0].children?.[0].id;
    // get: reverse
    const subCategory = await this.scope.model.categoryChain.get({
      id: subCategoryId,
    });
    assert.equal(subCategory?.parent?.parent?.id, treeCreate.id);
  }
}
```

## 关系选项

### 1. $relation.hasOne/$relation.belongsTo

| 名称        | 说明                                               |
| ----------- | -------------------------------------------------- |
| autoload    | 自动加载                                           |
| columns     | 要查询的字段列表                                   |
| meta.client | 定义关系所使用的数据源，可以实现跨数据源的关系查询 |
| meta.table  | 定义关系所使用的数据表                             |

### 2. $relation.hasMany/$relation.belongsToMany

| 名称        | 说明                                               |
| ----------- | -------------------------------------------------- |
| autoload    | 自动加载                                           |
| columns     | 要查询的字段列表                                   |
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
