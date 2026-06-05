# Model Guide

This page migrates the high-value parts of the legacy Vona model documentation.

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

## Recommended usage style

The legacy docs recommend dependency lookup over heavier wiring because it keeps the code more concise.

Typical pattern:

```typescript
class ServiceStudent {
  async findAll(): Promise<EntityStudent[]> {
    return await this.scope.model.student.select();
  }
}
```

Cross-module lookup also exists:

```typescript
return await this.$scope.demoStudent.model.student.select();
```

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

## Query-builder support

Vona models are built on Knex, so the model layer also supports lower-level query builder access when needed.

Representative patterns:

```typescript
this.scope.model.student.builder().where('name', 'tom').orderBy('name');
this.scope.model.student.builderSelect().where('name', 'tom').orderBy('name');
this.scope.model.student.query('select * from demoStudent');
```

## Important model options

The legacy docs highlighted several important model options, including:

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

## Soft deletion and multi-instance defaults

By default, Vona models support:

- soft deletion
- multi-instance or multi-tenancy filtering

That means model behavior can be richer than a naïve SQL wrapper. AI-generated model code should preserve that expectation instead of bypassing it accidentally.

## Why this matters for AI workflows

When AI creates backend persistence logic, it should:

1. start from the model and entity pairing
2. prefer model methods and model-aware query paths
3. preserve Vona soft-delete and instance-aware behavior unless there is a real reason not to
4. drop to raw SQL or lower-level query builder logic only when the higher-level model surface is insufficient
