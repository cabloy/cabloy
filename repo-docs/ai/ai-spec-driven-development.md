# AI Spec-Driven Development

**AI Spec-Driven Development** is Cabloy's approach to using AI from confirmed product intent through verifiable delivery evidence. It gives people and AI agents a shared, repository-native way to decide what to build, which contract owns a change, and what proof is required before an increment is called verified.

It is a disciplined path within the broader [AI Development](/ai/introduction) area, not a promise of unconstrained prompt-to-code automation.

## From intent to evidence

Cabloy implements AI Spec-Driven Development through **Traceable Spec Delivery**, also described as **Spec-to-Evidence Delivery**:

```text
PRD → SRS → WBS → ATP → Evidence
```

This is a traceability chain rather than a literal list of every implementation activity:

- **PRD** defines product outcomes, scope, audiences, journeys, and business rules.
- **SRS** defines technical contracts, ownership, data, authorization, lifecycle, API, and nonfunctional boundaries.
- **WBS** defines bounded delivery work, dependencies, completion checks, and applicable Contract Loop checkpoints. In a suite record, this is commonly maintained in `pdp-wbs.md`.
- **ATP** defines formal acceptance procedures, expected proof, and release gates.
- **Evidence** is observed, retained, redacted proof for the applicable authority and revision.

Implementation and, when applicable, fullstack contract synchronization happen between the approved WBS increment and the resulting ATP evidence.

## AI Skills

To support this workflow, Cabloy provides two complementary AI Skills:

- `cabloy-spec-generation` creates or maintains suite-local planning authority and traceability before implementation.
- `cabloy-spec-execution` coordinates one confirmed, bounded WBS increment through the appropriate specialist workflow, scoped verification, retained evidence, and derived progress updates.

Use the skills in Claude Code when the task matches their boundary. Start planning with `/cabloy-spec-generation <business description>`; after one bounded increment is approved, use `/cabloy-spec-execution <WBS-ID>`. They provide procedural routing, readiness and confirmation gates, and evidence discipline; they do not replace the suite records that own product, technical, delivery, acceptance, or evidence authority. For the detailed public workflow, read [Generate a Cabloy Suite Specification](/ai/playbook-spec-generation) and [Execute an Approved Cabloy Specification Increment](/ai/playbook-spec-execution).

## Repository-native, domain-scoped authority

Traceable Spec Delivery does not create a second planning hierarchy or reduce the project to one document. It keeps authority at the record and domain that own it.

| Record                                  | Role                                                        |
| --------------------------------------- | ----------------------------------------------------------- |
| Suite `README.md`                       | Index, reading order, topology summary, and authority map   |
| `prd.md`                                | Product authority                                           |
| `srs.md` and accepted ADRs              | Technical contracts and durable decisions                   |
| `pdp-wbs.md`                            | Delivery decomposition, dependencies, and completion checks |
| `test-plan.md`                          | ATP procedures and release gates                            |
| Evidence records                        | Observed proof only                                         |
| `progress.md` and implementation charts | Derived status and views, not upstream authority            |

Update upstream authority before downstream records. For example, a changed product or technical boundary belongs in the PRD, SRS, or an accepted decision first; its WBS, ATP, progress, evidence, and derived-chart implications follow from that change. Evidence can reveal a mismatch, but it cannot rewrite a requirement or contract.

For the detailed authority table, identifiers, and chart boundary, see [Generate a Cabloy Suite Specification](/ai/playbook-spec-generation).

## Evidence-gated delivery

**Evidence-gated delivery** means delivery status stays precise about what is known and what has been proven.

- `planning-complete` means an explicitly `planning-only` WBS task's documentary checks have a named-reviewer, revision-scoped closure disposition and retained planning proof. It satisfies that task's prerequisite edge, not implementation, ATP, successor approval, or release.
- `implementation-complete` means the source work is complete, while required ATP or release proof remains.
- `verified` means all applicable WBS checks and ATPs have durable, linked, redacted observed evidence.

A successful build, generation command, chart-freshness check, planning record, screenshot, manual walkthrough, or unrelated test run is not automatically verification. It is verification only when the authoritative test plan defines it as sufficient retained proof for the named increment.

Readiness gates, evidence gates, and release gates are also distinct:

- **Readiness gates** determine whether an increment may start.
- **Evidence gates** determine whether a verification or closure claim is justified.
- **Release gates** are the test-plan-defined conditions for release-level acceptance.

## Deliver bounded, verified vertical increments

