# 创建第一个页面

下面来创建第一个页面，演示最基本的状态管理。

## 新建模块

首先，创建一个模块，名称为`demo-student`。有两种创建模块的方式：

### 1. Cli 命令

```bash
$ zova :create:module demo-student --suite=
```

### 2. 菜单命令

::: tip
右键菜单 - [项目路径/src/module]: `Zova Create/Module`
:::

依据提示输入模块的名称`demo-student`，VSCode 插件会自动创建模块的代码骨架。

::: warning
请确认已经安装了 Vscode 插件：[Zova - Official](https://marketplace.visualstudio.com/items?itemName=cabloy.zova-vscode)
:::

## 新建页面

然后，使用 Zova 内置的代码生成器来创建页面的代码骨架。同样有两种方式：

### 1. Cli命令

```bash
$ zova :create:page counter --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Zova Create/Page`
:::

依据提示输入页面名称`counter`，VSCode 插件会自动创建页面的代码骨架。

## 页面路径

系统自动分配页面路径`/demo/student/counter`，完整 URL 为[http://localhost:9000/demo/student/counter](http://localhost:9000/demo/student/counter)

## 第一段代码(状态管理)

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
