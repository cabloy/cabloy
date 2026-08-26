# Vona Validation Error Message Normalization

## Purpose

This note records the established Vona runtime behavior for validation-error payloads that are objects rather than strings. It explains how Zod issues, or an `exceptionFactory` result, travel through `app.throw(...)`, core error construction, error logging, and final response presentation.

This is a source-backed description of the current behavior. It does not introduce a validation response contract, change the detailed-validation `422` behavior, require exception factories to return strings, or change error-filter ordering.

## Runtime flow

`BeanValidator._validateSchema(...)` uses `schema.safeParseAsync(value)`. If parsing fails, it chooses one of these payloads:

- `result.error.issues` by default; or
- `options.exceptionFactory(result.error)` when the caller provides an exception factory.

When that value is object-like, `BeanValidator` attaches a `toString()` implementation that serializes the value as JSON: compact JSON in production and indented JSON elsewhere.

Unless `disableErrorMessages` selected the earlier no-message branch, the validator then calls:

```ts
this.app.throw(422, issues);
```

The retained-issues path therefore explicitly uses `422`. `errorHttpStatusCode` controls the `disableErrorMessages` branch; it must not be described as overriding the status of the detailed-issues branch.

The application `throw(...)` facade delegates to core `ErrorClass.throw(...)`. The error-resolution path retains the supplied validation payload as the effective message, and `ErrorClass.throw(...)` assigns that value directly to `err.message`. As a result, a validation payload can temporarily exist as an object or array in `Error.message` between throwing and error-filter processing.

The `a-error` `onerror` integration runs log filters before it selects JSON, HTML, or text presentation. `FilterError.log(...)` is the final normalization boundary for this flow: when `err.message` is truthy and not a string, it replaces the value with `JSON.stringify(err.message)`, using compact output in production and indented output outside production. JSON presentation then calls `detectErrorMessage(err)`, which normally returns the already-normalized `err.message`.

```text
safeParseAsync failure
  -> Zod issues | exceptionFactory(error)
  -> object `toString()` attached
  -> app.throw(422, payload)
  -> ErrorClass: err.message = payload
  -> FilterError.log: truthy non-string message -> JSON string
  -> JSON / HTML / text error presentation
```

## Ownership boundaries

- **`a-validation` / `BeanValidator` owns validation failure selection.** It chooses Zod issues or the caller-provided `exceptionFactory` result, adds explicit object-string-coercion support, and throws the established detailed-validation response as `422`.
- **Vona core / `ErrorClass` owns error-instance construction.** It preserves the resolved message value while creating the `Error`; it does not prematurely serialize structured validation data.
- **`a-error` / `FilterError.log` owns presentation-safe message normalization.** It converts a truthy non-string `Error.message` to JSON before standard logging and response presentation continue.
- **`a-error` `onerror` wiring owns phase ordering.** Log normalization occurs before JSON, HTML, or text presentation. Presentation filters should consume the normalized value instead of adding validation-specific serialization rules.
- **Exception-factory callers own their returned payload contract.** A factory may return an object when structured validation detail is useful, but object results must be JSON-serializable because the established final normalization path uses `JSON.stringify`.

## Role of the custom `toString()`

The object-level `toString()` added by `BeanValidator` is an explicit coercion aid. It produces the expected JSON text when code handling a validation payload performs a normal string conversion, such as `String(issues)` or template interpolation.

It is not the final HTTP normalization mechanism:

- assigning `toString()` does not itself make `err.message` a string;
- `ErrorClass.throw(...)` assigns the supplied payload value to `err.message` directly; and
- `FilterError.log(...)` calls `JSON.stringify(err.message)` directly rather than calling the payload's custom `toString()`.

Therefore, replacing `FilterError` normalization with a custom `toString()` would change the response and logging boundary: consumers that read or structurally serialize `err.message` do not necessarily invoke `toString()`. Conversely, removing the validator-level `toString()` is a separate compatibility decision for code that catches an error before it reaches the global error filter and explicitly stringifies its message.

## Invariants future changes must preserve

1. Keep the default Zod-issues path and object-valued `exceptionFactory` path equivalent with respect to object-message handling.
2. Preserve the retained-issues failure status as `422`; do not conflate it with the configurable no-message branch.
3. Preserve the structured payload through `app.throw(...)` and core error construction until the error-filter normalization boundary, unless an intentional contract change replaces that behavior.
4. Normalize before response presentation and before the standard error logger receives the error.
5. Keep production/non-production formatting aligned between the validator's explicit coercion support and `FilterError.log(...)` normalization.
6. Do not double-serialize an already normalized string message.
7. Do not require every exception factory to pre-stringify an object merely to satisfy the usual `Error.message` string expectation; framework-level filtering owns final presentation normalization.
8. Treat JSON serializability as part of the practical object-payload contract. Circular, frozen, or otherwise non-serializable values require deliberate runtime behavior and focused tests before changing this path.
9. Do not expose raw Zod issues as a new public `errors` response field merely by changing message formatting. A new structured API error-detail contract requires a separate design decision.

## Source path

Trace these entry points when changing this behavior:

- [`BeanValidator._validateSchema(...)`](../../vona/src/suite-vendor/a-vona/modules/a-validation/src/bean/bean.validator.ts) selects Zod issues or `exceptionFactory(...)` output, adds `toString()` for object results, and throws the detailed path as `422`.
- [`ValidatorOptions`](../../vona/src/suite-vendor/a-vona/modules/a-validation/src/types/validatorOptions.ts) defines `disableErrorMessages`, `errorHttpStatusCode`, and `exceptionFactory`.
- [`errors.ts`](../../vona/packages-vona/vona-core/src/lib/module/errors.ts) installs the application `throw(...)` facade.
- [`ErrorClass`](../../vona/packages-vona/vona-core/src/lib/bean/resource/error/errorClass.ts) resolves the failure and assigns its message to the constructed `Error`.
- [`a-error` `onerror` wiring](../../vona/src/suite-vendor/a-vona/modules/a-error/src/lib/onerror.ts) runs the log phase before presentation selection.
- [`a-error` configuration](../../vona/src/suite-vendor/a-vona/modules/a-error/src/config/config.ts) configures the error-filter phases.
- [`FilterError`](../../vona/src/suite-vendor/a-vona/modules/a-error/src/bean/filter.error.ts) normalizes non-string messages and builds JSON or HTML error output.
- [`detectErrorMessage(...)`](../../vona/packages-vona/vona-core/src/lib/utils/util.ts) shows that normal presentation returns `err.message` without general-purpose serialization.

## Non-goals and compatibility notes

This note does not change the normal error JSON envelope, application-code or HTTP-status selection, localization, the unauthenticated `403` to `401` rewrite, custom filter composition, or HTML/text error policy.

Keep message normalization separate from application-code and HTTP-status semantics. The validation `422` flow described here concerns payload propagation and serialization timing; final filters can still apply request-context-dependent error policy.

## Related guidance

- [Vona Error Code and HTTP Status Evolution](./vona-error-status-evolution.md) separates application-code and HTTP-status ownership from this message-normalization flow.
- [Vona HTTP Rate Limit Architecture](./vona-http-rate-limit-architecture.md) is another example of deliberate transport-status ownership.
- [DTO Schema Scenes and Readonly Sanitization](./dto-schema-scenes-and-readonly-sanitization.md) documents the schema-processing boundaries that precede validation failure handling.
