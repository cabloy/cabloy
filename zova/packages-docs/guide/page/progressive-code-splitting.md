# Progressive Code Splitting

Zova provides a flexible file structure that allows for progressive code splitting based on the complexity of the business, thereby keeping the code always simple and elegant, making it easier for continuous iteration and maintenance of the code.

## Three-level iteration

Progressive splitting of the page code can refer to the following three-level iteration:

| Name        | Description                                       |
| ----------- | ------------------------------------------------- |
| Single-File | Controller(1)                                     |
| Three-File  | Controller(1) + Render(1) + Style(1)              |
| More-File   | Controller(1) + Render(n) + Style(n) + Service(n) |

## Single-File

In the initial stage of business development, there is relatively little code, and a single file can be used.

```typescript
class ControllerPageCounter {
  count: number = 0;
  cTextCenter: string;

  protected async __init__() {
    this.cTextCenter = this.$style({
      textAlign: 'center',
    });
  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

  protected render() {
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

## Three-File

When the code starts to grow, you can separate the Render and Style.

### Create first Render Bean

First, separate out the Render.

### 1. CLI command

```bash
$ zova :refactor:firstRender page/counter --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path/src/page/pageName]: `Zova Refactor/Create First Render Bean`
:::

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

### Create first Style Bean

Then separate out the Style.

### 1. CLI command

```bash
$ zova :refactor:firstStyle page/counter --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path/src/page/pageName]: `Zova Refactor/Create First Style Bean`
:::

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

## More-File

As the code continues to grow, you can continue to adjust the file structure, create more Render files and Style files, and also create multiple Service files to separate state management.

### Create Another Render Bean

### 1. CLI command

```bash
$ zova :refactor:anotherRender page/counter another --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path/src/page/pageName]: `Zova Refactor/Create Another Render Bean`
:::

### Create Another Style Bean

### 1. CLI command

```bash
$ zova :refactor:anotherStyle page/counter another --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path/src/page/pageName]: `Zova Refactor/Create Another Style Bean`
:::

### Create Another Service Bean

Create a Service `counter` to separate state management.

### 1. CLI command

```bash
$ zova :create:bean service page/counter/counter --module=demo-student
```

### 2. Menu command

::: tip
Context Menu - [Module Path/src/page/pageName]: `Zova Create/Service`
:::

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
