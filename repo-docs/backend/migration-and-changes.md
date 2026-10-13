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

## Migration in the backend contract loop

A useful backend-contract-loop lifecycle mental model is:

- entity and model define the current structural contract
- DTOs and controllers define the API contract on top of that structure
- `meta.version` manages schema evolution and initialization data
- tests verify that the migrated backend still satisfies the intended contract

That is why migration should be understood as part of the same backend thread, not as a separate maintenance topic.

## Define data version

Each module declares its current data version in its own `package.json`.

Representative pattern:

```json
{
  "name": "vona-module-training-student",
  "vonaModule": {
    "fileVersion": 1
  }
}
```

The key rule is:

- increment `fileVersion` when a released module introduces a new schema change that must be applied in sequence

In the scaffolded CRUD workflow, this is not an isolated maintenance step. The generator-driven thread treats `fileVersion` as part of the same backend evolution path that also touches entity/model/controller/test resources.

## Decide whether to increment fileVersion

For a new persisted field or another schema-shape change on an existing resource, decide whether `vonaModule.fileVersion` should change **before** editing `meta.version.ts`, a versioned schema path, or the module `package.json`.

### Increment fileVersion

Choose a new migration version when the change must be applied sequentially to an existing released module:

1. increment `fileVersion`;
2. add a new migration branch;
3. preserve older branches as historical snapshots;
4. introduce the schema change in the new branch.

Do not introduce the same column in an older create path and again in a later migration branch. A fresh installation can execute version branches sequentially and fail on a duplicate column.

### Keep the current fileVersion

When the change belongs in the current version path rather than new migration history:

1. keep the existing `fileVersion`;
2. fold the schema change into the current version path;
3. do not create a new migration branch.

Ask before choosing this strategy; do not infer migration history from the field change alone. Any change to `meta.version.ts` requires `npm run test` so the test database is recreated and schema/data consistency is exercised.

## `meta.version`

Vona uses a bean named `meta.version` to organize migration code for a module.

Create it with:

```bash
npm run vona :create:bean meta version -- --module=training-student
```

Representative shell:

```typescript
@Meta()
export class MetaVersion extends BeanBase {}
```

## Three change scenarios

Three migration scenarios are defined:

| Scenario | Purpose                                             |
| -------- | --------------------------------------------------- |
| `update` | schema evolution such as tables and fields          |
| `init`   | instance- or tenant-specific initialization data    |
| `seed`   | baseline data for test runs and explicit dev resets |

This split is one of the most important Vona migration ideas because it separates:

- structural change
- initialization logic
- shared baseline data setup

A practical generated-thread interpretation is:

- `update` follows schema and entity/model evolution
- `init` follows instance-aware initialization needs introduced by the backend feature
- `seed` provides shared baseline data during test-mode startup or an explicit development database reset

## Update: schema migration

Representative pattern:

```typescript
@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      await this.bean.model.createTable('trainingStudent', table => {
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

## Seed: test and reset baseline data

Representative pattern:

```typescript
@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionSeed {
  async seed() {
    await this.scope.model.student.insert({
      name: 'Jimmy',
      description: 'Shared test-environment baseline data',
    });
  }
}
```

This is valuable because shared baseline data becomes part of the structured version lifecycle instead of being scattered across unrelated setup code.

Vona invokes `seed()` while the application starts in test mode (`npm run test` or managed E2E), and during an explicit `npm run db:reset` in dev mode. Ordinary development startup and framework upgrades do not seed or reset development data automatically. Use `seed()` for durable baseline fixtures shared by tests or for freshly prepared local development data. Both paths seed after instance initialization on a newly recreated disposable database; `seed()` is not a repeatable, same-database data-import mechanism.

Treat shared `seed()` records as read-only in ordinary tests. A scenario that needs different state must create independent, test-owned data and clean it up in `finally`; it must not mutate or delete the shared baseline. `seed()` remains distinct from `init()`: use `init()` for instance-aware initialization data and reserve `seed()` for baseline data in test runs or explicit development resets.

## Version changes across the generated backend thread

When the generated CRUD thread evolves, migration should evolve with it.

A practical sequence is:

1. decide whether to increment `fileVersion`
2. add or adjust entity/model structure
3. update the current or new `meta.version` path to match that decision
4. rerun migration locally
5. verify the contract through tests and controller actions

This keeps schema change, backend contract change, and verification tightly connected.

## Local development workflow

One important distinction for local development is:

- when iterating locally, you often want to recreate the database and re-run migration logic without bumping `fileVersion`

Representative commands:

```bash
npm run test
npm run db:reset
```

A practical decision rule is:

- use `db:reset` to recreate the disposable **dev-mode** databases, rerun migrations and instance initialization, and then invoke module `seed()` hooks; it deletes existing matching development databases, so do not run it against data you need to keep
- `db:reset` requires `database.testDatabase: true` in dev config and a connection outside the disposable database; it refuses to reset a configured non-disposable database
- use `test` when you need **test-mode** verification of migration, controller behavior, and the broader generated contract thread; E2E also remains test-mode

## Implementation checks for migration-sensitive changes

When changing backend schema or module initialization behavior, do not only edit entities and models.

Also ask:

1. does this change require a `fileVersion` increment?
2. does `meta.version` need an `update`, `init`, or `seed` branch?
3. should the local verification path include `test` or `db:reset`?
4. does the change affect the CRUD-generated thread or frontend-facing API contract as well?

That prevents schema changes from being documented in code but never integrated into the module lifecycle.
