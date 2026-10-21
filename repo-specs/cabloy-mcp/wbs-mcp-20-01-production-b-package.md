# WBS-MCP-20-01: production B-admission contract and conditional implementation package

## 1. Disposition and authority

**Prepared 2026-10-21; Proposed, not accepted or execution-ready.** The user approved finite preparation of P1 registry/datasource authority, P2 effective configuration class and P3 owned-handle/lifecycle custody after the next-task recommendation. This approval permits the present MCP-worktree documentary package and its documentary verification only. It does not accept the contracts below, authorize production source changes, select a live target or authorize writes to Basic main. Automated agent notifications are not decisions.

Basic main is the sole framework source of truth. The inspected clean baselines are:

| Checkout alias       | Branch                           | Revision                                   | Permitted operation in this preparation                                                                             |
| -------------------- | -------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Current MCP checkout | `worktree-spec-basic-cabloy-mcp` | `7cc95dab17a45e6e9a53eb1b78bed1d2b111529f` | This package, dossier section 22, selected progress Next action, derived charts and sanitized documentary artifacts |
| `<MAIN_CHECKOUT>`    | `main`                           | `94adf9942349a498adc94232847fe25f4d1f3a82` | Read-only source inspection; no write, test, generation or installation                                             |

Both checkouts have exactly `__CABLOY_BASIC__`. Paths below are repository-relative to their stated owner, not machine-local paths. Source references refer to the inspected main revision unless identified as MCP-owned. Original-byte hashes are retained in the [documentary bundle](./evidence/phase-20/artifacts/production-b-package-7cc95dab17-20261021/).

