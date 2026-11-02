# SSR Init Data

This guide explains how SSR init data works in Zova within the Cabloy monorepo.

## Why init data matters

SSR needs data to be ready on the server before the rendered result is sent to the client.

Zova’s SSR model makes this feel natural by letting controllers prepare the needed data in `__init__`, while model-based state handles synchronization and hydration.

## Representative pattern

A representative pattern looks like this:

```typescript
@Controller()
export class ControllerPageTodo {
  @Use()
  $$modelTodo: ModelTodo;

  protected async __init__() {
    const queryTodos = this.$$modelTodo.select();
    await queryTodos.suspense();
    if (queryTodos.error) throw queryTodos.error;
  }
}
```

## What is happening here

1. a model bean encapsulates the data access path
2. the controller injects the model
3. `__init__` prepares the data on the server
4. successful eligible Query Cache state is captured in the SSR handoff
5. client SSR pre-hydration restores that cache before the client model consumes it

## What hydration reuses

The initial SSR handoff reuses model Query Cache data, not only `$useStateData(...)` results. A successful eligible `$useStateMem(...)` value can also transfer from the server to the initial client runtime even though it has no browser persistence backend.

Client reuse requires the model call to resolve to the same effective query key: Zova prefixes the logical key with Model identity and, for selector-enabled models, selector identity. State marked with `meta.ssr.dehydrate: false` is excluded. This handoff does not make memory state durable across a later browser reload, and it does not guarantee that every client query avoids fetching.

`ModelPassport` is a concrete SSR/CSR bridge: the server creates `passport` with `$useStateMem({ queryKey: ['passport'] })`, while the client creates `$useStateLocal({ queryKey: ['passport'] })`. The successful eligible server memory entry is what SSR transfers. Because the client local-state wrapper reads Query Cache before `localStorage`, the hydrated passport supplies the initial client value when the effective key matches. If no transferred entry exists, `$useStateLocal(...)` can instead restore its browser-local value. Hydration alone does not save the transferred value to `localStorage`; later client-side assignments do.

For helper selection and the complete passport flow, read [Model State Guide](/frontend/model-state-guide). For the dehydration filter and QueryClient lifecycle, read [A-Model Under the Hood](/frontend/a-model-under-the-hood).

## Hydration-equivalent initial render

The server-rendered HTML and the client's hydration-time initial render must be equivalent. Compare the server response with the first client render that hydrates it, not with the browser UI after later client work completes.

First resolve the effective SSR profile, request authentication, and admission, then choose the intended first-paint contract. **Private data does not by itself require client-only loading.** A `session` profile enables request-cookie-backed Passport recovery; `requiresAuth: true` independently enforces protected admission. A valid authenticated request can render authorized private data on the server. Protected session admission redirects an unauthenticated request to login; Passport recovery errors still follow the guard's error path. `session` alone does not authenticate a request.

See [SSR Env](/frontend/ssr-env#ssr-profile) for profile capabilities and [Navigation Guards Guide](/frontend/navigation-guards-guide#home-base-guard-entrypoint) for admission. Choose one of these strategies for each render-driving state:

### State required in SSR output

Use the model-owned query on both sides, prepare it in the server-capable initialization path, and let the client reuse the transferred state through the same effective Model, selector, and logical query key. This applies to public first-paint data and to safe, authorized private first-paint data on a `session` route.

For example, a personal records page with `requiresAuth: true` and `ssrProfile: 'session'` can prepare the current user's projected list before rendering. Keep server-side owner/instance enforcement and exclude secrets from both the response and Query Cache transfer. Session documents use `Cache-Control: private, no-store`; this is not permission to serialize credentials or internal fields.

The existing Account page is a concrete specimen: `home-user/src/routes.ts` selects protected session SSR, `home-user/src/model/account.ts` creates the authenticated `current()` query without a client-only guard, and `home-user/src/page/account/controller.tsx` awaits `$QueryEnsureLoaded(() => this.queryCurrent)` in `__init__`. These files live under `zova/src/suite/a-home/modules/`. Its browser timezone detection is separately deferred through `handleDirectOrOnHydrated`; that browser-only work does not move the Account query out of SSR.

Do not add a `clientReady` or `process.env.CLIENT` query guard merely because the data is private. If converting an intentionally deferred implementation to session SSR, align query creation, an explicit readiness wait, safe dehydration, and client query identity together. Removing a single guard does not establish that complete handoff.

### State intentionally omitted from SSR

When state is intentionally omitted from SSR—for example, a public profile disables server Cookie use, a value is browser-only, or the UX deliberately loads it after interaction—render the same neutral shell or placeholder on the server and during the client's hydration-time initial render. Begin its query, loading state, and rendered branch only at an explicit client boundary, such as `onHydrated`, `ClientOnly`, completed client route admission, a mounted client lifecycle, or user interaction. This boundary controls timing; it does not replace authentication or server-side authorization.

A `process.env.CLIENT` branch is not sufficient when it changes the first hydration tree. A state transition after hydration is valid; a different hydration-time initial tree is not.

### Query helper roles

- `$useStateData(...)` owns the query identity, state, cache lifecycle, and hydration reuse.
- `persister: false` disables browser persistence, not server query execution or SSR handoff. `ssr.dehydrate: false` excludes the query from transferred state, but does not prevent server fetching or rendering. Neither is a client-only admission boundary.
- `disableSuspenseOnInit: true` skips only `$useStateData(...)`'s automatic first-creation `query.suspense()` kick. It does not prevent query creation, restore, mounted/no-data fetches, or later refetches.
- `$QueryEnsureLoaded(...)` is an awaited availability gate: it waits only while `query.data === undefined`. Use it at a deliberate boundary that needs loaded data, not to suppress a query during hydration.
- If a boundary requires domain-valid data rather than merely loaded data, choose `$QueryGetFresh(...)` or `$QueryEnsureFresh(...)` with the model's freshness rule.

For the detailed state-helper semantics, read [Use State Data Best Practices](/frontend/use-state-data-best-practices). For browser-only rendering, read [SSR ClientOnly](/frontend/ssr-client-only).

## Implementation checks for SSR data-loading changes

When changing SSR pages, avoid inventing parallel data-loading patterns unless there is a real reason.

A better default is:

- use the existing model abstraction
- prepare data in `__init__`
- let hydration reuse the server-prepared cache on the client

Verify the selected contract, not an assumption encoded by an earlier test. For session-rendered private data, inspect authenticated raw HTML and transferred query state for the intended safe projection, verify private/no-store caching and unauthenticated admission, then check client reuse and hydration equivalence. For intentionally deferred state, verify its omission and the neutral shell through hydration before the explicit client boundary. In either case, exclude secrets and data outside the current user's authority. Existing assertions that a list is absent from SSR prove omission, not that private data cannot be server-rendered.

That keeps SSR code aligned with Zova’s intended flow.
