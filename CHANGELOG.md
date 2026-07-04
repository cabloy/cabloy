# Changelog

## 5.1.97

### Improvements

- Refresh the Zova lockfile after compensation rerun preparation.
- Refresh the Vona `zova-core` patch for v5.1.76.

## 5.1.96

### Features

- Integrate Cloudflare image provider with signed image delivery.
- Add scene-based image upload flow.
- Secure image upload token flow and support imageId-based training images.
- Restore `expiresIn` support for image upload tokens.
- Add basic-image table cell thumbnails.
- Add basic-image student field integration.
- Add the `a-image` upload API contract.
- Align image variants with transform options.
- Add the `a-image` suite scaffold and tests.

### Bug Fixes

- Sync nested detail image previews after dialog submission.
- Preserve OpenAPI metadata across schema rebuilds.
- Correct basic-image upload and preview URLs.
- Tighten image upload constraints.

### Improvements

- Strengthen image variant typing.
- Move basic-image types into `src/types`.
- Generate the basic-image OpenAPI SDK.
- Skip redundant OpenAPI metadata merges.
- Configure the default image upload provider.
- Extract shared base options for image provider clients.
- Remove the unused native signed URL helper.

## 5.1.95

### Improvements

- Refresh the Zova lockfile to prepare for the compensation rerun.
- Refresh the `vona zova-core` patch for compatibility with `v5.1.75`.

## 5.1.94

### Features

- Update the application with the latest changes.

## 5.1.93

### Bug Fixes

- Apply theme colors to select options

## 5.1.92

### Bug Fixes

- Preserve SSR route typing visibility.

### Improvements

- Clarify side-effect import module names.
- Publish the latest package updates.

## 5.1.91

### Features

- Update core behavior to support the latest internal feature changes.

### Improvements

- Refine utility helpers for better internal consistency.
- Improve static middleware handling.
- Enhance SSR metadata store internals.

## 5.1.90

### Features

- Update functionality.

## 5.1.89

### Improvements

- Document the `pnpm` `minimumReleaseAge` workaround.

## 5.1.88

### Features

- Update functionality.

## 5.1.87

### Improvements

- Refresh the zova lockfile to prepare for the compensation rerun.
- Refresh the vona `zova-core` patch for v5.1.74.

## 5.1.86

### Bug Fixes

- Commit rerun lockfile residue before performing a compensation rerun.

### Improvements

- Bump `zova-core` to `v5.1.73`.
- Refresh the Vona `zova-core` patch for `v5.1.72`.

## 5.1.85

### Bug Fixes

- Skip staging for ignored compensation packages.

### Improvements

- Update `zova-core` to v5.1.71.
- Refresh the Zova lockfile after the v5.1.84 release.

## 5.1.84

### Improvements

- Publish version 5.1.84.
- Bump `zova-core` to v5.1.69.
- Refresh the Vona `zova-core` patch for v5.1.68.

## 5.1.83

### Bug Fixes

- Automate refresh of the zova-core compensation graph.
- Harden zova-core compensation rollback handling.

## 5.1.81

### Improvements

- Refresh the `vona` `zova-core` patch for v5.1.66.

## 5.1.80

### Bug Fixes

- Harden the `zova-core` release compensation flow.

## 5.1.79

### Improvements

- Refresh the `vona zova-core` patch for `v5.1.64`.

## 5.1.78

### Improvements

- Add a release compensation flow for `zova-core`.
- Publish the latest package updates.

## 5.1.77

### Improvements

- Update package metadata and lockfile for the 5.1.77 release.
- Publish version 5.1.77.

## 5.1.76

### Improvements

- Unify wording around reverse-chain dependency drift.
- Finish cleanup of reverse-chain documentation wording.

## 5.1.75

### Improvements

- Update `upgrade.ts` to refine upgrade-related behavior.

## 5.1.74

### Features

- Update related functionality and project components.

### Bug Fixes

- Alias MariaDB drivers correctly in the Vona build.
- Reorder initialization to bootstrap Zova REST before other startup steps.
- Seed Vona Zova REST dependencies before running the initial install.

### Improvements

- Align Zova REST workspace naming.
- Streamline the Zova REST workspace flow.

## 5.1.73

### Features

- Export the training record entity.
- Update exposed functionality and related behavior.

### Bug Fixes

- Expand the `zova-core` type patch in `vona`.
- Patch `zova-core` type augmentation in `vona`.
- Watch `.tsx` file changes correctly in dev `nodemon`.

### Improvements

- Move the average score effect into the shared library.
- Move the training record subject effect into the shared library.
- Clarify `dtoClass` usage in DTO inference and master-detail documentation.
- Add master-detail guidance and skill routing documentation.
- Update tab rendering behavior.

