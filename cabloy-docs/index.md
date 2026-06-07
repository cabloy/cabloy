---
layout: home

hero:
  name: 'Cabloy'
  text: 'Unified fullstack framework documentation'
  tagline: Build SSR, SPA, Web, and Admin applications with monorepo-native guidance for Cabloy, Vona, Zova, and AI-assisted development.
  actions:
    - theme: brand
      text: Get Started
      link: /fullstack/quickstart
    - theme: alt
      text: Editions
      link: /editions/overview
    - theme: alt
      text: AI Development
      link: /ai/introduction

features:
  - title: Fullstack by design
    details: Understand how Cabloy combines the Vona backend and the Zova frontend in one source tree so humans and AI agents can work from the same ground truth.
  - title: Edition-aware workflows
    details: Distinguish what is common across Cabloy Basic and Cabloy Start, and what changes because of UI library, module composition, or private value-add features.
  - title: CLI-first automation
    details: Reuse Vona and Zova CLI capabilities for scaffolding, refactoring, metadata, and verification instead of re-deriving framework conventions from scratch.
  - title: AI-ready knowledge system
    details: Connect public docs, internal architecture notes, Claude rules, and skills so AI-assisted development stays accurate, efficient, and maintainable.
---

# Cabloy Documentation

This site is the new documentation home for the Cabloy monorepo.

It is designed around four practical goals:

1. explain the shared architecture across Cabloy, Vona, and Zova
2. document the real monorepo workflows used in current source code
3. distinguish Cabloy Basic and Cabloy Start clearly
4. provide durable guidance for AI-assisted development

## What is covered here

- **Fullstack**: monorepo setup, shared workflows, and cross-stack architecture
- **Backend (Vona)**: backend concepts, infrastructure, and CLI-backed workflows
- **Frontend (Zova)**: frontend concepts, SSR, UI-stack considerations, and CLI-backed workflows
- **Editions**: how Cabloy Basic and Cabloy Start relate and where they differ
- **AI Development**: how docs, skills, rules, commands, and internal engineering notes work together
- **Reference**: scripts, CLI command families, package layout, and terminology

## Documentation scope labels

Use these labels throughout the site:

<Badge type="tip" text="Common" /> applies to both Cabloy Basic and Cabloy Start.

<Badge type="info" text="Basic" /> applies only to Cabloy Basic.

<Badge type="warning" text="Start" /> applies only to Cabloy Start.

## First reading path

### For project users

1. [Fullstack Quickstart](/fullstack/quickstart)
2. [Editions Overview](/editions/overview)
3. [Fullstack Introduction](/fullstack/introduction)

### For framework contributors and AI workflows

1. [Fullstack Introduction](/fullstack/introduction)
2. [AI Development Introduction](/ai/introduction)
3. [Repo Scripts Reference](/reference/repo-scripts)
4. [Editions Overview](/editions/overview)
