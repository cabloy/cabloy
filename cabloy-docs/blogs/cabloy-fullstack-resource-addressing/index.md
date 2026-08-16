---
title: 'Beyond IoC: CabloyJS as a Full-Stack Resource Addressing System'
titleZh: CabloyJS 强大之处不仅仅是 IoC，而是全栈资源的寻址体系
titleEn: 'Beyond IoC: CabloyJS as a Full-Stack Resource Addressing System'
subtitle: Follow one business capability from suite and module ownership through Beans, Resources, contracts, routes, state owners, and rendering metadata.
summary: IoC answers how code obtains runtime collaborators. In a full-stack system that evolves over time, the harder question is how a business capability remains identifiable across modules, backend resources, HTTP and OpenAPI contracts, routes, state ownership, and rendering. Using `training-student:student`, this article maps the constrained address spaces that let CabloyJS preserve one business meaning across Vona and Zova.
tags:
  - Cabloy
  - Vona
  - Zova
  - IoC
  - Fullstack Architecture
  - OpenAPI
  - TypeScript
  - Metadata-driven Architecture
slug: cabloy-fullstack-resource-addressing-en
cover: ./cover-en-v1.png
date: 2026-08-16
---

# Beyond IoC: CabloyJS as a Full-Stack Resource Addressing System

> IoC answers “how a runtime collaborator is obtained.” Full-stack resource addressing answers “which business capability this is, where it enters the system, how each layer locates it, and how it retains one business meaning.”

In a new application, tracing a feature is usually straightforward: find a component, follow an import to its request function, then follow that function to a backend Controller. As a system grows into multiple business domains and modules—with admin resource pages, Web self-service pages, SSR, OpenAPI contracts, and frontend rendering resources—the harder question is no longer simply whether a Service can be injected.

Consider a Student capability. Which business domain owns it? Which module implements it? How does the backend expose it? How does a menu enter it? How does a generic Resource page know what it is displaying? And how do frontend requests, Schemas, permissions, forms, caches, and custom rendering continue to refer to the same business meaning?

IoC matters to all of those questions: it provides object ownership, lifecycle, scope, and dependency resolution. But Cabloy becomes more interesting when IoC is not viewed in isolation. Together with suites, modules, Bean identities, business Resources, OpenAPI, route parameters, selector-backed Models, and rendering metadata, it forms a set of **constrained, mappable addressing coordinates**.

This is not one universal string that travels through every layer, nor is it zero-configuration magic. Vona and Zova have independent runtime containers. Backend and frontend cooperate through contracts, metadata, generated artifacts, and build outputs. This article uses “full-stack resource addressing system” as a lens for understanding Cabloy architecture—not as the name of an official API that replaces existing terminology.

---

## Separate IoC from addressing first

IoC asks a focused question: **who creates, owns, disposes of, and supplies a runtime capability?**

