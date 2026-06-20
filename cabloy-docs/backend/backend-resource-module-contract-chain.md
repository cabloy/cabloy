# Backend Resource/Module Contract Chain

This page is a focused deep dive into one narrow backend question:

> how does one real Vona backend module become a working contract chain from generated metadata through controller, service, model, entity, and DTO layers?

It uses the current `training-student` module as the specimen.

Use this page together with:

- [Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap)
- [Vona Source Reading Map](/backend/vona-source-reading-map)
- [Controller Guide](/backend/controller-guide)
- [Service Guide](/backend/service-guide)
- [Model Guide](/backend/model-guide)
- [Entity Guide](/backend/entity-guide)
- [DTO Guide](/backend/dto-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [CRUD Workflow](/backend/crud-workflow)

> [!TIP]
> **Backend contract-reading path**
>
> 1. **[Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap)** — choose the right backend reading cluster
> 2. **[Vona Source Reading Map](/backend/vona-source-reading-map)** — find the shortest file-order path into source
> 3. **[Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)** — walk one concrete module through the whole contract chain
>
> **You are here:** step 3.
> **Previous recommended pages:** [Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap) and [Vona Source Reading Map](/backend/vona-source-reading-map).

## Why this page exists

The current backend docs already explain each layer well:

- controllers define HTTP-facing contracts
- services orchestrate business flow
- models own persistence-facing behavior
- entities shape the field contract
- DTOs shape named request and response artifacts

The new backend roadmap and source-reading map also help readers choose the right topic cluster and source-file order.

What was still missing was one page that stays narrow and shows how those layers connect in one real module.

This page fills that gap.

It is not a replacement for the existing backend guides. It is a specimen page that shows how the handoffs connect in one concrete thread.

## Shortest accurate mental model

The `training-student` contract chain is easiest to read like this:

1. `src/index.ts` exposes the module reading entry
2. `src/.metadata/index.ts` is the generated contract-registration hub
3. `controller/student.ts` defines the resource-facing HTTP actions
4. `service/student.ts` orchestrates the business handoff
5. `model/student.ts` binds persistence behavior to the entity
6. `entity/student.tsx` defines the shared field contract
7. `dto/*.tsx` defines the named transport artifacts around that contract

The most important reading trick is this:

> do not skip `.metadata/index.ts`.

For this kind of backend source-reading task, the generated metadata file is part of the readable contract surface, not only an implementation detail.

## Source-confirmed reading path

Read the `training-student` module in this order:

1. `vona/src/suite/a-training/modules/training-student/src/index.ts`
2. `vona/src/suite/a-training/modules/training-student/src/.metadata/index.ts`
3. `vona/src/suite/a-training/modules/training-student/src/controller/student.ts`
4. `vona/src/suite/a-training/modules/training-student/src/service/student.ts`
5. `vona/src/suite/a-training/modules/training-student/src/model/student.ts`
6. `vona/src/suite/a-training/modules/training-student/src/entity/student.tsx`
7. `vona/src/suite/a-training/modules/training-student/src/dto/studentCreate.tsx`
8. `vona/src/suite/a-training/modules/training-student/src/dto/studentUpdate.tsx`
9. `vona/src/suite/a-training/modules/training-student/src/dto/studentView.tsx`
10. `vona/src/suite/a-training/modules/training-student/src/dto/studentSelectReq.tsx`
11. `vona/src/suite/a-training/modules/training-student/src/dto/studentSelectResItem.tsx`
12. `vona/src/suite/a-training/modules/training-student/src/dto/studentSelectRes.tsx`

That order starts from the public module entry, foregrounds the generated registration hub early, then descends through the authored runtime layers and the named DTO artifacts.

## Contract chain by layer

### 1. `src/index.ts`: the public module entry

`vona/src/suite/a-training/modules/training-student/src/index.ts` is intentionally small:

- it re-exports `./.metadata/locales.ts`
- it re-exports `./.metadata/index.ts`

That tells you something important immediately.

The generated metadata layer is not hidden away from the module’s reading path. It is part of the public module surface that other code and readers are expected to consume.

For source reading, that means:

- start at `index.ts` to confirm the module entry
- then move into `.metadata/index.ts` before diving straight into controller/service/model files

### 2. `src/.metadata/index.ts`: the generated contract-registration hub

This is the key file for understanding the full chain.

`vona/src/suite/a-training/modules/training-student/src/.metadata/index.ts` shows, in one generated surface, how the module is registered across several backend layers at once.

Representative things it exposes include:

- entity registrations such as `IEntityRecord` and `ITableRecord`
- model registrations such as `IModelRecord` and `IModelClassRecord`
- service registrations such as `IServiceRecord`
- controller registrations such as `IControllerRecord`
- DTO registrations such as `IDtoRecord`
- meta registrations such as `IMetaRecord`
- API path typings such as `IApiPathGetRecord`, `IApiPathPostRecord`, `IApiPathPatchRecord`, and `IApiPathDeleteRecord`
- resource registration through `IResourceRecord`
- scope wiring through `IBeanScopeRecord`, `IBeanScopeContainer`, and the module scope class

This matters because the contract chain is not only a call stack.

It is also a generated registration system that ties together:

- bean names
- onion names
- typed scope access
- route paths
- resource ownership
- DTO availability

A practical reading takeaway is:

> if you want to understand how the module is wired as a backend contract surface, `.metadata/index.ts` is the fastest summary file in the module.

### 3. `controller/student.ts`: the HTTP and resource-facing entry layer

`vona/src/suite/a-training/modules/training-student/src/controller/student.ts` is the HTTP-facing contract surface.

Representative source facts from this file:

- the class is decorated with `@Controller<IControllerOptionsStudent>('student')`
- the class is also decorated with `@Resource()`
- CRUD actions are declared with `@Web.post()`, `@Web.get()`, `@Web.get(':id')`, `@Web.patch(':id')`, and `@Web.delete(':id')`
- request shapes use `@Arg.body(...)`, `@Arg.param(...)`, and `@Arg.filter(...)`
- actions delegate to `this.scope.service.student`

This is the layer where several concerns meet in one place:

- route and action declaration
- request extraction and typing
- response contract exposure
- handoff to service orchestration

A good reading pattern here is:

- read the action signatures first
- note which DTOs or typed parameters they reference
- then follow the delegation to the service layer

### 4. `service/student.ts`: the orchestration handoff layer

`vona/src/suite/a-training/modules/training-student/src/service/student.ts` is intentionally thin.

Representative source facts:

- the class is decorated with `@Service()`
- `create(...)` delegates to `this.scope.model.student.insert(...)`
- `select(...)` delegates to `this.scope.model.student.selectAndCount(...)`
- `view(...)` delegates to `this.scope.model.student.getById(...)`
- `update(...)` delegates to `this.scope.model.student.updateById(...)`
- `delete(...)` delegates to `this.scope.model.student.deleteById(...)`

That thinness is part of the point.

This specimen makes the layer boundary very easy to see:

- controller owns the HTTP-facing resource surface
- service owns the business-oriented handoff
- model owns the persistence-facing behavior

So even though this particular service is small, it is still important for reading the chain correctly.

### 5. `model/student.ts`: the persistence binding

`vona/src/suite/a-training/modules/training-student/src/model/student.ts` is also compact.

Representative source fact:

- `@Model<IModelOptionsStudent>({ entity: EntityStudent })`

This is the bridge from service-layer orchestration into entity-backed ORM behavior.

The main point here is not complexity. It is ownership.

The file shows that persistence behavior is not encoded in the controller and not declared ad hoc in the service. It is bound through the model/entity pairing.

That is why this layer belongs in the contract chain even when the class body is short.

### 6. `entity/student.tsx`: the shared field-contract surface

`vona/src/suite/a-training/modules/training-student/src/entity/student.tsx` is where field structure, validation-facing metadata, OpenAPI-facing metadata, and UI-related render metadata meet.

Representative source facts:

- the entity is decorated with `@Entity<IEntityOptionsStudent>('trainingStudent', ...)`
- base field metadata is configured in `fields`
- domain fields such as `name`, `description`, and `level` use `@Api.field(...)`
- `studentLevelSchema` and `studentLevelItems` define a concrete field-level contract for the `level` field
- `ZovaRender.field(...)` and `ZovaRender.cell(...)` are attached directly to the field metadata

This is a strong example of the Cabloy contract loop in practice.

The same field surface participates in:

- validation-oriented structure
- OpenAPI metadata
- named DTO derivation
- downstream UI/render metadata

A practical reading takeaway is:

> the entity is not only a persistence record. It is one of the main shared contract surfaces in the backend thread.

### 7. `dto/*.tsx`: the named transport artifacts

The DTO files turn the shared field contract into named request and response artifacts for specific operations.

A useful way to read the `training-student` DTO family is by operation type.

#### Create / update / view DTOs

These files are the clearest operation-facing transport artifacts:

- `dto/studentCreate.tsx`
- `dto/studentUpdate.tsx`
- `dto/studentView.tsx`

Representative source facts:

- `DtoStudentCreate` extends `$Dto.create(() => ModelStudent)`
- `DtoStudentUpdate` extends `$Dto.update(() => ModelStudent)`
- `DtoStudentView` extends `$Dto.get(() => ModelStudent)`

These files show that named DTO artifacts do not have to restate every field manually when the framework can derive the contract shape from the model/entity thread.

#### Query and list-response DTOs

For the read/list side, these files are especially important:

- `dto/studentSelectReq.tsx`
- `dto/studentSelectResItem.tsx`
- `dto/studentSelectRes.tsx`

`studentSelectReq.tsx` is a strong specimen because it shows query/filter contract shaping that is more than a bare type alias.

Representative source facts:

- it uses `@Dto({ openapi: { filter: { table: 'trainingStudent' } }, fields: { ... } })`
- it extends `$Dto.queryPage(EntityStudent, ['name', 'level', 'createdAt'])`
- `level` uses a preprocess step so string query input can be normalized before schema validation
- `createdAt` uses `v.filterTransform('a-web:dateRange')`

That makes it a useful example of how request/filter contracts can:

- stay tied to entity-derived structure
- still add operation-specific filter shaping and transform behavior

`studentSelectResItem.tsx` is useful for a different reason.

It shows that a list-row response DTO can still participate in the broader contract loop through response-facing metadata such as:

- block metadata
- table action metadata
- row action render hints

Finally, `studentSelectRes.tsx` shows the aggregate response wrapper for the list result:

- `DtoStudentSelectRes` extends `$Dto.listAndCount(DtoStudentSelectResItem)`

So the list-response chain is not one file only. It is:

1. one query/filter request DTO
2. one row-item DTO
3. one list-and-count response DTO

## What this page does not re-explain

This page deliberately does **not** re-teach the full semantics of each layer.

For the broader explanations, continue with:

- [Controller Guide](/backend/controller-guide) for controller decorators and route behavior
- [Service Guide](/backend/service-guide) for service access patterns and orchestration styles
- [Model Guide](/backend/model-guide) for persistence behavior and ORM-facing semantics
- [Entity Guide](/backend/entity-guide) for field metadata and entity design rules
- [DTO Guide](/backend/dto-guide) for DTO design, mapped-class tools, and inference choices
- [OpenAPI Guide](/backend/openapi-guide) for contract emission and downstream consumption
- [CRUD Workflow](/backend/crud-workflow) for generator-first creation of the backend thread

This page only owns the specimen-level question:

- how the layers connect
- where the generated metadata hub fits
- which file should you open next in one real module

## Where to read next

- If you need the broader chooser page first, return to [Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap).
- If you need more backend file-order reading paths, continue with [Vona Source Reading Map](/backend/vona-source-reading-map).
- If your next question is about DTO mechanics or derivation, continue with [DTO Guide](/backend/dto-guide) and [DTO Infer and Generation](/backend/dto-infer-generation).
- If your next question is about generator-created backend threads, continue with [CRUD Workflow](/backend/crud-workflow).
- If you want a proof-oriented or symptom-first companion for the backend source-reading path itself, continue with [Backend Source Reading Verify Playbook](/backend/backend-source-reading-verify-playbook) and [Backend Source Reading Debug Checklist](/backend/backend-source-reading-debug-checklist).
- If your next question is about downstream contract emission, continue with [Backend Contract Emission Source Reading Map](/backend/backend-contract-emission-source-reading-map), [OpenAPI Guide](/backend/openapi-guide), and [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).

## Final takeaway

The fastest way to understand one Vona backend module accurately is not to jump straight from controller to ORM details.

Start from the public module entry, read the generated metadata hub early, then descend through controller -> service -> model -> entity -> DTO.

That reading order makes the contract chain visible as one connected backend surface instead of a set of isolated files.
