# Virtual Decorator Guidance

Use this page when deciding whether a backend class should use `@Virtual()`, or when AI needs to understand what `@Virtual()` changes in Vona bean behavior.

The goal is to preserve real runtime semantics, keep class placement intentional, and prevent `@Virtual()` from being reused as a shorthand or registration filter.

## Short definition

`@Virtual()` marks a container-managed class as a virtual inherited runtime node.

Its core effect is to make bean registration inherit `moduleBelong` from the parent bean chain instead of treating the current class as a new independent runtime ownership center.

## What `@Virtual()` does not mean

`@Virtual()` does **not** mean any of the following:

- suppress bean registration
- remove a bean-scene class from `IBeanRecordGlobal`
- act as a shorthand-registration filter
- compensate for incorrect class placement
- mean only that a class is abstract or internal

If a class should not appear on the global shorthand surface, fix placement instead.

For related guidance, also read:

- [Class Placement Rule](/ai/class-placement-rule)
- [Global Bean Lookup](/ai/global-bean-lookup)

## Runtime effect

`@Virtual()` matters at registration time and then keeps affecting runtime scope resolution.

### 1. Decorator stage

The decorator writes virtual metadata on the class.

Conceptually:

```text
@Virtual()
 -> metadata(SymbolDecoratorVirtual = true)
```

### 2. Registration stage

When the bean is registered, Vona reads that metadata and computes `moduleBelong`.

- non-virtual bean -> `moduleBelong` stays equal to the current module
- virtual bean -> `moduleBelong` is inherited from the nearest parent bean that already has one

Conceptually:

```text
@Virtual()
 -> addBean()
 -> _parseModuleBelong()
 -> inherited moduleBelong
```

### 3. Runtime stage

Bean instances then resolve runtime scope resources from that inherited `moduleBelong`.

This directly affects access to:

- `this.scope`
- `this.module`
- `this.config`
- `this.constant`
- `this.error`
- `this.locale`
- `this.util`
- `this.model`
- `this.entity`
- module meta and scene resources

Short version:

> `@Virtual()` changes runtime ownership resolution, not registration existence.

## Relationship to `@Bean()` and `@Service()`

These decorators solve different problems.

- `@Bean()` / `@Service()` / `@Controller()` decide which scene the class registers into
- `@Virtual()` decides how runtime ownership is resolved

They are orthogonal.

Examples:

- `@Service() + @Virtual()`
  - service-scene bean
  - runtime ownership follows the parent bean chain
- `@Bean() + @Virtual()`
  - bean-scene bean
  - still a virtual bridge node rather than a new independent ownership center

## When to use `@Virtual()`

Use `@Virtual()` when a class is still container-managed, but is not intended to become a new independent runtime ownership center.

Typical cases:

### 1. Runtime-anchor bases

These classes still need bean lifecycle, class-token lookup, selector-aware behavior, or framework-managed context.

Representative examples:

- `vona/src/suite-vendor/a-vona/modules/a-orm/src/service/databaseDialectBase_.ts`
- `vona/src/suite-vendor/a-vona/modules/a-cache/src/service/cacheMemBase_.ts`
- `vona/src/suite-vendor/a-vona/modules/a-cache/src/service/cacheRedisBase_.ts`
- `vona/src/suite-vendor/a-vona/modules/a-summer/src/service/summerCacheBase_.ts`

### 2. Bean facade or bridge nodes

These classes remain intentionally visible on the bean-scene shorthand surface, but still behave as inherited bridge nodes rather than independent runtime ownership centers.

Representative example:

- `vona/src/suite-vendor/a-vona/modules/a-orm/src/bean/bean.model.ts`

### 3. Compatibility or variant nodes

These classes extend an existing bean hierarchy and should keep runtime ownership aligned with the parent chain.

Representative example:

- `vona/src/suite-vendor/a-vona/modules/a-ormdialect/src/bean/databaseDialect.mysql3.ts`

## When not to use `@Virtual()`

Do **not** use `@Virtual()` for these cases.

### 1. Independent business services

If a class is the real business owner of its own runtime boundary, it should usually keep its own `moduleBelong` and should not be virtual.

### 2. Misplaced bean-scene classes

Do not keep a class in `src/bean` and try to hide it with `@Virtual()`.

If it should not be a global shorthand bean, move it instead:

- pure helper or subclass-only base -> `src/lib`
- runtime-anchor base -> `src/service`, often `src/service/*_.ts`

### 3. Pure helpers or superclass convenience classes

If a class does not need container-managed behavior, it usually belongs in `src/lib` and should not use `@Virtual()`.

## Decision table

| Scenario | Use `@Virtual()` | Recommended placement | Reason |
| --- | --- | --- | --- |
| independent business service | No | `src/service` | it should own its own runtime resource boundary |
| runtime-anchor base with container behavior | Yes | `src/service` or `src/service/*_.ts` | it is container-managed but belongs logically to the parent bean system |
| bean-scene facade that intentionally stays on shorthand surface | Yes, if it is a bridge node | `src/bean` | it participates in shorthand lookup but is not a new ownership center |
| compatibility / dialect / variant node built on a parent bean | Yes | same scene as the concrete variant type | runtime ownership should inherit from the parent chain |
| pure helper or superclass convenience class | No | `src/lib` | no bean ownership semantics are needed |
| class kept in `src/bean` only to expose shortcut lookup | Usually no | re-evaluate placement | `@Virtual()` is not a shorthand filter |
| misplaced bean-scene class that should not be globally visible | No | move to `src/lib` or `src/service` | fix placement, not metadata |

## Worked examples

### Example: runtime-anchor dialect base

`databaseDialectBase_.ts` is virtual because it remains container-managed and is used as the runtime base for dialect resolution, but it is not meant to become a separate public shorthand ownership center.

### Example: bean-scene bridge node

`bean.model.ts` is still in bean-scene because it intentionally participates in the global shorthand surface, but `@Virtual()` preserves its bridge-node semantics.

### Example: derived dialect variant

`databaseDialect.mysql3.ts` combines `$Class.extend(...)` and `@Virtual()` because those two features solve different problems:

- `$Class.extend(...)` expresses a framework-managed derived-class relationship
- `@Virtual()` preserves inherited runtime ownership semantics

## Quick checklist

Ask these questions in order:

1. Does the class still need container-managed behavior?
   - if no, do not use `@Virtual()`
2. Is it a runtime extension of a parent bean system rather than a new business ownership center?
   - if yes, `@Virtual()` may be appropriate
3. Are you using `@Virtual()` only to hide the class from shorthand or metadata surfaces?
   - if yes, do not use it; fix placement instead
4. Will inherited `moduleBelong` produce the correct `scope` / `config` / `model` / `entity` behavior at runtime?
   - if no, do not use `@Virtual()`

## Related guidance

Read these pages together:

- [Class Placement Rule](/ai/class-placement-rule)
- [Global Bean Lookup](/ai/global-bean-lookup)
- [Docs, Skills, Rules, and CLI Mapping](/ai/docs-skills-rules-mapping)

For maintainer-level rationale, also read:

- `.docs-internal/architecture/virtual-decorator-runtime-semantics.md`
