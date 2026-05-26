# Composables

Zova 推荐使用[bean](../essentials/ioc/introduction.md)来封装和复用逻辑。Vue 生态存在大量好用的 composables，比如：[VueUse](https://vueuse.org/)，可以直接在 Zova 中使用。

下面以`鼠标跟踪器`为例，演示如何使用 Composables。

## 1. 创建Composable

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

## 2. 使用Composable

以 demo-basic 模块现有的页面组件为例：

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
