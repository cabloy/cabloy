---
name: cabloy-spec-generation
description: Use this skill to create or maintain Cabloy suite specifications under repo-specs, including PRD, SRS, PDP/WBS, acceptance planning, progress, and suite ADRs. It supports a complete new baseline, incremental maintenance, and explicitly lightweight planning. Route unresolved naming through cabloy-domain-planning and return here; hand approved bounded implementation to cabloy-spec-execution, not directly to broad scaffolding.
---

# Cabloy Repository Specs

Create or maintain repository-native planning authority. Planning is not source implementation, acceptance evidence, ADR acceptance, or execution authorization.

Read before substantial generation or revision:

- `references/repo-aware-discovery.md`: edition, source discovery, and observed versus new target semantics;
- `references/repo-specs-document-set.md`: authority and proportionate document architecture;
- `references/canonical-spec-input.md`: canonical declarations, parser compatibility, and the three quality gates;
- `references/traceability-and-status-rules.md`: stable IDs, evidence, and authority-first updates.

## 1. Discover the active repository

Inspect the root, working tree, edition markers, root `package.json`, existing `repo-specs/` indexes, relevant suite/module topology, and authored governance. Discover `npm run vona` / `npm run zova` command families when planning cites implementation commands.

- Exactly `__CABLOY_BASIC__`: use observed Basic scripts, UI, sites, flavors, and output paths.
- Exactly `__CABLOY_START__`: resolve those details from the active Start source; do not copy Basic examples.
- Both markers: stop; the checkout is invalid or ambiguous.
- Neither: inspect the owning package and nearby structure, then ask before edition-sensitive planning.

Cite inspected paths. Keep repository facts separate from user inputs, target design, and evidence. Never read or expose `.env*` contents to recommend worktree identity or ports.

## 2. Choose one planning mode

| Mode | Scope and protection | Quality branch |
| --- | --- | --- |
| Complete new baseline | New long-lived suite: six core Markdown records plus initial ADR; both charts after complete chart inputs exist. | Full `spec:check`, then chart generation/freshness, then human decision/status review. |
| Incremental maintenance | Read the existing README/authority map; update affected upstream authority and downstream links only. Preserve IDs, accepted decisions, evidence, and unrelated statuses. | Full audit when the authority set is complete; report legacy gaps separately. Charts only with complete supported inputs. |
| Lightweight planning | Explicitly approved small demo, utility, or limited planning scope. Agree on selected records, omitted owners, limits, and no implied full-suite closure. | `spec:check --lightweight` for available owners/references/links; manually review the limited chain. No forced full set or charts with incomplete inputs. |

An existing directory is the normal incremental destination, not an automatic conflict. Ask about a conflict only for a genuine identity collision, parallel authority, or requested destructive replacement. Do not reset the directory or regenerate the whole baseline by default.

A growing business domain defaults to the complete baseline. Ask before choosing lightweight scope. Do not invent requirements to fill omitted documents.

## 3. Resolve identity without changing the workflow

For unresolved provider/suite/module naming, route to `cabloy-domain-planning` with a **naming-only return to generation**. Validate the returned names and resume this mode and its confirmation gate. Naming confirmation does not authorize source scaffolding.

For suite-first ownership, the short name is `{providerId}-{suiteName}`; `suiteName` uses lowercase English letters only, without another hyphen. Use capability names for modules. Reuse the stable existing suite/capability planning slug rather than creating a competing hierarchy.

## 4. Resolve only missing site strategy

First inspect active shared-site composition owners, extension points, independent-site conventions, and framework constraints. A capability module or an Admin audience alone does not require an independent site.

- If both Web and Admin strategies are unresolved, evaluate them separately, recommend contextually, and present one single-select decision: shared/shared, independent/shared, shared/independent, independent/independent. Keep Other for custom/no-site/deferred choices.
- If only one audience is in scope or unresolved, ask only about that audience.
- If an established strategy already governs the requested change, preserve it; do not repeat the four-way question absent a material change.

Choosing strategy confirms only that input. It does not accept an ADR or approve implementation.

Classify every target as **observed existing**, **proposed new**, or **explicitly approved new** under the discovery reference. Shared integration requires an observed owner. A proposed independent tuple may be designed before its source exists: validate framework constraints and collisions, obtain explicit design approval, and retain its governing ADR as `Proposed` until separately accepted. An explicitly approved new tuple with an `Accepted` ADR can be created by a bounded execution task; source pre-existence is not a prerequisite.

Unknown or unchecked values stay `TODO(confirm)` with the exact missing design/source/conflict check. Block only dependent site/frontend implementation; keep backend, unrelated audiences, and runnable discovery tasks actionable.

## 5. Collect the remaining inputs

Ask only for missing inputs in a compact clarification pass:

- identity/output path, outcomes, personas, journeys, scope, exclusions, and acceptance;
- modules and reused persistence/identity owners; audience strategy and target classification;
- tenant, server-authoritative identity/authorization, privacy, lifecycle, transactions, concurrency, idempotency, audit, integrations, and migration/version decisions where material;
- dependencies, release constraints, contract-loop checkpoints, test levels, fixture cleanup, proof/redaction, and optional records;
- durable decisions, ADR candidates, and unresolved gates.

