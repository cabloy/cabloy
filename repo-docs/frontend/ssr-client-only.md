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

## Routed dialogs are client-only

`this.$appModal.routedDialog(...)` is a runtime-enforced client-only API in the current Cabloy Basic implementation. Open it from a browser interaction in the normal case, and do not call it from a server-rendered execution path merely because the target page or its host supports SSR.

If lifecycle-driven opening is genuinely required, defer it to an explicit post-hydration client boundary. `ClientOnly` protects browser-only rendering; it does not make a server-side routed-dialog call valid. See [Routed Dialog Guide](/frontend/routed-dialog-guide) for the local-router, result, and hydration boundary.

## Implementation checks for client-only SSR boundaries

When adding or editing SSR-sensitive UI, ask whether the component depends on client-only behavior such as browser APIs, client-only rendering expectations, or interactions that should not appear in the server render.

If yes, `ClientOnly` may be the right boundary.
