import type {
  DtoAddressCreate,
  DtoAddressUpdate,
  EntityAddress,
} from 'vona-module-commerce-member';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const actionPath = '/commerce/member/address';

function createAddress(suffix: string): DtoAddressCreate {
  return {
    recipientName: `Recipient ${suffix}`,
    phone: '15555550123',
    countryCode: 'US',
    region: 'California',
    city: 'San Francisco',
    postalCode: '94105',
    addressLine1: `1 Market Street ${suffix}`,
    addressLine2: 'Suite 100',
  };
}

async function performAs(accessToken: string, method: string, path: string, options = {}) {
  return await app.bean.executor.newCtxIsolate(async () => {
    return await app.bean.executor.performAction(method, path, {
      ...options,
      authToken: accessToken,
      innerAccess: false,
    });
  });
}

async function registerAndSignin(name: string) {
  await app.bean.user.register({ name }, true);
  const token = await app.bean.passport.signinMock(name as any);
  return { token: token.accessToken, user: app.bean.passport.currentUser! };
}

describe('address.test.ts', () => {
  it('denies anonymous address actions', async () => {
    await app.bean.executor.mockCtx(async () => {
      for (const [method, path, options] of [
        ['post', actionPath, { body: createAddress('anonymous') }],
        ['get', actionPath, {}],
        ['get', `${actionPath}/:id`, { params: { id: 999999 } }],
        ['patch', `${actionPath}/:id`, { params: { id: 999999 }, body: {} }],
        ['delete', `${actionPath}/:id`, { params: { id: 999999 } }],
      ] as const) {
        const [_, err] = await catchError(() =>
          app.bean.executor.performAction(method, path, { ...options, innerAccess: false }),
        );
        assert.equal(err?.code, 401);
      }
    });
  });

  it('derives ownership from the authenticated customer and scopes every action', async () => {
    await app.bean.executor.mockCtx(async () => {
      const suffix = `${Date.now()}`;
      const customerA = await registerAndSignin(`address-a-${suffix}`);
      const customerB = await registerAndSignin(`address-b-${suffix}`);
      const addressData = createAddress(suffix);
      const addressId = await performAs(customerA.token, 'post', actionPath, {
        body: { ...addressData, userId: customerB.user.id, iid: 999999 } as any,
      });

      const persisted = await app.scope('commerce-member').model.address.getById(addressId);
      assert.equal(String(persisted?.userId), String(customerA.user.id));
      assert.equal(persisted?.iid, app.ctx.instance.id);

      const ownList = await performAs(customerA.token, 'get', actionPath);
      assert.equal(
        ownList.list.some(item => String(item.id) === String(addressId)),
        true,
      );
      assert.equal(
        ownList.list.every(item => !Object.hasOwn(item, 'userId')),
        true,
      );
      assert.equal(
        ownList.list.every(item => !Object.hasOwn(item, 'iid')),
        true,
      );

      const update: DtoAddressUpdate = { ...addressData, city: 'Oakland', addressLine2: undefined };
      assert.equal(
        await performAs(customerA.token, 'patch', `${actionPath}/:id`, {
          params: { id: addressId },
          body: update,
        }),
        null,
      );
      const ownAddress: EntityAddress = await performAs(
        customerA.token,
        'get',
        `${actionPath}/:id`,
        {
          params: { id: addressId },
        },
      );
      assert.equal(ownAddress.city, update.city);
      assert.equal(ownAddress.addressLine2, addressData.addressLine2);
      assert.equal(Object.hasOwn(ownAddress, 'userId'), false);
      assert.equal(Object.hasOwn(ownAddress, 'iid'), false);

      const foreignList = await performAs(customerB.token, 'get', actionPath);
      assert.equal(
        foreignList.list.some(item => String(item.id) === String(addressId)),
        false,
      );
      assert.equal(
        await performAs(customerB.token, 'get', `${actionPath}/:id`, { params: { id: addressId } }),
        undefined,
      );
      assert.equal(
        await performAs(customerB.token, 'patch', `${actionPath}/:id`, {
          params: { id: addressId },
          body: { ...addressData, city: 'Los Angeles' },
        }),
        null,
      );
      assert.equal(
        await performAs(customerB.token, 'delete', `${actionPath}/:id`, {
          params: { id: addressId },
        }),
        null,
      );
      assert.equal(
        (await app.scope('commerce-member').model.address.getById(addressId))?.city,
        'Oakland',
      );

      assert.equal(
        await performAs(customerA.token, 'delete', `${actionPath}/:id`, {
          params: { id: addressId },
        }),
        null,
      );
      assert.equal(
        await performAs(customerA.token, 'get', `${actionPath}/:id`, { params: { id: addressId } }),
        undefined,
      );
    });
  });

  it('treats another instance address as absent', async () => {
    let addressId!: number;
    let customerDefault!: Awaited<ReturnType<typeof registerAndSignin>>;
    const addressDefault = createAddress('default');
    await app.bean.executor.mockCtx(async () => {
      customerDefault = await registerAndSignin(`address-default-${Date.now()}`);
      addressId = await performAs(customerDefault.token, 'post', actionPath, {
        body: addressDefault,
      });
    });

    await app.bean.executor.mockCtx(
      async () => {
        const customer = await registerAndSignin(`address-share-${Date.now()}`);
        assert.equal(
          await performAs(customer.token, 'get', `${actionPath}/:id`, {
            params: { id: addressId },
          }),
          undefined,
        );
        const list = await performAs(customer.token, 'get', actionPath);
        assert.equal(
          list.list.some(item => String(item.id) === String(addressId)),
          false,
        );
        assert.equal(
          await performAs(customer.token, 'patch', `${actionPath}/:id`, {
            params: { id: addressId },
            body: { ...createAddress('foreign'), city: 'Other city' },
          }),
          null,
        );
        assert.equal(
          await performAs(customer.token, 'delete', `${actionPath}/:id`, {
            params: { id: addressId },
          }),
          null,
        );
        assert.equal(
          await app.scope('commerce-member').model.address.getById(addressId),
          undefined,
        );
      },
      { instanceName: 'shareTest' as any },
    );

    await app.bean.executor.mockCtx(async () => {
      const address = await performAs(customerDefault.token, 'get', `${actionPath}/:id`, {
        params: { id: addressId },
      });
      assert.equal(address.city, addressDefault.city);
    });
  });
});
