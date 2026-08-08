import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import {
  DtoAddressMineCreate,
  DtoAddressSelectReq,
  DtoAddressSelectResItem,
  DtoAddressView,
} from 'vona-module-commerce-member';

const actionPath = '/commerce/member/address';
const createMinePath = `${actionPath}/createMine`;

function findComponent(apiJson: any, predicate: (properties: any) => boolean) {
  return Object.values(apiJson.components!.schemas as any).find(item => {
    return predicate((item as any).properties);
  }) as any;
}

function getListFilter(component: any) {
  const page = component?.rest?.blocks?.[0];
  const [filter, table, pager] = page?.options?.blocks ?? [];
  assert.equal(page?.render, 'basic-page:blockPage');
  assert.equal(filter?.render, 'basic-page:blockFilter');
  assert.equal(table?.render, 'basic-page:blockTable');
  assert.equal(pager?.render, 'basic-page:blockPager');
  return filter;
}

function getEntryToolbar(component: any) {
  const pageEntry = component?.rest?.blocks?.[0];
  const formBlock = pageEntry?.options?.blocks?.[0];
  const toolbarBlock = pageEntry?.options?.blocks?.[1];
  assert.equal(pageEntry?.render, 'basic-pageentry:blockPageEntry');
  assert.equal(formBlock?.render, 'basic-pageentry:blockForm');
  assert.equal(toolbarBlock?.render, 'basic-pageentry:blockToolbarRow');
  return toolbarBlock;
}

function createAddress(suffix: string): DtoAddressMineCreate {
  return {
    recipientName: `Presentation Recipient ${suffix}`,
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

describe('addressPresentation.test.ts', () => {
  it('action:address:presentationMetadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const listJson = await app.bean.openapi.generateJsonOfClass(DtoAddressSelectResItem);
      const list = findComponent(
        listJson,
        properties =>
          properties?._operationsRow && properties?.recipientName && properties?.countryCode,
      );
      assert.deepEqual(Object.keys(list.properties).sort(), [
        '_operationsRow',
        'city',
        'countryCode',
        'createdAt',
        'id',
        'phone',
        'recipientName',
      ]);
      assert.equal(list.properties.id.rest.table.render, 'basic-table:actionView');
      assert.equal(list.properties.createdAt.rest.table.render, 'basic-date:date');
      assert.deepEqual(
        list.properties._operationsRow.rest.table.columnProps.actions.map(
          (action: any) => action.render,
        ),
        ['basic-table:actionView'],
      );

      const filter = getListFilter(list);
      const section = filter.options.blocks[0].options.formLayout.children[0];
      assert.equal(section.type, 'section');
      assert.equal(section.layout, 'flow');
      assert.deepEqual(
        section.children.slice(0, 3).map((field: any) => field.name),
        ['recipientName', 'phone', 'createdAt'],
      );
      assert.equal(section.children[3].block.render, 'basic-page:blockFilterActions');

      const filterJson = await app.bean.openapi.generateJsonOfClass(DtoAddressSelectReq);
      const filterComponent = findComponent(filterJson, properties => {
        return properties?.recipientName && properties?.phone && properties?.createdAt;
      });
      assert.equal(
        filterComponent.properties.createdAt.rest.form.render,
        'basic-date:formFieldDateRange',
      );

      const viewJson = await app.bean.openapi.generateJsonOfClass(DtoAddressView);
      const view = findComponent(
        viewJson,
        properties =>
          properties?.recipientName && properties?.addressLine1 && properties?.updatedAt,
      );
      assert.deepEqual(Object.keys(view.properties).sort(), [
        'addressLine1',
        'addressLine2',
        'city',
        'countryCode',
        'createdAt',
        'id',
        'phone',
        'postalCode',
        'recipientName',
        'region',
        'updatedAt',
      ]);
      assert.equal(view.properties.createdAt.rest.form.render, 'basic-date:formFieldDate');
      assert.equal(view.properties.updatedAt.rest.form.render, 'basic-date:formFieldDate');
      assert.deepEqual(
        getEntryToolbar(view).options.actions.map((action: any) => action.render),
        ['basic-form:actionBack'],
      );

      for (const component of [list, view]) {
        for (const field of ['userId', 'iid', 'deleted']) {
          assert.equal(component.properties[field], undefined);
        }
      }
    });
  });

  it('action:address:runtimeBoundary', async () => {
    await app.bean.executor.mockCtx(async () => {
      let addressId: number | undefined;
      const suffix = randomUUID().slice(0, 12);
      const address = createAddress(suffix);
      try {
        await app.bean.user.register({ name: `presentation-address-${suffix}` }, true);
        const customer = await app.bean.passport.signinMock(
          `presentation-address-${suffix}` as any,
        );
        addressId = await performAs(customer.accessToken, 'post', createMinePath, {
          body: address,
        });

        const admin = await app.bean.passport.signinMock();
        const list: any = await performAs(admin.accessToken, 'get', actionPath, {
          query: { recipientName: address.recipientName },
        });
        const item = list.list.find((entry: any) => String(entry.id) === String(addressId));
        assert.deepEqual(Object.keys(item).sort(), [
          'city',
          'countryCode',
          'createdAt',
          'id',
          'phone',
          'recipientName',
        ]);
        assert.equal(item.recipientName, address.recipientName);
        assert.equal(item.phone, address.phone);
        assert.equal(item.countryCode, address.countryCode);
        assert.equal(item.city, address.city);

        const view: any = await performAs(admin.accessToken, 'get', `${actionPath}/:id`, {
          params: { id: addressId },
        });
        assert.deepEqual(Object.keys(view).sort(), [
          'addressLine1',
          'addressLine2',
          'city',
          'countryCode',
          'createdAt',
          'id',
          'phone',
          'postalCode',
          'recipientName',
          'region',
          'updatedAt',
        ]);
        assert.equal(view.addressLine1, address.addressLine1);
        assert.equal(view.addressLine2, address.addressLine2);
        assert.equal(view.region, address.region);

        const permissions = await Promise.all(
          ['create', 'update', 'delete'].map(action =>
            app.bean.permission.retrievePermissionAction('commerce-member:address', action),
          ),
        );
        assert.deepEqual(permissions, [false, false, false]);
      } finally {
        if (addressId !== undefined) {
          await app.scope('commerce-member').model.address.deleteById(addressId);
        }
        await app.bean.passport.signout();
      }
    });
  });
});
