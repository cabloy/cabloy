import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import {
  DtoAddressMineCreate,
  DtoAddressMineItem,
  DtoAddressMineUpdate,
  DtoAddressMineView,
} from 'vona-module-commerce-member';

const actionPath = '/commerce/member/address';
const minePath = `${actionPath}/mine`;
const viewMinePath = `${actionPath}/viewMine/:id`;
const createMinePath = `${actionPath}/createMine`;
const updateMinePath = `${actionPath}/updateMine/:id`;
const deleteMinePath = `${actionPath}/deleteMine/:id`;
const addressMineExcludedFields = ['userId', 'iid', 'deleted', 'createdAt', 'updatedAt'] as const;

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
  it('emits aligned Mine DTO schemas', async () => {
    await app.bean.executor.mockCtx(async () => {
      const expectedWriteFields = [
        'recipientName',
        'phone',
        'countryCode',
        'region',
        'city',
        'postalCode',
        'addressLine1',
        'addressLine2',
      ].sort();
      const expectedRequiredFields = expectedWriteFields.filter(name => name !== 'addressLine2');
      for (const DtoClass of [DtoAddressMineCreate, DtoAddressMineUpdate]) {
        const apiJson = await app.bean.openapi.generateJsonOfClass(DtoClass);
        const component = Object.values(apiJson.components!.schemas as any).find(item => {
          return (item as any).properties?.recipientName && (item as any).properties?.addressLine1;
        }) as any;
        assert.deepEqual(Object.keys(component.properties).sort(), expectedWriteFields);
        assert.deepEqual(component.required?.sort(), expectedRequiredFields);
      }
      const expectedReadFields = ['id', ...expectedWriteFields].sort();
      for (const DtoClass of [DtoAddressMineItem, DtoAddressMineView]) {
        const apiJson = await app.bean.openapi.generateJsonOfClass(DtoClass);
        const component = Object.values(apiJson.components!.schemas as any).find(item => {
          return (item as any).properties?.id && (item as any).properties?.recipientName;
        }) as any;
        assert.deepEqual(Object.keys(component.properties).sort(), expectedReadFields);
      }
    });
  });

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
        for (const field of addressMineExcludedFields) {
          assert.equal(
            ownList.list.every(item => !Object.hasOwn(item, field)),
            true,
          );
        }

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
        const ownAddress: DtoAddressMineView = await performAs(
          customerA.token,
          'get',
          viewMinePath,
          {
            params: { id: addressId },
          },
        );
        assert.equal(ownAddress.city, update.city);
        assert.equal(ownAddress.addressLine2, addressData.addressLine2);
        for (const field of addressMineExcludedFields) {
          assert.equal(Object.hasOwn(ownAddress, field), false);
        }
        const [, incompleteUpdateError] = await catchError(() =>
          performAs(customerA.token, 'patch', updateMinePath, {
            params: { id: addressId },
            body: { city: 'Berkeley' },
          }),
        );
        assert.equal(incompleteUpdateError?.code, 422);

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
