# Changelog

## 5.1.49

### Features

- Add typed locale parameters for the home page.
- Support route parameters in router navigation.

### Bug Fixes

- Resolve localized menu page paths.

### Improvements

- Update `render.tabs.tsx`.

## 5.1.48

### Bug Fixes

- Prevent crashes caused by disposed modules during SSR history navigation.

### Improvements

- Update the `ssrMenuGroup` demo.

## 5.1.47

### Bug Fixes

- Fix web header navigation rendering.
- Prevent web header dropdown menus from being clipped.

### Improvements

- Update internal project dependencies and maintenance changes.

## 5.1.46

### Improvements

- Refine SSR site base handling in `beanSsrSiteBase.ts`.
- Improve executor behavior in `executor.ts`.
- Update tab rendering logic in `render.tabs.tsx`.
- Adjust route configuration in `routes.ts`.

## 5.1.45

### Features

- Add SSR menu boilerplates for demo applications.
- Add SSR menu boilerplates for web applications.
- Add SSR menu boilerplates for admin applications.

### Bug Fixes

- Remove redundant locale menu refetch watchers.
- Improve menu query key scoping and prevent circular group recursion.

## 5.1.44

### Features

- Add the `a-demo` suite workspace package.

## 5.1.43

### Improvements

- Update `package.original.json`.

## 5.1.42

### Features

- Add the Cabloy basic site web module.
- Add home web modules.
- Add the home layout web structure.
- Add locale handling for home routes.
- Add basic site web locale menu support.

### Bug Fixes

- Use the locale service for the layout web switcher.
- Localize language switcher labels.

### Improvements

- Improve init and upgrade scripts.
- Share the details dropdown close helper.
- Update basic site web SSR paths.
- Update the home layout web header button.
- Update home layout theming and web rendering.
- Update home layout web rendering.
- Rename the home index admin dashboard.
- Rename home layout tabs to layout admin.

## 5.1.41

### Improvements

- Update `init.ts`.

## 5.1.40

### Improvements

- Prepare the v5.1.40 release.
- Update `CHANGELOG.md` for v5.1.39.

## 5.1.39

### Features

- Update

### Improvements

- Replace arrow function model references with string-based module references in ORM relations and cache config
- Update CLI usage strings to use npm run prefix

## 5.1.38

### Features

- Update

## 5.1.16 (2026-05-29)

## 5.1.18

### Bug Fixes

- Correct extractTarball exit code check in upgrade script

## 5.1.15

### Features

- Force include .gitignore in npm package

## 5.1.14

### Features

- Require project name in create-cabloy and set APP_NAME during init

### Improvements

- Update dependencies

## 5.1.13

### Features

- Add upgrade script and remove testSecond flavor env files

### Improvements

- Switch tsconfig base from front to api and update dependencies

## 5.1.12

## 5.1.11

### Features

- Remove `testSecond` flavor scripts from `package.original.json`
- Apply general updates

### Improvements

- Update `oxfmt` configuration

## 5.1.10

### Features

- Add `create-cabloy` CLI package and remove pre-built SSR assets
- Remove `cli.create.project` from vona and zova CLI packages
- Update project scaffolding and core features

### Improvements

- Add husky and lint-staged for pre-commit lint/format
- Consolidate ignore patterns and apply oxfmt formatting
- Update initialization scripts and .gitignore
- Update package, lerna, and release script configurations

## 5.1.9

## 5.1.8

### Features

- Add zova/vona sub-project release to cabloy release workflow

### Bug Fixes

- Use lerna `--no-push` to avoid pushing stale tags
- Fix test-ssr TypeScript error

### Improvements

- Update release script
- Update Oxlint configuration
- Update Vue linting script

## 5.1.7

### Features

- Rename app to Cabloy Basic, add build/start scripts, and update oxfmt excludes
- Generate passwords dynamically at init instead of hardcoding in docker-compose.yml
- Apply various feature updates

### Improvements

- Update initialization script
- Update settings configuration

## 5.1.6

### Features

- Add Claude release command and local settings
- Add oxfmt and oxlint configuration files
- Update package description and reformat release script

### Bug Fixes

- Extract text block from API response with thinking blocks

## 5.1.5

### Bug Fixes

- Extract text block from API response with thinking blocks

### Improvements

- Improve changelog commit range and remove process-helper dependency
