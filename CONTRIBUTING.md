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

Current CI workflows run on Ubuntu with Node.js 24 after pushes to `main`; do not assume that every pull request is automatically validated. For maintained onboarding guidance, see [Cabloy Basic](https://cabloy.com/editions/cabloy-basic).

## Develop and validate

Start with the narrowest meaningful check, then broaden validation when a change crosses a shared boundary.

| Purpose                                  | Command                    |
| ---------------------------------------- | -------------------------- |
| Start Vona development                   | `npm run dev`              |
| Start one Vona development process       | `npm run dev:one`          |
| Start Basic Admin SSR development        | `npm run dev:zova:admin`   |
| Start Basic Web SSR development          | `npm run dev:zova:web`     |
| Check formatting                         | `npm run format`           |
| Lint                                     | `npm run lint`             |
| Type-check Vona and Zova                 | `npm run tsc`              |
| Run backend tests                        | `npm run test`             |
| Run the full E2E suite                   | `npm run test:e2e`         |
| Rerun E2E tests without reset            | `npm run test:e2e:fast`    |
| Build required Basic artifacts           | `npm run build`            |
| Build Basic Admin SSR and REST artifacts | `npm run build:zova:admin` |
| Build Basic Web SSR and REST artifacts   | `npm run build:zova:web`   |
| Synchronize Zova dependencies into Vona  | `npm run deps:vona`        |
| Build the public documentation site      | `npm run docs:build`       |

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
