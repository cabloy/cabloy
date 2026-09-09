# Skills

Skills are the procedural layer of Cabloy’s AI development model.

## Using a Skill in Claude Code

Invoke a Cabloy Skill by typing its slash name followed by the task input. For example, describe the business capability you want to plan:

```text
/cabloy-spec-generation <business description>
```

The AI guides you through the task-specific confirmation and next steps. See [Generate a Cabloy Suite Specification](/ai/playbook-spec-generation) for the complete planning experience.

## What a skill should do here

A Cabloy skill should reduce repeated reasoning cost by encoding workflows such as:

- choosing the correct backend or frontend entrypoint
- detecting the active edition
- selecting the right CLI command family
- deciding what to verify after generation or refactor work

## What a skill should not do by default

A skill should not re-implement framework scaffolding manually when the Vona or Zova CLI already provides that behavior.

If a generator or refactor command exists, the skill should orchestrate it instead of replacing it.

## Skill placement

- Use root `.claude/skills/` for cross-stack, monorepo-wide workflows.
- Use subtree-local `.claude/skills/` only when a workflow is truly specific to one framework area.

## Skill structure recommendation

A strong Cabloy skill usually includes:

1. repo and edition detection
2. CLI-first workflow selection
3. minimal manual fallback guidance
4. verification guidance
5. references to durable source-of-truth files

When a skill needs to apply an architectural rule such as backend class placement, prefer a branching decision tree that points back to durable docs instead of embedding the full architecture rationale inside the skill itself.

For edition-aware skills, use [Cabloy Editions: For AI Development](/editions/overview#for-ai-development) and [Edition Consistency Checklist](/ai/edition-consistency-checklist) as the durable review surfaces before expanding edition-specific branches.

## Current root workflow skills

The repository currently provides these cross-stack and monorepo-wide workflows in root `.claude/skills/`:

- `cabloy-workflow` for choosing the correct Cabloy work path before implementation
- `cabloy-domain-planning` for proposing and confirming providerId, suite, and initial module names before scaffolding a new business domain
- `cabloy-spec-generation` for creating or maintaining suite-local planning authority, traceability, and derived planning views before implementation; see [Generate a Cabloy Suite Specification](/ai/playbook-spec-generation)
- `cabloy-spec-execution` for coordinating one confirmed WBS increment through specialist implementation, evidence, and derived progress updates; see [Execute an Approved Cabloy Specification Increment](/ai/playbook-spec-execution)
- `cabloy-contract-loop` for backend/frontend contract regeneration and drift diagnosis; see [Contract Loop Playbook](/fullstack/contract-loop-playbook)
- `cabloy-resource-field-update` for updating an existing backend resource field thread; see [Existing Resource Field Update](/backend/resource-field-update)
- `cabloy-module-removal` for removing a backend, frontend, or fullstack module cleanly, including generated-runtime cleanup, stale-residue recovery, and verification; see [Module Removal](/ai/playbook-module-removal)
- `cabloy-backend-scaffold` for selecting the CLI-first Vona path to create or extend backend modules, beans, CRUD resources, DTOs, persistence, and tests, then checking contract, migration, metadata, and verification follow-up; see [Backend CLI](/backend/cli) and [CRUD Workflow](/backend/crud-workflow)
- `cabloy-frontend-scaffold` for selecting the Zova CLI create, refactor, metadata, or OpenAPI path for pages, components, APIs, models, routes, and SSR-aware frontend work, then checking routing, state/contracts, hydration, UI, and verification follow-up; see [Frontend CLI](/frontend/cli) and [Page Guide](/frontend/page-guide)
- `cabloy-master-detail` for generator-first parent-owned detail and recursive nested-detail scaffolding, including aggregate-versus-standalone choices and nested `detail*` DTO naming and placement rules; see [Master-Detail Workflow](/backend/master-detail-workflow) and [Master-Detail Source Reading Map](/backend/master-detail-source-reading-map)
- `cabloy-worktree-environment` for explicitly invoked, confirmation-gated setup of deterministic, secret-safe Vona and Zova local environment overrides for an existing linked worktree. It does not allocate ports or isolate every external service; see [Parallel Worktree Environment](/fullstack/parallel-worktree-environment)
- `cabloy-zova-source-reading` for Zova-native source reading and runtime tracing through controllers, beans, IoC, reactivity, routing, and SSR before offering approximate Vue comparisons; see [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers) and [Zova Source Reading Map](/frontend/zova-source-reading-map)

The specification workflows show the same boundary: [AI Spec-Driven Development](/ai/ai-spec-driven-development) explains the public Traceable Spec Delivery method, while [Generate a Cabloy Suite Specification](/ai/playbook-spec-generation) and [Execute an Approved Cabloy Specification Increment](/ai/playbook-spec-execution) explain its operational paths. The skills retain branching, confirmation gates, specialist routing, and evidence protocol; suite-local records remain the authority for a specific increment.

The module-removal workflow is a good example of why skills belong in `.claude/skills/` instead of `CLAUDE.md`: the task needs branching, cleanup order, recovery guidance for generated runtime directories such as `vona/.vona` and `zova/.zova`, and a verification checklist that would be too large for a short repo-wide rule.

## Advanced subtree-local diagnostics

`detect-ssr-leak` is an advanced Skill local to the Vona workspace for investigating suspected Node.js SSR memory growth. See [Framework Performance](/fullstack/framework-performance#how-to-read-this-example) for the relevant diagnostic context.

Use its instrumentation and snapshot stages only in a controlled local or nonproduction environment. Some stages create temporary diagnostic access or artifacts; remove them and restore the diagnostic environment when finished. Heap snapshots can contain sensitive in-memory application or request data, so keep them access-controlled, never commit or share them, and delete them promptly.
