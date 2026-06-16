# Behavior Guide

This guide explains how **Behavior** works in Zova and how to use it to add reusable render-time capabilities around components and native elements.

Behavior is a built-in frontend bean scene in Zova. It is implemented on top of the onion-composition system, so a Behavior is not only a helper function or a plain Vue wrapper. It is a structured bean that can participate in composition, lifecycle, host-scoped injection, and reactive reloading.

## What a Behavior is

A Zova Behavior is a render-time middleware bean.

A Behavior can:

- receive render props
- adjust those props before rendering continues
- wrap the rendered vnode
- compose with other behaviors in a stable order
- react to option changes through bean lifecycle

The public decorator is:

```typescript
@Behavior()
```

At the source level, the decorator is implemented as:

```typescript
createBeanDecorator('behavior', 'new', true, options)
```

That matters because Behavior is authored as a **fresh-instance bean scene** with decorator options, while the runtime may reuse existing behavior instances across reloads when appropriate.

## When to use Behavior

Use Behavior when you need reusable render-time composition that should stay inside the Zova bean model.

Typical use cases include:

- focus and ref interception for native elements
- reusable form-field layout wrappers
- prop transformation before the final render
- UI wrappers that should stay composable instead of being copied into many components
- module-level behavior selection through provider config

Do **not** reach for Behavior first when a plain helper or a normal component is enough.

A practical rule is:

- use a helper for framework-neutral logic
- use a normal component for standalone UI composition
- use a Behavior when the main need is **composable render-time interception around another render target**

## Behavior vs Component vs Helper

Use these three tools for different kinds of reuse.

| Tool | Best fit | Typical responsibility |
| --- | --- | --- |
| Behavior | render-time interception or wrapping | adjust props, intercept refs, wrap a vnode, compose multiple render concerns |
| Component | standalone UI unit | own a reusable UI contract and render structure directly |
| Helper | framework-neutral utility | transform data, normalize values, or share logic that does not need bean lifecycle or render composition |

A practical decision map is:

- choose a **Behavior** when the concern should wrap or intercept another render target and stay composable
- choose a **Component** when the concern should present its own stable UI surface
- choose a **Helper** when the concern does not need IoC, lifecycle, host injection, or render-chain composition

Representative examples from this repository:

- `a-behaviors:focus` is a **Behavior** because it intercepts `ref` and augments native-element rendering
- `ZFormFieldPreset` is a **Component** because it exposes a reusable UI/render contract directly
- small data or option normalization utilities are better kept as **Helpers** because they do not need the behavior pipeline

### Quick decision tree

Use this quick check when choosing the implementation shape:

1. does the concern need to wrap or intercept another render target?
   - yes -> use a **Behavior**
   - no -> continue
2. does the concern need to expose its own reusable UI surface?
   - yes -> use a **Component**
   - no -> continue
3. does the concern mainly transform data or options without needing bean lifecycle or host injection?
   - yes -> use a **Helper**
   - no -> re-check whether the concern actually belongs in a Behavior or another bean type

## Mental model

A good mental model is:

- **component**: renders itself
- **helper**: transforms data
- **Behavior**: intercepts or wraps another render step

The authoring contract is middleware-like:

```typescript
protected render(props, next) {
  return next(props)
}
```

A Behavior can leave the render path unchanged, modify the props before delegating, or wrap the vnode returned by `next(...)`.

## The public authoring surface

The core public API is small.

### `@Behavior()`

Use `@Behavior()` to declare a behavior bean.

Representative shape:

```typescript
import { BeanBehaviorBase, Behavior } from 'zova-module-a-behavior'

@Behavior()
export class BehaviorFocus extends BeanBehaviorBase {
  protected render(props, next) {
    return next(props)
  }
}
```

### `BeanBehaviorBase`

Most custom behaviors inherit from `BeanBehaviorBase`.

The base class provides:

- `$options` for decorator/runtime options
- `createComposer(...)` for nested behavior composition
- `render(props, next)` as the main extension point
- host-scoped access to the behavior host through injection

Representative host-scoped injection pattern:

```typescript
@Use({ injectionScope: 'host' })
$$formField: ControllerFormField;
```

