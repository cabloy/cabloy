# Relations(Dynamic)

In large-scale business systems, we create numerous models with numerous relations between them. It's impossible to declare all relations using `static relations`. This is especially true when there are numerous business modules with models scattered across them. Declaring all relations using `static relations` becomes impractical. Without pre-defined `static relations`, we need to implement a mechanism for using `dynamic relations` in our code to enable querying, type inference, and DTO infer and generation.

The following uses `test-vona` module as an example to explain how to use `dynamic relations`

## Four kinds of Relations

Vona ORM provides 4 kinds of dynamic relations:

| Name          | Description                                                                           |
| ------------- | ------------------------------------------------------------------------------------- |
| hasOne        | `1:1`                                                                                 |
| belongsTo     | `1:1`/`n:1`                                                                           |
| hasMany       | `1:n`. It can realize the functions of `main-details` and `main-details(multi-level)` |
| belongsToMany | `n:n`                                                                                 |

## hasOne

Specify dynamic relations directly in CRUD operations using `with`

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

| Name                    | Description             |
| ----------------------- | ----------------------- |
| with.postContent        | Relation Name           |
| $relationDynamic.hasOne | `1:1`                   |
| ModelPostContent        | Taget Model             |
| 'postId'                | Foreign key             |
| columns                 | List of fields to query |

## belongsTo

The `belongsTo` relation is only used for query operations. Specify dynamic relations directly in the query operation through `with`

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

| Name                       | Description             |
| -------------------------- | ----------------------- |
| with.post                  | Relation Name           |
| $relationDynamic.belongsTo | `1:1`/`n:1`             |
| ModelPostContent           | Source Model            |
| ModelPost                  | Target Model            |
| 'postId'                   | Foreign key             |
| columns                    | List of fields to query |

## hasMany

Specify dynamic relations directly in CRUD operations using `with`

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

- When updating main table data, you can also update detail table data simultaneously (including Insert/Update/Delete operations)
  - See: [CRUD (Insert/Update/Delete) - Mutate](./crud-cud.md#mutate)

| Name                     | Description                                                                                                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| with.products2           | Relation Name. Since `test-vona` module already defines the static relation `products` which `autoload` be set `true`. For demonstration purposes, a different relation name `products2` is used |
| $relationDynamic.hasMany | `1:n`                                                                                                                                                                                            |
| ModelProduct             | Target Model                                                                                                                                                                                     |
| 'orderId'                | Foreign key                                                                                                                                                                                      |
| columns                  | List of fields to query                                                                                                                                                                          |

## belongsToMany

Directly specifying a dynamic relation using `with` in CRUD operations requires providing the intermediate model `RoleUser`. It should be emphasized that the CRUD operations here are for the intermediate model, not the target model.

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

| Name                           | Description             |
| ------------------------------ | ----------------------- |
| with.roles                     | Relation Name           |
| $relationDynamic.belongsToMany | `n:n`                   |
| ModelRoleUser                  | Middle Model            |
| ModelRole                      | Target Model            |
| 'userId'                       | Foreign key             |
| 'roleId'                       | Foreign key             |
| columns                        | List of fields to query |

## Tree structure

Since the tree structure references itself, using a `static relation` with `autoload: true` is most convenient and concise way to write code.

For demonstration purposes, we'll still implement the tree structure using a `dynamic relation`

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

| Name                     | Description                                                                                                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| with.children2           | Relation Name. Since `test-vona` module already defines the static relation `children` which `autoload` be set `true`. For demonstration purposes, a different relation name `children2` is used |
| $relationDynamic.hasMany | `1:n`                                                                                                                                                                                            |
| ModelCategory            | Target Model                                                                                                                                                                                     |
| 'categoryIdParent'       | Foreign key                                                                                                                                                                                      |
| columns                  | List of fields to query                                                                                                                                                                          |

## Relation Options

### 1. $relationDynamic.hasOne/$relationDynamic.belongsTo

| Name        | Description                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------- |
| columns     | List of fields to query                                                                       |
| include     | Specifying nested static relations                                                            |
| with        | Specifying nested dynamic relations                                                           |
| meta.client | Define the datasource used by the relation, which can realize cross-datasource relation query |
| meta.table  | Define the data table used by the relation                                                    |

### 2. $relationDynamic.hasMany/$relationDynamic.belongsToMany

| Name        | Description                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------- |
| columns     | List of fields to query                                                                       |
| include     | Specifying nested static relations                                                            |
| with        | Specifying nested dynamic relations                                                           |
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