The controlled execution unit is one named WBS item or an explicitly approved finite phase with a defined closure boundary—not an open-ended request to finish a suite or continue automatically.

Before source work begins, an **execution dossier** makes the unit explicit: target and revision, linked authority, dependencies, scope and exclusions, safety and ownership constraints, permitted verification, expected evidence, allowed record updates, blockers, and one next action. After work, a **resumable handoff** records the implemented scope, procedures actually run, resulting evidence and status, any gap or blocker, and exactly one next action.

This structure lets a team pause, review, or transfer work without treating an unfinished implementation as verified. See [Execute an Approved Cabloy Specification Increment](/ai/playbook-spec-execution) for the readiness gates, routing rules, evidence protocol, and handoff format.

## Converge planning into implementation

Planning should resolve the material blockers of the next bounded increment, not specify every future detail before any code is written. Keep a finite blocker/exit checklist in the existing owning records: the unresolved decision, why it blocks this increment, its decision owner, and the condition that closes it. Separate deferrable details and later increments; batch related decisions instead of turning each clarification into another preparation and review cycle.

Before adding a planning pass, explain which blocker or material uncertainty it addresses, what new fact or decision value it should provide, and how it ends. If the next pass only restates an accepted direction without a justified new approach to the remaining blockers, report stalled convergence and recommend a concrete decision, bounded feasibility check, or scope disposition. A larger document or another review is not delivery progress by itself.

Blockers follow actual dependencies, not the whole suite by default. A blocked identity integration does not necessarily block an independent capability whose own contracts, dependencies, safety boundary, and verification plan are ready. Conversely, a frontend change that depends on an unresolved response contract cannot bypass that dependency by calling itself an independent increment. Surface a meaningful, independently verifiable candidate for approval when available; if none exists, state why. Foundation-only work is useful only when it has explicit integration value and checks, not merely an empty scaffold presented as feature completion.

Planning is sufficient for an increment when its material contracts, dependencies, scope, safety constraints, and verification plan are settled. At that point, request any missing execution approval or proceed within valid existing approval. Reuse an unchanged approved dossier after checking current revision, worktree attribution, and evidence applicability; a skill handoff, resumed session, or ordinary implementation substep is not a reason to request the same permission again. Material changes, newly observed risks, and the approval's own conditions can require renewed approval; prior approval never covers unrelated tasks or unapproved external/destructive operations.

This is not a fixed limit on planning rounds or a relaxation of security requirements. Preserve mandatory reviews, predecessor proof, and any specifically required pre-implementation qualification. The new implementation's runtime ATP proof normally follows implementation; it must not become an impossible prerequisite to writing that implementation. Evidence and release gates still control later verification and release claims. A genuine new risk can reopen planning, but the return should name the affected blocker and its exit condition rather than restart open-ended refinement.

## Contract Loop is complementary

[Contract Loop](/fullstack/contract-loop-playbook) is Cabloy's bidirectional Vona↔Zova synchronization model. It determines where fullstack contract truth lives, which generated handoff must be refreshed, and how to recover from forward-chain, reverse-chain, consumer, or local-dependency drift.

Traceable Spec Delivery and Contract Loop answer different questions:

| Concern                                                                                     | Primary model           |
| ------------------------------------------------------------------------------------------- | ----------------------- |
| What should be built, under which authority, and what proves it?                            | Traceable Spec Delivery |
| How do Vona and Zova contract sources, generated handoffs, and consumers stay synchronized? | Contract Loop           |

A WBS increment can require a Contract Loop checkpoint, but synchronization alone does not establish product authority or close its ATP evidence.

## When presentation semantics are in scope

For schema-driven UI, establish the audience, task, scene, meaningful business information areas, and operation-specific DTO boundary before selecting layout mechanics or a renderer. The [Semantic Presentation Contract](/fullstack/semantic-presentation-contract) explains how confirmed product and technical contracts translate into presentation metadata without changing API authority, persistence, validation, authorization, state ownership, or SSR privacy.

## Continue reading

- [AI Development Introduction](/ai/introduction)
- [Generate a Cabloy Suite Specification](/ai/playbook-spec-generation)
- [Execute an Approved Cabloy Specification Increment](/ai/playbook-spec-execution)
- [Contract Loop Playbook](/fullstack/contract-loop-playbook)
- [Semantic Presentation Contract](/fullstack/semantic-presentation-contract)
- [Docs, Skills, Rules, and CLI Mapping](/ai/docs-skills-rules-mapping)
