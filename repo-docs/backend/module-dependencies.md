# Vona Module Dependencies

Use `vonaModule.dependencies` when one Vona module has a real requirement for another module's availability, dependency-first ordering, or minimum compatible version.

It is not a general declaration for every cross-module reference.

## What a module dependency means

A dependency in a module package manifest expresses all of these conditions:

- the target module must be present and enabled
- the target module is ordered before the dependent module
- the declared version is the minimum compatible target version

For example:

```json
{
  "vonaModule": {
    "dependencies": {
      "a-vona": "5.0.0",
      "a-telemetry": "5.0.0"
    }
  }
}
```

This is a module lifecycle contract, not a JavaScript import or resource lookup. It adds availability, lifecycle ordering, and version requirements; it does not replace ESM evaluation dependencies.

## Different dependency relationships

Keep these concerns separate.

| Relationship                     | Purpose                                                                | Typical surface                    |
| -------------------------------- | ---------------------------------------------------------------------- | ---------------------------------- |
| Package dependency               | Makes a package available to package tooling                           | `package.json` `dependencies`      |
| ESM runtime import               | Links live exports and participates in dependency evaluation           | `import { ModelX } from '...'`     |
| Suite or application composition | Includes module packages in the application composition                | suite/application package metadata |
| Module dependency                | Requires a target module's availability, order, and compatible version | `vonaModule.dependencies`          |
| Runtime resource lookup          | Resolves a resource from an already composed module                    | `this.$scope`, `app.scope(...)`    |

A module dependency does not install a package or compose an otherwise absent module. Ensure package and suite/application composition separately.

## Lookup is not a dependency edge

The following forms look up resources from modules that are already composed into the active application:

```ts
this.scope.model.order;
this.$scope.commerceCatalog.model.product;
app.scope('commerce-catalog').model.product;
```

Lookup alone does not require adding the target to `vonaModule.dependencies`. That includes lookup of another module's service, model, config, locale, entity, or other scoped resource.

The same distinction applies to a named ORM relation or a relation included by an inferred DTO. A relation such as:

```ts
$relation.belongsTo('commerce-trade:order', 'commerce-member:user', 'userId');
```

is not, by itself, a reason to add a module dependency edge.

## Cross-module imports and initialization

### Use the public package boundary

In Vona application code, import another module's classes, DTOs, helpers, and types through that module's public package exports. Do not reach into another module's source through a relative filesystem path or an unexported package source path.

For example, when a query policy needs the Student Model class:

```ts
import { ModelStudent } from 'vona-module-training-student';
```

Do not replace it with a path such as `../../../training-student/src/model/student.ts`. Verify the owning package's export map and entry exports. If the required resource is not public, resolve its intended ownership and supported export rather than bypassing the boundary or hand-editing generated metadata.

A runtime import establishes an ESM evaluation dependency; `import type` is erased and cannot ensure that a class or its decorators execute. A string resource identifier also does not import its target package. It can only resolve successfully when the consuming API performs its lookup and the required registration is available.

### Check when the consumer resolves the model

Class callbacks are not an automatic lazy-initialization boundary. The consumer determines when to invoke them:

| Surface                                    | Current resolution behavior                                                                                                        |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `$Dto.get(() => ModelX)`                   | Resolves the primary Model during DTO construction; a top-level superclass expression therefore needs it during module evaluation. |
| `$defineQuery(() => ModelX, config)`       | Resolves the primary Model and configured binding models while constructing the policy, including their field metadata.            |
| Nested relation schemas in `$Dto.get(...)` | Use a separate lazy schema mechanism; this does not make primary-model resolution lazy.                                            |
| String Model identifiers                   | Do not load a module or guarantee deferred lookup; the consuming API still determines resolution time.                             |

Consequently, replacing a class import with a string Model identifier can remove the evaluation dependency that previously made registration available. A type-supported reference is not proof that it is valid at that initialization phase. Conversely, a callback such as `() => ModelX` still reads `ModelX` immediately if the consumer invokes it during construction.

