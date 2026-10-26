# Module Scope

## Why module scope matters in Zova

Zova uses module scope as the unified resource facade for frontend modules.

That matters because business code needs a consistent way to access module resources such as config, locale, errors, APIs, and related metadata without scattering unrelated access patterns through every page or component.

## What scope is

A `Scope` instance is the module-facing object that exposes the resources of a module in one place.

This is one of the main reasons Zova can keep dependency lookup concise while still preserving strong structure.

## `this.scope`

All beans inherit from `BeanBase`, so the current module scope is directly available through:

```typescript
this.scope;
```

This gives the current bean a natural way to access the resources of its own module.

## Main scope resource categories

Representative scope members include:

- `config`
- `constant`
- `locale`
- `error`
- `api`
- `apiSchema`

These categories make module resources discoverable and consistently organized.

## Initialize scope-backed resources

Representative CLI entrypoints include:

```bash
npm run zova :init:config training-student
npm run zova :init:constant training-student
npm run zova :init:locale training-student
npm run zova :init:error training-student
npm run zova :create:bean api test -- --module=training-student
```

This matters because scope is not just a read surface. It is the organized destination for resources generated or initialized through the standard Zova workflow.

## `config`

Module config belongs in the scope model so business logic can read feature-specific configuration in a structured way.

Representative access pattern:

```typescript
console.log(this.scope.config.title);
```

Projects can also override module-level config through project-level frontend config, which makes scope a bridge between reusable module defaults and app-specific customization.

## `constant`

Module constants can live in scope so feature-level constant values remain namespaced and easy to access.

Representative access pattern:

```typescript
console.log(this.scope.constant.gender.male);
console.log(this.scope.constant.gender.female);
```

## `locale`

Module locale resources are exposed through scope so frontend code can retrieve localized text in a module-aware way.

Representative access patterns:

```typescript
const message1 = this.scope.locale.HelloWorld();
const message2 = this.scope.locale.HelloWorld.locale('en-us');
```

Project-level locale resources can override module-level locale values, which is one of the key reasons scope stays useful even when the final app wants customized wording.

### Ordinary dictionaries and language providers

Frontend locale resources have two distinct authoring paths:

| Resource                   | Authored source                                      | Module resource export     | Purpose                                                  |
| -------------------------- | ---------------------------------------------------- | -------------------------- | -------------------------------------------------------- |
| Ordinary module dictionary | `src/config/locale/<locale>.ts`                      | Generated `locales`        | Define the module's own message keys and default wording |
| Language provider          | `src/locales/<locale>.ts` and `src/locales/index.ts` | Authored `localesProvider` | Supply translations for multiple target modules          |

For example, `training-student` retains ownership of keys such as `Name` and their business meaning. An application-authored Japanese provider translates those keys; it does not acquire the student module's business ownership or generate its own `scope.locale.Name()`. The provider below is an authoring example, not a bundled language pack.

A provider declares its capability in the module's `package.json`:

```json
{
  "zovaModule": {
    "capabilities": {
      "locale": true
    }
  }
}
```

Provider resources use a `modules` envelope containing flat dictionaries keyed by target-module relative names:

```typescript
// Provider src/locales/ja-jp.ts
export default {
  modules: {
    'training-student': {
      Name: '名前',
    },
  },
};
```

Author the locale-code map explicitly and re-export it from the module entrypoint:

```typescript
// Provider src/locales/index.ts
import jaJp from './ja-jp.ts';

export const localesProvider = {
  'ja-jp': jaJp,
};
```

```typescript
// Provider src/index.ts; retain other existing exports
export { localesProvider } from './locales/index.ts';
```

`modules` is resource structure, not a translatable message key. The runtime registers this example under `training-student`, not under the provider's own scope. Providers can also contribute top-level global strings, but global resources and scoped dictionaries occupy different lookup levels; a same-named global key is not a universal override of every module.

