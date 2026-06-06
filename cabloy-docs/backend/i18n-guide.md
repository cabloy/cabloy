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

Representative files include:

- `src/module/demo-student/src/config/locale/en-us.ts`
- `src/module/demo-student/src/config/locale/zh-cn.ts`

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
const message1 = this.$scope.demoStudent.locale.StudentName();
const message2 = this.$scope.demoStudent.locale.StudentName.locale('en-us');
const message3 = this.$scope.demoStudent.locale.StudentName.locale('zh-cn');
```

## Project-level override

Project-level locale resources can override module-level resources.

Representative override files include:

- `src/backend/config/locale/en-us.ts`
- `src/backend/config/locale/zh-cn.ts`

That means modules can provide defaults while the project still controls final wording when needed.

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

## Plural support

Locale resources can express plural-aware strings through naming conventions such as:

- `TestApples_`
- `TestApples_0`
- `TestApples_1`

Multiple-parameter variants are also supported through ordinal-aware suffix conventions.

This makes plural handling part of the localization model instead of forcing each project to invent its own formatting layer.

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
- [OpenAPI Guide](/backend/openapi-guide)
- [User Access Guide](/backend/user-access-guide)

These guides show how i18n affects entity metadata, API contracts, and user-scoped request behavior.

## Why this matters for AI workflows

When AI edits backend localization-sensitive behavior, it should ask:

1. does this text belong in module locale resources instead of inline strings?
2. should the value respect current locale, current timezone, or both?
3. does the change affect OpenAPI or entity metadata localization?
4. should the project override module defaults instead of editing shared resources directly?

That helps AI keep backend localization aligned with Vona’s real request-context and metadata model.
