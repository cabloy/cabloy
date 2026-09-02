# Edition Consistency Checklist

This checklist helps maintainers keep docs, rules, commands, and skills aligned when writing or reviewing Cabloy Basic and Cabloy Start guidance.

Use it whenever you add or revise:

- edition-aware docs
- `CLAUDE.md` guidance
- `.claude/commands/`
- `.claude/skills/`
- AI workflow playbooks

## The baseline story that should stay consistent

Before checking details, confirm that the content still tells the same baseline story:

- **Cabloy Basic** is the public framework/reference edition
- `npm create cabloy` creates the default Cabloy Basic project route
- **Cabloy Start** is the public MIT-licensed edition maintained in its own repository
- Cabloy Start is used by cloning its public repository directly and following its initialization workflow
- both editions share the same Cabloy fullstack core
- both editions share a frontend engineering layer built around Zova, Vue, Vite, Quasar tooling, and related libraries
- the editions diverge in UI layer, frontend flavors, suites/modules, SSR site baselines, project assets, and some generated outputs

If a page, rule, or skill contradicts one of those points, align that content before polishing wording.

## Checklist 1: edition detection is explicit

Confirm that the content:

- tells the reader or agent to check `__CABLOY_BASIC__` or `__CABLOY_START__`
- treats edition detection as mandatory before UI-sensitive guidance
- does not assume Cabloy Basic examples apply to Cabloy Start automatically
- does not assume the project creation path is the same for both editions

## Checklist 2: creation path assumptions are correct

Confirm that the content states or implies the right project-entry model:

- **Cabloy Basic** → `npm create cabloy`
- **Cabloy Start** → public repository clone and edition-specific initialization workflow

Watch for drift such as:

- implying that Cabloy Start is created through `npm create cabloy`
- implying that both editions use the same bootstrap path
- omitting the Start public-repository and edition-specific initialization model when it matters to the workflow

## Checklist 3: shared core vs edition divergence is separated cleanly

Confirm that the content distinguishes:

### Shared core

- Vona
- Zova
- suite-based architecture
- CLI-first workflows
- shared frontend engineering direction

### Edition divergence

- UI layer
- frontend flavors
- suites/modules
- SSR site baselines
- project assets
- edition-specific generated outputs or script paths where applicable

Avoid collapsing the whole difference into “different UI library only.”

## Checklist 4: UI language uses the right layer

When the content talks about frontend differences, confirm that it uses the right level:

- shared frontend engineering layer
- edition-specific UI layer

Prefer wording such as:

- **Cabloy Basic**: DaisyUI + Tailwind CSS UI layer
- **Cabloy Start**: Vuetify UI layer

Avoid wording that makes Quasar sound like the edition UI component library when the intended meaning is tooling.

## Checklist 5: operational examples match the active edition

For scripts, flavors, paths, and examples, confirm that:

- Basic examples use Basic markers and Basic flavor names
- Start examples tell the reader to verify the active Start repository directly
- Start workflows do not silently reuse Basic script or flavor assumptions
- SSR site baseline assumptions match the edition being discussed
- project-asset references match the repo being discussed

## Checklist 6: docs, rules, and skills play different roles

Confirm that the same guidance is distributed correctly:

- **docs** explain the workflow in durable prose
- **`CLAUDE.md`** captures short repo-wide behavioral rules
- **skills** encode procedural branching and follow-up logic
- **commands** are used only for named operator workflows, not as the only home for conceptual guidance

Avoid these drifts:

- a skill contains the only explanation of an edition rule
- `CLAUDE.md` grows into a long architectural essay
- docs duplicate every procedural branch that belongs in a skill

## Checklist 7: verification guidance matches the edition model

When content ends with verification steps, confirm that it reminds the reader or agent to verify the right edition-specific surfaces when relevant:

- flavor names
- script paths
- suites/modules
- SSR site baselines
- generated outputs
- project assets

For Start-sensitive workflows, confirm that verification points back to the active Start repository rather than pretending the current Basic repo is the direct source of truth.

## Checklist 8: wording about system size stays appropriately scoped

If the content talks about project fit, confirm that it keeps the intended nuance:

- **Cabloy Basic** is optimized for public reference, learning, community workflows, and faster small-to-medium system development
- **Cabloy Start** is optimized as a stronger baseline for more complex business systems

Avoid overstating this into a hard claim that Basic cannot support larger systems.

## Quick review questions

Before you finish an edition-aware change, ask:

1. Did I clearly separate shared core from edition-specific divergence?
2. Did I preserve the correct Basic vs Start creation path?
3. Did I avoid turning UI difference into the whole story?
4. Did I point Start-specific operational truth back to the active Start repository where needed?
5. Do docs, rules, and skills each play their proper role?

## Read together with

- [Choosing Between Cabloy Basic and Cabloy Start](/editions/choosing-between-basic-and-start)
- [Editions Overview](/editions/overview)
- [Edition Detection for AI Workflows](/ai/edition-detection)
- [Docs, Skills, Rules, and CLI Mapping](/ai/docs-skills-rules-mapping)
- [Rules and Config](/ai/rules-and-config)
- [Verification](/ai/verification)
