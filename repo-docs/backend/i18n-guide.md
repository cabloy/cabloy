# I18n Guide

## Why i18n matters in Vona

Vona treats locale and timezone handling as framework-level backend capabilities rather than ad hoc request helpers.

That matters because backend contracts, entity metadata, user-facing messages, and request-context behavior all need consistent localization rules.

## The two main i18n dimensions

In the backend docs, i18n is best understood through two related dimensions:

- **locale** for language resources and localized metadata
- **timezone** for request-context time interpretation

## Module locale resources

Each module can provide its own locale resources.

Representative initialization workflow:

```bash
npm run vona :init:locale training-student
```

Representative files include:

- `src/suite/a-training/modules/training-student/src/config/locale/en-us.ts`
- `src/suite/a-training/modules/training-student/src/config/locale/zh-cn.ts`

This makes localization part of the module model rather than a single global string table. Ordinary dictionaries are exported through `resource.locales`; metadata generation continues to read `src/config/locale`.

### Cross-module language providers

A language provider supplies translations for existing target modules without taking ownership of their message keys. The framework supports provider modules on both Vona and Zova; the Japanese (`ja-jp`) resources below illustrate an application-authored provider, not a bundled language pack. Author or install the providers your application needs. Installing a provider supplies resources; it does **not** enable that language in application policy.

A Vona provider declares `vonaModule.capabilities.locale: true` in its `package.json` and authors a separate export:

```typescript
// src/locales/ja-jp.ts
export default {
  modules: {
    'training-student': {
      StudentName: '受講生氏名',
    },
  },
};
```

```typescript
// src/locales/index.ts
import jaJP from './ja-jp.ts';

export const localesProvider = {
  'ja-jp': jaJP,
};
```

The module's `src/index.ts` re-exports `localesProvider` from `./locales/index.ts`. Larger dictionaries can compose authored helper files such as `src/lib/locales/training-student.ts`.

The `modules` envelope is structural: its keys identify target modules, not a new business scope owned by the provider. Only targets present in effective module metadata receive contributions. Optional top-level **string** entries are global messages; `modules` itself is never a text key. Providers need no blanket dependencies on translated targets and must not import those targets merely to contribute text.

For a target's scoped key, registration precedence is **project target override → provider contribution → ordinary target dictionary**. Global collisions retain stable first-registration-wins behavior; scoped lookup takes priority over global lookup. Avoid relying on collisions between independent providers as a product customization mechanism.

### Generation and reload boundaries

From the repository root, refresh metadata for an existing module, replacing `<module>` with its relative module name:

```bash
npm run vona :tools:metadata <module>
```

Metadata generation still handles ordinary `src/config/locale` resources; it neither discovers nor generates the provider's `src/locales` map. Keep `localesProvider` and its entrypoint export authored. Do not add dummy provider `en-us` files or expect English-base key/scope inference for provider-owned resources. `:init:locale` initializes **ordinary** locale resources, not a provider scaffold. Do not hand-edit generated consumers to add provider dictionaries.

Provider files and imported helper edits/deletions take effect through the existing development reload/restart and application reinitialization path, not a new live registry API. Vona retains its `moduleLoading` → configuration/locales → `moduleLoaded` lifecycle; do not assume provider translations are available in an earlier `moduleLoading` hook. Frontend early registration and lazy-target behavior are described in [System Startup Guide](/frontend/system-startup-guide).

## Accessing locale resources

Backend code can access locale resources through the module scope.

### Current-module access

```typescript
const message1 = this.scope.locale.StudentName();
const message2 = this.scope.locale.StudentName.locale('en-us');
const message3 = this.scope.locale.StudentName.locale('zh-cn');
```

### Cross-module access

```typescript
const message1 = this.$scope.trainingStudent.locale.StudentName();
const message2 = this.$scope.trainingStudent.locale.StudentName.locale('en-us');
const message3 = this.$scope.trainingStudent.locale.StudentName.locale('zh-cn');
```

## Project-level override

Project-level locale resources can override module-level resources.

Representative override files include:

- `src/backend/config/locale/en-us.ts`
- `src/backend/config/locale/zh-cn.ts`

That means modules can provide defaults while the project still controls final wording when needed.

A useful ownership rule is:

- module locale files define reusable defaults close to the module
- project locale files adjust wording for the current application
- request context decides which locale is active for the current call

## Current locale in request context

The current locale is available on the request context.

### Get current locale

```typescript
const locale = this.ctx.locale;
```

### Set current locale

```typescript
this.ctx.locale = 'en-us';
```

### Get default locale

```typescript
const localeDefault = this.app.config.locale.default;
```

