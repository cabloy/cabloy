# SSR ClientOnly

This guide explains when to use `ClientOnly` in Zova SSR within the Cabloy monorepo.

## When to use `ClientOnly`

Some components only make sense on the client side.

When that happens, wrap them in `ClientOnly` so SSR does not try to render behavior that depends on the browser-only environment.

## Representative pattern

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

## Why this matters

This is one of the simplest but most important SSR boundary tools.

It makes the server/client split explicit and keeps browser-only behavior from leaking into the server render path.

## Why this matters for AI workflows

When AI adds or edits SSR-sensitive UI, it should ask whether the component depends on client-only behavior such as browser APIs, client-only rendering expectations, or interactions that should not appear in the server render.

If yes, `ClientOnly` may be the right boundary.
