# Verification

AI-assisted work should finish with checks that match the scope of the change.

## Proportional verification

Prefer a few critical business flows through existing test infrastructure over exhaustive upfront matrices or bespoke verification harnesses. Preserve applicable security, authorization, tenant isolation, SSR/hydration, data consistency, migration, cleanup, and formal acceptance requirements.

### Assert business outcomes at the business layer

Business E2E should focus on user actions, visible results, and persistence after save/reload, plus essential rejection paths. Architecture guidance is not automatically a requirement to inspect Controller/IoC object identity, model instances, or Query/cache internals in the browser. Test internal invariants when an explicit architecture/framework contract or an actual regression requires them, preferably at the smallest suitable unit, framework, or integration layer. Architecture requirements and server-side enforcement still apply.

### Reuse system assurance at the owning layer

Assign verification to the layer that owns the guarantee. Business acceptance reuses applicable, already-verified system capabilities instead of repeating unchanged generic login or site-admission matrices as business blockers. A business dependency on a system capability is not, by itself, a reason to requalify that capability.

Distinguish three responsibilities:

- **System assurance:** reuse existing verification when the relied-on behavior and its implementation, effective policy/configuration, and integration assumptions remain unaffected. Briefly identify the existing basis and applicability in the current test plan or execution record; do not create a new assurance register, receipt chain, or approval layer. Do not invent evidence or treat an unknown verification state as a pass.
- **Business acceptance:** check the business's correct use of framework contracts and test its own authorization, ownership, instance isolation, changed user journey, and persisted outcomes at the appropriate layer. System login/admission assurance does not establish permission to access a particular business record. Inspect relevant guard, route metadata, trusted identity handoff, and configuration as part of the integration; this is not a mandate for a new standalone browser scenario for each item.
- **Affected-boundary regression:** add focused checks when shared implementation, policy/configuration, contracts, or integration assumptions materially change, or an actual regression challenges the existing assurance. A new independent site/admission boundary still needs qualification; using an unchanged, qualified site does not inherit an obligation to rerun its complete system matrix.

For example, a new “My records” page on an unchanged protected site should prove its business journey, save/reload persistence where applicable, server-derived owner scope, and rejection of another user's record. It need not re-prove the site's entire login/account-admission matrix. If the increment changes the shared admission policy or reveals a redirect regression, add the focused owning-layer regression and affected integration check.

Apply this distinction when creating ATPs, not only when choosing commands during execution. If an existing authoritative ATP unnecessarily duplicates system qualification, correct its scope through the planning owner instead of silently skipping it or calling an unexecuted test passed. Preserve applicable release requirements and historical outcomes; reused assurance is not a waiver of business security or proof of changed behavior.

### Keep evidence sufficient, not elaborate

Prefer native test reports, redacted logs, and concise ATP/progress links. Retain required revision/worktree attribution, changed-file scope, exact procedures, relevant environment/fixture identities, and observed outcomes, including failures. Do not introduce full input snapshots, exhaustive hash manifests, custom evidence verifiers, or multiple receipt layers unless the test plan requires them or a concrete attribution/integrity risk cannot be addressed with existing artifacts. Preserve privacy review and historical evidence; simpler future evidence is not permission to delete old records.

Retain artifacts only for a named ongoing development need, an applicable acceptance/retention requirement, or unique information still needed to explain a result—not merely because they were generated or might someday be useful. Maintained source-controlled business tests provide ongoing regression protection; historical logs describe a particular run and cannot prove changed code remains correct. Keep current status and blockers in existing progress/phase records, and move durable discoveries into the owning tests, design record, or issue/handoff. A concise delivery summary plus the few primary artifacts needed to support continuing acceptance claims is preferable to permanent process-file chains.

Historical consolidation requires inspection and explicit approval of the deletion scope, including any change to prior retention commitments. Preserve meaningful outcomes, failures, waivers, gaps, and necessary revision attribution; update links and retire obsolete verifier expectations. Remove redundant snapshots/receipts and one-shot helpers only when their required or unique information is retained elsewhere or no longer needed. Do not substitute a giant archive or another checker system. Evidence reorganization alone needs reference/record checks, not business-test reruns, and never advances acceptance or overrides controlling retention requirements.

### Handle failures within the approved boundary

For specification execution, the approved dossier may include bounded in-scope diagnosis, repair, and reruns, with limits and stop conditions. When covered, record the failure and perform the connected correction without requesting approval for every locator or test-fix substep. Do not weaken business/security expectations to obtain a pass. Stop when the approved repair/rerun boundary is absent or exhausted, an explicit first-failure stop applies, or new scope, authority, dependency, safety, external, or destructive-operation questions require renewed approval. This guidance does not broaden or retrospectively replace an existing approval.

See the canonical `cabloy-frontend-scaffold` verification guidance and the `cabloy-spec-execution` execution-protocol and status-and-evidence references for operational details.

## Documentation verification

For public docs changes, verify at minimum:

- VitePress dev/build commands work
- navigation links resolve
- examples match current scripts and command names
- edition labels and notes are consistent

## Skill and rule verification

For skills and repo guidance:

- confirm the workflow still points to real command entrypoints
- confirm edition branches match the active repo markers and scripts
- confirm public docs, canonical `repo-agent-governance/` assets, and generated platform adapters tell the same story
- run the deterministic governance checker after changing shared rules, skills, tools, or adapter metadata
- review edition-aware changes against [Edition Consistency Checklist](/ai/edition-consistency-checklist)

## Code-generation verification

When a skill triggers code generation or refactor behavior:

- inspect generated output
- run targeted typecheck, tests, or build commands
- prefer existing root scripts when a full verification pass is needed

Verification is part of the workflow, not an optional afterthought.
