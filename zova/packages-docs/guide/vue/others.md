# Others

## $computed

To keep the type consistent, you need to use `$computed` to create a computed property. The parameters are consistent with the `computed` method, see: [Computed Properties](https://vuejs.org/guide/essentials/computed.html)

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

Call `$watch/$watchEffect` in the `__init__` method of the Bean Class. For more detailed usage, see: [Watchers](https://vuejs.org/guide/essentials/watchers.html)

Watchers declared synchronously inside `__init__` are bound to the owner component instance, and will be automatically stopped when the owner component is unmounted. In most cases, you don't need to worry about stopping the watcher yourself.

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

Since the Bean container bound to the component is loaded asynchronously, if you want to execute some initialization logic after the Bean container is loaded, you need to listen to the `$controllerMounted` event.

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

You can use the `markRaw` method to mark an object as `non-reactive`

```typescript
import { markRaw } from 'vue';

export class ControllerPageComponent {
  user = markRaw({
    name: 'tom',
    age: 18,
  });
}
```
