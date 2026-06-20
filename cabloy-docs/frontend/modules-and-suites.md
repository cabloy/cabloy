# Modules and Suites

## Why modularization matters in Zova

Zova organizes frontend code into modules and suites so business code can scale without collapsing into one large undifferentiated app surface.

That matters for:

- business decoupling
- reuse of feature units
- clear bundle boundaries
- team-level work decomposition
- namespace isolation

## Module as the core business unit

In Zova, a module groups related pages, components, config, locale, API resources, and other frontend assets into one coherent feature boundary.

A module is not just a folder. It is a unit of architecture, naming, and bundling.

## Why modules help

Representative benefits include:

- clearer business boundaries
- easier reuse across systems
- reduced naming conflicts through namespace isolation
- more natural async bundle boundaries during build

## Module naming convention

Zova modules follow a naming model such as:

```text
FullName: zova-module-{providerId}-{moduleName}
ShortName: {providerId}-{moduleName}
```

This naming system is important because it supports both architectural clarity and bean/scope identity across module boundaries.

## Suite as a multi-module boundary

A suite groups several related modules into a larger business scenario.

Representative examples might correspond to areas such as:

- e-commerce
- CRM
- supply chain
- shared application foundations

A suite is therefore not merely a package wrapper. It is a business-level composition boundary.

## Suite naming convention

Suites follow a similar naming model:

```text
FullName: zova-suite-{providerId}-{suiteName}
ShortName: {providerId}-{suiteName}
```

## Create modules and suites

Representative CLI entrypoints are:

```bash
npm run zova :create:module moduleName -- [--suite=]
npm run zova :create:suite suiteName
```

That matters because the CLI already knows the intended source-tree conventions and should be preferred over ad hoc manual scaffolding.

## Directory structure

The project directory structure expresses this modular architecture directly.

Representative areas include:

- `src/module`
- `src/module-vendor`
- `src/suite`
- `src/suite-vendor`

This makes frontend architecture visible in the source tree rather than hiding it behind build-only conventions.

### Representative source tree

```text
project
├── env
├── src
│  ├── front
│  │  └── config
│  ├── module
│  ├── module-vendor
│  ├── suite
│  │  ├── a-demo
│  │  └── a-home
│  │     └── modules
│  │        ├── home-base
│  │        ├── home-icon
│  │        ├── home-indexadmin
│  │        └── home-layoutadmin
│  └── suite-vendor
```

A practical convention from the legacy guidance is that `a-demo` can host demo or disposable exploratory code, while suites such as `a-home` act as the normal starting point for real application growth.

## Module and suite boundaries in practice

A practical mental model is:

- use a **module** for a coherent feature unit
- use a **suite** when several modules belong to one larger business scenario
- use the source tree as a reflection of real architecture, not only file storage

## Relationship to frontend build behavior

A module is also a natural async bundle boundary.

That means modularization is not only about code organization. It also affects how frontend output is built, loaded, and maintained.

### Package-level module metadata

A module package can also declare metadata in `package.json` through `zovaModule`, for example to describe inter-module dependencies or bundle behavior.

Representative patterns include:

```json
{
  "name": "zova-module-training-student",
  "zovaModule": {
    "dependencies": {
      "a-zova": "5.0.0"
    }
  }
}
```

```json
{
  "name": "zova-module-a-model",
  "zovaModule": {
    "bundle": {
      "vendors": [
        {
          "match": ["@tanstack/query-core", "@tanstack/vue-query"],
          "output": "tanstack-query"
        }
      ]
    }
  }
}
```

This reinforces that modules are not merely folders. They are explicit package, dependency, and bundle boundaries.

## Relationship to other frontend guides

Read this together with:

- [Suites and Modules](/fullstack/suites-and-modules) for the cross-stack suite-first decision path in the monorepo
- [IoC and Beans](/frontend/ioc-and-beans)
- [Module Scope](/frontend/module-scope)
- [Frontend Scripts](/frontend/scripts)
- [Reference Package Map](/reference/package-map)

These guides explain how modules connect to bean identity, scope-based resources, and monorepo layout.

## Implementation checks for module and suite changes

When editing or creates frontend code, ask:

1. does this belong in an existing module or a new one?
2. is this really one feature unit, or should it become part of a suite?
3. does the naming follow Zova’s module/suite conventions?
4. will the chosen placement preserve the intended architectural and bundle boundaries?

That helps AI keep frontend growth aligned with Zova’s modular system instead of falling back to generic folder expansion.
