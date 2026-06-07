# SSR Environment Variables

This guide explains SSR-related environment variables in Zova within the Cabloy monorepo.

## Why SSR env configuration matters

SSR behavior often depends on environment variables that do not matter in exactly the same way for purely client-side execution.

Zova exposes SSR-related environment variables so the framework can configure key behaviors directly.

## Representative configurable variables

Representative variables include:

- `SSR_COOKIE`
- `SSR_COOKIE_THEMEDARK_DEFAULT`
- `SSR_BODYREADYOBSERVER`
- `SSR_API_BASE_URL`
- `SSR_PROD_PORT`

These affect areas such as cookie-driven SSR behavior, theme defaults, body-load observation, server-side API targeting, and SSR production port behavior.

## Dynamic environment variables

The runtime also exposes environment variables that describe the current execution context, such as:

- `SSR`
- `DEV`
- `PROD`
- `CLIENT`
- `SERVER`

These are important because SSR-aware code often needs to distinguish:

- server versus client behavior
- development versus production behavior
- SSR mode versus non-SSR mode

## Implementation checks for SSR environment-sensitive changes

When editing SSR-sensitive code, do not assume one execution environment.

It should explicitly consider whether the code path depends on:

- server versus client execution
- dev versus prod behavior
- SSR-specific environment configuration

That is often the difference between code that “works locally once” and code that fits the actual Zova SSR model.

For the broader mode/appMode/flavor and env/config loading model, see [Environment and Config Guide](/frontend/environment-config-guide).
