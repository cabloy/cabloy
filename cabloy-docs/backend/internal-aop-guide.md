# Internal AOP Guide

## Why internal AOP matters

Internal AOP is how Vona adds behavior inside a class without forcing the developer to duplicate the same logic across many methods.

This is especially useful for:

- transactions
- logging
- caching
- scope-based lookup
- dynamic property and method behavior

## Two internal AOP mechanisms

Vona provides two main internal mechanisms:

- **AOP Method**
- **Magic Method**

## AOP Method

AOP Method extends class methods through decorators.

It can be used on controller methods, service methods, and other class methods that should participate in reusable around-execution behavior.

Representative CLI generation pattern:

```bash
npm run vona :create:bean aopMethod log -- --module=training-student
```

That generator-backed workflow matters because AOP Method beans participate in the same onion metadata system as other Vona extension points.

### Representative custom AOP Method

```typescript
@AopMethod<IAopMethodOptionsLog>()
class AopMethodLog {
  async execute(_options, _args, next) {
    const timeBegin = Date.now();
    const res = await next();
    const timeEnd = Date.now();
    console.log('time:', timeEnd - timeBegin);
    return res;
  }
}
```

### Representative usage

```typescript
@Aspect.aopMethod('training-student:log')
```

### Parameter model

AOP Method supports:

- typed options
- default values
- per-usage overrides
- app-config overrides
- enable/disable
- `mode` and `flavor`
- ordering through `dependencies` and `dependents`

A representative precedence model is:

- usage-site override
- then `config.onions.aopMethod`
- then decorator default values

That makes AOP Method practical for both framework-wide defaults and one-off method specialization.

## Built-in internal AOP helpers

Several built-in AOP Method helpers already exist.

Representative examples include:

- `a-logger:log`
- `a-orm:transaction`
- `a-caching:cachingGet`
- `a-caching:cachingSet`
- `a-caching:cachingDel`
- `a-caching:cachingClear`

These built-ins also expose shorthand decorators such as:

```typescript
@Core.log({ level: 'info' })
@Core.transaction({ isolationLevel: 'READ_COMMITTED', propagation: 'REQUIRED' })
@Caching.get({ cacheName: 'module-name:xxx' })
```

For the broader logger-client, rotation, and level model behind `@Core.log(...)`, see [Logger Guide](/backend/logger-guide).

## Magic Method

Magic Method provides dynamic behavior through conventional method names such as:

- `__get__`
- `__set__`
- `__method__`
- `__init__`
- `__dispose__`

A useful ownership rule is that Magic Method is about changing how the class itself exposes properties, lookup, or lifecycle behavior, while AOP Method is about wrapping a named method call with reusable around-execution logic.

### Why this matters

Magic Method is one of the reasons Vona can keep dependency lookup and scope-driven APIs concise.

A representative example is module scope lookup:

```typescript
this.scope.model.student.selectAndCount(params);
```

Instead of requiring verbose injection or manual bean lookup, Vona can resolve the target dynamically through magic-method conventions.

### CRUD-oriented example

Magic Method can also simplify ORM usage:

```typescript
this.scope.model.student.getById(id);
```

This reads more naturally than always spelling out lower-level query objects manually.

### Custom `__get__` and `__set__`

Any class can define custom dynamic property behavior:

```typescript
protected __get__(prop: string) {
  return this._colors[prop];
}

protected __set__(prop: string, value: any): boolean {
  if (this._colors[prop] === undefined) return false;
  this._colors[prop] = value;
  return true;
}
```

Type merging can then expose those dynamic properties more safely.

That is the key discipline when using Magic Method: keep the runtime shortcut and the type surface aligned, so dynamic behavior still reads like a deliberate framework abstraction rather than an untyped trick.

## Choosing between AOP Method and Magic Method

Use this rule of thumb:

- use **AOP Method** when the goal is to decorate or wrap a class method
- use **Magic Method** when the goal is dynamic property, lookup, lifecycle, or generic method behavior

## Relationship to other backend guides

Internal AOP connects directly to:

- [Service Guide](/backend/service-guide)
- [Model Guide](/backend/model-guide)
- [Transaction Guide](/backend/transaction-guide)
- [Cache Guide](/backend/cache-guide)

These guides often show the business-facing results of internal AOP, while this page explains the underlying extension model.

## Questions for internal AOP changes

When editing backend classes, ask:

1. is there already an AOP Method or shorthand for this behavior?
2. is a magic-method pattern already part of the framework abstraction here?
3. should scope lookup or dynamic method behavior be preserved instead of rewritten into a heavier pattern?
4. does the change interact with caching, transactions, logging, or lifecycle hooks?

That helps AI preserve Vona’s internal extension model instead of replacing it with generic patterns.
