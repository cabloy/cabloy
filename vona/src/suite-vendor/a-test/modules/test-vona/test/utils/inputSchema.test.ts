import { ZodMetadata } from '@cabloy/zod-openapi';
import { Metadata, OpenApiGeneratorV31, OpenAPIRegistry } from '@cabloy/zod-to-openapi';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { runWithZodQueryCoercion } from 'vona';
import { app } from 'vona-mock';
import { inputSchema, inputSchemaTransport } from 'vona-module-a-openapiutils';
import { z } from 'zod';

function withNativeSchemas(callback: () => void | Promise<void>) {
  return app.bean.executor.mockCtx(async () => runWithZodQueryCoercion(false, callback));
}

const readonlyMetadata = { rest: { readonly: true } };

describe('inputSchema.test.ts', () => {
  it('ignores missing and malformed readonly input without effects or mutation', async () => {
    await withNativeSchemas(async () => {
      let effects = 0;
      const schema = z.strictObject({
        id: z
          .preprocess(() => {
            effects++;
            throw new Error('readonly preprocessor must not run');
          }, z.string())
          .openapi(readonlyMetadata),
        generated: z
          .string()
          .default(() => {
            effects++;
            return 'generated';
          })
          .openapi(readonlyMetadata),
        caught: z
          .string()
          .catch(() => {
            effects++;
            return 'caught';
          })
          .openapi(readonlyMetadata),
        nested: z.object({ id: z.number().openapi(readonlyMetadata), title: z.string() }),
        title: z.string(),
      });
      const input = Object.freeze({
        id: { malformed: true },
        generated: null,
        caught: 123,
        nested: Object.freeze({ id: 'bad', title: 'nested' }),
        title: 'ok',
      });
      const expected = { nested: { title: 'nested' }, title: 'ok' };
      assert.deepEqual(await inputSchema(schema).parseAsync(input), expected);
      assert.deepEqual(
        inputSchema(schema).parse({ nested: { title: 'nested' }, title: 'ok' }),
        expected,
      );
      assert.equal(effects, 0);
      assert.deepEqual(input.nested, { id: 'bad', title: 'nested' });
      assert.deepEqual(input.id, { malformed: true });
      const getterInput = {
        title: 'ok',
        nested: { title: 'nested' },
        get id() {
          throw new Error('discarded input getter must not run');
        },
      };
      assert.deepEqual(inputSchema(schema).parse(getterInput), expected);
      assert.equal(
        inputSchema(schema).safeParse({ title: 5, nested: { title: 'nested' } }).success,
        false,
      );
    });
  });

  it('preserves strip, strict, loose and catchall policies at each boundary', async () => {
    await withNativeSchemas(() => {
      const shape = { id: z.string().openapi(readonlyMetadata), title: z.string() };
      const input = { id: 123, title: 'ok', extra: 7 };
      assert.deepEqual(inputSchema(z.object(shape)).parse(input), { title: 'ok' });
      assert.equal(inputSchema(z.strictObject(shape)).safeParse(input).success, false);
      assert.deepEqual(inputSchema(z.strictObject(shape)).parse({ id: 123, title: 'ok' }), {
        title: 'ok',
      });
      assert.deepEqual(inputSchema(z.looseObject(shape)).parse(input), { title: 'ok', extra: 7 });
      const catchall = inputSchema(z.object(shape).catchall(z.number()));
      assert.deepEqual(catchall.parse(input), { title: 'ok', extra: 7 });
      assert.equal(catchall.safeParse({ ...input, extra: 'bad' }).success, false);
      const nestedCatchall = inputSchema(z.object({}).catchall(z.object(shape)));
      assert.deepEqual(nestedCatchall.parse({ child: { id: null, title: 'ok' } }), {
        child: { title: 'ok' },
      });
      assert.equal(inputSchema(z.object(shape)).safeParse(null).success, false);
      assert.equal(inputSchema(z.object(shape)).safeParse([]).success, false);
    });
  });

  it('uses effective rest scenes, including wrappers and child scene boundaries', async () => {
    await withNativeSchemas(() => {
      const field = z.string().openapi({
        rest: { 'readonly': true, 'form': { readonly: false }, 'form-create': { readonly: true } },
      });
      const schema = z.object({ field });
      assert.deepEqual(inputSchema(schema, 'form-view').parse({ field: 'writable' }), {
        field: 'writable',
      });
      assert.deepEqual(inputSchema(schema, 'form-create').parse({ field: 3 }), {});
      assert.deepEqual(inputSchema(schema, 'table').parse({ field: 3 }), {});
      const wrapped = schema.optional().openapi({ rest: { schemaScene: 'form-view' } });
      assert.deepEqual(inputSchema(wrapped, 'table').parse({ field: 'writable' }), {
        field: 'writable',
      });
      assert.equal(inputSchema(wrapped).parse(undefined), undefined);
      const child = z.object({ field }).openapi({
        rest: { schemaScene: 'form-view', table: { readonly: true } },
      });
      assert.deepEqual(inputSchema(z.object({ child }), 'table').parse({ child: 3 }), {});
      assert.deepEqual(
        inputSchema(z.object({ child }), 'form-create').parse({ child: { field: 'ok' } }),
        {
          child: { field: 'ok' },
        },
      );
      // Neither OpenAPI readOnly nor Zod's immutable-output wrapper controls admission.
      const ordinary = inputSchema(
        z.object({
          openapiOnly: z.string().openapi({ readOnly: true }),
          immutable: z.object({ value: z.string() }).readonly(),
        }),
      );
      assert.equal(ordinary.safeParse({}).success, false);
      assert.deepEqual(ordinary.parse({ openapiOnly: 'ok', immutable: { value: 'ok' } }), {
        openapiOnly: 'ok',
        immutable: { value: 'ok' },
      });
      const catchWrapped = z.string().openapi(readonlyMetadata).catch('trusted');
      assert.deepEqual(inputSchema(z.object({ field: catchWrapped })).parse({ field: false }), {});
    });
  });

  it('memoizes final identities by scene and purpose without eager lazy getters', async () => {
    await withNativeSchemas(() => {
      let getters = 0;
      let hiddenGetters = 0;
      let targetGetters = 0;
      let targetEffects = 0;
      const targetReadonly = z.lazy(() => {
        targetGetters++;
        return z
          .string()
          .transform(() => {
            targetEffects++;
            return 'unexpected';
          })
          .openapi(readonlyMetadata);
      });
      const deferred = z.object({ field: targetReadonly.optional() });
      const deferredExecutable = inputSchema(deferred);
      const deferredTransport = inputSchemaTransport(deferred);
      assert.equal(targetGetters, 0);
      assert.deepEqual(deferredExecutable.parse({ field: false }), {});
      assert.deepEqual(deferredExecutable.parse({}), {});
      assert.equal((deferredTransport as z.ZodObject).shape.field.safeParse(false).success, true);
      assert.equal(targetGetters, 1);
      assert.equal(targetEffects, 0);
      const sceneLazy = z
        .lazy(() =>
          z
            .object({
              value: z.string().openapi({ rest: { table: { readonly: true } } }),
            })
            .openapi({ rest: { schemaScene: 'table' } }),
        )
        .optional()
        .openapi({ rest: { schemaScene: 'form-view' } });
      assert.deepEqual(inputSchema(sceneLazy).parse({ value: 'ok' }), { value: 'ok' });
      const node: z.ZodType = z.lazy(() => {
        getters++;
        return z.object({
          id: z.string().openapi(readonlyMetadata),
          next: node.optional(),
        });
      });
      const hidden = z
        .lazy(() => {
          hiddenGetters++;
          return z.string();
        })
        .openapi(readonlyMetadata);
      const schema = z.object({ node, hidden });
      const executable = inputSchema(schema, 'form-create');
      const transport = inputSchemaTransport(schema, 'form-create');
      assert.equal(getters, 0);
      assert.equal(hiddenGetters, 0);
      assert.equal(inputSchema(schema, 'form-create'), executable);
      assert.equal(inputSchemaTransport(schema, 'form-create'), transport);
      assert.notEqual(executable, transport);
      assert.notEqual(inputSchema(schema, 'table'), executable);
      assert.deepEqual(executable.parse({ node: { id: false, next: { id: 3 } }, hidden: 3 }), {
        node: { next: {} },
      });
      assert.equal(getters, 1);
      assert.equal(hiddenGetters, 0);
      const lazy = inputSchema(node, 'form-create') as z.ZodLazy;
      assert.equal(lazy.def.getter(), lazy.def.getter());
      assert.equal(getters, 1);
      assert.equal(inputSchema(node, 'form-create'), lazy);
      assert.equal(
        (inputSchemaTransport(schema, 'form-create') as z.ZodObject).shape.hidden.safeParse(
          undefined,
        ).success,
        true,
      );
      assert.equal(hiddenGetters, 0);
      const shared = z.object({
        value: z.string().openapi({ rest: { table: { readonly: true } } }),
      });
      const mixed = inputSchema(
        z.object({
          table: shared.optional().openapi({ rest: { schemaScene: 'table' } }),
          form: shared.optional().openapi({ rest: { schemaScene: 'form-view' } }),
        }),
      );
      assert.deepEqual(mixed.parse({ table: { value: 3 }, form: { value: 'ok' } }), {
        table: {},
        form: { value: 'ok' },
      });
    });
  });

  it('keeps refinements and wrapper ordering, retaining trusted default and catch outputs', async () => {
    await withNativeSchemas(() => {
      let checks = 0;
      const base = z
        .object({ id: z.string().openapi(readonlyMetadata), title: z.string() })
        .superRefine((value, ctx) => {
          checks++;
          assert.equal('id' in value, false);
          if (value.title !== 'ok') ctx.addIssue({ code: 'custom', message: 'title must be ok' });
        });
      const executable = inputSchema(base);
      assert.deepEqual(executable.parse({ id: false, title: 'ok' }), { title: 'ok' });
      assert.equal(executable.safeParse({ title: 'no' }).success, false);
      assert.equal(checks, 2);
      assert.deepEqual(inputSchema(base.prefault({ id: 'server', title: 'ok' })).parse(undefined), {
        title: 'ok',
      });
      assert.deepEqual(inputSchema(base.default({ id: 'server', title: 'ok' })).parse(undefined), {
        id: 'server',
        title: 'ok',
      });
      assert.deepEqual(inputSchema(base.catch({ id: 'server', title: 'recovered' })).parse(false), {
        id: 'server',
        title: 'recovered',
      });
      assert.equal(inputSchema(base.nullable()).parse(null), null);
      assert.equal(inputSchema(base.optional()).parse(undefined), undefined);
      assert.equal(Object.isFrozen(inputSchema(base.readonly()).parse({ title: 'ok' })), true);
    });
  });

  it('runs preprocess and output transforms once without crossing their trust boundaries', async () => {
    await withNativeSchemas(async () => {
      let preprocessCalls = 0;
      let transformCalls = 0;
      const source = z.object({ id: z.string().openapi(readonlyMetadata), title: z.string() });
      const preprocessed = z.preprocess(value => {
        preprocessCalls++;
        assert.equal((value as any).id, 'caller');
        return value;
      }, source);
      const nested = inputSchema(z.object({ nested: preprocessed }));
      assert.deepEqual(nested.parse({ nested: { id: 'caller', title: 'ok' } }), {
        nested: { title: 'ok' },
      });
      assert.equal(preprocessCalls, 1);
      const transformed = source
        .transform(async value => {
          transformCalls++;
          return { ...value, id: 'server' };
        })
        .pipe(source);
      assert.deepEqual(await inputSchema(transformed).parseAsync({ id: null, title: 'ok' }), {
        title: 'ok',
        id: 'server',
      });
      assert.equal(transformCalls, 1);
      const transport = inputSchemaTransport(z.object({ nested: preprocessed }));
      assert.equal(transport.def.type, 'object');
      assert.equal(preprocessCalls, 1);
      assert.equal(transformCalls, 1);
    });
  });

  it('derives unions, discriminated unions, intersections and collections branch-locally', async () => {
    await withNativeSchemas(() => {
      const left = z.object({
        kind: z.literal('left'),
        value: z.string().openapi(readonlyMetadata),
      });
      const right = z.object({ kind: z.literal('right'), value: z.number() });
      for (const schema of [z.union([left, right]), z.discriminatedUnion('kind', [left, right])]) {
        const executable = inputSchema(schema);
        assert.deepEqual(executable.parse({ kind: 'left', value: false }), { kind: 'left' });
        assert.deepEqual(executable.parse({ kind: 'right', value: 2 }), {
          kind: 'right',
          value: 2,
        });
        assert.equal(executable.safeParse({ kind: 'right', value: false }).success, false);
      }
      const shared = z.object({ value: z.string().openapi(readonlyMetadata) });
      const intersection = z.intersection(shared, z.object({ value: z.number() }));
      assert.deepEqual(inputSchema(intersection).parse({ value: 3 }), { value: 3 });
      assert.equal(inputSchema(intersection).safeParse({ value: 'bad' }).success, false);
      const collections = inputSchema(
        z.object({
          array: z.array(shared).min(1),
          record: z.record(z.string(), shared),
          tuple: z.tuple([shared, z.number()]).rest(shared),
        }),
      );
      assert.deepEqual(
        collections.parse({
          array: [{ value: false }],
          record: { one: { value: null } },
          tuple: [{ value: 3 }, 2, { value: false }],
        }),
        { array: [{}], record: { one: {} }, tuple: [{}, 2, {}] },
      );
      assert.equal(collections.safeParse({ array: [], record: {}, tuple: [{}, 2] }).success, false);
    });
  });

  it('projects metadata-compatible readonly slots with independent internal refs and unchanged sources', async () => {
    await withNativeSchemas(() => {
      let effects = 0;
      const title = { toString: () => 'Localized title', toJSON: () => 'Localized title' };
      const field = z
        .string()
        .min(8)
        .default(() => {
          effects++;
          return 'original';
        })
        .openapi('InputSchemaOriginalField', {
          title: title as any,
          description: 'discarded validation',
          type: 'string',
          minLength: 8,
          default: 'original',
          rest: { readonly: true, render: 'custom-render' },
        });
      const original = z.strictObject({ field, title: z.string() }).openapi('InputSchemaOriginal');
      const metadata = ZodMetadata.getOpenapiMetadata(field);
      const sourceRef = ZodMetadata.getRefId(original);
      const transport = inputSchemaTransport(original) as z.ZodObject;
      const executable = inputSchema(original);
      assert.equal(effects, 0);
      assert.equal(transport.def.type, 'object');
      assert.notEqual(ZodMetadata.getRefId(transport), sourceRef);
      assert.notEqual(ZodMetadata.getRefId(executable), sourceRef);
      assert.notEqual(ZodMetadata.getRefId(transport), ZodMetadata.getRefId(executable));
      assert.equal(ZodMetadata.getRefId(transport.shape.title), undefined);
      const inline = z.object({ kind: z.literal('inline'), count: z.number().int() });
      const inlineTransport = inputSchemaTransport(inline) as z.ZodObject;
      for (const schema of [
        inlineTransport,
        inlineTransport.shape.kind,
        inlineTransport.shape.count,
      ]) {
        assert.equal(ZodMetadata.getRefId(schema), undefined);
      }
      assert.equal(transport.shape.field.safeParse(undefined).success, true);
      assert.equal(transport.shape.field.safeParse({ arbitrary: true }).success, true);
      assert.equal(effects, 0);
      const projected = ZodMetadata.getOpenapiMetadata(transport.shape.field) as any;
      assert.equal(projected.title, title);
      assert.equal(projected.rest, (metadata as any).rest);
      for (const key of ['type', 'minLength', 'default', 'required'])
        assert.equal(projected[key], undefined);
      assert.equal(ZodMetadata.getRefId(original), sourceRef);
      assert.deepEqual(ZodMetadata.getOpenapiMetadata(field), metadata);
      assert.equal(original.shape.field, field);
      assert.equal(transport.safeParse({ title: 'ok', extra: true }).success, false);
      const registry = new OpenAPIRegistry();
      registry.register('InputSchemaTransportDocument', transport);
      registry.register('InputSchemaInlineDocument', inlineTransport);
      const document = new OpenApiGeneratorV31(registry.definitions).generateComponents();
      const output = document.components?.schemas?.InputSchemaTransportDocument as any;
      assert.equal(output.type, 'object');
      const inlineOutput = document.components?.schemas?.InputSchemaInlineDocument as any;
      assert.equal(inlineOutput.type, 'object');
      assert.deepEqual(inlineOutput.properties.kind.enum, ['inline']);
      assert.equal(inlineOutput.properties.count.type, 'integer');
      assert.equal(inlineOutput.properties.kind.$ref, undefined);
      assert.equal(inlineOutput.properties.count.$ref, undefined);
      assert.deepEqual(output.required, ['title']);
      assert.equal(output.properties.field.minLength, undefined);
      assert.equal(output.properties.field.default, undefined);
      assert.equal(output.allOf, undefined);
      assert.equal(effects, 0);
      const derivedFrom = original.extend({ more: z.string() });
      const extendedTransport = inputSchemaTransport(derivedFrom);
      assert.equal(Metadata.getInternalMetadata(extendedTransport)?.extendedFrom, undefined);
      const nextLocale = original.openapi({ description: 'another locale' });
      assert.notEqual(inputSchemaTransport(nextLocale), transport);
      assert.equal(
        ZodMetadata.getOpenapiMetadata(inputSchemaTransport(nextLocale))?.description,
        'another locale',
      );
    });
  });
});
