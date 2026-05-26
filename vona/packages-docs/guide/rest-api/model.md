# Model

## Create Model

For example, we create a Model: `student` in the module demo-student.

### 1. Cli command

```bash
$ vona :create:bean model student --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path]: `Vona Create/Model`
:::

## Model Definition

```diff
import { BeanModelBase, Model } from 'vona-module-a-orm';
import { EntityStudent } from '../entity/student.ts';

+ @Model({ entity: EntityStudent })
export class ModelStudent extends BeanModelBase<EntityStudent> {}
```

- Set the corresponding `entity`

## Using Model

Using Model in Vona supports `dependency injection` and `dependency lookup`. It is recommended to use `dependency lookup` because it can make the code more concise and intuitive.

### 1. Lookup in this module

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.scope.model.student.select();
  }
}
```

### 2. Lookup Cross-module

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.$scope.demoStudent.model.student.select();
  }
}
```

You can also use `bean._getBean` to get the Model instance directly from the IOC container:

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.bean._getBean('demo-student.model.student').select();
  }
}
```

## CRUD

Here, we only introduce basic CRUD operations. For more information, see:

- [CRUD(Select)](../techniques/orm/crud-select.md)
- [CRUD(Insert/Update/Delete)](../techniques/orm/crud-cud.md)
- [CRUD(Magic Methods)](../techniques/orm/crud-magic.md)

### 1. Create

```typescript
class ServiceStudent {
  async create(student: DtoStudentCreate): Promise<EntityStudent> {
    return await this.scope.model.student.insert(student);
  }
}
```

### 2. Read

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.scope.model.student.select();
  }

  async findOne(id: TableIdentity): Promise<EntityStudent | undefined> {
    return await this.scope.model.student.getById(id);
  }
}
```

- id: The type is `TableIdentity`, supporting two field types: `number` and `bignumber`

### 3. Update

```typescript
class ServiceStudent {
  async update(id: TableIdentity, student: DtoStudentUpdate) {
    return await this.scope.model.student.updateById(id, student);
  }
}
```

### 4. Delete

```typescript
class ServiceStudent {
  async remove(id: TableIdentity) {
    return await this.scope.model.student.deleteById(id);
  }
}
```

## Knex Query Builder

Vona Model is based on [knex](https://knexjs.org/). Therefore, it also supports the [Query Builder](https://knexjs.org/guide/query-builder.html) provided by knex.

### 1. builder

Invoke the `builder` method of the model to obtain an instance of the knex query builder.

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.scope.model.student.builder().where('name', 'tom').orderBy('name');
  }
}
```

### 2. builderSelect

The `builderSelect` method also obtains an instance of the knex query builder. Unlike `builder`, `builderSelect` supports `soft deletion` and `multi-instance/multi-tenancy`

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.scope.model.student.builderSelect().where('name', 'tom').orderBy('name');
  }
}
```

### 3. Raw Sql

Raw Sql statements can be executed directly.

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.scope.model.student.query('select * from demoStudent');
  }
}
```

```typescript
class ServiceStudent {
  async findOne(id: TableIdentity): Promise<EntityStudent | undefined> {
    return await this.scope.model.student.queryOne('select * from demoStudent where id=?', [id]);
  }
}
```

## Model Options

| Name              | Description                                                                                                                               |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| entity            | Entity corresponding to model                                                                                                             |
| table             | Table name corresponding to model                                                                                                         |
| disableDeleted    | Whether to disable soft deletion, the default is false                                                                                    |
| disableInstance   | Whether to disable multi-instance/multi-tenancy, the default is false                                                                     |
| disableCreateTime | Whether to disable create time. The default value is false, and the system automatically sets the create time for new data                |
| disableUpdateTime | Whether to disable update time. The default value is false, and the system automatically sets the update time for the data to be modified |
| softDeletionPrune | Whether to automatically clean up soft deleted data                                                                                       |
| client            | Specify the datasource                                                                                                                    |
| cache             | Configure cache parameters, enable redis-based cache by default                                                                           |
| relations         | Specify models relationship, support: 1:1, 1:n, n:1, n:n                                                                                  |

- table:
  - If it is empty, the table name is automatically obtained from entity
  - You can also specify a function to achieve dynamic table partitioning

## App Config

