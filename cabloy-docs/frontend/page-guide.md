# Page Guide

This guide explains how pages work in Zova within the Cabloy monorepo.

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

Zova automatically derives the page path from the module and page names.

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

Zova pages can also attach style through built-in CSS-in-JS support.

For choosing among local `$style`, dedicated style beans, shared/global styles, and token/theme surfaces, also see [CSS-in-JS Guide](/frontend/css-in-js-guide).

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

## Progressive code splitting

As page complexity grows, Zova supports progressively splitting page logic into more files instead of forcing everything to remain in one controller file forever.

A useful progression is:

- **single-file** page structure for early-stage pages
- **three-file** structure with controller, render, and style split out
- **more-file** structure when additional render, style, or service beans are needed

This matters because Zova encourages pages to start simple and then evolve into richer structures only when the business complexity justifies it.

### Single-file to three-file

A typical first step is keeping the page controller responsible for state while moving render and style into dedicated beans.

#### Create the first render bean

```bash
npm run zova :refactor:firstRender page/counter -- --module=demo-student
```

Representative render bean shape:

```typescript
@Render()
class RenderPageCounter extends BeanRenderBase {
  public render() {
    return (
      <div class={this.cTextCenter}>
        <div>count: {this.count}</div>
        <button onClick={() => this.increment()}>Increment</button>
        <button onClick={() => this.decrement()}>Decrement</button>
      </div>
    );
  }
}
```

#### Create the first style bean

```bash
npm run zova :refactor:firstStyle page/counter -- --module=demo-student
```

Representative style bean shape:

```typescript
@Style()
class StylePageCounter extends BeanStyleBase {
  cTextCenter: string;

  protected async __init__() {
    this.cTextCenter = this.$style({
      textAlign: 'center',
    });
  }
}
```

### More-file growth

When the page continues to grow, you can keep splitting responsibilities instead of forcing one large controller or render bean to absorb everything.

Representative refactors include:

- additional render beans for larger UI regions
- additional style beans for more isolated styling concerns
- dedicated service beans when business state and behavior should move out of the page controller

#### Create another render bean

```bash
npm run zova :refactor:anotherRender page/counter another -- --module=demo-student
```

#### Create another style bean

```bash
npm run zova :refactor:anotherStyle page/counter another -- --module=demo-student
```

#### Create a service bean for state management

```bash
npm run zova :create:bean service page/counter/counter -- --module=demo-student
```

Representative service bean shape:

```typescript
@Service()
class ServiceCounter extends BeanBase {
  count: number = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }
}
```

These refactors are supported by Zova CLI commands rather than requiring a fully manual restructuring from scratch.

## Practical implications for page implementation

When generating or editing a Zova page, preserve the page/controller mental model instead of rewriting the code into a generic Vue single-file-component pattern.

A better default is:

1. use the Zova page generator
2. keep state, render, and style inside the intended controller-oriented structure
3. reuse existing routing and styling conventions
4. verify whether the active edition changes page-level UI assumptions
