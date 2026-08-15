import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import {
  DtoSkuCreate,
  DtoSkuSelectResItem,
  DtoSkuUpdate,
  DtoSkuView,
} from 'vona-module-commerce-catalog';

function findComponent(apiJson: any, predicate: (properties: any) => boolean) {
  return Object.values(apiJson.components!.schemas as any).find(item => {
    return predicate((item as any).properties);
  }) as any;
}

function getEntryForm(component: any) {
  const pageEntry = component?.rest?.blocks?.[0];
  const formBlock = pageEntry?.options?.blocks?.[0];
  const toolbarBlock = pageEntry?.options?.blocks?.[1];
  assert.equal(pageEntry?.render, 'basic-pageentry:blockPageEntry');
  assert.equal(formBlock?.render, 'basic-pageentry:blockForm');
  assert.equal(toolbarBlock?.render, 'basic-pageentry:blockToolbarRow');
  return toolbarBlock;
}

function assertLifecycleItems(items: any[]) {
  assert.deepEqual(
    items.map(item => item.value),
    ['draft', 'active', 'inactive', 'archived'],
  );
  for (const item of items) assert.ok(item.title);
}

describe('skuPresentation.test.ts', () => {
  it('action:sku:presentationMetadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const currencyOptions = { fixed: 2, exp: 2, zero: 2 };
      const productPickerOptions = {
        resource: 'commerce-catalog:product',
        relationName: 'product',
        selectOptions: { itemValue: 'id', itemTitle: 'title' },
      };

      const createJson = await app.bean.openapi.generateJsonOfClass(DtoSkuCreate);
      const createComponent = findComponent(createJson, properties => {
        return properties?.code && properties?.productId && properties?.priceCents;
      });
      assert.deepEqual(Object.keys(createComponent.properties).sort(), [
        'code',
        'lifecycle',
        'priceCents',
        'productId',
      ]);
      assert.equal(createComponent.properties.attributes, undefined);
      assert.equal(createComponent.properties.product, undefined);
      assert.equal(
        createComponent.properties.productId.rest.form.render,
        'basic-resource:formFieldResourcePicker',
      );
      assert.deepEqual(
        createComponent.properties.productId.rest.form.options,
        productPickerOptions,
      );
      assert.equal(
        createComponent.properties.priceCents.rest.form.render,
        'basic-currency:formFieldCurrency',
      );
      assert.deepEqual(createComponent.properties.priceCents.rest.form.options, currencyOptions);
      assert.equal(
        createComponent.properties.priceCents.rest.table.render,
        'basic-currency:currency',
      );
      assert.deepEqual(
        createComponent.properties.priceCents.rest.table.columnProps,
        currencyOptions,
      );
      assert.equal(
        createComponent.properties.lifecycle.rest.form.render,
        'basic-select:formFieldSelect',
      );
      assertLifecycleItems(createComponent.properties.lifecycle.rest.form.options.items);
      const createToolbar = getEntryForm(createComponent);
      assert.deepEqual(
        createToolbar.options.actions.map((action: any) => action.render),
        ['basic-form:actionSubmit', 'basic-form:actionBack'],
      );

      const updateJson = await app.bean.openapi.generateJsonOfClass(DtoSkuUpdate);
      const updateComponent = findComponent(updateJson, properties => {
        return properties?.code && properties?.productId && properties?.priceCents;
      });
      assert.deepEqual(Object.keys(updateComponent.properties).sort(), [
        'code',
        'lifecycle',
        'priceCents',
        'productId',
      ]);
      assert.equal(updateComponent.properties.attributes, undefined);
      assert.equal(updateComponent.properties.product, undefined);
      assert.equal(
        updateComponent.properties.productId.rest.form.render,
        'basic-resource:formFieldResourcePicker',
      );
      assert.deepEqual(
        updateComponent.properties.productId.rest.form.options,
        productPickerOptions,
      );
      assert.equal(
        updateComponent.properties.lifecycle.rest.form.render,
        'basic-select:formFieldSelect',
      );
      assertLifecycleItems(updateComponent.properties.lifecycle.rest.form.options.items);
      const updateToolbar = getEntryForm(updateComponent);
      assert.deepEqual(
        updateToolbar.options.actions.map((action: any) => action.render),
        ['basic-form:actionSubmit', 'basic-form:actionBack'],
      );

      const viewJson = await app.bean.openapi.generateJsonOfClass(DtoSkuView);
      const viewComponent = findComponent(viewJson, properties => {
        return (
          properties?.id &&
          properties?.productId &&
          properties?.product &&
          properties?.priceCents &&
          properties?.lifecycle &&
          properties?.iid &&
          properties?.deleted
        );
      });
      assert.equal(Object.hasOwn(viewComponent.properties, 'attributes'), false);
      assert.deepEqual(Object.keys(viewComponent.properties.product.properties).sort(), [
        'id',
        'title',
      ]);
      assert.equal(
        viewComponent.properties.productId.rest.form.render,
        'basic-resource:formFieldResourcePicker',
      );
      assert.deepEqual(viewComponent.properties.productId.rest.form.options, productPickerOptions);
      assert.equal(viewComponent.properties.iid.rest.visible, false);
      assert.equal(viewComponent.properties.deleted.rest.visible, false);
      assert.equal(
        viewComponent.properties.priceCents.rest.table.render,
        'basic-currency:currency',
      );
      assert.deepEqual(viewComponent.properties.priceCents.rest.table.columnProps, currencyOptions);
      assert.equal(viewComponent.properties.lifecycle.rest.table.render, 'basic-select:select');
      assertLifecycleItems(viewComponent.properties.lifecycle.rest.table.columnProps.items);
      const viewToolbar = getEntryForm(viewComponent);
      assert.deepEqual(
        viewToolbar.options.actions.map((action: any) => action.render),
        ['basic-form:actionBack'],
      );

      const listJson = await app.bean.openapi.generateJsonOfClass(DtoSkuSelectResItem);
      const listComponent = findComponent(listJson, properties => properties?._operationsRow);
      assert.equal(Object.hasOwn(listComponent.properties, 'attributes'), false);
      assert.deepEqual(Object.keys(listComponent.properties.product.properties).sort(), [
        'id',
        'title',
      ]);
      assert.equal(listComponent.properties.code.rest.table.render, 'basic-table:actionView');
      assert.equal(
        listComponent.properties.priceCents.rest.table.render,
        'basic-currency:currency',
      );
      assert.deepEqual(listComponent.properties.priceCents.rest.table.columnProps, currencyOptions);
      assert.equal(listComponent.properties.lifecycle.rest.table.render, 'basic-select:select');
      assertLifecycleItems(listComponent.properties.lifecycle.rest.table.columnProps.items);
      assert.equal(
        listComponent.properties.productId.rest?.table?.render,
        'basic-resource:resourcePicker',
      );
      assert.deepEqual(
        listComponent.properties.productId.rest?.table?.columnProps,
        productPickerOptions,
      );
      assert.deepEqual(
        listComponent.properties._operationsRow.rest.table.columnProps.actions.map(
          (action: any) => action.render,
        ),
        ['basic-table:actionUpdate', 'basic-table:actionDelete'],
      );

      const filterBlock = listComponent.rest.blocks[0].options.blocks[0];
      const filterLayout = filterBlock.options.blocks[0].options.formLayout;
      const section = filterLayout.children[0];
      assert.equal(section.type, 'section');
      assert.equal(section.layout, 'flow');
      assert.deepEqual(
        section.children.slice(0, 2).map((field: any) => field.name),
        ['code', 'createdAt'],
      );
      assert.equal(section.children[2].block.render, 'basic-page:blockFilterActions');
    });
  });

  it('action:sku:runtimeBoundary', async () => {
    await app.bean.executor.mockCtx(async () => {
      const suffix = randomUUID().slice(0, 12);
      let categoryId: number | string | undefined;
      let productId: number | string | undefined;
      let skuId: number | string | undefined;
      await app.bean.passport.signinMock();
      try {
        categoryId = await app.bean.executor.performAction('post', '/commerce/catalog/category', {
          body: { name: `presentation-sku-category-${suffix}`, published: true },
        });
        productId = await app.bean.executor.performAction('post', '/commerce/catalog/product', {
          body: {
            categoryId,
            title: `presentation-sku-product-${suffix}`,
            published: true,
          },
        });
        skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
          body: {
            code: `presentation-sku-${suffix}`,
            productId,
            priceCents: 1234,
            lifecycle: 'draft',
          },
        });

        const view: any = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/sku/:id',
          {
            params: { id: skuId },
          },
        );
        assert.equal(String(view.id), String(skuId));
        assert.equal(String(view.productId), String(productId));
        assert.equal(view.priceCents, 1234);
        assert.equal(view.lifecycle, 'draft');
        assert.deepEqual(view.product, {
          id: productId,
          title: `presentation-sku-product-${suffix}`,
        });
        assert.equal(view.attributes, undefined);

        const select: any = await app.bean.executor.performAction('get', '/commerce/catalog/sku', {
          query: { code: `presentation-sku-${suffix}` },
        });
        assert.equal(select.list.length, 1);
        assert.equal(String(select.list[0].id), String(skuId));
        assert.deepEqual(select.list[0].product, {
          id: productId,
          title: `presentation-sku-product-${suffix}`,
        });
        assert.equal(select.list[0].attributes, undefined);
      } finally {
        if (skuId) {
          await app.bean.executor.performAction('delete', '/commerce/catalog/sku/:id', {
            params: { id: skuId },
          });
        }
        if (productId) {
          await app.bean.executor.performAction('delete', '/commerce/catalog/product/:id', {
            params: { id: productId },
          });
        }
        if (categoryId) {
          await app.bean.executor.performAction('delete', '/commerce/catalog/category/:id', {
            params: { id: categoryId },
          });
        }
        await app.bean.passport.signout();
      }
    });
  });
});
