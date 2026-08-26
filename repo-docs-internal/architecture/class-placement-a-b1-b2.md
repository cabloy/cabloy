# Class Placement: A / B1 / B2

This note records the current class-placement rule for backend base classes after the runtime-anchor evaluation work.

Use it when deciding whether a backend base class belongs in `src/lib`, should remain a container-managed class in `src/service`, or should stay visible as a global bean shorthand.

## Why this rule exists

The repository needs a stable way to separate three different things that used to be easy to mix together:

- pure inheritance helpers
- subclass-only framework bases
- runtime-anchor classes that still need container-managed behavior

Without that distinction, contributors can make two opposite mistakes:

1. move a real runtime-anchor class into `src/lib` and accidentally remove container-managed behavior
2. leave an internal base in bean-scene and accidentally expose it as part of the global bean shorthand surface

The A / B1 / B2 split is meant to preserve runtime behavior while keeping the public global-bean surface intentional.

## The three categories

### A: pure helper base

A class belongs to category A when it is only a reusable implementation helper.

Typical properties:

- no selector-based lookup requirement
- no class-token lookup requirement
- no container lifecycle requirement
- no expectation of `@Use`, `__init__`, `__dispose__`, or other bean-managed behavior
- safe to treat as ordinary TypeScript inheritance support

Default placement:

- `src/lib`

### B1: subclass-only base

A class belongs to category B1 when it exists mainly as a superclass for concrete subclasses and does not need its own durable bean identity in ordinary framework use.

Typical properties:

- concrete instances are usually created through subclasses
- inherited logic executes under the concrete subclass identity
- it may have been registered historically, but should be re-evaluated before assuming that registration is still necessary

Default handling:

- evaluate case by case
- often a good candidate for `src/lib`

The main question is not “is this a base class?” The main question is “does this class still need its own container-managed identity?”

### B2: runtime-anchor base

A class belongs to category B2 when it is still part of runtime bean resolution even if it is not intended to be a public global bean.

Typical properties:

- used as a class token in `_getBean(...)` or `_getBeanSelector(...)`
- participates in selector-aware instance resolution or caching
- relies on container lifecycle or framework-managed context
- should remain container-managed even when it is not a business-facing global bean shorthand
- may already carry `@Virtual()` with a deliberate business meaning that must be preserved during scene migration

Default placement:

- prefer `src/service` with `@Service()`

This is the key distinction from category A and most B1 cases:

- B2 still needs container-managed behavior
- B2 should usually not be downgraded to a plain helper in `src/lib`

## Decision criteria

Use this sequence when classifying a base class.

1. Does the class need container-managed behavior?
   - examples: class-token lookup, selector-based resolution, lifecycle hooks, `@Use`, framework-managed context
   - if no, it is usually A or B1
   - if yes, continue

2. Is the class mainly a runtime anchor rather than a public global bean?
   - if yes, it is usually B2
   - prefer `src/service` with `@Service()`
   - if the original class used `@Virtual()`, preserve `@Virtual()` after the move

3. Is the class only a superclass for concrete subclasses, with no real need for its own runtime identity?
   - if yes, it is usually B1
   - evaluate whether it can move to `src/lib`

## Compact decision table

| Category | Meaning             | Default placement            | Main reason                                                    |
| -------- | ------------------- | ---------------------------- | -------------------------------------------------------------- |
| A        | pure helper base    | `src/lib`                    | no container-managed behavior is needed                        |
| B1       | subclass-only base  | evaluate, often `src/lib`    | the superclass may not need its own bean identity              |
| B2       | runtime-anchor base | `src/service` + `@Service()` | runtime resolution still depends on container-managed behavior |

## Why B2 should not move directly to `src/lib`

Moving B2 to `src/lib` usually removes exactly the properties that make it useful:

- class-token lookup
- selector-aware resolution
- container lifecycle
- bean-managed context and injection
- framework integration points that depend on bean registration

That trade-off is acceptable for A and often B1, but it is not acceptable for B2.

## Why B2 prefers `src/service` + `@Service()`

For B2, service-scene is the preferred compromise:

- the class remains container-managed
- selector and class-token workflows remain available
- the class no longer needs to live on the global bean shorthand surface
- the class is modeled as a runtime service anchor rather than a public global bean

This rule is intentionally narrow.

It does **not** mean every internal base class should become a service. It means that when a class still needs runtime bean semantics but should no longer be treated as a global bean shorthand, service-scene is usually the better fit.

## Anti-patterns to avoid

Avoid these mistakes:

- treating every base class as a plain helper
- assuming historical bean registration automatically means current registration is necessary
- keeping internal runtime-anchor bases in bean-scene only because they were once there
- exposing internal framework bases as global bean shorthand when callers really use them only through class-token or selector-based workflows
- using `@Service()` only as a naming change without checking the resulting scene, identifier, metadata, and virtuality consequences
- dropping `@Virtual()` during migration just because the class moved out of `src/bean`

