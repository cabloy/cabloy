# Verification Checklist

After a contract-loop change, verify the branch that actually applies.

## Edition verification

- Basic or Start marker confirmed
- affected flavor confirmed
- generation path matches the active edition

## Forward chain verification

- backend contract source is correct
- controller action contract is correct
- DTO and validation align
- OpenAPI output reflects the intended shape
- module ownership is constrained
- AI-driven SDK generation used the source-confirmed isolated entrypoint by default, regardless of development-service reachability; any direct-source exception has an explicit reason
- the effective project/module source resolves to the intended contract source; explicit source overrides did not silently bypass isolation
- regeneration commands completed successfully; isolated failures remained visible rather than falling back silently to development Swagger
- isolated resources were cleaned after success or retained as failure evidence, and shared SDK/schema/metadata writes were coordinated and inspected without assuming automatic rollback
- generated SDK or schema outputs are updated
- thin model facades and downstream consumers still align with the regenerated contract
- `npm run tsc`
- relevant builds: resolve the affected flavor/site names, wrapper mappings, and paired SSR/REST outputs from the active edition/version manifests; use the ordinary `build:zova*` wrapper when convenient or the universal paired command `npm run build:zova:isolated -- <affected-flavor> [<affected-flavor> ...]`, then run `npm run build:vona` when needed. All application-build entries use the source-confirmed coordinator and should keep source, dependencies, and metadata stable throughout compilation. Prepare inputs explicitly with `npm run deps:zova` when needed

### Dual-audience resource verification

When one persisted domain has both Admin Resource and Web self-service consumers, also verify:

- every intended Admin and Web operation appears in emitted OpenAPI and the constrained generated SDK slice
- Admin controller authorization and the intended read-only or CRUD action surface remain independent of menu visibility
- Web requests cannot choose owner or tenant scope; the service applies owner and visibility predicates before count, sorting, and pagination
- Web DTOs omit owner, tenant, and operational-only fields
- Admin custom state remains in `ModelResource`; a dedicated Web model owns only the distinct self-service cache domain
- Web SSR verification follows the chosen rendering contract: authorized `session` SSR may include safe private first-paint data with query-state transfer and equivalent hydration; only intentionally omitted state requires a neutral shell until its explicit client boundary
- protected session documents without usable authentication redirect through admission; session responses remain private/no-store, and neither HTML nor transferred query state exposes secrets or another user's data
- targeted Admin and authenticated Web flow checks cover both audiences when both contracts changed

## Reverse chain verification

- frontend-owned source is correct
- metadata generation completed when applicable
- every affected flavor’s source-confirmed paired SSR/REST build completed successfully
- `deps:vona` completed after the paired builds
- `build:rest:*` was not treated as the only Vona SSR handoff
- backend consumers can resolve the refreshed frontend-generated handoff
- prefer visible proof under `zova/src/**/.metadata/**` when it is available
- this repo does not rely on a contract-loop pre-commit gate; Claude Code, Codex, and Cursor each use a provider-specific adapter over the same classifier
- if the change was a high-confidence Zova reverse-source edit through a supported hook path, confirm whether the current edition-specific adapter already ran its source-confirmed paired build and `npm run deps:vona`; explicitly build every other affected flavor before the final dependency sync. Do not treat hook convenience behavior as proof that all affected outputs were built
- Codex evaluates an `apply_patch` batch as operation-aware entries: an explicit Delete is classified from reliable path evidence only; an unreadable Add or Update target is an inspection failure rather than a synthetic delete
- Cursor Agent writes use native `postToolUse` context and Cursor Tab writes use native `afterTabFileEdit` side effects; the imported Claude bridge is intentionally inactive in Cursor to avoid duplicate work
- if the change was consumer-side, low-confidence, outside a supported hook path, affected an untrusted/discovery-disabled hook, or was in another edition branch, run the reverse sync flow manually instead of assuming it already happened
- if the real handoff only appears in `.zova-rest`, treat the safeguard as conservative reminder/auto-sync assistance rather than strict proof
- `npm run tsc:zova`
- relevant flavor-specific or route-specific checks

### Independent SSR site/flavor verification

When Vona consumes a new independent SSR site, also verify:

- the active edition and exact flavor are confirmed from source
- `SITE_ID`, Vona `siteId`, Zova `APP_PUBLIC_PATH`, and Vona `publicPath` align; enabled site IDs and public paths remain unique
- Vona `bundlePath` exactly matches the copied SSR release directory
- the generated `zova-rest-*` package matches the Vona type import
- the source-confirmed root wrapper generated both the SSR bundle and REST/type output
- `npm run deps:vona` ran after that paired build, and Vona resolves the refreshed local package
- the site diagnostics command names that same wrapper rather than a default Admin/Web command
- raw Vona-served HTML proves server rendering at the intended mounted path
- client assets load, hydration completes without mismatch, and aliases do not duplicate the mount path
- public/private admission, redirect, and cache expectations match the selected SSR profile
- targeted browser or E2E evidence covers the site through Vona, not only a standalone frontend server

## Consumer drift verification

- source truth already looks correct
- generated output already looks correct
- the next consumer layer is the place that still looks stale
- do not patch source or generated artifacts again until the stale consumer path is identified

## Recovery rule for stale local file consumers

If all of these are true:

- generated `.zova-rest` or related generated consumer artifacts already contain the expected new keys or types
- the normal regeneration or sync flow already ran
- when relevant, the affected Zova flavor build already ran
- `npm run deps:vona` already ran
- Vona still sees stale types

Then treat it as local dependency drift only after restarting an affected running Vona/TypeScript process, if one is present. If the generated output was not already known to be correct, make a quick confirmation of the relevant `.zova-rest` output; do not repeat existing evidence. If that output is wrong, return to the build chain instead of reinstalling.

Recovery action:

```bash
cd vona && rm -rf node_modules && pnpm install
```

Use this only as an exceptional recovery path after the generated artifacts and normal sync steps are proven correct; it is not a routine prerequisite. Restart an affected running process when needed, and never hand-edit generated manifests, links, lockfiles, or `.zova-rest` packages.

## Done rule

A contract-loop task is not done when only the backend compiles or only the frontend builds. It is done when the contract source and the generated consumer path agree.
