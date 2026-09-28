---
name: cabloy-domain-planning
description: Use this skill whenever the user wants to plan a new business domain in this Cabloy repo, such as CRM, OA, training, ERP, or a similar long-lived domain. Trigger when the request is about deciding suite-first structure, proposing or validating providerId, suite, and module names, comparing naming options, confirming names before scaffolding, or keeping a custom naming path open. Prefer it before backend or frontend scaffolding when the main question is domain naming and structure rather than immediate file generation.
---

# Cabloy Domain Planning

Use this skill when the user is still deciding how to name and structure a new business domain.

## Goals

1. detect whether the active repository is Cabloy Basic or Cabloy Start
2. classify the request as domain planning rather than immediate scaffolding
3. default to suite-first planning for real business domains
4. propose valid `providerId`, suite, and module names before any generation happens
5. require explicit confirmation before handing off to scaffold commands
6. always keep a custom naming path available for the user
7. finish with the CLI-first next step and matching verification guidance

## Step 1: Detect edition first

Check the repository root for these marker files:

- `__CABLOY_BASIC__`
- `__CABLOY_START__`

Interpretation:

- only `__CABLOY_BASIC__` present → this is Cabloy Basic
- only `__CABLOY_START__` present → this is Cabloy Start
- both markers present → treat the repository as ambiguous or invalid and stop before making edition-specific assumptions
- neither marker present → inspect the owning package scripts and nearby repository structure, then ask before making an edition-specific assumption

This matters most when examples, frontend flavors, or suite/module availability may differ between editions.

## Step 2: Confirm that this is a planning request

Use this skill when the user is asking things such as:

- how to plan a new CRM, OA, training, ERP, or similar business area
- whether the work should start as a suite or only a module
- how to choose `providerId`, `suiteName`, or first module names
- whether a proposed name is valid
- which naming option should be preferred before scaffolding

Do not use this skill once naming is already confirmed and the request is clearly about backend or frontend scaffolding. In that case, route to the appropriate scaffold skill.

## Step 3: Default to suite-first planning

For real business work, prefer the suite-first path described in:

- `repo-docs/fullstack/suites-and-modules.md`

Use this practical rule:

- prefer a **suite** for the business domain boundary
- prefer **modules** for the capabilities inside that domain
- treat a standalone module as the exception for very small, disposable, or tutorial-only work

Do not jump into `:create:module` first when the real question is still the domain boundary.

## Step 4: Collect or infer the planning inputs

Before proposing names, determine these inputs:

1. the business domain term
   - examples: crm, oa, training
2. whether the user already has a required namespace or provider prefix
   - examples: `demo`, `biz`, `mycorp`
3. whether the work is backend-only, frontend-only, or fullstack
4. whether the user wants a conservative functional naming style or a custom/branded naming style

If the user already provides names, validate them instead of replacing them silently.

## Step 5: Validate the naming rules

Reuse the durable naming rules from:

- `repo-docs/fullstack/suites-and-modules.md`
- `repo-docs/frontend/modules-and-suites.md`

### Suite short name rule

A suite short name follows:

```text
{providerId}-{suiteName}
```

In this repository:

- `suiteName` must use lowercase English letters only
- `suiteName` must not contain another `-`

So a name such as `crm-core` is not valid as the `suiteName` segment.

When a proposed name is invalid:

- explain whether the invalid part is `providerId`, `suiteName`, or the combined short name
- do not collapse those layers into one vague error
- provide the nearest valid alternatives when possible

For example:

- `crm-core` is invalid as a `suiteName`
- `crm-core` can still be a valid suite short name if it is interpreted as:
  - `providerId = crm`
  - `suiteName = core`

### Module planning rule

Module names should represent capability ownership inside the suite.

Prefer names that:

- map cleanly to a business capability
- remain natural when they become resource owners, controller names, API paths, or menu/page anchors
- avoid technical placeholder words such as `base`, `core`, or `common` unless the module is truly a shared technical layer

If more detail is needed, prefer expressing it in the module name rather than by making the suite name longer.

## Step 6: Propose names in a compact planning table

When the user has not finalized naming, propose:

1. one **recommended** option
2. one or two **alternatives** if there is a meaningful trade-off
3. one **custom naming** path

The proposal should be compact and practical. Include:

- `providerId`
- suite short name
- Vona suite full name
- Zova suite full name
- 3-6 likely first module names
- which module should be scaffolded first

Use examples such as:

- suite: `demo-training`
- modules: `training-student`, `training-course`, `training-record`

When helpful, explain why the recommendation is better than obvious alternatives.

## Step 7: Require confirmation before scaffolding

Before suggesting any scaffold execution, explicitly confirm:

- `providerId`
- suite short name
- first module names
- whether the user wants backend-only, frontend-only, or fullstack scaffolding

Do not treat silence as confirmation.

Always leave a custom path available, for example:

- “If you want a different `providerId`, suite short name, or first module set, give the custom names and I will validate them against the repo rules.”

## Step 8: Hand off to CLI-first scaffolding only after confirmation

Once naming is confirmed, route to the real generators rather than hand-authoring structure.

Typical commands are:

```bash
npm run vona :create:suite <suiteShortName>
npm run zova :create:suite <suiteShortName>
npm run vona :create:module <moduleName> -- --suite=<suiteShortName>
npm run zova :create:module <moduleName> -- --suite=<suiteShortName>
```

Then route to:

- `cabloy-backend-scaffold` for backend generation and follow-up
- `cabloy-frontend-scaffold` for frontend generation and follow-up
- `cabloy-workflow` if the task becomes a broader cross-stack routing problem

## Step 9: Verification

Always finish with a verification path that matches the scope.

Before generation, verify:

- the proposed suite name follows the naming rule
- the proposed module names are natural business capability owners
- the command family still exists through `npm run vona` / `npm run zova`

After generation, verify with the narrowest useful checks first:

- `npm run vona :`
- `npm run zova :`
- `npm run deps:vona`
- `npm run deps:zova`
- `npm run tsc`

For docs or AI-asset changes that accompany this workflow, also verify that referenced public docs and skill descriptions still tell a consistent story.

## Response pattern

When helpful, structure the response around these points:

1. detected edition
2. suite-first recommendation
3. recommended naming table
4. alternatives and trade-offs
5. custom naming path
6. confirmation gate before scaffolding
7. next CLI commands after confirmation
8. verification steps

Keep the response practical. The value of this skill is to turn vague new-domain requests into a confirmed, valid, and CLI-ready naming plan before any scaffolding starts.
