# Edition Detection Reference

## Primary markers

Interpret the root markers as exactly one of these states:

- only `__CABLOY_BASIC__` present → Cabloy Basic
- only `__CABLOY_START__` present → Cabloy Start
- both markers present → treat the checkout as invalid or ambiguous and stop before making edition-specific assumptions
- neither marker present → inspect the owning `package.json` and nearby repository structure, then ask before making an edition-specific assumption

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
