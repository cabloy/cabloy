# Semantic Presentation Contract

<Badge type="tip" text="Common" />

A **semantic presentation contract** defines what an audience needs to accomplish in a scene before a project chooses visual structure or a renderer. It connects confirmed product intent and operation-specific contracts to runtime presentation without making presentation metadata authoritative.

The semantic model applies across Cabloy editions. UI libraries, renderer identities, supported layout grammar, flavor commands, and generated-output paths remain edition-specific facts that must be verified in the active repository.

## What this contract solves

Use a semantic presentation contract to avoid:

- treating layout syntax or a renderer choice as product or API authority
- forcing Create, Update, View, list, and filter work through one universal DTO or visual tree
- duplicating DTO and schema truth in frontend-local field definitions
- treating visual hiding, route admission, or action visibility as authorization or privacy
- collapsing distinct audiences, API projections, state owners, or pages into groups or tabs

## Start with scene meaning, not a renderer

Design the scene in this order:

```text
audience → task → scene → meaningful business information areas
→ operation-specific DTO boundary → presentation translation → renderer choice
```

- **Audience** is whose work and authority context the scene serves.
- **Task** is whether that audience is finding, comparing, supplying permitted input, reviewing, or acting.
- **Scene** is the operation-specific list/filter, Create, Update, View, or purpose-built page context.
- **Information areas** organize facts by business meaning, such as identity, lifecycle, amount, availability, time, relationships, or immutable snapshots.
- **Presentation translation** applies order, in-scene visibility, grouping, local placement, and renderer choice to an already authorized contract.

Lists support finding and comparison. Create and Update scenes expose only permitted input. View scenes expose complete, audience-appropriate facts. List/filter and entry presentation are independently designed rather than being smaller or larger versions of one another.

## Keep authority at the right layer

| Layer                                  | Owns                     | May define                                                                                          | Must not redefine                                                                           |
| -------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Product requirements                   | Business outcome         | Audience, task, and meaningful information areas                                                    | DTO syntax or component structure                                                           |
| System requirements and operation DTOs | Scene contract           | API membership; editable, readonly, derived, hidden, and snapshot boundaries; ownership constraints | Product scope                                                                               |
| DTO render metadata                    | Presentation translation | Order, groups, sections, tabs, supported placement, visible presentation, and renderer identity     | API authority, persistence, validation, authorization, state/page ownership, or SSR privacy |
| Renderer/runtime implementation        | Runtime presentation     | UI-library-specific markup, input conversion, and interaction                                       | Business and security boundaries                                                            |

Suites that use PRD and SRS records should preserve that upstream authority chain. Metadata translates a confirmed contract; it does not create one.

## Design each scene as an explicit contract

Before authoring presentation metadata, make the scene answer these questions:

| Record                      | Questions to answer                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------------------- |
| Audience and task           | Who is doing what, and under which authority?                                                         |
| Scene                       | Is this list/filter, Create, Update, View, or a purpose-built experience?                             |
| Information areas           | Which business facts are needed, and in what input or reading order?                                  |
| Operation DTO boundary      | Which facts are editable, readonly, derived, hidden, live, or immutable snapshots?                    |
| Presentation strategy       | Is default rendering sufficient, is a shared renderer appropriate, or is a custom renderer justified? |
| Non-presentation boundaries | Which API, authorization, model/page ownership, scope, and SSR constraints remain unchanged?          |
| Evidence                    | Which emitted-contract and focused runtime or browser proof demonstrates the translation?             |

Different tasks can justify different DTO membership and layouts. Absence from an operation DTO is stronger and clearer than visual hiding. A separate audience, API contract, model owner, or page remains separate even when some business facts overlap.

## Translate an eligible scene contract into presentation

Vona DTO render metadata is the normal translation surface for Cabloy's schema-driven paths. It can express order, semantic groups, sections or tabs where supported, placement, presentation visibility within the resolved scene, and renderer identity or options.

