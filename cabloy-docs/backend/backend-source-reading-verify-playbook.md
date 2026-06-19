# Backend Source Reading Verify Playbook

This page is a proof-oriented verification companion for one narrow backend question:

> after I have chosen a backend source-reading path, what must be true at each backend layer before I trust it?

Use this page together with:

- [Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap)
- [Vona Source Reading Map](/backend/vona-source-reading-map)
- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
- [Backend Contract Emission Specimen](/backend/backend-contract-emission-specimen)
- [Backend Contract Emission Source Reading Map](/backend/backend-contract-emission-source-reading-map)
- [Backend Contract Emission Output Inspection](/backend/backend-contract-emission-output-inspection)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)

> [!TIP]
> **Backend source-reading verification path**
>
> 1. **[Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap)** — choose the backend source-reading branch
> 2. **[Vona Source Reading Map](/backend/vona-source-reading-map)**, **[Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)**, or the emission family — inspect the relevant branch/specimen first
> 3. **[Backend Source Reading Verify Playbook](/backend/backend-source-reading-verify-playbook)** — prove the backend-side path layer by layer
>
> **You are here:** step 3.
> **Previous recommended pages:** [Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap) and [Vona Source Reading Map](/backend/vona-source-reading-map).

## Why this page exists

The current backend source-reading family already gives you:

- a chooser page
- a broad file-order map
- a module-wiring specimen
- an emission specimen/map/inspection family

What was still missing was one proof-oriented page that tells you what must be true at each backend layer before you trust the path.

This page fills that gap.

It is not another concept page and not another file-order map. It is the verification playbook for backend source-reading.

## Phase 1: Scope the backend branch first

Before checking details, decide which backend branch you are actually in.

### Module-wiring branch

Use this branch when the question is about:

- how controller, service, model, entity, and DTO layers still connect
- whether generated metadata still reflects the intended module/resource shape
- whether the current module-wiring specimen still matches the real code path

### Contract-emission branch

Use this branch when the question is about:

- whether controller + DTO + entity metadata still shape the emitted backend contract correctly
- whether generated metadata records and emitted OpenAPI output still agree
- whether the backend side is ready to hand off into the forward bridge

### Emitted-output inspection only

Use this branch when the input-side source path already looks correct and you only need to verify the emitted output surface itself.

## Phase 2: Prove the shared generated/module anchor surfaces

Start with the smallest shared backend anchors.

Primary anchors:

- `vona/src/module/demo-student/src/index.ts`
- `vona/src/module/demo-student/src/.metadata/index.ts`

What to prove:

- the module entry still re-exports the generated surfaces where expected
- the generated registration surface still exposes the expected controller/model/service/entity/DTO path
- the current source-reading/specimen docs still line up with the actual generated module surface

If this phase fails, do not continue into either branch. The backend source-reading path is already wrong too early.

## Phase 3A: Prove the module-wiring branch

Only enter this phase when the question is clearly about module wiring.

Primary anchors:

- `vona/src/module/demo-student/src/controller/student.ts`
- `vona/src/module/demo-student/src/service/student.ts`
- `vona/src/module/demo-student/src/model/student.ts`
- `vona/src/module/demo-student/src/entity/student.tsx`
- `vona/src/module/demo-student/src/dto/*.tsx`

What to prove:

- controller, service, model, entity, and DTO layers still connect as expected
- the generated metadata still reflects the intended module/resource chain
- the current specimen path still matches the actual backend code path

If this phase passes, the backend source-reading path is correct enough to trust the module-wiring branch.

## Phase 3B: Prove the contract-emission branch

Only enter this phase when the question is clearly about emitted backend contract truth.

Primary anchors:

- `vona/src/module/demo-student/src/controller/student.ts`
- `vona/src/module/demo-student/src/dto/studentSummary.tsx`
- `vona/src/module/demo-student/src/.metadata/index.ts`
- emitted output surface already used in docs:
  - `http://localhost:7102/swagger/json?version=V31`

What to prove:

- the controller action still declares the intended emitted path and response contract
- the named DTO still matches the intended emitted response shape
- generated metadata records still line up with emitted route/DTO presence
- the emitted output surface itself still reflects those backend inputs

If this phase passes, the backend emission branch is correct enough to hand off to the forward bridge.

## Phase 4: Escalate only after the backend proof steps pass

Only after the earlier proof steps pass should you descend into:

- fullstack forward-bridge docs
- frontend generation/consumption docs
- deeper consumer-side verification

That is the boundary that keeps this page backend-side and source-reading focused.

## What this page does not re-explain

This page deliberately does **not** re-teach:

- the conceptual backend overview -> see [Backend (Vona)](/backend/introduction)
- controller/service/model/entity/DTO concept guides
- the broad chooser and broad file-order map -> see [Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap) and [Vona Source Reading Map](/backend/vona-source-reading-map)
- the module-wiring specimen -> see [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
- the emission family pages -> see [OpenAPI Guide](/backend/openapi-guide), [Backend Contract Emission Specimen](/backend/backend-contract-emission-specimen), [Backend Contract Emission Source Reading Map](/backend/backend-contract-emission-source-reading-map), and [Backend Contract Emission Output Inspection](/backend/backend-contract-emission-output-inspection)
- the fullstack forward bridge -> see [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)

Its job is only to tell you what must be true at each backend layer before you trust the source-reading path.

## Where to read next

- If you need the chooser page first, return to [Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap).
- If you need the broad file-order map first, continue with [Vona Source Reading Map](/backend/vona-source-reading-map).
- If the backend result already looks wrong and you want symptom-first diagnosis, continue with [Backend Source Reading Debug Checklist](/backend/backend-source-reading-debug-checklist).
- If the backend path is now proven and you want the downstream bridge, hand off to [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).
- If the backend truth is proven but the real problem is one mixed Student row-action chain, hand off to [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions).
- If you are still unsure which contract direction or drift type actually applies, return to [Contract Loop Playbook](/fullstack/contract-loop-playbook).

## Final takeaway

The cleanest way to verify a backend source-reading path is not to jump straight into downstream frontend generation or the broadest concept docs.

First prove:

- the shared generated/module surface
- the relevant module-wiring or emission branch
- the emitted output surface when needed

Only then hand off to the fullstack bridge if you still need the downstream path.
