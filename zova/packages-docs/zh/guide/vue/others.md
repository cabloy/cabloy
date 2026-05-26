# Others

## $computed

为了保持类型一致，需要使用`$computed`来创建计算属性。参数与 computed 方法保持一致，参见：[计算属性](https://cn.vuejs.org/guide/essentials/computed.html)

```typescript
export class Counter {
  count: number = 0;
  count2: string;

  protected async __init__() {
    this.count2 = this.$computed(() => {
      return `=== ${this.count} ===`;
    });
  }
}
```

## $watch/$watchEffect

在 Bean Class 的`__init__`的方法中调用`watch/watchEffect`。更详细用法，参见：[侦听器](https://cn.vuejs.org/guide/essentials/watchers.html)

在`__init__`方法中创建的侦听器，会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止。因此，在大多数情况下，你无需关心怎么停止一个侦听器。

```typescript
export class Counter {
  count: number = 0;

  protected async __init__() {
    this.$watch(
      () => this.count,
      () => {
        console.log('changed: ', this.count);
      },
    );
    this.$watchEffect(() => {
      // do something
    });
  }
}
```

## $controllerMounted

由于与组件绑定的 Bean 容器是异步加载的，所以，如果要在 Bean 容器加载完毕后执行一些初始化逻辑，需要响应`$controllerMounted`事件。

```typescript
export class ControllerPageComponent {
  inputRef: HTMLInputElement | null;

  protected async __init__() {
    this.$controllerMounted(() => {
      this.inputRef?.focus();
    });
  }
}
```

## markRaw

可以使用 markRaw 方法将某个对象标记为`非响应式`

```typescript
import { markRaw } from 'vue';

export class ControllerPageComponent {
  user = markRaw({
    name: 'tom',
    age: 18,
  });
}
```
