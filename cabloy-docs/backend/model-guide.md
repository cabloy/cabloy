# Model Guide

This guide explains how models work in Vona within the Cabloy monorepo.

## Why models matter in the backend contract loop

Models are the persistence-facing layer of the backend contract loop.

A useful split is:

- controllers define HTTP-facing contracts
- services orchestrate business flow
- models own ORM-facing persistence behavior
- entities and DTOs shape the data contract around that behavior

That means model design affects not only SQL behavior, but also CRUD defaults, DTO assumptions, OpenAPI-facing contracts, and test setup.

## Create a model

Example: create a model named `student` in module `demo-student`.

```bash
npm run vona :create:bean model student -- --module=demo-student
```

## Model definition

Representative pattern:

```typescript
import { BeanModelBase, Model } from 'vona-module-a-orm';
import { EntityStudent } from '../entity/student.ts';

@Model({ entity: EntityStudent })
export class ModelStudent extends BeanModelBase<EntityStudent> {}
```

The key relationship is that a model is bound to an entity and exposes ORM-oriented operations for that entity.

## Using a model

Using models in Vona supports both dependency injection and dependency lookup, but dependency lookup is usually the clearer default.

### Lookup in the current module

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.scope.model.student.select();
  }
}
```

### Lookup across modules

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.$scope.demoStudent.model.student.select();
  }
}
```

### Direct container access

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.bean._getBean('demo-student.model.student').select();
  }
}
```

This is one of the important backend layer boundaries:

- services should usually orchestrate through models
- models should remain the main persistence-facing abstraction instead of bypassing directly to ad hoc SQL everywhere

## Basic CRUD patterns

### Create

```typescript
return await this.scope.model.student.insert(student);
```

### Read

```typescript
return await this.scope.model.student.select();
return await this.scope.model.student.getById(id);
```

### Update

```typescript
return await this.scope.model.student.updateById(id, student);
```

### Delete

```typescript
return await this.scope.model.student.deleteById(id);
```

These methods are also part of the generated CRUD thread; see [CRUD Workflow](/backend/crud-workflow).

When using magic methods, keep one semantic detail in mind:

- default `eq` methods can treat an omitted argument as `null`
- non-`eq` methods require an explicit argument

For omission inside structured `where` objects, prefer `Op.omit`; for SQL null checks, use `null`.

## Query-builder support

Vona models are built on Knex, so the model layer also supports lower-level query builder access when needed.

Representative patterns:

```typescript
this.scope.model.student.builder().where('name', 'tom').orderBy('name');
this.scope.model.student.builderSelect().where('name', 'tom').orderBy('name');
this.scope.model.student.query('select * from demoStudent');
```

A practical rule is:

- prefer model methods and model-aware query paths first
- use builder or raw SQL only when the higher-level model surface is not enough

## Important model options

Several important model options include:

- `entity`
- `table`
- `disableDeleted`
- `disableInstance`
- `disableCreateTime`
- `disableUpdateTime`
- `softDeletionPrune`
- `client`
- `cache`
- `relations`

These options matter because Vona models are not only raw database adapters. They also carry framework-level behavior such as soft deletion, multi-instance support, datasource selection, caching, and relations.

## App-config overrides

Model options can also be configured in app config.

Representative pattern:

```typescript
config.onions = {
  model: {
    'demo-student:student': {
      disableDeleted: true,
      disableInstance: true,
      client: 'mysql',
      cache: false,
    },
  },
};
```

This is one of the key contract-loop ideas: model behavior is not defined only inside the model file. It can also be refined through project configuration.

## Dynamic table partitioning

Model supports dynamic table partitioning.

Representative pattern:

```typescript
@Model({
  table: (ctx: VonaContext, where: EntityOrder | undefined, defaultTable: keyof ITableRecord) => {
    return `${defaultTable}_${moment().format('YYYYMMDD')}`;
  },
})
class ModelOrder {}
```

This matters because some persistence decisions belong at the model abstraction level even when they materially change how the table is resolved.

## Soft deletion and multi-instance defaults

By default, Vona models support:

- soft deletion
- multi-instance or multi-tenancy filtering

That means model behavior can be richer than a naïve SQL wrapper. For example, a normal `select()` already participates in instance filtering and deleted-record filtering unless configured otherwise.

A practical implication is:

- contract and test behavior should not assume raw-table semantics when the model layer is active

## Instance-aware model semantics

One important current-runtime distinction is that ordinary model usage is instance-aware by default.

A practical interpretation is:

- normal model operations participate in the current instance context
- instance-aware filtering is part of normal model behavior unless disabled
- request-scoped code should usually preserve that behavior instead of bypassing it casually

This is why `disableInstance` is a meaningful semantic choice rather than a minor ORM toggle.

Use it only when the model truly should ignore the active instance boundary.

Another practical implication is:

- lower-level builder or raw-SQL flows may need extra care when you are reproducing behavior that the ordinary model path would have applied automatically

For the broader instance/config story, also see [Config Guide](/backend/config-guide).

## Datasource selection

Vona supports `multi-database` and `multi-datasource` behavior at the model layer.

Representative modes include:

- default datasource
- static datasource in model options
- app-config datasource override
- adaptive datasource through a function
- dynamic datasource chosen in code with `newInstance(...)`

Representative dynamic pattern:

```typescript
const modelMysql = this.scope.model.student.newInstance('mysql');
return await modelMysql.select();
```

This matters because backend contract behavior can depend on datasource choice, not just on query shape.

In the current runtime, datasource choice can also change indirectly through instance isolation. If the active instance is configured as isolated, the effective default datasource may switch through that instance’s `isolateClient` setting even when the calling code did not name a datasource explicitly.

That is why model behavior should be read together with:

- [Config Guide](/backend/config-guide)
- [Multi-Database and Datasource Guide](/backend/multi-database-datasource)

## Cache behavior

Vona models enable cache behavior by default.

A practical distinction is:

- entity cache stores entity records
- query cache stores query-derived entity id sets

That means model behavior affects performance and consistency semantics, not only data retrieval.

For the broader cache story, also see [Cache Guide](/backend/cache-guide).

## Relationship to the backend contract loop

Read this guide together with:

- [Service Guide](/backend/service-guide)
- [Entity Guide](/backend/entity-guide)
- [DTO Guide](/backend/dto-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [CRUD Workflow](/backend/crud-workflow)
- [Migration and Changes](/backend/migration-and-changes)

## Implementation checks for model-layer changes

When creating backend persistence logic:

1. start from the model and entity pairing
2. prefer model methods and model-aware query paths
3. preserve Vona soft-delete and instance-aware behavior unless there is a real reason not to
4. choose deliberately among local scope, cross-module scope, and direct bean access
5. remember that datasource, cache, and model options can change the behavior of the backend contract loop
6. drop to raw SQL or lower-level query builder logic only when the higher-level model surface is insufficient

## Where to read next

If your next question is how model persistence behavior fits into one complete backend contract thread, continue with:

- [Entity Guide](/backend/entity-guide)
- [DTO Guide](/backend/dto-guide)
- [CRUD Workflow](/backend/crud-workflow)
- [Vona Source Reading Map](/backend/vona-source-reading-map)
- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
