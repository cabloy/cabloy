# ClientOnly

如果某些组件只支持客户端渲染，那么可以使用 ClientOnly 包裹起来。

`src/suite/a-home/modules/home-layout/src/component/layoutDefault/renderTabs.tsx`

```typescript
import { ClientOnly } from 'zova';

@Render()
export class RenderTabs {
  render() {
    return (
      <ClientOnly>
        <div role="tablist" class="tabs tabs-lifted">
          {domTabs}
        </div>
      </ClientOnly>
    );
  }
}
```
