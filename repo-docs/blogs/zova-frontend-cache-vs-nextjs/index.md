---
title: Frontend Caching in Zova vs Next.js
titleEn: Frontend Caching in Zova vs Next.js
subtitle: Zova’s Model cache keeps application state ready to reuse; Next.js App Router caches data and render output to avoid repeating server work.
summary: Compare Zova’s TanStack Query cache, browser persistence, and identity isolation with the Request Memoization, Data Cache, Full Route Cache, and Router Cache in Next.js 15.
tags:
  - Caching
  - Next.js
  - Cabloy
  - Zova
  - Vue
  - React
  - TanStack Query
slug: zova-frontend-cache-vs-nextjs-en
cover: ./cover-en-v1.png
date: 2026-11-23
---

# Frontend Caching in Zova vs Next.js

> Restoring a user’s orders after they reopen a browser is a different job from serving a product page without rendering it again.

Both jobs involve a cache, but they have different owners and failure modes. A dashboard must not show the previous account’s orders after an account switch. A product page can often serve the last rendered version for a while rather than doing the same server work on every request.

Zova’s [Model beans](/frontend/model-architecture) own application query state, including how it survives navigation, reload, and identity changes. The Next.js 15 App Router’s built-in caches reuse fetched data, prerendered output, and route segments. The difference is one of emphasis, not an either-or rule: Zova also defines HTTP cache policy for SSR, and Next.js also caches data before it renders anything.

## 1. Start with Zova’s Model cache

