# Directory Structure

## Directory Structure

```bash
project
├── docker-compose
├── env
├── src
│  ├── backend
│  │  ├── config
│  │  │  ├── config
│  │  │  └── locales.ts
│  │  ├── demo
│  │  ├── typing
│  ├── module
│  ├── module-vendor
│  ├── suite
│  │  └── a-home
│  │    ├── modules
│  │    │  ├── home-base
│  │    │  ├── home-index
│  │    │  └── home-user
│  └── suite-vendor
```

## Module/Suite

| Name              | Description                          |
| ----------------- | ------------------------------------ |
| src/module        | Standalone module                    |
| src/module-vendor | Standalone module (from third-party) |
| src/suite         | Suite                                |
| src/suite-vendor  | Suite (from third-party)             |

## Development suggestions

Vona has planned the modules/suites so that we can start business development immediately in the specified directory. The following conventions are only suggestions and are not mandatory:

1. `suite/a-home`: Is the starting point for business development, and any code in the suite can be modified as needed
2. `Grow into a large-scale system`: As the business expands, more suites and modules can be created to split the system business

## Directory cheat sheet

| Name                        | Description                                       |
| --------------------------- | ------------------------------------------------- |
| docker-compose              | docker-compose templates                          |
| env                         | [Env](../../env-config/env/introduction.md)       |
| src/front/config/config     | [Config](../../env-config/config/introduction.md) |
| src/front/config/locales.ts | [I18n](../scope/locale.md)                        |
| src/backend/play            | [Playground](../../start/play.md)                 |
| src/backend/typing          | Project-level type definitions                    |
