# Frontend Design Principles

This page distills the highest-value ideas from the legacy Zova "How intuitive, elegant, and powerful?" document into the new unified docs site.

## Intuitive reactivity

Zova keeps Vue3’s reactive strengths, but aims for a code style that feels closer to native variable usage than traditional `ref/reactive`-heavy code.

The practical design goal is not just shorter syntax. It is to keep business code understandable even as the system grows.

## Unified model-based state

A major Zova idea is that multiple state categories can be handled through one model-centered mental model instead of unrelated mechanisms.

The legacy explanation highlighted four common categories:

- asynchronous server-side data
- local storage data
- cookie data
- in-memory data

In Zova, these are intentionally brought under a more unified `Model` abstraction so SSR support, usage patterns, and maintenance expectations stay more consistent.

## IOC as the sharing model

The legacy docs also emphasized that state and behavior sharing across several scopes can be expressed through IOC rather than a pile of unrelated patterns.

Representative scopes include:

- component-internal sharing
- between-components sharing
- app-global sharing
- system-level sharing

This is one of the clearest reasons Zova code can look different from conventional Vue code while staying structured for large systems.

## IOC + AOP for extensibility

Zova does not treat IOC as only a dependency injection mechanism. It also layers AOP-oriented extensibility on top of IOC so the system can grow without forcing every concern into the same class body.

That is especially valuable for:

- logging
- cross-cutting behavior
- internal and external extension points
- large-scale maintainability

## Why this matters for AI work

These design principles should influence how AI systems work in Zova:

- do not rewrite Zova code toward generic Vue habits automatically
- do not assume `ref.value`-style patterns are the desired end state
- prefer existing model, IOC, and AOP conventions when extending code
- verify whether an existing Zova abstraction already solves the problem before introducing a framework-neutral pattern
