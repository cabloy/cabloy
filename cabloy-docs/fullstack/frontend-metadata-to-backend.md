# Frontend Metadata Back to Backend

This page documents the reverse direction of Cabloy’s fullstack collaboration loop: frontend-generated metadata that improves backend-side development and tooling.

## Why this path matters

The fullstack collaboration loop in Cabloy is not one-way.

For the forward contract-bridge direction from backend OpenAPI to frontend consumption, also see [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).

The backend does not only feed the frontend through OpenAPI. The frontend also generates information that can improve backend-side type hints and integration confidence.

This is one of the unusual strengths of the Cabloy monorepo model.

## What the frontend can generate

The current script surface shows that Zova can generate metadata and type information for areas such as:

- routes
- components
- icons
- REST-related generated output

That generated information can then be consumed by backend-side fullstack workflows and developer tooling.

## Why this is valuable

In a separated-repo world, this information is often harder to share, easier to stale, and more annoying for AI to rediscover.

In the monorepo, the frontend-generated metadata can stay close to:

- the frontend source that produced it
- the backend workflows that consume or rely on it
- the docs and skills that explain the collaboration path

## Typical collaboration pattern

A practical collaboration loop often looks like this:

1. define or update frontend routes/components/icons
2. regenerate the relevant frontend metadata or REST/type output
3. let backend-side workflows, docs, or fullstack integration logic consume the generated information
4. verify the collaboration path still matches the active edition

## Edition awareness

This path is especially sensitive to edition differences because Basic and Start do not expose the same frontend module and UI shape.

So when AI reasons about frontend-generated metadata, it should verify:

- which repo is active
- which flavor is active
- which generated output belongs to that edition

## Implementation checks for frontend-metadata changes

When changing frontend structural resources such as routes or components, ask:

1. does metadata need regeneration?
2. does backend-side tooling or fullstack integration rely on that metadata?
3. is this a Basic-specific or Start-specific workflow?
4. should the next action be generation and verification rather than only source edits?

That keeps the reverse contract loop visible instead of accidental.
