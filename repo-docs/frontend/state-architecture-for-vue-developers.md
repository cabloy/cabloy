# State Architecture for Vue Developers

This guide is for Vue developers who already know common Vue state patterns and want the shortest docs-style explanation of how Zova/Cabloy organizes large-project state differently.

It does **not** argue that Vue's usual tools are wrong.
It explains why large projects often need a stronger architecture for state ownership, sharing boundaries, persistence, cache semantics, and SSR behavior.

Use this page together with:

- [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers)
- [Zova vs Vue 3 Comparison](/frontend/zova-vs-vue3-comparison)
- [IoC and Beans](/frontend/ioc-and-beans)
- [Model Architecture](/frontend/model-architecture)
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)

## Why this page exists

Many Vue teams do not struggle because they picked one obviously bad tool.

They struggle because a large codebase gradually accumulates many valid state mechanisms at the same time:

- component-local reactive state
- composables
- `provide/inject`
- store layers
- query cache
- local persistence
- SSR-specific state rules

Each mechanism can solve a real local problem.

The large-project difficulty usually appears later, when the team can no longer answer these questions cleanly:

- who owns this state?
- how far should it be shared?
- which lifecycle rules apply to it?
- who owns cache identity and invalidation?
- is this only a value, or part of a larger resource boundary?

That is the architectural problem this page addresses.

## The shortest accurate summary

If you only remember one paragraph, remember this one:

> Large Vue projects rarely become hard because they need one more state tool. They usually become hard because ownership, sharing boundaries, persistence, cache semantics, and SSR behavior stop composing into one coherent system.

Zova's answer is to push those concerns back under a more explicit architecture:

- **Controller / Bean** makes ownership more explicit
- **IoC scopes** make sharing boundaries more explicit
- **Model** unifies several state families under one model-owned boundary
- **Resource Owner** keeps query, schema, permissions, forms, and invalidation closer to one resource-level owner

## Start with boundary questions, not only tool questions

In many Vue projects, state discussions begin with questions like these:

- should this go into a composable?
- should this move to a store?
- should we add a query layer?
- should we persist this in localStorage?

Those are reasonable questions.

But in a large system, the more important questions usually come first:

1. **Ownership** — which framework-managed object should own this state?
2. **Sharing boundary** — is it local, parent/child shared, app-level, or system-level?
3. **State family** — is it query-style remote state, in-memory state, local persistence, cookie-backed state, or async persisted state?
4. **Lifecycle** — what should survive page disposal, refresh, route transitions, or SSR request boundaries?
5. **Resource boundary** — does this state belong to a larger resource owner that also owns schema, permissions, forms, and invalidation?

Zova tries to answer those questions structurally instead of leaving them spread across unrelated mechanisms.

## 1. Ownership: make the state host explicit

A common Vue mental model starts with local reactive primitives and composition logic inside `setup()`.

Zova keeps Vue's reactive foundation, but changes the visible business-facing host. The most important state often lives on framework-managed Controller or Bean instances instead of starting life as scattered local variables.

That changes the reading question from:

- which composable or local variable holds this?

into:

- which Controller, Bean, or Model owns this?

That is a better scaling question because ownership drift is often the first step toward cache drift, persistence drift, and SSR drift.

For the broader authoring-model shift, read [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers) and [Zova vs Vue 3 Comparison](/frontend/zova-vs-vue3-comparison).

## 2. Sharing: treat scope as a first-class architectural decision

Large Vue codebases often express different sharing ranges through different mechanisms:

- component-local state
- parent-child props or `provide/inject`
- app-level stores
- long-lived globals or imported singletons

Zova tries to keep more of those cases inside one bean-and-container architecture.

A compact comparison is:

| Sharing range      | Common Vue pattern                                      | Zova framing                                        |
| ------------------ | ------------------------------------------------------- | --------------------------------------------------- |
| component-internal | local state or component-local composables              | `ctx`-scoped bean ownership                         |
| between-components | props/emits, parent-owned composables, `provide/inject` | hierarchical injection such as `host` or `skipSelf` |
| app-global         | store or app-level provided state                       | `app`-scoped bean ownership                         |
| system-level       | module singleton or long-lived imported state           | `sys`-scoped bean ownership                         |

