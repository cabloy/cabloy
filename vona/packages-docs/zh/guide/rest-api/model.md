# Model

## 创建Model

比如，在模块 demo-student 中创建一个 Model: `student`

### 1. Cli命令

```bash
$ vona :create:bean model student --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Create/Model`
:::

## Model定义

```diff
import { BeanModelBase, Model } from 'vona-module-a-orm';
import { EntityStudent } from '../entity/student.ts';

+ @Model({ entity: EntityStudent })
export class ModelStudent extends BeanModelBase<EntityStudent> {}
```

- 设置对应的 entity

## 使用Model

在 Vona 中使用 Model，支持`依赖注入`和`依赖查找`。推荐使用依赖查找，因为依赖查找可以让代码更加简洁、直观。

### 1. 本模块查找

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.scope.model.student.select();
  }
}
```

### 2. 跨模块查找

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.$scope.demoStudent.model.student.select();
  }
}
```

也可以使用`bean._getBean`从 IOC 容器中直接获取 Model 实例：

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.bean._getBean('demo-student.model.student').select();
  }
}
```

## CRUD

在这里，仅介绍基本的 CRUD 操作。更多信息，参见：

- [CRUD(查询)](../techniques/orm/crud-select.md)
- [CRUD(插入/更新/删除)](../techniques/orm/crud-cud.md)
- [CRUD(魔术方法)](../techniques/orm/crud-magic.md)

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

- id: 类型为`TableIdentity`，支持`number`和`bignumber`两种字段类型

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

Vona Model 底层使用的是[knex](https://knexjs.org/)。因此，也支持 knex 提供的[Query Builder](https://knexjs.org/guide/query-builder.html)

### 1. builder

调用 model 的 builder 方法获取 knex query builder 的实例。

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.scope.model.student.builder().where('name', 'tom').orderBy('name');
  }
}
```

### 2. builderSelect

builderSelect 方法也是获取 knex query builder 的实例，与 builder 不同的是，builderSelect 支持`软删除`和`多实例/多租户`

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.scope.model.student.builderSelect().where('name', 'tom').orderBy('name');
  }
}
```

### 3. 原生Sql

可以直接执行原生 Sql 语句。

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

| 名称              | 说明                                                              |
| ----------------- | ----------------------------------------------------------------- |
| entity            | model对应的entity                                                 |
| table             | model对应的表名                                                   |
| disableDeleted    | 是否禁用软删除，默认为false                                       |
| disableInstance   | 是否禁用多实例/多租户，默认为false                                |
| disableCreateTime | 是否禁用创建时间。默认为false，系统自动为新数据设置创建时间       |
| disableUpdateTime | 是否禁用更新时间。默认为false，系统自动为要修改的数据设置更新时间 |
| softDeletionPrune | 是否自动清理软删除数据                                            |
| client            | 指定数据源                                                        |
| cache             | 配置缓存参数，默认启用基于redis的缓存                             |
| relations         | 指定模型关系，支持：1:1，1:n，n:1，n:n                            |

- table:
  - 如果为空，则从 entity 获取表名
  - 可以指定函数，实现动态分表的能力

## App Config

可以在 App Config 中配置 Model options。

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  model: {
    'demo-student:student': {
      disableDeleted: true, // 禁用软删除
      disableInstance: true, // 禁用多实例/多租户
      client: 'mysql', // 使用数据源：mysql
      cache: false, // 禁用缓存
    },
  },
};
```

## 动态分表

Model 支持动态分表的能力。比如，对 Order 进行分表处理，将每天的订单存入`order_YYYYMMDD`格式的数据表中。

```typescript
@Model({
  table: (ctx: VonaContext, where: EntityOrder | undefined, defaultTable: keyof ITableRecord) => {
    return `${defaultTable}_${moment().format('YYYYMMDD')}`;
  },
})
class ModelOrder {}
```

- `ctx`: 可以基于当前请求的上下文来动态生成表名
- `where`: 可以基于 where 条件来动态生成表名
- `defaultTable`: 默认的表名

