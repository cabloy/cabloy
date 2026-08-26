# Fetch Interceptor Guide

This guide explains how Zova fetch interceptors work in the Cabloy monorepo.

## Why this page exists

When you first see `a-interceptor`, it is easy to read it as a thin Axios convenience layer.

That reading is incomplete.

In Zova, fetch interceptors are a built-in **onion scene** around `$fetch`. They are authored as beans, loaded through module metadata, ordered through dependency rules, and executed through a composed request/response pipeline.

So this page does two narrower things:

1. explain the interceptor subsystem in Zova-native terms
2. show the shortest source path from the public surface to the runtime flow

## The shortest accurate mental model

A Zova fetch interceptor is:

- a bean-scene interceptor declared with `@Interceptor()`
- attached to the `$fetch` transport layer
- loaded as an onion item through module metadata
- ordered through dependency rules rather than an ad hoc list
- able to participate in request, request-error, response, and response-error flow

A practical one-line model is:

> Zova fetch interceptors are transport-layer middleware beans for `$fetch`, implemented on top of the generic onion-composition system.

That is more accurate than calling them only "Axios interceptors," because Axios is the host transport, but the lifecycle, loading, ordering, and execution model come from Zova.

## Where interceptors fit in the frontend data stack

Use fetch interceptors when the concern belongs to the transport layer itself, for example:

- attaching locale or timezone headers
- attaching or refreshing JWT auth tokens
- normalizing a backend response envelope such as `{ code, message, data }`
- falling back to a local mock server for selected failures
- short-circuiting to SSR `performAction` on the server

Do **not** reach for a fetch interceptor first when the concern is mainly business-oriented or state-oriented.

A practical layering rule is:

- use `$fetch` + interceptors for transport concerns
- use `$api` for business-oriented frontend services
- use `Model` for state ownership, caching, and shared remote state
- use OpenAPI SDK or schema-driven layers when backend contract metadata should shape the frontend surface more directly

Read these together when you need the broader layering context:

- [Server Data](/frontend/server-data)
- [API Guide](/frontend/api-guide)
- [Model Architecture](/frontend/model-architecture)
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)

## The public authoring surface

The public decorator is implemented in:

- `zova/src/suite-vendor/a-zova/modules/a-fetch/src/lib/interceptor.ts`

Representative source shape:

```typescript
export function Interceptor<T extends IDecoratorInterceptorOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('interceptor', 'new', true, options);
}
```

This tells us two important things:

1. an interceptor is a bean scene named `interceptor`
2. the interceptor bean is authored as a fresh-instance bean scene

The typed transport hooks are defined in:

- `zova/src/suite-vendor/a-zova/modules/a-fetch/src/types/interceptor.ts`

The main hook surfaces are:

- `onRequest(...)`
- `onRequestError(...)`
- `onResponse(...)`
- `onResponseError(...)`

That same file also shows that interceptor options inherit generic onion features such as:

- `enable`
- `match`
- `ignore`
- `dependencies`
- `dependents`

So the public authoring contract is intentionally small, while the execution model is inherited from the broader onion system.

## Where the built-in interceptors live

The built-in interceptor module is:

- `zova/src/suite-vendor/a-zova/modules/a-interceptor`

Its public metadata surface is exported from:

- `zova/src/suite-vendor/a-zova/modules/a-interceptor/src/.metadata/index.ts`

That metadata file confirms the built-in interceptor set:

- `a-interceptor:mock`
- `a-interceptor:headers`
- `a-interceptor:jwt`
- `a-interceptor:performAction`
- `a-interceptor:body`

It also augments `IInterceptorRecord`, which is how these named interceptors become part of the typed Zova fetch surface.

## Runtime flow

The runtime path is easiest to understand from `$fetch` inward.

A compact runtime sketch is:

```text
caller
  -> $fetch
     -> BeanFetch
        -> ServiceComposer
           -> load onion slices
           -> create interceptor beans
           -> compose 4 pipelines
              -> request
              -> request error
              -> response
              -> response error
                 -> mock
                 -> headers
                 -> jwt
                 -> performAction
                 -> body
                     -> final data or error shape returned to caller
```

This sketch is intentionally simplified. The concrete order and participation of each interceptor still depend on the current onion metadata, dependency rules, and enable/match filtering.

A slightly more detailed request/response sketch is:

