# Contributing to Cabloy Basic

Contributions to Cabloy Basic source, tests, tooling, and documentation are welcome. Cabloy Basic is the public Cabloy framework/reference edition, with Vona backend and Zova frontend layers.

## Before you begin

- Use [GitHub Issues](https://github.com/cabloy/cabloy/issues) for reproducible bugs, public questions, and feature proposals. Search for an existing issue first.
- Use [pull requests](https://github.com/cabloy/cabloy/pulls) for focused, reviewable changes.
- For a bug report, include the expected and actual behavior, a minimal reproduction or sufficient setup details, and relevant Cabloy, Node.js, pnpm, database, and browser/runtime versions.
- Remove credentials, tokens, personal data, and sensitive system information from issues, logs, screenshots, and pull requests.

## Set up a development checkout

You need Git, Node.js `>=24.4.0`, pnpm `>=11.5.2`, Redis `>=7.2.6`, and one documented development database baseline: SQLite, MySQL `>=8`, or PostgreSQL `>=16`. SQLite setups using `better-sqlite3` may also require a native build toolchain for `node-gyp`.

```bash
git clone https://github.com/cabloy/cabloy.git
cd cabloy
npm run init
```

`npm run init` is more than a package install: it installs multiple workspaces, prepares generated local configuration, initializes and synchronizes Vona and Zova, and generates required frontend and backend artifacts. Run it intentionally rather than as a retry for an unrelated narrow change.

CI workflows run after pushes to `main`; do not assume that every pull request is automatically validated. The SQLite unit-test and Chromium Basic/Commerce E2E workflows configure Ubuntu, Windows, and macOS with Node.js 24 and pnpm 11.5.2. Matrix configuration alone is not proof that the platform gates or all six Basic/Commerce E2E combinations passed. For maintained edition and onboarding guidance, see [Cabloy Editions](https://cabloy.com/editions/overview#cabloy-basic).

## Develop and validate

Start with the narrowest meaningful check, then broaden validation when a change crosses a shared boundary.

| Purpose                                   | Command                    |
| ----------------------------------------- | -------------------------- |
| Start Vona development                    | `npm run dev`              |
| Start one Vona development process        | `npm run dev:one`          |
| Start Basic Admin SSR development         | `npm run dev:zova:admin`   |
| Start Basic Web SSR development           | `npm run dev:zova:web`     |
| Check formatting                          | `npm run format`           |
| Lint                                      | `npm run lint`             |
| Type-check Vona and Zova                  | `npm run tsc`              |
| Run backend tests                         | `npm run test`             |
| Run the managed local test-mode E2E suite | `npm run test:e2e`         |
| Build required Basic artifacts            | `npm run build`            |
| Build Basic Admin SSR and REST artifacts  | `npm run build:zova:admin` |
| Build Basic Web SSR and REST artifacts    | `npm run build:zova:web`   |
| Synchronize Zova dependencies into Vona   | `npm run deps:vona`        |
| Build the public documentation site       | `npm run docs:build`       |

`npm run test:e2e` starts a fresh runner-managed local Vona worker in test mode and runs Playwright against Vona integrated SSR. Select flat spec basenames directly after the script, for example `npm run test:e2e a-commerce`; place Playwright filters after npm's `--` delimiter, for example `npm run test:e2e a-commerce -- --tag @smoke`. Browser commands consume existing SSR/REST artifacts and do not rebuild them. The managed runner allocates run-owned database and Redis namespaces, runtime/public paths, application identity, API origin, and listener, so ordinary same-checkout development services are not a blocker by themselves. Coordinate shared build/dependency writes and check custom external resources separately; a free port alone is not ownership proof. Externally managed `E2E_BASE_URL` targets are unsupported.

For native Windows managed tests, use the same public npm commands from CMD or PowerShell. PowerShell 7 on `PATH`, local NTFS storage, and reachable Redis are required; E2E additionally needs installed Chromium (`npx playwright install chromium`) and ready SSR/REST artifacts. Windows workers and browsers must prove membership in their designated registered Job, and normal Vona teardown uses authenticated cooperative shutdown before whole-Job drainage is accepted. POSIX browsers retain independent process-group verification. Failed or interrupted runs retain claims and resources for inspection; force-stop or missing PIDs do not establish successful cleanup. See [Native Windows managed tests](https://cabloy.com/reference/repo-scripts#native-windows-managed-tests) for the lifecycle and limits: the browser scope is Cabloy Basic Chromium Basic/Commerce baselines, not all browsers, documentation E2E, or Cabloy Start.

The tracked pre-commit hook runs `lint-staged`. It may format staged Markdown and configuration files, and may lint-fix and format staged source files. Review the resulting staged changes and run the relevant explicit checks before submitting.

## Generated code and Vona–Zova integration

Use Vona backend contracts, DTOs, OpenAPI metadata, and schema metadata as contract truth. Regenerate consumers rather than hand-editing generated frontend artifacts.

For frontend metadata or dependency changes that Vona consumes, build every affected Basic flavor before synchronizing dependencies:

```bash
npm run build:zova:admin
# Also run npm run build:zova:web when Web is affected.
npm run deps:vona
```

Keep SSR and REST outputs aligned; a REST-only build is not sufficient. See the canonical [Contract Loop Playbook](https://cabloy.com/fullstack/contract-loop-playbook), [Vona + Zova Integration](https://cabloy.com/fullstack/vona-zova-integration), and [repository scripts reference](https://cabloy.com/reference/repo-scripts).

## Pull requests

Keep each pull request focused and describe its user-visible and technical effects. Include:

- the related issue when one exists;
- tests added or updated for behavioral changes;
- the exact validation commands run and their results;
- any regenerated contract artifacts and the build/synchronization steps used; and
- documentation updates, or why no documentation update is needed.

Do not include unrelated generated output, build artifacts, environment files, credentials, or cache files.

## Documentation

Canonical public Cabloy documentation is maintained in this repository's `repo-docs/` tree and published at [cabloy.com](https://cabloy.com). Discuss and submit proposed public-documentation changes in an issue or pull request; do not treat copies outside this repository as independent canonical sources.

## License and contribution rights

Cabloy Basic project-owned content is licensed under the root [MIT License](./LICENSE).

Submit only material that you have the right to contribute. Preserve required copyright, license, attribution, and third-party notices for any included code, media, fonts, generated material, or copied snippets.
