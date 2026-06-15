# Verification Checklist

After a contract-loop change, check both sides.

## Backend verification

- controller action contract is correct
- DTO and validation align
- OpenAPI output reflects the intended shape
- backend tests pass
- `npm run test`
- `npm run tsc`
- `npm run build`

## Frontend verification

- regeneration commands completed successfully
- generated SDK/schema outputs are updated
- API/model/page/component consumers still typecheck
- `npm run tsc:zova`
- `npm run build:zova`
- relevant flavor-specific or route-specific checks

## Edition verification

- Basic or Start marker confirmed
- affected flavor confirmed
- generation path matches the active edition

## Recovery rule for stale local file consumers

If all of these are true:

- generated `.zova-rest` or related generated consumer artifacts already contain the expected new keys or types
- the normal regeneration or sync flow already ran
- Vona still behaves as if old consumer types are installed

Then suspect a stale or unhealthy local installation state in `vona/node_modules`.

Recovery action:

```bash
cd vona && rm -rf node_modules && pnpm install
```

Use this as a recovery path when normal sync steps did not restore the local file-package installation state cleanly.

## Done rule

A contract-loop task is not done when only the backend compiles or only the frontend builds. It is done when the contract source and the generated consumer path agree.