```text
request path
  caller
    -> $fetch.request(...)
       -> BeanFetch Axios instance
          -> ServiceComposer.executeRequest(config)
             -> mock?            (enabled only when its request hook exists and matches)
             -> headers          (locale / timezone / optional protocol header)
             -> jwt              (token lookup / attach / maybe refresh)
             -> performAction    (server-side SSR short-circuit when matched)
             -> body?            (usually no request hook)
                -> network request or SSR action result

response success path
  network / SSR result
    -> ServiceComposer.executeResponse(response)
       -> mock?            (usually no success-response hook)
       -> headers?         (usually no success-response hook)
       -> jwt?             (usually no success-response hook)
       -> performAction?   (usually no success-response hook)
       -> body             (unwrap { code, message, data } or pass through)
          -> caller receives final data / response

response error path
  transport error / response error
    -> ServiceComposer.executeResponseError(error)
       -> mock             (may retry against local fake server)
       -> headers?         (usually no response-error hook)
       -> jwt?             (usually no response-error hook)
       -> performAction?   (usually no response-error hook)
       -> body             (normalize error.code / error.message)
          -> caller receives final error
```

This second sketch is still a reading aid rather than a promise that every interceptor participates in every phase. The actual phase participation comes from the concrete hook methods implemented by each interceptor bean.

### 1. `$fetch` is the transport entrypoint

`$fetch` is wired in:

- `zova/src/suite-vendor/a-zova/modules/a-fetch/src/bean/bean.fetch.ts`

This bean:

- creates the Axios instance
- merges the effective Axios config
- creates `ServiceComposer`
- installs request and response interceptors on the Axios instance

So `$fetch` owns the transport instance, and the interceptor scene is attached there.

### 2. `ServiceComposer` builds the interceptor pipeline

The composition logic lives in:

- `zova/src/suite-vendor/a-zova/modules/a-fetch/src/service/composer.ts`

`ServiceComposer` does four main jobs:

1. load onion slices either from package metadata or from explicit `onionItems`
2. instantiate each interceptor bean
3. compose four pipelines:
   - request
   - request error
   - response
   - response error
4. merge static onion options with per-request dynamic overrides from `config.interceptors[...]`

This is one of the most important source files in the whole flow, because it shows that the built-in interceptors are not hardcoded into Axios directly. They are first loaded as onion slices, then executed through the generic composer.

### 3. The generic onion engine handles loading, ordering, and filtering

The underlying onion runtime lives in:

- `zova/src/suite-vendor/a-zova/modules/a-bean/src/service/onion_.ts`

This file shows that onion scenes are generic framework infrastructure. For the interceptor scene, it is responsible for:

- reading onion metadata from loaded modules
- building the full item list
- reordering items through dependency rules
- filtering items through `enable` / `match` / `ignore`
- composing the final chain

This is why the interceptor subsystem is best understood as a Zova onion scene first, not as a standalone helper layer.

## The built-in interceptor chain

The dependency configuration is declared in:

- `zova/src/suite-vendor/a-zova/modules/a-interceptor/package.json`

The current built-in chain is:

1. `a-interceptor:mock`
2. `a-interceptor:headers`
3. `a-interceptor:jwt`
4. `a-interceptor:performAction`
5. `a-interceptor:body`

The package does not encode that order as a simple list. Instead, it encodes dependency rules:

- `headers` depends on `mock`
- `jwt` depends on `headers`
- `performAction` depends on `jwt`
- `body` depends on `performAction`

That distinction matters because the order is part of the onion dependency model.

A source-aligned hook matrix for the current built-ins is:

| Interceptor     | onRequest | onRequestError | onResponse | onResponseError |
| --------------- | --------- | -------------- | ---------- | --------------- |
| `mock`          | -         | -              | -          | yes             |
| `headers`       | yes       | -              | -          | -               |
| `jwt`           | yes       | -              | -          | -               |
| `performAction` | yes       | -              | -          | -               |
| `body`          | -         | -              | yes        | yes             |

This table is only a reading shortcut. The authoritative source is still the concrete bean implementation under `a-interceptor/src/bean/`.

### `mock`

Source:

- `zova/src/suite-vendor/a-zova/modules/a-interceptor/src/bean/interceptor.mock.ts`

Role:

- participates in `onResponseError(...)`
- checks whether mock support is enabled
- reroutes selected failures such as network failures or 404s to a local fake server
- preserves API prefix behavior when rebuilding the fallback base URL

This makes mock support a transport-layer fallback rather than a page-local workaround.

### `headers`

Source:

- `zova/src/suite-vendor/a-zova/modules/a-interceptor/src/bean/interceptor.headers.ts`

Role:

- participates in `onRequest(...)`
- adds locale header when missing
- adds timezone header when missing
- optionally adds the OpenAPI schema protocol header

This keeps common request metadata close to `$fetch`, where every request can benefit from it consistently.

### `jwt`

Source:

- `zova/src/suite-vendor/a-zova/modules/a-interceptor/src/bean/interceptor.jwt.ts`

Role:

