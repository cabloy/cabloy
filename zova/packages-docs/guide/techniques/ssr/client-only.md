# ClientOnly

If some components only support client-side rendering, you can wrap them with `ClientOnly`

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