In Zova, a Bean may be held in the `sys`, `app`, or `ctx` container scope. Code can use `@Use` for injection or use containers and Scope for dependency lookup. This single model keeps state sharing, lifecycle behavior, and cross-module collaboration from drifting into unrelated mechanisms. [IoC and Beans](https://docs.cabloy.com/frontend/ioc-and-beans) explains that model in detail.

Addressing asks a broader question: **when one layer needs something, which identity expresses the target, who resolves it, and what kind of resource results?**

The current repository’s Student sample includes related but non-interchangeable values:

| Layer                                   | Example                            | Question answered                                             |
| --------------------------------------- | ---------------------------------- | ------------------------------------------------------------- |
| Business domain / suite                 | `a-training`                       | Which business domain owns this family of capabilities?       |
| Feature module                          | `training-student`                 | Which capability boundary owns Student?                       |
| Bean full name                          | `training-student.service.student` | Which runtime Service should the container resolve?           |
| Business Resource identity (onion name) | `training-student:student`         | Which module-qualified business Resource is under discussion? |
| Route entry                             | `:resource/:id/:formScene?`        | Which page scene is being entered?                            |
| HTTP API path                           | `/api/training/student`            | Where should the request be sent?                             |
| Resource Model selector                 | `training-student:student`         | Which Resource is the generic owner maintaining state for?    |
| Render resource                         | `training-student:formFieldLevel`  | Which frontend scene capability renders the field?            |

Think of these as different coordinate systems for the same place: an administrative region, street, building number, navigation entry, delivery address, and room number are related, but they solve different problems. Calling them all an “ID” hides the boundaries that matter.

Let us follow `training-student:student` through the system.

## Coordinate one: suites and modules answer “who owns it?”

Cabloy defines a **suite** as a business-domain composition boundary and a **module** as a feature implementation boundary within that domain. In other words:

- a suite answers, “which business domain does this group of capabilities belong to?”
- a module answers, “within that domain, which capability owns this implementation?”

In the Student sample, the domain is `a-training` and the module is `training-student`. Vona and Zova both have corresponding suite/module structures, so backend Controllers, Services, Models, Entities, and DTOs can evolve along the same business boundary as frontend pages, APIs, Models, and metadata. What is shared first is a **business coordinate**, not a block of memory shared by Node.js and the browser.

That is why a module name matters more than a directory position. Directories can be reorganized and implementation files can move, while a stable module namespace can continue to carry the logical identity of Services, Models, APIs, locales, errors, Resources, and frontend render resources. See [Suites and Modules](https://docs.cabloy.com/fullstack/suites-and-modules) for the boundary between suites and modules.

## Coordinate two: Bean full names and the Scope facade

At runtime, one module still needs to locate different families of capabilities. Most scene-based Vona Beans use this full identity:

```text
{moduleName}.{sceneName}.{beanName}
```

For example:

```text
training-student.controller.student
training-student.service.student
training-student.model.student
```

Here, `sceneName` distinguishes capability families such as controllers, services, and models. Two related facts must therefore remain separate:

- `training-student:student` is a module-qualified onion name;
- `training-student.service.student` is a Bean full name whose scene has already been specified.

An onion name is not merely a global Bean key with some characters omitted. A consumer must identify a scene such as `service`, `model`, or `controller` before the framework can resolve the corresponding full Bean name.

Business code usually does not need to write full names everywhere. Scope supplies a typed facade over module resources:

```ts
// Business orchestration in the current module
const students = await this.scope.model.student.select();

// A known cross-module target
const sku = await this.$scope.commerceCatalog.model.sku.getById(id);
```

Scope does not create another identity system. It raises a container-level full name into an everyday way to navigate a module’s resource catalog. Backend Scope can organize services, models, entities, configuration, locales, and errors; frontend Scope commonly exposes facades for configuration, constants, locales, errors, APIs, and API Schemas. Both [Vona Backend Foundation](https://docs.cabloy.com/backend/foundation) and [Zova Module Scope](https://docs.cabloy.com/frontend/module-scope) describe that division of responsibility.

There is an important limit: Scope lookup can resolve only resources from modules that have already been composed into the active application. A correct string does not install, load, or order an absent module. Module dependencies, suite/application composition, and runtime lookup are related but different concerns. The first establishes availability, ordering, and versioning; only then can the latter retrieve a resource from the composed modules.

## Coordinate three: `@Resource()` connects business identity to an HTTP contract

The Student backend Controller uses `@Controller('student')` and `@Resource()`. This is a trimmed version of the current implementation, retaining only the roles relevant here:

```ts
@Controller('student')
@Resource()
export class ControllerStudent extends BeanBase {
  @Web.get()
  @Api.body(DtoStudentSelectRes)
  async select(
    @Arg.filter(DtoStudentSelectReq) params: IQueryParams<ModelStudent>,
  ): Promise<DtoStudentSelectRes> {
    return await this.scope.service.student.select(params);
  }
}
```

This is not just a class with two decorators. It connects at least three responsibilities:

1. the Controller exposes an HTTP-facing action;
2. DTOs, Entity fields, and validation shape a machine-readable contract;
3. `@Resource()` registers the Controller’s onion identity as a business Resource.

When Vona processes the Controller decorator, it derives the onion name from the Bean full name, combines module and controller-path metadata to compute the API path, and records the resource-to-route mapping. `training-student:student` can therefore remain a stable business Resource identity, while the HTTP path is a transport address derived from backend route metadata.

Avoid saying:

```text
training-student:student === /api/training/student
```

A more accurate relationship is:

```text
training-student:student
  ──resolved through Resource registration and bootstrap metadata──▶
/api/training/student
```

The first expresses _which business Resource_ is involved; the second expresses _where the request goes_. This is one reason a Resource identity is often safer than scattering HTTP strings when frontend state, permissions, Schemas, or route context need to carry business meaning.

## Coordinate four: one field contract does not need to be copied into separate knowledge

The value of resource addressing is not limited to finding an endpoint. It also allows one business contract to be recognized and projected by different consumers.

A backend field can participate in:

1. validation;
2. OpenAPI generation;
3. form and table rendering;
4. serialization or desensitization.

Take `mobile` from the Student Entity in `training-student`. This is a trimmed version of the current source:

```ts
@Api.field(
  v.title($locale('Mobile')), // OpenAPI field title
  v.required(),               // validation
  v.min(11),                  // validation
  v.serializerReplace({       // response-time desensitization
    patternFrom: /^(\d{3})\d{4}(\d+)$/,
    patternTo: '$1****$2',
  }),
  ZovaRender.order(3),        // display order for generic table and field surfaces
)
mobile: string;
```

This declaration does not merely describe an isolated string. It is projected through DTOs and the Resource Schema: create, update, and view DTO layouts place `{ type: 'field', name: 'mobile' }` in Student Profile; the list-row Schema inherits the field and orders it through `order(3)`. With no specialized Renderer, the generic form uses the default `Input` and the generic table uses a plain-text Cell. A query response with `@Core.serializer()` returns `13812345678` as `138****5678`, while the persisted raw value remains unchanged.

| Capability                      | `mobile` declaration or projection                      | Consumer                                              |
| ------------------------------- | ------------------------------------------------------- | ----------------------------------------------------- |
| Validation                      | `v.required()` and `v.min(11)`                          | Request/DTO validation boundary                       |
| OpenAPI generation              | `@Api.field(...)`, title, and string Schema             | OpenAPI and downstream SDK/Schema consumers           |
| Form and table rendering        | DTO layout’s `field: mobile` plus `ZovaRender.order(3)` | Generic Resource UI’s default Input and text Cell     |
| Serialization / desensitization | `v.serializerReplace(...)`                              | Response serialization before data reaches the client |

If this field needs specialized controls instead of the default Renderer, it can additionally declare `ZovaRender.field('training-student:formFieldLevel', ...)` and `ZovaRender.cell('training-student:level', ...)`, as `level` does in the same Entity. The point is not that every property must carry all four concerns or use a custom component. The point is that these concerns can be composed around the same field contract when they apply.

That does not mean each field automatically grows a complete UI, nor that every presentation decision belongs in the backend. It means the field’s business meaning, data contract, and permitted exposure do not have to be copied into backend DTOs, frontend request types, form rules, table columns, and response post-processing—and then manually kept aligned.

In this **forward contract chain**, backend Controllers, DTOs, Entities, and validation rules are the source of truth. Vona generates OpenAPI; Zova then generates or consumes SDK/Schema contract material. When a backend contract changes, the recommended path is to propagate that truth forward rather than hand-edit multiple frontend copies. [Backend OpenAPI to Frontend SDK](https://docs.cabloy.com/fullstack/openapi-to-sdk) and [One Contract Surface, Four Uses](https://docs.cabloy.com/fullstack/tutorial-6-one-contract-four-uses) describe the boundary of that chain.

## Coordinate five: routes choose a UI scene; Resource identities choose business context

The generic Resource page makes clear why a page address and a business Resource identity need to remain separate.

`rest-resource` defines generic routes with dynamic parameters:

```ts
export const routes: IModuleRoute[] = [
  { name: 'resource', path: ':resource', component: ZPageResource },
  { name: 'entryCreate', path: ':resource/create', component: ZPageEntryCreate },
  { name: 'entry', path: ':resource/:id/:formScene?', component: ZPageEntry },
];
```

Dynamic-parameter routes explicitly declare `name`, which establishes a type contract for page parameters. The route answers whether the active scene is a resource list, a create form, or a form scene for one record. The route itself does not yet know the business meaning of Student, Course, or any other Resource.

The Student SSR menu supplies that context:

```ts
@SsrMenu({
  items: {
    student: {
      link: 'presetResource',
      meta: {
        params: {
          resource: 'training-student:student',
        },
      },
    },
  },
})
export class SsrMenuStudent extends BeanBase {}
```

The menu does not directly render a Student page, nor does it grant authorization. It passes the `resource` parameter to the predefined generic Resource route:

```text
SSR menu
  → presetResource
  → :resource route parameter
  → Page Controller’s $params.resource
```

The URL and route locate a page scene; `$params.resource` brings in business Resource context. Route names, route parameters, menu metadata, and permissions are still four separate objects that must each be verified.

## Coordinate six: the Resource identity becomes a selector-backed Model owner

Once the generic page receives its parameter, it does not duplicate a page Controller for every Resource. It injects the current identity into one generic Model:

```ts
@Controller()
export class ControllerPageResource extends BeanControllerPageBase {
  @Use({ beanFullName: 'rest-resource.model.resource' })
  get $$modelResource(): ModelResource {
    return usePrepareArg(this.$params.resource, true);
  }

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.$$modelResource.apiSchemasSelect.sdk);
  }
}
```

There are two addresses at different levels:

```text
Generic Model Bean: rest-resource.model.resource
Current selector: training-student:student
```

`ModelResource` is registered with `enableSelector: true`. It is not a vague global CRUD singleton; it is a selector-backed owner. `ModelResource(training-student:student)` and `ModelResource(other-module:other-resource)` can share an implementation while owning distinct Resource contexts.

During initialization, the owner requests bootstrap information with the Resource identity and stores the resolved `resourceApi`. It then centralizes permissions, form providers, view/create/update/filter/row/page Schemas, and list/item query and mutation capabilities in the same owner.

The conceptual chain is:

```text
$params.resource
  → ModelResource(resource selector)
  → bootstrap(resource)
  → resourceApi
  → schemas / permissions / forms / queries / mutations
```

This has two practical benefits:

- a page does not need to copy the same API path, Schema-loading rule, permission lookup, and cache-invalidation policy into multiple Controllers;
- a custom operation for the same Resource can be a thin semantic facade that reuses the existing Resource owner instead of creating a competing query-cache owner.

For example, a `training-student` frontend Model can initialize the generic owner with `training-student:student`, then add semantic entry points for business actions such as `summary(id)` or `deleteForce(id)` while reusing that owner’s item query, mutation, and invalidation boundary.

One more distinction matters: a call-site value such as `['select', ...]` or `['item', id, action]` is only a logical query key. The effective cache identity also incorporates Model Bean identity and selector. A short query key is therefore not an address that is globally unique across the application. [Model Resource Internals Deep Dive](https://docs.cabloy.com/frontend/model-resource-internals-deep-dive) and [Model State Guide](https://docs.cabloy.com/frontend/model-state-guide) explain this owner/state identity layer.

## Coordinate seven: Schema metadata selects concrete UI capabilities

A generic Resource Page stays deliberately thin: it loads the current Resource Schema, reads `schemaRow?.rest?.blocks`, and renders what the block metadata specifies. The page shell owns the question, “what is the current context?” Schema and metadata answer, “which blocks should this Resource compose in this scene?”

Where does `schemaRow?.rest?.blocks` come from? It is not an array assembled ad hoc by a frontend page. For the list page, the current Student sample defines it in the **list-row DTO** through `@Dto({ blocks })`:

```tsx
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { ModelStudent } from '../model/student.ts';

@Dto<IDecoratorDtoOptions>({
  blocks: [
    ZovaRender.block('basic-page:blockPage', {
      blocks: [
        ZovaRender.block('basic-page:blockFilter', {
          formFieldLayout: { inline: true },
          // The full sample also declares the filter form layout here.
        }),
        ZovaRender.block('basic-page:blockToolbarBulk', {
          actions: [ZovaRender.tableActionBulk('basic-table:actionCreate')],
        }),
        ZovaRender.block('basic-page:blockTable'),
        ZovaRender.block('basic-page:blockPager'),
      ],
    }),
  ],
})
export class DtoStudentSelectResItem extends $Dto.get(() => ModelStudent) {
  // List-row fields and each field’s ZovaRender.* metadata.
}
```

This code is deliberately abbreviated. It retains the important structure: the root `basic-page:blockPage` composes registered frontend block resources for filtering, bulk toolbar actions, a table, and a pager. It does not mean every DTO should own these blocks, nor that the frontend implementations of those blocks live in Vona. The DTO declares, in backend-generated contract metadata, which rendering capabilities the current Resource list page should select.

The full chain that explains `blocks` is:

```text
DtoStudentSelectResItem’s @Dto({ blocks })
  → Vona merges blocks into the DTO OpenAPI metadata as rest.blocks
  → the GET select response’s data.list.items references the row DTO Schema
  → ModelResource.apiSchemasSelect.row resolves as schemaRow
  → schemaRow?.rest?.blocks
  → ControllerPageResource calls ZovaJsx.render(...) for each block
```

In other words, `schemaRow` is the current select-response row Schema, and `rest.blocks` is the page-composition declaration attached to that Schema. `basic-page:blockTable` in `ZovaRender.block('basic-page:blockTable')` is another module-qualified render-resource identity, resolved by an implementation registered on the Zova side. The backend selects it; the frontend executes it. Neither side directly calls the other side’s objects across processes.

Cabloy resource addressing therefore does not stop at an API. Table cells, form fields, image scenes, and Behaviors can also be selected through module-qualified, scene-aware frontend resource identities. Field metadata can, for example, refer to `training-student:formFieldLevel`, which a registered frontend capability resolves and renders.

This does not mean backend code executes frontend components. More precisely, backend contracts or metadata can declare which frontend rendering resource should be selected at a point; the frontend still owns the renderer implementation and runtime. Frontend-owned facts such as routes, components, icons, table cells, and form fields also have a reverse contract handoff: refresh the frontend metadata/build output first, then let Vona consume the synchronized local dependency result. [Frontend Metadata Back to Backend](https://docs.cabloy.com/fullstack/frontend-metadata-to-backend) describes that reverse chain.

The two directions are distinct:

```text
Forward: Vona Controller / DTO / Entity
  → OpenAPI
  → Zova SDK / Schema / API consumers

Reverse: Zova route / component / renderer / metadata
  → frontend metadata or build output
  → Vona-side metadata, tooling, and type consumers
```

Together they support full-stack collaboration, but neither means that saving arbitrary source on one side automatically teaches the other side everything. Each chain has its own source of truth, generation step, shared handoff, and verification points.

## IoC’s actual position on this map

Saying Cabloy is “more than IoC” does not diminish IoC. On the contrary, IoC is the runtime foundation that lets many of these coordinates work:

- a Bean’s container scope determines lifecycle and sharing boundaries;
- `@Use` and `beanFullName` support explicit, resolvable collaboration;
- Scope lets everyday business code access capabilities through a module-resource facade;
- parameterized injection lets generic `ModelResource` be reused with the current Resource selector;
- lifecycle and Model query/cache mechanisms turn “a resource was found” into “this owner is responsible for its state.”

But treating this only as convenient dependency injection misses the larger collaboration structure. Business domains and modules assign capabilities an owner first; Bean/Scope gives runtime capabilities a resolution boundary; Resource and OpenAPI project a data contract for transport; route parameters bring context into a page; selectors and effective query keys isolate state to the current Resource.

> IoC makes a capability obtainable. Resource addressing makes that capability retain its business meaning after it crosses modules, contracts, routes, state, and rendering.

## When this is useful—and when it should not be forced

A multi-layer addressing system has a learning cost. Developers need to distinguish suites, modules, Beans, scenes, Resources, routes, selectors, Schemas, and generated artifacts. When debugging, they must begin from the correct coordinate instead of only searching for a component file.

It is usually most valuable for systems that evolve over time, have many modules or consumers, or need a clear contract loop:

| Situation                                                                       | Prefer                                    | Why                                                                              |
| ------------------------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------- |
| One-off page-local UI state                                                     | Page/controller-local state               | There is no need to introduce reusable Resource semantics.                       |
| Reusable asynchronous, persistent, or cross-page state                          | Model Bean                                | The state needs an explicit identity, lifecycle, and cache/persistence boundary. |
| An Admin-style entity with Schemas, permissions, forms, and list/item lifecycle | Existing `ModelResource` or a thin facade | Reuse one Resource owner and a unified invalidation policy.                      |
| A custom operation on the same Resource                                         | A semantic facade on the existing owner   | Avoid competing request, state, and cache owners.                                |
| A distinct Web self-service experience                                          | Dedicated API/DTOs, Model, and page state | One persisted Resource does not require one frontend experience.                 |
| A cross-cutting rule around an existing rendering target                        | Behavior                                  | This is a rendering-boundary concern, not business Resource ownership.           |

The final two rows are especially important. One business Resource can share a domain and persistence boundary between Admin and Web while using different API/DTO contracts, server-side scopes, state owners, and page architecture. Good resource addressing does not force everything into one generic CRUD page. It lets each boundary state clearly who it serves.

## Trace one Resource with seven questions

To validate this mental model in an existing project, choose any registered Resource and follow it through these questions:

1. Which suite/module owns it?
2. What is its business Resource identity?
3. Which Controller/DTO/Entity brings it into the backend contract?
4. Which menu, route name, and parameters bring it into a page?
5. Which Bean/Model owner receives it with which selector?
6. After bootstrap, where do `resourceApi`, Schemas, permissions, and render metadata come from?
7. Should this change follow the forward chain, the reverse chain, or first investigate generated/local dependency drift?

The point is not to memorize more names. It is to break “why does this page work?” into a sequence of verifiable resolutions. Instead of asking only, “where is this component?”, you can ask: **what is this Resource’s business identity, how is it mapped at this layer, and who owns its state and meaning?**

## Conclusion

Cabloy does not rule every layer with one global ID. A more accurate description is that it uses the module as an important naming anchor and connects multiple address spaces—suite/module ownership, Bean scenes, Scope, business Resources, OpenAPI, route parameters, Model selectors, query caches, and render metadata—into a traceable full-stack chain.

IoC is one runtime foundation of that chain, but not the whole chain. The engineering benefit is that a business capability can cross backend and frontend, generated artifacts, and distinct runtimes without degrading into scattered URLs, repeated imports, hand-written requests, and disconnected state. Each layer retains its own responsibility and address while still mapping to the same business meaning.

## Further reading

### Concepts and workflows

- [Cabloy: Suites and Modules](https://docs.cabloy.com/fullstack/suites-and-modules)
- [Cabloy: Vona Backend Foundation](https://docs.cabloy.com/backend/foundation)
- [Cabloy: Zova IoC and Beans](https://docs.cabloy.com/frontend/ioc-and-beans)
- [Cabloy: Zova Module Scope](https://docs.cabloy.com/frontend/module-scope)
- [Cabloy: Backend OpenAPI to Frontend SDK](https://docs.cabloy.com/fullstack/openapi-to-sdk)
- [Cabloy: Frontend Metadata Back to Backend](https://docs.cabloy.com/fullstack/frontend-metadata-to-backend)
- [Cabloy: Model Resource Internals Deep Dive](https://docs.cabloy.com/frontend/model-resource-internals-deep-dive)

### Source samples verified for this article

The implementation-level statements in this article were verified against Cabloy Basic revision [`e8994f63dfffc7be2657cc4c7cb6687a89b63dec`](https://github.com/cabloy/cabloy/tree/e8994f63dfffc7be2657cc4c7cb6687a89b63dec).

- [Student Resource Controller](https://github.com/cabloy/cabloy/blob/e8994f63dfffc7be2657cc4c7cb6687a89b63dec/vona/src/suite/a-training/modules/training-student/src/controller/student.ts)
- [Student Entity field-contract sample](https://github.com/cabloy/cabloy/blob/e8994f63dfffc7be2657cc4c7cb6687a89b63dec/vona/src/suite/a-training/modules/training-student/src/entity/student.tsx)
- [Student SSR menu](https://github.com/cabloy/cabloy/blob/e8994f63dfffc7be2657cc4c7cb6687a89b63dec/vona/src/suite/a-training/modules/training-student/src/bean/ssrMenu.student.ts)
- [Vona Resource-to-route mapping](https://github.com/cabloy/cabloy/blob/e8994f63dfffc7be2657cc4c7cb6687a89b63dec/vona/src/suite-vendor/a-vona/modules/a-web/src/lib/decorator/bean.ts)
- [Generic Resource routes](https://github.com/cabloy/cabloy/blob/e8994f63dfffc7be2657cc4c7cb6687a89b63dec/zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/routes.ts)
- [Generic Resource page controller](https://github.com/cabloy/cabloy/blob/e8994f63dfffc7be2657cc4c7cb6687a89b63dec/zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/resource/controller.tsx)
- [ModelResource owner](https://github.com/cabloy/cabloy/blob/e8994f63dfffc7be2657cc4c7cb6687a89b63dec/zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts)
- [Student select-row DTO blocks](https://github.com/cabloy/cabloy/blob/e8994f63dfffc7be2657cc4c7cb6687a89b63dec/vona/src/suite/a-training/modules/training-student/src/dto/studentSelectResItem.tsx)
- [Vona DTO blocks to OpenAPI metadata bridge](https://github.com/cabloy/cabloy/blob/e8994f63dfffc7be2657cc4c7cb6687a89b63dec/vona/src/suite-vendor/a-vona/modules/a-web/src/lib/decorator/bean.ts)
