# Generate a Cabloy Suite Specification

In Claude Code, describe the business capability you want to plan:

```text
/cabloy-spec-generation <business description>
```

For example:

```text
/cabloy-spec-generation Plan a multi-tenant equipment-maintenance suite for technicians and operations managers, with work orders, asset history, role-based access, and an Admin dashboard.
```

You do not need to provide every product or technical decision in the first prompt. Cabloy AI inspects the active repository, asks focused questions, recommends boundaries where needed, and shows a confirmation summary. It generates or updates the suite specification set only after you explicitly approve that summary.

A specification set establishes product intent, technical contracts, delivery structure, acceptance procedures, and decision history. It does **not** prove that application code, generated artifacts, tests, or acceptance evidence already exist.

This guide is the planning half of [AI Spec-Driven Development](/ai/ai-spec-driven-development). It explains the visible workflow; the `cabloy-spec-generation` Skill retains the detailed procedural checks that operate it.

## When to use it

Run `/cabloy-spec-generation <business description>` when you want to:

- establish a new long-lived business suite and its PRD, SRS, WBS, test plan, progress register, and initial ADR
- update an existing suite's requirements, contracts, scope, delivery plan, or acceptance planning
- turn confirmed product intent into traceable delivery and acceptance records before implementation

Use a different path when the task is already an approved bounded WBS increment, direct backend or frontend implementation, or Vona/Zova contract synchronization. If the provider, suite, or capability identity is still unresolved, AI guides that decision before it creates a competing suite hierarchy.

## What happens after you invoke it

1. **AI checks the current repository.** It detects the active Cabloy edition, reads the relevant repository guidance and existing suite records, and distinguishes observed source facts from your confirmed decisions, proposals, and unresolved items.
2. **AI identifies the planning scope.** It distinguishes a new suite, an update to an existing specification set, and a deliberately smaller planning request. Cabloy Basic and Cabloy Start share the planning model, but their runtime details can differ, so the active source remains authoritative for edition-specific facts.
3. **AI asks focused questions.** You provide only the decisions that are needed to make the plan coherent. AI can recommend a boundary, but it identifies a recommendation as a proposal rather than treating it as confirmed input.
4. **AI presents a confirmation summary.** The summary states what will be created or changed, what remains unresolved, and which decisions or WBS branches remain gated.
5. **You approve or revise the summary.** No specification file is generated, replaced, or treated as approved merely because a question was asked or left unanswered. A confirmation to generate records also does not accept a durable ADR; a decision remains proposed until it is explicitly accepted.
6. **AI generates or updates the set.** It links the planning records, preserves traceability and stable identifiers, refreshes applicable derived planning views, and reports the resulting files, unresolved decisions, and next workflow.

## What you may be asked to confirm

The initial business description can be short. During the conversation, AI may ask you to confirm:

- the business outcome, audiences, in-scope capabilities, exclusions, and deferred scope
- suite identity, capability ownership, and the target `repo-specs/<suite>/` directory
- the Web, Admin, or other site strategy that current source and confirmed requirements support
- persistence, ownership, tenant, authorization, privacy, lifecycle, migration, and integration constraints
- delivery, release, and verification expectations
- unresolved durable decisions, the WBS branches they block, justified optional records, and the initial delivery status

This is a design confirmation, not a request to invent implementation details prematurely. When a fact must come from the active repository, AI verifies it rather than carrying assumptions across editions.

## What gets generated or updated

For a new long-lived suite, the normal core set is:

```text
repo-specs/<suite>/
├── README.md
├── prd.md
├── srs.md
├── pdp-wbs.md
├── test-plan.md
├── progress.md
├── implementation-gantt.svg
├── implementation-burndown.svg
└── decisions/
    └── 0001-*.md
```

| Record                     | What it provides                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| `README.md`                | Index, reading order, topology summary, and authority map                                        |
| `prd.md`                   | Product outcomes, audiences, scope, journeys, and business rules                                 |
| `srs.md` and accepted ADRs | Technical contracts and durable decisions                                                        |
| `pdp-wbs.md`               | Bounded delivery work, dependencies, completion checks, and applicable Contract Loop checkpoints |
| `test-plan.md`             | Acceptance procedures, expected proof, and release gates                                         |
| `progress.md` and charts   | Derived delivery status and planning views, not upstream authority                               |

AI adds presentation contracts, staged rollout records, runbooks, extra ADRs, or an `evidence/` directory only when the confirmed scope justifies them. It does not create empty evidence records to make testing or delivery appear to have started.

For an existing suite, the workflow updates the owning upstream authority before dependent records. It preserves existing identifiers, accepted decisions, history, and evidence conventions rather than silently overwriting them or creating a parallel planning set.

## How traceability and evidence work

Cabloy connects the specification set through **Traceable Spec Delivery**:

```text
PRD → SRS → WBS → ATP → Evidence
```

A product or technical change belongs in its PRD, SRS, or accepted ADR before its WBS, acceptance, progress, evidence, and chart implications are updated. A progress entry or chart cannot introduce a requirement, resolve a contract conflict, or accept an ADR.

Planning records and derived charts do not establish `implementation-complete` or `verified`. `verified` requires the applicable acceptance procedure and retained, redacted observed evidence. A generated plan, planned command, scaffold, screenshot, or unrelated check is not automatically sufficient proof.

## What happens next

After the specification set is coherent and one bounded WBS increment is approved, execute that increment in Claude Code:

```text
/cabloy-spec-execution <WBS-ID>
```

Choose one named WBS item, or an explicitly approved finite phase with a closure boundary. Do not use execution to implement an entire suite automatically or to resolve an upstream product, contract, dependency, scope, or durable-decision conflict; return to planning when those records need to change.

## Further reading

- [AI Spec-Driven Development](/ai/ai-spec-driven-development) for the authority and evidence model
- [Execute an Approved Cabloy Specification Increment](/ai/playbook-spec-execution) for bounded implementation, verification, evidence, and progress handoff
- [Docs, Skills, Rules, and CLI Mapping](/ai/docs-skills-rules-mapping) for the boundary between public guidance, skills, suite records, and internal rationale
- [Repo Scripts](/reference/repo-scripts#chart-input-contract) for the derived-chart input contract and manual chart commands