## Locale configuration and resolution order

The root application configuration owns the enabled languages and the sole configured default. For example, inside the existing root config factory in `vona/src/backend/config/config/config.ts`:

```typescript
config.locale = {
  items: {
    'en-us': 'LanguageEnglish',
    'zh-cn': 'LanguageChinese',
    'ja-jp': 'LanguageJapanese',
    'zh-tw': 'LanguageTraditionalChinese',
  },
  default: 'en-us',
};
```

This is an explicit four-language policy example, not the ordinary Basic default: Basic enables `en-us`/`zh-cn` by default. Keep the matching frontend root policy aligned as described in [Environment and Config Guide](/frontend/environment-config-guide). Adding dictionaries or extending `ILocaleRecord` alone does not enable a language.

A later configuration layer's `locale.items` **replaces** the earlier enabled set; it does not add languages to it. The final map must be nonempty, have canonical lowercase hyphenated locale keys and string label values, and contain `locale.default` as an own key. Invalid policy fails validation rather than silently inventing a language set.

The `a-locale` module retains transport settings such as `queryField`, `headerField`, `cookieField`, cookie-write options and `localeAlias`. It is not the owner of enabled/default policy.

### Migrating the old default setting

Remove obsolete `a-locale` `locale.defaultLocale` configuration and replace it with root `config.locale.default`; explicitly define the enabled `config.locale.items` set and align the frontend policy. Change reads of `this.$scope.locale.config.locale.defaultLocale` to `this.app.config.locale.default`. The old module setting is not a second default or a compatibility override. Existing transport and timezone settings remain under `a-locale`.

### Active selection versus message fallback

The current locale takes the first nonempty input in this order:

- query field
- header field
- cookie field
- user locale
- `Accept-Language` (the first supported candidate)
- configured root default

Selection normalizes input by trimming, replacing underscores with hyphens, and lowercasing. Aliases are resolved against the enabled own keys; an alias cannot enable a disabled language. Unknown or disabled input resolves to the configured default. In particular, an explicit but disabled query/header/cookie value does not bypass policy by falling through to another language source. Assigning `ctx.locale` uses the same enabled-policy boundary.

An explicit low-level lookup such as `StudentName.locale('ja-jp')` is different: it can read installed resources without activating Japanese for requests or language menus. Missing-message lookup follows this sequence:

1. requested-locale target dictionary;
2. requested-locale global dictionary;
3. `en-us` target dictionary;
4. `en-us` global dictionary;
5. the original message key.

The configured default controls **active-language selection**, not this missing-text fallback. There is no implicit `zh-tw` → `zh-cn` fallback. Keep missing text, disabled selection and uninstalled resources distinct when diagnosing a result.

## Adding a new language

Vona ships with default locales such as `en-us` and `zh-cn`, and additional languages can be added through interface merging and new locale files.

That means locale support is extensible at the type level as well as the resource-file level.

Representative type extension:

```typescript
declare module 'vona' {
  export interface ILocaleRecord {
    'zh-tw': never;
  }
}
```

In the VSCode workflow, the `recordlocale` snippet can generate the augmentation skeleton.

## Formatting locale text

Locale values use printf-style placeholders. Pass formatting values after the locale key:

```typescript
// en-us.ts
export default {
  Apples_: '%d apples',
  Greeting: '%s has %d apples',
};
```

```typescript
this.scope.locale.Apples_.locale('en-us', 2);
// 2 apples

this.scope.locale.Greeting.locale('en-us', 'Mike', 2);
// Mike has 2 apples
```

Common placeholders include:

- `%s`: string
- `%d`: number
- `%i`: integer
- `%f`: floating-point number
- `%j`: JSON
- `%%`: literal percent sign

## Plural and value-specific support

Locale resources can express special messages for exact numeric values through key suffixes:

```typescript
export default {
  Apples_: '%d apples',
  Apples_0: 'no apples',
  Apples_1: 'one apple',
};
```

The suffix selects a special message based on the first formatting argument:

```typescript
this.scope.locale.Apples_.locale('en-us', 0);
// no apples

this.scope.locale.Apples_.locale('en-us', 1);
// one apple

this.scope.locale.Apples_.locale('en-us', 2);
// 2 apples
```

The base key is used when no value-specific key matches. Therefore, it is not necessary to define a special key for every possible number.

For a numeric value that is not the first formatting argument, use this naming convention:

```text
<baseKey>_<matchedValue>_<argumentIndex>
```

The argument index is zero-based. For example:

```typescript
export default {
  NameApples_: '%s has %d apples',
  NameApples_0_1: '%s has no apples',
  NameApples_1_1: '%s has one apple',
};
```

Here:

- `NameApples_0_1` matches `args[1] === 0`, the second formatting argument;
- `NameApples_1_1` matches `args[1] === 1`, the second formatting argument;
- `NameApples_` is used for other values.

```typescript
this.scope.locale.NameApples_.locale('en-us', 'Mike', 0);
// Mike has no apples

this.scope.locale.NameApples_.locale('en-us', 'Mike', 1);
// Mike has one apple

this.scope.locale.NameApples_.locale('en-us', 'Mike', 2);
// Mike has 2 apples
```

This is exact numeric-value selection, not automatic `Intl.PluralRules` or CLDR plural-category resolution. It makes common plural handling part of the localization model while allowing each locale to define its own wording.

## Text, formatting, and validation boundaries

A language pack provides text, not a general date/number/currency formatting redesign. The printf placeholders and exact numeric suffixes above do not supply locale-aware decimal separators, currency rules or calendar formatting. Use the application's existing formatter (for example, `Intl.NumberFormat` or a date library) with deliberate locale/timezone options where those semantics are required. Request timezone and active language are related inputs, not interchangeable values.

Cabloy Basic keeps its existing `home-base` Zod registrations for `en-us` → `en` and `zh-cn` → `zhCN`; installing Japanese or Traditional Chinese dictionaries does not add Zod error locales. In a real business application, import and register the Zod resources corresponding to the languages that application enables, on both backend and frontend.

For example, if the business application enables all four languages, extend its existing `home-base` adapters with:

```typescript
import { en, ja, zhCN, zhTW } from 'zod/locales';

const localeErrors = {
  'en-us': en,
  'zh-cn': zhCN,
  'ja-jp': ja,
  'zh-tw': zhTW,
};
```

In the backend adapter's `moduleLoaded`, register the map with `this.app.util.setLocaleErrors(localeErrors, this.app.config.locale.default)`. In the frontend adapter, keep registration inside the existing `if (process.env.CLIENT)` boundary and call `this.app.util.setLocaleErrors(localeErrors, this.sys.config.locale.default)`. Import only the resources the business application's enabled policy requires; this example is not a request to change Basic's default registrations.

Dictionary text and Zod error text come from different owners; do not duplicate vendor validation messages inside a provider. Frontend registration is client-only, so this mapping alone does not promise identical SSR validation execution. See [Validation Guide](/backend/validation-guide) and [Zod Guide](/frontend/zod-guide).

Localized OpenAPI metadata remains backend contract truth. Frontend `$apiSchema` and `ModelResource` projections are locale-scoped reactive state: reacquire the current facade or derived schema after a locale change instead of retaining a snapshot from the previous locale. Compatible ordinary dirty fields can survive schema refresh, while an opaque custom renderer with translated options may reset to its server baseline; do not promise universal input preservation. See [API Schema Guide](/frontend/api-schema-guide) and [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern).

## Timezone support

Vona also tracks timezone in the request context.

### Get current timezone

```typescript
const tz = this.ctx.tz;
```

### Set current timezone

```typescript
this.ctx.tz = 'America/New_York';
```

A representative use case is parsing request-driven date filters with the current timezone instead of assuming server-local time:

```typescript
const dateStart = DateTime.fromISO(dateStartStr, { zone: this.ctx.tz });
```

The `a-locale` module exposes timezone settings such as:

- `defaultTz`
- `queryField`
- `headerField`
- `cookieField`

The current timezone is resolved in this order:

- query field
- header field
- cookie field
- user timezone
- default timezone
- system timezone fallback

## OpenAPI and entity metadata localization

One of the most important backend i18n capabilities is that entity and OpenAPI-facing metadata can be localized.

Representative helpers include:

- `$localeScope(...)`
- module-local `$locale(...)`

That allows fields such as `title`, `description`, or other metadata to stay machine-readable while still producing localized developer-facing output.

## Relationship to other backend guides

Read this guide together with:

- [Entity Guide](/backend/entity-guide)
- [Error Guide](/backend/error-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [User Access Guide](/backend/user-access-guide)

These guides show how i18n affects entity metadata, API contracts, and user-scoped request behavior.

## Implementation checks for backend localization changes

When editing backend localization-sensitive behavior, ask:

1. does this text belong in module locale resources instead of inline strings?
2. should the value respect current locale, current timezone, or both?
3. does the change affect OpenAPI or entity metadata localization?
4. should the project override module defaults instead of editing shared resources directly?

That helps AI keep backend localization aligned with Vona’s real request-context and metadata model.
