# Cabloy Locale Internal Planning

This directory contains maintainer-facing product, technical, delivery, and acceptance planning for modular Japanese and Traditional Chinese (Taiwan) support in Cabloy Basic. It is not public how-to documentation, implementation evidence, or execution authorization.

## Reading Order

1. [PRD](./prd.md): outcomes, scope, journeys, and product requirements.
2. [SRS](./srs.md): resource ownership, registration, configuration, generation, and runtime contracts.
3. [Delivery Plan and WBS](./pdp-wbs.md): bounded increments, dependencies, and completion checks.
4. [Test Plan](./test-plan.md): acceptance procedures and minimum retained proof.
5. [Progress](./progress.md): derived task status, approvals, and evidence index.
6. [ADR 0001](./decisions/0001-locale-module-boundaries.md): accepted architecture and scope boundary.
7. [ADR 0002](./decisions/0002-locale-provider-resource-export.md): accepted separate provider export, narrowly superseding ADR 0001's ordinary-export/generator portions.
8. [Implementation Gantt](./implementation-gantt.svg): derived relative delivery order, not a calendar schedule.
9. [Implementation Burndown](./implementation-burndown.svg): derived scope-count reference, not a historical trend or forecast.

The Markdown records are authoritative within their respective domains. Both SVGs are generated views; they do not authorize scope, execution, or completion. This README and its derived charts use English.

## Product and Technical Baseline

| Concern                 | Baseline and classification                                                                                                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edition                 | **Observed existing:** Cabloy Basic, identified by the root `__CABLOY_BASIC__` marker.                                                                                                                                            |
| Planning identity       | `cabloy-locale`, provider `cabloy`, suite name `locale`, domain prefix `LOC`.                                                                                                                                                     |
| Ownership               | **Observed existing at `c6bbe87564`:** paired Vona/Zova `cabloy-locale` suites, `locale-jajp` (`ja-jp`) and `locale-test` modules. **Explicitly approved new:** paired `locale-zhtw` (`zh-tw`) modules under ADR 0001.            |
| Outcomes                | Reusable cross-module translations, configuration-only language enablement/defaults, early availability, predictable overrides, and consistent frontend/backend behavior.                                                         |
| Consumers               | Existing framework/module consumers and existing Admin/Web applications; no new pages or application audience.                                                                                                                    |
| Site strategy           | No suite-owned site or flavor. Consume the observed shared Admin/Web hosts without changing their composition/admission contracts.                                                                                                |
| Persistence and tenancy | No new persisted resource, migration, identity owner, transaction, or cross-instance access. Existing Vona instance scope remains unchanged.                                                                                      |
| Authorization/privacy   | Language selection is presentation policy, never authorization. Shared dictionaries contain static text only; active locale remains request/app scoped.                                                                           |
| Approval domains        | Original design/planning approval was 2026-10-24. On 2026-10-25, the user separately approved ADR 0002 alignment and the bounded WBS-LOC-20-01 current-proof execution dossier. No successor or publication approval was granted. |
| Delivery state          | Baseline review is planning-complete. WBS-LOC-20-01 is verified by current Japanese-slice proof at c6bbe87564 plus the recorded dirty digest. Remaining four tasks are not-started and require separate execution approval.       |
| Exclusions              | No new public dynamic-locale API, parallel registry, eager loading of translation targets, independent site, automatic language enablement, or generalized formatting redesign.                                                   |

## Current or Intended Topology

### Observed suites/Japanese providers and approved new Traditional Chinese targets

```text
vona/src/suite/cabloy-locale/
  package.json                         # vona-suite-cabloy-locale
  modules/locale-jajp/                  # vona-module-locale-jajp
  modules/locale-zhtw/                  # approved new; vona-module-locale-zhtw
zova/src/suite/cabloy-locale/
  package.json                         # zova-suite-cabloy-locale
  modules/locale-jajp/                  # zova-module-locale-jajp
  modules/locale-zhtw/                  # approved new; zova-module-locale-zhtw
```

