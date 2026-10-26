# Environment and Config Guide

## Why this guide matters

Zova uses a multi-dimensional environment and configuration model so frontend behavior can vary cleanly across runtime scenarios without scattering ad hoc conditionals through the codebase.

That matters because SSR, SPA, edition-specific flavors, and deployment-specific variants all need a shared way to select the right settings.

## The three core dimensions

Zova’s frontend runtime model is built around three dimensions:

- **mode**
- **appMode**
- **flavor**

Together they determine which env variables, config files, and script paths should be active.

## Runtime mode

Runtime mode describes whether the app is running in:

- `development`
- `production`

This affects script behavior, environment loading, and tree-shakeable flags such as `DEV` and `PROD`.

## App mode

App mode describes the application delivery model, such as:

- `ssr`
- `spa`

This matters because SSR and SPA have different runtime assumptions, build paths, and environment-sensitive code behavior.

## Flavor

Flavor adds a third dimension so the frontend can support different product or UI variants without flattening everything into only one mode axis.

Representative built-in flavors include:

- `admin`
- `web`
- `cabloyBasicAdmin`
- `cabloyStartAdmin`
- `cabloyStartWeb`

Flavor is especially important in Cabloy because Basic and Start do not always share the same frontend stack or output assumptions.

## Env-file loading model

Zova loads env files from `env/` using the multi-dimensional model.

Representative patterns include:

- `.env`
- `.env.[meta]`
- `.env.local`
- `.env.[meta].local`

This means env loading is layered and conditional rather than single-file only.

## Config-file loading model

Zova also loads frontend config files from `src/front/config/config/` using the same multi-dimensional logic.

Representative patterns include:

- `config.ts`
- `config.[meta].ts`
- `config.local.ts`
- `config.[meta].local.ts`

That keeps env variables and frontend config aligned around the same runtime-selection model.

## Resolution principle

The practical rule is:

- base files always load
- meta-specific files load when their dimensions match
- `.local` files override while remaining git-ignored

This lets projects combine shared defaults with scenario-specific and local overrides cleanly.

A representative SSR admin development stack looks like:

```txt
.env
.env.ssr
.env.ssr.admin
.env.ssr.admin.development
.env.local
.env.ssr.local
.env.ssr.admin.local
.env.ssr.admin.development.local
```

The config side follows the same merge pattern with `config.ts`, `config.[meta].ts`, and `.local` variants.

## Locale enablement and defaults

Installed dictionaries, enabled languages, and the default language are separate concerns. Authoring or installing a language provider makes its translation resources available; it does not add a language choice or change the default. The Japanese and Traditional Chinese entries below illustrate application policy, not bundled language packs. Configure application policy explicitly in the frontend root config, `zova/src/front/config/config/config.ts`, or an applicable config layer:

```typescript
import type { ZovaConfigOptional, ZovaSys } from 'zova';

export default function (_sys: ZovaSys) {
  const config: ZovaConfigOptional = {};

  config.locale = {
    default: 'ja-jp',
    storeKey: 'locale',
    items: {
      'en-us': 'LanguageEnglish',
      'ja-jp': 'LanguageJapanese',
      'zh-cn': 'LanguageChinese',
      'zh-tw': 'LanguageTraditionalChinese',
    },
  };

  return config;
}
```

This is a locale-policy example, not a replacement for the other settings in an existing config file. Additional locale IDs need reachable `ILocaleRecord` declarations, supplied by installed modules or authored interface merging. A type declaration alone neither supplies translations nor enables a language.

- `items` is the enabled locale-code-to-label-key map. The values are message keys used by language selectors, not dictionaries or package names. A configured subset is valid; it need not contain every language declared in `ILocaleRecord`.
- `default` is the application default and must be an own key of the nonempty `items` map. Invalid policy fails validation rather than being repaired from installed providers.
- `storeKey` is the frontend locale cookie key. Keep it deliberate when changing preference compatibility; it does not determine which languages are enabled. SSR cookie access still follows the effective SSR profile.

Locale IDs in policy use lowercase, hyphenated form such as `ja-jp` and `zh-tw`. Active-locale input is normalized, so `JA_JP` can resolve to enabled `ja-jp`. Missing, unknown, or disabled selections fall back to `config.locale.default`, including stale saved preferences. Route-specific language menus can narrow the root enabled set, not expand it. This policy governs active-language selection, not an explicit low-level translation lookup such as `this.scope.locale.Name.locale('en-us')`.

Unlike ordinary additive config merging, **each config layer that supplies `locale.items` replaces the entire enabled map**. For example, a later layer with only `items: { 'ja-jp': 'LanguageJapanese' }` removes earlier English and Chinese choices. It must also leave `default` valid, either by retaining an already enabled default or setting `default: 'ja-jp'`. To add one language while preserving others, specify the complete desired map in that layer.

