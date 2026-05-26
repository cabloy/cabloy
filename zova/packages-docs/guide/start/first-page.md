# Create the first Page

Next, let's create our first Page to demonstrate the most basic state management.

## Creating a New Module

First, create a module named `demo-student`. There are two ways to create a module:

### 1. Cli Command

```bash
$ zova :create:module demo-student --suite=
```

### 2. Menu Command

::: tip
Context menu - [Project Path/src/module]: `Zova Create/Module`
:::

Follow the prompts and enter the module name `demo-student`. The VSCode plugin will automatically create the module code skeleton.

::: warning
Please make sure you have installed the VSCode extension: [Zova - Official](https://marketplace.visualstudio.com/items?itemName=cabloy.zova-vscode)
:::

## Create Page

Next, we'll use Zova's built-in code generator to create the Page code skeleton. There are also two methods:

### 1. Cli Command

```bash
$ zova :create:page counter --module=demo-student
```

### 2. Menu Command

::: tip
Context menu - [Module Path]: `Zova Create/Page`
:::

Enter the page name `counter` as prompted. The VSCode extension will automatically create the page code skeleton.

## Page Path

The system automatically assigns the page path `/demo/student/counter`, and the full URL is [http://localhost:9000/demo/student/counter](http://localhost:9000/demo/student/counter)

## First Code for State Management

```typescript
class ControllerPageCounter {
  count: number = 0;

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

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
