import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import {
  DtoProductCreate,
  DtoProductPublic,
  DtoProductPublicDetail,
  DtoProductSelectResItem,
  DtoProductUpdate,
  DtoProductView,
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

describe('productPresentation.test.ts', () => {
  it('action:product:presentationMetadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const createJson = await app.bean.openapi.generateJsonOfClass(DtoProductCreate);
      const createComponent = findComponent(createJson, properties => {
        return properties?.title && properties?.categoryId && properties?.published;
      });
      assert.deepEqual(Object.keys(createComponent.properties).sort(), [
        'categoryId',
        'description',
        'productContentForm',
        'published',
        'title',
      ]);
      assert.equal(
        createComponent.properties.categoryId.rest.form.render,
        'basic-resource:formFieldResourcePicker',
      );
      assert.deepEqual(createComponent.properties.categoryId.rest.form.options, {
        resource: 'commerce-catalog:category',
        relationName: 'category',
      });
      assert.equal(
        createComponent.properties.published.rest.form.render,
        'basic-select:formFieldSelect',
      );
      assert.deepEqual(
        createComponent.properties.published.rest.form.options.items.map((item: any) => item.value),
        [false, true],
      );
      assert.equal(
        createComponent.properties.productContentForm.rest.fieldSource,
        'productContentForm.descriptionMarkdown',
      );
      assert.equal(
        createComponent.properties.productContentForm.rest.form.render,
        'commerce-catalog:formFieldMarkdown',
      );
      const createToolbar = getEntryForm(createComponent);
      assert.deepEqual(
        createToolbar.options.actions.map((action: any) => action.render),
        ['basic-form:actionSubmit', 'basic-form:actionBack'],
      );

      const updateJson = await app.bean.openapi.generateJsonOfClass(DtoProductUpdate);
      const updateComponent = findComponent(updateJson, properties => {
        return properties?.title && properties?.categoryId && properties?.published;
      });
      assert.deepEqual(Object.keys(updateComponent.properties).sort(), [
        'categoryId',
        'description',
        'productContentForm',
        'published',
        'title',
      ]);
      assert.equal(
        updateComponent.properties.categoryId.rest.form.render,
        'basic-resource:formFieldResourcePicker',
      );
      assert.equal(
        updateComponent.properties.published.rest.form.render,
        'basic-select:formFieldSelect',
      );
      assert.equal(
        updateComponent.properties.productContentForm.rest.fieldSource,
        'productContentForm.descriptionMarkdown',
      );
      assert.equal(
        updateComponent.properties.productContentForm.rest.form.render,
        'commerce-catalog:formFieldMarkdown',
      );

      const viewJson = await app.bean.openapi.generateJsonOfClass(DtoProductView);
      const viewComponent = findComponent(viewJson, properties => {
        return (
          properties?.id && properties?.categoryId && properties?.category && properties?.published
        );
      });
      assert.deepEqual(Object.keys(viewComponent.properties.category.properties).sort(), [
        'id',
        'name',
        'published',
      ]);
      assert.equal(viewComponent.properties.iid.rest.visible, false);
      assert.equal(viewComponent.properties.deleted.rest.visible, false);
      assert.equal(
        viewComponent.properties.categoryId.rest.form.render,
        'basic-resource:formFieldResourcePicker',
      );
      assert.deepEqual(viewComponent.properties.categoryId.rest.form.options, {
        resource: 'commerce-catalog:category',
        relationName: 'category',
      });
      assert.equal(
        viewComponent.properties.published.rest.form.render,
        'basic-select:formFieldSelect',
      );
      assert.equal(
        viewComponent.properties.productContentForm.rest.fieldSource,
        'productContentForm.descriptionMarkdown',
      );
      assert.equal(
        viewComponent.properties.productContentForm.rest.form.render,
        'commerce-catalog:formFieldMarkdown',
      );
      const viewToolbar = getEntryForm(viewComponent);
      assert.deepEqual(
        viewToolbar.options.actions.map((action: any) => action.render),
        ['basic-form:actionBack'],
      );

      const listJson = await app.bean.openapi.generateJsonOfClass(DtoProductSelectResItem);
      const listComponent = findComponent(listJson, properties => properties?._operationsRow);
      assert.deepEqual(Object.keys(listComponent.properties.category.properties).sort(), [
        'id',
        'name',
        'published',
      ]);
      assert.equal(
        listComponent.properties.categoryId.rest.table.render,
        'basic-resource:resourcePicker',
      );
      assert.deepEqual(listComponent.properties.categoryId.rest.table.columnProps, {
        resource: 'commerce-catalog:category',
        relationName: 'category',
      });
      assert.equal(listComponent.properties.published.rest.table.render, 'basic-select:select');
      assert.deepEqual(
        listComponent.properties.published.rest.table.columnProps.items.map(
          (item: any) => item.value,
        ),
        [false, true],
      );
      assert.deepEqual(
        listComponent.properties._operationsRow.rest.table.columnProps.actions.map(
          (action: any) => action.render,
        ),
        ['basic-table:actionUpdate', 'basic-table:actionDelete'],
      );

      const publicProductJson = await app.bean.openapi.generateJsonOfClass(DtoProductPublic);
      const publicProductComponent = findComponent(
        publicProductJson,
        properties => properties?.skuAvailables && properties?.description,
      );
      assert.equal(publicProductComponent.properties.descriptionHtml, undefined);

      const publicDetailJson = await app.bean.openapi.generateJsonOfClass(DtoProductPublicDetail);
      const publicDetailComponent = findComponent(
        publicDetailJson,
        properties => properties?.skuAvailables && properties?.descriptionHtml,
      );
      assert.deepEqual(publicDetailComponent.properties.descriptionHtml.type, ['string', 'null']);
      assert.equal(publicDetailComponent.properties.descriptionMarkdown, undefined);

      const filterBlock = listComponent.rest.blocks[0].options.blocks[0];
      const filterLayout = filterBlock.options.blocks[0].options.formLayout;
      const section = filterLayout.children[0];
      assert.equal(section.type, 'section');
      assert.equal(section.layout, 'flow');
      assert.deepEqual(
        section.children.slice(0, 2).map((field: any) => field.name),
        ['title', 'createdAt'],
      );
      assert.equal(section.children[2].block.render, 'basic-page:blockFilterActions');
    });
  });

  it('action:product:categoryProjection', async () => {
    await app.bean.executor.mockCtx(async () => {
      const suffix = randomUUID().slice(0, 12);
      let categoryId: number | string | undefined;
      let productId: number | string | undefined;
      await app.bean.passport.signinMock();
      try {
        categoryId = await app.bean.executor.performAction('post', '/commerce/catalog/category', {
          body: { name: `presentation-product-category-${suffix}`, published: true },
        });
        productId = await app.bean.executor.performAction('post', '/commerce/catalog/product', {
          body: {
            categoryId,
            title: `presentation-product-${suffix}`,
            published: false,
          },
        });

        const view: any = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/product/:id',
          {
            params: { id: productId },
          },
        );
        assert.equal(String(view.categoryId), String(categoryId));
        assert.deepEqual(view.category, {
          id: categoryId,
          name: `presentation-product-category-${suffix}`,
          published: true,
        });

        const select: any = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/product',
        );
        const item = select.list.find((entry: any) => String(entry.id) === String(productId));
        assert.ok(item);
        assert.deepEqual(item.category, {
          id: categoryId,
          name: `presentation-product-category-${suffix}`,
          published: true,
        });
        assert.equal(item.published, false);
      } finally {
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
