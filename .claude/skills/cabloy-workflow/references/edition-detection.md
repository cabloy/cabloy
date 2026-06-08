# Edition Detection Reference

## Primary markers

Use these root markers first:

- `__CABLOY_BASIC__`
- `__CABLOY_START__`

## Why the markers matter

They prevent the most common category error in Cabloy AI work: assuming Cabloy Basic and Cabloy Start are interchangeable.

That assumption is especially dangerous for:

- UI-layer-sensitive examples
- frontend flavor names
- page/component workflows
- suite/module availability
- SSR site baselines and project assets
- docs and skills that try to support both repos

## Secondary checks

After the marker is identified, confirm the active workflow against:

- the repository or workspace `package.json` that owns the active scripts
- relevant `npm run vona` or `npm run zova` usage
- edition-specific flavor names in scripts
- nearby module or suite layout
