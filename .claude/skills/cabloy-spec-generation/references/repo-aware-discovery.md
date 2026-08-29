# Repository-Aware Discovery

Use this reference before putting repository-specific paths or commands into a suite planning record.

## Read-only discovery

Run from the active repository root when needed:

```bash
git rev-parse --show-toplevel
git status --short
find . -maxdepth 1 \( -name '__CABLOY_BASIC__' -o -name '__CABLOY_START__' \) -print
find repo-specs -maxdepth 2 -type f -name 'README.md' -print
npm run vona
npm run zova
```

Inspect the root `package.json` before documenting exact future commands. Read the active edition marker first:

- only `__CABLOY_BASIC__` present means Cabloy Basic;
- only `__CABLOY_START__` present means Cabloy Start;
- both markers mean the checkout is invalid or ambiguous and must not receive edition-specific assumptions;
- neither marker means the edition is unresolved and must not receive edition-specific assumptions.

For a Start repository, resolve flavor names, sites, public paths, generated-output locations, and command wrappers from that repository. Do not inherit Basic examples by analogy.

## Site-strategy discovery

Use two passes when the proposed suite has a Web, Admin, or another user-facing site audience.

1. **Before strategy selection**, inspect the active edition only far enough to identify observed shared Web/Admin hosts, their composition owners and extension points, and any independent-site conventions. Read current `SsrSite` registrations, Zova site/flavor configuration, root scripts, and representative shared-site or site-owner modules as needed. Do not turn an example suite’s layout into the new suite’s target.
2. **After the high-level strategy is selected**, inspect only the affected source/configuration surfaces to establish exact facts: `SsrSite` registrations, shared-shell contribution patterns, site IDs, public paths, bundle/flavor names, environment/configuration files, asset-copy targets, paired development/SSR-build/REST-build commands, and dependency-sync procedures.

Cite every observed site/runtime fact by source path in the planning record. Describe a selected strategy as a confirmed input, proposed target, or accepted ADR boundary—not as a source-confirmed fact. Keep each unobserved identifier as `TODO(confirm from active source)`; never derive it from a suite/module name or symmetry between Web and Admin.

When selecting Web/Admin strategy, evaluate each audience separately. A normal choice may combine shared or independent composition for each audience, but a custom combination, an audience with no site, or deferral remains valid. If strategy or required identifiers are deferred, make only affected frontend/site implementation work `blocked`; a source-discovery task can remain `not-started`, and backend, known shared-site, or unrelated-audience work remains accurately statused.

Basic identifiers and commands are not portable Start facts, and neither Basic nor Start example-suite details are portable to another suite without active-source inspection.

## Suite-first source topology

For a confirmed suite short name `<suite>`, the intended source layout is normally:

```text
vona/src/suite/<suite>/modules/<module>/
zova/src/suite/<suite>/modules/<module>/
```

This is a planning target, not proof that the directories already exist. State whether a path is observed or proposed.

## CLI-first planning

No known Cabloy CLI currently generates the complete repository Markdown planning set. Once the baseline is confirmed, create the planning records manually under `repo-specs/`. Use Vona/Zova CLI discovery to plan eventual code scaffolding, metadata, OpenAPI generation, dependency synchronization, or verification; do not invent a command family.

Potential Cabloy Basic root commands observed in the active repository include:

```bash
npm run vona
npm run zova
npm run tsc
npm run test
npm run build
npm run test:e2e
npm run build:zova:admin
npm run build:zova:web
npm run deps:vona
```

These are prospective commands only until actually executed for the relevant change. A test plan must label them as planned procedures. A command in a document is not evidence of a passing run.

For a fullstack contract change, record the appropriate checkpoint:

- forward chain: backend contract truth, OpenAPI inspection, generated Zova consumers, then thin model/page follow-up;
- reverse chain: matching Zova flavor SSR plus REST build, then `npm run deps:vona`;
- if generated artifacts are correct but installed consumers remain stale, diagnose local dependency drift before editing generated files.

Hand actual implementation-time synchronization to `cabloy-contract-loop`.

## Documentation boundaries

| Content | Home |
| --- | --- |
| Product requirements, SRS contracts, WBS, ATPs, suite ADRs, delivery status | `repo-specs/<suite>/` |
| Reusable user-facing or agent-facing framework guidance | `repo-docs/` |
| Cross-suite maintainer architecture, rationale, and engineering ADRs | An established internal-documentation home, when present; do not create one implicitly |
| Short durable AI operating rules | `CLAUDE.md` |
| Reusable Claude procedure | `.claude/skills/` |

Do not place suite product specifications in public docs, or copy repository-wide process rationale into every suite. Link to authoritative framework records instead.

## Safe execution boundary

While authoring planning records, do not automatically:

- run `npm run init`;
- reset or recreate a database;
- scaffold source code;
- run deployment or external-provider operations;
- claim test, browser, CI, build, migration, or generated-artifact results.

If the user explicitly asks for a verification command to be run and the result is intended as retained evidence, execute only after confirming the scope and then record the actual revision, environment, exact procedure, result, and redacted artifact location. Otherwise keep the command as a future WBS/test-plan procedure.
