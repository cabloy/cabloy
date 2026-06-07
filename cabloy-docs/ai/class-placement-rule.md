# Class Placement Rule

Use this rule when deciding where a backend base class should live.

The goal is to keep pure helpers out of the bean registry, keep runtime-anchor classes container-managed, and keep the global bean shorthand surface intentional.

## The short rule

- **A**: pure helper base -> `src/lib`
- **B1**: subclass-only base -> evaluate case by case, often `src/lib`
- **B2**: runtime-anchor base that still needs container-managed or selector/class-token behavior but should not be a global bean -> prefer `src/service` with `@Service()`

## What the categories mean

### A: pure helper base

Use A when the class is only a reusable implementation helper.

Typical signals:

- no bean lifecycle requirement
- no class-token lookup requirement
- no selector-based resolution requirement
- no need for bean-managed context or injection

Recommended placement:

- `src/lib`

### B1: subclass-only base

Use B1 when the class mainly exists as a superclass for concrete subclasses.

Typical signals:

- concrete behavior is usually reached through subclasses
- the superclass may not need its own durable runtime identity
- registration may be historical rather than essential

Recommended placement:

- evaluate case by case
- often `src/lib`

### B2: runtime-anchor base

Use B2 when the class still participates in runtime bean resolution, even if it should not be treated as a public global bean.

Typical signals:

- used as a class token
- used in `_getBean(...)` or `_getBeanSelector(...)`
- participates in selector-aware resolution or instance caching
- depends on bean lifecycle or other container-managed behavior
- already uses `@Virtual()` for an intentional business meaning that should survive the move

Recommended placement:

- `src/service` with `@Service()`
- if the original class was virtual, keep `@Virtual()` after the move

## Fast classification checklist

Ask these questions in order:

1. Does the class still need container-managed behavior?
   - if no, it is usually A or B1
2. Is it mainly a runtime anchor rather than a public global bean?
   - if yes, it is usually B2
3. Is it mostly a superclass convenience whose logic runs through concrete subclasses?
   - if yes, it is usually B1

## Why B2 uses service-scene

B2 is about runtime semantics, not business naming.

The point is not that the class suddenly becomes a business-oriented service. The point is that it still needs container-managed behavior while no longer belonging on the global bean shorthand surface.

That is why `src/service` with `@Service()` is usually the better fit than moving it directly to `src/lib`.

If the original class already used `@Virtual()`, preserve `@Virtual()` after the move. Virtuality and service-scene placement describe different concerns and should not be conflated.

## Validated B2 examples

The cache and summer runtime-anchor bases validated this rule in practice.

That validation also confirmed an important constraint:

- if a B2 base already used `@Virtual()`, keep `@Virtual()` after moving it to `src/service`

The next separate step after placement validation is naming consistency for the public base-class surface.

## Related guidance

Read these pages together:

- [Backend Foundation](/backend/foundation)
- [Service Guide](/backend/service-guide)
- [Docs, Skills, Rules, and CLI Mapping](/ai/docs-skills-rules-mapping)
