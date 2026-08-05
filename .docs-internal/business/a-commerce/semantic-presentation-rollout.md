# A-Commerce Semantic-Presentation Rollout

## Purpose and authority

This is the maintainer execution runbook for the rollout that follows the Coupon Template conformance reference. It implements the delivery sequence in the [PDP/WBS](./pdp-wbs.md), the acceptance requirements in the [test plan](./test-plan.md), and the resource/scene decisions in the [presentation-contract matrix](./presentation-contracts.md). It does not replace the PRD, SRS, ADR 0003, PDP/WBS, test plan, or matrix as an authority source.

Coupon Template remains the first executable reference under `WBS-70-03` and `WBS-70-04`. The retained post-commit CI evidence at [`a93b4c8759056a057f6ddac28c8f54069eb7f10d`](https://github.com/cabloy/cabloy/commit/a93b4c8759056a057f6ddac28c8f54069eb7f10d) is recorded in the [test plan](./test-plan.md#phase-70-semantic-presentation-ci-evidence); both WBS items are `verified`.

## Scope and execution order

The Admin-first rollout is serial:

1. `WBS-80-00` — establish and maintain this resumption control plane;
2. `WBS-80-01` — Catalogue Admin, serially Category → Product → SKU;
3. `WBS-80-02` — Order Admin;
4. `WBS-80-03` — Stock Balance and Stock Audit Admin;
5. `WBS-80-04` — read-only Address Admin.

Do not open source/metadata work for a later WBS item before the preceding item is `verified`. Documentation-only scene-authority preparation may continue while its predecessor awaits CI evidence.

The rollout excludes Cart, Checkout, reservations, payment/refund internals, Coupon Grant/Audit, Shipment as a standalone Resource, and customer presentation pages. They remain independent action/page contracts, not generic Admin Resource follow-ons. A later Web scope must separately define audience, DTO, Model/page ownership, SSR, and browser acceptance.

## Mandatory gates

Every resource slice passes these gates in order:

| Gate                  | Required proof                                                                                                                               | If incomplete                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| A — scene authority   | Matrix row identifies audience, task, information areas, operation DTO membership, and editable/readonly/derived/hidden/snapshot boundaries. | `blocked`; do not alter source.                                       |
| B — renderer decision | Existing shared renderer preserves the documented meaning, or a custom renderer is separately approved.                                      | Stop the forward chain; perform the reverse-chain prerequisite first. |
| C — Vona contract     | Focused generated-metadata test proves DTO membership, layout, renderer identity/options, filter form, and authorized action boundary.       | Correct Vona contract truth; do not regenerate.                       |
| D — forward handoff   | Normal metadata/OpenAPI generation updates consumers with no generated-file edits.                                                           | Diagnose contract or dependency drift.                                |
| E — Admin runtime     | Paired Admin SSR/REST build, dependency synchronization, typecheck, and tagged clean browser scenario pass.                                  | Keep the WBS item `in-progress`.                                      |
| F — regression        | Relevant ownership, lifecycle, snapshot, or stock-invariant tests and the batch-closing clean Commerce browser gate pass.                    | Keep the WBS item `in-progress`.                                      |
| G — durable closure   | Test-plan evidence records revision, database/flavor, commands, results, and CI/job link.                                                    | `implementation-complete`, not `verified` until retained.             |

Use renderer metadata only as a presentation translation. It must not redefine API membership, persistence, validation, authorization, Model ownership, page ownership, customer flow, or SSR privacy. Renderer/action visibility never authorizes a server operation, and visual hiding never substitutes for operation DTO membership.

## Renderer and contract-loop rules

- Prefer existing shared Basic renderers for dates, localized enum labels/selects, cents, resource identities, and structured details. Ordinary values retain default renderers when those preserve their business meaning.
- When shared renderer behavior is insufficient, create and prove the Zova renderer before Vona references it: define the frontend resource, build the affected Admin SSR and REST outputs together, run `npm run deps:vona`, and prove Vona resolves the renderer identity. This reverse-chain prerequisite precedes Vona metadata work.
- For Vona-first changes, update source truth, prove the emitted schema, run the relevant Vona metadata/OpenAPI generation, build `npm run build:zova:commerce:admin`, then run `npm run deps:vona`. Run `npm run deps:zova` only when frontend dependency metadata changed.
- Generated artifacts are proof and handoff only. Never hand-edit them. If expected artifacts are current but Vona sees stale consumers after `npm run deps:vona`, record suspected local dependency drift and follow the repository recovery guidance rather than patching dependencies.
- Do not change persisted fields, `meta.version.ts`, or `vonaModule.fileVersion` in a presentation slice. If a later design genuinely requires a persisted field, stop and obtain the required file-version decision before source changes.

## Session handoff protocol

At the start and end of every work session, update the active WBS row in [progress](./progress.md) and the matching observed-evidence row in the [test plan](./test-plan.md) when results exist. Record the current `HEAD`, `git status --short`, and an affected-file classification:

- baseline/unrelated existing change;
- current WBS source of truth;
- current WBS generated output;
- current WBS tests/evidence/documentation.

Never reset, clean, checkout, stash, or broad-format the working tree as part of this rollout. If generation would overlap a pre-existing change whose ownership is unknown, stop, record the blocker, and classify it before regenerating.

Use this handoff block verbatim for the active slice:

```text
WBS / resource:
Status:
Current revision:
Working-tree classification:
Scope and explicit exclusions:
Audience / task / scene:
Operation DTO boundary:
Information areas and field order:
Editable / readonly / derived / hidden / snapshot / server-authority boundaries:
Shared/custom renderer decision:
Vona source-of-truth paths:
Expected generated and Zova handoff:
Completed gate and evidence:
Commands passed:
Commands still required:
Known blocker / decision needed:
Next single action:
```

Do not infer a completed gate from memory. Link each completed command to retained output or CI evidence. `progress.md` is a concise derived index; the test plan retains command/evidence detail.

## WBS-80-01 Catalogue sub-slice controls

Run Category, Product, and SKU serially. Each resource must retain CI evidence before source or metadata work starts for the next resource; `WBS-80-01` is verified only after all three and the batch-closing regression.

| Resource | In-scope Admin semantic areas                                                   | Required preservation                                                                     |
| -------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Category | identity, parent relation, publication, description, business dates             | Existing CRUD DTO/API boundary and server-side hierarchy checks.                          |
| Product  | identity, Category relation, publication, description, business dates           | Separate public Product DTO/API/model/page boundary and server-authoritative sellability. |
| SKU      | identity, Product relation, lifecycle, `priceCents`, attributes, business dates | Server lifecycle validation, stock/sellability authority, and USD-cent persistence.       |

For SKU, reuse the Coupon Template minor-unit currency configuration only after the matrix confirms equivalent USD-cent semantics. Treat relation labels, SKU attributes, and lifecycle controls as renderer decisions, not reasons to broaden DTOs or controllers. Any relation label or summary absent from the current Admin DTO is an API-contract decision and must not be silently added for layout convenience.

## Later WBS controls

- **Order (`WBS-80-02`):** before layout work, record whether the approved Admin View DTO already contains the required order-line projection. Adding a relation or DTO field is an API-contract decision. Preserve immutable address/coupon/line snapshots, existing action components, and independent server authorization; exclude customer pages and SSR/private-query behavior.
- **Stock (`WBS-80-03`):** Stock Balance and Stock Audit remain operational/read-only presentation surfaces. Keep `available` derived, Audit immutable, and Stock Balance mutation confined to its authorized adjustment command. Do not activate generated Create/Update DTOs merely because they exist. Include PostgreSQL contention proof if changes reach stock mutation/reservation paths.
- **Address (`WBS-80-04`):** Admin remains list/filter/View only. Preserve the separate Web DTO, `ModelAddressMine`, pages, route admission, and hydration behavior. The required negative proof is no Admin Create/Submit/mutation request path.

## Verification command pattern

Run the narrowest relevant verification first, then broaden at slice/batch closure:

```bash
npm run vona :bin:test -- <module-local tests> --flavor=normal
npm run vona :tools:metadata <module>
# run the supported module OpenAPI generation path
npm run build:zova:commerce:admin
npm run deps:vona
npm run deps:zova # only if frontend dependency metadata changed
npm run tsc
npm run test:e2e:commerce:clean -- --grep <purpose-tag>
```

At a WBS batch closure, build both Commerce flavor pairs and run `npm run test:e2e:commerce:clean`. Record the exact revision, database/flavor, commands, results, and CI/job URL in the test-plan evidence before marking the WBS item `verified`.

## Current handoff

```text
WBS / resource: WBS-80-01 / Category Admin semantic-presentation sub-slice
Status: in-progress; Category CI-backed sub-slice passed; WBS-80-01 is not verified until Product/SKU and batch closure complete
Current revision: a3fb481767b8badae538dea33bb238c192498518
Working-tree classification: baseline is clean after publishing the Category source of truth (Category entity/model/DTO/service/locales and shared Basic select normalization), generated output (`commerce-catalog/src/.metadata/index.ts`), and tests/evidence/documentation (Category metadata/runtime test, tagged Commerce E2E, contracts, test plan, progress).
Scope and explicit exclusions: Category-only, Commerce Admin-only. No Product/SKU source work; no generic Resource model/controller/page/route ownership change; no persisted field, migration, `meta.version.ts`, `fileVersion`, filter, indirect-cycle validation, or hand-edited generated REST/OpenAPI artifact.
Audience / task / scene: Commerce Admin `systemAdmin` maintains or finds active-instance Categories through the existing generic Resource Create, Update, View, and List/filter scenes.
Operation DTO boundary: Create/Update remain `name`, optional `parentId`, defaulted `published`, optional `description`; filters remain exactly `name`, `createdAt`; readonly View/List add `parent: { id, name }`, with root Categories omitting `parent`.
Information areas and field order: identity; hierarchy; publication; description; business dates only in readonly View/List scenes.
Editable / readonly / derived / hidden / snapshot / server-authority boundaries: Create/Update inputs are unchanged; View/List facts and `parent` projection are readonly; `iid` and `deleted` stay hidden. `systemAdmin`, active-instance scope, name validation, parent existence, and direct self-parent rejection remain server-side; no snapshot or derived authority is introduced.
Shared/custom renderer decision: reuse `basic-resource:formFieldResourcePicker`/`resourcePicker` for the `parent` relation and `basic-select:formFieldSelect`/`select` for localized `Unpublished`/`Published`. Shared Basic select rendering normalizes SQLite numeric `0`/`1` values against boolean renderer items.
Vona source-of-truth paths: `commerce-catalog` Category entity, model, View/Select DTOs, service, and locales; generic Zova `ModelResource` and Resource pages remain the state/page owner.
Expected generated and Zova handoff: generated Category metadata was refreshed by the supported flow; CI Commerce artifacts were built and `deps:vona` completed without hand edits.
Completed gate and evidence: focused `categoryPresentation.test.ts` passed 2 local tests and passed inside both CI full suites (SQLite 244 pass/10 expected skips; PostgreSQL 254 pass); Commerce CI built paired artifacts, synchronized Vona dependencies, and passed all 15 clean browser scenarios including tagged `ATP-SPC-02`; Vona TypeScript CI passed. [SQLite CI job](https://github.com/cabloy/cabloy/actions/runs/31009315004/job/92317082686), [PostgreSQL CI job](https://github.com/cabloy/cabloy/actions/runs/31009315129/job/92317083264), [Commerce CI job](https://github.com/cabloy/cabloy/actions/runs/31009315183/job/92317083585), and [Vona TypeScript CI job](https://github.com/cabloy/cabloy/actions/runs/31009314978/job/92317082540) retain the evidence. Fixtures use authenticated direct API setup, so Create Submit serialization is not proven.
Commands passed: local `npm run vona :bin:test -- commerce-catalog/test/categoryPresentation.test.ts --flavor=normal`; `npm run build:zova:commerce:admin`; `npm run deps:vona`; `npm run tsc`; `npm run test:e2e:commerce:clean -- --grep @category`; `git diff --check`. CI: SQLite/PG `npm run test`; Commerce `npm run build:zova:commerce`, `npm run deps:vona`, `npm run test:e2e:commerce:clean`; Vona `tsc`.
Commands still required: Product and SKU local gates, then Category batch regression and clean Commerce browser gate at WBS closure.
Known blocker / decision needed: no Category runtime or CI blocker. The approved per-resource CI gate allows Category evidence to unlock Product source work; `WBS-80-01` remains in-progress until Product, SKU, and batch closure complete.
Next single action: complete Product scene authority and renderer decisions before Product source work.
```

## Related records

- [A-Commerce internal planning index](./README.md)
- [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md)
- [Test Strategy and Acceptance Plan](./test-plan.md)
- [Delivery Progress](./progress.md)
- [Presentation contracts](./presentation-contracts.md)
- [ADR 0003: Establish Semantic Presentation Contracts](./decisions/0003-semantic-presentation-contracts.md)
