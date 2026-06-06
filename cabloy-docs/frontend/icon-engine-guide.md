# Icon Engine Guide

This guide explains how the icon engine works in Zova within the Cabloy monorepo.

## Why the icon engine exists

In large systems, no fixed built-in icon set is ever enough.

Zova’s icon engine solves that problem by treating icons as a modular, asynchronous, UI-library-independent resource system.

## Core advantages

Several important advantages stand out:

- easy icon maintenance
- performance-conscious loading behavior
- asynchronous loading on demand
- UI-library independence

This is especially important for Cabloy because the same icon strategy should work across Basic and Start even when their UI libraries differ.

## Basic concepts

The icon engine is organized around two ideas:

### Icon group

A group combines multiple SVG icons into one asynchronously loaded unit.

### Icon module

An icon module can contain multiple groups, and a system can contain multiple icon modules.

## Naming convention

The naming convention is:

```text
{moduleName}:{groupName}:{iconName}
```

Representative example:

- full name: `home-icon:default:add`

There are also shorthand rules, such as:

- `::add`
- `:auth:github`
- `test-othericon::icon`

This matters because icon use is part of the framework’s typed, discoverable resource model.

## Access helpers

Two important helpers are:

- `icon` for typed icon-name access and completion
- `iconh` for directly generating the icon vnode

## UI-library independence

The icon engine exposes a unified interface that can be used from multiple UI libraries.

This is one of the clearest places where Zova’s architecture deliberately protects higher-level app code from UI-library churn.

## Create and build icons

A simple process looks like this:

1. initialize the icon skeleton
2. place SVG icons into the module/group directory
3. regenerate metadata

The metadata generation step matters because icons are part of the framework’s typed resource graph.

## Why this matters for AI workflows

When AI adds icons, it should not hardcode one-off icon usage patterns too quickly.

A better default is to ask:

1. should the icon belong in an existing icon module or a new one?
2. what group should own it?
3. should metadata be regenerated after adding the icon?
4. is the chosen icon usage path still UI-library-independent?

That keeps icon work maintainable and consistent across editions.