This is one of the main reasons Behavior fits naturally into the Zova bean architecture rather than acting like a generic Vue-only hook.

### `$UseBehavior()`

`$UseBehavior()` creates a behavior declaration object.

Representative shape:

```typescript
$UseBehavior('a-behaviors:focus', { always: true })
```

The helper returns one behavior declaration item in object form. Broader normalization into onion items happens later in the runtime composer path.

### `$UseBehaviorTag()`

`$UseBehaviorTag()` creates the target tag descriptor used by the behavior wrapper.

Representative shape:

```typescript
$UseBehaviorTag('input')
```

### `ZBehavior`

`ZBehavior` is the public wrapper component exported by the behavior module.

Its controller-facing path is:

- `ZBehavior`
- `ControllerBehavior`
- `BeanBehaviorsHolder`
- `BeanBehavior`
- `ServiceComposer`

Inside that flow, `BeanBehaviorsHolder` wraps the requested behaviors with `a-behavior:root`, and `BehaviorRoot` delegates into the nested behavior stack.

Use this wrapper when you want a component-oriented entrypoint into the behavior system.

## Behavior declaration shapes

At the type level, `IBehaviors` accepts these shapes:

- a single behavior name
- one behavior-options object
- an array of behavior names and/or behavior-options objects

Representative forms:

```typescript
'a-behaviors:focus'
```

```typescript
{ 'a-behaviors:focus': { always: true } }
```

```typescript
[
  'a-behaviors:focus',
  { 'home-login:formFieldLayoutLogin': {} },
]
```

At runtime, the composer normalizes these forms into onion items before the render chain is built.

## How the render pipeline works

The runtime path is easiest to understand from the public wrapper inward.

### 1. The wrapper/controller layer

`ZBehavior` uses `ControllerBehavior`, and the controller initializes `BeanBehaviorsHolder` with:

- a `behaviorTag` that identifies the target component or element
- a `behaviors` source that can be reactive

### 2. The holder layer

`BeanBehaviorsHolder` is the component-facing adapter.

Its main responsibilities are:

- store the target tag in `$$behaviorTag`
- build a synthetic root behavior declaration through `a-behavior:root`
- create a composer through `BeanBehavior`
- watch reactive behavior declarations and reload the composer when they change
- strip behavior-only props such as `behaviorTag` and `behaviors` before final render

This makes the behavior system reactive without requiring each behavior implementation to manually watch upstream inputs.

### 3. The synthetic root behavior

`BehaviorRoot` is an internal root behavior used to compose nested behavior stacks.

It creates an inner composer in `__init__`, reloads that composer in `onOptionsChange(...)`, and delegates rendering to the inner composer.

This is why the holder can wrap a whole behavior stack in one stable entry behavior.

### 4. The composition engine

`ServiceComposer` is the core runtime.

It:

- normalizes behavior declarations into onion items
- loads behavior onion slices through `SysOnion.behavior`
- reuses prior behavior bean instances by `beanFullName`
- calls `onOptionsChange(...)` when options changed
- disposes behavior beans that were removed
- composes the final render function by invoking each behavior bean’s `render(...)`

That reuse path is important because Behavior is not only a stateless functional transform. A behavior bean can keep instance state and still react correctly when options change.

## The authoring contract inside a behavior

A Behavior typically overrides `render(props, next)`.

There are three common patterns.

### 1. Pass-through behavior

A pass-through behavior keeps the pipeline intact and mainly exists to participate in host injection or future extension.

Representative pattern:

```typescript
protected render(renderContext, next) {
  return next(renderContext)
}
```

This is the shape used by the basic form-field behavior.

### 2. Prop interception behavior

A behavior can adjust props before the next render step runs.

Representative focus behavior:

```typescript
protected render(props, next) {
  const refOuter = props?.ref
  props = {
    ...props,
    ref: ref => {
      ref.focus?.()
      refOuter?.(ref)
    },
  }
  return next(props)
}
```

This is a good fit for concerns such as:

- focus management
- ref chaining
- attribute injection
- prop normalization

### 3. Wrapper/layout behavior

A behavior can render `next(...)`, inspect the returned vnode, and then wrap it with layout markup.

