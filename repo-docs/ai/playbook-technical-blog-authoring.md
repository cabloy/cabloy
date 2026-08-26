# Playbook: Technical Blog Authoring

Use this playbook when writing a technical blog about Cabloy, Vona, Zova, or an adjacent engineering problem. Its purpose is to help authors and agents turn a real reader concern into an accurate, approachable, and useful article.

A blog post is not a replacement for reference documentation. Use the post to establish a mental model, explain why a design choice matters, and help readers choose a next step. Link to the relevant documentation for the complete contract and implementation detail.

## Start with the reader's problem

Open with a problem that readers can recognize in their existing practice, not with framework terminology or a product claim.

For example, a Vue-oriented article can begin with a reader encountering growing composables, fragmented state ownership, or unclear cache invalidation. It should acknowledge that the familiar tools are useful before explaining the architectural tradeoff they do not settle by themselves.

Then state one narrow thesis. A useful thesis does all of the following:

- names the change in perspective;
- limits what the article claims;
- avoids declaring one ecosystem universally superior.

For example:

> Zova retains Vue 3 as its reactive foundation while giving complex application code explicit owners for state, behavior, dependencies, and lifecycle.

Do not begin with claims such as “Framework X is obsolete,” “this is the only correct architecture,” or broad adoption and performance claims that the article cannot prove.

## Research before drafting

Use this authority order for technical claims:

1. Current Cabloy documentation, source code, and tests for Cabloy, Vona, and Zova behavior.
2. First-party upstream documentation for Vue, TypeScript, TanStack Query, React, Angular, or another external ecosystem.
3. Carefully labelled experience, interpretation, and recommendations when a fact cannot be established from the sources above.

Treat legacy documentation as input material, not unquestioned truth. If it conflicts with current source, prefer the source.

Classify each meaningful statement while drafting:

| Statement type               | How to write it                                                                                                      |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Verified framework fact      | State it precisely and link to current public docs or an authoritative upstream source.                              |
| Comparison or interpretation | Explain the authoring-model difference with qualified wording such as “typically,” “can,” or “is designed to.”       |
| Experience or recommendation | Make its situational nature visible: “consider this when…”, “can be a good fit for…”, or “in this kind of project…”. |

Do not turn a representative example, a personal observation, or a framework goal into a universal ecosystem claim.

## Use a problem-to-practice narrative

For beginner-oriented technical posts, use this progression:

1. **Reader problem** — establish empathy with a concrete, familiar situation.
2. **Mental-model shift** — introduce one focused thesis that reframes the problem.
3. **Progressive examples** — teach one concept and one ownership boundary at a time.
4. **Decision aid** — use a role table or comparison table only when it helps readers choose where something belongs.
5. **Tradeoffs** — state the learning cost, non-fit cases, and assumptions directly.
6. **Next step** — give readers a small experiment to try and a short list of authoritative further reading.

The article should answer both “what changes?” and “why should I care?” before adding advanced implementation detail.

When explaining architecture, prefer ownership questions over tool-name questions:

- Who owns this state or behavior?
- Who may depend on it?
- How long should it live?
- Which boundary owns caching, invalidation, persistence, or rendering?

This lets the article explain an architecture without becoming an API inventory.

## Explain Zova in its own model first

For Zova articles, begin with the controller / bean / IoC model before translating it into generic Vue terms. Vue comparisons are useful orientation aids, but they should not replace Zova's own concepts.

Keep these accuracy rules in view:

- Vue 3 provides Zova's reactive foundation.
- A controller field is not reactive merely because it is a TypeScript class field; it is reactive because Zova creates the controller as a framework-managed reactive bean.
- Controllers, beans, models, services, scopes, and TSX have distinct roles. Do not flatten them into synonyms for a composable or store.
- A Model is not simply “Zova's Pinia.” It can own query, mutation, cache, persistence, invalidation, and SSR-related state concerns.
- Discuss Cabloy Basic and Cabloy Start separately only when the UI layer, available suites, project assets, generated outputs, or edition-specific workflow affects the article.

For factual background, start from these guides:

- [Frontend Foundation](/frontend/foundation)
- [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers)
- [Zova vs Vue 3 Comparison](/frontend/zova-vs-vue3-comparison)
- [IoC and Beans](/frontend/ioc-and-beans)
- [Model Architecture](/frontend/model-architecture)

## Make examples earn their place

Use short examples that demonstrate one idea each. A helpful progression is:

1. page-local controller state and behavior;
2. a controller collaborating with an injected model or service;
3. an extraction that becomes justified as responsibility or reuse grows.

Every example should make the ownership boundary easier to see. If an example requires advanced lifecycle details, data contracts, or several framework concepts to understand, defer it or split it into smaller examples.

When a snippet has been simplified, say so. Do not present illustrative pseudocode as a copy-ready framework contract. Verify code, APIs, commands, and links against current sources before publishing.

Comparison tables should name the dimension being compared and describe a typical or default authoring model, not imply that every project in either ecosystem has identical structure.

## Keep the article balanced

Strong technical writing makes the boundary of its own recommendation clear.

Include the cost of the proposed approach. For example, a more structured controller/bean/model architecture may require authors to learn ownership, scope, and lifecycle rules; it may not be the most economical choice for a throwaway page or very small application.

Avoid framing flexible tools as defective. Explain the problem that emerges when complexity grows and the conditions under which a more explicit structure becomes valuable.

A practical article earns trust by telling readers both when to use an approach and when not to.

## Package articles consistently

Use a kebab-case topic directory under the local blog workspace:

```text
.assets/blogs/<topic-slug>/
```

The canonical article should begin with frontmatter that makes its purpose and distribution metadata explicit. Use the fields relevant to the publishing target:

```yaml
title:
titleEn:
subtitle:
summary:
tags:
slug:
date:
```

When a bilingual release is in scope, create semantic sibling articles such as `article-zh.md` and `article-en.md`. Translate the thesis, caveats, examples, and linked evidence faithfully, but adapt titles, idioms, reader framing, and platform copy to the language rather than translating word-for-word.

When distribution is requested, keep publishing material separate from the canonical article. A publishing kit can contain:

- recommended and alternate titles;
- subtitle, short summary, long summary, and platform abstract;
- tags and selected cover;
- social or platform-specific copy;
- editorial and accuracy notes.

Treat cover copy and images as publishing deliverables, not evidence for technical claims. Use a readable 1600 × 900 cover when a social-preview image is needed.

## Pre-publication checklist

Before publishing, verify all of the following:

- [ ] The opening names a real reader problem and does not begin as framework promotion.
- [ ] The thesis is narrow, accurate, and non-adversarial.
- [ ] Each factual claim has current source or first-party documentation support.
- [ ] Interpretations and recommendations are written as interpretations and recommendations.
- [ ] Examples are concise, current, and explicit about simplification where applicable.
- [ ] Comparison tables describe dimensions and typical models, not universal truths.
- [ ] Tradeoffs and non-fit situations are stated plainly.
- [ ] Terminology, edition notes, commands, URLs, and documentation links are current.
- [ ] Bilingual siblings and publishing assets are aligned when they are part of the requested deliverable.
- [ ] Further reading directs readers to authoritative documentation, including [Verification](/ai/verification) when the article describes a development workflow.

The goal is not merely a polished argument. It is to leave the reader with a trustworthy mental model and a safe, concrete next step.
