---
name: cabloy-spec-generation
description: This skill should be used for requests to create or maintain a Cabloy `repo-specs/<suite>/` set, including a PRD, SRS, PDP/WBS, test plan, progress register, suite ADR, or “write the specs”/“plan the suite.” It links product, technical, delivery, acceptance, and decision records after the domain boundary is confirmed. Route unresolved naming to `cabloy-domain-planning`, implementation to scaffold skills, and concrete synchronization to `cabloy-contract-loop`.
---

# Cabloy Repository Specs

Use this skill to create or maintain a coherent, repository-native planning record for a long-lived Cabloy business suite. The output is internal planning material under `repo-specs/`; it is not source code, generated consumer output, or proof that implementation has happened.

## Goals

1. detect the active repository edition before making site, flavor, UI, or topology assumptions;
2. distinguish a new suite baseline from an extension of an existing spec set;
3. preserve the authority boundaries demonstrated by the Cabloy spec examples;
4. generate stable cross-document traceability from product intent to observed evidence;
5. keep unresolved decisions and unverified work explicit rather than filling gaps with plausible fiction;
6. hand implementation and contract-loop work to the appropriate existing skill instead of starting it implicitly.

Read these references before generating or substantially revising records:

- `references/repo-specs-document-set.md` for the document architecture and section contracts;
- `references/repo-aware-discovery.md` for edition detection, repository discovery, and command rules;
- `references/traceability-and-status-rules.md` for identifiers, evidence, status, and update-order gates.

## Step 1: Detect the repository and edition

From the repository root, inspect:

1. `git rev-parse --show-toplevel` and `git status --short`;
2. `__CABLOY_BASIC__` and `__CABLOY_START__`;
3. the root `package.json` and `CLAUDE.md`;
4. existing `repo-specs/` indexes and related suite/module topology;
5. `npm run vona` and `npm run zova` when the records will cite implementation commands.

Interpret the markers as follows:

- `__CABLOY_BASIC__` present: use Cabloy Basic source and public-doc assumptions;
- `__CABLOY_START__` present: use Cabloy Start source and resolve its own licensed-site, UI, flavor, and command details;
- neither present: do not make strong edition-specific assumptions; inspect the nearby project shape and ask the user to confirm the edition.

Never copy Basic flavor names, SSR assumptions, UI-library assumptions, or exact command lines into a Start record without verifying them in the active Start repository. The document architecture is shared; edition-specific runtime facts are not.

## Step 2: Classify the request

Choose one mode:

### New suite baseline

Use this when the user wants planning records for a new, long-lived business domain. The default output is a complete core set under `repo-specs/<suite-short-name>/`.

### Existing suite extension

Use this when a suite already has a planning directory. Read its README and authority map first. Update the authoritative PRD, SRS, or ADR before downstream WBS, test-plan, progress, or evidence references. Do not silently overwrite existing requirements, decisions, evidence, or status.

### Proportionate planning

A disposable demo, isolated tutorial, or small utility may not warrant the complete seven-document set. Explain the trade-off and offer a smaller record only when the user explicitly wants that scope. A real business domain that is expected to grow defaults to suite-first and the complete baseline.

### Routing to another skill

If the provider, suite, or module identity is unresolved, route to `cabloy-domain-planning` first. If the user wants code generation, route after planning to `cabloy-backend-scaffold` and/or `cabloy-frontend-scaffold`. If the user asks to synchronize a concrete Vona/Zova contract, route that implementation task to `cabloy-contract-loop`. This skill may record those handoff points but does not perform them automatically.

## Step 3: Confirm the planning inputs

Ask only for missing information, grouped into a compact clarification pass. Do not treat “make it comprehensive” as permission to invent business or security decisions.

Collect or confirm:

- **Identity:** business domain, `providerId`, `suiteName`, suite short name, stable planning slug, and whether the directory already exists;
- **Product:** problem, measurable outcomes, personas, primary journeys, and release goal;
- **Scope:** capabilities in scope, explicit exclusions/deferred work, business rules, and acceptance conditions;
- **Topology:** likely capability modules, existing module/persistence owners to reuse, audiences, Admin/Web/other sites, and any separate application boundary;
- **Technical constraints:** instance/tenant model, server-authoritative identity, authorization, data ownership, lifecycle/state, transactions, concurrency, idempotency, audit, privacy, integrations, and migration/version concerns where relevant;
- **Delivery:** dependency order, decision gates, implementation phases, release constraints, and contract-loop checkpoints;
- **Verification:** required test levels, database/flavor constraints, browser/SSR needs, evidence retention and redaction rules, and release gates;
- **Durable decisions:** accepted boundaries, unresolved trade-offs, ADR candidates, and external-provider operations that may need runbooks.

