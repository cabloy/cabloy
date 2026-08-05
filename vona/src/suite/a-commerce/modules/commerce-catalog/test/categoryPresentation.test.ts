import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import {
  DtoCategoryCreate,
  DtoCategorySelectResItem,
  DtoCategoryUpdate,
  DtoCategoryView,
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

describe('categoryPresentation.test.ts', () => {
  it('action:category:presentationMetadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const createJson = await app.bean.openapi.generateJsonOfClass(DtoCategoryCreate);
      const createComponent = findComponent(createJson, properties => {
        return (
          properties?.name &&
          properties?.parentId &&
          properties?.published &&
          properties?.description
        );
      });
      const createProperties = createComponent.properties;
      assert.deepEqual(Object.keys(createProperties).sort(), [
        'description',
        'name',
        'parentId',
        'published',
      ]);
      assert.equal(
        createProperties.parentId.rest.form.render,
        'basic-resource:formFieldResourcePicker',
      );
      assert.deepEqual(createProperties.parentId.rest.form.options, {
        resource: 'commerce-catalog:category',
        relationName: 'parent',
      });
      assert.equal(createProperties.published.rest.form.render, 'basic-select:formFieldSelect');
      assert.deepEqual(
        createProperties.published.rest.form.options.items.map((item: any) => item.value),
        [false, true],
      );
      assert.ok(
        createProperties.published.rest.form.options.items.every(
          (item: any) => item.title?.toJSON && item.title?.toString,
        ),
      );
      const createToolbar = getEntryForm(createComponent);
      assert.deepEqual(
        createToolbar.options.actions.map((action: any) => action.render),
        ['basic-form:actionSubmit', 'basic-form:actionBack'],
      );

      const updateJson = await app.bean.openapi.generateJsonOfClass(DtoCategoryUpdate);
      const updateComponent = findComponent(updateJson, properties => {
        return (
          properties?.name &&
          properties?.parentId &&
          properties?.published &&
          properties?.description
        );
      });
      assert.deepEqual(Object.keys(updateComponent.properties).sort(), [
        'description',
        'name',
        'parentId',
        'published',
      ]);
      assert.equal(
        updateComponent.properties.parentId.rest.form.render,
        'basic-resource:formFieldResourcePicker',
      );
      assert.equal(
        updateComponent.properties.published.rest.form.render,
        'basic-select:formFieldSelect',
      );

      const viewJson = await app.bean.openapi.generateJsonOfClass(DtoCategoryView);
      const viewComponent = findComponent(viewJson, properties => {
        return (
          properties?.id && properties?.parentId && properties?.parent && properties?.published
        );
      });
      assert.deepEqual(Object.keys(viewComponent.properties.parent.properties).sort(), [
        'id',
        'name',
      ]);
      assert.equal(viewComponent.properties.iid.rest.visible, false);
      assert.equal(viewComponent.properties.deleted.rest.visible, false);
      assert.equal(
        viewComponent.properties.parentId.rest.form.render,
        'basic-resource:formFieldResourcePicker',
      );
      assert.equal(
        viewComponent.properties.published.rest.form.render,
        'basic-select:formFieldSelect',
      );
      const viewToolbar = getEntryForm(viewComponent);
      assert.deepEqual(
        viewToolbar.options.actions.map((action: any) => action.render),
        ['basic-form:actionBack'],
      );

      const listJson = await app.bean.openapi.generateJsonOfClass(DtoCategorySelectResItem);
      const listComponent = findComponent(listJson, properties => properties?._operationsRow);
      const listProperties = listComponent.properties;
      assert.deepEqual(Object.keys(listProperties.parent.properties).sort(), ['id', 'name']);
      assert.equal(listProperties.parentId.rest.table.render, 'basic-resource:resourcePicker');
      assert.deepEqual(listProperties.parentId.rest.table.columnProps, {
        resource: 'commerce-catalog:category',
        relationName: 'parent',
      });
      assert.equal(listProperties.published.rest.table.render, 'basic-select:select');
      assert.deepEqual(
        listProperties.published.rest.table.columnProps.items.map((item: any) => item.value),
        [false, true],
      );
      assert.deepEqual(
        listProperties._operationsRow.rest.table.columnProps.actions.map(
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
        ['name', 'createdAt'],
      );
      assert.equal(section.children[2].block.render, 'basic-page:blockFilterActions');
    });
  });

  it('action:category:parentProjection', async () => {
    await app.bean.executor.mockCtx(async () => {
      const suffix = `${Date.now()}`;
      let parentId: number | string | undefined;
      let childId: number | string | undefined;
      await app.bean.passport.signinMock();
      try {
        parentId = await app.bean.executor.performAction('post', '/commerce/catalog/category', {
          body: { name: `presentation-parent-${suffix}`, published: false },
        });
        childId = await app.bean.executor.performAction('post', '/commerce/catalog/category', {
          body: {
            name: `presentation-child-${suffix}`,
            parentId,
            published: true,
          },
        });

        const view: any = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/category/:id',
          { params: { id: childId } },
        );
        assert.equal(String(view.parentId), String(parentId));
        assert.deepEqual(view.parent, { id: parentId, name: `presentation-parent-${suffix}` });
        assert.equal(view.published, true);

        const select: any = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/category',
        );
        const root = select.list.find((item: any) => String(item.id) === String(parentId));
        const child = select.list.find((item: any) => String(item.id) === String(childId));
        assert.equal(root.parent, undefined);
        assert.equal(root.published, false);
        assert.equal(String(child.parentId), String(parentId));
        assert.deepEqual(child.parent, { id: parentId, name: `presentation-parent-${suffix}` });
        assert.equal(child.published, true);

        await assert.rejects(
          app.bean.executor.performAction('patch', '/commerce/catalog/category/:id', {
            params: { id: childId },
            body: {
              name: `presentation-child-${suffix}`,
              parentId: childId,
              published: true,
            },
          }),
        );
      } finally {
        if (childId) {
          await app.bean.executor.performAction('delete', '/commerce/catalog/category/:id', {
            params: { id: childId },
          });
        }
        if (parentId) {
          await app.bean.executor.performAction('delete', '/commerce/catalog/category/:id', {
            params: { id: parentId },
          });
        }
        await app.bean.passport.signout();
      }
    });
  });
});
