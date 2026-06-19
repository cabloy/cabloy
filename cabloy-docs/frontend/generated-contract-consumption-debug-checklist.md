# Generated Contract Consumption Debug Checklist

This page is a symptom-first diagnostic companion for one narrow frontend question:

> when generated contract consumption still looks wrong, which frontend consumer layer should I inspect next?

Use this page together with:

- [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen)
- [Generated Contract Consumption: List Branch](/frontend/generated-contract-consumption-list-branch)
- [Generated Contract Consumption: Entry Branch](/frontend/generated-contract-consumption-entry-branch)
- [Generated Contract Consumption Verify Playbook](/frontend/generated-contract-consumption-verify-playbook)
- [OpenAPI Runtime Under the Hood](/frontend/a-openapi-under-the-hood)
- [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)

> [!TIP]
> **Generated-contract diagnosis path**
>
> 1. **[Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen)** — understand the family and choose the branch
> 2. **[Generated Contract Consumption Verify Playbook](/frontend/generated-contract-consumption-verify-playbook)** — prove what should be true after a change
> 3. **[Generated Contract Consumption Debug Checklist](/frontend/generated-contract-consumption-debug-checklist)** — use this page when the result is already wrong and you need the first failing layer
>
> **You are here:** step 3.
> **Previous recommended pages:** [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen) and [Generated Contract Consumption Verify Playbook](/frontend/generated-contract-consumption-verify-playbook).

## Why this page exists

The current frontend generated-contract family already gives you:

- a conceptual hub
- list and entry branch pages
- a proof-oriented verify playbook

What was still missing was one symptom-first page.

This page fills that gap.

It is not another generation page and not another branch specimen. It is the checklist for isolating the first failing consumer-side layer.

## Shared symptom: contract surface missing or stale

Start here when the problem looks earlier than either list or entry runtime.

Primary anchors:

- `zova/src/module/demo-student/src/apiSchema/demoStudent.ts`
- optional direct schema consumer: `zova/src/suite/a-home/modules/home-passport/src/model/passport.ts`

What to inspect first:

- does the expected generated schema surface exist at all?
- do the expected API/schema methods still exist on the module-level schema bean?
- if the issue is clearly that the generated contract itself never refreshed, stop and hand off to the bridge/regeneration docs instead of debugging consumer pages

## Shared symptom: owner boundary wrong or stale

Start here when the contract surface looks present but consumption still feels wrong across both branches.

Primary anchor:

- `zova/src/module/demo-student/src/model/student.ts`

What to inspect:

- does the thin semantic model still delegate to the stable resource owner?
- did the module accidentally grow a competing second owner for the same contract slice?
- do custom methods such as `summary()` or `deleteForce()` still point at the intended owner-backed consumer path?

If this layer is wrong, do not continue into list or entry runtime yet.

## List branch symptoms

Only enter this branch when the issue is clearly list-page oriented.

Primary anchors:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/resource/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`

Typical failures to classify:

### A. List page renders blank or wrong blocks

Check:

- whether the route shell resolves the expected `resource`
- whether `schemaRow?.rest?.blocks` is actually present
- whether the page is stopping before deeper runtime blocks can render

### B. `schemaRow`, `schemaFilter`, or query state mismatch

Check:

- whether the owner still exposes the expected schema surfaces
- whether `select(query)` is still the active data path
- whether `basic-page:blockPage` is still the deeper list runtime owner

### C. List route shell looks right but visible behavior is still stale

At this point, you may need to hand off to:

- [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive)
- [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)

## Entry branch symptoms

Only enter this branch when the issue is clearly entry-page oriented.

Primary anchors:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockForm/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockToolbarRow/controller.tsx`

Typical failures to classify:

### A. Entry page shows missing data or missing form schema

Check:

- whether `resource`, `id`, and `formScene` resolve correctly
- whether owner-level `formMeta`, `formSchema`, and `formData` still load where expected
- whether the shell is failing before deeper page-entry blocks can render

### B. Wrong `formScene` or wrong toolbar visibility

Check:

- whether the route shell derived the intended `formScene`
- whether `blockToolbarRow` still consumes the expected host context
- whether this is really a narrower action-visibility/form-scene issue rather than a full contract-consumption issue

### C. Submit or page-meta behavior looks out of sync

Check:

- whether `blockForm` still feeds submit/change callbacks back into the shared page-entry owner
- whether the deeper entry runtime still owns page-meta updates rather than scattered local code

If this layer is still unclear, hand off to:

- [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive)
- [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide)

## Classify the failure last

Only after the branch-local checks should you classify the problem as:

- bridge/generation issue
- deeper owner/runtime issue
- list-branch issue
- entry-branch issue

A practical rule is:

> do not start from the deepest runtime layer until the shared contract surface and the stable owner boundary already look correct.

## What this page does not re-explain

This page deliberately does **not** re-teach:

- frontend OpenAPI generation/setup -> see [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- the broader server-data abstraction ladder -> see [Server Data](/frontend/server-data)
- lower `a-openapi` runtime internals -> see [OpenAPI Runtime Under the Hood](/frontend/a-openapi-under-the-hood)
- `ModelResource` internals -> see [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)
- deeper list runtime -> see [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive)
- deeper entry runtime -> see [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive)

Its job is only to help you isolate the first failing frontend consumer layer.

## Where to read next

- If you need the family overview first, return to [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen).
- If you need the list or entry branch specimen first, continue with [Generated Contract Consumption: List Branch](/frontend/generated-contract-consumption-list-branch) or [Generated Contract Consumption: Entry Branch](/frontend/generated-contract-consumption-entry-branch).
- If you want the proof-oriented layer-by-layer workflow first, continue with [Generated Contract Consumption Verify Playbook](/frontend/generated-contract-consumption-verify-playbook).
- If the generated surface itself is missing or stale, hand off to [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk) and [OpenAPI SDK Guide](/frontend/openapi-sdk-guide).
- If the issue is clearly below the current boundary, descend into [OpenAPI Runtime Under the Hood](/frontend/a-openapi-under-the-hood), [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive), [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive), or [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive).

## Final takeaway

The cleanest way to debug generated-contract consumption is not to jump immediately into the deepest runtime files.

First isolate:

- whether the generated contract surface itself is present
- whether the stable owner boundary is still correct
- whether the failure belongs to the list or entry branch

Only then descend into deeper internals if you still need them.
