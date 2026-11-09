import { OpenApiGeneratorV3, OpenApiGeneratorV31, OpenAPIRegistry } from '@cabloy/zod-to-openapi';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { appResource, cast } from 'vona';
import { app } from 'vona-mock';
import { $schema } from 'vona-module-a-openapiutils';
import { DtoUserLazy } from 'vona-module-test-vona';
import { z } from 'zod';

describe('dtoLazy.test.ts', () => {
  it('preserves the named lazy anchor for recursive predicate unions in both OpenAPI versions', async () => {
    await app.bean.executor.mockCtx(async () => {
      let predicate: z.ZodType;
      const lazy = z.lazy(() => predicate).openapi('NamedRecursivePredicate');
      predicate = z.union([
        z.strictObject({ field: z.literal('name'), op: z.literal('eq'), value: z.string() }),
        z.strictObject({ and: z.array(lazy).min(1) }),
        z.strictObject({ or: z.array(lazy).min(1) }),
        z.strictObject({ not: lazy }),
      ]);
      for (const [Generator, version] of [
        [OpenApiGeneratorV3, 'V30'],
        [OpenApiGeneratorV31, 'V31'],
      ] as const) {
        const registry = new OpenAPIRegistry();
        registry.register(
          'NamedRecursiveQuery',
          z.object({
            where: lazy.optional().openapi({ description: 'Public predicate' }),
          }),
        );
        const document = new Generator(registry.definitions).generateDocument(
          app.scope('a-openapi').config.generateDocument[version],
        );
        const schemas = cast(document).components.schemas;
        const ref = '#/components/schemas/NamedRecursivePredicate';
        const whereRef = schemas.NamedRecursiveQuery.properties.where.$ref;
        const whereName = whereRef.slice('#/components/schemas/'.length);
        assert.ok(whereName.startsWith('NamedRecursivePredicate_'));
        assert.deepEqual(
          Object.keys(schemas).sort(),
          ['NamedRecursivePredicate', whereName, 'NamedRecursiveQuery'].sort(),
        );
        assert.equal(schemas.NamedRecursiveQuery.required, undefined);
        assert.equal(schemas[whereName].description, 'Public predicate');
        const branches = schemas.NamedRecursivePredicate.anyOf;
        assert.equal(branches[1].properties.and.items.$ref, ref);
        assert.equal(branches[2].properties.or.items.$ref, ref);
        assert.equal(branches[3].properties.not.$ref, ref);
        assert.equal(branches[0].additionalProperties, false);
        assert.doesNotThrow(() => JSON.stringify(document));
      }
    });
  });

  it('action:dtoLazy', async () => {
    await app.bean.executor.mockCtx(async () => {
      const data = {
        name: 'kevin',
        other: 'other',
        user: {
          id: 1,
          name: 'tom',
          married: 1,
        },
        roles: [{ id: 2, name: 'admin' }],
      };
      const schema = $schema(DtoUserLazy);
      const res = await schema.parseAsync(data);
      assert.equal(res.name, 'kevin');
      assert.equal(cast(res).other, undefined);
      assert.equal(res.user?.name, 'tom');
      assert.equal(cast(res.user)?.married, undefined);
      assert.equal(res.roles?.length, 1);
      assert.equal(res.roles?.[0].name, 'admin');
      assert.equal(cast(res.roles?.[0])?.id, undefined);
    });
  });
  it('action:openapi', async () => {
    await app.bean.executor.mockCtx(async () => {
      const registry = new OpenAPIRegistry();
      const beanOptions = appResource.getBean(DtoUserLazy)!;
      const schema = $schema(beanOptions.beanClass);
      registry.register(beanOptions.beanFullName, schema);
      const generator = new OpenApiGeneratorV31(registry.definitions);
      const apiObj = generator.generateDocument(app.scope('a-openapi').config.generateDocument.V31);
      assert.equal(
        cast(apiObj).components.schemas['test-vona.dto.userLazy'].properties.user.$ref.includes(
          '#/components/schemas/test-vona.dto.userLazy',
        ),
        true,
      );
      assert.equal(
        cast(apiObj).components.schemas['test-vona.dto.roleLazy'].properties.users.items.$ref,
        '#/components/schemas/test-vona.dto.userLazy',
      );
    });
  });
});