Repository inspection may fill a fact only when the fact was actually observed. Label it as a confirmed current-source fact and cite its path. Keep observed facts separate from proposed target contracts.

## Step 4: Validate identity and protect existing records

For a suite-first domain, validate the existing naming convention before writing:

- short name is `{providerId}-{suiteName}`;
- `suiteName` uses lowercase English letters only and contains no additional hyphen;
- suite-owned source is intended to live under `vona/src/suite/<suite>/modules/` and `zova/src/suite/<suite>/modules/`;
- modules name business capabilities rather than vague technical placeholders.

Use the business suite short name as the planning directory when it is the natural scope. For a capability that belongs to an existing suite, use the existing stable suite/capability planning slug instead of creating a duplicate hierarchy.

If `repo-specs/<slug>/` exists, stop before writing and present the conflict. Offer to update the existing authority set, choose a new explicitly justified slug, or stop. Do not overwrite it merely because the user asked for a “fresh” version.

## Step 5: Present the confirmation gate

Before creating or replacing records, summarize and request explicit confirmation of:

- detected edition and source repository;
- `providerId`, `suiteName`, short name, and output path;
- intended suite-first Vona/Zova topology and module ownership;
- product outcome, personas, in-scope capabilities, and deferred scope;
- tenant, authorization, persistence, site/flavor, and privacy boundaries that are actually confirmed;
- mandatory documents and any optional extensions, with a reason for each;
- unresolved decisions and explicit `TODO(confirm)` gates;
- the initial status policy: delivery is `not-started` unless implementation evidence already exists.

Do not treat silence as approval. Once confirmed, generate the records in authority order. Confirmation to generate records does not accept a durable ADR decision: retain its ADR as `Proposed` unless the user explicitly accepts that decision. If the user asks only for a draft, or has not explicitly accepted a durable boundary, retain unresolved decisions and do not imply acceptance.

## Step 6: Generate the mandatory document set

Create this baseline for a new long-lived suite:

```text
repo-specs/<suite-short-name>/
├── README.md
├── prd.md
├── srs.md
├── pdp-wbs.md
├── test-plan.md
├── progress.md
└── decisions/
    └── 0001-<suite-boundary-slug>.md
```

Use the templates and authority rules in `references/repo-specs-document-set.md`. In brief:

- `README.md` is the maintainer-facing index, reading order, baseline/topology summary, authority map, and related-record index;
- `prd.md` owns outcomes, personas, scope, journeys, business rules, product requirements, launch criteria, and `PRD-*` traceability;
- `srs.md` owns capability/persistence boundaries, data and tenant rules, authorization, state machines, transaction/concurrency/idempotency, API/DTO/OpenAPI, frontend/SSR ownership, nonfunctional contracts, and technical acceptance;
- `pdp-wbs.md` owns dependency-ordered phases, WBS tasks, completion checks, contract-loop checkpoints, and delivery traceability;
- `test-plan.md` owns risk priorities, test levels, `ATP-*` scenarios, fixtures, evidence format/redaction, procedures, and release gates;
- `progress.md` owns derived status, WBS execution rows, blockers, open decisions, evidence pointers, and next proof only;
- `decisions/0001-*.md` owns the durable initial boundary decision, alternatives, consequences, and decision gates.

Create records in a way that makes every sibling link resolvable from the final directory. Use stable prefixes consistently, such as `PRD-<DOMAIN>-*`, `SRS-<DOMAIN>-*`, `WBS-<DOMAIN>-<PHASE>-*`, and `ATP-<DOMAIN>-*`. Choose a concise domain prefix and use it consistently across all matrices. Define every exact SRS ID used in generated planning records as one formal contract in `srs.md`, and every exact ATP ID as one scenario with a procedure in `test-plan.md`, before any downstream record references it. Wildcards and ranges are compact summaries of already-defined IDs; they never substitute for a formal definition.

## Step 7: Add optional records only when justified

Do not generate optional files because a reference suite contains them. Select them from explicit requirements:

