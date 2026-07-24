import type {
  DtoAddressMineCreate,
  DtoAddressMineUpdate,
  EntityAddress,
} from 'vona-module-commerce-member';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

const actionPath = '/commerce/member/address';
const minePath = `${actionPath}/mine`;
const viewMinePath = `${actionPath}/viewMine/:id`;
const createMinePath = `${actionPath}/createMine`;
const updateMinePath = `${actionPath}/updateMine/:id`;
const deleteMinePath = `${actionPath}/deleteMine/:id`;

function createTestId() {
  return randomUUID().slice(0, 12);
}

function createAddress(suffix: string): DtoAddressMineCreate {
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

async function deleteOwnedAddresses(ids: Array<number | string | undefined>) {
  for (const id of ids) {
    if (id !== undefined) await app.scope('commerce-member').model.address.deleteById(id);
  }
}

describe('addressOwnership.test.ts', () => {
  it('denies anonymous Admin and Web Address actions', async () => {
    await app.bean.executor.mockCtx(async () => {
      for (const [method, path, options] of [
        ['get', actionPath, {}],
        ['get', `${actionPath}/:id`, { params: { id: 999999 } }],
        ['get', minePath, {}],
        ['get', viewMinePath, { params: { id: 999999 } }],
        ['post', createMinePath, { body: createAddress('anonymous') }],
        ['patch', updateMinePath, { params: { id: 999999 }, body: createAddress('anonymous') }],
        ['delete', deleteMinePath, { params: { id: 999999 } }],
      ] as const) {
        const [_, err] = await catchError(() =>
          app.bean.executor.performAction(method, path, { ...options, innerAccess: false }),
        );
        assert.equal(err?.code, 401);
      }
    });
  });

  it('derives Web ownership from Passport and treats foreign rows as absent', async () => {
    await app.bean.executor.mockCtx(async () => {
      let addressId: number | undefined;
      try {
        const suffix = createTestId();
        const customerA = await registerAndSignin(`address-a-${suffix}`);
        const customerB = await registerAndSignin(`address-b-${suffix}`);
        const addressData = createAddress(suffix);
        addressId = await performAs(customerA.token, 'post', createMinePath, {
          body: { ...addressData, userId: customerB.user.id, iid: 999999 } as any,
        });

        const persisted = await app.scope('commerce-member').model.address.getById(addressId);
        assert.equal(String(persisted?.userId), String(customerA.user.id));
        assert.equal(persisted?.iid, app.ctx.instance.id);

        const ownList = await performAs(customerA.token, 'get', minePath);
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

        const { addressLine2: _, ...update } = {
          ...addressData,
          city: 'Oakland',
        } satisfies DtoAddressMineUpdate;
        assert.equal(
          await performAs(customerA.token, 'patch', updateMinePath, {
            params: { id: addressId },
            body: update,
          }),
          null,
        );
        const ownAddress: EntityAddress = await performAs(customerA.token, 'get', viewMinePath, {
          params: { id: addressId },
        });
        assert.equal(ownAddress.city, update.city);
        assert.equal(ownAddress.addressLine2, addressData.addressLine2);
        assert.equal(Object.hasOwn(ownAddress, 'userId'), false);
        assert.equal(Object.hasOwn(ownAddress, 'iid'), false);

        const foreignList = await performAs(customerB.token, 'get', minePath);
        assert.equal(
          foreignList.list.some(item => String(item.id) === String(addressId)),
          false,
        );
        assert.equal(
          await performAs(customerB.token, 'get', viewMinePath, { params: { id: addressId } }),
          undefined,
        );
        assert.equal(
          await performAs(customerB.token, 'patch', updateMinePath, {
            params: { id: addressId },
            body: { ...addressData, city: 'Los Angeles' },
          }),
          null,
        );
        assert.equal(
          await performAs(customerB.token, 'delete', deleteMinePath, { params: { id: addressId } }),
          null,
        );
        assert.equal(
          (await app.scope('commerce-member').model.address.getById(addressId))?.city,
          'Oakland',
        );
      } finally {
        await deleteOwnedAddresses([addressId]);
      }
    });
  });

  it('exposes active-instance Address inspection only to systemAdmin', async () => {
    await app.bean.executor.mockCtx(async () => {
      let addressId: number | undefined;
      try {
        const suffix = createTestId();
        const customer = await registerAndSignin(`address-admin-${suffix}`);
        addressId = await performAs(customer.token, 'post', createMinePath, {
          body: createAddress(suffix),
        });

        const [_, nonAdminError] = await catchError(() =>
          performAs(customer.token, 'get', actionPath),
        );
        assert.equal(nonAdminError?.code, 403);

        const admin = await app.bean.passport.signinMock();
        const list = await performAs(admin.accessToken, 'get', actionPath);
        assert.equal(
          list.list.some(item => String(item.id) === String(addressId)),
          true,
        );
        const address = await performAs(admin.accessToken, 'get', `${actionPath}/:id`, {
          params: { id: addressId },
        });
        assert.equal(address?.id, addressId);

        const permissions = await Promise.all(
          ['create', 'update', 'delete'].map(action =>
            app.bean.permission.retrievePermissionAction('commerce-member:address', action),
          ),
        );
        assert.deepEqual(permissions, [false, false, false]);
      } finally {
        await deleteOwnedAddresses([addressId]);
      }
    });
  });

  it('treats another instance Address as absent on Web actions', async () => {
    let addressId: number | undefined;
    let customerDefault!: Awaited<ReturnType<typeof registerAndSignin>>;
    const addressDefault = createAddress('default');
    try {
      await app.bean.executor.mockCtx(async () => {
        customerDefault = await registerAndSignin(`address-default-${createTestId()}`);
        addressId = await performAs(customerDefault.token, 'post', createMinePath, {
          body: addressDefault,
        });
      });

      await app.bean.executor.mockCtx(
        async () => {
          const customer = await registerAndSignin(`address-share-${createTestId()}`);
          assert.equal(
            await performAs(customer.token, 'get', viewMinePath, { params: { id: addressId } }),
            undefined,
          );
          const list = await performAs(customer.token, 'get', minePath);
          assert.equal(
            list.list.some(item => String(item.id) === String(addressId)),
            false,
          );
          assert.equal(
            await performAs(customer.token, 'patch', updateMinePath, {
              params: { id: addressId },
              body: { ...createAddress('foreign'), city: 'Other city' },
            }),
            null,
          );
          assert.equal(
            await performAs(customer.token, 'delete', deleteMinePath, {
              params: { id: addressId },
            }),
            null,
          );
        },
        { instanceName: 'shareTest' as any },
      );

      await app.bean.executor.mockCtx(async () => {
        const address = await performAs(customerDefault.token, 'get', viewMinePath, {
          params: { id: addressId },
        });
        assert.equal(address.city, addressDefault.city);
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await deleteOwnedAddresses([addressId]);
      });
    }
  });
});