- participates in `onRequest(...)`
- resolves a JWT adapter bean
- reads the current token state
- injects `Authorization: Bearer ...` when available
- refreshes expired tokens through a deduplicated promise
- throws 401 in strict-auth cases when a usable token is unavailable

This is also where SSR-aware token behavior appears, such as server-side auth-token header signaling.

### `performAction`

Source:

- `zova/src/suite-vendor/a-zova/modules/a-interceptor/src/bean/interceptor.performAction.ts`

Role:

- participates in `onRequest(...)`
- only runs on the server
- checks whether the current base URL should be handled by SSR `performAction`
- transforms the fetch call into SSR action input
- throws the SSR result or SSR error to short-circuit the normal network path

This is a strong example of why the interceptor layer must be understood in Zova runtime terms, not only in browser-request terms.

### `body`

Source:

- `zova/src/suite-vendor/a-zova/modules/a-interceptor/src/bean/interceptor.body.ts`

Role:

- participates in both `onResponse(...)` and `onResponseError(...)`
- passes through non-JSON responses
- unwraps the common JSON envelope shape
- throws when `code !== 0`
- maps response errors back onto `error.code` and `error.message`

This is the interceptor that turns a lower-level transport response into the simpler data shape many callers expect from `$fetch`.

## Per-request overrides

One of the most useful implementation details appears in:

- `zova/src/suite-vendor/a-zova/modules/a-fetch/src/service/composer.ts`

`ServiceComposer` merges:

- the interceptor's static onion options
- any request-local overrides from `config.interceptors[item.name]`

That means a single request can selectively adjust interceptor behavior without changing the module-level registration.

In practice, this is where request-scoped `enable`, matching rules, or interceptor-specific options can be adjusted dynamically.

## SSR and mock caveats

Two built-in interceptors deserve extra attention when you are tracing runtime behavior.

### SSR caveat

`performAction` is server-only.

If SSR resolves a matching `performAction` handler, the request can be short-circuited before the normal network call completes. So a server-side `$fetch` path may be executing through SSR action infrastructure rather than through a browser-style remote call.

### Mock caveat

`mock` works as a fallback path for selected failures when mock support is enabled.

That means mock behavior is not only a matter of authoring `.fake.ts` routes. The transport layer itself can decide to retry against the local fake server under the current runtime conditions.

Read this page together with [Mock Guide](/frontend/mock-guide) if you are debugging why a failed request unexpectedly resolves from mock infrastructure.

## Stable contract versus implementation detail

The most stable parts of the subsystem are:

- `@Interceptor()` as the public authoring decorator
- the four hook categories
- the onion-style option model
- `$fetch` as the transport host

More implementation-sensitive details include:

- the exact built-in chain order
- the current response-envelope assumptions in `body`
- the exact SSR short-circuit shape in `performAction`
- mock fallback rules and error-code matching

When writing framework-facing application code, depend on the stable contract first and treat the implementation details as source-reading guidance.

## Source reading path

If you want the shortest practical reading order, use this sequence:

1. `zova/src/suite-vendor/a-zova/modules/a-interceptor/src/.metadata/index.ts`
   - confirms the public interceptor set and type registration
2. `zova/src/suite-vendor/a-zova/modules/a-fetch/src/types/interceptor.ts`
   - shows the public hook and option contracts
3. `zova/src/suite-vendor/a-zova/modules/a-fetch/src/lib/interceptor.ts`
   - shows how the decorator becomes a bean scene
4. `zova/src/suite-vendor/a-zova/modules/a-fetch/src/bean/bean.fetch.ts`
   - shows where `$fetch` creates and attaches the runtime
5. `zova/src/suite-vendor/a-zova/modules/a-fetch/src/service/composer.ts`
   - shows loading, instantiation, composition, and per-request override merge
6. `zova/src/suite-vendor/a-zova/modules/a-bean/src/service/onion_.ts`
   - shows the generic onion engine
7. the concrete built-in beans under `a-interceptor/src/bean/`
   - show the behavior of `mock`, `headers`, `jwt`, `performAction`, and `body`

## Read together with

These guides provide the best neighboring context:

- [Server Data](/frontend/server-data)
- [API Guide](/frontend/api-guide)
- [Mock Guide](/frontend/mock-guide)
- [IoC and Beans](/frontend/ioc-and-beans)
- [Behavior Guide](/frontend/behavior-guide)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)

## Verification checklist for source readers

When you use this page to reason about current behavior, verify:

1. the interceptor order still matches `a-interceptor/package.json`
2. the hook contracts in `a-fetch/src/types/interceptor.ts` still match the described flow
3. `ServiceComposer` still merges `config.interceptors[...]` into the final onion options
4. the built-in bean roles still match their current source files

That keeps the explanation tied to current source rather than to stale assumptions.
