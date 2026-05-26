# Directory Structure

## Directory Structure

```bash
project
├── env
├── src
│  ├── front
│  │  ├── config
│  │  │  ├── config
│  │  │  └── locales.ts
│  ├── module
│  ├── module-vendor
│  ├── suite
│  │  ├── a-demo
│  │  └── a-home
│  │    ├── modules
│  │    │  ├── home-base
│  │    │  ├── home-icon
│  │    │  ├── home-index
│  │    │  └── home-layout
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

Zova has planned the modules/suites so that we can start business development immediately in the specified directory. The following conventions are only suggestions and are not mandatory:

1. `suite/a-demo`: Contains some test or demo code, which can be disabled during build
2. `suite/a-home`: Is the starting for business development, and any code in the suite can be modified as needed
3. `Grow into a large-scale system`: As the business expands, more suites and modules can be created to split the system business

## Directory cheat sheet

| Name                                 | Description                                            |
| ------------------------------------ | ------------------------------------------------------ |
| env                                  | [Env](../../env-config/env/introduction.md)            |
| src/front/config/config              | [Config](../../env-config/config/introduction.md)      |
| src/front/config/locales.ts          | [I18n](../scope/locale.md)                             |
| src/suite/a-home/modules/home-api    | [API](../../techniques/server-data/api.md)             |
| src/suite/a-home/modules/home-base   | [Navigation Guards](../../page/navigation-guards.md)   |
| src/suite/a-home/modules/home-icon   | [Icon](../../techniques/icon/icon-engine.md)           |
| src/suite/a-home/modules/home-index  | [Route Alias](../../page/route-alias.md)               |
| src/suite/a-home/modules/home-layout | [Route Fields: meta.layout](../../page/page-layout.md) |
