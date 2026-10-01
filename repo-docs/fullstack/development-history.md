# CabloyJS Development History

CabloyJS has evolved from a JavaScript-based Node.js fullstack framework into a TypeScript-based system built on Vona and Zova. Three milestones explain the transition.

## 2016 onward: V1–V4

Development began in 2016. Across V1, V2, V3, and V4, CabloyJS refined its fullstack architecture and accumulated the conventions that led some developers to describe it as a “textbook-like framework.”

Feedback also pointed toward a new direction: TypeScript support and a clearer separation between frontend and backend development. These ideas shaped the next major redesign.

## 2023: The V5 redesign

In 2023, work began on a redesigned V5 architecture. Rather than incrementally adapting the earlier JavaScript framework, the project adopted TypeScript and a frontend/backend separation model built around two frameworks:

- **ZovaJS** provides the frontend framework. Its programming model brings together Vue 3 reactivity, TSX authoring, and inversion of control (IoC).
- **VonaJS** provides the backend framework and fullstack integration. It connects backend contracts with frontend applications across SSR, SPA, Web, and Admin use cases.

The two layers remain connected through [bidirectional contract workflows](/fullstack/contract-loop-playbook), including backend OpenAPI contracts consumed by the frontend and frontend metadata consumed by backend tooling.

## April 13, 2026: V5 release

ZovaJS V5 and VonaJS V5 were officially released on April 13, 2026. Built on these foundations, CabloyJS V5 continues the goal behind the “textbook-like framework” description: make fullstack architecture understandable, consistent, and productive in day-to-day development.

For the current architecture and edition-specific project baselines, continue with the [Fullstack Introduction](/fullstack/introduction) and [Editions Overview](/editions/overview).
