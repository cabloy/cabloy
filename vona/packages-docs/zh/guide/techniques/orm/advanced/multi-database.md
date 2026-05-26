# 多数据库/多数据源

Vona ORM 支持`多数据库/多数据源`，特性如下：

1. 支持多数据库
   - 例如：Sqlite3/Postgresql/MySQL
   - 持续增加新的数据库支持
2. 支持多数据源
3. 支持跨数据源的关联查询

下面以 Model User/Order 为例，通过查询用户的订单列表，来演示`多数据库/多数据源`的使用方法。

## 准备Models

先准备两个 Models：User/Order。

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

## 查询数据

然后查询用户的订单列表。

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

到目前为止，使用`系统默认数据源`查询`userId=1`的用户信息，和该用户的所有订单列表。

## 创建多数据源

接下来，创建两个数据源：`user-pg`和`order-mysql`

### 1. 添加数据源的类型定义

- 在 VSCode 中，通过右键菜单`Vona Init/Types`在模块中创建类型文件

- 然后在类型文件中添加类型定义

`{module path}/src/types/index.ts`

```typescript
declare module 'vona-module-a-orm' {
  export interface IDatabaseClientRecord {
    'user-pg': never;
    'order-mysql': never;
  }
}
```

### 2. 数据源配置

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

## 使用数据源：动态方式

可以在代码中动态使用数据源：

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

- `newInstance`: 传入要使用的数据源，返回新的 Model 实例

到目前为止，使用数据源`user-pg`查询用户信息，使用`系统默认数据源`查询订单列表。

## 使用数据源：Relation动态选项

可以在 relation 选项中动态指定数据源：

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

- `meta.client`: 指定 relation `orders`要使用的数据源

到目前为止，使用数据源`user-pg`查询用户信息，使用数据源`order-mysql`查询订单列表。

## 使用数据源：Model配置

也可以直接在 Model 中配置数据源，从而简化查询代码。

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

3. 查询数据

现在，又可以使用常规的方式查询用户的订单列表。

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

## 使用数据源：App Config配置

也可以在 App Config 中配置 Model options:

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

于是，也可以使用常规的方式查询用户的订单列表。

## 使用数据源：Relation静态选项

也可以在定义 Relation 时指定静态选项：

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

同样，也可以使用常规的方式查询用户的订单列表。
