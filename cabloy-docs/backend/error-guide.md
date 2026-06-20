# Error Guide

## Why error matters as a backend scope resource

In Vona, module errors are not only thrown values. They are part of a module-scoped resource model that connects error codes, localized messages, and cross-module reuse.

That matters because backend contracts often need errors that are:

- typed by convention
- localized through module locale resources
- reusable through module scope
- override-friendly at the project level when wording changes are needed

## Initialize the error skeleton

Example: initialize error resources for module `training-student`.

```bash
npm run vona :init:error training-student
```

This gives the module the standard files for defining error codes and their language resources.

## Define module errors

Defining an error takes two main steps.

### 1. Define the error codes

Representative pattern:

```typescript
export const errors = {
  ErrorTest: 1001,
} as const;
```

A useful convention is that business error codes should stay above `1000`.

### 2. Define the localized error messages

Representative locale pattern:

```typescript
export default {
  ErrorTest: 'This is a error test',
};
```

This is the key architectural point: the error definition and the localized wording are related, but they live in separate resources.

## Use error within the current module

The current module’s errors can be reached through scope.

Representative pattern:

```typescript
this.scope.error.ErrorTest.throw();
```

## Use error across modules

Cross-module error access uses the cross-module scope surface.

Representative pattern:

```typescript
this.$scope.trainingStudent.error.ErrorTest.throw();
```

A practical distinction is:

- `this.scope.error` for the current module
- `this.$scope.<module>.error` for another module

## Relationship to locale resources

Module errors are closely connected to module locale resources.

That means this guide should be read together with [I18n Guide](/backend/i18n-guide).

A useful ownership rule is:

- the error code defines the backend exception identity
- locale resources define the user-facing or developer-facing wording
- scope makes both available through the module resource model

## Relationship to backend essentials

Errors are one of the clearest examples of why backend scope matters.

Read this guide together with:

- [Backend Essentials](/backend/backend-essentials)
- [Backend Foundation](/backend/foundation)
- [I18n Guide](/backend/i18n-guide)

## Implementation checks for backend error-handling changes

When editing backend error behavior, ask:

1. should this error be defined as a module-scoped error instead of an inline throw?
2. does the error need localized wording in locale resources?
3. should the error be consumed from the current module or across modules?
4. is the existing module error skeleton the right place to extend instead of inventing a separate error pattern?

That helps AI keep backend error handling aligned with Vona’s module-resource model and localization system.