## 5.1.72

### Features

- Update training record subject effects.
- Update related functionality.

## 5.1.71

### Features

- Improve CEL default value handling.
- Update published functionality.

### Improvements

- Harden ignored-file handling in lint-staged.
- Normalize `commandssync` metadata formatting.
- Add a schema-driven field effects guide.

## 5.1.70

### Features

- Improve CEL numeric formatting for training records.
- Trigger `onEffect` callbacks for form fields.

### Improvements

- Add examples for CEL numeric formatting to the documentation.

## 5.1.69

### Features

- Add `onEffect` support for form fields.
- Add update functionality.

## 5.1.68

### Features

- Reshape training record summary fields.
- Refine training record and student field titles.
- Update training subject field metadata.
- Deliver additional application updates.

### Bug Fixes

- Improve date input handling.

### Improvements

- Update `tableCell.resourcePicker.tsx`.

## 5.1.67

### Features

- Add nested training record subjects.
- Update application features and workflows.

### Bug Fixes

- Clarify `Api.field` Zod schema ordering.

## 5.1.66

### Features

- Add the Vona master-detail scaffold workflow.
- Add details action boilerplates.
- Add a details view action.
- Add dialog-based detail creation.
- Add a detail edit dialog.
- Enhance modal close controls.
- Improve dialog viewport sizing.
- Improve detail row handling.
- Support DTO metadata replacement.

### Bug Fixes

- Validate canonical suite names across CLI commands.
- Validate canonical module names across CLI commands.
- Validate canonical master-detail module names.
- Support `dtoClass` fields in DTO mutation.
- Normalize relation table identity comparisons.

### Improvements

- Remove Zova CLI canonical helper shims.
- Extract a generic file content patch helper.
- Unify master-detail patch runners.
- Extract master path helpers.
- Extract locale and metadata helper flow.
- Extract master DTO string builders.
- Extract detail metadata patch helper.
- Extract master model and service patch helpers.
- Extract detail entity patch helpers.
- Split master-detail detail mode helpers.
- Extract master-detail DTO patch helpers.
- Streamline master-detail scene and locale loops.
- Simplify the master-detail DTO rendering flow.
- Support detail render context in dialog forms.
- Move the detail dialog form to the detail service.
- Extract the details block form component.
- Extract the details dialog form helper.
- Align the `actionCreate` dialog style.
- Use a `Set` for relation identity lookup.

## 5.1.65

### Features

- Update project functionality across multiple areas.

## 5.1.64

### Features

- Add various updates and feature enhancements across the project.

## 5.1.63

### Features

- Add the `basic-app` modal module.
- Add update functionality.

### Improvements

- Update the force-delete action modal flow.
- Unify modal command usage.
- Migrate remaining confirmation dialogs to `basic-app`.

## 5.1.62

### Features

- Add a domain planning skill.
- Add a masked mobile field to the student resource.
- Generate an OpenAPI SDK for `demo-student`.
- Add student summary and force-delete actions.
- Customize student level renderers.
- Add the `demo-student` module with a full student CRUD flow.

### Bug Fixes

- Localize the student menu in `zh-cn`.
- Override the level filter placeholder correctly.
- Stabilize empty select value mapping.
- Polish inline select spacing.
- Forward select blur handling correctly.
- Refine borderless styling for filter selects.
- Place explicit schemas last in `demo-student` metadata.

### Improvements

- Clarify level renderer examples.
- Clarify the standalone tutorial sandbox.
- Refresh training-student references.
- Move `demo-student` into the `a-training` suite.
- Add a suite-first modularization guide.
- Clarify the thin model facade reading path.
- Include `demo-student` in the root npm package.
- Expand source-reading and contract-loop guides.
- Clean `demo-student` locale resources.
- Move `TableCell` beans to app scope.
- Align the student summary query flow.
- Simplify the student summary action flow.
- Refine the student level renderer hierarchy.
- Add a page meta guide and cross-links.
- Add a rest-resource runtime documentation set.
- Refine tutorial 4 AI prompt wording.
- Expand Zova Router ecosystem guides.
- Add the Zova Table documentation cluster.

## 5.1.61

### Features

- Enforce explicit OpenAPI operation filters.
- Remove the demo-student module and document the module-removal workflow.
- Add a mobile field to students and document serializer guidance.

### Bug Fixes

- Decouple test data initialization from application initialization.
- Refresh the student summary after updates.

### Improvements

- Migrate the contract-loop hook to TypeScript.
- Harden and simplify contract-loop guidance and gate behavior.
- Add Zova Form documentation and navigation.
- Refine ModelResource guidance and examples.
- Add Zova command scene, fetch interceptor, frontend reading, and Status architecture guides.
- Update backend contract-sharing tutorial and related skill documentation.

