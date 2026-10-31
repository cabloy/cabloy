import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { catchError } from '@cabloy/utils';
import { ZodMetadata } from '@cabloy/zod-openapi';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { $Class, cast } from 'vona';
import { app } from 'vona-mock';
import { $makeMetadata, $schema, Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoProfile } from '../../src/dto/profile.ts';
import { DtoUser } from '../../src/dto/user.ts';

interface IDtoOptionsUserWithMarried extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserWithMarried>()
class DtoUserWithMarried extends $Class.omit(DtoUser, ['married']) {
  @Api.field()
  married: boolean;
}

@Dto({
  openapi: {
    title: 'User filter',
    description: 'Inherited filter metadata',
    filter: { table: 'testVonaUser', capabilities: { order: false } },
  },
  fields: { name: { title: 'Filter name' } },
})
class DtoUserFilter extends DtoUser {}

@Dto()
class DtoUserFilterInherited extends DtoUserFilter {}

@Dto()
class DtoUserFilterPicked extends $Class.pick(DtoUserFilter, ['name']) {}

@Dto({
  openapi: { title: 'Post filter', filter: { table: 'testVonaPost' } },
})
class DtoUserFilterOverride extends $Class.pick(DtoUserFilter, ['name']) {}

describe('mappedTypes.test.ts', () => {
  it('inherits root OpenAPI metadata and preserves child overrides', async () => {
    await app.bean.executor.mockCtx(async () => {
      const parentMetadata = $makeMetadata($schema(DtoUserFilter));
      assert.equal(parentMetadata?.title, 'User filter');
      assert.deepEqual(parentMetadata?.filter, {
        table: 'testVonaUser',
        capabilities: { order: false },
      });
      for (const DtoClass of [DtoUserFilterInherited, DtoUserFilterPicked]) {
        const metadata = $makeMetadata($schema(DtoClass));
        assert.equal(metadata?.title, parentMetadata?.title);
        assert.equal(metadata?.description, parentMetadata?.description);
        assert.deepEqual(metadata?.filter, parentMetadata?.filter);
      }
      const pickedSchema = $schema(DtoUserFilterPicked, { strict: true });
      assert.deepEqual(pickedSchema.parse({ name: 'tom' }), { name: 'tom' });
      assert.equal(pickedSchema.safeParse({ name: 'ab' }).success, false);
      assert.equal(pickedSchema.safeParse({ name: 'tom', married: true }).success, false);
      const nameSchema = ZodMetadata.getFieldSchema(pickedSchema, 'name');
      assert.ok(nameSchema);
      assert.equal($makeMetadata(nameSchema)?.title, 'Filter name');
      const overrideMetadata = $makeMetadata($schema(DtoUserFilterOverride));
      assert.equal(overrideMetadata?.title, 'Post filter');
      assert.equal(overrideMetadata?.description, 'Inherited filter metadata');
      assert.deepEqual(overrideMetadata?.filter, {
        table: 'testVonaPost',
        capabilities: { order: false },
      });
      const parentMetadataAfter = $makeMetadata($schema(DtoUserFilter));
      assert.equal(parentMetadataAfter?.title, 'User filter');
      assert.deepEqual(parentMetadataAfter?.filter, {
        table: 'testVonaUser',
        capabilities: { order: false },
      });
    });
  });

  it('action:mappedTypes', async () => {
    await app.bean.executor.mockCtx(async () => {
      const serviceValidator = app.bean.validator;
      const data = { id: 1, name: 'tom', married: true };
      // original
      const [dataNew, err] = await catchError(async () => {
        return await serviceValidator.validate(DtoUser, data, { strict: true });
      });
      assert.deepEqual(dataNew, data, JSON.stringify(err, null, 2));
      // OmitClass
      const [, err2] = await catchError(async () => {
        return await serviceValidator.validate($Class.omit(DtoUser, ['married']), data, {
          strict: true,
        });
      });
      assert.equal(cast(err2?.message)[0]?.keys[0], 'married');
      // OmitClass and inherit
      const [dataNew3] = await catchError(async () => {
        return await serviceValidator.validate(DtoUserWithMarried, data, { strict: true });
      });
      assert.deepEqual(dataNew3, data);
      // PickClass
      const [, err4] = await catchError(async () => {
        return await serviceValidator.validate($Class.pick(DtoUser, ['id', 'name']), data, {
          strict: true,
        });
      });
      assert.equal(cast(err4?.message)[0]?.keys[0], 'married');
      // PartialClass
      const [dataNew5] = await catchError(async () => {
        return await serviceValidator.validate($Class.partial(DtoUser), {}, { strict: true });
      });
      assert.deepEqual(dataNew5, {});
      const [dataNew6] = await catchError(async () => {
        return await serviceValidator.validate(
          $Class.partial(DtoUser, ['id', 'name']),
          { married: true },
          { strict: true },
        );
      });
      assert.deepEqual(dataNew6, { married: true });
      // MixinClass
      const [_, err7] = await catchError(async () => {
        return await serviceValidator.validate($Class.mixin(DtoUser, DtoProfile), data, {
          strict: true,
        });
      });
      assert.equal(cast(err7?.message)[0]?.path[0], 'email');
    });
  });
});
