# Table-partitioning

For scenarios with high concurrency and large amounts of data, table-partitioning is often considered for optimization. Below, we take the `User/Order` model as an example to demonstrate how to use table-partitioning by querying the user's order list.

## Partitioning rules

For example, if you need to split the order table, you can design the table partitioning rules based on the actual business needs. Here, the table name is dynamically generated based on the `user ID`. For example, if the table is split into `16` tables and the `user ID` is `129`, the corresponding table names are as follows:

```typescript
const tableName = `Order_${129 % 16}`; // Order_1
```

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

### 1. Query the order list directly

```typescript
class ServiceOrder {
  async selectOrdersDirectly() {
    const userId = 129;
    const orders = await this.scope.model.order.select({
      where: {
        userId,
      },
    });
  }
}
```

So far, we've used the `default` table to query order list of `userId=129`

### 2. Query the order list by relation

```typescript
class ServiceOrder {
  async selectOrdersByRelation() {
    const userId = 129;
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

So far, we've used the `default` table to query user information of `userId=129` and the order list of this user.

## Using Table-partitioning: Dynamic Way

You can use table-partitioning dynamically in your code:

```diff
class ServiceOrder {
  async selectOrdersDirectly() {
    const userId = 129;
+   const tableName = `Order_${userId % 16}`;
+   const modelOrder = this.scope.model.order.newInstance(undefined, tableName as any);
    const orders = await modelOrder.select({
      where: {
        userId,
      },
    });
  }
}
```

- `newInstance`: Passes the table name to use and returns a new model instance

So far, we've used the `table-partitioning` to query order list.

## Using Table-partitioning: Relation dynamic options

The table name can be specified dynamically in the relation options:

```diff
class ServiceOrder {
  async selectOrdersByRelation() {
    const userId = 129;
+   const tableName = `Order_${userId % 16}`;
    const userAndOrders = await this.scope.model.user.get({
      id: userId,
    }, {
      include: {
        orders: {
+         meta: {
+           table: tableName as any,
+         },
        },
      },
    });
  }
}
```

- `meta.table`: specifies the table name to be used by relation `orders`

So far, we use the `defalut` table to query user information and the `table-partitioning` to query order list.

## Using Table-partitioning: Model options

You can also configure the `table-partitioning` directly in the Model options to simplify the query code.

1. Model Order

```diff
@Model({
  entity: EntityOrder,
+ table(_ctx: VonaContext, where: EntityOrder | undefined, defaultTable: keyof ITableRecord) {
+   const userId = where?.userId;
+   if (!userId) return defaultTable;
+   return `Order_${Number(userId) % 16}`;
+ },
})
class ModelOrder{}
```

- `table`: Specify a function to implement table-partitioning rules

2. Query data

Now, you can query the user's order list in the usual way.

```typescript
class ServiceOrder {
  async selectOrdersDirectly() {
    const userId = 129;
    const orders = await this.scope.model.order.select({
      where: {
        userId,
      },
    });
  }
}
```

```typescript
class ServiceOrder {
  async selectOrdersByRelation() {
    const userId = 129;
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

## Using Table-partitioning: App Config

You can also configure Model options in App Config:

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  model: {
    'test-vona:order': {
      table(_ctx: VonaContext, where: EntityOrder | undefined, defaultTable: keyof ITableRecord) {
        const userId = where?.userId;
        if (!userId) return defaultTable;
        return `Order_${Number(userId) % 16}`;
      },
    },
  },
};
```

Therefore, you can also use the usual way to query the user's order list.

## Using Table-partitioning: Relation static options

Static options can also be specified when defining a Relation:

```diff
@Model({
  entity: EntityUser,
  relations: {
    orders: $relation.hasMany(() => ModelOrder, 'userId', {
+     meta: {
+       table(_ctx: VonaContext, where: EntityOrder | undefined, defaultTable: keyof ITableRecord) {
+         const userId = where?.userId;
+         if (!userId) return defaultTable;
+         return `Order_${Number(userId) % 16}`;
+       },
+     },
    }),
  },
})
class ModelUser {}
```

Similarly, you can also use the usual way to query the user's order list.