- `presentation-contracts.md`: multiple audiences or Admin Resource scenes need durable information-area, field-boundary, or renderer decisions;
- `semantic-presentation-rollout.md`: presentation or metadata work is staged, serial, resumable, and needs handoff gates;
- `runbooks/<provider-or-operation>.md`: a real external provider, webhook, sandbox/live procedure, reconciliation, cutover, or incident operation is in scope;
- additional ADRs: a separate durable security, tenancy, ownership, site/flavor, migration, integration, or scope decision exists;
- `evidence/`: create only when actual ATP execution produces retained redacted evidence, not as an empty completeness signal.

Optional records remain subordinate to the PRD/SRS/WBS/test-plan authority appropriate to their content. A presentation matrix cannot authorize an API or redefine persistence; a runbook cannot redefine a payment state machine; a rollout record cannot replace the WBS or test plan.

## Step 8: Apply Cabloy-specific contract guardrails

While drafting, preserve these principles and tailor them to confirmed scope:

- `repo-specs/` is the product/business planning home; `repo-docs/` is public and agent-facing framework guidance; an established `repo-docs-internal/` home may hold cross-suite maintainer rationale; `.claude/skills/` is workflow behavior; do not assume or create an internal-docs home in an edition that lacks one;
- use suite-first ownership and distinguish new domain modules from reusable framework modules; do not duplicate an existing persistence or identity owner without a stated decision;
- treat the active Vona instance as the tenant by default; do not introduce a store, organization, or merchant entity unless the confirmed domain contract requires it;
- make identity, tenant scope, authorization, and ownership server-authoritative; menus, routes, browser filters, and UI visibility are not API authorization;
- specify transactions, concurrency, idempotency, audit, recovery, and historical snapshots when the business flow needs them;
- for fullstack work, record the Vona-to-Zova forward chain and Zova-to-Vona reverse-chain checkpoint, but hand actual generation/synchronization to `cabloy-contract-loop`;
- when Admin Resource and Web self-service consume one resource with different authority or audience, separate API/DTO contracts, server scope, state owners, and pages while retaining one domain/persistence boundary;
- ask before choosing whether a persisted-field change increments `vonaModule.fileVersion`; do not silently invent migration history;
- use `TODO(confirm)` and neutral placeholders for missing facts; never copy example-suite entities, routes, tests, CI links, or evidence into a new domain.

## Step 9: Quality-check the document set

Before reporting completion, verify:

1. every in-scope `PRD-*` requirement maps to an `SRS-*` contract, a `WBS-*` task, and an `ATP-*` scenario;
2. every SRS contract maps backward to a product requirement and forward to planned delivery/proof;
3. every WBS item has dependencies, a bounded task, completion checks, and expected ATP coverage;
4. every ATP has traceability, procedure/scope, minimum proof, and evidence-retention rules;
5. `progress.md` contains only derived status and never introduces requirements or contracts;
6. no downstream file silently changes an upstream product, technical, or ADR decision;
7. every `verified` claim has observed revision, environment, exact command/procedure, result, and redacted evidence location;
8. initial rows remain `not-started`, `deferred`, or explicitly `blocked` unless existing observed evidence was intentionally carried forward;
9. every exact `PRD-*`, `SRS-*`, `WBS-*`, and `ATP-*` reference in the planning authority set resolves to exactly one formal definition in its owning document; ranges and wildcards are aggregation notation only and cannot satisfy this check;
10. README language distinguishes observed facts, confirmed inputs, proposed targets, and `TODO(confirm)` decisions, and does not upgrade a `Proposed` ADR into a confirmed or accepted durable boundary;
11. local Markdown links and referenced paths resolve;
12. prospective commands are real commands discovered in the active repository, or clearly marked as commands to confirm later.

If the exact-ID or status-consistency audit fails, correct the authoritative planning records and rerun it before reporting generation complete. This is a static planning check, not ATP execution: do not create evidence or claim `verified` for it.

Do not run `npm run init`, reset a database, scaffold code, or execute deployment/provider operations as an automatic consequence of writing planning records. Do not report those activities as evidence.

## Step 10: Handoff and response

Report:

- detected edition and output directory;
- files created or updated;
- optional files intentionally omitted and why;
- unresolved decisions and the next confirmation needed;
- initial status and evidence limitations;
- recommended next workflow (`cabloy-domain-planning`, backend/frontend scaffold, or `cabloy-contract-loop`).

Keep the result practical. A good spec set gives the next implementer a shared authority map, not a fictional completion report.
