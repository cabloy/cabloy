# Backend Source Reading Debug Checklist

This page is a symptom-first diagnostic companion for one narrow backend question:

> something in the backend source-reading path looks wrong; which backend layer is the first failure?

Use this page together with:

- [Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap)
- [Vona Source Reading Map](/backend/vona-source-reading-map)
- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
- [Backend Contract Emission Specimen](/backend/backend-contract-emission-specimen)
- [Backend Contract Emission Source Reading Map](/backend/backend-contract-emission-source-reading-map)
- [Backend Contract Emission Output Inspection](/backend/backend-contract-emission-output-inspection)
- [Backend Source Reading Verify Playbook](/backend/backend-source-reading-verify-playbook)

> [!TIP]
> **Backend source-reading diagnosis path**
>
> 1. **[Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap)** — choose the backend source-reading branch
> 2. **[Backend Source Reading Verify Playbook](/backend/backend-source-reading-verify-playbook)** — use first when you want to prove the path layer by layer
> 3. **[Backend Source Reading Debug Checklist](/backend/backend-source-reading-debug-checklist)** — use this when something already looks wrong and you need the first failing layer
>
> **You are here:** step 3.
> **Previous recommended pages:** [Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap) and [Backend Source Reading Verify Playbook](/backend/backend-source-reading-verify-playbook).

## Why this page exists

The current backend source-reading family already gives you:

- a chooser page
- a broad file-order map
- a module-wiring specimen
- an emission family
- a proof-oriented verify playbook

What was still missing was one symptom-first page.

This page fills that gap.

It is not another concept page and not another source-order map. It is the checklist for isolating the first failing backend source-reading layer.

## Shared symptom: generated/module surface missing or stale

Start here when the problem looks earlier than either the module-wiring branch or the emission branch.

Primary anchors:

- `vona/src/suite/a-training/modules/training-student/src/index.ts`
- `vona/src/suite/a-training/modules/training-student/src/.metadata/index.ts`

What to inspect first:

- does the module entry still re-export the generated surfaces you expect?
- does `.metadata/index.ts` still expose the expected generated registration surface at all?
- is the problem really in generated/module surface visibility rather than in authored controller/service/model/entity/DTO code?

If this layer is already wrong, do not continue into the branch-specific diagnosis yet.

## Module-wiring branch symptoms

Only enter this branch when the issue is clearly about how one backend module is wired.

Primary anchors:

- `vona/src/suite/a-training/modules/training-student/src/controller/student.ts`
- `vona/src/suite/a-training/modules/training-student/src/service/student.ts`
- `vona/src/suite/a-training/modules/training-student/src/model/student.ts`
- `vona/src/suite/a-training/modules/training-student/src/entity/student.tsx`
- `vona/src/suite/a-training/modules/training-student/src/dto/*.tsx`

Typical failures to classify:

### A. Controller/service/model/entity responsibilities no longer line up

Check:

- whether the controller still delegates through the expected service/model path
- whether the entity and DTO source truth still match the intended resource/module chain
- whether the module-wiring specimen page still reflects the actual code path

### B. Generated registration no longer reflects the expected module/resource chain

Check:

- whether `.metadata/index.ts` still exposes the expected controller/model/service/entity/DTO registrations together
- whether the backend source-reading family is now out of sync with the actual generated module surface

If this branch remains unclear, return to [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain) before escalating further.

## Emission branch symptoms

Only enter this branch when the issue is clearly about emitted backend contract truth.

Primary anchors:

- `vona/src/suite/a-training/modules/training-student/src/controller/student.ts`
- `vona/src/suite/a-training/modules/training-student/src/dto/studentSummary.tsx`
- `vona/src/suite/a-training/modules/training-student/src/.metadata/index.ts`
- emitted output surface already used in docs:
  - `http://localhost:7102/swagger/json?version=V31`

Typical failures to classify:

### A. Emitted path missing or stale

Check:

- whether the controller still declares the intended action path
- whether `.metadata/index.ts` still exposes the expected generated route record
- whether the emitted output still includes the expected path

### B. Emitted DTO shape no longer matches expectation

Check:

- whether the named DTO still matches the intended response shape
- whether the emitted schema still reflects that DTO truth

### C. Metadata record and emitted output no longer agree

Check:

- whether the generated registry and the emitted output diverged
- whether the issue is still backend-side and should not yet escalate to frontend bridge debugging

If this branch remains unclear, return to [Backend Contract Emission Specimen](/backend/backend-contract-emission-specimen) and [Backend Contract Emission Output Inspection](/backend/backend-contract-emission-output-inspection) before escalating further.

## Classify the failure last

Only after the branch-local checks should you classify the problem as:

- shared generated/module surface issue
- module-wiring issue
- emission issue
- downstream bridge/generation issue

A practical rule is:

> do not jump into fullstack forward-bridge or frontend debugging until the backend source-reading path itself already looks correct.

## What this page does not re-explain

This page deliberately does **not** re-teach:

- the conceptual backend overview -> see [Backend (Vona)](/backend/introduction)
- the broad chooser and broad file-order map -> see [Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap) and [Vona Source Reading Map](/backend/vona-source-reading-map)
- the module-wiring specimen -> see [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
- the emission concept/specimen/map/output-inspection family
- the fullstack forward bridge -> see [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)

Its job is only to help you isolate the first failing backend source-reading layer.

## Where to read next

- If you need the chooser page first, return to [Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap).
- If you need the broad file-order map first, continue with [Vona Source Reading Map](/backend/vona-source-reading-map).
- If you want the proof-oriented layer-by-layer workflow first, continue with [Backend Source Reading Verify Playbook](/backend/backend-source-reading-verify-playbook).
- If the backend path now looks correct and you want the downstream bridge, hand off to [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).
- If the backend path now looks correct but the real issue is one mixed Student row-action chain, hand off to [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions).
- If you are still unsure which contract direction or drift type actually applies, return to [Contract Loop Playbook](/fullstack/contract-loop-playbook).

## Final takeaway

The cleanest way to debug a backend source-reading path is not to jump immediately into fullstack or frontend consumer debugging.

First isolate:

- whether the generated/module surface itself is present
- whether the failure belongs to the module-wiring branch or the emission branch
- whether the emitted output is wrong before it ever leaves the backend side

Only then hand off to the downstream bridge if you still need it.
