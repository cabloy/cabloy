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
WBS / resource: WBS-80-01 / SKU Admin semantic-presentation sub-slice
Status: verified; Category, Product, SKU, and the batch-closing Commerce regression have retained CI evidence
Current revision: `345ed338ebcff8457d7b8918a0ffe8b31491a43c`
Working-tree classification: baseline contains the CI-closed Category/Product source, generated output, tests, and retained evidence; the current revision contains the SKU snapshot-fixture test repair. The approved SKU entity/DTO source, focused metadata/runtime test, tagged Commerce Admin browser scenario, and regenerated handoff remain intact. No environment file or persisted schema/version path changed.
Scope and explicit exclusions: SKU-only, Commerce Admin semantic-presentation authority and renderer decisions. No generic Resource model/controller/page/route ownership change; no public catalogue or customer UI change; no stock, sellability, persistence, migration, `meta.version.ts`, `fileVersion`, filter expansion, Product-label relation projection, attribute DTO expansion, or hand-edited generated artifact.
Audience / task / scene: Commerce Admin active-instance `systemAdmin` maintains or finds SKUs through the existing generic Resource Create, Update, View, and List/filter scenes.
Operation DTO boundary: Create/Update are exactly `code`, `productId`, `priceCents`, and optional `lifecycle`; View/List preserve the approved readonly fields and existing operations; filters remain exactly `code`, `createdAt`. `attributes` is absent from the current generic Admin DTO boundary. No Product response projection is included.
Information areas and field order: identity/code; Product ID; USD-cent price; lifecycle; structured attributes remain deferred; business dates only in readonly View/List scenes.
Editable / readonly / derived / hidden / snapshot / server-authority boundaries: Create/Update inputs remain within the approved DTO membership. View/List facts are readonly; `code` remains the View link; `iid` and `deleted` stay hidden. Lifecycle transitions, Product existence, code uniqueness, validation, `systemAdmin`, active-instance scope, stock, sellability, catalogue projection, and immutable order snapshots remain server-authoritative or owned by their existing consumer.
Shared/custom renderer decision: `priceCents` reuses the Coupon Template minor-unit currency configuration `{ fixed: 2, exp: 2, zero: 2 }` with shared form/table currency renderers. `lifecycle` reuses the shared localized select/cell renderers and the existing four-state items. Product ID remains plain ID-valued treatment; `product: { id, title }` remains deferred. `attributes` remains absent; no attribute editor, summary, or custom renderer is approved. No reverse-chain prerequisite was required.
Vona source-of-truth paths: `commerce-catalog/src/entity/sku.tsx`; `commerce-catalog/src/dto/skuCreate.tsx`; `skuUpdate.tsx`; `skuView.tsx`; `skuSelectResItem.tsx`; and `commerce-catalog/test/skuPresentation.test.ts`. Generic Zova `ModelResource` and Resource pages remain the state/page owner.
Expected generated and Zova handoff: metadata was regenerated through the normal Vona command; Commerce Admin paired SSR/REST artifacts were built and `npm run deps:vona` completed without hand-editing generated output.
Completed gate and evidence: SKU Gates A/B are documented; local Gates C/E/F and the 17-scenario batch baseline passed before CI. At `345ed338ebcff8457d7b8918a0ffe8b31491a43c`, SQLite CI passed with 256 passes and 10 skips and PostgreSQL CI passed with 266 passes and no skips, including `sku.test.ts` and `skuPresentation.test.ts`. Commerce CI built paired Web/Admin artifacts, synchronized Vona dependencies, and passed all 17 browser scenarios including `@category`, `@product`, and `@sku`; Vona TypeScript CI passed. Retained links are in the test-plan SKU CI record.
Commands passed: local `npm run vona :bin:test -- commerce-catalog/test/skuPresentation.test.ts --flavor=normal`; SKU regression test command; `npm run vona :tools:metadata commerce-catalog`; `npm run build:zova:commerce:admin`; `npm run deps:vona`; `npm run tsc`; `npm run test:e2e:commerce:clean -- --grep @sku`; and the CI SQLite/PostgreSQL full suites, Commerce artifact/build/dependency/browser baseline, and Vona TypeScript run.
Commands still required: none for `WBS-80-01` closure.
Known blocker / decision needed: no WBS-80-01 blocker. Before `WBS-80-02` source work, resolve the Order Admin View DTO line-detail scope during Gate A.
Next single action: begin `WBS-80-02` Gate A scene and contract authority analysis only; do not alter Order source or generated output until the DTO scope is approved.
```

## Related records

- [A-Commerce internal planning index](./README.md)
- [Product Delivery Plan and Work Breakdown Structure](./pdp-wbs.md)
- [Test Strategy and Acceptance Plan](./test-plan.md)
- [Delivery Progress](./progress.md)
- [Presentation contracts](./presentation-contracts.md)
- [ADR 0003: Establish Semantic Presentation Contracts](./decisions/0003-semantic-presentation-contracts.md)
