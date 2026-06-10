# Architecture Notes

This directory is for long-lived internal technical explanations.

Use it when future contributors need to understand how a subsystem works, what invariants it depends on, and what design boundaries should be preserved during new feature work or refactors.

## Good candidates for this directory

- subsystem architecture overviews
- cross-package execution flow notes
- internal framework patterns
- state, caching, or lifecycle invariants
- technical constraints that should remain stable over time

Representative examples:

- `class-placement-a-b1-b2.md` records the durable rule for placing backend base classes in `src/lib`, `src/service`, or the global bean shorthand surface
- `ssr-memory-leak-investigation-guide.md` records the confirmed SSR leak root cause, the formal runtime-core fix, and the residual-runtime findings that future memory investigations should reuse
- `ssr-leak-experiment-flags-inventory.md` records which `SSR_LEAK_EXPERIMENT_*` flags still remain in source after cleanup and which were intentionally removed
- `ssr-leak-experiment-cleanup-checklist.md` records the execution order, retained subset, and verification steps for removing old SSR leak investigation flags

## What should go elsewhere

- major design or refactor decisions with explicit rationale should go in `../decisions/`
- end-user documentation should not go under `.docs-internal/`
- temporary implementation scratch notes should not be committed here

## Writing guidance

Prefer documents that answer questions such as:

- how does this subsystem fit into the rest of the monorepo?
- what assumptions does it rely on?
- what would future contributors be likely to break by accident?
- what code paths should be traced first when changing this area?
