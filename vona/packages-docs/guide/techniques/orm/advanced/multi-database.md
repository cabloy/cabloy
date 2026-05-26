# Multi-database/Multi-datasource

Vona ORM supports `Multi-database/Multi-datasource`, with the following features:

1. Multi-database
   - For example: Sqlite3/PostgreSQL/MySQL
   - Support for new database dialects is continuously being added
2. Multi-datasource
3. Cross-datasource relation queries

The following example uses the `User/Order` model to query a user's order list to demonstrate how to use `Multi-database/Multi-datasource`

## Preparing Models

First prepare two Models: `User/Order`

1. Model Order

```typescript
@Model({
  entity: EntityOrder,
})
class ModelOrder {}
```

2. Model User

```typescript
@Model({
  entity: EntityUser,
  relations: {
    orders: $relation.hasMany(() => ModelOrder, 'userId'),
  },
})
class ModelUser {}
```

## Query data

Then query the user's order list.

```typescript
class ServiceOrder {
  async selectUserOrders() {
    const userId = 1;
    const userAndOrders = await this.scope.model.user.get(
      {
        id: userId,
      },
      {
        include: {
          orders: true,
        },
      },
    );
  }
}
```

So far, `system default datasource` has been used to query the user information of `userId=1` and the order list of this user.

## Create Datasources

Next, create two datasources: `user-pg` and `order-mysql`

### 1. Add datasource type definition

- In VSCode, create a type file in the module through the context menu `Vona Init/Types`

- Then add the type definition in the type file

`{module path}/src/types/index.ts`

```typescript
declare module 'vona-module-a-orm' {
  export interface IDatabaseClientRecord {
    'user-pg': never;
    'order-mysql': never;
  }
}
```

### 2. Datasources configuration

`src/backend/config/config/config.ts`

```typescript
// database
config.database = {
  clients: {
    'user-pg': {
      client: 'pg',
      connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: '',
        database: 'user-xxx',
      },
    },
    'order-mysql': {
      client: 'mysql2',
      connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'order-xxx',
      },
    },
  },
};
```

## Using Datasources: Dynamic Way

You can use datasources dynamically in your code:

```diff
class ServiceOrder {
  async selectUserOrders() {
    const userId = 1;
+   const modelUser = this.scope.model.user.newInstance('user-pg');
    const userAndOrders = await modelUser.get(
      {
        id: userId,
      },
      {
        include: {
          orders: true,
        },
      },
    );
  }
}
```

- `newInstance`: Passes the datasource to use and returns a new model instance

So far, we've used the `user-pg` datasource to query user information and the `system default datasource` to query order list.

## Using Datasources: Relation dynamic options

The datasource can be specified dynamically in the relation options:

```diff
class ServiceOrder {
  async selectUserOrders() {
    const userId = 1;
    const modelUser = this.scope.model.user.newInstance('user-pg');
    const userAndOrders = await modelUser.get(
      {
        id: userId,
      },
      {
        include: {
          orders: {
+           meta: {
+             client: 'order-mysql',
+           },
          },
        },
      },
    );
  }
}
```

- `meta.client`: specifies the datasource to be used by relation `orders`

So far, we use the datasource `user-pg` to query user information and the datasource `order-mysql` to query order list.

## Using Datasources: Model options

You can also configure the datasource directly in the Model options to simplify the query code.

1. Model Order

```diff
@Model({
  entity: EntityOrder,
+ client: 'order-mysql',
})
class ModelOrder{}
```

2. Model User

```diff
@Model({
  entity: EntityUser,
+ client: 'user-pg',
  relations: {
    orders: $relation.hasMany(() => ModelOrder, 'userId'),
  },
})
class ModelUser {}
```

3. Query data

Now, you can query the user's order list in the usual way.

```typescript
class ServiceOrder {
  async selectUserOrders() {
    const userId = 1;
    const userAndOrders = await this.scope.model.user.get(
      {
        id: userId,
      },
      {
        include: {
          orders: true,
        },
      },
    );
  }
}
```

## Using Datasources: App Config

You can also configure Model options in App Config:

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  model: {
    'test-vona:user': {
      client: 'user-pg',
    },
    'test-vona:order': {
      client: 'order-mysql',
    },
  },
};
```

Therefore, you can also use the usual way to query the user's order list.

## Using Datasources: Relation static options

Static options can also be specified when defining a Relation:

```diff
@Model({
  entity: EntityUser,
  client: 'user-pg',
  relations: {
    orders: $relation.hasMany(() => ModelOrder, 'userId', {
+     meta: {
+       client: 'order-mysql',
+     },
    }),
  },
})
class ModelUser {}
```

Similarly, you can also use the usual way to query the user's order list.