Zova’s `a-model` module [initializes a TanStack Query client](https://github.com/cabloy/cabloy/blob/6cacf88a5bce8da7be1469a209ca5da1b803c613/zova/src/suite-vendor/a-zova/modules/a-model/src/service/storage.ts) and installs it through `VueQueryPlugin`. Pages can consume the model’s query state without becoming separate owners of fetching, invalidation, or persistence.

| Concern                 | Zova mechanism                  | What it controls                                                                                                    |
| ----------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| In-memory query state   | TanStack Query `QueryCache`     | Reuse while the app is running. Inactive queries are eligible for garbage collection after five minutes by default. |
| Browser persistence     | Model query persister           | Restore selected query data after a reload or return visit.                                                         |
| Identity isolation      | `ModelPersistenceContext`       | Decide which identity owns DB-backed state and whether pending work still belongs to it.                            |
| SSR response policy     | `public` or `session` profile   | Control cookie access during rendering and HTTP cache headers on the response.                                      |
| Tab and component state | Router Tabs and Vue `KeepAlive` | Restore the application’s tab list separately from retaining live component instances in memory.                    |

These are five concerns, not five storage tiers that every request passes through. In particular, `gcTime` controls how long an **inactive in-memory query** is retained. It is neither a freshness setting nor the lifetime of the persisted record. By default, Zova does not refetch on mount or window focus, but it does refetch on reconnect.

## 2. What survives a reload?

Persistence is built into the Model helpers. A Model can declare its storage directly; the excerpt below assumes `loadOrders` is an existing query function:

```ts
return this.$useQuery({
  queryKey: ['orders'],
  queryFn: loadOrders,
  meta: { persister: { storage: 'db' } },
});
```

For ordinary asynchronous Model queries, `db` is the default when no persister is specified. Set `meta.persister: false` when the query should not be persisted to browser storage. The [Model State Guide](/frontend/model-state-guide) explains which storage each helper selects.

| Storage option | Backing store                              | Default retention setting |
| -------------- | ------------------------------------------ | ------------------------- |
| `cookie`       | Browser cookie                             | Session cookie            |
| `local`        | `localStorage`                             | No configured age limit   |
| `db`           | localForage, typically backed by IndexedDB | 24-hour `maxAge`          |

For a DB-backed query, `maxAge` is checked when restoring the persisted record. It is not a timer that evicts data from the live Query Cache. Likewise, an unlimited `local` age setting does not stop the browser or user from clearing site data.

### Why writes use a queue

Async storage introduces two different ordering problems. If the application saves a value and then deletes it, accepted operations need to reach storage in that order. But an earlier restore or delayed save might also finish after a newer deletion and try to put obsolete data back.

Zova’s [PersistenceQueue](https://github.com/cabloy/cabloy/blob/6cacf88a5bce8da7be1469a209ca5da1b803c613/zova/src/suite-vendor/a-zova/modules/a-model/src/lib/persistenceQueue.ts) serializes writes and deletes for a storage instance. The [DB persister](https://github.com/cabloy/cabloy/blob/6cacf88a5bce8da7be1469a209ca5da1b803c613/zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.persister.ts) also checks generation counters so obsolete restores and deferred saves can be dropped. The queue orders work that has been accepted; the generation check answers whether older work is still relevant.

## 3. What happens when the active account changes?

A logical query key such as `['orders']` describes the query, not who owns a persisted result. Zova’s [persistence context](https://github.com/cabloy/cabloy/blob/6cacf88a5bce8da7be1469a209ca5da1b803c613/zova/src/suite-vendor/a-zova/modules/a-model/src/lib/modelPersistence.ts) adds an identity scope: `[instanceId, siteId, userId]`. The physical DB key includes both the application name and this scope:

```text
["zova-model-db", 1, appName, [instanceId, siteId, userId], logicalKey]
```

When the scope changes, Zova advances an epoch, cancels affected in-flight DB-backed queries, and resets their in-memory data and observer placeholders without removing the observers. Active queries can then refetch for the new scope. The caller can suppress that refetch during logout or relogin, and eligible SSR data can be adopted during the first identity registration.

A scope alone would miss an important case: if the user switches from A to B and then back to A, work started during the first A session should not be treated as current. Comparing the captured epoch as well as the scope lets the persister recognize that stale work. Already accepted explicit writes can finish under their original physical keys; they do not become writes to the new scope.

A scope change resets live query state; it does not itself erase previous records from disk. The keys prevent ordinary Model restoration from crossing scopes. They are not an authorization boundary, and they do not make browser storage a safe place for secrets.

## 4. SSR state transfer is not response caching

For SSR, Zova disables automatic query garbage collection while rendering and clears the request’s Query Cache after taking its snapshot. Eligible successful queries are transferred in `window.__INITIAL_STATE_DEFER__.query`; mutations, synchronous-persister queries, and queries marked `meta.ssr.dehydrate: false` are excluded. The server does not read browser `localStorage` or IndexedDB. See [SSR Init Data](/frontend/ssr-init-data) for what can safely be transferred.

During client pre-hydration, a non-synchronous query that already has data at setup uses Zova’s SSR `staleTime`, which defaults to `Infinity`. This lets the browser reuse the server’s data for the initial render. It does not make that data permanently fresh: normal `staleTime` rules apply after hydration. See [the query helper](https://github.com/cabloy/cabloy/blob/6cacf88a5bce8da7be1469a209ca5da1b803c613/zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useQuery.ts).

HTTP caching is a separate decision. The route’s `ssrProfile` can override the site’s default, with `public` as the final fallback:

- **`public`** does not use request cookies during SSR. An enabled response-cache policy with a positive TTL emits `Cache-Control: public, max-age=N`. A zero TTL emits `no-cache, no-store, must-revalidate`; development forces enabled policies to zero. If `responseCache` is `false`, the public handler does not set a cache header.
- **`session`** can use request cookies and sends `Cache-Control: private, no-store`. The profile itself does not authenticate the request.

These are [response headers](https://github.com/cabloy/cabloy/blob/6cacf88a5bce8da7be1469a209ca5da1b803c613/zova/src/suite-vendor/a-zova/modules/a-ssrserver/src/service/ssrHandler.ts), not a server-side store of rendered pages. An HTTP cache may reuse a public response; hydration lets the client reuse the state that was used to produce it.

## 5. What the Next.js 15 App Router caches

The [Next.js 15 caching guide](https://nextjs.org/docs/15/app/guides/caching) distinguishes four mechanisms:

| Mechanism           | What it reuses                                                             | Lifetime or boundary                                                                                                 |
| ------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Request Memoization | Results of equivalent `fetch` calls in the React component tree            | One server render pass                                                                                               |
| Data Cache          | Results of opted-in server fetches                                         | Across requests; persistence across deployments depends on the deployment setup                                      |
| Full Route Cache    | Prerendered HTML and the React Server Component (RSC) payload              | Until revalidation or redeployment; dynamic routes are not stored in this cache                                      |
| Router Cache        | RSC payloads for route segments, notably shared layouts and loading states | Browser memory; page segments are not cached by default in Next.js 15, but can be reused for back/forward navigation |

A dynamic route can skip the Full Route Cache and still reuse explicitly cached data. Conversely, an eligible static route can be prerendered even if its `fetch` calls have not opted into the persistent Data Cache. Next.js 15’s [default fetch behavior](https://nextjs.org/docs/15/app/api-reference/functions/fetch) is therefore not the same as explicitly setting `cache: 'no-store'`.

Calls to `revalidatePath` or `revalidateTag` let the app refresh cached route output or data after a change. That is different from Zova’s automatic reset of identity-scoped query state. Next.js also has an authentication-related invalidation path: setting or deleting cookies in a Server Action invalidates the Router Cache. It does not provide Zova’s per-instance, per-site, per-user browser persistence model as part of that cache.

### `maxAge` and `revalidate` answer different questions

Zova’s DB `maxAge` asks, **“May this stored record be restored?”** An expired record is not used for restoration; a query that needs the data must fetch it again. Normal query freshness and refetch settings are separate.

Next.js time-based Data Cache revalidation asks, **“Is this cached result due for a refresh?”** The first request after the interval can receive the stale value while a background refresh runs. If that refresh fails, the previous result remains available. That makes sense for a public product listing that can tolerate stale data. It is not a substitute for deciding what data should be cached in the first place.

## 6. Why Router Tabs are not a Router Cache

With `tabsOptions.cache: true`, Zova’s [Router Tabs model](https://github.com/cabloy/cabloy/blob/6cacf88a5bce8da7be1469a209ca5da1b803c613/zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts) restores the application tab list through `$useStateLocalAsync`, backed by localForage. When the persistence scope changes, it waits for the new scope’s list rather than showing the previous one. With caching off, the list lives only in memory. Vue `KeepAlive` is separate: it can retain a component instance during navigation, but not through a reload.

Next.js’s Router Cache makes navigation faster by reusing parts of a route’s RSC payload. It does not restore the application’s open work tabs. The similar names hide a different object of reuse: a list the user was working with versus a server-produced artifact the router can render again.

## 7. Choose the cache by what can go stale

For a dashboard, start with the owner of the query state. Decide what can survive a reload, what must be scoped to the current identity, and what the server is allowed to transfer into the HTML. For a public product page, start with the cost of repeating work: cache the fetched data or prerendered output when the page can safely tolerate revalidation lag.

These decisions can coexist. The useful question is not which framework has more layers. It is **what may be reused, for whom, and what should stop that reuse**.

## Further reading

- [Model State Guide](/frontend/model-state-guide) and [A-Model Under the Hood](/frontend/a-model-under-the-hood)
- [Zova Model query and persistence defaults](https://github.com/cabloy/cabloy/blob/6cacf88a5bce8da7be1469a209ca5da1b803c613/zova/src/suite-vendor/a-zova/modules/a-model/src/config/config.ts)
- [SSR Hydration in Zova vs Next.js](/blogs/zova-nextjs-ssr-hydration-differences/)
- [Next.js 15 App Router caching guide](https://nextjs.org/docs/15/app/guides/caching) and [Next.js 15 `fetch` reference](https://nextjs.org/docs/15/app/api-reference/functions/fetch)
