# Single product-search tool: bounded business evidence

## Scope and ownership

On 2026-10-21, the user explicitly approved one read-only `commerce_products_search` flow: SDK `tools/list` → `tools/call` → existing guarded public product controller → existing public result DTO. This is an independently bounded partial contribution to WBS-MCP-30-01, WBS-MCP-30-02 and WBS-MCP-40-01, with supporting current-instance/context evidence for WBS-MCP-40-02. It is not completion of those parent tasks or their full ATPs.

- Checkout: Cabloy Basic, branch `worktree-spec-basic-cabloy-mcp`.
- Base revision: `946192595fa86b5168ed070d32d19b5ca2ca0d0b`; initially clean before the two new implementation/test files. Results are **dirty-source proof**, not reproducible from that revision alone.
- Source: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/businessTools.ts`.
- Test: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts`.
- Actual runtime: Vona normal test flavor, better-sqlite3, root managed isolated test runner. Read-only commerce seeds were initialized by managed startup; tests created no persisted records and did not mutate seeds. The existing narrow `a-commerce` test lock was reused.
- Fixed dispatch: `GET /commerce/catalog/product/public`, `performAction` with `innerAccess: false`. The action is explicitly `@Passport.public()`; an anonymous successful call is therefore expected, not proof of MCP OAuth authorization.
- Input and output schemas come from `DtoProductPublicSelectReq` and `DtoProductPublicSelectRes`; no second business DTO or handwritten field contract was added. Unknown root argument keys are rejected. Result parsing normalizes identities/counts and projects declared nested public fields.
- No production route/listener, OAuth integration, profile, lifecycle, ORM, schema, migration, frontend or shared-framework change was authored.

Related existing authority: PRD-MCP-CONTRACT-01/02/03, PRD-MCP-ACCESS-02/03, PRD-MCP-IDENTITY-03, PRD-MCP-SAFETY-01/02; SRS-MCP-CATALOG-01/02/03/04, SRS-MCP-API-01/02, SRS-MCP-AUTH-02/03, SRS-MCP-DISPATCH-01/02/03/04/05 and SRS-MCP-TRANSPORT-03. These results support portions of ATP-MCP-CONTRACT-01/02/03, ATP-MCP-AUTH-02 and ATP-MCP-CALL-01/02/03, not their complete procedures or closure.

## Actual verification

Focused managed command:

```sh
set -o pipefail
NO_COLOR=1 FORCE_COLOR=0 npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts 2>&1 |
  node --input-type=module -e 'import {stripVTControlCharacters} from "node:util"; import {createInterface} from "node:readline"; for await (const line of createInterface({input:process.stdin})) process.stdout.write(stripVTControlCharacters(line)+"\n");' |
  npm run --silent evidence:sanitize
```

Final observed excerpt (run-specific paths, process IDs, timestamps and startup database identities omitted):

```text
businessTools.test.ts
  PASS discovers one DTO-backed tool and queries the real public controller anonymously
  PASS rejects unknown tools, DTO violations and client-controlled execution options
  PASS retains the current instance scope and requires a caller-owned request context
App shutdown gracefully
 tests 3
 pass 3
 fail 0
 cancelled 0
 skipped 0
 todo 0
 duration_ms 3522.010125
pipeline exit 0
```

`pipefail` was enabled; the pipeline exited 0. Separate per-stage numeric statuses were not captured; none is invented here. The excerpt is a manually reviewed projection, not the full startup log or a database-cleanup attestation.

The three cases exercise real linked SDK transports and the real controller/database. They check the sole listed name, DTO-derived pagination limit, read-only annotation, public product/SKU field projection, text/structured output equivalence, empty-title compatibility, unknown names, pagination/title violations, refusal of tenant/route/inner-access/header arguments, empty cross-instance results, and absence of caller context. Each ordinary Vona operation owns a `mockCtx(...)` boundary.

Final static commands, all exit 0:

```sh
node_modules/.bin/oxfmt --check vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/businessTools.ts vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts
node_modules/.bin/oxlint --disable-nested-config vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/businessTools.ts vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts
node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json
```

