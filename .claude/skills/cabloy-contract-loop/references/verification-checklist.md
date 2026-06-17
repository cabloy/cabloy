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

## Reverse chain verification

- frontend-owned source is correct
- metadata generation completed when applicable
- the relevant flavor build completed successfully
- `deps:vona` completed
- backend consumers can resolve the refreshed frontend-generated handoff
- prefer visible proof under `zova/src/**/.metadata/**` when it is available
- if the real handoff only appears in `.zova-rest`, treat commit-time gate failures as conservative reminders and verify the reverse sync flow manually before using the explicit bypass
- `npm run tsc:zova`
- relevant flavor-specific or route-specific checks

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
- `deps:vona` already ran
- Vona still behaves as if old consumer types are installed

Then suspect a stale or unhealthy local installation state in `vona/node_modules`.

Recovery action:

```bash
cd vona && rm -rf node_modules && pnpm install
```

Use this as a recovery path when normal sync steps did not restore the local file-package installation state cleanly.

## Done rule

A contract-loop task is not done when only the backend compiles or only the frontend builds. It is done when the contract source and the generated consumer path agree.
