---
title: SSR Hydration in Cabloy/Zova vs Next.js
titleEn: SSR Hydration in Zova vs Next.js
subtitle: Treating Next.js as a single thing is the most common mistake in this comparison. Pages Router and App Router are two different hydration paradigms — Zova is isomorphic to the former and heteromorphic to the latter.
summary: Starting from the full lifecycle of one request, this article dissects Zova's SSR rendering and hydration implementation step by step, then compares it with Next.js Pages Router's __NEXT_DATA__ model and App Router's streaming RSC model. It closes with three Zova-specific details — dual-channel state injection, controller-load error replay, and tolerant attribute mismatch handling — and what each paradigm trades away.
tags:
  - SSR
  - Hydration
  - Next.js
  - Cabloy
  - Zova
  - Vue
  - React
  - RSC
slug: zova-nextjs-ssr-hydration-differences-en
cover: ./cover-en-v1.png
date: 2026-11-18
---

# SSR Hydration in Cabloy/Zova vs Next.js

> Next.js has had two generations of SSR. Zova is isomorphic to the first and heteromorphic to the second. Mixing them up makes the comparison meaningless.

When people ask "how does Zova's SSR differ from Next.js", the question is hard to answer directly — because Next.js itself spans two entirely different hydration models:

- **Pages Router** (the `getServerSideProps` era): server calls `renderToString`, props are embedded into `__NEXT_DATA__`, client calls `hydrateRoot`. This is the same paradigm as Vue SSR.
- **App Router** (the RSC era): the server renders React Server Components and emits a Flight-protocol payload; only Client Components participate in hydration. This is something else entirely.

Zova belongs to the former, and it polishes that model further than Pages Router does. So the two comparisons worth making are:

1. Zova vs Pages Router — within one paradigm, where the engineering details differ;
2. Zova vs App Router — across paradigms, what each gives up.

Let's start from a real request.

---

## 1. One SSR Request in Zova