The key idea is simple:

> Do not start by switching mechanisms. Start by choosing the sharing boundary.

This distinction becomes especially important in SSR, where app/request state and system-level state should not be mixed casually.

Read together with [IoC and Beans](/frontend/ioc-and-beans) and [System Startup Guide](/frontend/system-startup-guide).

## 3. Model: unify multiple state families under one model boundary

In many stacks, remote cache, in-memory shared state, local persistence, cookie state, and async persistent state are handled by separate tools or utilities.

Zova Model tries to organize those families under one broader model-owned runtime.

The current model layer exposes five main state families:

- `data`
- `mem`
- `local`
- `cookie`
- `db`

This means Model is not only a request wrapper and not only another store.

Its architectural role is to give several important state categories a shared home for concerns such as:

- cache identity
- invalidation
- restore behavior
- persistence strategy
- SSR-aware hydration behavior

Read together with [Model Architecture](/frontend/model-architecture), [Model State Guide](/frontend/model-state-guide), and [Server Data](/frontend/server-data).

## 4. Resource Owner: keep resource semantics together

A large frontend resource usually needs more than a query call.

The frontend often also needs:

- schema
- permissions
- forms
- list and item queries
- create/update/delete mutations
- invalidation rules

If those concerns are split across pages, form helpers, store logic, and query callbacks, the resource boundary becomes hard to explain.

Zova's resource-owner direction tries to keep more of that semantic bundle under one stable owner.

A useful shorthand is:

> the page consumes resource semantics, while the model owns query and resource semantics.

That is why the Resource Owner pattern matters in large applications: it improves not only reuse, but also boundary stability.

Read together with [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern) and [Using ModelResource in Your Module](/frontend/model-resource-usage-guide).

## One comparison table

| Dimension          | Common large-Vue drift                                            | Zova architectural answer                                       |
| ------------------ | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| State host         | state starts locally, then moves outward case by case             | assign ownership first to Controller / Bean / Model             |
| Sharing            | sharing range often changes the mechanism                         | sharing is framed through IoC scopes                            |
| Persistence        | local, cookie, and async persistence drift into utilities         | persistence lives inside model-state families                   |
| Cache identity     | keys and refresh rules drift across pages and callbacks           | model identity and model policy own more of the cache semantics |
| SSR                | request-level and long-lived state can blur together              | `app` and `sys` make the distinction structural                 |
| Resource semantics | schema, forms, permissions, and invalidation spread across layers | Resource Owner pulls them back under one owner                  |

## When this architecture matters most

This architecture is most valuable when the frontend is:

- long-lived
- maintained by multiple developers
- SSR-aware
- cache-heavy
- persistence-heavy
- resource-heavy

For small or short-lived projects, a lighter scattered approach may still be good enough.

The point is not that every Vue project must adopt the same architecture.
The point is that as complexity rises, boundary control becomes more important than adding one more tool.

## Recommended reading path

If this page matches your question, continue in this order:

1. [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers)
2. [Zova vs Vue 3 Comparison](/frontend/zova-vs-vue3-comparison)
3. [IoC and Beans](/frontend/ioc-and-beans)
4. [Model Architecture](/frontend/model-architecture)
5. [Model State Guide](/frontend/model-state-guide)
6. [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
7. [System Startup Guide](/frontend/system-startup-guide)

## Final takeaway

The most important practical idea is simple:

> Large Vue projects usually do not need more state tools first. They need a state architecture that can keep ownership, scope, persistence, cache semantics, SSR behavior, and resource boundaries coherent as the system grows.

That is the main reason to read Zova's frontend architecture through Controller / Bean ownership, IoC scopes, Model, and Resource Owner, instead of mapping every state problem back to one more isolated Vue mechanism.
