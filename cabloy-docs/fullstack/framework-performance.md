# Framework Performance

Cabloy is designed to stay fast where real systems usually become fragile: under growing business complexity.

Its performance story is not only about looking fast in simplified demos. It is about keeping real business systems maintainable, expressive, and performant as they grow in size and complexity.

This page explains that philosophy first, then shows a concrete runtime example from an internally generated project.

## Philosophy

Many frameworks highlight performance with simplified cases, but real systems face a different challenge: as business complexity grows, performance work can easily turn into a growing pile of special-case optimization code.

Cabloy takes a different direction.

At the framework level, the goal is not only to make one isolated path faster. The goal is to let teams build large-scale systems in a way that stays elegant, maintainable, and performance-aware over time.

That philosophy comes from the earlier Vona design direction:

- performance should be considered under real business complexity
- framework support should reduce the amount of ad hoc optimization code that teams need to write themselves
- maintainability and performance should improve together instead of fighting each other

In other words, Cabloy does not treat performance as a last-minute patch. It treats performance-related capability as part of the framework design.

## What supports this philosophy

A practical example is **Vona** on the backend side.

Vona moves caching into the framework core instead of treating caching as something every project must rebuild from scratch. That includes framework-managed cache behavior such as:

- entity cache
- query cache
- broader cache-centered workflow support for complex data access paths

This matters because large systems usually do not become slow only because one query is inefficient. They become slow because optimization logic gets scattered across the codebase and becomes difficult to keep correct.

By making caching first-class, Cabloy helps teams keep performance work closer to the framework model and farther away from repetitive custom optimization code.

For the current public explanation of this backend capability, see [Cache Guide](/backend/cache-guide).

## Runtime example

This is the kind of result Cabloy is designed to support: a framework that stays operationally calm even when the system keeps running for long periods.

One internally generated project was kept running continuously for **33 hours**. At one representative PM2 snapshot, the process looked like this:

```text
┌────┬─────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name            │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼─────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ cabloy_store    │ default     │ N/A     │ cluster │ 226947   │ 33h    │ 17   │ online    │ 0%       │ 401.9mb  │ ubuntu   │ disabled │
└────┴─────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

For this 33-hour continuous run, the observed result was **0 memory leak**.

The value of this example is not that it is a synthetic micro-benchmark. The value is that it reflects a real long-running project process with a clear, inspectable runtime footprint.

## How to read this example

This example is meant to show a real runtime stability observation from an internal project.

It should not be read as:

- a formal benchmark against other frameworks
- a universal guarantee for every Cabloy workload
- proof that every deployment will show the same memory profile

Actual memory usage still depends on factors such as:

- enabled modules and features
- request traffic patterns
- data volume
- deployment topology
- operational configuration

So the point of the example is not that one PM2 snapshot explains everything. The point is that Cabloy’s framework design is intended to support long-running, real business systems without forcing teams into constant performance firefighting.

## Where to go next

If you want to continue from the performance philosophy into the concrete framework mechanisms behind it, these pages are the best next stops:

- [Cache Guide](/backend/cache-guide) — how Vona makes caching first-class in the backend model
- [Vona + Zova Integration](/fullstack/vona-zova-integration) — how the backend and frontend stay aligned as one framework system
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk) — one example of how Cabloy reduces repetitive cross-stack work at scale
