import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import {
  DtoCouponTemplateCreate,
  DtoCouponTemplateSelectResItem,
  DtoCouponTemplateUpdate,
  DtoCouponTemplateView,
} from 'vona-module-commerce-promotion';

function getEntryFormLayout(component: any) {
  const pageEntry = component?.rest?.blocks?.[0];
  const formBlock = pageEntry?.options?.blocks?.[0];
  const layoutBlock = formBlock?.options?.blocks?.[0];
  assert.equal(pageEntry?.render, 'basic-pageentry:blockPageEntry');
  assert.equal(formBlock?.render, 'basic-pageentry:blockForm');
  assert.equal(layoutBlock?.render, 'basic-form:blockFormLayout');
  return layoutBlock?.options?.formLayout;
}

function getGroupFields(group: any) {
  const section = group?.children?.[0];
  assert.equal(group?.type, 'group');
  assert.equal(section?.type, 'section');
  assert.deepEqual(section?.columns, { default: 1, md: 2 });
  return section?.children;
}

function findComponent(apiJson: any, predicate: (properties: any) => boolean) {
  return Object.values(apiJson.components!.schemas as any).find(item => {
    return predicate((item as any).properties);
  });
}

describe('couponTemplateFormLayout.test.ts', () => {
  it('action:couponTemplate:formLayoutMetadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const createJson = await app.bean.openapi.generateJsonOfClass(DtoCouponTemplateCreate);
      const createComponent = findComponent(createJson, properties => {
        return properties?.discountCents && properties?.totalIssueLimit;
      });
      const createLayout = getEntryFormLayout(createComponent);
      assert.deepEqual(
        createLayout?.children.map((group: any) =>
          getGroupFields(group).map((field: any) => field.name),
        ),
        [
          ['name', 'state', 'description'],
          ['currency', 'discountCents', 'minSpendCents'],
          ['validFrom', 'validUntil'],
          ['totalIssueLimit', 'totalUsageLimit', 'perCustomerIssueLimit'],
        ],
      );
      assert.deepEqual(getGroupFields(createLayout?.children[0])?.[2]?.span, { default: 1, md: 2 });
      assert.deepEqual(
        Object.keys((createComponent as any).properties).sort(),
        [
          'name',
          'state',
          'currency',
          'discountCents',
          'minSpendCents',
          'validFrom',
          'validUntil',
          'totalIssueLimit',
          'totalUsageLimit',
          'perCustomerIssueLimit',
          'description',
        ].sort(),
      );
      assert.deepEqual((createComponent as any).properties.state.enum, ['draft', 'active']);

      const updateJson = await app.bean.openapi.generateJsonOfClass(DtoCouponTemplateUpdate);
      const updateComponent = findComponent(updateJson, properties => {
        return (
          properties?.name && properties?.state && properties?.description && !properties?.currency
        );
      });
      const updateLayout = getEntryFormLayout(updateComponent);
      assert.equal(updateLayout?.children.length, 1);
      assert.deepEqual(
        getGroupFields(updateLayout?.children[0]).map((field: any) => field.name),
        ['name', 'state', 'description'],
      );
      assert.deepEqual(getGroupFields(updateLayout?.children[0])?.[2]?.span, { default: 1, md: 2 });
      assert.deepEqual((updateComponent as any).required ?? [], []);

      const viewJson = await app.bean.openapi.generateJsonOfClass(DtoCouponTemplateView);
      const viewComponent = findComponent(viewJson, properties => {
        return properties?.issuedCount && properties?.redeemedCount;
      });
      const viewLayout = getEntryFormLayout(viewComponent);
      assert.deepEqual(
        viewLayout?.children.map((group: any) =>
          getGroupFields(group).map((field: any) => field.name),
        ),
        [
          ['name', 'state', 'description'],
          ['currency', 'discountCents', 'minSpendCents'],
          ['validFrom', 'validUntil'],
          [
            'totalIssueLimit',
            'totalUsageLimit',
            'perCustomerIssueLimit',
            'issuedCount',
            'redeemedCount',
          ],
        ],
      );
    });
  });

  it('action:couponTemplate:fieldRenderMetadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const createJson = await app.bean.openapi.generateJsonOfClass(DtoCouponTemplateCreate);
      const createComponent = findComponent(createJson, properties => {
        return properties?.discountCents && properties?.totalIssueLimit;
      }) as any;
      const createProperties = createComponent.properties;
      const expectedCurrencyOptions = { fixed: 2, exp: 2, zero: 2 };
      const expectedCreateStateValues = ['draft', 'active'];
      const expectedStateValues = ['draft', 'active', 'disabled'];
      const stateItems = createProperties.state.rest.form.options.items;

      assert.equal(createProperties.state.rest.form.render, 'basic-select:formFieldSelect');
      assert.deepEqual(
        stateItems.map((item: any) => item.value),
        expectedCreateStateValues,
      );
      assert.ok(stateItems.every((item: any) => item.title?.toJSON && item.title?.toString));
      assert.equal(createProperties.state.rest.table.render, 'basic-select:select');
      assert.deepEqual(
        createProperties.state.rest.table.columnProps.items.map((item: any) => item.value),
        expectedStateValues,
      );

      for (const fieldName of ['discountCents', 'minSpendCents']) {
        const field = createProperties[fieldName];
        assert.equal(field.rest.form.render, 'basic-currency:formFieldCurrency');
        assert.deepEqual(field.rest.form.options, expectedCurrencyOptions);
        assert.equal(field.rest.table.render, 'basic-currency:currency');
        assert.deepEqual(field.rest.table.columnProps, expectedCurrencyOptions);
      }

      for (const fieldName of ['validFrom', 'validUntil']) {
        const field = createProperties[fieldName];
        assert.equal(field.rest.form.render, 'basic-date:formFieldDate');
        assert.deepEqual(field.rest.form.options, { inputType: 'date', preset: 'DATE_SHORT' });
        assert.equal(field.rest.table.render, 'basic-date:date');
        assert.deepEqual(field.rest.table.columnProps, { preset: 'DATE_SHORT' });
      }

      const viewJson = await app.bean.openapi.generateJsonOfClass(DtoCouponTemplateView);
      const viewComponent = findComponent(viewJson, properties => {
        return properties?.issuedCount && properties?.redeemedCount;
      }) as any;
      assert.equal(
        viewComponent.properties.discountCents.rest.form.render,
        'basic-currency:formFieldCurrency',
      );
      assert.equal(
        viewComponent.properties.validUntil.rest.form.render,
        'basic-date:formFieldDate',
      );

      const updateJson = await app.bean.openapi.generateJsonOfClass(DtoCouponTemplateUpdate);
      const updateComponent = findComponent(updateJson, properties => {
        return (
          properties?.name && properties?.state && properties?.description && !properties?.currency
        );
      }) as any;
      assert.equal(
        updateComponent.properties.state.rest.form.render,
        'basic-select:formFieldSelect',
      );
      assert.equal(updateComponent.properties.discountCents, undefined);
    });
  });

  it('action:couponTemplate:filterFormLayoutMetadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const apiJson = await app.bean.openapi.generateJsonOfClass(DtoCouponTemplateSelectResItem);
      const component = findComponent(apiJson, properties => properties?._operationsRow);
      const filterBlock = (component as any)?.rest?.blocks?.[0]?.options?.blocks?.[0];
      assert.equal(filterBlock?.render, 'basic-page:blockFilter');
      assert.equal(filterBlock?.options?.formFieldLayout?.inline, true);
      assert.deepEqual(
        filterBlock?.options?.blocks?.map((block: any) => block.render),
        ['basic-form:blockFormLayout'],
      );
      const filterLayout = filterBlock?.options?.blocks?.[0]?.options?.formLayout;
      const section = filterLayout?.children?.[0];
      assert.equal(section?.type, 'section');
      assert.equal(section?.layout, 'flow');
      assert.deepEqual(
        section?.children?.map((child: any) => child.type),
        ['field', 'field', 'block'],
      );
      assert.deepEqual(
        section?.children?.slice(0, 2).map((field: any) => field.name),
        ['name', 'createdAt'],
      );
      assert.equal(section?.children?.[2]?.block?.render, 'basic-page:blockFilterActions');
    });
  });
});