Final SHA-256 values:

| Source | SHA-256 |
| --- | --- |
| `src/lib/businessTools.ts` | `a0224a4037d324216bb418ab8140f181e68bc0588bf228127f38e2dc8276dffd` |
| `test/businessTools.test.ts` | `ffd97cabc5e180813b4e697fd73fb47cbb61c972235382a8f343e19bfb7a1103` |

Paths in this table are relative to `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/`. The successful runtime test used test hash `ba8c1c9b09dc7d579322394ad0a5c70508232498de23b29c55582c8b3b4f263f`; afterward the formatter only wrapped one `assert.deepEqual` across lines. Final static checks used the formatted hash above. The business source was unchanged across these checks; no final-byte runtime rerun is claimed after that whitespace-only formatting.

## Retained failures and corrections

1. Initial semantic command used `--incremental false` without `--composite false`: exit 1, TS6379, “Composite projects may not disable incremental compilation.” The corrected module command passed; no tsconfig was changed.
2. Initial managed test stream was rejected by the path sanitizer with `evidence-paths: BINARY`, pipeline exit 2. That incomplete stream does not establish a business result. Subsequent runs stripped terminal controls before sanitization.
3. First readable managed run: 3 tests, 1 pass, 2 fail, exit 1. One assertion compared DTO-normalized IDs/`total` strings to raw executor numbers. The test now compares against the real controller result parsed through the same public DTO. No DTO was changed.
4. Next run: 3 tests, 2 pass, 1 fail, exit 1. Diagnostic identified `{ "title": "" }`: the existing optional DTO treats this as an omitted filter. The test now verifies that compatibility and uses a 201-character title for rejection. Final managed run passed 3/3.
5. Final initial format check exited 1 for the added assertion layout; lint/typecheck in that chained command did not run. Scoped formatting was applied, then format, lint and module semantics all passed. Failed managed-run claims/resources were left to the runner; no manual reset, cleanup or process killing occurred.

The managed command's normal `prerun` also ran dependency preparation and automatically introduced `ts-node-maintained` in `vona/package.original.json` plus 113 added lockfile lines in `vona/pnpm-lock.yaml`. These are incidental preparation changes, not business requirements or a new tool dependency. They are left visible for disposition rather than silently discarded; no separate ad hoc reinstall or dependency workaround was run. Independently observed main-checkout changes were not edited.

## Documentary checks

- `npm run spec:check -- cabloy-mcp`: exit 0, complete planning structure passed with 68 definitions; producer/sanitizer statuses both 0. This is static authority/link checking, not acceptance.
- `npm run spec:charts -- cabloy-mcp` and `npm run spec:charts:check -- cabloy-mcp`: both exit 0, English charts, 0/12 verified. Generated chart bytes remained unchanged.
- Initial `evidence:check` invocation omitted its required path separator and exited 2 (`INVALID_USAGE`); corrected `npm run --silent evidence:check -- -- repo-specs/cabloy-mcp/evidence/business-products-search.md` exited 0. This is path-recognition coverage, not secret scanning or acceptance proof. The retained projection was also manually reviewed to omit private runtime identities.
- Scoped documentary formatting and `git diff --check`: exit 0. The formatter reports one matched file; ignored evidence Markdown was manually reviewed, not claimed as formatter-covered. An attempted `--no-ignore` override was unsupported and exited with an option error; no formatter configuration was changed.

## Delivery boundary

The approved in-process one-tool business slice is implemented and its focused tests pass. Ordinary caller-owned context is required for every message. Existing-ready contexts explicitly reject `performAction`; this implementation does not remove that guard or claim attachment to the pinned existing-ready/production transport path.

All parent WBS rows remain blocked, full ATPs remain open, and suite verified count remains 0/12. Real HTTP admission, token-to-subject mapping, host/instance binding, concurrent Passport isolation, production transport composition, operations and release proof remain outside this result. Earlier unattached profile-helper recommendations are not the next action for this business slice. Handoff only: review/use this bounded implementation within ordinary request contexts; no automatic next-phase implementation or production activation is authorized.
