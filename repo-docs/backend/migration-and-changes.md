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

Ask before choosing this strategy; do not infer migration history from the field change alone. Normal startup does not replay an already-applied positive-numbered migration branch. Editing that branch affects fresh installations and isolated test preparation, not a development database that has already applied it. A no-bump decision is not authorization to reset development data; if existing data must be preserved, agree on a new incremental migration instead.

Verify changes to migration, initialization, or seed behavior through managed isolated tests covering the affected behavior, preferably focused. A `meta.version.ts` edit alone does not require the full suite. See [Local development workflow](#local-development-workflow) for the separate verification and development-database decisions.

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

| Scenario | Purpose                                                      |
| -------- | ------------------------------------------------------------ |
| `update` | schema evolution such as tables and fields                   |
| `init`   | instance- or tenant-specific initialization data             |
| `seed`   | baseline data for test runs and newly prepared dev databases |

This split is one of the most important Vona migration ideas because it separates:

- structural change
- initialization logic
- shared baseline data setup

A practical generated-thread interpretation is:

- `update` follows schema and entity/model evolution
- `init` follows instance-aware initialization needs introduced by the backend feature
- `seed` provides shared baseline data during test-mode startup or an explicit development database reset; ordinary dev startup never seeds (see the shared lifecycle below)

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

## Seed: test and development baseline data

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

Vona invokes `seed()` while the application starts in test mode (`npm run test` or managed E2E), and during an explicit `npm run db:reset` in dev mode. In **Cabloy Basic and Cabloy Start**, ordinary `npm run dev` and `npm run dev:one` only reuse existing managed disposable databases and never seed; a missing required database makes startup fail with an instruction to run `npm run db:reset`. Framework upgrades do not reset existing development data or repeat its seeds. Use `seed()` for durable baseline fixtures shared by tests or for freshly prepared local development data. Seeding follows instance initialization on a newly created or recreated disposable database; `seed()` is not a repeatable, same-database data-import mechanism. See [Managed development database preparation](#managed-development-database-preparation) for the explicit reset lifecycle.

In **Cabloy Basic and Cabloy Start**, automatic `seed()` execution is limited to the default instance (`''`). These records are convenience fixtures for test/dev use, not required business initialization data. Reset still migrates and initializes configured isolated targets such as `isolateTest`, but does not seed them: they can exercise multi-instance behavior without shared test fixtures. Use `init()` for initialization required by each instance.

Treat shared `seed()` records as read-only in ordinary tests. A scenario that needs different state must create independent, test-owned data and clean it up in `finally`; it must not mutate or delete the shared baseline. `seed()` remains distinct from `init()`: use `init()` for instance-aware initialization data and reserve `seed()` for baseline data in test runs or explicit development resets.

## Version changes across the generated backend thread

When the generated CRUD thread evolves, migration should evolve with it.

A practical sequence is:

1. decide whether to increment `fileVersion`
2. add or adjust entity/model structure
3. update the current or new `meta.version` path to match that decision
4. verify migration and resource behavior through managed isolated tests
5. separately decide whether and how to update the development database

This keeps schema change, backend contract change, and verification tightly connected.

## Local development workflow

Keep two questions separate: **how to verify the change** and **how to update development data**. Isolated tests do not update development databases, and a development reset is not a substitute for tests.

| Need                                                                                   | Path                                             | Boundary                                                                                                 |
| -------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Verify migration, initialization, seed, and affected resource behavior                 | Managed isolated tests, preferably focused       | Even a focused run prepares a fresh test database; it does not change dev data.                          |
| Apply a new module or pending versioned migration to an existing prepared dev database | Normal application startup                       | Applies pending versions without resetting existing data; ordinary dev startup does not repeat `seed()`. |
| Replay an edited, already-applied positive-numbered branch on disposable dev data      | Separately approved `npm run db:reset`           | Destructive recreation; a no-bump decision does not authorize reset.                                     |
| Update an existing database while preserving business data                             | A new incremental migration, then normal startup | Do not rely on editing an already-applied branch or use reset.                                           |

For example, from the repository root:

```bash
npm run test -- 'src/module/<module-name>/test/**/*.ts'
```

Resolve the actual path for suite-owned modules. Select tests that cover the affected migration and contract behavior; expand coverage according to actual impact, not merely the presence of a `meta.version.ts` edit. Fresh-database preparation proves the fresh-install path, not every existing-data upgrade; verify upgrade behavior when the change requires it. See [Unit Testing](/backend/unit-testing#execute-tests).

The replay rule above concerns positive-numbered migration branches. The special version `0` and `fileVersion: -1` lifecycle paths retain their always-run semantics; they are not a reason to move a versioned schema change into an always-run branch.

`db:reset` requires explicit approval, `database.testDatabase: true` in dev config, and a connection outside the disposable database. It refuses to reset a configured non-disposable database. Follow the lifecycle and concurrency precautions below before an approved reset.

### Managed development database preparation

**Cabloy Basic and Cabloy Start** share this explicit preparation lifecycle for framework-managed disposable development databases.

When `database.testDatabase: true` enables framework-managed disposable dev databases, `npm run dev` and `npm run dev:one` only reuse existing databases:

1. **Check every required target:** both shared and statically configured isolate database targets must exist. If any required target is missing, startup fails promptly with an instruction to run `npm run db:reset`; it does not create the target, perform creation-time Redis cleanup, or seed as a fallback.
2. **Reuse existing databases:** keep their data without database creation, creation-time Redis cleanup, or module seeding. Ordinary startup is not a fixture refresh, an implicit reset, or recovery for a partial reset. Non-disposable databases are outside this managed reset path.

An explicit `npm run db:reset` owns preparation in a single process. It requires `database.testDatabase: true` and a connection outside the disposable database. It clears validated application-owned Redis state with `clearAllData()`, drops and recreates the managed disposable dev databases, and runs migrations. It then completes each instance's non-after startups and initialization in sequence. Only the default instance runs the owning modules' `seed()` hooks, after its initialization and before consuming its creation bookkeeping and setting its readiness flag; isolated instances initialize and become ready without seeding.

Reset skips all instance and application startups with `after: true`: schedule loading, runtime JSON generation, development tips, queue-worker preloading, and HTTP listening are runtime-server work, not reset prerequisites. Put required data preparation in migrations, `init()`, `seed()`, or non-after startups. Normal dev startup still runs after-startups; independent framework lifecycle hooks and reset's application teardown remain intact. See [Backend Startup Guide](/backend/startup-guide#app-startup-and-instance-startup-in-practice) for the phase boundary.

**Stop the development server and any other processes using the same database and Redis namespace first.** There is no file-based preparation lock; concurrent dev/dev and dev/reset against the same database and Redis namespace are unsupported. The reset command disables its own listener, but that does not protect a concurrently running server or queue worker. Never reset development data you need to keep.

If reset fails, the failure remains visible. There is no preparation journal or automatic recovery: investigate and resolve the cause, then explicitly rerun `npm run db:reset`. Database existence alone does not prove migrations, initialization, or seeding completed after an interruption. A subsequent dev startup must not be used to repair or complete the failed preparation.

The Redis cleanup is prefix-scoped, not a Redis-wide flush: `clearAllData()` validates application-owned prefixes and deletes matching Bull queue, redlock, worker, and cache keys. It does not use `FLUSHDB` or `FLUSHALL`, delete unrelated namespaces, or clear broadcast subscriptions. Only explicit reset performs this destructive preparation cleanup; ordinary dev startup does not. Prefix scoping is not permission to clear a live shared namespace manually.

See [Development database preparation](/reference/repo-scripts#development-database-preparation) for the root-command summary.

## Implementation checks for migration-sensitive changes

When changing backend schema or module initialization behavior, do not only edit entities and models.

Also ask:

1. does this change require a `fileVersion` increment?
2. does `meta.version` need an `update`, `init`, or `seed` branch?
3. which managed focused tests verify the affected migration and resource behavior, and does the actual impact require broader coverage?
4. does the development database need pending migrations through startup, a separately approved disposable reset, or a new data-preserving migration?
5. does the change affect the CRUD-generated thread or frontend-facing API contract as well?

That prevents schema changes from being documented in code but never integrated into the module lifecycle.
