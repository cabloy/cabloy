# External AOP Guide

## Why external AOP matters

External AOP lets Vona attach behavior to another class from the outside without editing that class directly.

This matters when the extension logic should remain decoupled from the target class source while still participating in the framework’s typed bean model.

## Core model

External AOP uses `@Aop({ match: ... })` to associate an aspect class with one or more target classes by bean name.

Representative CLI generation pattern:

```bash
npm run vona :create:bean aop log -- --module=demo-student
```

Representative shape:

```typescript
@Aop({ match: 'demo-student.service.test' })
export class AopLog extends BeanAopBase {}
```

The `match` option determines which classes the external aspect applies to.

## What external AOP can intercept

External AOP can extend:

- synchronous methods
- asynchronous methods
- getters
- setters
- `__init__`
- `__dispose__`
- generic method dispatch through `__method__`
- magic-method style behavior such as `__get__` and `__set__`

## Representative method interception

### Synchronous method

```typescript
actionSync: AopAction<ServiceTest, 'actionSync'> = (_args, next) => {
  const timeBegin = Date.now();
  const res = next();
  const timeEnd = Date.now();
  console.log('actionSync: ', timeEnd - timeBegin);
  return res;
};
```

### Asynchronous method

```typescript
actionAsync: AopAction<ServiceTest, 'actionAsync'> = async (_args, next) => {
  const timeBegin = Date.now();
  const res = await next();
  const timeEnd = Date.now();
  console.log('actionAsync: ', timeEnd - timeBegin);
  return res;
};
```

## Getter and setter interception

External AOP can also wrap property access:

```typescript
protected __get_name__: AopActionGetter<ServiceTest, 'name'> = function (next) {
  const value = next();
  return value;
};

protected __set_name__: AopActionSetter<ServiceTest, 'name'> = function (value, next) {
  return next(value);
};
```

This is especially useful when you want to observe or constrain property access without moving that concern into the target class source.

## Lifecycle interception

You can extend lifecycle hooks such as:

- `__init__`
- `__dispose__`

That allows setup and teardown behavior to be wrapped externally when needed.

## Generic magic-method interception

External AOP also supports broader interception points such as:

- `__get__`
- `__set__`
- `__method__`

This makes it possible to add dynamic behavior such as custom virtual properties or broad method-level logging without editing the target class source.

## Ordering and runtime controls

External AOP supports the same kinds of runtime controls seen elsewhere in Vona:

- `dependencies`
- `dependents`
- enable/disable
- `mode`
- `flavor`
- inspection of the effective AOP list

Representative inspect pattern:

```typescript
this.bean.onion.aop.inspect();
```

That becomes especially helpful when more than one external aspect matches the same target bean and you need to confirm the effective chain before changing ordering metadata.

## When to use external AOP instead of internal AOP

Use this rule of thumb:

- use **internal AOP** when the behavior belongs naturally inside the target class or its decorator surface
- use **external AOP** when the behavior should be attached from outside by bean match and remain decoupled from the target class definition

A good concrete signal for external AOP is when one extension should apply to an existing service or bean without forcing that bean to import new decorators or framework logic just to host the concern.

## Relationship to internal AOP

External AOP and internal AOP solve similar extension problems, but with different ownership models:

- **internal AOP** decorates the class from within its own source
- **external AOP** attaches behavior from the outside by match

Read this page together with [Internal AOP Guide](/backend/internal-aop-guide).

## Questions for external AOP changes

When extending a backend class, ask:

1. should this behavior live in the class source or outside it?
2. is the target identified more naturally by bean name matching?
3. does the extension need to intercept methods, accessors, lifecycle hooks, or magic-method behavior?
4. does ordering or runtime environment control matter for this aspect?

That helps AI choose a Vona-native extension model instead of patching behavior manually into unrelated code.
