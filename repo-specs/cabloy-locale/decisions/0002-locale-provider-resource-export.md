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

No new Site, flavor, API, persistence, migration, authorization boundary, language enablement, dictionary completeness claim, or release operation is introduced. Other ADR 0001 boundaries remain in force subject to its recorded 2026-10-27 application-consumer scope clarification; that clarification does not change this provider export/generation decision. This decision does not require another whole-baseline review.

## Related Records

- [README](../README.md)
- [SRS](../srs.md)
- [PDP/WBS](../pdp-wbs.md)
- [Test plan](../test-plan.md)
- [Progress](../progress.md)
- [Historical phase-20 evidence and applicability](../evidence/phase-20/index.md)