An enabled language may have no installed provider; missing text then uses the normal `en-us` / original-key fallback. Conversely, an installed but disabled language remains unavailable for active selection. Neither case is proof of translation completeness. The configured default does not change missing-message fallback; see [Module Scope](/frontend/module-scope#override-precedence-and-missing-message-fallback).

### Configure frontend and backend roots separately

For a paired application, also configure Vona's root `config.locale.items` and `config.locale.default` in `vona/src/backend/config/config/config.ts` or its applicable config layer. Keep the deployed frontend and backend policies aligned deliberately: neither stack automatically synchronizes its enabled set or default to the other. `APP_LOCALE_DEFAULT` supplies the frontend default only where the frontend config reads it; it does not enable the language or configure the backend root.

The backend default belongs to root `config.locale.default`, not the former module-level `a-locale` `defaultLocale`. Backend negotiation, aliases, cookie/protocol settings, and migration details are covered in [I18n Guide](/backend/i18n-guide). Providers contain shared static text, while the selected language remains app/request-scoped; language policy is not an authorization or tenant boundary.

## Flavor-aware capability differences

Different SSR flavors can intentionally expose different runtime capabilities rather than behaving identically.

A concrete example in the current Cabloy Basic frontend setup is the default SSR profile:

- Web defaults to `SSR_PROFILE=public`
- Admin defaults to `SSR_PROFILE=session`

The effective profile is request-local: the active flavor's `SSR_PROFILE` supplies its default, and `route.meta.ssrProfile` can override it after route resolution. `public` keeps cookie-derived identity and theme state out of the server render; `session` permits normal cookie-backed Passport recovery and theme resolution, while forcing a private, non-storable response. Profiles define request-cookie capability, not a locale source: existing `route.meta.locale` controls URL-locale participation.

The flavor fallback does not replace route authoring. Choose `ssrProfile` from the route's rendering contract: `session` is explicit when SSR needs cookie-backed state, protected admission, personalized first paint, or private data, while `public` remains valid for an explicit URL-locale or deliberately locale-neutral, cache-safe, hydration-equivalent public contract. The absence of `locale` params alone does not determine the profile. Choose anonymous admission separately with `requiresAuth: false`; a session route still does not gain authentication or authorization.

That means flavor selection is not only a packaging choice. It establishes the default capability boundary, while individual routes remain able to select the profile their rendering contract requires.

Before assuming how SSR theme state is handed off and finalized, combine:

- the effective SSR profile
- edition marker
- active UI-library adapter

For the theme-side contract and edition-aware checklist, see [Theme Guide](/frontend/theme-guide). For the env-side explanation of `SSR_PROFILE`, see [SSR Environment Variables](/frontend/ssr-env).

## Scripts and runtime variants

Frontend scripts map directly onto the same runtime dimensions. In the Cabloy Basic default environment, `dev:ssr:*` commands use the Zova standalone SSR development listener (`DEV_SERVER_PORT=9000`), while Vona integrated SSR uses Vona's `SERVER_LISTEN_PORT=7102`. These are separate listeners; `API_BASE_URL` still points from Zova to the Vona server.

Representative commands include variants such as:

- `dev:ssr:admin`
- `build:ssr:admin`
- `preview:ssr:admin`
- `dev:ssr:web`
- `build:ssr:web`
- `dev:spa`
- `dev:ssr:cabloyBasicAdmin`
- `build:ssr:cabloyBasicWeb`

Representative current-repo script shapes include:

```json
{
  "dev": "npm run dev:ssr:admin",
  "build": "npm run build:ssr:admin",
  "preview": "npm run preview:ssr:admin",
  "dev:ssr:admin": "npm run prerun && quasar dev --mode ssr --flavor admin",
  "dev:ssr:web": "npm run prerun && quasar dev --mode ssr --flavor web",
  "dev:spa": "npm run prerun && quasar dev --mode spa --flavor admin"
}
```

That means scripts are not just convenience aliases. They are the operational surface for selecting mode, appMode, and flavor.

For current monorepo usage, also see [Frontend Scripts](/frontend/scripts).

## Tree-shakeable env flags

Some environment variables are especially important because they support tree-shaking or compile-time branching.

Representative flags include:

- `META_MODE`
- `META_APP_MODE`
- `META_FLAVOR`
- `NODE_ENV`
- `DEV`
- `PROD`
- `SSR`
- `CLIENT`
- `SERVER`

This is one of the most important reasons environment access should be done deliberately rather than by inventing custom runtime checks everywhere.

## `process.env` vs `sys.env` vs `sys.config`

Use the right access path for the right kind of value:

- `process.env` for tree-shakeable env-based conditions
- `sys.env` for runtime env values that are not tree-shaken
- `sys.config` for the merged frontend config model

Representative patterns:

```typescript
if (process.env.DEV) {
  console.log('for development');
}

const publicPath = this.sys.env.APP_PUBLIC_PATH;
const apiBaseURL = this.sys.config.api.baseURL;
const flavor = this.sys.config.meta.flavor;
```

This distinction is central to writing Zova code that behaves correctly across builds and runtime variants.

## Built-in env variables

Zova provides the following built-in environment variables. Configure them in `zova/env/.env` or in an applicable meta-specific env file.

### App identity and presentation

`SITE_ID`, `APP_NAME`, `APP_TITLE`, `APP_DESCRIPTION`, `APP_VERSION`, `APP_META_VIEWPORT`, `APP_PUBLIC_PATH`, `APP_LOCALE_DEFAULT`, `APP_LOCALE_HEADER_KEY`, `APP_TZ_HEADER_KEY`

### Router settings

`ROUTER_MODE`, `ROUTER_PAGE_HOME`, `ROUTER_PAGE_LOGIN`, `ROUTER_KEY_RETURNTO`

### Development-server settings

`DEV_SERVER_HOSTNAME`, `DEV_SERVER_PORT`, `DEV_SERVER_HMR_PORT`

### Project-disabled suites and modules

`PROJECT_DISABLED_SUITES`, `PROJECT_DISABLED_MODULES`

`PROJECT_DISABLED_SUITES` disables entire suites, including every module in each disabled suite. `PROJECT_DISABLED_MODULES` disables individual modules without disabling their containing suite. Both accept comma-separated relative names.

For example, a production deployment that does not need the e-commerce demonstration suite can set:

```dotenv
PROJECT_DISABLED_SUITES=a-commerce
```

### Build output settings

`LOGGER_CLIENT_DEFAULT`, `BUILD_OUTDIR`, `BUILD_MINIFY`, `BUILD_SOURCEMAP`, `BUILD_TARGET_BROWSER`, `BUILD_TARGET_NODE`, `BUILD_ANALYZE`, `BUILD_COPY_DIST`, `BUILD_COPY_RELEASE`, `BUILD_REST_COPY_DIST`

### API and proxy configuration

`API_BASE_URL`, `API_PREFIX`, `API_JWT`, `OPENAPI_BASE_URL_DEFAULT`, `OPENAPI_BASE_URL_<MODULE>`, `PROXY_API_ENABLED`, `PROXY_API_BASE_URL`, `PROXY_API_PREFIX`

Use `OPENAPI_BASE_URL_<MODULE>` to override the OpenAPI base URL for a specific module. Replace `<MODULE>` with the module's uppercase underscore-separated name, such as `OPENAPI_BASE_URL_HOME_API`.

### SSR-specific values

`SSR_API_BASE_URL`, `SSR_PROD_PORT`, `SSR_PROD_PROTOCOL`, `SSR_PROD_HOST`, `SSR_WITH_VONA`, `SSR_PROFILE`, `SSR_PROFILE_PUBLIC_RESPONSE_CACHE_EXPIRES`, `SSR_PROFILE_SESSION_RESPONSE_CACHE_EXPIRES`, `SSR_COOKIE_THEMEDARK_DEFAULT`

### Mock-server configuration

`MOCK_ENABLED`, `MOCK_LOGGER`, `MOCK_BASE_NAME`, `MOCK_BUILD`, `MOCK_BUILD_PORT`, `MOCK_BUILD_OUTPUT`, `MOCK_BUILD_CORS`

That means many common project-level knobs already exist and should be reused before inventing project-specific patterns.

## Custom flavors

Projects can define custom flavors when built-in variants are not enough.

This usually requires:

- adding scripts that pass the new `--flavor` value
- using `META_FLAVOR` or `sys.config.meta.flavor` in code
- optionally augmenting type definitions for better autocomplete

Representative flavor type extension:

```typescript
declare module '@cabloy/module-info' {
  export interface ZovaMetaFlavorExtend {
    customA: never;
  }
}
```

In the VSCode workflow, the `recordflavor` snippet can generate this augmentation skeleton.

## Async config loading

Frontend config files can also load asynchronously when configuration must be derived from a remote or generated source.

Representative pattern:

```typescript
export default async function (_sys: ZovaSys) {
  const config: ZovaConfigOptional = {};

  // async load remote config

  return config;
}
```

That should be used deliberately, because asynchronous config still participates in the same startup and merge model.

## Relationship to other frontend guides

Read this guide together with:

- [Frontend Scripts](/frontend/scripts)
- [SSR Environment Variables](/frontend/ssr-env)
- [Frontend Quickstart](/frontend/quickstart)
- [App Startup Guide](/frontend/app-startup-guide)
- [System Startup Guide](/frontend/system-startup-guide)

These guides explain the operational script surface, SSR-specific environment concerns, and the monorepo-first starting path.

## Implementation checks for runtime-sensitive changes

When changing frontend runtime-sensitive code, ask:

1. does this behavior depend on mode, appMode, flavor, or more than one of them?
2. should this logic read from `process.env`, `sys.env`, or `sys.config`?
3. is there already a built-in env/config variable for this concern?
4. does the active edition change which flavor or script family is correct?

That helps AI keep frontend runtime behavior aligned with Zova’s actual configuration model.
