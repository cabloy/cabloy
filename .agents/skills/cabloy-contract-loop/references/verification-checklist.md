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
- regeneration commands completed successfully
- generated SDK or schema outputs are updated
- thin model facades and downstream consumers still align with the regenerated contract
- `npm run tsc`
- `npm run build`

### Dual-audience resource verification

When one persisted domain has both Admin Resource and Web self-service consumers, also verify:

- every intended Admin and Web operation appears in emitted OpenAPI and the constrained generated SDK slice
- Admin controller authorization and the intended read-only or CRUD action surface remain independent of menu visibility
- Web requests cannot choose owner or tenant scope; the service applies owner and visibility predicates before count, sorting, and pagination
- Web DTOs omit owner, tenant, and operational-only fields
- Admin custom state remains in `ModelResource`; a dedicated Web model owns only the distinct self-service cache domain
- private Web SSR keeps a hydration-equivalent neutral shell until an explicit admission or post-hydration boundary
- targeted Admin and authenticated Web flow checks cover both audiences when both contracts changed

## Reverse chain verification

- frontend-owned source is correct
- metadata generation completed when applicable
- every affected flavor’s source-confirmed paired SSR/REST build completed successfully
- `deps:vona` completed after the paired builds
- `build:rest:*` was not treated as the only Vona SSR handoff
- backend consumers can resolve the refreshed frontend-generated handoff
- prefer visible proof under `zova/src/**/.metadata/**` when it is available
- this repo does not rely on a contract-loop pre-commit gate; the active safeguard is the Claude hook layer
- if the change was a high-confidence Zova reverse-source edit through the Claude hook path, confirm whether the hook already auto-ran `npm run build:zova:admin` and `npm run deps:vona`
- if the change was consumer-side, low-confidence, outside the Claude hook path, or in another edition branch, run the reverse sync flow manually instead of assuming it already happened
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

Then treat it as local dependency drift and suspect a stale or unhealthy local installation state in `vona/node_modules`.

Recovery action:

```bash
cd vona && rm -rf node_modules && pnpm install
```

Use this as a recovery path when normal sync steps did not restore the local file-package installation state cleanly.

## Done rule

A contract-loop task is not done when only the backend compiles or only the frontend builds. It is done when the contract source and the generated consumer path agree.
