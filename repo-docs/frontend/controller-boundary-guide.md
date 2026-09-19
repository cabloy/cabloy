# Controller Load Boundary Guide

A Zova Controller-load boundary renders a loading or error fallback while a page or component controller host initializes. It is available in both **Cabloy Basic** and **Cabloy Start**.

The runtime contract is shared by the editions. Their default fallback presentation is deliberately different: Basic uses DaisyUI + Tailwind CSS, while Start uses Vuetify. See [Cabloy Editions](/editions/overview) before copying UI-specific renderer code between editions.

## What this boundary owns

A generated Zova page or component host loads these beans in order:

```text
Controller → optional Style bean → optional Render bean
```

While that chain is pending, the host can render a loading fallback. If an initialization error is not handled by the application error path, the host can render an error fallback instead.

This is a **Controller-load** boundary, not a general-purpose Vue error boundary. In particular, it does not automatically turn these failures into its fallback UI:

- an exception from ordinary `render()` work after the Controller has loaded;
- an event-handler or action failure;
- a query, mutation, or data-fetch failure that occurs after initialization;
- browser-only work that should have been deferred from SSR.

Choose the owner that matches the concern: use [Behavior Guide](/frontend/behavior-guide) for composable render-time interception, [$useStateData Best Practices](/frontend/use-state-data-best-practices) for model-owned async state, and [SSR ClientOnly](/frontend/ssr-client-only) for browser-only rendering. Read [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers) first if the Controller / Render / Style bean model is unfamiliar.

## Configure one Controller host

Declare boundary options on the page or component Controller:

```ts
import { BeanControllerBase, IComponentOptions } from 'zova';
import { Controller } from 'zova-module-a-bean';

@Controller()
export class ControllerReport extends BeanControllerBase {
  static $componentOptions: IComponentOptions = {
    boundary: {
      loading: { delay: 500 },
      renderMode: 'inline',
      retry: true,
    },
  };
}
```

The options have the following roles:

| Option                   | Meaning                                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| `boundary.loading.delay` | Milliseconds to wait before exposing the loading fallback for this Controller host.               |
| `boundary.renderMode`    | Fallback structure hint: `'block'` or `'inline'`.                                                 |
| `boundary.retry`         | Opts this Controller host into a retry action after an error fallback. It is disabled by default. |

### Resolution and defaults