This is a finite successor to [dossier section 21](./wbs-mcp-20-01-execution-dossier.md#21-b-admission-integration-handoff-and-bounded-composition-candidate-2026-10-20), not a new product authority. Traceability remains `WBS-MCP-20-01`, PRD-MCP-ACCESS-01, PRD-MCP-IDENTITY-02, PRD-MCP-SAFETY-02/03, SRS-MCP-INSTANCE-01/02, SRS-MCP-DISPATCH-04, SRS-MCP-PRIVACY-01 and SRS-MCP-NFR-03 under the [PRD](./prd.md), [SRS](./srs.md), [WBS](./pdp-wbs.md) and [test plan](./test-plan.md). ATP-MCP-TRANSPORT-01, ATP-MCP-INSTANCE-01, ATP-MCP-CALL-03 and ATP-MCP-OPS-01 are not closed by this package. Proposed ADR 0004/0007 and other production gates remain independently controlled.

**Finite exit:** one concrete supported-target recommendation, actual configuration incompatibility, lifecycle/writer coverage, conditional API/path/test/command inventory and one batched disposition. No further generic feasibility round is required to establish these facts. The remaining attachments in section 8 are specific missing inputs, not permission to weaken B or implement around them.

## 2. Preserved foundation and current missing authority

Keep existing B semantics: fresh uncached native row reads; exact persisted config text/NULL identity; app/owner-bound opaque capabilities; capture of the complete detached effective configuration; publication only after matching awaited startup; configuration pinning before consumers; and final recheck immediately after asynchronous identity work. A checkpoint is not atomic fleet revocation or complete ABA detection. Cancellation, HTTP completion and an observation timeout do not prove actual work, transaction, cleanup or disposal settlement.

| Observed source                                                                                        | Fact and production consequence                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `vona/packages-vona/vona-core/src/lib/core/completedReadiness.ts:146–250`                              | Snapshot restrictions exist, but the only provision writer is `provisionCompletedInstanceForTest`. Without a provision, capture creates no publication. Production provision custody is missing.       |
| `vona/packages-vona/vona-core/src/lib/core/index.ts:3–13`                                              | Private publication/issuance/provision helpers are not an approved production integration surface. Fixture canonical-URL imports are not a production access design.                                   |
| `vona/src/suite-vendor/a-vona/modules/a-instance/src/lib/existingReadyAdmission.ts:17–40`              | Only the collaborator-taking test constructor exists. Production must compose trusted concrete collaborators, not adopt arbitrary reader/clock/route/handle callbacks.                                 |
| `vona/src/suite-vendor/a-vona/modules/a-instance/src/service/instance.ts:102–133,150–207`              | Serialized preparation captures the exact row/config/attempt and publishes after startup. Provision must precede that matching preparation, not follow startup. Preserve the submitting async context. |
| `vona/src/suite-vendor/a-vona/modules/a-startup/src/service/startup.ts:203–237`                        | The legacy ready flag precedes after-startups. It cannot synthesize a completed publication.                                                                                                           |
| `vona/src/suite-vendor/a-vona/modules/a-orm/src/service/database.ts:43–109`                            | Ordinary selection allows ambient/default/isolate/remapped routing and acquisition; it cannot authenticate an already-owned static route.                                                              |
| `vona/packages-vona/vona-core/src/lib/bean/beanContainer.ts:116–132`                                   | Selector lookup can create a missing client. Retain authority from actual lifecycle creation rather than mistaking a lookup for an existing-only check.                                                |
| `vona/src/suite-vendor/a-vona/modules/a-orm/src/service/databaseClient_.ts:40–98,117–129`              | Reload/config changes lack B invalidation. Close catches destroy errors and clears `_knex`; this is not truthful retirement proof for a B-owned target.                                                |
| `vona/packages-vona/vona-core/src/lib/core/meta.ts:127–167`                                            | Readiness closes synchronously, but no B owner joins reader/preparation/admitted work before container disposal. Context count alone is insufficient.                                                  |
| `vona/src/suite-vendor/a-vona/modules/a-ormdialect/src/lib/protectedSqliteRegistry.ts:166–181,190–286` | The reader owns native preparation/read/close and retains failed-close custody. It authenticates no ORM datasource.                                                                                    |
| `vona/src/suite-vendor/a-vona/modules/a-executor/src/bean/bean.executor.ts:100–193`                    | Existing ready-existing entry validates/pins, binds the provisioned handle and awaits successful commit tails. It does not authenticate provisioning inputs. No executor expansion is justified here.  |

The historical two composition paths now exist. Their later [maintenance record](./evidence/phase-20/test-suite-consolidation.md) records successful bounded regressions, not production ownership. Do not create those files again or automatically reopen the historical SQL-quote/format stop. Neither those regressions nor this preparation closes the old execution package, parent WBS or ATPs.

## 3. P1 — proposed explicit shared/static registry target

Recommend **one opt-in, app/worker-owned shared SQLite registry generation and one explicit static ORM client**:

- An explicitly selected configured client key, never the selector alias `default`, a function, ambient ALS or request input. The static string `database.defaultClient` must match that selected key; no remapping, isolate selection, read/write sharding or replica substitution.
- `better-sqlite3` with the original supported dialect implementation, an ordinary existing file, existing WAL and the existing protected readonly/file-must-exist profile. No connection function/string/URI, external pool/handle adoption, attach/view/prefix/custom-column mapping or request-time opening/repair/WAL conversion.
- `isolate:false`; static instance configuration cannot enable isolate routing. Isolate targets are outside this first proposed profile, not inferred from ordinary routing.
- ORM lifecycle retains the actual `ServiceDatabaseClient` and `ServiceDb`, app identity and configuration/client generation at initialization. A private opaque lease authenticates those objects. Caller object shape, `instanceof`, client-name agreement or filename agreement alone is not authority.
- The reader's filename is privately derived from that approved lifecycle binding. No physical filename, resolved connection payload or live instance map belongs in retained evidence. This package selects no actual client key, registry or deployment.
- Invalidate before any supported replacement/config mutation. Out-of-band file/config/registry mutation cannot be made safe merely by calling it unsupported: the selected deployment must enforce the excluded paths or bring them under this owner. No clone/restore/rollback/inode/complete ABA guarantee is supplied.

The actual authored table is literal `aInstance`: `id`, `createdAt`, `updatedAt`, `deleted`, `disabled`, `isolate`, `name`, `title`, `config`; **no `iid`**. See `a-instance/src/entity/instance.ts:12–27`, `a-instance/src/bean/meta.version.ts:9–18` and `a-orm/src/extend/tableBuilder.ts:17–35,46–50` under the module prefix in section 2. There is no authored unique-name constraint. Keep duplicate/malformed-row refusal; do not migrate the schema to simplify admission.

The existing reader fixes binary-exact `name`, `deleted = 0`, `LIMIT 2` and `id/name/disabled/isolate/config` projection. Preserve its 256 UTF-8-byte name, 65,536-byte config, 100 ms private busy timeout and monotonic checkpoints. These are not hard native cancellation/query-duration guarantees. Cached `ModelInstance` or registering `BeanInstance.get()` cannot substitute for that read.

A secret-free descriptor may identify `version:1`, profile `better-sqlite3-existing-wal-v1`, topology `shared`, literal table `aInstance`, configuration `complete-detached-own-data-v1` and replacement `invalidate-drain-close-before-rebind`. These labels describe a proposed supported class; a public structural descriptor cannot mint the private lease or authorize its target.

## 4. P2 — actual configuration incompatibility and proposed disposition

The existing preparation merges the **complete** configuration:

```ts
deepExtend({}, app.config, staticInstanceConfig, persistedConfig, {
  instance: undefined,
});
```

`completedReadiness.ts:146–205` detaches finite scalars, ordinary/null-prototype records and ordinary arrays from their own data descriptors. It rejects accessors, cycles, exotic prototypes, symbol keys/values, bigint, non-finite numbers and unsupported functions, with depth 64/100,000 visited-node bounds. Repeated aliases are copied independently; alias identity is not preserved. A supported target cannot depend on that identity.

An accepted function leaf must be explicitly listed by exact identity, already frozen, and have only non-writable own data properties without object/function-valued own properties. A conventional function's object-valued `prototype` can therefore fail even after freezing. The checker does not prove closure immutability or that the preceding configuration loader/merge never evaluated getters.

**Concrete blocker:** tracked `vona/src/backend/config/config/config.ts:82–111,139–155` supplies unfrozen `logger.rotate`, `logger.base`, `logger.clients.default` and `database.base.log.warn`. `logger.rotate` closes over `env` derived from `app.meta.env`. `config.prod.ts:3–35` does not remove those callbacks. These are demonstrated incompatible authored leaves, not an exhaustive inventory of all module contributions or a read of an effective deployment configuration. No `.env` content was inspected.

**Recommendation:** retain the existing full-config contract and refuse the current authored-default class. Before positive production provisioning, the application owner must supply one tracked, explicitly reviewed immutable profile: fresh authored frozen callbacks, immutable copied closure inputs, exact identities and behavior review, and actual full-merge compatibility. Preserve callback behavior and public config signatures; do not freeze shared application callbacks in place. Review `this`-based application access too; descriptor immutability alone is not a behavioral safety proof. Additional module functions/values remain refusal conditions until reviewed.

No automatic traversal-to-allowlist, partial config projection, omitted logger/database namespace, JSON round-trip, synthetic scalar substitute or global freeze closes P2. No production allowlist or profile is accepted here. An exact config implementation/path/attachment and its finite whole-config proof are missing; no claim that the main package is executable can precede them.

## 5. P3 — proposed ownership API and lifecycle contract

### Narrow API inventory

Use private pure helpers in `src/lib` (A/B1), not a new bean/service/selector or generated metadata. The following names unify the source investigations into **one proposed inventory**, not existing exports:

```ts
// ORM internal: provenance retained at real client initialization.
// A request or structural caller object cannot create this authority.
interface ExistingReadyRouteLease {
  // Opaque identity; app/client/config generation and ServiceDb stay private.
}

// Instance-owned, lifecycle-only; consumes approved internal target/profile.
// No arbitrary filename, handle, read/clock/issuer callback parameters.
prepareExistingReadyTarget(approvedTarget): Promise<ExistingReadyTargetPreparation>;

// Consumer facade; no provision mutation or public issuance.
interface ExistingReadyAdmission {
  admit(name: string, deadlineAt?: number): Promise<ExistingReadyResult>;
  recheck(
    capability: ExistingReadyCapability,
    deadlineAt?: number,
  ): Promise<ExistingReadyResult>;
}
```

The intentionally opaque lease illustration is not a structurally trusted TypeScript implementation. Internal authority must be validated by private owner records/generation identity. The preparation result must distinguish ready/unsupported/unavailable and retain cleanup custody even on failed preparation. Factor the existing admission algorithm privately; do not call `createExistingReadyAdmissionForTest` in production.

The **cross-package integration route is not frozen**. Prefer one narrow supported core integration facade that preserves raw provision/issuance privacy, with explicitly named module export/import attachments. Do not bypass it through fixture canonical-URL imports or expose a general callback/handle provision setter. Section 6 names the known export owner; any further package/barrel file must be explicitly added before execution.

### Initial preparation

1. Outside protected requests, validate approved P1 mapping and P2 class.
2. Authenticate the already-created static client/`ServiceDb` against the ORM-retained app/generation lease. Reject absent, closing, replaced or foreign ownership **without acquiring it**.
3. Construct/prepare the concrete protected reader; retain custody even if preparation fails.
4. Install the production provision **before** the matching `beginCompletedInstance`/queued capture.
5. Capture the exact row/config/attempt in existing serialized preparation; await startup including after-hooks; publish only the current attempt. Admission also waits for completed app readiness.

### Writer coverage and retirement

| Entry/owner                                                                                   | Required ordering                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `a-instance/src/bean/bean.instance.ts` update and instance service reload/reset               | Synchronously invalidate at entry, **before** the first write/await. A cache-only reset cannot republish. Keep matching preparation identity; never qualify old startup with a late provision.       |
| `a-orm/src/service/database.ts` reload/remove dispatch                                        | Invalidate affected leases before dispatch/broadcast; cover direct/replayed client paths too.                                                                                                        |
| `a-orm/src/service/databaseClient_.ts` direct reload, config connection mutation and disposal | Invalidate before `$mutate`, assignment or destruction; `changeConfigConnectionAndReloadWorker()` cannot mutate first and rely on its later reload.                                                  |
| `AppMeta.close()`                                                                             | Preserve synchronous readiness close, synchronously close B admission at entry, then explicitly join B after close hooks and before app-bean disposal. Unordered container teardown is insufficient. |
| File/other-process/raw-model/config writers                                                   | Either enforce exclusion for the selected target or add their actual owning paths to this package before support; no coverage claim from a label.                                                    |

For a retiring provision: **invalidate/stop admission → join actual admitted work and separately owned preparation/read activity → reader close explicitly reports `closed` → ORM destroy/replace → new generation/provision and new matching startup**. No automatic post-reload reauthorization. Ordinary unprovisioned routes retain existing behavior.

`drain().outcome === 'faulted'`, quarantine, failed scope disposal, unresolved work, `close_failed` or uncertain ORM destruction is not successful retirement. Retain ownership/references and admission unavailability; do not replace/delete/release, fabricate disposal, automatically retry, signal or manually clean up. A swallowed destroy exception cannot become B close proof. `asyncLocalStorage.ts:68–85` does not decrement the context counter on failed disposal; preserve that truth.

The existing MCP request owner joins admitted provider/work/cleanup/executor/disposal lifetime, not all ingress. Its adapter integration belongs to a later MCP-owned package; Basic main must not import the MCP suite. This candidate requires a concrete narrow main-owned active-use/join attachment before it is executable. Do not introduce public arbitrary callback registration, a second parallel reservation owner or a global app-close wait redesign. A local drain/checkpoint does not claim fleet fencing.

## 6. Conditional main-owned path package

All future framework writes below belong **only in Basic main after separate exact execution approval**, followed by separately authorized return synchronization. They are not writes permitted by this preparation. New path collisions must be rechecked at implementation start.

| #   | Main-relative path                                                                    | Kind / intended responsibility                                                                                                  |
| --- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `vona/packages-vona/vona-core/src/lib/core/completedReadiness.ts`                     | Existing: private production provision, generation invalidation and owned active-use custody; retain snapshot/capability checks |
| 2   | `vona/packages-vona/vona-core/src/lib/core/meta.ts`                                   | Existing: synchronous admission closure and explicit pre-disposal join                                                          |
| 3   | `vona/packages-vona/vona-core/src/lib/core/index.ts`                                  | Existing: proposed narrow supported integration surface, not raw issuance/provision exports; exact surface still gated          |
| 4   | `vona/src/suite-vendor/a-vona/modules/a-instance/src/lib/existingReadyAdmission.ts`   | Existing: private common admission algorithm with concrete production composition                                               |
| 5   | `vona/src/suite-vendor/a-vona/modules/a-instance/src/lib/existingReadyLifecycle.ts`   | Proposed new: pure target/preparation/retirement coordinator                                                                    |
| 6   | `vona/src/suite-vendor/a-vona/modules/a-instance/src/service/instance.ts`             | Existing: provision-before-preparation, stale completion and reload/reset integration                                           |
| 7   | `vona/src/suite-vendor/a-vona/modules/a-instance/src/bean/bean.instance.ts`           | Existing: invalidate before update/write, not only later reload                                                                 |
| 8   | `vona/src/suite-vendor/a-vona/modules/a-orm/src/lib/existingReadyRoute.ts`            | Proposed new: private app/client-generation lease retained at actual initialization                                             |
| 9   | `vona/src/suite-vendor/a-vona/modules/a-orm/src/service/database.ts`                  | Existing: explicit static-route attachment and pre-dispatch invalidation                                                        |
| 10  | `vona/src/suite-vendor/a-vona/modules/a-orm/src/service/databaseClient_.ts`           | Existing: direct/replayed mutation/disposal coverage and truthful B-owned close                                                 |
| 11  | `vona/packages-vona/vona-core/src/lib/core/completedReadiness.test.ts`                | Existing: production ownership, full-config compatibility/refusal and stale-generation regression                               |
| 12  | `vona/src/suite-vendor/a-vona/modules/a-instance/test/existingReadyAdmission.test.ts` | Existing: unchanged exact-row/text/capability algorithm regressions                                                             |
| 13  | `vona/src/suite-vendor/a-vona/modules/a-instance/test/existingReadyLifecycle.test.ts` | Proposed new: concrete composition/preparation/writer/close ordering                                                            |
| 14  | `vona/src/suite-vendor/a-vona/modules/a-orm/test/existingReadyRoute.test.ts`          | Proposed new: retained provenance, no acquisition, replacement and fault custody                                                |

**Not a complete executable allowance:** the exact P2 config profile, configuration-loading attachment/tests, public consumer-module export wiring, private core integration signatures and main-owned active-use/join attachment must be supplied together. A possible profile location is `vona/src/backend/config/config/existingReadyProfile.ts`, but neither that path nor an automatic attachment in `config.ts` is selected. Name all additional authored paths and recheck the union before approval; do not quietly expand this inventory.

No current justification exists for executor expansion, legacy-ready changes, reader SQL/profile changes, schema/migration, dependencies/locks/manifests, generated metadata, environment, MCP production source or frontend work. A new necessity requires a named amendment rather than a workaround. No scaffold generator is needed for these pure helpers; actual backend implementation must use the repository's backend workflow and retain CLI-first rules where applicable.

## 7. Prospective verification package — not executed

### Proof groups

Use existing core, instance and ORM infrastructure, not a bespoke source-evaluation harness. Six focused groups are sufficient as a starting contract; exact tests and expected counts are frozen with the missing attachments, not guessed here:

1. **Authority/refusal:** explicit static/shared route; absent/foreign/replaced/mismapped/dynamic/isolate/remapped inputs refuse without lazy acquisition. Actual literal schema and healthy native reads are distinguished from controlled faults.
2. **Complete config:** actual authored-default incompatibility; positively reviewed full-merge profile, callback identities/closures and alias semantics; accessor/cycle/exotic/additional-function refusal. Do not claim a synthetic data-only fixture proves the selected application profile.
3. **Preparation/publication:** provision-before-capture, exact inputs/queue caller scope, full startup, app readiness, stale completion refusal and no retroactive provisioning.
4. **Admission/execution:** fresh exact row/text identity and final recheck, privately held capability, real already-owned route and ordinary-context regression. Preserve ready-existing transaction/commit-tail/disposal guarantees without duplicating its full matrix.
5. **Writer coverage:** every identified update/reload/reset/direct/replayed config/client/disposal entry invalidates synchronously before mutation/first await; excluded bypasses must be enforceably absent for the supported target.
6. **Retirement/custody:** held admitted work/read/preparation prevents disposal; reader closes before ORM; explicit close/fault outcomes retain custody. Controlled fault collaborators are not evidence of a real native close failure. App closure is not total-ingress cancellation or fleet revocation.

Every scoped test owns `app.bean.executor.mockCtx(...)`; competing operations have separate boundaries. Declare stateful suites `{ concurrency: false }`, prove contention with explicit barriers, release/join in `finally`, and delete precisely owned resources in reverse dependency order. Keep shared seed data read-only. Native fixtures must close the reader before removal; uncertain close retains the fixture. Do not set `TEST_CONCURRENCY=false`.

### Command routing checked, commands still prospective

Run from **Basic main root only after execution/resource approval**. The three no-emit commands use the observed wrapper and workspace-relative project argument:

```bash
node scripts/typecheck.ts native vona --noEmit --composite false --incremental false -p packages-vona/vona-core/tsconfig.json
node scripts/typecheck.ts native vona --noEmit --composite false --incremental false -p src/suite-vendor/a-vona/modules/a-instance/tsconfig.json
node scripts/typecheck.ts native vona --noEmit --composite false --incremental false -p src/suite-vendor/a-vona/modules/a-orm/tsconfig.json

node --test vona/packages-vona/vona-core/src/lib/core/completedReadiness.test.ts

SERVER_LISTEN_DISABLE=true node scripts/runIsolatedTest.ts unit src/suite-vendor/a-vona/modules/a-instance/test/existingReadyAdmission.test.ts src/suite-vendor/a-vona/modules/a-instance/test/existingReadyLifecycle.test.ts src/suite-vendor/a-vona/modules/a-orm/test/existingReadyRoute.test.ts
```

The core direct command follows its existing self-contained test surface; stateful module tests use managed isolation. Inspect final dependencies/import syntax before executing newly added tests. Add exact changed-path `oxfmt --check` and `oxlint --disable-nested-config` selections after the final path union is frozen. `npm run tsc:vona:native` is an available broader composite/prerun check, **not** a read-only substitute for the above. Coordinate shared generation/build writes; if new config attachment affects another project, name its verification amendment before running it.

Durable command truth is root `package.json`, `scripts/typecheck.ts`, `scripts/runIsolatedTest.ts`, Vona `package.original.json` and [repository scripts](../../repo-docs/reference/repo-scripts.md). Physical ignored `vona/package.json` differs between these clean checkouts: main has `tsc:native`, the MCP generated manifest does not. This is generated closure drift, not authority to run init, regenerate, synchronize manifests or reinstall dependencies during preparation. Native no-emit wrapper commands do not depend on that script alias.

Managed tests allocate disposable run-specific DB/Redis/runtime/public/listener resources, initialize/seed once and use normal guardian cleanup; dev presence alone is not a blocker. Future approval must identify exact fixture ownership, expected counts, bounded observation/output, failure stop and retained cleanup attestation. No consumed historical B/V/I/QF producer budget transfers to this package. These commands are a checked prospective inventory, **not an approved retry pool** or evidence. Preserve nonzero results and uncertain custody; no reset, signals, manual cleanup, installation or automatic correction follows.

## 8. One batched disposition and finite remaining inputs

The recommended disposition is to retain strict B semantics, select the P1 shared/static supported class for design, and select P3's retained-owner/invalidate-before-write/actual-drain/reader-before-ORM direction **only through an explicit contract decision**. P2 remains refused until a concrete application profile qualifies. Preparation approval accepts none of these automatically.

Before one implementation dossier can be execution-ready, batch the following attachments rather than serializing generic planning rounds:

| Input                     | Concrete missing item                                                                                                                                 | Finite closure                                                                                                                                              |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1 target attachment      | Approved explicit client/config slot and private physical-registry/instance mapping, actual lease provenance and enforceable bypass exclusions        | Secret-free approval identifies lifecycle authority and target class; trusted runtime privately binds actual values, not filename-only or default selection |
| P2 application profile    | Complete effective config with exact fresh immutable callback identities/closure inputs and behavior review, including remaining module contributions | Tracked profile plus exact attachment/path/test amendment; full-merge compatibility without dropping fields; current defaults remain unsupported otherwise  |
| P3 integration attachment | Supported private core/module access, concrete active-use/join authority, all named writer hooks and truthful close results                           | Freeze signatures/import/export paths and full path union, then finite ordering/fault tests; no public arbitrary provisioner/callback owner                 |
| Execution authority       | Main checkout revision/dirty attribution, exact implementation/resources/producers/evidence and return-sync boundary                                  | Separate explicit main implementation approval after applicable contract acceptance; this document is not that approval                                     |

Live OAuth/host/resource/issuer, driver/business diagnostic sinks, full system ingress and operations/release remain separately gated dependent branches; they are not silently added prerequisites to unrelated bounded framework helper work. Conversely, this package does not claim that helper qualification is a production endpoint or ATP closure.

**One next action:** dispose the three prepared contracts together with the exact missing target/profile/internal-access attachments, then approve a finite main-owned implementation dossier if they satisfy the unchanged safety gates. Do not repeat test consolidation, recreate existing composition files or reopen historical formatting retries as a substitute for this disposition.

## 9. Documentary verification and resulting status

Actual outcomes, commands, original-source hashes, changed-document hashes and scope checks are retained in the [documentary bundle](./evidence/phase-20/artifacts/production-b-package-7cc95dab17-20261021/). It records only checks actually run; prospective production commands in section 7 remain unexecuted. Path sanitation is bounded path-recognition coverage, not secret scanning, authenticity, contract acceptance or runtime evidence.

No production source, main checkout, environment, manifest, dependency, database or runtime was changed by this preparation. No commit/push. `WBS-MCP-20-01` and Phase 20 remain **blocked**, all full ATPs **open**, verified **0/12**, first release **deferred**. Authority audit, chart freshness, human contract acceptance, execution approval and runtime/release evidence remain independent gates.

## 10. Later attachment disposition — bounded successor, Proposed (2026-10-21)

The user's subsequent “同意，请执行下一步” authorizes the previously offered finite attachment/design preparation. It does **not** retrospectively accept details not yet presented or authorize main source writes. Sections 1–9 and their documentary bundle remain the historical first package; this section and dossier section 23 supersede only their next-action recommendation.

Current attribution: MCP base `7cc95dab17a45e6e9a53eb1b78bed1d2b111529f` carries the first package/dossier/progress and its evidence; main is clean at `9a919ef141c9851e5df134866242a904cb3aef57`. All 29 original main/MCP source hashes were recomputed and remain equal to each other and the prior inventory. Main's intervening four-file `module-glob` change is external committed work, not a B foundation change or proof of current runtime discovery. No `.env` content or actual deployment database was inspected. The [attachment documentary bundle](./evidence/phase-20/artifacts/production-b-attachments-7cc95dab17-20261021/) records this scope separately; the prior bundle is immutable.

### 10.1 Finite disposition, not another generic preparation loop

The whole production package is **not ready for implementation approval**. The investigation found a concrete behavioral decision, not merely an absent filename: making `logger.rotate` close over copied immutable inputs changes its existing ability to observe later mutations of its captured environment object. Strict unrestricted authored-default equivalence and immutable copied closure inputs cannot both be claimed for that callback. This is not proof that every possible positive configuration class is impossible.

Recommend one bounded scope disposition: preserve full-config B and refuse the current defaults; present the explicit immutable-input policy and a two-file, unattached application callback factory as the next independently verifiable candidate. It has integration value because it replaces the four demonstrated incompatible application leaves with fresh reviewed identities; it is not empty scaffolding, a complete profile, a production provision or endpoint activation. Its exact code/test boundary is frozen below. No further generic feasibility round is recommended. Accepting that candidate still requires a concrete policy decision and separate main execution authority; the user may decide both together, but this preparation supplies neither.

### 10.2 Concrete P1 attachment boundary

The proposed deployment declaration belongs to a tracked application-owned configuration slot, not request input or a public raw-handle factory. It identifies version/profile, an explicit static client key and a finite set of server-owned instance names. It contains no public physical filename, reader callback, clock, issuer, existing `ServiceDb` or pool. Actual values remain private runtime data and are deliberately unselected here. At lifecycle initialization the ORM must retain app/client/config-generation identity and the real client/`ServiceDb`; the instance owner binds only that retained target before matching preparation. An absent target refuses without selector acquisition. Filename comparison is a consistency check, not authority.

A structural declaration expresses deployment intent only. It cannot manufacture the lifecycle lease. A supported production target additionally needs enforceable writer coverage/exclusions; raw SQL, direct config/file mutation and other-process replacement are not made safe by describing them as unsupported. The first target class remains explicit static `better-sqlite3`, shared/non-isolate, literal `aInstance`, existing-WAL/protected reader. No schema change or live target selection is proposed by this disposition.

### 10.3 P2 attachment and explicit behavioral policy

Observed configuration ordering defeats an end-of-`config.prod.ts` attachment: application configuration loaders run concurrently and their results are merged in order (`vona-core/src/lib/framework/start.ts:90–103`); module defaults/overrides and `configLoaded` subsequently contribute configuration (`vona-core/src/lib/module/config.ts:13–31`). Any eventual complete-profile validation must occur after those contributions and before `moduleLoaded` consumers (`vona-core/src/lib/module/loader.ts:20–26`). The root of those three paths is `vona/packages-vona/`. Installing a profile in an earlier loader would neither validate the final merge nor prevent later unsupported contributions.

The bounded authored-function inventory is larger than the four application leaves: `a-error` contributes `errorPageUrl` plus `onerror.accepts`, `logWithApp`, `log`, `json`, `html`, `text`; `a-web` contributes `defaultRoute`. These are additional review/replacement obligations, not proof of an exhaustive deployed-config inventory. Never derive a trusted function allowlist by walking whatever functions happen to be present.

The proposed policy is **explicit construction-time rotation inputs**. A fresh factory copies only the five scalar `LOGGER_ROTATE_*` inputs actually used: `ENABLE`, `FILENAME`, `DATEPATTERN`, `MAXSIZE`, `MAXFILES`. It preserves the return fields `enable`, `filename`, `datePattern`, `maxSize`, `maxFiles`, fallbacks and template behavior for that fixed input class. It does not retain the caller's environment object, stringify arbitrary values or read environment files. A later mutation of that caller record does not alter the factory's outputs. This is an intentional narrowing from the existing callback's late mutable-env reads, not an equivalent implementation for unrestricted defaults. `this`/argument behavior must be specified and tested separately for each callback; freezing descriptors is not proof that application receivers are immutable or that arbitrary downstream logger/driver effects are safe.

No automatic application attachment is included in the next candidate. A future complete profile would require explicit fresh replacements at the owning `a-error`/`a-web` factories, a private identity attachment after the final module merge, and a successful detach of the **actual complete** instance merge including static/persisted values. Unsupported extra callbacks/accessors/exotics still refuse. Those conditional changes are outside the two-path allowance below; do not treat their described integration point as a hidden production path union.

### 10.4 Exact independent main candidate — unattached callback factory

**Proposed, not accepted or execution-authorized.** Select only these two new application-owned files after checking collision absence at execution start:

| Main-relative path                                            | Responsibility                                                                                                                                                                                    |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vona/src/backend/config/config/existingReadyProfile.ts`      | Pure factory for fresh frozen application callback leaves and an immutable exact-identity tuple, using explicitly copied scalar rotation inputs; no app/config mutation or lifecycle registration |
| `vona/src/backend/config/config/existingReadyProfile.test.ts` | Direct focused behavior/identity/refusal tests using explicit inert receivers and scalar fixtures; no Vona singleton, DB, Redis or environment mutation                                           |

Both are intentionally new; the existing `config.ts`, config loaders, module defaults, core/readiness, ORM, executor, manifests and generated output are **not** in this allowance. The observed `vona/tsconfig.json:32–38` already includes `src/backend/config`, so no tsconfig generation/edit is justified. The factory is not exported through an application module barrel, automatically installed or called by production. Existing application callbacks remain byte-identical and ordinary behavior is unchanged by this candidate alone. Backend implementation should use the existing workflow; pure helper/test files do not justify framework scaffolding.

Freeze the following proposed factory signature (names are not existing APIs):

```ts
type RotationInputs = Readonly<
  Pick<
    VonaConfigEnv,
    | 'LOGGER_ROTATE_ENABLE'
    | 'LOGGER_ROTATE_FILENAME'
    | 'LOGGER_ROTATE_DATEPATTERN'
    | 'LOGGER_ROTATE_MAXSIZE'
    | 'LOGGER_ROTATE_MAXFILES'
  >
>;

type LoggerFactory = (
  this: VonaApplication,
  clientInfo: ILoggerOptionsClientInfo,
  winston: typeof Winston,
) => Winston.LoggerOptions;

interface ExistingReadyAuthoredCallbacks {
  readonly rotate: ConfigLogger['rotate'];
  readonly base: LoggerFactory;
  readonly defaultClient: LoggerFactory;
  readonly databaseWarn: (message: string) => void;
  readonly functions: readonly [
    ConfigLogger['rotate'],
    LoggerFactory,
    LoggerFactory,
    (message: string) => void,
  ];
}

export function createExistingReadyAuthoredCallbacks(
  rotation: RotationInputs,
): ExistingReadyAuthoredCallbacks;
```

Use the current type owners rather than widening signatures to arbitrary values. Preserve base `{ stack: true }` formatting, the existing five ordered transports, `clientInfo` identity and suppression of exactly the existing SQLite warning. Tests use explicit inert receiver/Winston-shaped arguments, not framework boot. A narrowly scoped `node:test` console-warning mock must be restored by the test context, with the suite explicitly serial; no origin/proxy/environment configuration may be mutated. No extra fixture/helper framework is included.

The public factory accepts explicit scalar inputs, not an arbitrary function allowlist, app, ORM handle, reader or provision issuer. Its result has the four callback leaves at their original signature shapes and a frozen tuple containing **only those freshly created identities**. This tuple is a review aid for later private integration, not trusted production provisioning authority and not an automatically discovered allowlist. Freeze each function and its own data properties; use nonconstructible functions without an object-valued own `prototype`. Do not freeze supplied receivers or shared application callbacks.

Finite proof obligations:

1. Rotation output and filename template match current behavior for a fixed explicit input set and defaults; caller-record mutation is deliberately ignored after construction and tested as a policy difference, not hidden.
2. Logger base/default callbacks preserve the original receiver and argument contracts, returned Winston structures and metadata behavior using inert explicit collaborators; the rotation receiver differs from the application receivers and must not be conflated.
3. Database warning callback preserves current filtering/forwarding behavior and arguments; no real driver operation or diagnostic qualification is inferred.
4. Two factory calls produce distinct callback identities; returned functions/tuple are frozen, nonconstructible and meet the existing own-data-descriptor restrictions. No traversal admits unreviewed functions.
5. Unsupported input shapes/accessors/non-scalars refuse without invoking getters. No global environment/config writes or Vona startup are used by direct tests.

A pass qualifies only this factory's bounded behavior, not the full merge, completed publication, production ownership, native handle retirement, real logger/driver sinks, a target installation or any full ATP. The parent remains blocked.

### 10.5 Conditional P3 integration is not authorized by the factory candidate

Retain one ownership chain, not public arbitrary provision/clock/read/handle injection. A named export or TypeScript opaque interface is not an access-control boundary: module-private state needs a concrete authority origin and authenticated lifecycle handoff. Cross-package bootstrap must not be accepted merely because a helper is named internal, guarded by absence of request ALS or omitted from a barrel. The existing test constructors/canonical-URL imports remain qualification seams, not that bootstrap.

The required main-owned lifetime attachment must encompass final admission through actual executor work, transaction tails, cleanup and scope disposal. Observation expiry and response completion cannot release it. A separate capacity counter mirroring the MCP reservation would create competing ownership; main must not import MCP or register arbitrary drain callbacks. Likewise a block around only the executor callback does not cover before-callback preparation or failed outer disposal. Reader/preparation remain separately owned activities joined by the same retirement coordinator.

Keep all writer obligations from section 5: instance update before persistence, reset/reload, database pre-dispatch, replay/direct client reload, connection mutation before `$mutate`/assignment, direct disposal and app-close entry. Join actual use, then explicit reader `closed`, then truthful ORM destroy; failures retain admission closure, references and custody. Concrete implementation must cover the required execution-entry/outer-disposal attachment, not silently assume the prior fourteen paths suffice. Until that authority and lifetime attachment is fixed and accepted, sections 5–7 remain conditional inventory rather than a frozen production execution package.

The finite P3 design investigation identifies the following **specific additional scope**, not accepted APIs:

- **Role-capability bootstrap:** core privately issues distinct app-bound ORM/instance lifecycle capabilities in `vona/packages-vona/vona-core/src/lib/module/module.ts`, at actual `ModuleTools.load()` construction (`:19–30`). Receiving attachments belong in `a-orm/src/main.ts` and `a-instance/src/main.ts` under `vona/src/suite-vendor/a-vona/modules/`. One-time role binding and runtime identity validation are mandatory. No exported authority getter or generic provision setter. Root-package imports (`vona`, `vona-module-a-orm`, `vona-module-a-instance`, existing `vona-module-a-ormdialect`) are the supported route; canonical filesystem imports and a new internal-named subpath do not establish privacy.
- **Trust model:** this is capability distribution among trusted loaded framework code, not isolation from malicious same-process JavaScript with app internals/module mutation/absolute imports. If hostile same-process code must be excluded, a process/isolation boundary is required; a WeakMap/barrel cannot supply it. This explicit model needs a user design disposition before positive provisioning.
- **One lifetime owner:** propose adapting the generic lifetime state machine from MCP's existing `productionRequestOwner.ts` into main-owned core `vona/packages-vona/vona-core/src/lib/core/existingReadyRequestOwner.ts`. Core retains its direct lifecycle reference; consumers receive only a bound run facade. A later separately authorized MCP adaptation must replace the old owner, not operate two ledgers. Main never imports the MCP suite. Preserve provider-before-executor activity, work/commit tails/cleanup/disposal, pending runs and quarantined reservations; executor-scope counters alone do not cover these. Current fixture-specific numeric limits do not automatically become production defaults.
- **P1 retained observer:** proposed `selectRetainedExistingReadyRoute(app, selectedClientKey)` returns only `retained` with an opaque lease, or `unsupported`/`unavailable`; never a handle, filename or reader. Actual records are retained inside `ServiceDatabaseClient`'s successful initialization with app/client/ServiceDb/Knex/config-generation identity. The selector reads those records without `getClient`/`getDb`/container acquisition; a separately exported structural retain mutator would defeat this origin. `retained` deliberately does not mean ready/config-qualified/admitted. Even a public lifecycle method is not a defense against hostile code in the same process.

That provenance observer could form a different five-path candidate (`a-orm` database client/service, new lib route helper, explicit root export and focused test). It is **not selected or implementation-authorized here**; the smaller callback factory is the single current recommendation. Positive P3 additionally needs focused bootstrap/lifetime tests and both module receivers, outside section 6's original fourteen-path inventory. Because that expansion and trust model have not been accepted, there is no honest complete production path allowance. This is a finite scope disposition, not a request to repeat generic feasibility.

### 10.6 Exact candidate execution dossier — prospective only

Target: the two-path callback factory subincrement of WBS-MCP-20-01, not production B. Basic main is the eventual source owner; implementation must start in an explicitly authorized main session/check-out, or under an expressly approved synchronization boundary. This MCP preparation cannot write there. Recheck branch/revision/dirty attribution, both proposed-path collisions and current source semantics; a revision change alone needs an impact check, not arbitrary reapproval. Preserve unrelated work. No extra path, manifest, dependency, install/generation, environment or application attachment is allowed implicitly.

Start gates are finite: (a) explicitly accept the generation-fixed rotation-input policy **for this factory candidate only**, retaining current-default refusal and later full-profile gates; (b) approve the exact two-source-path main implementation, procedures, limits and evidence custody below. No live client key/DB/host/OAuth value is needed to test this unattached helper. These two approvals can be given in one decision; no additional generic planning pass is needed. They do not accept the full P1/P3 design or complete production DEC-MCP-04.

Run these four source producers from the main root only after that approval:

```bash
node --test vona/src/backend/config/config/existingReadyProfile.test.ts
node scripts/typecheck.ts native vona --noEmit --composite false --incremental false -p tsconfig.json
./node_modules/.bin/oxfmt --check vona/src/backend/config/config/existingReadyProfile.ts vona/src/backend/config/config/existingReadyProfile.test.ts
./node_modules/.bin/oxlint --disable-nested-config vona/src/backend/config/config/existingReadyProfile.ts vona/src/backend/config/config/existingReadyProfile.test.ts
```

The direct test must use type-only framework/Winston imports where possible and only runtime imports already installed/observed at implementation start. No loader workaround, dependency installation or type-syntax rewrite outside these paths is preauthorized. If current Node cannot execute the designed direct surface or the no-emit root project exposes unrelated debt, preserve the actual diagnostic and stop for a specific scope/verification disposition; do not mask it, run init or silently broaden the work. The root no-emit project includes these files but does not prove every referenced framework project is error-free.

Allocate one initial plus at most one corrective execution per source producer (four planned/eight maximum), no runtime-resource producers. Corrections must remain in the exact two paths and accepted behavior; new owner/API/security findings stop. Observation 120 seconds for tests/typecheck, 60 for style; each stream 2 MiB, combined 4 MiB, strict UTF-8 and complete terminal normalization/path sanitation before retention. An observation overrun is failure/unresolved ownership, not permission to signal, delete or release work. Custodian proposed: `zhennann`, with assistant-run local implementation/captures only after approval. Record actual test names/counts instead of inventing an expected aggregate count; all five proof obligations in 10.4 must be represented, including the explicit incompatibility witness.

Evidence belongs in a fresh approved main-local output location, **not** in a silently created parallel suite-spec tree. Proposed location: `vona/.existing-ready-profile-qualification/<unique-run-id>/`, created without overwrite only after checking current ignore/tracking behavior; if that location would require ignore-rule edits, stop and request a concrete location amendment. Retain sanitized producer commands/exits, new-source hashes, exact diff digest, original-default unchanged hashes and limitations. Do not retain environment contents or application config payloads. Main source commit/push and MCP return synchronization/record updates remain separate operations, not implied by implementation approval.

This preparation's documentary checks are independently authorized: exact package/dossier/progress formatting, full authority audit, chart regeneration/freshness, docs build, scoped links/path checks and original-source/history preservation. One scoped formatting correction is permitted for authored Markdown; no production producer above is executed here. Actual documentary outcomes are retained in the attachment bundle, not predeclared by this dossier.

**Current single handoff:** decide the explicit factory-only rotation policy and exact two-path main implementation together. If accepted and execution-authorized, implement/verify that bounded helper rather than scheduling another generic preparation. If policy is declined, retain production P2 refusal and do not substitute partial configuration, freezing shared callbacks or a synthetic positive profile. Whole production B remains unavailable pending the concrete P1/P3 authority/coverage and complete-profile integration; these gates do not block this independently meaningful helper candidate.
