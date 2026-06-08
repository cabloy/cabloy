# Edition Detection for AI Workflows

This page applies the general detection rule from [Editions / Detection](/editions/detection) to AI-assisted development specifically.

Edition detection should happen before any AI workflow that assumes a frontend stack, module set, or example path.

## AI-specific consequence

If an agent skips edition detection, it can:

- scaffold against the wrong UI-layer assumptions
- suggest the wrong frontend flavors
- cite suites, modules, SSR site baselines, or project assets that do not exist in the active repo
- generate docs or skills that accidentally hardcode Basic-only behavior or `npm create cabloy` assumptions into Start workflows

## Operational rule

Before an AI workflow recommends implementation steps:

1. check the edition marker
2. verify the relevant package scripts or CLI entrypoints
3. branch the guidance only where the editions truly diverge

## Where this rule should live

Keep the same rule in three places on purpose:

- **public docs** so people can review it
- **skills** so agents execute it consistently
- **`CLAUDE.md`** so repo-wide Claude behavior stays aligned
