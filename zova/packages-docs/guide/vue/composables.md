# Composables

Zova recommends using [bean](../essentials/ioc/introduction.md) to encapsulate and reuse logic. There are a lot of useful composables in the Vue ecosystem, such as [VueUse](https://vueuse.org/), which can be used directly in Zova.

The following takes `mouse tracker` as an example to demonstrate how to use Composables.

## 1. Create Composable

`mouse.ts`

```typescript
import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(event) {
    x.value = event.pageX;
    y.value = event.pageY;
  }

  onMounted(() => window.addEventListener('mousemove', update));
  onUnmounted(() => window.removeEventListener('mousemove', update));

  return { x, y };
}
```

## 2. Use Composable

Take the existing page component of module `demo-basic` as an example:

`controller.ts`

```typescript
import { ReturnTypeComposable } from 'zova';
import { useMouse } from './mouse.js';

@Controller()
export class ControllerSome {
  mouse: ReturnTypeComposable<typeof useMouse>;

  protected async __init__() {
    this.mouse = this.$composable(() => {
      return useMouse();
    });
  }

  protected render() {
    return (
      <div>
        Mouse position is at: {this.mouse.x}, {this.mouse.y}
      </div>
    );
  }
}
```
