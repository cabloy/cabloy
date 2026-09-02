---
title: 'Stop Turning Vue3 into a Tangle: From Scattered State to Object Collaboration with Zova'
titleZh: 不必把 Vue 写成“麻花”：从状态碎片到对象协作，重新理解 Zova 的前端心智模型
subtitle: 'Vue 3 remains the reactive foundation. Zova addresses a different question: how state, behavior, dependencies, and lifecycle gain clear ownership as an application grows.'
summary: Starting from the familiar experience of excessive composable destructuring, unclear state ownership, and multiple overlapping state mechanisms in Vue projects, this beginner-friendly article introduces how Cabloy/Zova combines Vue 3 reactivity, TSX, and Angular-style dependency injection into one collaborative model built around Controllers, Beans, and Models.
tags:
  - Vue 3
  - Zova
  - Cabloy
  - Object-Oriented Programming
  - Dependency Injection
  - State Management
  - Frontend Architecture
slug: vue-object-oriented-zova-beginner-mental-model
cover: ./cover-en-v1.png
date: 2026-08-02
---

# Stop Turning Vue3 into a Tangle: From Scattered State to Object Collaboration with Zova

> Vue 3 remains the reactive foundation. Zova addresses a different question: how state, behavior, dependencies, and lifecycle gain clear ownership as an application grows.

Vue 3 has been remarkably successful. It is lightweight, flexible, and built on an elegant reactive system. React and Angular continue to evolve as well, which naturally leads many developers to ask: what will help Vue remain compelling in the future?

One promising direction is not simply another round of debate about which state-management library to choose. It is a more fundamental question:

> As a real application becomes more complex, how should we organize state, behavior, and the relationships between them?

Across many Vue 3 projects, I keep seeing a familiar pattern:

```ts
const { list, loading, fetchList, createItem, removeItem } = useTodo();
```

At first, this is wonderfully concise. But as a page and its business logic grow, friction starts to appear:

- One component consumes several composables, and the destructured variables keep accumulating.
- You have to scan up and down the file to remember where `list`, `loading`, `submit`, or `reset` came from.
- Names begin to collide, so prefixes spread everywhere: `userList`, `orderList`, `todoList`.
- To avoid losing reactivity through destructuring, you need to remember rules around `toRefs`, `storeToRefs`, `computed`, and related helpers.
- Pinia, `provide/inject`, composables, and component-local `ref` or `reactive` each solve part of the problem—but the developer must assemble the overall architecture.

This is not an argument against destructuring, nor is it an argument that Vue 3's Composition API is flawed. On the contrary: it is very powerful.

The real problem is this: **as business complexity rises, code can drift from collaboration between objects toward assembly from individual variables.**

Once variables are scattered, ownership of state, boundaries of behavior, lifecycle, and dependencies can become scattered too.

That is the problem Cabloy/Zova aims to address.

---

## Vue reactivity is excellent—but application code should not become a pile of variables

First, an important clarification:

> Vue is not a framework that must be written in an object-oriented style, and the Vue 3 Composition API is not an incorrect architectural approach.

Vue 3 gives us an excellent reactive foundation. You can organize code with functions or with objects. You can use `ref` and `reactive` directly, or encapsulate them in composables, stores, or other abstractions.

The question is not whether functional or object-oriented programming is inherently more advanced. The question is:

> Does your business state and business behavior have clear, stable, and understandable ownership?

A typical todo page may need:

- a list query, loading state, and error state;
- create, update, and delete actions;
- query caching and a refresh policy after mutations;
- page input state;
- page-rendering logic;
- perhaps permissions, route parameters, and state shared across pages.

If all of these are continually destructured from separate composables, the page can eventually look like this:

```ts
const { todos, loading, refresh } = useTodos();
const { createTodo, creating } = useCreateTodo();
const { removeTodo, removing } = useRemoveTodo();
const { keyword, resetKeyword } = useSearch();
const { currentUser } = useAuth();
```

Every line is reasonable in isolation. Together, though, the structure of the page becomes much less obvious.

- Who owns the todo list?
- Who refreshes the list after a successful create?
- Is `loading` for the query, or for the create operation?
- Which state should survive across pages, and which belongs only to this page?
- When another page needs the todo list, should you duplicate logic, extract a shared composable, or create a store?

These are not syntax problems. They are **architectural questions about state and behavior**.

---

## A different perspective: put state and behavior back into objects

Zova does not try to replace Vue 3's reactive capabilities.

It does something else:

> On top of Vue 3 reactivity, Zova introduces Controllers, Beans, Models, and dependency injection so that state, behavior, lifecycle, and dependencies can again be organized as collaborating objects.

Its three central characteristics can be summarized as:

> **Vue 3 reactivity + TSX rendering + Angular-style dependency injection**

This is not a matter of transplanting Angular or React into Vue. It combines what each approach does well:

