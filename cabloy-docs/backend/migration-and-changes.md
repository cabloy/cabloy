# Migration and Changes

This guide explains how migration and change management work in Vona within the Cabloy monorepo.

## Why this system exists

Vona provides a migration mechanism designed for long-lived modular projects.

Several important characteristics define this migration system:

- module-aware migration
- multi-tenant initialization support
- test-data support
- production-safe execution
- full access to the Vona ecosystem inside migration code

This makes migration in Vona more than a one-off schema script. It is part of the framework’s modular lifecycle.

## Define data version

Each module declares its current data version in its own `package.json`.

Representative pattern:

```json
{
  "name": "vona-module-demo-student",
  "vonaModule": {
    "fileVersion": 1
  }
}
```

The key rule is:

- increment `fileVersion` when a released module introduces a new schema change that must be applied in sequence

## `meta.version`

Vona uses a bean named `meta.version` to organize migration code for a module.

Create it with:

```bash
npm run vona :create:bean meta version -- --module=demo-student
```

Representative shell:

```typescript
@Meta()
export class MetaVersion extends BeanBase {}
```

## Three change scenarios

Three migration scenarios are defined:

| Scenario | Purpose |
| --- | --- |
| `update` | schema evolution such as tables and fields |
| `init` | instance- or tenant-specific initialization data |
| `test` | test-only data for the test environment |

This split is one of the most important Vona migration ideas because it separates:

- structural change
- initialization logic
- test data setup

## Update: schema migration

Representative pattern:

```typescript
@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      await this.bean.model.createTable('demoStudent', table => {
        table.basicFields();
        table.string('name', 50);
        table.string('description', 255);
      });
    }
  }
}
```

A typed style based on entity metadata is also supported, and it is usually the better long-term default when possible.

## Init: tenant-aware initialization

Representative pattern:

```typescript
@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionInit {
  async init(options: IMetaVersionInitOptions) {
    if (options.version === 1) {
      await this.scope.model.student.insert({
        name: 'Tom',
        description: 'This is a student',
      });
    }
  }
}
```

The important point is that initialization can run per instance or tenant, which keeps tenant data isolated.

## Test: test-only data

Representative pattern:

```typescript
@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionTest {
  async test() {
    await this.scope.model.student.insert({
      name: 'Jimmy',
      description: 'Only used in unit test',
    });
  }
}
```

This is valuable because test data becomes part of the structured migration lifecycle instead of being scattered across unrelated setup code.

## Local development workflow

One important distinction for local development is:

- when iterating locally, you often want to recreate the database and re-run migration logic without bumping `fileVersion`

Representative commands:

```bash
npm run test
cd vona && npm run db:reset
```

## Why this matters for AI workflows

When AI changes backend schema or module initialization behavior, it should not only edit entities and models.

It should also ask:

1. does this change require a `fileVersion` increment?
2. does `meta.version` need an `update`, `init`, or `test` branch?
3. should the local verification path include `test` or `db:reset`?

That prevents schema changes from being documented in code but never integrated into the module lifecycle.
