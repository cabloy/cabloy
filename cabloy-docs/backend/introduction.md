# Backend (Vona)

Vona is the backend half of the Cabloy fullstack architecture.

## What Vona is responsible for

- application startup and runtime composition
- IOC and AOP infrastructure
- controller, service, model, entity, DTO, and AOP workflows
- authentication, captcha, user access, menus, events, logging, upload, mail, serialization, ORM, caching, startup, election, queues, workers, schedules, broadcast, redlock, and other backend infrastructure
- OpenAPI output used by frontend SDK-related workflows

## How to approach backend work

When documenting or automating backend tasks, prefer this order:

1. inspect the root `package.json` and `npm run vona` entrypoint
2. inspect Vona CLI command families such as `create:*`, `init:*`, `tools:*`, and `bin:*`
3. inspect the current module or suite layout before creating new files manually
4. use public docs for user-facing guidance and `.docs-internal/` for maintainer rationale

## Edition impact

Most Vona concepts are shared between Cabloy Basic and Cabloy Start.

Differences usually appear when backend modules integrate with edition-specific frontend modules, assets, routes, or generated outputs. When that happens, explain the backend concept once and annotate the edition-specific integration points explicitly.

## Suggested next runtime topics

For backend runtime and distributed coordination, read these guides together:

- [Runtime and Flavors](/backend/runtime-and-flavors)
- [Backend Startup Guide](/backend/startup-guide)
- [Election Guide](/backend/election-guide)
- [Queue Guide](/backend/queue-guide)
- [Broadcast Guide](/backend/broadcast-guide)
- [Worker Guide](/backend/worker-guide)
- [Schedule Guide](/backend/schedule-guide)
- [Redlock Guide](/backend/redlock-guide)