| Capability                                       | Zova's approach            |
| ------------------------------------------------ | -------------------------- |
| Reactive foundation                              | Vue 3                      |
| Rendering expression                             | TSX                        |
| Object organization and dependency collaboration | IoC / dependency injection |
| Page logic                                       | Controller                 |
| Reusable business state                          | Model                      |
| Extracted business capabilities                  | Service / Bean             |

Instead of first asking, “Which composable should contain this logic?”, a developer can ask a more natural question:

> Who should own this state and behavior?

---

## A page is an object with a responsibility

Suppose we are building the simplest possible counter page.

In Zova, it can look like this:

```tsx
@Controller()
export class ControllerPageCounter extends BeanControllerPageBase {
  count = 0;

  get countText() {
    return `Current count: ${this.count}`;
  }

  increment() {
    this.count++;
  }

  protected render() {
    return (
      <div>
        <div>{this.countText}</div>
        <button onClick={() => this.increment()}>Increment</button>
      </div>
    );
  }
}
```

The important part of this code is not simply that it uses a class. It expresses the business meaning directly:

- `count` is state owned by this page.
- `increment()` is behavior provided by this page.
- `countText` is display data derived from that state.
- `render()` describes how the page is presented.
- Everything is organized around one object.

You do not first create `ref(0)`, return a group of values, and destructure them at the call site:

```ts
const { count, increment } = useCounter();
```

You use the object's state and behavior directly:

```ts
this.count;
this.increment();
```

This is a small but significant difference: **state no longer floats in a function return value; it clearly belongs to an object.**

Of course, `count` is not reactive because class fields are inherently reactive.

The actual mechanism is that Zova creates the Controller as a container-managed Bean and connects it to Vue's reactivity underneath. When `this.count++` runs, rendering that depends on it updates just as it would with ordinary Vue reactive code.

In other words:

> Object-oriented design organizes the code; Vue 3 makes the state inside those objects reactive.

---

## Do not destructure everything: keep dependencies visible in the code

The real challenge of many complex pages is not the UI. It is the collaboration between multiple business capabilities.

For example, a todo page needs a todo data model. In a conventional Vue project, that might be:

- a composable;
- a Pinia store;
- a group of API functions plus several `ref`s;
- or a mixture of all of the above.

In Zova, it can be expressed explicitly as a Model:

```ts
@Model()
export class ModelTodo extends BeanModelBase {
  findAll() {
    return this.$useStateData({
      queryKey: ['list'],
      queryFn: async () => {
        return await this.scope.api.todo.findAll();
      },
    });
  }

  create() {
    return this.$useMutationData({
      mutationKey: ['create'],
      mutationFn: async body => {
        return await this.scope.api.todo.create(body);
      },
      onSuccess: () => {
        this.$invalidateQueries({ queryKey: ['list'] });
      },
    });
  }
}
```

`ModelTodo` is not merely an API utility class.

It owns a coherent set of responsibilities:

- todo queries;
- query-cache identity;
- create operations;
- state during creation;
- list invalidation and refresh policy after a successful create.

The page Controller can then inject it:

```tsx
@Controller()
export class ControllerPageTodo extends BeanControllerPageBase {
  @Use()
  $$modelTodo: ModelTodo;

  get queryTodos() {
    return this.$$modelTodo.findAll();
  }

  async addTodo() {
    await this.$$modelTodo.create().mutateAsync({
      title: 'Learn Zova',
    });
  }

  protected render() {
    const todos = this.queryTodos.data ?? [];

    return (
      <div>
        <button onClick={() => this.addTodo()}>Create todo</button>

        <ul>
          {todos.map(item => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      </div>
    );
  }
}
```

There is an important reading experience in these lines:

```ts
this.$$modelTodo.findAll();
this.$$modelTodo.create();
```

You can see immediately that:

- these capabilities come from `ModelTodo`;
- the page depends on the todo model;
- query and write logic are not scattered throughout the page;
- there is a specific object to inspect when you need to understand caching, requests, or invalidation.

That is the value of dependency injection. It is not merely a way to write fewer imports. It makes dependencies between objects explicit, stable, and traceable.

---

## Pinia, provide/inject, and composables: not three kinds of “state management,” but fragments of one question

Common ways to organize state in the Vue ecosystem include:

- component-local `ref` / `reactive`;
- composables;
- Pinia;
- `provide/inject`;
- data-fetching and caching libraries.

They are all valuable, and each fits particular situations.

For beginners, though, they can create a recurring question:

> When should I use a composable? When should I use Pinia? When should I use `provide/inject`? When should the state remain in the component?

Zova offers a different starting point: do not begin with a tool name. Begin with **state ownership and lifecycle**.

| Question                                                               | A more suitable owner |
| ---------------------------------------------------------------------- | --------------------- |
| Short-lived input, toggle, or interaction state on the current page    | Page Controller       |
| State and behavior of a reusable UI unit                               | Component Controller  |
| Business data, queries, caches, or persisted state reused across pages | Model                 |
| Reusable business or foundational capability                           | Service Bean          |
| A collaboration object local to a component tree                       | `ctx`-scoped Bean     |
| An object that belongs to an application or SSR request                | `app`-scoped Bean     |
| System-wide, long-lived object                                         | `sys`-scoped Bean     |

