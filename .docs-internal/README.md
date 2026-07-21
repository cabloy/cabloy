# Internal Engineering Documentation

This directory stores internal technical documentation for the Cabloy Basic monorepo.

## Purpose

This documentation area is for framework-internal engineering knowledge, including:

- architecture notes
- design rationale
- implementation plans
- refactor records
- decision history
- execution and validation summaries for important work

It is intentionally separate from future user-facing documentation.

## What belongs here

### `architecture/`

Use this directory for long-lived technical explanations, such as:

- subsystem design
- cross-package behavior
- framework patterns
- internal abstractions
- invariants that future development should preserve

### `decisions/`

Use this directory for ADR-style records and major engineering changes, such as:

- why a design was chosen
- what alternatives were rejected
- what implementation boundaries were established
- how a refactor changed the system
- what future work should keep in mind

## What does not belong here

Do not use this directory for:

- end-user product documentation
- framework usage tutorials for external users
- release notes
- temporary personal scratch notes

Those concerns should live elsewhere.

## Current documents

### Decisions

- [ADR 0001: Establish the Internal Engineering Documentation Home](./decisions/0001-internal-docs-home.md)
- [ADR 0002: Guard-Based Default API Permission Projection](./decisions/0002-guard-permission-projection.md)
- [ADR 0003: Stop SSR Leak Fixes at the Runtime-Core Boundary](./decisions/0003-stop-ssr-leak-fixes-at-runtime-core-boundary.md)
- [ADR 0004: Preserve Fullstack SSR and Bidirectional Type-Flow Principles](./decisions/0004-fullstack-ssr-and-bidirectional-type-flow.md)
- [ADR 0005: Current-Passport Guard Evaluation for Default API Permissions](./decisions/0005-current-passport-guard-permission-evaluation.md)
- [ADR 0006: SSR Site Access and Role Model](./decisions/0006-ssr-site-access-and-role-model.md)
- [ADR 0007: Resource Mutation Response Contract](./decisions/0007-resource-mutation-response-contract.md)
- [ADR 0008: Role Localization Seed and Display Contract](./decisions/0008-role-localization-seed-and-display-contract.md)
- [ADR 0009: Preserve Homepage Module Naming Boundaries](./decisions/0009-homepage-module-naming-boundary.md)
- [ADR 0010: Keep Internal Planning Documents Repository-Native](./decisions/0010-repository-native-planning-documents.md)

### Business planning

- [A-Commerce Internal Planning](./business/a-commerce/README.md), including its [ADR 0001: Establish MVP Boundaries](./business/a-commerce/decisions/0001-mvp-boundaries.md)

### Architecture notes

- [a-status Module Architecture](./architecture/a-status-module-architecture.md)
- [Backend Resource Field Update Workflow](./architecture/backend-resource-field-workflow.md)
- [DTO Render Field-Name Typing Boundary](./architecture/dto-render-field-name-typing.md)
- [a-image Cloudflare Integration and Signed Delivery Architecture](./architecture/a-image-cloudflare-signed-delivery-architecture.md)
- [a-image Refactor Checklist](./architecture/a-image-refactor-checklist.md)
- [a-image Public Contract Follow-up Checklist](./architecture/a-image-public-contract-followup-checklist.md)
- [Resource Public Contract Exposure](./architecture/resource-public-contract-exposure.md)
- [Module Removal Workflow](./architecture/module-removal-workflow.md)
- [SSR Memory Leak Investigation Guide](./architecture/ssr-memory-leak-investigation-guide.md)
- [SSR `retrieveMenus` Role-Aware Cache Evaluation](./architecture/ssr-retrieve-menus-role-aware-cache-evaluation.md)
- [SSR Leak Experiment Flags Inventory](./architecture/ssr-leak-experiment-flags-inventory.md)
- [SSR Leak Experiment Cleanup Checklist](./architecture/ssr-leak-experiment-cleanup-checklist.md)
- [Vona/Zova Install-Time Type Patch](./architecture/vona-zova-install-time-type-patch.md)
- [SSR Route Typing and Zova Rest Declaration Visibility](./architecture/ssr-route-typing-zova-rest-declaration-visibility.md)
- [Anonymous Token Route Pattern](./architecture/anonymous-token-route-pattern.md)
- [AI Enablement Architecture](./architecture/ai-enablement.md)
- [User Workspace SSR Strategy](./architecture/user-workspace-ssr-strategy.md)
- [Vona Cross-Model Query-Cache Dependencies](./architecture/vona-cross-model-query-cache-dependencies.md)
- [Zova `$goto...()` Navigation Control-Flow Semantics](./architecture/zova-goto-navigation-control-flow-semantics.md)
- [Backend Test Resource Lifecycle](./architecture/backend-test-resource-lifecycle.md)