## 软删除, 多实例/多租户

Model 默认自动启用软删除，当删除一条数据时，并不进行物理删除，而是设置字段 deleted 的值为 true。

Model 默认支持多实例/多租户。对数据进行 CRUD 操作时，自动从 Request 上下文获取实例 Id，并传入 sql 语句中。

比如，执行`model.student.select()`，那么生成的 sql 如下：

```bash
select "demoStudent"."id" from "demoStudent"
  where "demoStudent"."iid" = 1 and "demoStudent"."deleted" = false
```

- iid：实例 Id
- deleted：软删除

### 1. 临时禁用软删除

也可以在执行 model 方法时临时指定`软删除`参数。

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.scope.model.student.select({}, { disableDeleted: true });
  }
}
```

### 2. 清理软删除数据

系统会自动清理过期的软删除数据，`softDeletionPrune`支持以下配置：

- boolean: 是否启动软删除
- {handler, expired}:
  - handler: 提供自定义的清理函数
  - expired: 指定过期时间。如果没有指定，则使用系统指定的过期时间

## 数据源

Vona 支持`多数据库`、`多数据源`。可以针对任何一个数据源调用 Model 的方法。

### 1. 默认数据源

在默认情况下，Model 使用的是系统设置的缺省数据源。

`env/.env`

```bash
DATABASE_DEFAULT_CLIENT = 'sqlite3' # sqlite3/pg/mysql
```

### 2. 静态数据源

- 在 Model options 中指定数据源

```diff
+ @Model({ client: 'mysql' })
class ModelBook {}
```

- 在 App Config 中指定数据源

`src/backend/config/config/config.ts`

```typescript
// onions
config.onions = {
  model: {
    'demo-student:student': {
      client: 'mysql', // 使用数据源：mysql
    },
  },
};
```

### 3. 自适应数据源

在复杂的系统中，还会遇到一些需求，就是针对当前请求的环境使用不同的数据源，那么就可以使用`自适应数据源`：

```typescript
@Model({
  client: (ctx: VonaContext) => {
    if (ctx.headers['xxx-xxx'] === 'xxx') return 'mysql';
    return 'pg';
  },
})
export class ModelOrder {}
```

### 4. 动态数据源

还可以在代码中动态指定数据源。

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    const modelMysql = this.scope.model.student.newInstance('mysql');
    return await modelMysql.select();
  }
}
```

## 缓存

Vona Model 默认启用了缓存，从而使系统在默认情况下就具备非常高的性能。

Model 支持`二级缓存`/`mem缓存`/`redis缓存`。默认使用的是`redis缓存`。因为`redis缓存`可以在分布式场景下保持数据的一致性，而`mem缓存`在分布式场景下同步数据有延时。如果业务数据变更不频繁，可以使用`mem缓存`或者`二级缓存`，从而获得更高性能。

这里简要介绍缓存的基本配置，更详细信息，参见: [Vona ORM: 缓存](../techniques/orm/caching.md)

### 1. 禁用缓存

```typescript
@Model({ cache: false })
class ModelStudent {}
```

### 2. 在 Model options 中配置缓存

```typescript
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
```

- mode：缓存模式
- mem：`mem缓存`配置
- redis：`redis缓存`配置

### 3. 在 App Config 中配置缓存

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

### 4. Entity缓存和Query缓存

Vona 提供了两类缓存：`Entity缓存`和 `Query缓存`:

- `Entity缓存`: EntityId -> Entity
- `Query缓存`: Hash of Query Clause -> EntityIds

> 疑问 1: 那么有人会问，`Query缓存`岂不是非常占用空间？
>
> - 恰恰相反，一条`Query缓存`所占用的空间 = `Hash + EntityIds`，因此，更加节约缓存空间。系统自动使用`EntityIds`从`Entity缓存`中获取缓存数据，并组装成最终的查询结果

> 疑问 2: 如何确保缓存数据的一致性？
>
> - 当有数据变更时，会自动清理当前数据的`Entity缓存`，并自动清理当前Model的所有`Query缓存`