That is the main pattern used by form-field layout behaviors.

Representative uses include:

- block or inline layout wrappers
- label and error rendering
- icon prefix/suffix rendering
- page-specific form layout customization

## Real examples in this repository

The current source contains several representative behavior implementations.

### Focus behavior on a native element

The module `a-behaviors` includes a small canonical example:

- behavior bean: `a-behaviors:focus`
- implementation idea: intercept `ref`, focus the element, then forward the outer ref

Representative usage:

```tsx
<input bs-behaviors-focus type="text" class="input w-full max-w-xs" />
```

This is a clean example of attaching a behavior to a native element through a generated `bs-*` attribute.

### Form-field behavior composition

The form-field controller composes behaviors from two sources:

- the field component’s own `behaviors` prop
- the form provider’s behavior selection

Representative logic:

- `FormField` behavior from `formProvider.behaviors?.FormField`
- `FormFieldLayout` behavior from `formProvider.behaviors?.FormFieldLayout`

This is how one page can switch layout behavior without rewriting the form-field component itself.

### Page-level behavior selection

The login page shows a useful page-level configuration pattern:

```tsx
<ZForm
  formProvider={{ behaviors: { FormFieldLayout: 'home-login:formFieldLayoutLogin' } }}
>
```

That selects a page-specific layout behavior while keeping the same form-field rendering flow.

## Generated `bs-*` attributes

Behavior metadata generation also exposes shorthand HTML/JSX attributes.

For example, a behavior such as `a-behaviors:focus` generates an attribute like:

```tsx
bs-behaviors-focus
```

The generation rule is defined by the behavior metadata generator and is based on the module name and bean name.

This is why behavior usage on native elements often appears as named `bs-*` attributes rather than only as one generic prop.

The base behavior types also extend HTML/JSX surfaces with:

- `behaviors?: IBehaviors` on HTML input-style attribute surfaces
- `bs_all?: IBehaviors` on JSX/runtime HTML attribute surfaces

In practice, the generated named `bs-*` attributes are the clearer and more discoverable entrypoint for native-element usage.

## Reactive behavior reloading

`BeanBehaviorsHolder` accepts a behavior source that can be a function.

When the holder receives the behavior declaration as a function, it watches that source and reloads the composer only when the value actually changed.

That means a behavior stack can evolve with component state while still using the same composition pipeline and bean lifecycle.

## Design rules for Behavior authors

When writing a custom Behavior, ask these questions.

### Is the concern really render-time middleware?

If the concern is mainly around wrapping or intercepting another render target, Behavior is a strong fit.

If the concern is pure data transformation or standalone UI structure, prefer a helper or a normal component.

### Does the behavior need host-scoped dependencies?

Many useful behaviors need the host object, such as a form-field controller.

If the logic depends on host state, prefer host-scoped injection instead of reaching around the framework with ad hoc shared state.

### Should the behavior mutate props or wrap the vnode?

A practical split is:

- mutate props when the concern is about the next render input
- wrap the vnode when the concern is about layout or presentation around the rendered result

### Does the behavior need instance state?

Because behaviors are fresh bean instances, they can safely keep local instance state and still participate in lifecycle and disposal.

That is useful for cases such as cached refs, local style handles, or nested composer ownership.

## Relationship to other frontend guides

Read this guide together with:

- [IoC and Beans](/frontend/ioc-and-beans)
- [Frontend Bean Scene Authoring](/frontend/bean-scene-authoring)
- [Component Guide](/frontend/component-guide)

Use [Frontend Bean Scene Authoring](/frontend/bean-scene-authoring) when you need to create a **new bean scene**.

Use this page when you need to understand or author beans inside the existing **Behavior** scene.

## Verification checklist

When documenting or changing Behavior-related frontend code, verify in this order:

1. confirm the behavior API and runtime claims against the current `a-behavior` source
2. confirm representative usage still exists in real modules such as form-field and focus behaviors
3. confirm any generated `bs-*` attribute examples match current metadata output
4. build the docs site:

   ```bash
   npm run docs:build
   ```

5. verify the page is reachable from the frontend sidebar and related frontend guides
