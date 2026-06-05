# CLI Reference

This page is the compact reference layer for the two main command entrypoints.

## Vona

Entry from repo root:

```bash
npm run vona :
npm run vona :create
npm run vona :tools
```

Primary command families:

- `bin:*`
- `create:*`
- `init:*`
- `tools:*`

## Zova

Entry from repo root:

```bash
npm run zova :
npm run zova :create
npm run zova :refactor
```

Primary command families:

- `bin:*`
- `create:*`
- `init:*`
- `refactor:*`
- `tools:*`
- `openapi:*`

## Guidance

When creating docs, skills, or rules, use the CLI family names as the public mental model first. Only drop to file-level implementation details when the command surface is insufficient.
