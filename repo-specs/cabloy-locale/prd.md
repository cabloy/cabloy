# Cabloy Locale Product Requirements

## Purpose

Provide maintainable Japanese and Traditional Chinese (Taiwan) language support through reusable modules, without coupling installed translation packages to application language policy. This is the product authority for the [planning set](./README.md); implementation details belong to the [SRS](./srs.md).

## Product Goals

- Let maintainers distribute additional languages without changing every translated module.
- Let application owners independently choose supported languages and the default.
- Supply reviewed localized text and schema-label keys, with application-owned language configuration and Zod validation mappings on both frontend and backend.
- Preserve application overrides, existing English/Simplified Chinese behavior and framework startup semantics; deliver and proportionately verify the paired application configuration/mappings without requiring a business consumer.

## Personas

| Persona                        | Need                                                                                         |
| ------------------------------ | -------------------------------------------------------------------------------------------- |
| Application maintainer         | Install reusable resources while retaining explicit application language policy.             |
| Module maintainer / translator | Maintain translations against existing message keys and review terminology and placeholders. |
| Existing Admin/Web user        | Use an enabled language consistently without startup or hydration text changes.              |
| Release maintainer             | Distinguish framework wiring, translation coverage, and actual acceptance proof.             |

## Scope

### In Scope

- Paired frontend/backend `cabloy-locale` suites, initially `locale-jajp` and `locale-zhtw`.
- Cross-module Japanese (`ja-jp`) and Traditional Chinese (Taiwan) (`zh-tw`) resources for the current Cabloy Basic source inventory.
- Necessary core error text, language names, schema-label translations, and application-owned Zod validation-language mapping on both stacks.
- Framework language selection/defaults, early registration, overrides, fallback, metadata generation, and development reload behavior.
- Actual language configuration in Basic's existing backend and frontend application roots, enabling exactly `en-us`, `zh-cn`, `ja-jp` and `zh-tw` with default `en-us`, plus the complete four-language application-owned Zod mappings and proportional configuration/adapter verification. The latest 2026-10-30 user approval supersedes only the prior two-language enabled-set constraint and settles application-owned placement as specified in SRS-LOC-09; it preserves the default. The user's subsequent placement correction requires both existing home-base `src/main.ts` moduleLoaded hooks, not project monkeys, to register the complete four-language Zod map; frontend registration remains CLIENT-only. WBS-LOC-40-01 execution is approved for this bounded increment. Guidance alone does not complete this delivery.
- Inventory-based completeness and human terminology review before release.

### Deferred

- Further languages, remote translation management, runtime package installation, and per-tenant editable dictionaries.
- Automatic application-locale wiring for every date, number, or currency formatting utility. These are not represented as complete by text translation.

### Out of Scope

New business pages, sites, flavors, APIs, persisted resources, identities, tenant rules, migrations, authentication policies, public dynamic registration APIs, and a replacement internationalization engine. The user's subsequent 2026-10-30 correction removes the earlier same-date actual-consumer restoration. A business consumer, business/page integration, schema/draft-switching flow and SSR/browser consumer acceptance are not prerequisites for this increment; generic reactive-schema, SSR/hydration and request-isolation constraints remain framework safety obligations, not a requirement to demonstrate a real flow. No new flavor, configuration profile or test runner is required. The rejected test-only policy switch remains rejected. The four-language root enabled set and default `en-us` remain unchanged by the latest placement correction; the complete Zod map is registered in both existing home-base moduleLoaded hooks, frontend CLIENT-only, not project monkeys.

## Primary User Journeys

1. A maintainer installs a language pack but does not enable that language; available choices and the default remain unchanged.
2. The maintainer enables the approved four-language set in Basic's existing frontend/backend roots and registers all four Zod factories in both existing home-base moduleLoaded hooks (frontend CLIENT-only), using each stack's configured default. Existing scoped adapter/validation tests and proportional policy assertions verify those mappings and paired configuration; a business page or end-user integration flow is not required.
3. A translator updates target-module dictionaries centrally; lazy target loading and development reload preserve the documented precedence.
4. An application owner overrides selected translated messages; the application-specific wording wins.
5. A user encounters an untranslated message; existing fallback remains usable instead of failing the page or API.

## Product Requirements

- **PRD-LOC-01**: A maintainer can add Japanese and Traditional Chinese support through reusable language modules covering existing module-owned text, without changing business ownership or requiring every translation target to be installed. Traceability: `SRS-LOC-01`, `SRS-LOC-02`, `SRS-LOC-08`.
- **PRD-LOC-02**: An application owner controls enabled languages and the default independently of installed language resources; unsupported saved or requested language selections cannot activate a disabled language. Traceability: `SRS-LOC-05`, `SRS-LOC-06`.
- **PRD-LOC-03**: Existing application consumers can use contributed text from their first supported initialization/render boundary, including preload consumers and lazily loaded modules, without inconsistent SSR/client text. Traceability: `SRS-LOC-03`, `SRS-LOC-04`, `SRS-LOC-09`.
- **PRD-LOC-04**: Application-specific target-module wording takes precedence over language-pack wording, which takes precedence over target defaults; missing messages preserve the established fallback behavior. Traceability: `SRS-LOC-02`, `SRS-LOC-07`.
- **PRD-LOC-05**: Japanese and Traditional Chinese providers supply reviewed module text, language names, existing schema-label translations and core error text with intact interpolation and plural conventions. Application owners deliver language configuration and Zod mappings for both languages on frontend and backend through existing supported adapters, with proportional configuration/validation proof. Dictionary coverage, guidance and actual configuration/mapping delivery remain separate; neither dictionaries nor guidance alone complete the latter. No business consumer is required. Traceability: `SRS-LOC-08`, `SRS-LOC-09`.
- **PRD-LOC-06**: Maintainers can generate, typecheck, develop, and prepare these language packs using normal repository workflows, without stale language overrides, hand-edited generated consumers, or automatic policy changes. Traceability: `SRS-LOC-01`, `SRS-LOC-10`, `SRS-LOC-11`, `SRS-LOC-12`.

