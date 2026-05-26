# Event事件

VonaJS 提供了事件机制，由`事件`和`事件监听器`组成。

一个`事件`可以有多个`事件监听器`，这些`事件监听器`在执行时采用`洋葱模型`

## 创建Event

比如，在模块 demo-student 中创建一个 Event: `echo`，触发事件时传入事件参数`Hello World`

### 1. Cli命令

```bash
$ vona :create:bean event echo --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径]: `Vona Bean/Event`
:::

## Event定义

```typescript
export type TypeEventEchoData = string;

export type TypeEventEchoResult = string | undefined;

@Event()
export class EventEcho extends BeanEventBase<TypeEventEchoData, TypeEventEchoResult> {}
```

- `TypeEventEchoData`: 定义参数类型
- `TypeEventEchoResult`: 定义结果类型

## 触发异步事件: emit

### 1. emit

触发事件时传入事件参数`Hello World`，并返回结果。

```diff
class ControllerStudent {
  @Web.get('test')
  async test() {
+   const result = await this.scope.event.echo.emit('Hello World');
    console.log(result);
  }
}
```

- `this.scope.event.echo`: 通过 Scope 对象获取`echo`事件实例

### 2. 缺省方法

在触发事件时可以提供缺省方法。

```diff
class ControllerStudent {
  @Web.get('test')
  async test() {
+   const result = await this.scope.event.echo.emit('Hello World', async data => {
+     return `default: ${data}`;
+   });
    console.log(result);
  }
}
```

- 缺省方法参数`data`：事件监听器在执行时可以修改事件参数，所以需要使用`data`参数，从而确保当前方法使用的是最新的事件参数

## 触发同步事件: emitSync

### 1. emitSync

触发事件时传入事件参数`Hello World`，并返回结果。

```diff
class ControllerStudent {
  @Web.get('test')
  async test() {
+   const result = this.scope.event.echo.emitSync('Hello World');
    console.log(result);
  }
}
```

- `this.scope.event.echo`: 通过 Scope 对象获取`echo`事件实例

### 2. 缺省方法

在触发事件时可以提供缺省方法。

```diff
class ControllerStudent {
  @Web.get('test')
  async test() {
+   const result = this.scope.event.echo.emitSync('Hello World', data => {
+     return `default: ${data}`;
+   });
    console.log(result);
  }
}
```

- 缺省方法参数`data`：事件监听器在执行时可以修改事件参数，所以需要使用`data`参数，从而确保当前方法使用的是最新的事件参数