It cannot add request or response membership, relax validation, change persistence, authorize browser input, or create server authority. Consume the operation-specific DTO rather than copying fields into a frontend-local schema. If a presentation needs a label or summary relation, make an explicit response-projection decision; presentation convenience does not justify broadening a mutation DTO or API.

Cabloy Basic's concrete `formLayout` grammar, block names, and DaisyUI/Tailwind implementation are details of that edition, not cross-edition guarantees. Cabloy Start readers should inspect the active Start repository before relying on a Basic renderer, UI resource, supported layout behavior, or command.

## Preserve boundaries that presentation cannot own

Presentation does not authorize.

- **API membership:** only operation DTOs and endpoint contracts decide what enters or leaves an operation.
- **Persistence and validation:** metadata cannot add fields, alter stored meaning, or bypass server validation.
- **Authorization and scope:** action visibility, menus, route admission, and visual hiding are not server authorization, tenant isolation, or owner filtering.
- **Audience/API separation:** Admin operational projections and Web self-service projections remain distinct when authority, scope, or experience differs.
- **Model and page ownership:** a visual group cannot merge separate state owners or page architectures.
- **SSR privacy:** render metadata and hydration flags do not decide whether private data may appear in server HTML.

For the related architecture boundaries, read [Admin Resource and Web Self-Service](/fullstack/admin-resource-and-web-self-service), [Navigation Guards Guide](/frontend/navigation-guards-guide), and [SSR Review Checklist](/frontend/ssr-review-checklist).

## Choose the renderer after the meaning is clear

Use this order:

1. Use the default renderer when it preserves the documented business meaning.
2. Reuse a shared renderer for recurring semantic needs, such as date/time, localized state labels, monetary values, resource identity, or structured details.
3. Introduce a custom renderer only when shared resources cannot accurately express the required meaning or interaction.

A Vona DTO or render-metadata change normally follows the [forward chain](/fullstack/contract-loop-playbook#forward-chain). A new frontend-owned renderer or resource is a [reverse-chain](/fullstack/contract-loop-playbook#reverse-chain) prerequisite before backend metadata references its identity. A mixed change respects both boundaries: establish the frontend resource handoff first when a new renderer will be referenced, then author and verify the backend translation and regenerate consumers.

For operational procedures, use the [Contract Loop Playbook](/fullstack/contract-loop-playbook), [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk), and [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend). [Tutorial 4: Custom Form/Table Renderers for Level](/fullstack/tutorial-4-custom-level-renderers) is a Cabloy Basic implementation specimen.

## Use Form Layout for structural translation

A semantic group represents a meaningful business information area. A section solves local Grid or flow placement. Tabs are for genuinely independent business domains or workflows. Field renderer and field-wrapper behavior remain separate from multi-field structure.

[Form Layout Guide](/frontend/form-layout-guide) explains Cabloy Basic's structural grammar and runtime behavior. It does not replace DTO membership, validation, action behavior, or authorization. Read [Form Guide](/frontend/form-guide) for field rendering, validation, and manual or mixed forms.

## Review checklist

- [ ] Audience, task, scene, and information areas were established before renderer or layout mechanics.
- [ ] Operation DTO membership establishes editable, readonly, derived, hidden, and snapshot boundaries.
- [ ] List/filter and entry/detail scenes were considered independently.
- [ ] Renderer choice preserves business meaning without broadening a DTO or API.
- [ ] Visual visibility is not being used for authorization, scope, or SSR privacy.
- [ ] Distinct audience contracts retain their API, state, and page boundaries when required.
- [ ] New frontend resources complete their reverse contract-loop handoff before backend metadata references them.
- [ ] Backend-owned contract changes include emitted-contract proof and forward regeneration.
- [ ] Edition-specific UI, renderer, flavor, and generated-output claims were verified against the active edition.

## Related reading

- [AI Spec-Driven Development](/ai/ai-spec-driven-development)
- [Contract Loop Playbook](/fullstack/contract-loop-playbook)
- [DTO Guide](/backend/dto-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [Form Layout Guide](/frontend/form-layout-guide)
- [Edition Consistency Checklist](/ai/edition-consistency-checklist)
