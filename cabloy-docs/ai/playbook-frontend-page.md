# Playbook: Add a Frontend Page

This playbook turns the Zova frontend docs into a repeatable AI-friendly workflow.

## When to use this playbook

Use this playbook when the goal is to add or extend a frontend page, especially when the work may involve:

- page creation
- route and params/query setup
- component integration
- model or API integration
- edition-sensitive UI assumptions

## Step 1: Detect the edition first

Before generating or editing anything:

1. check `__CABLOY_BASIC__` or `__CABLOY_START__`
2. confirm the active frontend flavor assumptions
3. inspect root `package.json` and `npm run zova`

This matters because frontend examples can differ between Basic and Start.

## Step 2: Use the page generator first

Start from the Zova generator instead of creating the page structure manually.

Representative command:

```bash
npm run zova :create:page ...
```

## Step 3: Add page capabilities with refactor commands

If the page needs additional framework features, prefer the dedicated refactor commands.

Representative examples:

```bash
npm run zova :refactor:pageQuery ...
npm run zova :refactor:pageParams ...
```

That is better than manually recreating the framework structure because the refactor commands preserve Zova conventions.

## Step 4: Connect data and components the Zova way

Depending on the page, extend it through the right abstraction layer:

- API service
- model-managed remote state
- component wrappers
- SSR init data
- navigation guards or route metadata

Relevant docs:

- [Page Guide](/frontend/page-guide)
- [Page Query Guide](/frontend/page-query-guide)
- [Page Params Guide](/frontend/page-params-guide)
- [API Guide](/frontend/api-guide)
- [Model State Guide](/frontend/model-state-guide)
- [SSR Init Data](/frontend/ssr-init-data)

## Step 5: Regenerate metadata when needed

If the page changes affect route structure or typed metadata, regenerate the relevant metadata through the Zova tool path.

Representative command family:

```bash
npm run zova :tools:metadata ...
```

## Step 6: Verify the active edition workflow

Use the right verification path for the active repo and flavor.

Typical checks include:

```bash
npm run tsc
npm run build:zova
```

And if needed, the relevant `zova/` flavor-specific build or REST generation paths.

## AI rule of thumb

A good AI frontend-page workflow in Cabloy is usually:

1. detect edition
2. choose generator or refactor command
3. generate or transform
4. connect API/model/SSR pieces
5. regenerate metadata if needed
6. verify