## Pilot result: cache and summer B2 validation

The cache and summer runtime-anchor bases validated the B2 rule in real framework code.

The validated shape is:

- move the runtime-anchor base into `src/service`
- keep container-managed behavior with `@Service()`
- preserve `@Virtual()` when it already carries business meaning
- keep explicit full-name routing and class-token selector lookup intact

The pilot intentionally preserved the old `Bean*Base` names during the first round so that placement semantics could be validated before public naming changes. The next explicit step is the second-round naming-consistency refactor.

## Underscore suffix and registration semantics

In this repository, a trailing underscore in a service-scene file name carries registration meaning, not only naming style.

The `src/service/*_.ts` form is used for classes that should remain container-managed but should not enter the general full-name registration surface during metadata generation.

In practice, this means:

- they do **not** register into `IBeanRecordGeneral`
- they are therefore not intended to be created through the general full-name path such as `bean._getBean(beanFullName)`
- they may still participate in container behavior through class-token resolution such as `bean._getBean(class)`

This makes `src/service/*_.ts` the preferred placement for many B2 runtime-anchor bases:

- they are not pure helpers, so `src/lib` is too weak
- they still require container-managed behavior
- they should not automatically become general full-name beans
- they often serve as runtime-anchor bases, selector anchors, or class-token contracts

This rule applies primarily to bases and runtime-anchor classes. Do not extend it mechanically to every concrete bean. Concrete beans should keep or drop general/full-name exposure according to their actual runtime role.

`@Virtual()` remains orthogonal to placement. If a class had meaningful `@Virtual()` semantics before moving into `src/service/*_.ts`, keep `@Virtual()` unless there is a specific semantic reason to remove it.

## Bean-scene and `IBeanRecordGlobal`

In this repository, `src/bean` is the structural definition of the global shorthand authoring surface.

That means:

- a class that remains in `src/bean` should normally participate in `IBeanRecordGlobal`
- `IBeanRecordGlobal` should be treated as the authoring-surface registry for global shorthand, not as a full runtime-container inventory
- `@Virtual()` should keep only its business or runtime meaning and should not be reused as a metadata filter for global registration

If a class should not appear in `IBeanRecordGlobal`, the preferred fix is to move it out of bean-scene:

- B1-style or helper bases should move to `src/lib` when appropriate
- B2 runtime-anchor bases should move to `src/service`, often `src/service/*_.ts`

Do not preserve a misplaced bean-scene class and compensate with metadata-generation exceptions or manual `IBeanRecordGlobal` patches. Placement should carry the meaning.

## Why `IBeanRecordGlobal` is the first AI lookup surface

Once `src/bean` is treated as the structural definition of the global shorthand surface, `IBeanRecordGlobal` becomes the most efficient first static lookup surface for many AI-assisted backend tasks.

This is especially true when code references:

- `this.bean.xxx`
- `ctx.bean.xxx`
- `app.bean.xxx`

For maintainers, the important point is not only that `IBeanRecordGlobal` is useful. It is that it is useful **because placement carries meaning**:

- bean-scene means global shorthand authoring surface
- service-scene means service or runtime-anchor lookup surface
- lib means helper or superclass logic, not shorthand lookup

That allows AI to search by surface first instead of searching the whole container model or raw file tree.

### What this should optimize

Future maintenance should preserve this lookup order:

1. `IBeanRecordGlobal` for shorthand lookup
2. module `src/.metadata/index.ts` to map shorthand names to generated types
3. `src/bean` for the shorthand source file
4. only then a fallback to `IBeanRecordGeneral`, `src/service`, or `src/lib` depending on the actual target

This reduces token waste, avoids false positives in `src/service` or `src/lib`, and keeps AI lookup aligned with the same placement rule that humans are expected to follow.

### What this should not become

Maintainers should not let `IBeanRecordGlobal` drift into a pseudo container inventory.

It should remain:

- a static authoring-surface registry for global shorthand
- clean enough that AI can trust it as a first lookup step
- structurally maintained through placement, not hand patches or special-case metadata filters

If AI repeatedly fails to find the right backend shorthand through `IBeanRecordGlobal`, the first maintenance question should be whether the class is misplaced, not whether another metadata exception should be added.

## Invariants future work should preserve

Future refactors should preserve these boundaries:

- the global bean shorthand surface should stay intentional and small
- runtime-anchor classes must keep the container-managed behavior they rely on
- pure helper logic should not stay in the registry without a runtime reason
- the same A / B1 / B2 terminology should be reused across docs, skills, and repo rules so that humans and agents make the same classification decisions

## Related guidance

Read these materials together:

- `repo-docs/ai/class-placement-rule.md`
- `repo-docs/ai/global-bean-lookup.md`
- `repo-docs/ai/virtual-decorator-guidance.md`
- `repo-docs-internal/architecture/virtual-decorator-runtime-semantics.md`
