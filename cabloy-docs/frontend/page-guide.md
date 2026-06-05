# Page Guide

This page migrates the highest-value ideas from the legacy Zova page introduction.

## What a page means in Zova

A Zova page is not just a route target with a template attached.

The page model is built around a controller-oriented structure that combines:

- reactive state
- TSX-based render logic
- IOC-friendly composition
- CSS-in-JS styling

That combination is one of the clearest examples of Zova’s overall design philosophy.

## Create a page

Example: create a page named `counter` in module `demo-student`.

```bash
npm run zova :create:page counter -- --module=demo-student
```

## Route path generation

The legacy docs highlighted that Zova automatically derives the page path from the module and page names.

Representative example:

- module: `demo-student`
- page: `counter`
- generated page path: `/demo/student/counter`

This matters because the framework already has conventions for route structure. AI should reuse those conventions rather than inventing unrelated paths.

## Controller definition

Representative page controller shape:

```typescript
@Controller()
class ControllerPageCounter extends BeanControllerPageBase {
  protected render() {
    return null;
  }
}
```

## Add state

Representative reactive state pattern:

```typescript
class ControllerPageCounter {
  count: number = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }
}
```

## Add render logic

Representative TSX render pattern:

```typescript
class ControllerPageCounter {
  protected render() {
    return (
      <div>
        <div>count: {this.count}</div>
        <button onClick={() => this.increment()}>Increment</button>
        <button onClick={() => this.decrement()}>Decrement</button>
      </div>
    );
  }
}
```

## Add style

The legacy docs also showed that Zova pages can attach style through built-in CSS-in-JS support.

Representative pattern:

```typescript
class ControllerPageCounter {
  cTextCenter: string;

  protected async __init__() {
    this.cTextCenter = this.$style({
      textAlign: 'center',
    });
  }
}
```

## Why this matters for AI workflows

When AI generates or edits a Zova page, it should preserve the page/controller mental model instead of rewriting the code into a generic Vue single-file-component pattern.

A better default is:

1. use the Zova page generator
2. keep state, render, and style inside the intended controller-oriented structure
3. reuse existing routing and styling conventions
4. verify whether the active edition changes page-level UI assumptions
