# ADR 0002: Separate Provider Resources from Ordinary Locale Generation

## Status

Accepted

On 2026-10-25, after inspecting commit `c6bbe87564acbc19af6c7667a104a3b2e71a8afc`, the user explicitly approved retaining `src/locales` + `localesProvider` and the bounded specification alignment. This approves the changed resource contract and related planning edits/static checks only; it does not authorize source changes, ATP execution, successor implementation, or release.

## Background

[ADR 0001](./0001-locale-module-boundaries.md) originally selected ordinary locale exports under `src/config/locale` and provider-aware metadata generation. The current Japanese modules instead author their provider resources outside that scan and export a separate `localesProvider` resource. Both runtimes already consume this property under the locale capability. The phase-20 evidence describes a different dirty implementation, including generator changes and tests not present in the current commit.

## Decision

1. Supersede only ADR 0001 decisions 3 and 8 concerning ordinary resource exports and provider-aware generator inference. Providers author `src/locales/<locale>.ts`, compose their language map in `src/locales/index.ts`, and export `localesProvider` through `src/index.ts`. Per-target dictionaries remain in `src/lib/locales`.
2. Retain the `{ modules: { '<target-module>': dictionary } }` envelope and optional top-level global strings. `localesProvider` is a static module resource, not another runtime registry or a public append API. Existing target modules retain message-key ownership.
3. Core registration reads `resource.localesProvider` only for locale-capability modules. Ordinary modules continue using `resource.locales`; project overrides, registration order, target filtering, preload/lazy behavior, and language policy remain unchanged.
4. Keep ordinary metadata generation unchanged. Provider resources live outside its nonrecursive `src/config/locale` scan and are authored exports, not generated ordinary locale resources. Single-language providers require no dummy English file or provider-owned English-base scope/helper inference. Verify capability propagation, export preservation after metadata regeneration, and generated-source typechecks rather than claiming provider-aware generator behavior.
5. Retain CLI-backed module creation, dependency preparation and metadata regeneration. Do not hand-edit generated output. Do not assume `:init:locale` creates this provider layout; it currently creates ordinary locale resources.

## Consequences and Acceptance

The provider interface and authoring path are explicit, while ordinary generator behavior and target locale typing remain intact. Authored provider exports need focused regression coverage for preservation through normal generation, single-language validity and runtime consumption. Existing historical generator results do not prove this changed contract.

Before WBS-LOC-30-01 or WBS-LOC-30-02 can rely on their predecessor, re-establish applicable WBS-LOC-20-01 / ATP-LOC-01/02/03 proof for the current implementation. Retain revision-scoped redacted results durably and reconcile the existing phase-20 evidence without deleting historical successes or failures. Static planning checks cannot close this gate.

No new Site, flavor, API, persistence, migration, authorization boundary, language enablement, dictionary completeness claim, or release operation is introduced by this provider export/generation decision. Other ADR 0001 boundaries remain in force subject to its recorded 2026-10-27 consumer exclusion and subsequent 2026-10-30 amendments. The earlier same-date actual-consumer restoration remains historical; it is superseded by the correction recorded below. These scope amendments do not alter the provider export/generation contract; application language policy and Zod mappings remain app-owned, not provider resources. This decision does not require another whole-baseline review.

On 2026-10-30, after the actual-consumer restoration, the user explicitly corrected the scope to “前端和后端均进行‘语言配置和zod验证映射’，不需要再进行‘业务消费者’”. WBS-LOC-40-01 remains active for actual backend/frontend application language configuration and Zod mappings, not deferred or guidance-only; WBS-LOC-50-01 continues to depend on its verified configuration/mapping result. Preserve Basic's original en-us/zh-cn defaults and home-base `en`/`zhCN` mappings absent explicit new approval. Concrete app-owned configuration/initialization placement for `ja-jp`/`ja` and `zh-tw`/`zhTW` is a finite execution gate, not a requirement to select a consumer or invent a profile/flavor/test runner. ATP-LOC-03 retains framework policy proof plus proportional configuration assertions; ATP-LOC-07 verifies bilateral configuration and mappings through existing supported scoped adapter/validation tests, without a selected consumer. ATP-LOC-04 remains historical integration only, explicitly not required for current scope and not passed. No business/page/schema-draft or SSR/browser consumer integration is a prerequisite; generic reactive-schema, SSR/hydration and request-isolation constraints remain framework safety. Previously accepted inventory/framework/reload/guidance proof keeps its revision scope, while guidance alone does not prove actual configuration/mapping delivery. This specification amendment supplies no source/runtime/build/test execution approval, new runtime result or release authorization.

## Related Records

- [README](../README.md)
- [SRS](../srs.md)
- [PDP/WBS](../pdp-wbs.md)
- [Test plan](../test-plan.md)
- [Progress](../progress.md)
- [Historical phase-20 evidence and applicability](../evidence/phase-20/index.md)
