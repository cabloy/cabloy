# Page

## Code Style

Zova delivers an intuitive, elegant, and powerful code style by combining the core design strengths of Vue3, React, and Angular:

- `Vue3`: intuitive reactive state
- `React`: flexible TSX rendering
- `Angular`: powerful IOC container

## Creating a Page

Taking the module `demo-student` as an example, create a page `counter`

### 1. CLI Command

```bash
$ zova :create:page counter --module=demo-student
```

### 2. Menu Command

::: tip
Context Menu - [Module Path]: `Zova Create/Page`
:::

Enter the page name `counter` as prompted, and the VSCode plugin will automatically create the code skeleton for the page.

## Page Path

The system automatically assigns the page path `/demo/student/counter`, with the full URL at [http://localhost:9000/demo/student/counter](http://localhost:9000/demo/student/counter)

## Controller Definition

```typescript
@Controller()
class ControllerPageCounter extends BeanControllerPageBase {
  protected render() {
    return null;
  }
}
```

## Adding State

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

## Adding Render

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

## Adding Style

Zova provides out-of-the-box css-in-js capabilities.

```typescript
class ControllerPageCounter {
  cTextCenter: string;

  protected async __init__() {
    this.cTextCenter = this.$style({
      textAlign: 'center',
    });
  }

  protected render() {
    return (
      <div class={this.cTextCenter}></div>
    );
  }
}
```
