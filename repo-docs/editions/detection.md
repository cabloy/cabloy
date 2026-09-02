# Edition Detection

Edition detection is a first-class requirement for documentation, rules, and skills.

## Repository markers

Use these root markers:

- `__CABLOY_BASIC__` → Cabloy Basic
- `__CABLOY_START__` → Cabloy Start

## Why this matters

The two editions share many concepts but differ in important operational details, especially around:

- frontend UI library assumptions
- flavor-specific frontend scripts
- module availability
- Start-specific value-add project content

If an agent skips edition detection, it may generate the wrong instructions, recommend the wrong module, or use the wrong UI stack.

## Recommended rule for skills and repo guidance

Before suggesting a cross-stack implementation path:

1. check the repository marker
2. verify the relevant root scripts or package scripts
3. only then choose the edition-specific example or workflow branch

When neither marker is present, fall back to code inspection and ask the user before making a strong edition-specific assumption.