## Business Rules

- Installed resources, enabled languages, and default language are separate concepts.
- Dictionaries contain static presentation text, not user data or access decisions.
- The two languages use distinct reviewed terminology; `zh-tw` is not silently treated as `zh-cn`.
- Existing target modules own message keys and meaning. Providers translate those keys, not duplicate business contracts.
- A configuration-enabled language may use fallback if its pack is absent. This is runtime resilience, not proof of translation completeness.
- The default must be in the enabled set. Invalid application policy must fail visibly rather than being repaired from installed packages.
- Planning records do not themselves authorize source implementation. The latest user approval separately authorizes only bounded WBS-LOC-40-01 execution; destructive setup, Phase 50 execution, commit/push, publishing and release remain unauthorized.

## Launch Criteria

Both language packs are present in both stacks, applicable framework/dictionary/reload proof and public configuration guidance are retained, translation coverage and terminology review have no unresolved required omission, and evidence remains revision scoped. Actual frontend/backend application language configuration and Zod mappings, proportional ATP-LOC-03 configuration assertions and ATP-LOC-07 mapping proof are launch criteria. The latest 2026-10-30 user approval settles the existing Basic root enabled set as `en-us`, `zh-cn`, `ja-jp`, `zh-tw`, default `en-us`, and the corrected home-base moduleLoaded placement in SRS-LOC-09, with frontend CLIENT-only registration and each stack's configured default. The former project-monkey placement and home-base byte-unchanged constraint are superseded; their same-day approval/results remain historical, not current proof. Bounded WBS-LOC-40-01 execution is approved and begins as in-progress, not verified or guidance-only. WBS-LOC-50-01 remains blocked on its verified configuration/mapping result and is not approved for execution. Already accepted inventory, terminology, framework, reload and guidance proof remains valid within its recorded scope; earlier guidance-only or historical integration results do not prove this delivery. ATP-LOC-04 is retained as historical integration only, explicitly not required for current scope and not reported as passed. No new runtime result, commit/push or publication approval follows from this authority update.

## Requirement Traceability

WBS-LOC-40-01 remains active for bilateral application language configuration and Zod mapping delivery under the subsequent 2026-10-30 correction. ATP-LOC-03 retains framework policy proof plus proportional configuration assertions; ATP-LOC-07 verifies backend/frontend configuration and mappings using existing supported scoped adapter/validation tests, without a selected consumer. ATP-LOC-04 retains its ID as historical integration only, is not required for current scope and is not passed. WBS-LOC-50-01 reconciles actual configuration/mapping proof before current readiness can close.

| Product requirement | Technical owners                               | Delivery                                                   | Acceptance                                     |
| ------------------- | ---------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| PRD-LOC-01          | SRS-LOC-01, SRS-LOC-02, SRS-LOC-08             | WBS-LOC-20-01, WBS-LOC-30-01                               | ATP-LOC-01, ATP-LOC-02, ATP-LOC-05             |
| PRD-LOC-02          | SRS-LOC-05, SRS-LOC-06                         | WBS-LOC-20-01, WBS-LOC-40-01                               | ATP-LOC-03                                     |
| PRD-LOC-03          | SRS-LOC-03, SRS-LOC-04, SRS-LOC-09             | WBS-LOC-20-01, WBS-LOC-40-01                               | ATP-LOC-01, ATP-LOC-07                         |
| PRD-LOC-04          | SRS-LOC-02, SRS-LOC-07                         | WBS-LOC-20-01                                              | ATP-LOC-02                                     |
| PRD-LOC-05          | SRS-LOC-08, SRS-LOC-09                         | WBS-LOC-30-01, WBS-LOC-40-01, WBS-LOC-50-01                | ATP-LOC-05, ATP-LOC-07                         |
| PRD-LOC-06          | SRS-LOC-01, SRS-LOC-10, SRS-LOC-11, SRS-LOC-12 | WBS-LOC-20-01, WBS-LOC-30-02, WBS-LOC-40-01, WBS-LOC-50-01 | ATP-LOC-01, ATP-LOC-06, ATP-LOC-07, ATP-LOC-08 |

## Related Records

- [README](./README.md)
- [SRS](./srs.md)
- [PDP/WBS](./pdp-wbs.md)
- [Test plan](./test-plan.md)
- [Progress](./progress.md)
- [Boundary ADR](./decisions/0001-locale-module-boundaries.md)
