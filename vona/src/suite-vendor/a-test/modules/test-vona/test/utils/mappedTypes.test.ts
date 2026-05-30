import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { $Class, cast } from 'vona';
import { app } from 'vona-mock';
import { Api } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoProfile } from '../../src/dto/profile.ts';
import { DtoUser } from '../../src/dto/user.ts';

interface IDtoOptionsUserWithMarried extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsUserWithMarried>()
class DtoUserWithMarried extends $Class.omit(DtoUser, ['married']) {
  @Api.field()
  married: boolean;
}

describe('mappedTypes.test.ts', () => {
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