Each provider owns one language's cross-module dictionaries. Existing target modules retain message-key and business ownership. Under accepted ADR 0002, providers author `src/locales/<locale>.ts` with a `modules` envelope, map locale IDs through the `localesProvider` export in `src/locales/index.ts`, and re-export it from the module entrypoint. Larger dictionaries compose authored `src/lib/locales/<target>.ts` files. Ordinary `src/config/locale` generation remains unchanged and does not discover provider dictionaries. Capability names are `vonaModule.capabilities.locale` and `zovaModule.capabilities.locale`; `vovaModule` is not a supported manifest key.

Collision checks at baseline creation found no existing `repo-specs/cabloy-locale`, Vona `src/suite/cabloy-locale`, or Zova `src/suite/cabloy-locale` directory. Existing workspace globs cover the planned layout. Execution rechecks discovery and package-name collisions before creation.

### Observed shared consumers

| Audience | Existing owner and entry                                                                                                                  | Existing artifacts                                                                                           |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Admin    | [basic-siteadmin](../../vona/src/suite/cabloy-basic/modules/basic-siteadmin/src/bean/ssrSite.admin.ts), Site `admin`, public path `admin` | Flavor `cabloyBasicAdmin`, bundle `ssr-cabloyBasicAdmin-5.0.0`, REST package `zova-rest-cabloy-basic-admin`. |
| Web      | [basic-siteweb](../../vona/src/suite/cabloy-basic/modules/basic-siteweb/src/bean/ssrSite.web.ts), Site `web`, empty public path           | Flavor `cabloyBasicWeb`, bundle `ssr-cabloyBasicWeb-5.0.0`, REST package `zova-rest-cabloy-basic-web`.       |

The existing `home-layoutadmin`, `home-layoutweb`, `home-base`, and `home-passport` consumers retain layout, validation, and preference responsibilities. This suite does not move their ownership or create a new SSR tuple. Commerce and other modules may contribute inventory entries; their site strategy is not redesigned here.

## Document Authority

| Record    | Authority                                                                     |
| --------- | ----------------------------------------------------------------------------- |
| PRD       | Product outcomes, scope, rules, and launch criteria.                          |
| SRS       | Technical contracts, runtime/configuration ownership, and acceptance mapping. |
| PDP/WBS   | Task scope, dependencies, implementation checks, and handoff gates.           |
| Test plan | Executable scenarios, proof requirements, and release acceptance.             |
| Progress  | Derived status, open decisions, and actual evidence pointers only.            |
| ADR       | Durable design decisions and their accepted boundary.                         |
| Charts    | Deterministic derived delivery views only.                                    |

Resolve conflicts in the owning authority first, then update traceability, tasks, scenarios, progress, and charts. No optional presentation contract or operational runbook is needed for this static framework capability. Do not create empty evidence directories.

## Traceability Chain and Status Rules

`PRD -> SRS -> WBS -> ATP -> observed retained evidence` is the product-delivery chain. Exact declaration-body Traceability fields establish associations; summary tables do not define IDs.

Accepted design does not prove source existence or approve implementation. Planning generation and static audits do not close WBS work or ATPs. Only applicable revision-scoped proof can justify `verified`. The documentary baseline gate may become `planning-complete` only under its explicit completion mode and named-reviewer closure disposition. Charts count only `verified` as verified completion.

The [current-implementation proof refresh](./evidence/phase-20/current-proof.md) closes `WBS-LOC-20-01` for the bounded Japanese slice; the historical baseline handoff in `WBS-LOC-10-01` remains closed. The next recommended bounded dossier is `WBS-LOC-30-02` (reload correctness), which can be verified independently of the unassigned human terminology review in `WBS-LOC-30-01`. Either successor requires its own execution approval. Do not repeat a whole-baseline review or start either automatically.

## Related Framework Records

- [Repository scripts](../../repo-docs/reference/repo-scripts.md).
- [Backend internationalization](../../repo-docs/backend/i18n-guide.md).
- [Frontend module scope](../../repo-docs/frontend/module-scope.md).
- [Frontend system startup](../../repo-docs/frontend/system-startup-guide.md).
- [Frontend source-reading map](../../repo-docs/frontend/zova-source-reading-map.md).
- [Vona integrated and Zova standalone SSR](../../repo-docs/fullstack/ssr-entry-modes.md).
- [Root workflow manifest](../../package.json).
