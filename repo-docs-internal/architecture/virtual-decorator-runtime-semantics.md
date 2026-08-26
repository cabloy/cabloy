# Virtual Decorator Runtime Semantics

This note records the current source-level meaning of `@Virtual()` in Vona and the runtime chain that makes it matter.

Use it when maintaining bean registration, runtime ownership resolution, class placement rules, or mapped-class behavior.

## Why this note exists

The repository already had an important negative rule:

- do not use `@Virtual()` as a shorthand or registration filter

What was still easy to forget was the positive definition:

- what `@Virtual()` actually changes
- where that change happens in source
- why it remains orthogonal to class placement and mapped-class utilities

This note captures that positive definition and the current invariants future refactors should preserve.

## The core definition

`@Virtual()` is a class-level semantic marker for inherited runtime ownership.

It does **not** suppress bean registration.

Its core purpose is to make bean registration inherit `moduleBelong` from the nearest parent bean in the inheritance chain instead of treating the current class as a new independent runtime ownership center.

## Source chain

The current runtime story is:

```text
@Virtual()
 -> define virtual metadata on the class
 -> addBean() reads that metadata during registration
 -> _parseModuleBelong() inherits parent moduleBelong when virtual
 -> bean instance resolves moduleBelong through bean registration metadata
 -> scope resources resolve against that inherited moduleBelong
```

## Step 1: decorator stage

Source:

- `vona/packages-vona/vona-core/src/lib/decorator/class/virtual.ts`

The decorator only writes metadata:

- key: `SymbolDecoratorVirtual`
- value: `true`

That means the decorator itself is deliberately small. The business meaning appears only when bean registration reads the metadata later.

## Step 2: registration stage

Primary sources:

- `vona/packages-vona/vona-core/src/lib/decorator/class/createBeanDecorator.ts`
- `vona/packages-vona/vona-core/src/lib/core/resource.ts`

`@Bean()`, `@Service()`, and similar scene decorators register beans through `createBeanDecorator(...)`, which then calls `appResource.addBean(...)`.

During `addBean(...)`:

1. Vona reads `SymbolDecoratorVirtual` from the class
2. it computes `beanFullName`
3. it computes `moduleBelong`
4. it stores the resulting bean options in the resource registry

The critical step is `_parseModuleBelong(module, beanClass, virtual)`.

Current behavior:

- non-virtual bean -> `moduleBelong = module`
- virtual bean -> walk up `Object.getPrototypeOf(beanClass)` until a parent bean with `moduleBelong` is found, then inherit that value

This is the implementation point where `@Virtual()` stops being metadata and becomes runtime ownership semantics.

## Step 3: bean instance stage

Primary sources:

- `vona/packages-vona/vona-core/src/lib/bean/beanContainer.ts`
- `vona/packages-vona/vona-core/src/lib/bean/beanBaseSimple.ts`

When the bean container creates an instance, it binds the bean's full name to the instance.

The instance does not carry an eagerly written `moduleBelong` field.
Instead, `BeanBaseSimple` resolves ownership lazily from the registered bean metadata:

- `SymbolBeanFullName` -> bean registry lookup -> `moduleBelong`

This matters because it keeps runtime ownership tied to the canonical registration result rather than duplicating ownership state on the instance.

## Step 4: scope resource stage

Primary sources:

- `vona/packages-vona/vona-core/src/lib/bean/beanBase.ts`
- `vona/packages-vona/vona-core/src/lib/bean/scope/beanScopeBase.ts`

`BeanBase.scope` resolves through the bean container using `SymbolModuleBelong`.

That inherited `moduleBelong` then drives module-scoped resource lookup for:

- `module`
- `config`
- `constant`
- `error`
- `locale`
- `util`
- `model`
- `entity`
- meta beans
- scene resources

This is why `@Virtual()` is not a cosmetic marker. It changes which module owns the runtime scope resources seen by the bean.

## Why `@Virtual()` is orthogonal to placement

Placement and virtuality solve different problems.

- placement decides which structural surface a class belongs to: `src/lib`, `src/service`, or `src/bean`
- virtuality decides whether runtime ownership should stay local or inherit from the parent bean chain

That is why the repository guidance says:

- do not use `@Virtual()` as a global-shorthand filter
- if a class should not appear on the bean-scene shorthand surface, move it
- if a class already carries meaningful virtual semantics, preserve `@Virtual()` after moving it

