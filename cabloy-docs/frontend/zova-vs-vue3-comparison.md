# Zova vs Vue 3 Comparison

This page compares **Zova’s frontend programming model** with the **default mental model many developers bring from Vue 3**.

The goal is not to argue that one replaces the other.

The goal is to explain two things clearly:

1. **Zova still stands on top of Vue 3 runtime and reactivity foundations**
2. **Zova deliberately changes the preferred authoring surface, architectural center, and code-organization habits built on top of those foundations**

Use this page together with:

- [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers)
- [Zova Reactivity Under the Hood](/frontend/zova-reactivity-under-the-hood)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)

## Why this page exists

A Vue developer can look at Zova code and ask questions like these:

- why is this state a plain class field instead of a `ref`?
- why is derived state wired in `__init__` instead of declared in `setup()`?
- why does route state appear on the controller instance instead of being pulled through `useRoute()`?
- why does the page grow into controller/render/style/service beans instead of only more composables and child components?

Those questions are reasonable.

This page answers them by comparing the two programming models across a few stable architectural dimensions.

## The shortest accurate summary

If you only want the shortest answer, use this one:

> Vue 3 usually presents reactivity as explicit local primitives and composition-oriented setup logic, while Zova presents reactivity through framework-managed bean instances and controller-oriented architecture.

Under the surface, Zova still uses Vue runtime/reactivity capabilities.

The big difference is the **business-facing programming model**.

## Side-by-side comparison table

| Dimension | Zova | Vue 3 default mental model |
| --- | --- | --- |
| Reactive host | controller or bean instance | local `ref` / `reactive` values inside `setup()` |
| Derived state | `$computed()` often assigned to instance fields | `computed()` usually assigned to local variables |
| Main wiring surface | `__init__` and bean lifecycle | `setup()` and composition hooks |
| Route state access | page-controller surface such as `$route`, `$params`, `$query` | composables such as `useRoute()` |
| Sharing model | IoC containers and bean scopes unify more sharing patterns | composables, props/emits, `provide/inject`, and store layers often coexist |
| Render organization | controller-oriented; render can stay in controller or move to render beans | component-oriented; template/render/setup stay the obvious center |
| Growth path | split into controller, render, style, service, model, or other beans | split into composables, child components, and store or helper layers |
| Architectural emphasis | explicit object roles, scope ownership, and runtime-managed surfaces | flexible local composition with more developer-managed assembly |

## 1. Reactive host

### Zova

Zova often makes the controller or bean instance the visible reactive surface.

That is why code can look like:

```typescript
count: number = 0;

increment() {
  this.count++;
}
```

The important idea is not only shorter syntax.

The important idea is that the framework is making the bean instance itself the business-facing state host.

### Vue 3

The default Vue mental model usually starts with explicit primitives:

```typescript
const count = ref(0);

function increment() {
  count.value++;
}
```

### Comparison takeaway

- Vue 3 teaches you to build reactivity from visible primitives
- Zova teaches you to work on top of a framework-managed reactive object

## 2. Derived state

### Zova

Derived state often looks like instance wiring:

```typescript
protected async __init__() {
  this.count2 = this.$computed(() => {
    return `=== ${this.count} ===`;
  });
}
```

This makes derived state feel like part of object initialization and lifecycle wiring.

### Vue 3

Derived state often looks like local reactive declaration:

```typescript
const count2 = computed(() => `=== ${count.value} ===`);
```

### Comparison takeaway

- Vue 3 presents derived state as a local reactive value
- Zova often presents it as an instance-level property of a controller or bean

## 3. Main wiring surface

### Zova

Zova concentrates many setup concerns inside bean lifecycle methods such as:

- `__init__`
- `__dispose__`

That is where you often wire:

- computed values
- watchers
- derived state
- lifecycle cleanup

### Vue 3

Vue 3 usually treats `setup()` as the main assembly point, then uses composition hooks around it.

### Comparison takeaway

- Vue 3 is more obviously composition-function-centered
- Zova is more obviously lifecycle-and-object-centered

## 4. Route state access

### Zova

For page controllers, route-aware state is often part of the controller surface:

- `$route`
- `$params`
- `$query`

This keeps route-aware page logic close to the page controller itself.

### Vue 3

Vue code more often pulls route state through:

- `useRoute()`
- `useRouter()`

### Comparison takeaway

- Vue 3 usually pulls route state into local composition code
- Zova usually pushes route-aware state into the page-controller surface

## 5. Sharing model

### Zova

Zova uses IoC as a larger frontend architectural answer, not only as a small dependency-injection convenience.

That means questions often become:

- which bean owns this behavior?
- which scope should this bean live in?
- should this be resolved through injection or lookup?

### Vue 3

Vue projects often combine several distinct sharing tools depending on the team and codebase:

- props and emits
- composables
- `provide/inject`
- store layers

### Comparison takeaway

- Vue 3 gives a flexible base that can lead to multiple sharing styles in one codebase
- Zova tries to unify more of those patterns through bean and scope architecture

## 6. Render organization

### Zova

Zova treats render as part of a controller-oriented architecture.

A page can:

- render directly inside the controller
- later split render into a dedicated render bean
- also split style into a style bean
- later move additional state or behavior into service beans

### Vue 3

Vue usually treats the component itself as the natural render center:

- template
- render function
- `setup()` locals feeding the component render

### Comparison takeaway

- Vue 3 makes the component the obvious render center
- Zova makes the page or component controller architecture the larger center

## 7. Growth path as complexity increases

### Zova

A common Zova growth path is:

1. start with one page controller
2. split render into a render bean
3. split style into a style bean
4. extract state or logic into service or model beans when ownership becomes clearer

### Vue 3

A common Vue growth path is:

1. start with one component
2. extract composables
3. add child components
4. introduce or extend store ownership where needed

### Comparison takeaway

- Vue 3 complexity growth often feels more composition-first
- Zova complexity growth often feels more role-and-boundary-first

## 8. Code-reading experience

### Zova

When reading Zova, you often ask:

- which bean am I looking at?
- is this a page, component, service, model, render, or style role?
- what scope owns this bean?
- what runtime surface is being injected or refreshed onto it?

### Vue 3

When reading Vue, you often ask:

- what lives in `setup()`?
- which composables are being used?
- which local refs/computeds feed the render?
- where does state ownership move to a store or parent component?

### Comparison takeaway

The reading rhythm itself changes.

That is why a Vue expert can still feel unfamiliar inside Zova at first even though the lower-level reactive runtime is related.

## What is the same underneath

Despite all the differences above, a few important foundations are still shared:

- Vue reactivity still matters underneath
- dependency tracking still matters underneath
- recomputation and rerender still matter underneath
- component runtime behavior still matters underneath

So the comparison is **not**:

- Zova versus Vue runtime

It is mostly:

- Zova’s architectural authoring model versus Vue’s default authoring habits

## When to prefer this comparison page

Use this page when:

- you already know Vue and want a clean translation layer into Zova
- you want one page that summarizes the biggest architectural differences quickly
- you need to explain to another developer why Zova code should not be auto-refactored back toward generic Vue patterns

If you want the next level of detail after this page, continue with:

- [Zova Reactivity Under the Hood](/frontend/zova-reactivity-under-the-hood)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)

## Final takeaway

The most important comparison insight is simple:

> Vue 3 usually teaches explicit reactive primitives first and architectural composition second. Zova keeps the Vue runtime foundation but teaches explicit architectural roles first and hides more of the reactive primitive management behind framework-managed controller and bean surfaces.

Once that shift is clear, Zova code becomes much easier to read on its own terms.