Larger providers can compose per-target files from `src/lib/locales/<target-module>.ts`, importing them into `src/locales/ja-jp.ts` with the actual `.ts` source suffix. Helper filenames are not locale IDs. Author or install the provider modules your application needs; framework support alone does not supply Japanese or Traditional Chinese dictionaries. Installing a provider does not enable its language; see [Locale enablement and defaults](/frontend/environment-config-guide#locale-enablement-and-defaults).

### Override precedence and missing-message fallback

For the same target module, language, and message key, precedence is:

```text
Project target-module override > provider > ordinary target dictionary
```

Author project overrides in `zova/src/front/config/locale/<locale>.ts`, again using `modules: { 'training-student': { ... } }`, and include the locale in `zova/src/front/config/locales.ts`. Override only the messages the application needs to customize, rather than copying a whole provider. When providers contribute the same key, the first registration in stable module order wins; use project overrides for application-specific wording instead of relying on provider collisions.

Override precedence is separate from missing-message lookup. Ordinary text lookup tries:

```text
Target current language → global current language → target en-us → global en-us → original key
```

`config.locale.default` selects the active language when a selection is absent or invalid. It **does not replace `en-us` as the missing-message fallback**. For example, choosing `ja-jp` as the default does not make a missing `zh-tw` message fall back to Japanese, nor is there an implicit `zh-tw` to `zh-cn` fallback.

### CLI and metadata boundaries

From the repository root, `npm run zova :init:locale <module>` initializes ordinary `src/config/locale/` resources and refreshes module metadata by default. It is not a generator for the provider layout above.

`npm run zova :tools:metadata <module>` scans only `src/config/locale/*.ts` for ordinary locale generation, producing `src/.metadata/locales.ts` and the target module's scope types. It does not scan provider `src/locales/` or `src/lib/locales/`, or infer provider-owned message keys from a `modules` envelope. The provider locale map and entrypoint `localesProvider` export remain authored source, preserved by normal metadata refresh. A single-language provider needs no dummy `en-us.ts` for type generation.

When adding an ordinary message key, update the target module's ordinary dictionaries first and refresh that target's metadata. Do not hand-edit generated files or bypass missing keys with type assertions. For language type declarations, placeholders, and numeric variants, see [I18n Guide](/backend/i18n-guide). Frontend declarations extend `ILocaleRecord` in `zova` and must remain reachable through the module's authored type exports.

### Text translation and formatting limits

Providers supply static text translations, not automatic translation of hard-coded strings or complete date, number, and currency localization. Text placeholders and exact numeric variants share the backend conventions described in [Formatting locale text](/backend/i18n-guide#formatting-locale-text); frontend code does not need another message-format system.

The existing `basic-date` utility uses Luxon `format` / `preset` options, and `basic-currency` uses separate `CurrencyOptions`. These utilities do not uniformly receive locale policy from `app.meta.locale.current`. Inspect the specific component and formatter when regional date, number, currency, or timezone presentation is required. Installing a provider or setting a default language alone does not complete that formatting work.

### Diagnose locale typing at its source

Use `this.scope.locale.SomeKey()` directly. Its type is generated from the module locale source and module metadata; do not add a local type assertion, compatibility helper, or cast merely to silence a missing-key error.

When a locale key is missing or incorrectly typed:

1. Inspect `src/config/locale/` for the module.
2. If that directory does not exist, initialize it through the standard command:

   ```bash
   npm run zova :init:locale <module>
   ```

   The normal initializer path also refreshes module metadata.

3. Add the key to every required locale source file.
4. If locale sources are complete but `this.scope.locale` is still stale, run the focused metadata refresh:

   ```bash
   npm run zova :tools:metadata <module>
   ```

Then return to direct `this.scope.locale.SomeKey()` usage. Repairing the locale source and generated metadata preserves the module contract for every consumer.

## `error`

Module-specific errors are exposed through scope so business code can throw namespaced error definitions without inventing ad hoc exception patterns.

Representative access pattern:

```typescript
this.scope.error.ErrorTest.throw();
```

## `api`

Backend API calls can be wrapped as module `api` resources and accessed through scope.

This is one of the most practical scope categories because it keeps request logic close to the module boundary instead of scattering raw request paths through page code.

Representative access pattern:

```typescript
const res = await this.scope.api.test.echo();
```

## `apiSchema`

Schema-oriented API metadata can also be exposed through scope when higher-level frontend behavior depends on API metadata directly.

## Cross-module scope access

Zova also supports cross-module scope access through `@UseScope()`.

Representative pattern:

```typescript
@UseScope()
$$scopeTrainingStudent: ScopeModuleTrainingStudent;
```

A common follow-up access pattern is:

```typescript
const res = await this.$$scopeTrainingStudent.api.test.echo();
console.log(this.$$scopeTrainingStudent.locale.HelloWorld());
```

This allows one module to consume another module’s scoped resources explicitly without flattening everything into one shared global namespace.

Compiler support also lets `@UseScope()` participate in async module loading behavior, which fits naturally with Zova’s module-level bundle boundaries.

## Why this matters for architecture

Module scope is a key bridge between:

- modularization
- IoC and bean lookup
- API access
- locale and error handling
- project-level override behavior

That makes scope one of the most important frontend concepts to understand before extending a larger Zova application.

## Relationship to other frontend guides

Read this together with:

- [IoC and Beans](/frontend/ioc-and-beans)
- [Modules and Suites](/frontend/modules-and-suites)
- [API Guide](/frontend/api-guide)
- [Server Data](/frontend/server-data)

These guides explain how scope fits into bean architecture, module boundaries, and data-access design.

## Implementation checks for module-scope changes

When editing Zova frontend code, ask:

1. should this resource be accessed through `this.scope` instead of a direct ad hoc import?
2. does the logic belong to the current module or another module’s scope?
3. should cross-module access use `@UseScope()`?
4. is this concern best modeled as config, constant, locale, error, api, or apiSchema?

That helps AI keep frontend resource access aligned with Zova’s intended module architecture.
