# 页面

## 代码风格

Zova 提供更直观、更优雅、更强大的代码风格，融合 Vue3、React、Angular 的核心设计：

- `Vue3`: 直观响应式
- `React`: 灵活 TSX 渲染
- `Angular`: 强大 IOC 容器

## 创建页面

以模块`demo-student`为例，创建一个页面`counter`

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

## Controller定义

```typescript
@Controller()
class ControllerPageCounter extends BeanControllerPageBase {
  protected render() {
    return null;
  }
}
```

## 添加状态

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

## 添加Render

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

## 添加Style

Zova 提供了开箱即用的 css-in-js 能力。

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