The repository's B2 runtime-anchor rule depends on this separation.

## Why `@Virtual()` is orthogonal to `$Class.extend(...)`

Relevant sources:

- `vona/packages-vona/vona-core/src/lib/mappedClass/mappedClass.ts`
- `vona/packages-vona/vona-core/src/lib/mappedClass/extendClass.ts`
- `vona/src/suite-vendor/a-vona/modules/a-ormdialect/src/bean/databaseDialect.mysql3.ts`

`$Class.extend(...)` and `@Virtual()` are not substitutes.

### `$Class.extend(...)` handles mapped-class infrastructure

At the current implementation level, `ExtendClass(...)` mainly does this:

- register the parent class with mapped/HMR dependency tracking
- return the class reference for the derived-class expression

So `$Class.extend(...)` is about framework-managed derived-class infrastructure.

### `@Virtual()` handles runtime ownership semantics

`@Virtual()` does not participate in mapped-class dependency tracking.
It only changes how bean registration computes `moduleBelong`.

### Why both appear on `DatabaseDialectMysql3`

`databaseDialect.mysql3.ts` combines both because it needs both meanings:

- it is a framework-managed derived class of `DatabaseDialectMysql`
- it should keep inherited runtime ownership semantics instead of becoming a new ownership center

## Validated patterns in the current repository

The current repository uses `@Virtual()` in a small number of patterns.

### 1. Runtime-anchor service bases

Representative files:

- `vona/src/suite-vendor/a-vona/modules/a-orm/src/service/databaseDialectBase_.ts`
- `vona/src/suite-vendor/a-vona/modules/a-cache/src/service/cacheMemBase_.ts`
- `vona/src/suite-vendor/a-vona/modules/a-cache/src/service/cacheRedisBase_.ts`
- `vona/src/suite-vendor/a-vona/modules/a-summer/src/service/summerCacheBase_.ts`

Meaning:

- container-managed runtime anchor
- not a new public shorthand ownership center
- often a B2 placement candidate or already in the validated B2 shape

### 2. Bean-scene bridge nodes

Representative file:

- `vona/src/suite-vendor/a-vona/modules/a-orm/src/bean/bean.model.ts`

Meaning:

- intentionally remains on the shorthand surface
- still behaves as an inherited bridge node rather than a separate ownership center

### 3. Compatibility or variant nodes

Representative file:

- `vona/src/suite-vendor/a-vona/modules/a-ormdialect/src/bean/databaseDialect.mysql3.ts`

Meaning:

- variant node in a parent bean hierarchy
- ownership should continue to follow the parent chain

## Anti-patterns future work should avoid

Avoid these mistakes:

- treating `@Virtual()` as a registration suppression flag
- keeping a non-global class in `src/bean` and compensating with metadata tricks
- dropping `@Virtual()` during a scene migration only because the class moved
- adding `@Virtual()` to a pure helper that should live in `src/lib`
- assuming that every base class should be virtual
- conflating mapped-class helpers with virtual ownership semantics

## Invariants future refactors should preserve

Future work should preserve these boundaries:

1. `@Virtual()` must keep its business/runtime meaning rather than becoming a metadata filter
2. `moduleBelong` inheritance must remain the effective runtime consequence of virtuality unless the design is intentionally changed everywhere
3. class placement must continue to carry structural meaning independently of virtuality
4. B2 runtime-anchor classes must keep the container-managed behavior they rely on
5. mapped-class infrastructure and virtual ownership semantics should remain separate concerns
6. bean-scene classes that remain in `src/bean` should normally continue to participate in `IBeanRecordGlobal`

## Maintenance questions to ask before changing this area

Before changing virtual registration semantics, ask:

1. Will this change alter `moduleBelong` for existing virtual beans?
2. If yes, which scope resources will change as a consequence?
3. Are any validated B2 runtime-anchor bases relying on the current behavior?
4. Are any bean-scene bridge nodes relying on the current shorthand plus virtual combination?
5. Are any mapped-class variant nodes relying on the current separation between `$Class.extend(...)` and `@Virtual()`?

## Related guidance

Read these materials together:

- `repo-docs/ai/class-placement-rule.md`
- `repo-docs/ai/global-bean-lookup.md`
- `repo-docs/ai/virtual-decorator-guidance.md`
- `repo-docs-internal/architecture/class-placement-a-b1-b2.md`
