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

This is a module lifecycle contract. It is stronger than an import or a resource lookup.

## Four different relationships

Keep these concerns separate.

| Relationship                     | Purpose                                                                | Typical surface                    |
| -------------------------------- | ---------------------------------------------------------------------- | ---------------------------------- |
| Package dependency               | Makes a package available to package tooling                           | `package.json` `dependencies`      |
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
