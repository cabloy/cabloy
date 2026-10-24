# Cabloy Locale Product Requirements

## Purpose

Provide maintainable Japanese and Traditional Chinese (Taiwan) language support through reusable modules, without coupling installed translation packages to application language policy. This is the product authority for the [planning set](./README.md); implementation details belong to the [SRS](./srs.md).

## Product Goals

- Let maintainers distribute additional languages without changing every translated module.
- Let application owners independently choose supported languages and the default.
- Let users receive consistent localized text, schema labels, and validation messages across existing frontend/backend flows.
- Preserve application overrides, existing English/Simplified Chinese behavior, startup correctness, and SSR consistency.

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
- Necessary core error text, language names, and existing validation-library language mapping.
- Explicit configured language selection/defaults, early registration, overrides, fallback, metadata generation, development reload behavior, and existing Admin/Web integration.
- Inventory-based completeness and human terminology review before release.

### Deferred

- Further languages, remote translation management, runtime package installation, and per-tenant editable dictionaries.
- Automatic application-locale wiring for every date, number, or currency formatting utility. These are not represented as complete by text translation.

### Out of Scope

New business pages, sites, flavors, APIs, persisted resources, identities, tenant rules, migrations, authentication policies, public dynamic registration APIs, and a replacement internationalization engine.

## Primary User Journeys

1. A maintainer installs a language pack but does not enable that language; available choices and the default remain unchanged.
2. An application owner enables Japanese or Traditional Chinese and chooses a configured default; users receive that language in existing application flows.
3. A translator updates target-module dictionaries centrally; lazy target loading and development reload preserve the documented precedence.
4. An application owner overrides selected translated messages; the application-specific wording wins.
5. A user encounters an untranslated message; existing fallback remains usable instead of failing the page or API.

## Product Requirements

- **PRD-LOC-01**: A maintainer can add Japanese and Traditional Chinese support through reusable language modules covering existing module-owned text, without changing business ownership or requiring every translation target to be installed. Traceability: `SRS-LOC-01`, `SRS-LOC-02`, `SRS-LOC-08`.
- **PRD-LOC-02**: An application owner controls enabled languages and the default independently of installed language resources; unsupported saved or requested language selections cannot activate a disabled language. Traceability: `SRS-LOC-05`, `SRS-LOC-06`.
- **PRD-LOC-03**: Existing application consumers can use contributed text from their first supported initialization/render boundary, including preload consumers and lazily loaded modules, without inconsistent SSR/client text. Traceability: `SRS-LOC-03`, `SRS-LOC-04`, `SRS-LOC-09`.
- **PRD-LOC-04**: Application-specific target-module wording takes precedence over language-pack wording, which takes precedence over target defaults; missing messages preserve the established fallback behavior. Traceability: `SRS-LOC-02`, `SRS-LOC-07`.
- **PRD-LOC-05**: Enabled Japanese and Traditional Chinese have reviewed module text, language names, existing schema labels, and validation messages with intact interpolation and plural conventions; incomplete translation work is not reported as complete support. Traceability: `SRS-LOC-08`, `SRS-LOC-09`.
- **PRD-LOC-06**: Maintainers can generate, typecheck, develop, and prepare these language packs using normal repository workflows, without stale language overrides, hand-edited generated consumers, or automatic policy changes. Traceability: `SRS-LOC-01`, `SRS-LOC-10`, `SRS-LOC-11`, `SRS-LOC-12`.

## Business Rules

- Installed resources, enabled languages, and default language are separate concepts.
- Dictionaries contain static presentation text, not user data or access decisions.
- The two languages use distinct reviewed terminology; `zh-tw` is not silently treated as `zh-cn`.
- Existing target modules own message keys and meaning. Providers translate those keys, not duplicate business contracts.
- A configuration-enabled language may use fallback if its pack is absent. This is runtime resilience, not proof of translation completeness.
- The default must be in the enabled set. Invalid application policy must fail visibly rather than being repaired from installed packages.
- No new source implementation, destructive setup, publishing, or release is authorized by this planning set.

## Launch Criteria

Both language packs are present in both stacks, the accepted SRS contracts pass their applicable ATPs, translation coverage and terminology review have no unresolved release-blocking omission, and evidence is retained for the release revision. Earlier Japanese vertical-slice acceptance does not close the full two-language feature. Existing English/Simplified Chinese consumers remain functional.

## Requirement Traceability

| Product requirement | Technical owners                               | Delivery                                                   | Acceptance                                                 |
| ------------------- | ---------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| PRD-LOC-01          | SRS-LOC-01, SRS-LOC-02, SRS-LOC-08             | WBS-LOC-20-01, WBS-LOC-30-01                               | ATP-LOC-01, ATP-LOC-02, ATP-LOC-05                         |
| PRD-LOC-02          | SRS-LOC-05, SRS-LOC-06                         | WBS-LOC-20-01                                              | ATP-LOC-03                                                 |
| PRD-LOC-03          | SRS-LOC-03, SRS-LOC-04, SRS-LOC-09             | WBS-LOC-20-01, WBS-LOC-40-01                               | ATP-LOC-01, ATP-LOC-04, ATP-LOC-07                         |
| PRD-LOC-04          | SRS-LOC-02, SRS-LOC-07                         | WBS-LOC-20-01                                              | ATP-LOC-02                                                 |
| PRD-LOC-05          | SRS-LOC-08, SRS-LOC-09                         | WBS-LOC-30-01, WBS-LOC-40-01                               | ATP-LOC-05, ATP-LOC-07                                     |
| PRD-LOC-06          | SRS-LOC-01, SRS-LOC-10, SRS-LOC-11, SRS-LOC-12 | WBS-LOC-20-01, WBS-LOC-30-02, WBS-LOC-40-01, WBS-LOC-50-01 | ATP-LOC-01, ATP-LOC-04, ATP-LOC-06, ATP-LOC-07, ATP-LOC-08 |

## Related Records

- [README](./README.md)
- [SRS](./srs.md)
- [PDP/WBS](./pdp-wbs.md)
- [Test plan](./test-plan.md)
- [Progress](./progress.md)
- [Boundary ADR](./decisions/0001-locale-module-boundaries.md)
