# Composite TS2878 diagnosis

Read-only investigation after the B5 failure. No compiler, dependency, test or source-modification commands were used for this diagnosis.

## Supported cause

The first `1/14 project` stage runs `tsc -b` from `vona/`, before suite-specific compilation (`vona/packages-cli/cli-set-api/src/lib/bean/cli.bin.tsc.ts:27-47`). Root module typings import a-executor and a-instance; their source metadata/barrels expose the modified bean/service implementations.

The new cross-project relative value imports point directly into `packages-vona/vona-core/src/lib/core/completedReadiness.ts`. Three are demonstrably reachable from the root build:

- `vona/src/suite-vendor/a-vona/modules/a-executor/src/bean/bean.executor.ts:20-24`
- `vona/src/suite-vendor/a-vona/modules/a-instance/src/bean/bean.instance.ts:10`
- `vona/src/suite-vendor/a-vona/modules/a-instance/src/service/instance.ts:17`

The admission implementation and new module tests contain further cross-project implementation imports that must be considered consistently in any correction. The capture did not name an offending source line; do not claim a unique one was isolated.

`vona/tsconfig.base.esm.json:6-7` enables TypeScript relative-extension rewriting. Core maps `src` to `dist` (`vona/packages-vona/vona-core/tsconfig.json:4-8`), while the root project has different output geometry. Installed TypeScript's TS2878 guard rejects rewriting such referenced-project imports, including when the caller is noEmit. This explains why independent direct semantic checks passed while composite failed.

## Exclusions and limits

- Core completedReadiness tests import local core files only.
- The Start test's URL import appears inside a child-process source string and does not form the implicated compiler-visible cross-project import.
- `vona-core` does not export an implementation subpath that can simply replace the relative import.
- Replacing `.ts` with `.js` without runtime evidence can hide the compiler guard while leaving a nonexistent source-tree runtime target.
- URL-based dynamic loading is observed in isolated tests, not established here as a safe production integration idiom.
- No production-safe smallest replacement has been verified. Do not publish private issuer/provisioning helpers through the public barrel or amend manifest/config/lock files merely to make compilation pass.

## Next bounded action

Design and obtain authorization for an import-boundary-only source correction, preserving private capability/publication ownership and the approved fourteen-path limit if feasible. A wider surface would require its own explicit scope disposition. No further producer was run after this failure. Existing unused runtime amendments remain unused; B5 retains its original one scoped corrective invocation, but source changes would invalidate affected frozen-byte checks and require explicit verification-budget reconciliation.

The implementation is not complete or verified. No return synchronization, commit/push, production integration or parent-status promotion occurred.
