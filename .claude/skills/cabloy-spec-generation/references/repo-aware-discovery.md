# Repository-Aware Discovery

Inspect active source before recording edition-specific facts. New design does not need to exist already, but it must not be described as observed source.

## Read-only discovery

From the active root, inspect:

```bash
git rev-parse --show-toplevel
git status --short
find . -maxdepth 1 \( -name '__CABLOY_BASIC__' -o -name '__CABLOY_START__' \) -print
find repo-specs -maxdepth 2 -type f -name 'README.md' -print
npm run vona
npm run zova
```

Read root `package.json` and relevant CLI entrypoints before documenting commands.

- Exactly Basic marker: Basic source and runtime facts.
- Exactly Start marker: inspect Start's own scripts, UI, sites, flavors, and generated paths.
- Both markers: stop as invalid/ambiguous.
- Neither: inspect owning package/structure and ask before edition-sensitive assumptions.

Never transfer Basic identifiers or example-suite boundaries into Start or a new suite by analogy. Do not read or expose `.env*` content to recommend worktree identities or ports.

## Target classification

Use these labels consistently in README, SRS, ADR, WBS, test plan, and execution dossiers:

| Class | Meaning | Required treatment |
| --- | --- | --- |
| **Observed existing** | Inspected source/configuration/manifest currently defines the target. | Cite the actual owner and path; verify applicable behavior and conflicts. |
| **Proposed new** | An intentionally new design, not yet explicitly approved. | State candidate values, framework constraints, checks still needed, and governing `Proposed` ADR. Do not claim source exists or command runs. |
| **Explicitly approved new** | User explicitly approved the concrete design after framework and collision checks, and the governing durable ADR is `Accepted`. | A bounded WBS execution may create it after its own dossier approval. Cite design authority, planned source/manifests, and checks; pre-existing target source is not required. |

User inputs or high-level strategy selection alone do not upgrade a proposed tuple. Separate generation approval, design/ADR approval, and execution approval. If design is approved but ADR acceptance is still pending, record both facts and keep creation gated.

Unknown values remain `TODO(confirm)` with a specific missing design, source inspection, or collision check. Do not label a deliberately new target `TODO(confirm from active source)` merely because its future source does not exist.

## Site-strategy discovery

Use two passes for user-facing audiences:

1. Before strategy selection, inspect observed shared hosts/composition owners/extension points, independent-site conventions, and the active edition's framework constraints.
2. After selection, inspect only affected surfaces and validate a coherent target tuple. Preserve established strategy and ask only about missing/materially changed audiences. The four normal Web/Admin combinations are useful only when both audiences are unresolved; a single audience does not need a redundant four-way choice.

Shared integration requires an observed owning site and cited extension point. For an independent new site, design and check together:

- site ID and public mount path, including collisions among enabled sites and exclusive ownership of the empty/root path;
- flavor, frontend composition/configuration ownership, SSR rendering/admission contract, and tracked flavor configuration destinations;
- site module, `SsrSite` registration design, copied bundle/release identity, generated REST package, and package/import alignment;
- development, SSR-build, REST-build, preview, paired root wrapper, and `deps:vona` handoff;
- durable manifests and whether the site belongs to the edition's default artifact set.

Read framework code and [the independent SSR setup guide](../../../../repo-docs/fullstack/ssr-site-and-flavor-setup.md) for constraints; representative sites are specimens, not the new suite's design authority. Cite the source surfaces used for validation, not a fabricated target source path. Keep local environment identity/ports outside site planning.

A new wrapper must be labeled **planned addition**, with its durable manifest path and paired SSR/REST steps. Do not list it among current runnable commands. During execution, create it under the approved boundary, inspect the resulting manifest, then run it. Existing wrappers must be observed before reuse.

A deferred strategy/tuple gate blocks only affected frontend/site implementation. Backend, unrelated audiences, and runnable discovery tasks retain accurate status. Independent composition never creates a separate tenant, identity, persistence, authorization, or domain-rule authority.

## Suite-first topology

The intended ownership layout is normally:

```text
vona/src/suite/<suite>/modules/<module>/
zova/src/suite/<suite>/modules/<module>/
```

Classify these as observed existing, proposed new, or explicitly approved new; planned directories need not exist before generation. Reuse established owners rather than duplicating hierarchy.

## CLI-first planning and checks

No known Cabloy CLI generates the complete Markdown planning set. Approved records may be authored manually under `repo-specs/`. Implementation scaffolding/metadata/OpenAPI/dependency work uses discovered Vona/Zova command families through bounded execution and specialists.

Verify root scripts before citing them. The shared planning branches are:

```bash
npm run spec:check -- <suite>
npm run spec:check -- <suite> --lightweight
# Only with complete chart inputs:
npm run spec:charts -- <suite>
npm run spec:charts:check -- <suite>
```

For prospective implementation, inspect applicable root `tsc`, `test`, build, E2E, flavor-paired build, and dependency-sync commands. A documented command is a prospective procedure, not a passing run.

- Forward: backend contract truth -> OpenAPI inspection -> generated Zova consumers -> thin follow-up.
- Reverse: affected flavor SSR and REST outputs together -> `npm run deps:vona`.
- Correct generated output but stale installed consumers: local dependency drift, not permission to patch generated files.

Actual synchronization belongs to `cabloy-contract-loop` under execution.

## Safe boundary

Business planning belongs in `repo-specs/`; reusable guidance in `repo-docs/`; supporting cross-suite rationale in `repo-docs-internal/`; procedural behavior in authored governance skills. Do not introduce a parallel authority.

Planning must not automatically run init, database reset/recreation, source scaffolding, acceptance tests, deployment, or provider operations. Static planning checks are not ATP evidence. Any meaningful retained verification needs a separately approved bounded scope and actual revision/environment/procedure/result/redacted artifact.
