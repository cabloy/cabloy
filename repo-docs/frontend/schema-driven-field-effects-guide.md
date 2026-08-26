# Schema-Driven Field Effects Guide

This guide explains how schema-driven field effects work in current Cabloy Basic when backend-owned field metadata drives live frontend form behavior.

Use this page when you want to understand questions such as:

- how can a backend entity field drive frontend form behavior
- what does `ZovaRender.onEffect(...)` actually attach to
- how do `ZovaEvent` and `ZovaCommand` cooperate to update other fields
- when should a derived-field rule live in schema metadata instead of page/controller logic
- which files should I read first for schema-driven field reactivity

Use this page together with:

- [Form Guide](/frontend/form-guide)
- [Zova Form Under the Hood](/frontend/zova-form-under-the-hood)
- [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map)
- [API Schema Guide](/frontend/api-schema-guide)
- [Command Scene Authoring](/frontend/command-scene-authoring)

Use this page after [Form Guide](/frontend/form-guide) when your next question is not only how schema-driven forms render, but how backend-owned field metadata becomes live field-side behavior through `ZovaRender.onEffect(...)`, `ZovaEvent`, and command chains.

## Why this page exists

The current frontend docs already explain nearby pieces well:

- [Form Guide](/frontend/form-guide) explains the public form authoring surface
- [Zova Form Under the Hood](/frontend/zova-form-under-the-hood) explains the runtime cooperation among form controllers, field controllers, schema metadata, and behaviors
- [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map) explains which framework files to read next
- [Command Scene Authoring](/frontend/command-scene-authoring) explains the built-in `command` scene and representative command beans
- [API Schema Guide](/frontend/api-schema-guide) explains why schema metadata can drive frontend behavior

What those pages do not isolate directly is one common cross-layer pattern:

- backend entity metadata contributes frontend render metadata
- field metadata attaches a field-side effect
- the effect emits a declarative event/command chain
- command beans write the result back into form state

That is the gap this page fills.

## The shortest accurate mental model

A practical mental model is:

1. backend entity or DTO schema owns the field metadata truth
2. `ZovaRender.onEffect(...)` adds field-side frontend behavior to that metadata
3. the form runtime turns that metadata into a live field render context
4. a `ZovaEvent` executes one or more `ZovaCommand` nodes declaratively
5. those commands read current field scope and write normalized or derived values back into the form

That means a field effect in Zova is **schema-owned frontend behavior**, not only a page-local callback or ad hoc widget trick.

## What this page is not

This page is not:

- a replacement for [Form Guide](/frontend/form-guide)
- a full command-scene guide instead of [Command Scene Authoring](/frontend/command-scene-authoring)
- a general page-workflow guide for routing, dialogs, submit flow, or page lifecycle orchestration
- the separate `formScene -> formMeta -> pageMeta -> shell/tab state` bridge covered by [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide)

Its job is narrower:

- explain how schema-owned field metadata becomes live field-side behavior
- clarify where `ZovaRender.onEffect(...)`, `ZovaEvent`, `ZovaCommand`, and form runtime each fit
- give a short source-confirmed reading path for this pattern

## A representative specimen

A compact specimen lives in:

```text
vona/src/suite/a-training/modules/training-record/src/entity/record.tsx
```

The key pattern in that file is:

- one shared `onEffectForAverageScore` event chain is declared once
- `subjectCount` and `totalScore` both attach that same effect through `ZovaRender.onEffect(...)`
- the effect first normalizes input through `basic-commandssync:expr`
- the effect then writes the derived `averageScore` through `basic-commands:setValue`

This specimen matters because it demonstrates three durable rules:

1. one field effect can be reused by multiple driving fields
2. normalization can happen before the derived-field writeback
3. the derived-field rule stays declarative and schema-owned rather than being buried in one page-local method

The business example is average score, but the reusable pattern is broader:

- normalize one or more source fields
- compute a small derived value
- write that value back into form state through commands

## Where each concept lives

This topic becomes much easier to read once the layers are separated clearly.

### 1. Entity or DTO field metadata owns schema truth

In current Cabloy Basic authoring, backend-side schema definitions can carry frontend render metadata through `@Api.field(...)` and related helpers.

That metadata is not only validation truth.
It can also describe:

- field order
- render provider selection
- scene-specific behavior
- field-side effects

For the surrounding metadata-driven model, also see [API Schema Guide](/frontend/api-schema-guide).

### 2. `ZovaRender.onEffect(...)` attaches field-side behavior

`ZovaRender.onEffect(...)` belongs on field render metadata.

Its role is not to define a command bean and not to replace a page controller.
Its role is to say:

- when this field participates in runtime interaction
- execute this declarative effect chain in the field runtime context