| Concern            | Controller option                        | Global application configuration                              | Runtime behavior                                                                                      |
| ------------------ | ---------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Loading delay      | `boundary.loading.delay`                 | `config.boundary.loading?.delay`                              | The Controller value wins. An invalid, zero, or negative resolved value displays loading immediately. |
| Render mode        | `boundary.renderMode`                    | —                                                             | Defaults to `'block'`; only the explicit value `'inline'` selects inline mode.                        |
| Retry availability | `boundary.retry`                         | —                                                             | Disabled by default; see [Retry safely](#retry-safely).                                               |
| Loading renderer   | `renderLoading(renderMode)`              | `config.boundary.renderLoading(ctx, renderMode)`              | Controller renderer wins, then application renderer, then no loading VNode.                           |
| Error renderer     | `renderError(error, renderMode, retry?)` | `config.boundary.renderError(ctx, error, renderMode, retry?)` | Controller renderer wins, then application renderer, then normalized error text.                      |

`renderMode` and `retry` are Controller-level options. They are not global `config.boundary` switches.

## Choose block or inline structure

Use the default `block` mode when the fallback is allowed to own a block-level region. Use `inline` when the fallback must remain valid phrasing content, for example inside a paragraph:

```tsx
<p>
  Import status: <ZImportStatus />
</p>
```

```ts
static $componentOptions: IComponentOptions = {
  boundary: {
    renderMode: 'inline',
  },
};
```

`inline` is an HTML-structure requirement, not merely a visual choice. An application renderer receives the selected mode and must preserve suitable markup: current Basic and Start renderers use a `span` host for inline fallback output. Do not use a block-oriented renderer that inserts a `div` into phrasing-only content.

## Provide application defaults

Application configuration supplies the shared renderer contract:

```ts
import type { ZovaContext } from 'zova';
import type { VNodeChild } from 'vue';

config.boundary = {
  loading: {
    delay: 500,
  },
  renderLoading(ctx: ZovaContext, renderMode: 'block' | 'inline'): VNodeChild {
    return null;
  },
  renderError(
    ctx: ZovaContext,
    error: unknown,
    renderMode: 'block' | 'inline',
    retry?: () => Promise<void>,
  ): VNodeChild {
    return null;
  },
};
```

The renderer decides the actual VNode, accessibility semantics, localization, and presentation. Keep customer-facing error text safe: an error fallback is not a substitute for error reporting, monitoring, or a deliberate disclosure policy.

The `retry` callback is optional. It is absent when retry is disabled and remains unavailable until an enabled failed boundary has completed client hydration. A global renderer should render its retry control only when this callback is present.

## Override rendering for one Controller

A Controller can own its boundary presentation without changing application defaults:

```tsx
import type { VNodeChild } from 'vue';
import type { TypeComponentBoundaryRenderMode } from 'zova';

protected renderLoading(renderMode: TypeComponentBoundaryRenderMode): VNodeChild {
  return <span role="status">Loading report ({renderMode})</span>;
}

protected renderError(
  error: unknown,
  renderMode: TypeComponentBoundaryRenderMode,
  retry?: () => Promise<void>,
): VNodeChild {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <span role="alert">
      Report failed in {renderMode} mode: {message}
      {retry && <button onClick={() => void retry()}>Retry</button>}
    </span>
  );
}
```

A Controller renderer always takes precedence over the global renderer. Once it provides `renderError`, it owns the whole fallback output; Zova does not append the application retry button around it.

The trailing callback was added compatibly. Existing error renderers that accept only `error`, or `error, renderMode`, remain valid. Add the optional third argument only when the Controller needs to surface retry itself.

## Retry safely

`retry: true` is intentionally opt-in. A retry does **not** call `__init__()` again on the failed Controller instance. Instead, Zova clears the prior load attempt, disposes the beans it owns, and creates a fresh Controller → Style → Render graph.

Enable retry only when every relevant initialization effect is safe to perform again. Typical safe cases include a local read whose repeated execution is harmless, or a request with a defined idempotency/recovery contract. Do not enable it for initialization that can repeat a non-idempotent external effect without such a contract.

The runtime also protects the interaction boundary:

- only one retry attempt is active at a time; repeated clicks share that attempt;
- retry is available only when `retry: true`, the host is still active, and the current state is an error;
- it becomes interactive after client hydration, not in server HTML;
- a successful retry restores the fresh Controller graph and normal ready rendering.

## Error handling and SSR

### Error routing

A Controller-load failure is reported through the application error handler before Zova decides to show a local fallback. An application handler can mark the load error as handled; in that case, the Controller-load error fallback is not rendered.

Treat a visible fallback and operational reporting as separate responsibilities. The default Basic renderer displays an error message, but production applications should decide which message is appropriate for the current audience and preserve diagnostic information through their normal error-handling path.

### SSR and hydration

For SSR, the sequence is designed to keep server HTML and the browser's first hydration output equivalent:

1. server prefetch runs the Controller-load chain;
2. an unhandled server fallback is captured as deferred SSR state;
3. the browser replays that fallback during its initial hydration render, even if a new browser attempt could now succeed;
4. after hydration, an enabled retry control can start a fresh client-side load graph.

Do not render a retry affordance unconditionally in server output. The optional callback is the signal that it is interactive and available. Also distinguish a Controller-load fallback from SSR-wide handled control flow such as redirects or authentication handling; those can be handled without selecting this local fallback.

For the larger render and handoff model, read [SSR Architecture Overview](/frontend/ssr-architecture-overview) and use [SSR Review Checklist](/frontend/ssr-review-checklist) when changing SSR-sensitive UI.

## Shared contract, edition-specific defaults

The Controller options, renderer signatures, renderer precedence, retry rules, and SSR behavior above are shared Zova behavior. The default application renderers are edition-specific implementation choices.

| Surface                 | Cabloy Basic                                                      | Cabloy Start                                                              |
| ----------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Global loading delay    | `500ms`                                                           | `500ms`                                                                   |
| Block loading fallback  | Centered DaisyUI/Tailwind spinner in a `div` with `role="status"` | Centered Vuetify `VProgressCircular` in a flex `div` with `role="status"` |
| Inline loading fallback | DaisyUI/Tailwind spinner in a `span` host                         | `VProgressCircular` in a `span` host                                      |
| Block error fallback    | DaisyUI `alert alert-error` presentation                          | Tonal Vuetify `VAlert`                                                    |
| Inline error fallback   | Inline error `span` presentation                                  | Inline Vuetify-oriented error and action presentation in a `span` host    |
| Retry affordance        | DaisyUI ghost button                                              | Small text-variant `VBtn`                                                 |

DaisyUI classes, Vuetify component names, spacing, and colors are not part of the shared Zova API. Keep shared Controller code UI-neutral where possible, then configure edition-local global renderers for the desired visual system.

## Validate the behavior in Cabloy Basic

Cabloy Basic includes a manual demonstration at:

```text
/demo/basic/controllerBoundary
```

Its source is in `zova/src/suite/a-demo/modules/demo-basic/src/page/controllerBoundary/controller.tsx`, with separate normal, inline, and Controller-override probes. The focused browser specification is `repo-e2e/specs/controller-boundary.spec.ts`.

Together, those probes verify that:

- fast initialization finishes without exposing delayed loading;
- slow initialization exposes loading, then ready content;
- an error fallback can expose and recover through retry;
- inline fallback markup remains valid in phrasing content;
- Controller overrides receive the render mode and retain legacy error-renderer compatibility;
- a server-selected fallback survives as the initial hydration result, then can recover through a post-hydration retry.

The demo and this focused E2E specification are Basic-specific evidence. Cabloy Start shares the Controller-load contract but uses its own Vuetify default presentation and should validate its own controller hosts accordingly.

## Implementation checklist

Before enabling a Controller-load boundary, check that:

- [ ] the concern is initialization of a Controller, Style, or Render bean rather than later render/action/query work;
- [ ] `inline` is selected whenever the fallback sits in phrasing-only content;
- [ ] the application renderer handles both `block` and `inline` output safely and accessibly;
- [ ] retry is enabled only for a replay-safe fresh load graph;
- [ ] customer-facing error text is safe and operational details remain in the normal error path;
- [ ] SSR fallback output remains compatible with hydration and relies on the optional retry callback;
- [ ] UI-specific fallback code matches the active edition.

Read [Component Guide](/frontend/component-guide) for the broader component model and [Cabloy Editions](/editions/overview) when choosing Basic or Start UI conventions.
