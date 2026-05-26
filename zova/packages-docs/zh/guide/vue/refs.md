# Refs

## Template Ref {#template-ref}

如果是 Html Element 或者常规的 Vue 组件（没有使用 ioc 容器），那么就可以使用`Template Ref`引用组件实例。

### 1. Html Element

以 input element 为例：

```typescript
export class ControllerPageComponent {
  inputRef: HTMLInputElement | null;

  protected async __init__() {
    this.$onMounted(() => {
      this.inputRef?.focus();
    });
  }
}
```

- 声明变量 inputRef
- 响应 onMounted 事件，执行 focus 方法

```typescript
export class RenderComponent {
  render() {
    return (
      <div>
        <input
          ref={ref => {
            this.inputRef = ref as any;
          }}
        />
      </div>
    );
  }
}
```

- 通过回调函数接收 ref 参数，赋值给 inputRef

### 2. Vue 组件（没有使用 ioc 容器）

以 quasar 的 QBtn 组件为例：

```typescript
export class ControllerPageComponent {
  btnRef: InstanceType<typeof QBtn> | null;

  protected async __init__() {
    this.$onMounted(() => {
      this.btnRef?.click();
    });
  }
}
```

- 声明变量 btnRef
- 响应 onMounted 事件，执行 click 方法

```typescript
export class RenderComponent {
  render() {
    return (
      <div>
        <input
          ref={ref => {
            this.btnRef = ref as any;
          }}
        />
      </div>
    );
  }
}
```

- 通过回调函数接收 ref 参数，赋值给 btnRef

## Controller Ref {#controller-ref}

对于使用了 ioc 容器的 Vue 组件，不能使用`Template Ref`，而是直接引用 Vue 组件对应的`controller bean`实例。

### 1. 声明变量

先在父组件的`controller.ts`中声明变量：

```typescript
import type { ControllerCard } from '../../.metadata/index.js';

export class ControllerPageComponent {
  cardRef: ControllerCard;
}
```

### 2. controllerRef

然后设置子组件的`controllerRef`属性获取到`controller bean`实例的引用值：

```typescript
import { ZCard } from '../../.metadata/index.jsx';

export class RenderComponent {
  render() {
    return (
      <div>
        <ZCard
          controllerRef={ref => {
            this.cardRef = ref;
          }}
        ></ZCard>
      </div>
    );
  }
}
```
