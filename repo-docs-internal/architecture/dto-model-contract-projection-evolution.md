# DTO/Model Contract Projection Evolution

This note records how model-derived read DTOs should evolve when a controller, OpenAPI contract, or generated consumer needs an intentionally bounded business field surface.

## Decision

Choose the DTO form according to the intended coupling to the Model-backed Entity shape:

- use bare `$Dto.get(() => ModelX)` when the DTO intentionally represents the complete current and future model-aware read shape
- use `$Dto.get(() => ModelX, { columns: [...] })` when the DTO is an intentionally narrow, stable read contract
- do not use `$Class.omit($Dto.get(...), [...])` as the normal way to define a bounded controller/OpenAPI-facing projection from a growing Entity

`columns` is positive contract selection, not merely a query optimization. It makes the selected fields the reviewed DTO, schema, and OpenAPI surface.

```ts
export class DtoStudentSummary extends $Dto.get(() => ModelStudent, {
  columns: ['id', 'name', 'mobile', 'level', 'description'],
}) {}
```

By contrast, this is a denylist derived from the complete inferred Entity shape:

```ts
export class DtoStudentSummary extends $Class.omit(
  $Dto.get(() => ModelStudent),
  ['userId'],
) {}
```

It is technically valid, but it expresses a different evolution contract: every source field except the known exclusions belongs in the DTO.

## Evolution behavior

| Source Model change                     | `$Dto.get(..., { columns })`                            | `$Class.omit($Dto.get(...), [...])`                      |
| --------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------- |
| A new Entity field is added             | It remains outside the DTO until deliberately selected. | It enters the DTO unless added to the denylist.          |
| An internal or undecided field is added | It stays out of the declared API contract by default.   | It can silently expand the DTO/OpenAPI contract.         |
| Consumer-contract review                | Adding a field is visible in the DTO projection diff.   | The DTO can change incidentally through Model evolution. |

For a bounded business or public read contract, the first behavior is normally safer: future Entity fields need an explicit admission decision before generated consumers can depend on them.

This does **not** mean every read DTO needs a whitelist. `iid` and `deleted` being present on a complete model-aware read shape are not, by themselves, a reason to add `columns`. The question is whether the endpoint intentionally exposes a complete Model read shape or a bounded business contract.

## When `$Class.omit(...)` remains appropriate

`$Class.omit(...)` remains a useful mapped-class tool when its broader coupling is deliberate.

### Deliberate open-ended coupling

Use it when the consumer genuinely intends to receive all current and future upstream fields except stable named exceptions. This is an explicit decision to let the derived shape evolve with its source, not a shortcut for curating a public contract.

### Helper-owned synthetic-field replacement

A mapped helper can supply a field whose schema must be replaced locally. For example, [`DtoOrderQueryPage`](../../vona/src/suite-vendor/a-test/modules/test-vona/src/dto/orderQueryPage.ts) removes the helper-generated `pageSize` and redeclares it with its own constrained schema and default:

```ts
export class DtoOrderQueryPage extends $Class.omit(
  $Dto.queryPage(EntityOrder, ['orderNo', 'remark']),
  ['pageSize'],
) {
  @Api.field(z.number().min(1).max(300).default(30))
  pageSize: number;
}
```

This is helper-field replacement, not a denylist projection of a Model's public read surface.

### Derivation from an already curated DTO

A nearby variant may omit a field from a DTO whose bounded surface was already explicitly established. In that case the upstream DTO, rather than a growing Entity, owns the contract boundary. Record why the derivative remains safe when adding such a variant.

## Runtime response boundary

`columns` narrows the inferred DTO/schema/OpenAPI contract. It does not automatically strip extra properties from an object already returned by a Model, service, or controller.

When an HTTP payload must physically be narrower, build or project the returned object intentionally and verify the action response. Do not spread a rich internal object into a public response and rely on DTO/OpenAPI declaration alone to remove its fields.

Keep this distinction explicit:

- DTO projection decides the declared contract and downstream generated surface
- query/service/controller response construction decides the actual runtime object

## Contract-loop consequence

Adding a field to a narrowed DTO is a backend contract change. Update backend truth first, then run the relevant Vona → Zova contract loop and regenerate consumers instead of hand-patching generated output.

The same rule does not require persistence-schema changes: public DTO projection and Entity/database evolution are separate decisions.

## Selection checklist

1. Does the endpoint intentionally represent the complete current and future Model read shape? Use bare `$Dto.get(...)`.
2. Does it intentionally expose a smaller business, controller, or OpenAPI contract? Use `$Dto.get(..., { columns: [...] })` and admit each field explicitly.
3. Does the derivative intentionally track future upstream fields, replace a helper-generated field, or begin from an already curated DTO? `$Class.omit(...)` can be appropriate; state why its coupling is intended.
4. Must actual HTTP JSON be narrower too? Shape and verify the returned response independently of DTO/OpenAPI declaration.

## Related guidance

- [DTO Render Field-Name Typing Boundary](./dto-render-field-name-typing.md)
- [Backend Resource Field Update Workflow](./backend-resource-field-workflow.md)
- [Resource Public Contract Exposure](./resource-public-contract-exposure.md)
- [DTO Infer and Generation](../../repo-docs/backend/dto-infer-generation.md)
- [Contract-Loop Playbook](../../repo-docs/fullstack/contract-loop-playbook.md)
