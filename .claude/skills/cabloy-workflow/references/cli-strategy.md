# CLI Strategy Reference

## Principle

The Vona and Zova CLIs already encode many framework conventions. A good Cabloy workflow should reuse them before writing files manually.

## Vona

Look for command families such as:

- `bin:*`
- `create:*`
- `init:*`
- `tools:*`

These commonly cover backend scaffolding, initialization, metadata, CRUD workflows, and verification.

## Zova

Look for command families such as:

- `bin:*`
- `create:*`
- `init:*`
- `refactor:*`
- `tools:*`
- `openapi:*`

These commonly cover frontend scaffolding, refactors, metadata, and OpenAPI-related generation.

## Practical rule

Before suggesting manual scaffolding, check whether the request can be translated into:

1. a Vona command
2. a Zova command
3. a short CLI + inspect + verify loop

If yes, recommend that path first.
