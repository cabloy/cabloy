# Playbook: Metadata Refresh Workflow

This playbook documents when and how Cabloy contributors and AI systems should refresh generated metadata.

## Why this workflow matters

In Cabloy, some framework behavior depends on generated metadata rather than only handwritten source files.

That means certain structural changes are incomplete until metadata is regenerated.

## Common triggers

Typical triggers include:

- route changes
- page params/query structure changes
- component wrapper-related changes
- icon additions or module-level icon changes
- relation or type-surface changes that affect typed framework artifacts

## Step 1: Recognize that the change is structural

Before editing more code, ask whether the change affects framework-generated structure rather than only business logic.

This is the key AI checkpoint.

## Step 2: Choose the right metadata generation path

For frontend-side metadata work, the common path is the Zova tools family.

Representative command family:

```bash
npm run zova :tools:metadata ...
```

For icon changes or other generation-sensitive areas, the metadata refresh may be part of the same broader workflow.

## Step 3: Detect edition before verifying downstream effects

If the generated metadata influences frontend build or runtime behavior, detect whether the active repo is Basic or Start before choosing verification examples.

## Step 4: Re-run the dependent workflow

After metadata regeneration, re-run the relevant dependent flow, such as:

- typecheck
- page route verification
- component usage verification
- icon usage verification
- frontend build or REST generation

## Step 5: Treat metadata generation as part of the change, not cleanup

Metadata regeneration should not be treated as an optional final polish step.

In Cabloy it is often part of the actual correctness path.

## AI rule of thumb

If a change alters framework structure, ask immediately:

- does metadata need regeneration?
- which command family owns that regeneration?
- what downstream build or typecheck should confirm it worked?

That prevents a large class of false-positive “done” states.
