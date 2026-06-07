# Backend (Vona)

This page is the backend hub for contributors who are documenting, designing, or extending backend work in the Cabloy repository.

Vona is the backend half of the Cabloy fullstack architecture.

## What Vona is responsible for

- application startup and runtime composition
- IOC and AOP infrastructure
- controller, service, model, entity, DTO, and AOP workflows
- authentication, captcha, user access, menus, events, logging, upload, mail, serialization, ORM, caching, startup, election, queues, workers, schedules, broadcast, redlock, and other backend infrastructure
- OpenAPI output used by frontend SDK-related workflows

## How to approach backend work

For contributor and automation workflows in this repository, prefer this order:

1. inspect the root `package.json` and `npm run vona` entrypoint
2. inspect Vona CLI command families such as `create:*`, `init:*`, `tools:*`, and `bin:*`
3. inspect the current module or suite layout before creating new files manually
4. use public docs for user-facing guidance and `.docs-internal/` for maintainer rationale

## Backend reading paths

Use this page as the main backend hub, then choose the family that matches your task.

### Architecture spine

Start here when you need the core backend mental model first:

- [Backend Foundation](/backend/foundation)
- [Backend Essentials](/backend/backend-essentials)
- [Backend CLI](/backend/cli)
- [Service Guide](/backend/service-guide)
- [Package Map](/reference/package-map)

This gives the architectural vocabulary for concepts such as bean, scope, suite, module, package, and backend access patterns.

### Contract and data family

Use this path when the task is about the backend contract loop or ORM-backed backend data design:

- [Controller Guide](/backend/controller-guide)
- [Validation Guide](/backend/validation-guide)
- [DTO Guide](/backend/dto-guide)
- [Entity Guide](/backend/entity-guide)
- [Model Guide](/backend/model-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [ORM Guide](/backend/orm-guide)

### Runtime and distributed family

Use this path when the task is about runtime shape, startup, instances, workers, or distributed execution:

- [Runtime and Flavors](/backend/runtime-and-flavors)
- [Config Guide](/backend/config-guide)
- [Backend Startup Guide](/backend/startup-guide)
- [Multi-Instance and Instance Resolution](/backend/multi-instance-and-instance-resolution)
- [Worker Guide](/backend/worker-guide)
- [Election Guide](/backend/election-guide)
- [Queue Guide](/backend/queue-guide)
- [Broadcast Guide](/backend/broadcast-guide)
- [Schedule Guide](/backend/schedule-guide)
- [Redlock Guide](/backend/redlock-guide)

### Reference and support pages

Use these when you need repo structure, scripts, or command context around the backend families:

- [Backend Quickstart](/backend/quickstart)
- [Backend Scripts](/backend/scripts)
- [Package Map](/reference/package-map)
- [Backend Directory Structure](/reference/backend-directory-structure)

## Edition impact

Most Vona concepts are shared between Cabloy Basic and Cabloy Start.

Differences usually appear when backend modules integrate with edition-specific frontend modules, assets, routes, or generated outputs. When that happens, explain the backend concept once and annotate the edition-specific integration points explicitly.

## Suggested next runtime topics

If your task is already inside the runtime and distributed family, read these guides together in roughly this order:

- [Runtime and Flavors](/backend/runtime-and-flavors)
- [Config Guide](/backend/config-guide)
- [Backend Startup Guide](/backend/startup-guide)
- [Multi-Instance and Instance Resolution](/backend/multi-instance-and-instance-resolution)
- [Worker Guide](/backend/worker-guide)
- [Election Guide](/backend/election-guide)
- [Queue Guide](/backend/queue-guide)
- [Broadcast Guide](/backend/broadcast-guide)
- [Schedule Guide](/backend/schedule-guide)
- [Redlock Guide](/backend/redlock-guide)