That keeps the effect attached to the schema-owned field definition instead of scattering it across unrelated page code.

### 3. `ZovaEvent` is the declarative event container

`ZovaEvent` groups one or more command invocations into a small event pipeline.

In this pattern, the important point is not JSX syntax by itself.
The important point is that the field effect stays:

- declarative
- composable
- command-oriented
- readable as metadata-driven behavior rather than imperative widget code

### 4. `ZovaCommand` nodes perform the concrete steps

A `ZovaCommand` node names one concrete action.
In the average-score specimen, two built-in command families matter:

- `basic-commandssync:expr`
- `basic-commands:setValue`

`basic-commandssync:expr` is a small synchronous command bean that returns the evaluated expression result.
A representative source file is:

```text
zova/src/suite/cabloy-basic/modules/basic-commandssync/src/bean/command.expr.tsx
```

`basic-commands:setValue` is the built-in form-field writeback command bean.
A representative source file is:

```text
zova/src/suite/cabloy-basic/modules/basic-commands/src/bean/command.setValue.tsx
```

That `setValue` command is especially important because it checks `renderContext.$scene === 'formField'` and then updates the target field through the live form runtime.
For the command-scene side of that story, see [Command Scene Authoring](/frontend/command-scene-authoring).

### 5. The form runtime provides the live field scope

The field effect does not run against a dead schema object.
It runs inside the form runtime, where the field and form controllers provide live helpers such as current field scope and form-state mutation.

That is why a schema-owned effect can still read current values and write derived values back into the active form.
For the runtime side, see [Zova Form Under the Hood](/frontend/zova-form-under-the-hood) and [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map).

## When this pattern fits well

This pattern fits best when the behavior is:

- field-local or cross-field within one form
- small enough to stay declarative
- closely tied to schema-owned field semantics
- useful across more than one page or runtime path that consumes the same schema truth

Typical good fits include:

- derived fields such as totals, labels, or averages
- lightweight input normalization
- small field-to-field synchronization rules
- metadata-driven behavior that should travel with the backend contract

## When page or controller logic fits better

Do not force every interactive rule into field metadata.

Prefer page/controller logic when the behavior is:

- strongly tied to one page workflow
- asynchronous or orchestration-heavy
- dependent on routing, dialogs, or page lifecycle
- too large or too stateful to stay readable as a field event chain

A practical boundary is:

- if the rule reads like a small schema-owned field behavior, prefer field effects
- if the rule reads like a page workflow, prefer page/controller code

## Source-confirmed reading path

When reading this topic, use this order:

1. `vona/src/suite/a-training/modules/training-record/src/entity/record.tsx`
2. `zova/src/suite/cabloy-basic/modules/basic-commandssync/src/bean/command.expr.tsx`
3. `zova/src/suite/cabloy-basic/modules/basic-commands/src/bean/command.setValue.tsx`
4. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/form/controller.tsx`
5. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/formField/controller.tsx`
6. `zova/src/suite-vendor/a-zova/modules/a-form/src/types/formField.ts`

That order moves from one business-facing specimen, to the effect commands themselves, to the form and field runtime that make the effect live.

## Relationship to other guides

Use these boundaries when choosing the next page:

- if you want public form authoring first, read [Form Guide](/frontend/form-guide)
- if you want general schema-driven metadata behavior, read [API Schema Guide](/frontend/api-schema-guide)
- if you want deeper form runtime cooperation, read [Zova Form Under the Hood](/frontend/zova-form-under-the-hood)
- if you want the shortest file-order map for form internals, read [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map)
- if you want the command-scene runtime model behind named commands, read [Command Scene Authoring](/frontend/command-scene-authoring)
- if you want the separate `formScene -> formMeta -> pageMeta -> shell/tab state` bridge, read [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide)

## Final takeaway

The most accurate way to read schema-driven field effects in current Cabloy Basic is:

- schema metadata owns the field-level behavior contract
- `ZovaRender.onEffect(...)` attaches declarative field-side behavior
- `ZovaEvent` and `ZovaCommand` execute the effect as a small command pipeline
- form runtime scope makes the effect live
- command beans write normalized or derived values back into the active form state

That is the source-confirmed meaning of schema-driven field effects in the current frontend architecture.

## Verification checklist

When documenting or changing this area, verify in this order:

1. confirm the specimen still matches the current `training-record` entity metadata
2. confirm command claims still match `command.expr.tsx` and `command.setValue.tsx`
3. confirm the runtime boundary still matches the current `a-form` form and form-field controllers
4. build the docs site:

   ```bash
   npm run docs:build
   ```

5. verify the page is reachable from the frontend sidebar and related form/command guides