Concepts that may otherwise be spread across several tools can gradually become one mental model:

> **Do not first decide which library should hold state. First decide which object owns it, how long it should live, and who depends on it.**

That shifts the architectural discussion from technology selection back toward business modeling.

---

## “Object-oriented” does not mean writing Java-style frontend code

When developers see `class`, `@Controller()`, `@Model()`, and `@Use()`, a common concern is:

> Will this become over-engineering?  
> Will it turn into layers of traditional Java-style wrappers?

The answer depends on how the system is used.

Zova does not require you to split everything into many classes from the beginning. A small page can be just one Controller:

```tsx
@Controller()
export class ControllerPageProfile extends BeanControllerPageBase {
  nickname = '';

  save() {
    // Save the nickname.
  }

  protected render() {
    return (
      <input
        value={this.nickname}
        onInput={event => {
          this.nickname = event.target.value;
        }}
      />
    );
  }
}
```

Only when responsibilities genuinely grow do you split them gradually:

1. **The page becomes complex**: extract a Render Bean.
2. **Styling becomes complex**: extract a Style Bean.
3. **Business behavior becomes reusable**: extract a Service Bean.
4. **Data needs caching, reuse, persistence, or SSR coordination**: extract a Model.

This is not object orientation for its own sake. It lets code grow with the business.

A good architecture should not require developers to design a perfect class diagram on day one. It should let them start simply and provide a clear evolution path when complexity actually arrives.

---

## TSX brings rendering and behavior closer together

Zova uses TSX as its main rendering expression.

That does not mean Vue templates are bad. Templates are friendly for simple pages and have a mature ecosystem.

But as business UI becomes more complex, TSX has a practical advantage: **rendering logic and TypeScript logic are expressed in the same language.**

Conditions, loops, local variables, event handling, and component composition can all live naturally in the same code:

```tsx
protected render() {
  const query = this.$$modelTodo.findAll();

  if (query.isPending) {
    return <div>Loading…</div>;
  }

  if (query.isError) {
    return <div>Loading failed. Please try again later.</div>;
  }

  return (
    <ul>
      {query.data?.map(todo => (
        <li key={todo.id}>
          <span>{todo.title}</span>
          <button onClick={() => this.removeTodo(todo.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

Here:

- it is clear which Model provides the data;
- it is clear which behavior the click invokes;
- it is clear how the page branches on state;
- it is clear how TypeScript types flow through the code.

For developers accustomed to complex business logic and rich component composition, this continuity of logic, state, and rendering within one object can provide a strong sense of control.

---

## Zova does not reject Vue; it adds a more complete application language on top of it

On the surface, Zova may look like Vue 3 plus classes, decorators, an IoC container, and Models.

A more accurate description is that it offers a more unified language for frontend application architecture:

- **Controllers** express interactive responsibilities of pages and components.
- **Beans** express composable, injectable capabilities.
- **Models** express data state with lifecycle, caching, and invalidation policy.
- **IoC** expresses object creation, scope, and dependencies.
- **Vue 3 reactivity** keeps state changes and UI updates naturally connected.
- **TSX** lets rendering and logic collaborate in one language.

So Zova is not saying:

> “Vue 3's Composition API is not good enough.”

It is closer to saying:

> “When a project grows from a component into a business application, we need more than composable functions. We need clear object boundaries, dependencies, and state ownership.”

---

## Closing: from “how do we manage state?” to “who owns this state?”

Frontend development has spent years discussing state management.

But sometimes we start with the wrong question.

We often ask:

- Should we use Pinia or composables?
- Where should global state live?
- How do we avoid prop drilling?
- How do we cache data fetching automatically?

Those questions matter. But behind them sits one more fundamental set of questions:

> Who owns this state?  
> Who is allowed to change it?  
> Who depends on it?  
> How long should it live?  
> When it changes, who is responsible for preserving consistency?

When those questions have clear answers, the choice of tools often becomes much easier.

That is the experience Cabloy/Zova aims to provide:

> Do not let business code become a collection of variables that have been destructured, moved around, and assembled.  
> Put state back into objects, behavior back into responsibilities, and dependencies back into structure.

If you already know Vue 3, try writing one small Zova feature: one Controller, one Model, and a few TSX expressions. You may find that Vue 3 reactivity still feels familiar—but organizing a complex business feature no longer feels like untangling a knot.

---

## Further reading

- [Zova Frontend Foundation](https://cabloy.com/frontend/foundation)
- [Reading Zova for Vue Developers](https://cabloy.com/frontend/reading-zova-for-vue-developers)
- [Zova vs Vue 3 Comparison](https://cabloy.com/frontend/zova-vs-vue3-comparison)
- [IoC and Beans](https://cabloy.com/frontend/ioc-and-beans)
- [State Architecture for Vue Developers](https://cabloy.com/frontend/state-architecture-for-vue-developers)
- [Model Architecture](https://cabloy.com/frontend/model-architecture)
