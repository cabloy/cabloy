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

This makes localization part of the module model rather than a single global string table.

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
const localeDefault = this.$scope.locale.config.locale.defaultLocale;
```

## Locale configuration and resolution order

The `a-locale` module exposes locale settings such as:

- `defaultLocale`
- `queryField`
- `headerField`
- `cookieField`

The current locale is resolved in this order:

- query field
- header field
- cookie field
- user locale
- `Accept-Language`
- default locale

This is important because locale is not guessed from only one source.

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
