# Generated Contract Consumption Verify Playbook

This page is a proof-oriented verification companion for one narrow frontend question:

> after generated contract material has already crossed into Zova, what must be true at each layer before I trust the consumer-side path?

Use this page together with:

- [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen)
- [Generated Contract Consumption: List Branch](/frontend/generated-contract-consumption-list-branch)
- [Generated Contract Consumption: Entry Branch](/frontend/generated-contract-consumption-entry-branch)
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- [Server Data](/frontend/server-data)
- [API Schema Guide](/frontend/api-schema-guide)
- [OpenAPI Runtime Under the Hood](/frontend/a-openapi-under-the-hood)
- [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)

> [!TIP]
> **Generated-contract verification path**
>
> 1. **[Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen)** — understand the shared consumer-side path
> 2. **[Generated Contract Consumption: List Branch](/frontend/generated-contract-consumption-list-branch)** or **[Generated Contract Consumption: Entry Branch](/frontend/generated-contract-consumption-entry-branch)** — pick the branch that matches your case
> 3. **[Generated Contract Consumption Verify Playbook](/frontend/generated-contract-consumption-verify-playbook)** — prove the consumer-side path layer by layer
>
> **You are here:** step 3.
> **Previous recommended pages:** [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen), [Generated Contract Consumption: List Branch](/frontend/generated-contract-consumption-list-branch), and [Generated Contract Consumption: Entry Branch](/frontend/generated-contract-consumption-entry-branch).

## Why this page exists

The current frontend generated-contract family already gives you:

- a conceptual hub page
- a list-branch specimen
- an entry-branch specimen

What was still missing was one proof-oriented page that tells you what must be true at each consumer layer after a change.

This page fills that gap.

It is not another generation/config page and not another symptom-first debug page. It is the playbook for proving the consumer-side path is correct.

## Phase 1: Scope the consumer path first

Before checking any details, decide what kind of question you actually have.

### Shared contract-surface question

Use this when the issue is still above the branch split:

- does the generated contract surface exist?
- does the module expose the expected schema/API surface at all?

### List-branch question

Use this when the issue is clearly about:

- list-page schema/data consumption
- `schemaRow`, `schemaFilter`, and `select(query)`
- the route shell and `basic-page:blockPage` handoff

### Entry-branch question

Use this when the issue is clearly about:

- `formMeta`, `formSchema`, `formData`
- `create` / `view` / `update` schema consumption
- the route shell and `basic-pageentry:blockPageEntry` handoff

### Deeper internals question

If the issue is already below these consumer-side layers, stop here and hand off to the deeper internals pages later instead of forcing this playbook to explain everything.

## Phase 2: Prove the generated contract surface

Start with the smallest shared consumer-side anchors.

Primary anchors:

- `zova/src/suite/a-training/modules/training-student/src/apiSchema/trainingStudent.ts`
- optional direct schema consumer: `zova/src/suite/a-home/modules/home-passport/src/model/passport.ts`

What to prove:

- the generated schema access surface exists where expected
- methods such as `select()`, `create()`, `view()`, `update()`, `summary()`, and `deleteForce()` still expose the intended contract slice
- if the module depends on direct schema-driven consumption, the expected request/response schema access still resolves correctly

If this phase fails, do not debug deeper page/runtime behavior yet. The consumer path is already wrong too early.

## Phase 3: Prove the stable owner boundary

Once the generated surface is present, prove that the module still consumes it through the correct owner boundary.

Primary anchor:

- `zova/src/suite/a-training/modules/training-student/src/model/student.ts`

What to prove:

- the module model still keeps `ModelResource` as the stable owner when the API belongs to the same resource
- thin semantic follow-up still delegates correctly to owner-backed query/mutation helpers
- the module did not accidentally invent a competing second owner for the same resource contract

A practical rule is:

> if the generated contract still belongs to the same resource, the consumer path should still stay owner-first.

## Phase 4A: Prove the list branch

Only enter this phase when the problem is clearly on the list-page branch.

Primary anchors:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/resource/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`

What to prove:

- the list route shell resolves the expected `resource`
- `apiSchemasSelect.sdk` still autoloads where expected
- `schemaRow`, `schemaFilter`, and list data flow are still exposed correctly
- `basic-page:blockPage` still becomes the deeper list runtime owner

If this phase passes, the generated contract has successfully crossed into the list branch.

## Phase 4B: Prove the entry branch

Only enter this phase when the problem is clearly on the entry-page branch.

Primary anchors:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockForm/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockToolbarRow/controller.tsx`

What to prove:

- the entry route shell resolves `resource`, `id`, and `formScene`
- owner-level `formMeta`, `formSchema`, and `formData` still load correctly
- `blockForm` and `blockToolbarRow` still consume the correct host context
- the submit and page-meta path still belongs to the deeper page-entry runtime owner rather than scattered local code

If this phase passes, the generated contract has successfully crossed into the entry branch.

## Phase 5: Escalate only after the proof steps pass

Only after the earlier proof steps already pass should you descend into:

- `a-openapi` lower runtime internals
- `ModelResource` internals
- deeper list runtime internals
- deeper entry runtime internals

That is the boundary that keeps this page useful instead of turning it into a full runtime deep dive.

## What this page does not re-explain

This page deliberately does **not** re-teach:

- frontend OpenAPI config/generation -> see [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- the broader server-data abstraction ladder -> see [Server Data](/frontend/server-data)
- the conceptual role of `$apiSchema` -> see [API Schema Guide](/frontend/api-schema-guide)
- lower `a-openapi` runtime internals -> see [OpenAPI Runtime Under the Hood](/frontend/a-openapi-under-the-hood)
- `ModelResource` internals -> see [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)
- deeper list runtime -> see [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive)
- deeper entry runtime -> see [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive)

Its job is only to tell you what must be true at each consumer-side layer before you trust the generated-contract path.

## Where to read next

- If you need the shared consumer-side overview first, return to [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen).
- If you need the list or entry branch specimen first, continue with [Generated Contract Consumption: List Branch](/frontend/generated-contract-consumption-list-branch) or [Generated Contract Consumption: Entry Branch](/frontend/generated-contract-consumption-entry-branch).
- If the visible result is already wrong and you want symptom-first diagnosis, continue with [Generated Contract Consumption Debug Checklist](/frontend/generated-contract-consumption-debug-checklist).
- If the generated surface itself is missing or stale, hand off to [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk) and [OpenAPI SDK Guide](/frontend/openapi-sdk-guide).
- If the issue is below the current boundary, descend into [OpenAPI Runtime Under the Hood](/frontend/a-openapi-under-the-hood), [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive), [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive), or [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive).

## Final takeaway

The cleanest way to verify a generated-contract consumer path is not to jump straight into deep runtime debugging.

First prove:

- the generated contract surface
- the stable owner boundary
- the matching list or entry branch handoff

Only then descend into deeper internals if you still need them.
