# Verification

AI-assisted work should finish with checks that match the scope of the change.

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
- confirm public docs, skills, and root `CLAUDE.md` tell the same story

## Code-generation verification

When a skill triggers code generation or refactor behavior:

- inspect generated output
- run targeted typecheck, tests, or build commands
- prefer existing root scripts when a full verification pass is needed

Verification is part of the workflow, not an optional afterthought.