Label recommendations as proposals. A request for comprehensiveness is not permission to invent security or business decisions.

## 6. Confirm generation scope

Before writing, present the edition/root, mode, identity/path, intended ownership, outcomes/scope, site strategy/target tuple classification, affected records, justified omissions/extensions, unresolved gates, and initial status/evidence policy. Include planned chart eligibility and README language.

Keep three approvals separate:

1. **Generation approval** authorizes the named planning edits only.
2. **Design/ADR approval** explicitly approves a durable decision; record `Accepted` only for the decision actually accepted. A tuple design approval is not source-existence proof.
3. **Execution approval** belongs to a bounded WBS dossier in `cabloy-spec-execution`.

Do not treat silence, strategy selection, naming confirmation, or generation approval as another approval. Drafts retain `Proposed` ADRs and controlling `TODO(confirm)` gates.

## 7. Write authority first

For a complete new baseline, create:

```text
repo-specs/<suite>/
├── README.md
├── prd.md
├── srs.md
├── pdp-wbs.md
├── test-plan.md
├── progress.md
└── decisions/0001-<boundary>.md
```

With complete supported chart inputs, generate `implementation-gantt.svg` and `implementation-burndown.svg` as derived views. Use canonical declarations in `references/canonical-spec-input.md` for new records. Each exact PRD/SRS/WBS/ATP ID has one definition in its owner, not merely a matrix, range, or evidence mention.

For updates, change PRD/SRS/ADR first, then mappings, WBS, ATP, evidence assumptions, and progress. Preserve stable IDs and history. Legacy catalogue tables remain compatible; missing formal definitions are a reported legacy gap, not permission to invent business meaning or rewrite legacy business records to satisfy a tool.

Add presentation contracts, rollout records, runbooks, extra ADRs, or evidence only when confirmed scope justifies them. Never create empty evidence or fabricate an `EVD-*` record.

## 8. Preserve Cabloy boundaries

- Keep suite business planning in `repo-specs/`, public/agent guidance in `repo-docs/`, and supporting maintainer rationale in `repo-docs-internal/`.
- Reuse persistence and identity ownership. An independent site does not create a separate tenant, identity, authorization, persistence, or domain-rule authority.
- Treat the active Vona instance as tenant by default. Authorization and scope are server-authoritative, not menus or browser filters.
- Separate genuinely different Admin/Web API/DTO, server-scope, frontend state, and page contracts while retaining one domain/persistence boundary.
- Plan forward and reverse contract-loop checkpoints; actual regeneration belongs to the specialist invoked by execution. Never hand-edit generated consumers.
- Ask before choosing the persisted-field `vonaModule.fileVersion` strategy.
- A new wrapper is a **planned addition**, not a currently runnable command. Validate its durable manifest destination and paired SSR/REST design; execution must create and observe it before running it.

## 9. Apply three independent quality gates

Use the active root scripts, verified from `package.json`:

```bash
npm run spec:check -- <suite>
# Explicit lightweight branch:
npm run spec:check -- <suite> --lightweight
```

1. **Planning authority audit**: `spec:check` validates definition roles, exact references, PRD -> SRS -> WBS -> ATP associations, and local links. Explicit Traceability belongs in declaration bodies. Review gaps and decisions manually; a static pass is not design acceptance.
2. **Chart model/freshness**: only with complete supported README/WBS/ATP/progress inputs, run `npm run spec:charts -- <suite>` then `npm run spec:charts:check -- <suite>`. This proves supported model consistency and SVG freshness only. Regenerate after WBS, test-plan, progress, or README title/language changes. No complete input means an explicit chart omission/blocker, not invented definitions or status.
3. **Human approval/evidence**: review ADR status, controlling TODOs, scope, and evidence-backed status. Only retained applicable ATP proof can justify `verified`; neither audit nor charts can approve a design or implementation.

For incremental legacy gaps, report the missing definition/owner/link and affected chain without silently changing business meaning. If correction needs a new decision, request it and report the update as incomplete at that gate. Lightweight results must state skipped owners/chain coverage; never advertise a full-suite pass.

Planning creation alone initializes delivery as `not-started`, `deferred`, or specifically `blocked`. Preserve carried-forward observed evidence with its revision/authority limits. Do not run init, database reset, scaffolding, deployment/provider operations, or acceptance tests as an automatic consequence of planning.

## 10. Finish with a bounded execution handoff

Report edition/mode/path, files changed, omissions, unresolved decisions, approval domains, actual audit results, chart eligibility/freshness/language, and evidence limitations. Identify one candidate WBS increment or finite phase and its dependencies, acceptance proof, and controlling gates.

The next implementation entry is `cabloy-spec-execution`, which still requires explicit target/dossier approval. Do not jump directly from generation to broad backend/frontend scaffolding, execute an adjacent task, or claim release closure.
