# Cabloy Start

Cabloy Start is the private commercial edition. It is a sibling private repository that shares the Cabloy fullstack direction while intentionally differing from Cabloy Basic.

## Repository marker

The Cabloy Start root contains:

- `__CABLOY_START__`

Use that marker before choosing examples, UI assumptions, or automation behavior.

## Typical role

Use Cabloy Start as the edition-aware target when work depends on:

- direct use of the licensed private repository source
- Vuetify-specific frontend workflows
- Cabloy Start flavor names in frontend scripts
- edition-specific module composition in the licensed Start repository
- licensed private-repo structure and edition-specific project composition
- edition-specific SSR site baselines and project assets

## Get access and initialize

Cabloy Start is the private commercial edition. It does not use the default `npm create cabloy` project route.

To use Cabloy Start:

1. purchase a license and obtain repository access
2. clone the private repository source directly
3. run the edition initialization flow in the cloned project

Access surfaces:

- Purchase page: `https://cabloy.com/module/cabloy-start`
- Repository: `https://github.com/cabloy/cabloy-start`

Clone the repository:

```bash
git clone git@github.com:cabloy/cabloy-start.git
```

After cloning, run:

```bash
npm run init
```

This initializes the project and installs dependencies.

## Relationship to this docs site

This unified docs site treats Cabloy Start as a supported edition, not as a clone of Cabloy Basic. Shared architecture should remain shared, but any Start-specific script, module path, or UI workflow must be labeled explicitly.