## 5.1.60

### Features

- Add a mobile field to the demo-student example.
- Add demo-student summary and force-delete flows.
- Add a level renderer workflow to the demo-student example.
- Initialize test data automatically after setup.
- Refine router tab insertion order.

### Improvements

- Add SSR architecture and workflow guides.
- Add a Web Socket documentation set.
- Add a Zova Behavior guide.
- Add router tabs documentation.
- Add advanced bean scene authoring guides and document boilerplate variants.
- Add a fullstack quick start tutorial series and document core fullstack principles.
- Refactor the fullstack AI tutorial series and streamline quick start guidance.
- Clarify helper placement and strengthen contract loop examples with reusable patterns.
- Simplify and polish tutorial prompts, verification steps, and user workflow guidance.
- Unify resource-owned custom item state handling.
- Update `tmp` to `0.2.7` and `tar` to `7.5.16`.
- Disable `pnpm` `minimumReleaseAge` in CI workflows.

### Bug Fixes

- Make contract loop examples more resilient.
- Refine select placeholder guidance.

## 5.1.59

### Features

- Update functionality.

### Improvements

- Update `upgrade.ts`.
- Publish the latest package changes.

## 5.1.58

### Features

- Support nullable query filters.
- Deliver several feature updates across the library.

### Improvements

- Add a Docker Compose quickstart flow to the documentation.
- Refresh the framework performance documentation.

## 5.1.57

### Features

- Track the Cabloy version during initialization and upgrade.

## 5.1.56

### Features

- Update functionality.

## 5.1.55

### Features

- Add update-related functionality.

### Improvements

- Create the `pnpm-workspace.yaml` workspace configuration.
- Update the `pnpm-workspace.yaml` workspace configuration.

## 5.1.54

### Features

- Add a set of incremental feature updates across the codebase to expand supported functionality and behavior.

### Bug Fixes

- Support `src/module` test targets.
- Support module-relative test targets.

### Improvements

- Clarify ORM omit semantics in tests and documentation.
- Refine query and model-related internals, including updates to post handling, `where` building, and model cache behavior.

## 5.1.53

### Features

- Update application functionality across core feature areas.
- Update configuration behavior and related integration points.
- Update theme configuration and controller handling.

### Improvements

- Remove the generated `$useLocale` helper.
- Refresh project configuration files and internal implementation details.

### Breaking Changes

- Rename the SSR cookie-disabled server flag and update related documentation.

## 5.1.52

### Features

- Add SSR memory diagnostic endpoints.
- Expand framework capabilities across SSR, controller, module, component, utility, and runtime integration areas.
- Add virtual decorator guidance to the AI documentation.

### Bug Fixes

- Correct runtime home paths in the documentation.
- Fix homepage scope badge layout in the documentation.

### Improvements

- Refine SSR internals and metadata handling.
- Polish controller and page base implementation details.
- Update monkey patching and runtime support code.
- Improve package metadata and lockfile consistency.
- Pass the GA measurement ID into the docs build pipeline.
- Add GA4 tracking support for the documentation site.
- Improve CLI, index, glossary, skill, and README documentation.
- Add and refine the Cabloy framework comparison and fullstack introduction content.
- Polish branding, wording, and AI vibe coding terminology across the docs.

## 5.1.51

### Features

- Add unified Cabloy documentation and root skills.
- Update the project with new capabilities.

### Bug Fixes

- Precompute default permissions from route metadata to ensure permission projection behaves correctly.

### Improvements

- Refresh documentation entry points and add a pages workflow.
- Update the quickstart and clarify onboarding and upgrade workflow guidance.
- Clarify documentation audiences, contributor scope, and implementation guidance across backend and reference docs.
- Separate project and contributor documentation entry points and improve root README positioning and overview.
- Expand unified migration, backend, frontend, auth, and AOP guides.
- Align Web/Admin terminology across English and Chinese documentation.
- Add architecture notes and internal engineering documentation structure for permission projection.
- Exclude internal engineering docs and Claude worktrees from published npm packages.
- Align global bean typing with metadata.
- Rename the database dialect base to match service naming.
- Move the model base chain into the library layer.
- Align service underscore registration semantics.
- Move the database dialect base into the service scene.
- Align B2 runtime anchors with the service scene.
- Add project site publishing support, including CNAME and publish workflow updates.

## 5.1.50

### Features

- Update tab-related behavior and rendering.

### Bug Fixes

- Reset tabs when the layout refreshes.
- Improve active tab route matching.
- Handle alias routes correctly for active tabs.
- Improve navigation for localized home routes.

### Improvements

- Refine tab rendering logic.

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