Model options can be configured in App Config.

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  model: {
    'demo-student:student': {
      disableDeleted: true, // disable soft deletion
      disableInstance: true, // disable multi-instance/multi-tenancy
      client: 'mysql', // use datasource：mysql
      cache: false, // disable cache
    },
  },
};
```

## Dynamic table partitioning

Model supports dynamic table partitioning. For example, we partition the Order table and store the daily orders in a data table in the format of `order_YYYYMMDD`

```typescript
@Model({
  table: (ctx: VonaContext, where: EntityOrder | undefined, defaultTable: keyof ITableRecord) => {
    return `${defaultTable}_${moment().format('YYYYMMDD')}`;
  },
})
class ModelOrder {}
```

- `ctx`: can dynamically generate table name based on the context of the current request
- `where`: can dynamically generate table name based on the where conditions
- `defaultTable`: default table name

## Soft deletion, multi-instance/multi-tenancy

Model automatically enables soft deletion by default. When data deleting, it is not physically deleted, but the value of the field `deleted` is set to `true`

Model supports multi-instance/multi-tenancy by default. When performing CRUD operations on data, the instance id is automatically obtained from the Request context and passed into the sql statement.

For example, execute `model.student.select()`, then the generated sql is as follows:

```bash
select "demoStudent"."id" from "demoStudent"
  where "demoStudent"."iid" = 1 and "demoStudent"."deleted" = false
```

- iid: instance Id
- deleted: soft deletion

### 1. Temporarily disable soft deletion

We can also temporarily specify the `soft deletion` parameter when executing the model method.

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.scope.model.student.select({}, { disableDeleted: true });
  }
}
```

### 2. Prune soft deleted data

The system automatically cleans up expired soft deleted data. `softDeletionPrune` supports the following configurations:

- boolean: true/false
- {handler, expired}:
  - handler: Provides a custom prune function
  - expired: Specifies an expiration time

## Datasource

Vona supports `multi-database` and `multi-datasource`. Model methods can be invoked for any datasource.

### 1. Default datasource

By default, Model uses the default datasource set by the system.

`env/.env`

```bash
DATABASE_DEFAULT_CLIENT = 'sqlite3' # sqlite3/pg/mysql
```

### 2. Static datasource

- Specify the datasource in Model options

```diff
+ @Model({ client: 'mysql' })
class ModelBook {}
```

- Specify the datasource in App Config

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  model: {
    'demo-student:student': {
      clientName: 'mysql', // Use datasource: mysql
    },
  },
};
```

### 3. Adaptive datasource

In complex systems, we may need to use a different datasource based on the current request environment. To do this, we can use `Adaptive datasource`:

```typescript
@Model({
  client: (ctx: VonaContext) => {
    if (ctx.headers['xxx-xxx'] === 'xxx') return 'mysql';
    return 'pg';
  },
})
export class ModelOrder {}
```

### 4. Dynamic datasource

We can also specify the datasource dynamically in the code.

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    const modelMysql = this.scope.model.student.newInstance('mysql');
    return await modelMysql.select();
  }
}
```

## Cache

Vona Model has cache enabled by default, making the system high performant by default.

Model supports `two-layer cache`/`mem cache`/`redis cache`. `redis cache` is used by default. Because `redis cache` can maintain data consistency in distributed scenarios, while `mem cache` has a delay in synchronizing data in distributed scenarios. If business data changes infrequently, you can use `mem cache` or `two-layer cache` to achieve higher performance.

This briefly introduces the basic configuration of caching. For more detailed information, see: [Vona ORM: Caching](../techniques/orm/caching.md)

### 1. Disable cache

```typescript
@Model({ cache: false })
class ModelStudent {}
```

### 2. Configure cache in Model options

````typescript
``` typescript
@Model({ cache: {
  entity: {
    mode: 'all', // all/mem/redis
    mem: {
      max: 500,
      ttl: 5 * 1000, // 5s
    },
    redis: {
      ttl: 5 * 1000, // 5s
    },
  },
  query: {
    ...
  },
} })
class ModelStudent {}
````

- mode: cache mode
- mem: `mem cache` configuration
- redis: `redis cache` configuration

### 3. Configure cache in App Config

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  model: {
    'demo-student:student': {
      cache: {
        entity: {
          mode: 'all', // all/mem/redis
          mem: {
            max: 500,
            ttl: 5 * 1000, // 5s
          },
          redis: {
            ttl: 5 * 1000, // 5s
          },
        },
        query: {
          ...
        },
      }
    },
  },
};
```

### 4. Entity Cache and Query Cache

Vona provides two types of caches: `Entity Cache` and `Query Cache`:

- `Entity Cache`: EntityId -> Entity
- `Query Cache`: Hash of Query Clause -> EntityIds

> Question 1: Some may ask, doesn't the `Query Cache` take up a lot of space?
>
> - On the contrary, the space occupied by a `Query cache` is equal to `Hash + EntityIds`, thus saving more cache space. The system automatically uses the `EntityIds` to retrieve cached data from the `Entity Cache` and assembles it into the final query result

> Question 2: How do we ensure cached data consistency?
>
> - When data changes, the `Entity Cache` for the current data is automatically cleared, and all `Query Caches` for the current model are automatically cleared
