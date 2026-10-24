# ADR 0001: Establish Locale Module Boundaries

## Status

Accepted

The user explicitly approved the analyzed locale-module design, then confirmed the complete English planning scope and design-status policy in this conversation. This acceptance covers the durable decisions below only. It is not a claim that target source exists, that the generated baseline has received revision-scoped closure review, or that implementation/acceptance/release has been authorized.

## Background

Cabloy Basic currently has ordinary module locale resources and project-level cross-module overrides, but no active locale-capability registration phase. Additional languages must be reusable modules rather than edits scattered through every target. Existing backend language negotiation infers availability from dictionaries, whereas application enablement must be explicit and independent of installed resources.

Source observations and their limits are recorded in the [SRS](../srs.md). The user supplied the suite/module identities and language codes. Repository checks found no matching source/spec directory collision; existing workspace layout and capability propagation can support the proposed structure without new sites or persistence.

## Problem

Simply marking a language module as preload does not register its dictionaries under translated target-module scopes, does not solve later merge precedence or metadata's English-base assumption, and may incorrectly turn installed resources into enabled languages. Imperative pack lifecycle mutation would couple published data packs to internal APIs and duplicate backend/frontend orchestration.

## Decision

1. Establish paired Vona/Zova `cabloy-locale` suites with initial `locale-jajp` (`ja-jp`) and `locale-zhtw` (`zh-tw`) modules. These are explicitly approved new source targets, not observed existing modules.
2. Identify providers with the active stack's `vonaModule.capabilities.locale` or `zovaModule.capabilities.locale`. Reuse existing capability metadata propagation.
3. Keep providers declarative. Reuse existing locale exports and the project `modules` envelope for cross-target dictionaries; existing target modules retain message-key/business ownership. Reuse current global/scoped stores and internal registrar logic, with no new public dynamic registration API or parallel dictionary store.
4. Register project target overrides before providers before ordinary module defaults. In Zova, complete provider import and installation before preload. In Vona, split the existing locale pass without creating frontend-like backend preload semantics or changing moduleLoading guarantees.
5. Avoid hard dependencies/imports on translation targets. Filter provider contributions by active metadata membership, not installed state, so absent targets are skipped and lazy targets remain lazy.
6. Make root `config.locale.items/default` authoritative on both stacks, including active-language input normalization. Packs never mutate policy; configured language subsets and enabled-without-pack fallback are valid. Migrate the backend's old module default and dictionary-derived acceptance rather than maintain competing defaults.
7. Preserve the existing English/key missing-text fallback independently of configured default. Distinct Taiwan terminology and Zod language mapping are required; a generic formatting overhaul is not part of this boundary.
8. Adapt metadata generation for single-language providers instead of inventing English text anchors. Preserve CLI-backed regeneration, actual Zova source suffixes, and original target key typing.
9. Preserve provider precedence through the backend HMR snapshot and use existing full reload/restart mechanisms for provider updates/deletions rather than a general incremental rebuild registry.
10. Add no suite-owned Site, flavor, page, API, persistence, identity, authorization, or migration boundary. Existing observed Basic Admin/Web hosts remain consumers. A future independently delivered site or editable tenant dictionary would require a superseding boundary decision and separately approved scope.

## Alternatives Deferred

- Setting preload on packs without locale-specific registration: rejected because timing alone does not establish target scope or policy.
- Per-target hard dependencies/eager imports: rejected because a general language pack must coexist with optional/lazy modules.
- Pack Monkey/Main mutation or a new public append API: not justified for static first-party resources.
- A separate resource.localeModules field or parallel registry: unnecessary while existing project envelope/registration can be reused safely behind capability gating.
- Dummy English dictionaries to satisfy generation: rejected in favor of accurate provider-aware metadata semantics.
- Automatic enablement based on installed packs, or two competing backend defaults: rejected because application policy is explicit.
- Remote translation service, runtime package loading, generalized formatting adapters, and localeutil cache redesign: deferred outside this feature.

## Consequences

Core registration, configuration, metadata generation, existing validation integration, and HMR all require small connected changes; adding resource files alone is insufficient. Existing backend applications using module defaultLocale need explicit migration guidance. Provider dictionaries may be shipped for languages not enabled by an app; their presence never authorizes user selection.

Translation completeness and native-context terminology review are separate from framework wiring and may dominate delivery effort. Global fallback collisions retain stable first-wins behavior while target scopes remain distinct. Skipping absent targets avoids global pollution but makes inventory/key checks important for catching mistyped target names.

No new data model means no fileVersion decision, reset, transaction, or seeding action is required. Actual tests still use existing isolation/cleanup rules. Shared SSR resources contain text only, never request-specific preferences or protected data.

## Implementation Decision Gates

There is no unresolved architecture question requiring another planning round for the first connected increment. The finite handoff checklist is:

- A named reviewer closes WBS-LOC-10-01 for the exact generated baseline revision; generation approval does not supply that proof.
- The user approves the bounded WBS-LOC-20-01 execution dossier before source scaffolding or runtime tests.
- Execution rechecks package/source collisions and selects actual preload/lazy consumers from active source. A newly observed material incompatibility is reported against its dependent branch only.
- Full dictionary terminology reviewers and their dispositions are recorded before ATP-LOC-05 closure, not invented now. This is later acceptance work, not a blocker to the initial mechanism slice.
- Release readiness and publication approval remain separate later gates. No automatic scaffold, init, reset, deployment, or publishing follows from this ADR.

## Related Records

- [README](../README.md)
- [PRD](../prd.md)
- [SRS](../srs.md)
- [PDP/WBS](../pdp-wbs.md)
- [Test plan](../test-plan.md)
- [Progress](../progress.md)
- [Backend i18n guide](../../../repo-docs/backend/i18n-guide.md)
- [Frontend module scope](../../../repo-docs/frontend/module-scope.md)
- [Frontend system startup](../../../repo-docs/frontend/system-startup-guide.md)
