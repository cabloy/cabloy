import { OpenApiGeneratorV31, OpenAPIRegistry } from '@cabloy/zod-to-openapi';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { appResource, cast } from 'vona';
import { app } from 'vona-mock';
import { $schema } from 'vona-module-a-openapiutils';
import { DtoUserLazy } from 'vona-module-test-vona';

describe('dtoLazy.test.ts', () => {
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