### Distinguish ESM cycles from lifecycle dependency cycles

Mutual package imports can form an ESM cycle without failing. Imports are live bindings: a module can read an already-initialized export from another module whose remaining dependencies are still being evaluated. Reading a class or `const` binding before initialization instead causes a temporal-dead-zone error. A missing string-based registration can fail separately during resource lookup.

For example, two package barrels may each expose a Model before a DTO that reads the other package's Model. If both Models initialize before those DTO reads, that evaluation path can succeed. This is not a general ordering guarantee: barrel export order, transitive imports, effects, and the actual application entry path all matter. Do not rely on callback syntax, a Model-first export list alone, or one successful startup as proof that future dependency changes are safe.

An ESM import cycle is different from a cycle in `vonaModule.dependencies`, whose lifecycle graph must remain acyclic. Do not add lifecycle dependency edges merely to repair JavaScript import-time initialization. Trace the early read and use the supported package boundary; if a real cycle fails, revisit the eager dependency or resource ownership rather than bypassing exports, hand-reordering generated metadata, or assuming strings are lazy.

### Verify initialization-sensitive changes

When changing imports or Model references used by DTO superclass expressions, decorators, or top-level policies:

1. verify the public export and distinguish runtime imports from type-only imports and string lookups
2. trace when the consumer needs the class and its registration, including transitive package-barrel dependencies
3. run the affected existing backend tests through the root managed `npm run test` entrypoint, which starts the application before executing selected tests; use the argument-forwarding syntax in [Repository Scripts](/reference/repo-scripts)
4. assert the affected DTO/schema or query behavior and run the relevant typecheck

Typechecking and generated metadata inspection alone do not execute the ESM graph. Reuse existing focused startup/integration coverage rather than adding a separate initialization harness or resetting development data. For DTO and query authoring, see [DTO Infer and Generation](/backend/dto-infer-generation) and [Public Query Guide](/backend/public-query-guide).

## Decision guide

| Question                                                                                     | Decision                                                                           |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Does the code only look up a resource from an already composed module?                       | Do not add an edge solely for the lookup.                                          |
| Can the feature operate when the target module is absent?                                    | Do not add a required dependency; make optional behavior explicit.                 |
| Must the target module be present and enabled for the feature to work?                       | Add a module dependency and verify composition separately.                         |
| Must the target initialize before the dependent module?                                      | Add a module dependency.                                                           |
| Does startup, lifecycle, or `monkey.ts` integration depend on deterministic target ordering? | Add a module dependency.                                                           |
| Does the feature require a minimum compatible target-module version?                         | Add a module dependency with that minimum version.                                 |
| Would the proposed edge create a cycle?                                                      | Revisit module ownership or composition instead of encoding a circular dependency. |

`monkey.ts` and lifecycle integration are common reasons to require ordering, but they are not the only valid reason. The decisive question is whether the target module is a required availability, ordering, or version contract.

## Avoid speculative edges

Do not add `vonaModule.dependencies` merely to:

- document an import
- document a scope lookup
- make a named ORM relation appear explicit
- compensate for an assumed circular lookup
- encode a transient implementation detail that should remain inside the framework

A speculative edge can make a module unavailable when its target is disabled, impose an unnecessary ordering constraint, and turn a manageable design issue into a cycle.

## Verification

When adding or changing a module dependency:

1. verify that package and suite/application composition makes the target available
2. verify the target module's relative name and minimum compatible version
3. confirm that the dependency graph remains acyclic
4. run the relevant Vona metadata, build, or startup path that consumes module metadata
5. run the narrowest meaningful tests and type checks for the affected feature

## Related guides

- [Backend Foundation](/backend/foundation#scope-lookup-vs-module-dependencies)
- [Package Map](/reference/package-map)
- [Backend Startup Guide](/backend/startup-guide)
- [Backend CLI](/backend/cli)
