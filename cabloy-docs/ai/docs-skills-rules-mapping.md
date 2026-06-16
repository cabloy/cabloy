# Docs, Skills, Rules, and CLI Mapping

This page is for docs, skills, and workflow authors who need to decide where Cabloy AI guidance should live.

This page explains how the Cabloy AI knowledge system is divided across public docs, skills, rules, and CLI capabilities.

## Why this mapping matters

Without a clear mapping, AI systems and contributors repeat the same mistakes:

- knowledge is stored in the wrong place
- CLI capabilities are documented but not reused in skills
- skills explain things that should live in docs
- rules become too large because they try to teach everything
- the same guidance drifts across multiple files

The goal is to give each layer a distinct job.

## The four main layers

### 1. Public docs

Location:

- `cabloy-docs/`

Use public docs for:

- durable user-facing guidance
- durable agent-facing workflow guidance
- architecture explanations that people and agents should both understand
- edition-aware usage notes that need to be reviewed in prose

Public docs answer questions like:

- how does the fullstack collaboration loop work?
- how should Vona ORM and OpenAPI be understood?
- how does Zova page or model architecture work?
- what is different between Cabloy Basic and Cabloy Start?

### 2. Internal engineering docs

Location:

- `.docs-internal/`

Use internal docs for:

- ADRs
- architecture rationale
- maintenance boundaries
- “why this design exists” notes that do not belong in public user docs

Internal docs answer questions like:

- why were docs and internal notes separated?
- why is AI enablement structured this way?
- what invariants should future contributors preserve?

### 3. Rules and commands

Locations:

- `CLAUDE.md`
- `.claude/commands/`

Use rules for:

- concise repo-wide operational guidance
- default behavior Claude should follow in this repo
- short durable constraints such as edition detection and CLI-first preference

Use commands for:

- named recurring operator workflows
- shorter, explicit actions such as release or future migration helpers

These layers answer questions like:

- what should Claude check first in this repo?
- when should CLI be preferred over manual scaffolding?
- what recurring workflow deserves a named command?

### 4. Skills

Location:

- `.claude/skills/`

Use skills for:

- procedural decision trees
- reusable workflows with branching logic
- tasks that benefit from bundled references, evals, or future deterministic helpers
- repo-specific orchestration over CLI and source inspection

Skills answer questions like:

- how should Claude choose the right Cabloy workflow?
- when should it branch between Basic and Start?
- what is the right verification path after generation or refactor work?

## Decision rule for authors: where should a new piece of knowledge go?

Use this quick rule:

- if people and agents both need to read and understand it, put it in **public docs**
- if it is maintainer rationale or long-lived design history, put it in **internal docs**
- if it is short repo-wide behavioral guidance, put it in **CLAUDE.md**
- if it is a named repeatable operator action, put it in a **command**
- if it is a reusable procedural workflow with branching, put it in a **skill**

## Example mappings

### Example: “Always detect Basic vs Start before giving UI-sensitive advice”

- public explanation → [AI Edition Detection](/ai/edition-detection)
- consistency review surface → [Edition Consistency Checklist](/ai/edition-consistency-checklist)
- repo-wide behavior rule → `CLAUDE.md`
- procedural enforcement → `cabloy-workflow` skill

### Example: “Use Zova CLI refactors before hand-editing page params/query/component props”

- conceptual explanation → public docs in frontend and AI sections
- default agent behavior → `CLAUDE.md`
- step-by-step orchestration → `cabloy-workflow` skill or future specialized skills

### Example: “How should a backend base class be placed?”

- public operational explanation → [Class Placement Rule](/ai/class-placement-rule)
- maintainer rationale and invariants → `.docs-internal/architecture/class-placement-a-b1-b2.md`
- default repo-wide behavior → `CLAUDE.md`
- procedural decision workflow → `cabloy-workflow` skill

### Example: “How should AI look up a backend global bean?”

- public lookup explanation → [Global Bean Lookup](/ai/global-bean-lookup)
- default repo-wide behavior → `CLAUDE.md`
- procedural lookup sequence → `cabloy-workflow` skill

### Example: “How backend OpenAPI becomes frontend SDK”

- full explanation → [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- workflow steering → skill and rules can point to the docs and choose the right CLI path

### Example: “What `@Api.field(...)` ordering rule should AI preserve when mixing helpers and zod?”

- full explanation → [Entity Guide](/backend/entity-guide) and [DTO Guide](/backend/dto-guide)
- AI workflow reminder → [Playbook: Add a Backend Module](/ai/playbook-backend-module)
- procedural checklist reminder → backend scaffold skill references
- avoid putting the full explanation only in `CLAUDE.md` because this is a framework-specific authoring rule, not a short global behavior rule

## Anti-patterns to avoid

Avoid these mistakes:

- putting large conceptual explanations in `CLAUDE.md`
- using a skill as the only place where an important architectural rule is explained
- duplicating the same workflow prose across docs and skills without giving each a distinct role
- creating a command for something that actually needs a branching decision tree
- creating a skill that re-implements an existing CLI generator manually

## Why this matters for AI workflows

This mapping reduces token waste and drift.

If each layer does the right job:

- docs hold durable explanations
- rules hold short repo behavior
- commands hold named actions
- skills orchestrate real workflows
- CLI executes framework-native generation and refactor behavior

That is the AI-development model Cabloy is optimizing for.
