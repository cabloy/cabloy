# Product search → detail: bounded business evidence

## Scope

The separately approved 2026-10-21 increment adds only `commerce_product_detail` alongside `commerce_products_search`, in the existing business source and integration-test files. Cabloy Basic, branch `worktree-spec-basic-cabloy-mcp`, base `946192595fa86b5168ed070d32d19b5ca2ca0d0b`; carried search/evidence/dependency changes were already present. These are dirty-source results, not proof reproducible from the base revision alone. [Earlier search evidence](./business-products-search.md) remains historical and is not rewritten as detail proof.

- Source: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/businessTools.ts`.
- Test: `vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts`.
- Fixed action: `GET /commerce/catalog/product/public/:id`, `performAction` with server-owned `params` and `innerAccess: false`.
- Existing public identity/schema and `DtoProductPublicDetail` remain the contract owners. No new persistence, controller, production route/listener, OAuth, frontend, profile, lifecycle or ORM infrastructure.
- Partial contribution to WBS-MCP-30-01/30-02/40-01, supporting scoped-context evidence for 40-02; all parent statuses/full ATPs remain open and verified remains 0/12.

## Observed failures and corrections

1. First static chain: formatting and lint succeeded, module semantics exited 1 with TS2339 (OpenAPI reference/schema union) and TS2352 (direct `ZodObject` assertion). Local schema-shape narrowing replaced the unsafe validator assertion; no framework change.
2. Second static chain: formatting and lint succeeded, semantics exited 1 with TS2352 at the OpenAPI-to-SDK JSON schema boundary. An explicit local `unknown` conversion addresses the incompatible library index-signature types without changing schema bytes. The corrected full static chain exited 0.
3. First focused managed run: 6 tests, 3 passed, 3 failed, no cancellations/skips/todos, duration `3060.774417` ms, pipeline exit 1. All search regressions passed. Detail assertions exposed (a) an optional `descriptionHtml: undefined` retained by in-memory transport, (b) existing identity coercion accepting boolean input, and (c) missing detail not yet adapted to `Product not found`. The optional-field test was corrected to distinguish in-memory properties from JSON omission. A local `z.custom` primitive-type admission now precedes the unchanged DTO identity validator, preventing Vona query coercion from turning booleans/objects into identities without inventing a numeric-only grammar. The absence branch now accepts `null` as well as `undefined`: existing `a-body` response adaptation uses `body ?? null`, and `performAction` unwraps that success-envelope data. Other failures retain the nondiagnostic `Product detail failed` response. Failed-run resources were retained by the managed runner; no manual cleanup/reset or process killing occurred.

First runtime source/test SHA-256 values, relative to the MCP module:

| File | SHA-256 |
| --- | --- |
| `src/lib/businessTools.ts` | `07f010f59cdc6fe43cbae72cc561e5645aecc1965a76676f20fa25d31b60d499` |
| `test/businessTools.test.ts` | `417f47c5d4e634296909f15dc37d88ce5653388d7de7d78054363c0bf8f35178` |

The managed command reused root isolated testing, normal flavor and better-sqlite3. Existing commerce seeds are read-only; tests created no persisted fixtures. The narrow existing `a-commerce` lock and ordinary `mockCtx(...)` ownership were retained. Runtime startup paths, private database filenames, process identifiers and data rows are omitted from this manually reviewed projection.

## Verification checkpoint

Final corrected-byte format, lint and module semantics all exited 0:

```sh
node_modules/.bin/oxfmt --check vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/businessTools.ts vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts
node_modules/.bin/oxlint --disable-nested-config vona/src/suite/cabloy-mcp/modules/cabloy-mcp/src/lib/businessTools.ts vona/src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts
node scripts/typecheck.ts native vona --noEmit --incremental false --composite false --project src/suite/cabloy-mcp/modules/cabloy-mcp/tsconfig.json
```

| Final file (MCP-module-relative) | SHA-256 |
| --- | --- |
| `src/lib/businessTools.ts` | `a89158c74d092849919914a39f576e7e445d6b40fbf499152ff1b40ed31e5a36` |
| `test/businessTools.test.ts` | `bb035bd61f947514fa11c40c06a2734a5bca8f63ea5435ba2bc96b64a5f3e767` |

The focused managed rerun passed on the final source/test hashes above; no implementation-byte edits followed. Exact command:

```sh
set -o pipefail
NO_COLOR=1 FORCE_COLOR=0 npm run test -- src/suite/cabloy-mcp/modules/cabloy-mcp/test/businessTools.test.ts 2>&1 |
  node --input-type=module -e 'import {stripVTControlCharacters} from "node:util"; import {createInterface} from "node:readline"; for await (const line of createInterface({input:process.stdin})) process.stdout.write(stripVTControlCharacters(line)+"\n");' |
  npm run --silent evidence:sanitize