The entry point is `render()` in [ssrHandler.ts](https://github.com/cabloy/cabloy/blob/main/zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/service/ssrHandler.ts). The whole chain is synchronous and serial:

```ts
// 1. Resolve the route and determine the SSR profile
const route = await this.$$sysRouter.resolveRoute(pagePathFull, true, false);
const ssrProfile = resolveSsrProfile(route.meta.ssrProfile, this.sys.env.SSR_PROFILE);

// 2. Create the app; controllers run here and write into ssrContext
renderFn = await serverEntry(ssrContext);

// 3. Render the whole component tree synchronously
const runtimePageContent = await renderToString(renderFn, ssrContext);

// 4. Callback chain: dehydrate query cache, inject meta, dispose request-scoped contexts
onRenderedList.forEach(fn => fn(error));

// 5. Assemble the final HTML
const html = renderTemplate(ssrContext);
```

Three characteristics stand out.

**First, `renderToString` is synchronous.** Vue 3's official server-rendering APIs are `renderToString` and `renderToSimpleStream`; Zova uses the former. That means the server must finish rendering the entire tree before sending the first byte. No Suspense slicing, no progressive transfer.

**Second, data is produced by controllers, not fetched by components.** In Zova, page data comes from backend controller beans. During SSR, the controller runs in-process (or through `performAction` over internal HTTP) and writes into `ssrContext.state` and `ssrContext.stateDefer`. That is a different data path from `await fetch()` inside a Next.js component.

**Third, request-scoped state must be explicitly destroyed.** Zova's beans are singletons, and request-scoped things live on `ZovaContext`. So [ssr.ts](https://github.com/cabloy/cabloy/blob/main/zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssr.ts) keeps a `SymbolServerContexts` set, registers each request, and disposes them all after rendering:

```ts
private _serverContextsDispose() {
  for (const serverContext of this[SymbolServerContexts]) {
    if (serverContext.disposed) continue;
    if (serverContext.bean && serverContext.bean !== serverContext.app?.bean) {
      serverContext.bean.dispose();
    }
    serverContext.dispose();
  }
  serverContexts.clear();
}
```

This does not exist in Next.js — every App Router request runs in an isolated execution context, and Pages Router runs a fresh function per request. There is no cross-request singleton state to clean up.

---

## 2. How State Enters the HTML

Zova uses **two channels**, injected at different positions in the HTML.

From [ssrMetaStore.ts](https://github.com/cabloy/cabloy/blob/main/zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssrMetaStore.ts):

```ts
// Critical state → end of head
ctx.endingHeadTags += `<script id="ssr-state-init">window.__INITIAL_STATE__=${unevalPatch(ssrContext.state)}</script>`;

// Non-critical but bulky state → end of body
ctx.endingBodyTags += `<script id="ssr-state-defer-init">window.__INITIAL_STATE_DEFER__=${unevalPatch(ssrContext.stateDefer)}</script>`;
```

The two channels carry different things:

| Channel                   | Position    | Contents                                                                 | Characteristic             |
| ------------------------- | ----------- | ------------------------------------------------------------------------ | -------------------------- |
| `__INITIAL_STATE__`       | End of head | `pagePathFull`, `ssrProfile`, `ssrProfileOptions`, `compactHint`         | Needed at startup, small   |
| `__INITIAL_STATE_DEFER__` | End of body | TanStack Query `dehydrate` output, controller-load error snapshots, meta | Bulky, can be parsed later |

The reason is straightforward: inline scripts in the head block subsequent parsing. Putting tens of kilobytes of query cache at the end of the body lets the first paint start earlier.

Conversely, `pagePathFull` must arrive early — the client uses it to align the router with the server-rendered page. Otherwise it would render an empty route and then navigate, causing a flash.

Client-side restoration happens in [sys.ssrState.ts](https://github.com/cabloy/cabloy/blob/main/zova/src/suite-vendor/a-zova/modules/a-ssr/src/bean/sys.ssrState.ts):

```ts
protected async __init__() {
  if (process.env.CLIENT) {
    if (cast(window).__INITIAL_STATE__) {
      this[SymbolSSRState] = cast(window).__INITIAL_STATE__;
      delete cast(window).__INITIAL_STATE__;
      document.getElementById('ssr-state-init')?.remove();
    }
    // same for stateDefer
  }
}
```

It immediately deletes the global and removes the script node. Both steps ensure the state is consumed exactly once and memory is released.

---

## 3. How Hydration Is Detected and Finalized

Zova has no explicit `hydrateRoot` call. It relies on a DOM signal:

```ts
// ssr.ts initialize()
} else if (process.env.CLIENT && document.body.getAttribute('data-server-rendered') !== null) {
  this[SymbolIsRuntimeSsrPreHydration].value = true;
}
```

The `data-server-rendered` attribute is written into `<body>` by the server through the default `bodyAttrs` in `_initContext()`:

```ts
ssrContext._meta = defu(ssrContext._meta, {
  bodyAttrs: 'data-server-rendered',
  // ...
});
```

So at client startup Zova immediately knows: am I continuing from server-rendered DOM, or mounting from scratch?

Vue 3's `createSSRApp().mount()` already takes the hydration path, so Zova does not need to choose the API manually. What it does need is to know **when hydration ends** — many things (initialization that must run once the browser is stable) should wait for that moment.

The mechanism is a counter:

```ts
public _hydratingRootInc() { if (process.env.CLIENT && this.isRuntimeSsrPreHydration) this._hydratingInc(); }
public _hydratingRootDec() { if (process.env.CLIENT && this.isRuntimeSsrPreHydration) this._hydratingDec(); }

public _hydratingDec() {
  if (--this[SymbolHydratingCounter] === 0) {
    this._hydrated();
  }
}
```

The root mounts (+1) and unmounts (-1); zero means done. `_hydrated()` does three things:

```ts
private _hydrated() {
  if (!this.isRuntimeSsrPreHydration) return;
  this.isRuntimeSsrPreHydration = false;   // flip the flag first

  // Let instances suspended during hydration update once
  this[SymbolInstanceUpdates].forEach(instance => {
    if (!instance.isUnmounted && instance.zova) {
      try { instance.update(); }
      catch (err) { if (!err.message.includes("'insertBefore'")) throw err; }
    }
  });

  this[SymbolOnHydrateds].forEach(fn => fn());
}
```

That middle section is the key. During hydration, a component's reactive data may already have changed, but Vue defers rendering to match server DOM. After hydration, a single `update()` brings the page into its true runtime state. The `'insertBefore'` catch exists because the DOM may no longer perfectly match old vnodes after hydration — that error is harmless.

On top of this, Zova exposes two callback APIs:

```ts
onHydrated(fn); // runs only after the first SSR hydration
handleDirectOrOnHydrated(fn); // queue during hydration, invoke immediately otherwise
```

The second is for shared logic. The same code must wait for hydration under SSR and run immediately in a pure SPA; this wrapper adapts automatically.

After hydration, Zova also marks the document:

```ts
document.documentElement.setAttribute('data-zova-hydrated', this.sys.env.SITE_ID);
```

It is for external monitoring and end-to-end tests — a way to confirm "this page really finished hydrating".

---

## 4. Against Pages Router: Same Paradigm

Now bring in Next.js Pages Router. Its chain is:

```ts
// Server
export async function getServerSideProps(ctx) {
  return { props: { data: await loadData(ctx) } };
}

// Framework output
<script id="__NEXT_DATA__" type="application/json">{...}</script>

// Client
hydrateRoot(document.getElementById('__next'), <App {...pageProps} />);
```

Structurally, it matches Zova:

| Step               | Zova                                                   | Next.js Pages Router                        |
| ------------------ | ------------------------------------------------------ | ------------------------------------------- |
| Server rendering   | `renderToString`                                       | `renderToString` / `renderToPipeableStream` |
| State injection    | `window.__INITIAL_STATE__` + `__INITIAL_STATE_DEFER__` | `<script id="__NEXT_DATA__">`               |
| Serialization      | `unevalPatch` → JS literal, direct assignment          | JSON, `JSON.parse`                          |
| Hydration trigger  | `<body data-server-rendered>` auto-detected            | Framework always calls `hydrateRoot`        |
| Data fetching      | Controller bean                                        | `getServerSideProps`                        |
| Component boundary | None, full-tree hydration                              | None, full-tree hydration                   |

The differences are engineering details:

- **Zova splits state into two channels**; Pages Router has a single `__NEXT_DATA__`.
- **Zova detects hydration via a DOM attribute**; Pages Router hardcodes it, with no runtime branch for "should this page hydrate".
- **Zova has an `onHydrated` lifecycle**; Pages Router can only approximate it with `useEffect`.
- **Zova fetches through controllers**, which carry authentication, authorization, and parameter validation; `getServerSideProps` is a bare function.

So within this paradigm, Zova is better described as "Pages Router with every weak spot patched" rather than "a different approach".

---

## 5. Against App Router: Different Paradigm

App Router hydration is a different matter. The key is the `'use client'` directive:

```tsx
// app/page.tsx — a Server Component by default; no JS is shipped
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <Counter initial={data.count} />;
}

// app/counter.tsx — explicitly a Client Component
('use client');
export function Counter({ initial }) {
  const [n, setN] = useState(initial);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

What happens on the server:

1. The Server Component executes; the `fetch` result stays on the server.
2. The Client Component **does not execute**; it is serialized into a placeholder plus props plus chunk reference.
3. Both are compiled into a Flight-protocol payload (RSC Payload).
4. HTML is generated from the RSC output; Client Component positions are empty containers.

What the browser does:

1. Renders the HTML first (Client Component positions are empty or show fallbacks).
2. Loads the RSC Payload; React calls `hydrateRoot` once on the root container.
3. Loads the matching chunk and mounts only when it reaches a Client Component boundary.
4. Server Component output stays static and never participates in hydration.

Against Zova:

| Dimension                    | Zova                       | Next.js App Router                   |
| ---------------------------- | -------------------------- | ------------------------------------ |
| Components needing hydration | All                        | Client Components only               |
| JS shipped                   | All component code         | Client Components only               |
| Data transport               | Custom state object        | Flight payload                       |
| Render API                   | `renderToString` (sync)    | `renderToReadableStream` (streaming) |
| First byte                   | After full-tree render     | Per Suspense boundary                |
| Error isolation              | One error → whole page 500 | Fallback within the boundary         |
| Data fetching                | Controller bean            | Direct `fetch` in Server Component   |
| Mismatch surface             | Entire tree                | Client Components only               |

The essential difference in one sentence: **App Router cuts hydration demand at the component source; Zova hydrates the entire tree.**

The costs differ too. App Router buys a tiny first-load JS bundle and progressive streaming, at the price of requiring developers to understand the Server / Client boundary: `useState` only in Client Components, no event handlers in Server Components, serializable values across boundaries, and Server Actions as yet another mental model.

Zova buys "one component runs on both sides" — any SFC can use `ref`, `onMounted`, `$useState` directly without thinking about boundaries. The price is that first-load JS includes all component code, and the whole tree carries mismatch risk.

---

## 6. Three Zova-Specific Details

### 1. Dual-channel state to start the first paint early

As mentioned, one design judgment deserves emphasis. `__INITIAL_STATE__` carries only the fields required at startup; query cache goes through the defer channel. Pages Router has no equivalent — Next.js puts all props into one `__NEXT_DATA__`, and large pages slow down head parsing.

Zova's approach is essentially a manual priority split between the critical rendering path and non-critical data.

### 2. Controller-load errors are replayed

This is Zova's most interesting piece. From [ssr.ts](https://github.com/cabloy/cabloy/blob/main/zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssr.ts), `controllerLoad`:

```ts
public controllerLoad(event: IControllerLoadEvent) {
  if (event.phase === 'prepare') {
    if (process.env.SERVER) {
      event.ctx.meta.state.controllerLoadKey = this._allocateControllerLoadKey(event);
      return;
    }
    // Client hydration phase
    const key = this._allocateControllerLoadKey(event);
    const snapshot = this.stateDefer.controllerLoad?.[key];
    if (!snapshot || snapshot.controllerBeanName !== event.controllerBeanName) return;
    delete this.stateDefer.controllerLoad![key];
    event.replayError = _createControllerLoadError(snapshot);
    event.replayControllerRecorded = snapshot.controllerRecorded;
    return;
  }
  // Server: store the error as a snapshot
  if (event.phase !== 'fallback' || !process.env.SERVER || !event.error) return;
  const key = event.ctx.meta.state.controllerLoadKey;
  if (!key) return;
  (this.stateDefer.controllerLoad ??= {})[key] = _createControllerLoadErrorSnapshot(event);
}
```

The flow:

1. A server-side controller load fails (401, 404, redirect, etc.).
2. The error's `name / message / code / status / pagePath` is serialized into a snapshot under `stateDefer.controllerLoad`.
3. During client hydration, the same controller is reached and a structurally identical key locates the snapshot.
4. The error is **replayed** instead of re-requested.

Why replay? Because authentication state, cookie availability, and request context may differ between server and client. A re-request could produce a different result — the server redirects to login while the client gets data, and hydration breaks. Replay guarantees **both sides see the same controller result**.

The key construction is worth a look; it concatenates the component path from root to current, vnode keys, and occurrence index:

```ts
const parts: string[] = [];
let current: ComponentInternalInstance | null = instance;
while (current) {
  const name = current.type.__file ?? current.type.name ?? current.type.__name ?? 'anonymous';
  parts.unshift(`${name}:${String(current.vnode.key ?? '')}`);
  current = current.parent;
}
const structuralKey = parts.join('/');
const occurrence = this._controllerLoadSequence[structuralKey] ?? 0;
this._controllerLoadSequence[structuralKey] = occurrence + 1;
return `${structuralKey}#${occurrence}:${event.controllerBeanName ?? ''}`;
```

This distinguishes "the same controller appearing multiple times on one page" — each instance gets its own error.

Next.js has no counterpart. App Router `fetch` failures are encoded into the RSC Payload and caught by error boundaries; Pages Router `getServerSideProps` throws straight into a 500. Neither needs cross-side replay, because fetching only happens on the server.

### 3. Attribute mismatches are tolerated

Vue's hydration reports attribute differences as errors. Zova adds a [default tolerance policy](https://github.com/cabloy/cabloy/blob/main/zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssr.ts):

```ts
private _onHydratePropHasMismatchDefault(el, key, clientValue, _vnode, _instance) {
  let ignore = false;
  if (key === 'class') {
    ignore = true;
    if (clientValue !== undefined) {
      el.setAttribute('class', normalizeClass(clientValue));
    }
  } else if (key === 'style') {
    // same: overwrite with client value
  } else if (['id', 'name', 'for', 'd', 'aria-labelledby', 'aria-controls'].includes(key)) {
    // overwrite directly
  } else if (key === 'value') {
    // textarea uses .value, others use setAttribute
  } else if (isBooleanAttr(key)) {
    // boolean attributes by presence/absence
  } else if (el.getAttribute(`data-hydrate-ignore-${key}`) !== null) {
    // developer opt-out
  }
  return ignore ? { ignore: true } : { clientValue };
}
```

The attribute set is deliberate:

- `class` / `style`: animations, themes, and breakpoints may compute differently on each side; not a bug.
- `id` / `name` / `for` / `d` / `aria-*`: common in generated IDs, SVG paths, accessibility links; small differences do not matter.
- `value`: the user may have already edited the field; hydration should not overwrite it.
- Boolean attributes: `disabled`, `checked` — presence semantics are more robust.

There is also a manual escape hatch: `data-hydrate-ignore-${key}`. Add `data-hydrate-ignore-title` to an element and that attribute will not error during hydration; the client value wins.

The value of this policy is **separating legitimate differences from real bugs** — ignore the former by default so the latter stand out.

---

## 7. Resource Preloading: The Difference Is Not the Manifest

Two things must be separated here, or the conclusion goes wrong:

1. **The module-to-output-file mapping**, i.e. `quasar.manifest.json`. It is a build artifact — the production build generates it, and the development build generates it too. It is read-only at request time.
2. **Which modules this specific request actually used.** That is runtime information; it only exists after the whole component tree has run.

Zova filters by the second and looks up the first:

```ts
// ssrHandler.ts
const modules = cast(ssrContext).modules;
if (modules) {
  ssrContext._meta.endingHeadTags += this._renderModulesPreload_zova(modules, { ssrContext });
  ssrContext._meta.endingHeadTags += this._renderModulesPreload(modules, { ssrContext });
}
```

And collecting the second is **production-only**. In `moduleLoaded` of [a-ssr/src/monkey.ts](https://github.com/cabloy/cabloy/blob/main/zova/src/suite-vendor/a-zova/modules/a-ssr/src/monkey.ts):

```ts
async moduleLoaded(module: IModule) {
  // ssrContext.modules
  if (process.env.SERVER && process.env.PROD) {
    if (!this.ctx.meta.$ssr.context.modules) this.ctx.meta.$ssr.context.modules = new Set();
    this.ctx.meta.$ssr.context.modules.add(`@@${module.info.relativeName}`);
  }
}
```

So in development, modulepreload for Zova modules is **not generated at all** — not "generated after rendering".

The manifest's shape confirms it is a build artifact: keys are source module paths or hashed output filenames, and values are the dependency file lists. For example:

```json
{
  ".quasar/prod-ssr/client-entry.js": ["/assets/index-xxxx.js"],
  "a-api-DvAtaMhL.js": ["/assets/wrapAsyncGenerator-DhsawSOn.js"]
}
```

Zova turns `@@a-api` into a prefix `a-api-` and scans for keys ending in `.js`, caching the hit in `_ssrModulesZovaCache` — a process-level cache that never expires:

```ts
const prefix = `${id.substring(2)}-`;
const postfix = '.js';
for (const key in this._clientManifest) {
  if (key.startsWith(prefix) && key.endsWith(postfix)) {
    cache = this._resolveUrlPath(`/assets/${key}`);
    break;
  }
}
```

Note that this is a **linear prefix scan**, because the manifest is oriented as "file → dependencies", not "module → file", so a reverse lookup is required. Once found, tags are dispatched by extension: js to `modulepreload`, css to `stylesheet`, fonts and images to `preload`.

So the real difference is not when the manifest is generated — both are build-time. It is:

**Can "which chunks this page needs" be determined statically before rendering?**

App Router can. The route-segment-to-chunk mapping is static in the build output, so the server knows what to preload before rendering; with chunk references embedded in the RSC Payload, the browser can even fetch on `<Link>` hover.

Zova cannot. Its modules are loaded on demand at runtime — `app.meta.module.use(relativeName)` pulls in a module only when routing reaches it. So "which modules this page hits" depends on the controller load path and the actual component tree expansion, and is only known after rendering.

In one line: **the mapping is static, the hit set is dynamic.** A static mapping alone cannot move preloading earlier; what actually determines the timing is whether the page-to-chunk binding can be solved before rendering.

Pages Router sits in between — build artifacts exist, but preloading relies mostly on `next/link` and `<Head>`, not as deeply integrated as App Router.

---

## 8. Trade-offs

Putting both sides into one table makes the sacrifices visible:

|                           | Zova                                        | Next.js Pages Router                 | Next.js App Router                          |
| ------------------------- | ------------------------------------------- | ------------------------------------ | ------------------------------------------- |
| Component mental model    | One component, both sides                   | Same                                 | Must distinguish Server / Client            |
| First-load JS             | Entire tree                                 | Entire tree                          | Client Components only                      |
| TTFB                      | After full render                           | Streamable                           | Streamable + sliced                         |
| State injection           | Dual channel                                | Single channel                       | Flight payload                              |
| Data fetching             | Controller bean (full backend capabilities) | `getServerSideProps` (bare function) | In-component `fetch` (with cache semantics) |
| Hydration lifecycle       | `onHydrated` / `handleDirectOrOnHydrated`   | None, `useEffect`                    | None, `useEffect`                           |
| Pre-hydration consistency | Error snapshot replay                       | Not guaranteed                       | Guaranteed by RSC Payload                   |
| Cache granularity         | `public` / `session`                        | Page-level                           | Segment + fetch + tag                       |
| Migration cost            | —                                           | Low (isomorphic)                     | High (paradigm shift)                       |

Three judgments:

**Zova chose "the full app runs on both sides"**, keeping all complexity inside the framework (dual channel, error replay, attribute tolerance, context lifecycle). It is a "framework thinks more, developer thinks less" choice.

**Pages Router is a different implementation of the same choice**, with less polish. Its historical value is proving that "embed initial state in HTML + `hydrateRoot`" works for many years.

**App Router is a paradigm shift.** It acknowledges the cost of full hydration and trades component boundaries for first-load performance, pushing complexity onto developers — every component must answer "where does this run?"

So "who hydrates better" has no universal answer. It depends on whether you would rather put complexity in the framework or in your head.

---

## 9. Summary

1. Next.js has two generations of SSR: Pages Router is isomorphic to Zova (state embedded in HTML + full-tree hydration); App Router is heteromorphic (RSC + selective hydration). The comparison must start by separating these.
2. Zova's server chain is `resolveRoute → serverEntry → renderToString → onRendered → renderTemplate`, synchronous and serial, with no streaming slices.
3. State uses two channels: `__INITIAL_STATE__` in head (startup-critical) and `__INITIAL_STATE_DEFER__` in body (bulky, deferrable).
4. Hydration is detected via `data-server-rendered` and finalized when `HydratingCounter` reaches zero; at that point instances suspended during hydration get one `update()`.
5. Three Zova-specific details are worth borrowing: dual-channel priority, cross-side controller error replay, and classified attribute tolerance.
6. If Zova evolves further, the two App Router ideas most worth borrowing are streaming rendering and component-level JS pruning — but both require changes to the backend response pipeline and the component model, not small patches.

---

## References and Source

### Zova / Cabloy

- [SSR context and hydration lifecycle](https://github.com/cabloy/cabloy/blob/main/zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssr.ts)
- [SSR state restoration](https://github.com/cabloy/cabloy/blob/main/zova/src/suite-vendor/a-zova/modules/a-ssr/src/bean/sys.ssrState.ts)
- [State injection and meta management](https://github.com/cabloy/cabloy/blob/main/zova/src/suite-vendor/a-zova/modules/a-ssr/src/lib/ssrMetaStore.ts)
- [SSR render service](https://github.com/cabloy/cabloy/blob/main/zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/service/ssrHandler.ts)
- [Query cache dehydrate / hydrate](https://github.com/cabloy/cabloy/blob/main/zova/src/suite-vendor/a-zova/modules/a-model/src/service/storage.ts)
- [Router alignment between server and client](https://github.com/cabloy/cabloy/blob/main/zova/src/suite-vendor/a-zova/modules/a-router/src/monkey.ts)
- [SSR module assembly and the hydrated hook](https://github.com/cabloy/cabloy/blob/main/zova/src/suite-vendor/a-zova/modules/a-ssr/src/monkey.ts)

### Next.js

- [Pages Router: Data Fetching](https://nextjs.org/docs/pages/building-your-application/data-fetching)
- [App Router: Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [App Router: Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [React: hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)
