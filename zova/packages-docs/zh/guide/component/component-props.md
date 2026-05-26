# 组件Props

Zova 中的组件不再区分`Props`、`Emits` 和 `Slots`，而是只需提供`Props`，从而提供更加一致、简洁的编程范式，而且对 Typescript 编程更加友好。

## 添加Props代码骨架

为组件`card`添加 Props 代码骨架。

### 1. Cli命令

```bash
$ zova :refactor:componentProps card --module=demo-student
```

### 2. 菜单命令

::: tip
右键菜单 - [模块路径/src/component/componentName]: `Zova Refactor/Add Component Props`
:::

## 添加Props

```typescript
import { ISlot } from 'zova';

export interface ControllerCardProps {
  content?: string;
  onReset?: () => void;
  slotHeader?: ISlot;
  slotDefault?: (name: string) => VNode;
}
```

## Props缺省值

可以为 Props 设置缺省值：

```typescript
class ControllerCard {
  static $propsDefault = {
    content: 'no content',
  };
}
```

### 使用Props

Zova 在`controller` bean 的基类中注入了`$props`对象，从而可以直接通过`this.$props`获取 props，并且支持类型提示。

```diff
class ControllerCard {
  render() {
    return (
      <div>
+       <div>{this.$props.slotHeader?.()}</div>
+       <div>{this.$slotDefault?.('tom')}</div>
+       <div>{this.$props.content}</div>
        <button
          onClick={() => {
+           this.$props.onReset?.();
          }}
        >
          Reset
        </button>
      </div>
    );
  }
}
```

### 传入Props

在向子组件传入 Props 时，也支持类型提示。

```diff
import { ZCard } from 'zova-module-demo-student';

class ControllerOther {
  render() {
    return (
      <div>
        <ZCard
+         content="custom content"
+         onReset={() => {
+           console.log('onReset is invoked');
+         }}
+         slotHeader={() => {
+           return <div>custom header</div>;
+         }}
+         slotDefault={name => {
+           return <div>{name}</div>;
+         }}
        ></ZCard>
      </div>
    );
  }
}
```