```

Manually reviewed final projection (runtime paths, process IDs and startup identities omitted):

```text
PASS discovers both DTO-backed tools and queries the real public controller anonymously
PASS reads public detail from a searched product identity with DTO-projected output
PASS rejects missing or malformed detail identities and execution-control arguments
PASS returns the same not-found result for absent and foreign-instance products and requires context
PASS rejects unknown tools, DTO violations and client-controlled execution options
PASS retains the current instance scope and requires a caller-owned request context
App shutdown gracefully
tests 6
pass 6
fail 0
cancelled 0
skipped 0
todo 0
duration_ms 3587.7885
managed_pipeline_exit=0
```

`pipefail` was enabled; separate stage status numbers were not captured and are not invented. This excerpt is not a full startup log or resource-cleanup attestation. The tests exercise real linked SDK transports, guarded controller/database execution, public root/SKU projection, JSON-text equivalence, strict execution-control rejection, scoped absence and missing caller context. The absent identity is first checked through the current scoped model; no cross-instance existence probe or seed mutation occurs. Optional HTML is advertised and absent on this read-only seed; no HTML fixture matrix is claimed.

The unchanged-authority audit (`npm run spec:check -- cabloy-mcp`, through the path sanitizer with `pipefail`) initially exited 0 with 68 definitions before this new record was linked; final documentary checks are recorded separately below.

Carried dependency preparation differences remain unchanged after both managed runs: `vona/package.original.json` adds `ts-node-maintained`, and `vona/pnpm-lock.yaml` has 113 added lines. They originated in the preceding search run, not this detail tool. SHA-256 values remain respectively `5de7a9e9b9e07310402561165541d856f63457af7bd090944203994174ed72dc` and `b14292a9ce0ebb99f92139c4cdab4061725dab6e728762eb868012194caf255c`. No ad hoc install or dependency cleanup occurred.

## Final documentary checks

- First documentary chain stopped at progress-table formatting (exit 1); its subsequent authority/chart/path checks did not run. Scoped `oxfmt --write` corrected table alignment only.
- Corrected documentary format check exited 0 and reported one matched file (`progress.md`). Ignored evidence Markdown was manually reviewed; formatter coverage is not claimed for it.
- `npm run spec:check -- cabloy-mcp`: exit 0, 68 definitions; static structure/local-link checking, not human acceptance or runtime proof.
- `npm run spec:charts -- cabloy-mcp` and `npm run spec:charts:check -- cabloy-mcp`: exit 0, English charts, 0/12 verified. Generated chart bytes remained unchanged.
- `npm run --silent evidence:check -- -- repo-specs/cabloy-mcp/evidence/business-product-detail.md repo-specs/cabloy-mcp/evidence/README.md repo-specs/cabloy-mcp/progress.md`: exit 0. Recognized path coverage only; the retained projection was also manually reviewed for private runtime identities.
- `git diff --check`: exit 0. No commit or push.

## Limits

This is in-process SDK composition with caller-owned ordinary Vona contexts, not a production MCP endpoint. The existing business action is `@Passport.public()`; anonymous success is not OAuth proof. Existing-ready `performAction` restrictions remain intact. Production ingress, OAuth/subject mapping, host binding, concurrent Passport isolation, operations, full ATPs and release are outside this increment. Path sanitization is neither secret scanning nor acceptance proof.
