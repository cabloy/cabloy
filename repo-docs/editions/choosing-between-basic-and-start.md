# Choosing Between Cabloy Basic and Cabloy Start

This guide helps you choose the right Cabloy edition before you start a new project, adopt a frontend UI strategy, or prepare AI workflow guidance.

## Short answer

Choose **Cabloy Basic** when you want the public framework/reference edition, the default `npm create cabloy` project route, and a faster path for open, community-oriented, or small-to-medium system development.

Choose **Cabloy Start** when you want the public MIT-licensed edition in its own repository and a stronger baseline for more complex business systems built around Start-oriented SSR sites, project assets, and a Vuetify-aligned UI layer.

## What stays the same in both editions

Both editions share the same Cabloy fullstack core:

- **Vona** as the backend framework
- **Zova** as the frontend framework
- suite-based modular architecture
- CLI-first workflows
- shared frontend engineering direction built around Vue, Vite, Quasar tooling, and related libraries

So the decision is not about choosing two unrelated products. It is about choosing the edition baseline that fits your delivery goals best.

## Choose Cabloy Basic when

Cabloy Basic is usually the better fit when you want:

- the public framework/reference edition
- the default project route created by `npm create cabloy`
- open-source visibility and community-friendly workflows
- public examples and docs that match your repo directly
- a UI layer aligned with DaisyUI + Tailwind CSS
- a faster path for small-to-medium system development

## Choose Cabloy Start when

Cabloy Start is usually the better fit when you want:

- the public MIT-licensed edition maintained in its own repository
- direct cloning of the public Start repository
- Start-specific flavors, SSR site baselines, and project assets
- a UI layer aligned with Vuetify
- a stronger starting point for more complex business systems
- edition-specific rules, skills, and docs optimized for the Start repo assumptions

## The most practical decision factors

### Project creation path

- **Cabloy Basic**: create the project with `npm create cabloy`
- **Cabloy Start**: clone the public repository directly, then run `npm run init`

### UI strategy

- **Cabloy Basic**: DaisyUI + Tailwind CSS
- **Cabloy Start**: Vuetify

### Repo and asset model

- **Cabloy Basic**: public repository and public reference materials
- **Cabloy Start**: separate public repository with edition-specific SSR sites and project assets

### AI workflow assumptions

- **Cabloy Basic**: use Basic-specific examples, flavors, modules, and UI assumptions
- **Cabloy Start**: use Start-specific examples, flavors, SSR site baselines, and UI assumptions

This is why edition detection matters so much for AI vibe coding.

## A simple recommendation rule

Use this rule when you need a fast decision:

1. If you want the public, default, `npm create cabloy` path, choose **Cabloy Basic**.
2. If you want the public MIT-licensed Start repository with Start-oriented assets, a Vuetify-based business-system baseline, and a clone-plus-`npm run init` onboarding path, choose **Cabloy Start**.
3. If AI workflow accuracy matters for UI generation, SSR site assumptions, or flavor-specific commands, confirm the edition before writing prompts, rules, skills, or docs.

## Read together with

- [Editions Overview](/editions/overview)
- [Cabloy Basic](/editions/cabloy-basic)
- [Cabloy Start](/editions/cabloy-start)
- [Edition Detection](/editions/detection)
- [Fullstack Quickstart](/fullstack/quickstart)
