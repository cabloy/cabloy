# Generic Component Guide

This guide explains how generic components work in Zova within the Cabloy monorepo.

## Why generic components matter

Zova supports generic components so strongly typed reusable components can preserve richer type information across usage sites.

This matters in large TypeScript-heavy systems because generic components help keep abstraction reusable without giving up strong typing.

## Convert a component to a generic component

Example: convert component `card` into a generic component.

```bash
npm run zova :refactor:componentGeneric card -- --module=demo-student
```

## Why the CLI matters here

This topic is intentionally short, but the implication is important: generic-component conversion is not treated as an ad hoc manual rewrite. It is part of the framework’s supported refactor surface.

That means the safest default is to let the Zova refactor command establish the skeleton first, then refine the typing and behavior.

## Implementation checks for reusable component design

When you see a component that is reused across multiple typed data shapes, ask whether the right answer is a generic component instead of copying the component into several near-duplicate variants.

A better default is:

1. inspect whether the component really needs generic typing
2. use the Zova generic-component refactor command
3. refine the resulting type surface instead of inventing a framework-foreign pattern

That keeps generic typing aligned with Zova’s supported refactor workflow.
