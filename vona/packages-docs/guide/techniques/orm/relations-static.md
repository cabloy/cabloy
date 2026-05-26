# Relations(Static)

The following is to use the module `test-vona` as an example to explain the usage of `static relations`

## Four kinds of Relations

Vona ORM provides 4 kinds of relations:

| Name          | Description                                                                           |
| ------------- | ------------------------------------------------------------------------------------- |
| hasOne        | `1:1`                                                                                 |
| belongsTo     | `1:1`/`n:1`                                                                           |
| hasMany       | `1:n`. It can realize the functions of `main-details` and `main-details(multi-level)` |
| belongsToMany | `n:n`                                                                                 |

## hasOne

### 1. Define the relation

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

| Name                  | Description             |
| --------------------- | ----------------------- |
| relations.postContent | Relation Name           |
| $relation.hasOne      | `1:1`                   |
| ModelPostContent      | Taget Model             |
| 'postId'              | Foreign key             |
| columns               | List of fields to query |

::: warning
Any changes to the `relations` node require executing `Vona Tools: Generate .metadata` to generate the corresponding type definition
:::

### 2. Using relations

The `hasOne` relation defined in the model can be used for all `CRUD` operations. Use `include` to specify the relation to be operated on, for example, `postContent: true`. Then, when the system operates on the Model Post, it will also operate on the Model PostContent.

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

### 1. Define the relation

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

| Name                | Description             |
| ------------------- | ----------------------- |
| relations.post      | Relation Name           |
| $relation.belongsTo | `1:1`/`n:1`             |
| ModelPostContent    | Source Model            |
| ModelPost           | Target Model            |
| 'postId'            | Foreign key             |
| columns             | List of fields to query |

### 2. Using relations

The `belongsTo` relation defined in the Model is only used for query operation. Use `include` to specify the relation to be queried, such as `post: true`, then the system will query the Model Post while querying the Model PostContent.

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

### 1. Define the relation

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

| Name               | Description             |
| ------------------ | ----------------------- |
| relations.products | Relation Name           |
| $relation.hasMany  | `1:n`                   |
| ModelProduct       | Target Model            |
| 'orderId'          | Foreign key             |
| columns            | List of fields to query |

### 2. Using relations

The `hasMany` relation defined in the Model can be used for all `CRUD` operations. Use `include` to specify the relation to be operated, such as `products: true`, then the system will operate on the Model Product while operating on the Model Order.

```typescript
class ServiceOrder {
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

- When updating main table data, you can also update detail table data simultaneously (including Insert/Update/Delete operations)
  - See: [CRUD (Insert/Update/Delete) - Mutate](./crud-cud.md#mutate)

## belongsToMany

### 1. Define the relation

Defining an `n:n` relation requires an intermediate Model. For example, if the Model User and Model Role are `n:n`, you need to provide an intermediate Model RoleUser.

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

| Name                    | Description             |
| ----------------------- | ----------------------- |
| relations.roles         | Relation Name           |
| $relation.belongsToMany | `n:n`                   |
| 'test-vona:roleUser'    | Middle Model            |
| 'test-vona:role'        | Target Model            |
| 'userId'                | Foreign key             |
| 'roleId'                | Foreign key             |
| columns                 | List of fields to query |

### 2. Using relations

The `belongsToMany` relation defined in the Model can be used for all `CRUD` operations. It is important to emphasize that the CRUD operations here are for the intermediate Model, not the target Model. By specifying the relation to be operated on by `include`, such as `roles: true`, the system will operate on the intermediate Model RoleUser at the same time as the Model User.

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

As you can see from the previous demonstration, if you want to operate on a relation, you need to specify the corresponding relation option using `include`

If the relation you want to operate on is frequently, you can set `autoload: true` on the relation, thus omitting the `include` option.

## Tree structure

Next, we implement a directory tree to demonstrate how to use `autoload` to implement a tree structure.

### 1. Define the relation

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

| Name               | Description             |
| ------------------ | ----------------------- |
| relations.children | Relation Name           |
| $relation.hasMany  | `1:n`                   |
| ModelCategory      | Target Model            |
| 'categoryIdParent' | Foreign key             |
| autoload           | Autoload                |
| columns            | List of fields to query |

### 2. Using relations

- Because a `hasMany` relation is defined with itself, a tree structure is formed. This tree structure can be used for all `CRUD` operations
- Because `autoload: true` is defined, the system automatically operates on children while operating on the main data

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

## Tree structure (reverse query)

The previous demonstration shows how to query a directory tree from the parent to the children. The following demonstration shows how to query a directory tree from the child to the parent.

### 1. Define the relation

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

| Name                | Description             |
| ------------------- | ----------------------- |
| relations.parent    | Relation Name           |
| $relation.belongsTo | `n:1`                   |
| ModelCategoryChain  | Source Model            |
| ModelCategoryChain  | Target Model            |
| 'categoryIdParent'  | Foreign key             |
| autoload            | Autoload                |
| columns             | List of fields to query |

### 2. Using relations

- Due to the `belongsTo` relation defined with itself, an inverted tree structure is formed. This tree structure is only used for query operation
- Due to `autoload: true` being defined, the system will automatically query the parent directories when querying subdirectory

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

## Relation Options

### 1. $relation.hasOne/$relation.belongsTo

| Name        | Description                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------- |
| autoload    | Autoload                                                                                      |
| columns     | List of fields to query                                                                       |
| meta.client | Define the datasource used by the relation, which can realize cross-datasource relation query |
| meta.table  | Define the data table used by the relation                                                    |

### 2. $relation.hasMany/$relation.belongsToMany

| Name        | Description                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------- |
| autoload    | Autoload                                                                                      |
| columns     | List of fields to query                                                                       |
| meta.client | Define the datasource used by the relation, which can realize cross-datasource relation query |
| meta.table  | Define the data table used by the relation                                                    |
| distinct    | Whether to enable distinct                                                                    |
| where       | Conditional statement                                                                         |
| joins       | Related tables                                                                                |
| orders      | Sorting                                                                                       |
| limit       | Can be used for paginated queries                                                             |
| offset      | Can be used for paginated queries                                                             |
| aggrs       | Aggregate query                                                                               |
| groups      | Group-by query                                                                                |

## Parameter: Model

When defining a relation, you need to provide the following parameters: `Source Model`, `Target Model`, and `Intermediate Model`. The following types are supported:

| Name             | Description                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| ModelPost        | Model Class                                                             |
| () => ModelPost  | Use a function to delay loading to avoid circular dependency errors     |
| 'test-vona:post' | When using models across modules, typically use the model name directly |
