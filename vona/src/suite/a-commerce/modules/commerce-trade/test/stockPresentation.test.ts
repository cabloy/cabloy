import type { DtoStockAdjust } from 'vona-module-commerce-trade';

import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';
import {
  DtoStockAuditSelectResItem,
  DtoStockAuditView,
  DtoStockBalanceSelectResItem,
  DtoStockBalanceView,
} from 'vona-module-commerce-trade';

function findComponent(apiJson: any, predicate: (properties: any) => boolean) {
  return Object.values(apiJson.components!.schemas as any).find(item => {
    return predicate((item as any).properties);
  }) as any;
}

function assertStockSkuRef(apiJson: any, schema: any) {
  const ref = schema?.$ref;
  assert.equal(typeof ref, 'string');
  const componentName = ref.slice('#/components/schemas/'.length);
  const component = apiJson.components?.schemas?.[componentName];
  assert.ok(component);
  assert.deepEqual(Object.keys(component.properties).sort(), ['code', 'id']);
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

function assertFilter(component: any) {
  const filter = getListFilter(component);
  const section = filter.options.blocks[0].options.formLayout.children[0];
  assert.equal(section.type, 'section');
  assert.equal(section.layout, 'flow');
  assert.deepEqual(
    section.children.slice(0, 2).map((field: any) => field.name),
    ['skuId', 'createdAt'],
  );
  assert.equal(section.children[2].block.render, 'basic-page:blockFilterActions');
}

interface IStockFixture {
  categoryId: number;
  productId: number;
  skuId: number;
}

type IStockFixturePartial = Partial<IStockFixture>;

async function dropStockFixture(fixture: IStockFixturePartial | undefined) {
  if (!fixture) return;
  const trade = app.scope('commerce-trade');
  const catalog = app.scope('commerce-catalog');
  if (fixture.skuId !== undefined) {
    await trade.model.stockAudit.delete({ skuId: fixture.skuId });
    await trade.model.stockReservation.delete({ skuId: fixture.skuId });
    await trade.model.stockBalance.delete({ skuId: fixture.skuId });
    await catalog.model.sku.delete({ id: fixture.skuId });
  }
  if (fixture.productId !== undefined) {
    await catalog.model.product.delete({ id: fixture.productId });
  }
  if (fixture.categoryId !== undefined) {
    await catalog.model.category.delete({ id: fixture.categoryId });
  }
}

async function createSku(suffix: string): Promise<IStockFixture> {
  const fixture: IStockFixturePartial = {};
  try {
    fixture.categoryId = await app.bean.executor.performAction(
      'post',
      '/commerce/catalog/category',
      {
        body: { name: `presentation-stock-category-${suffix}`, published: true },
      },
    );
    fixture.productId = await app.bean.executor.performAction('post', '/commerce/catalog/product', {
      body: {
        categoryId: fixture.categoryId,
        title: `presentation-stock-product-${suffix}`,
        published: true,
      },
    });
    fixture.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
      body: {
        productId: fixture.productId,
        code: `presentation-stock-sku-${suffix}`,
        priceCents: 100,
        lifecycle: 'active',
      },
    });
    return fixture as IStockFixture;
  } catch (error) {
    await dropStockFixture(fixture);
    throw error;
  }
}

function stockAdjust(skuId: number, suffix: string): DtoStockAdjust {
  return {
    skuId,
    delta: 7,
    reason: `presentation stock ${suffix}`,
    correlationId: `presentation-stock-${suffix}`,
  };
}

describe('stockPresentation.test.ts', { concurrency: false }, () => {
  let releaseTestLock: (() => void) | undefined;

  before(async () => {
    releaseTestLock = await acquireTestLock('a-commerce');
  });

  after(() => {
    releaseTestLock?.();
  });

  it('action:stock:presentationMetadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const skuPickerOptions = {
        resource: 'commerce-catalog:sku',
        relationName: 'sku',
        selectOptions: { itemValue: 'id', itemTitle: 'code' },
      };
      const balanceListJson = await app.bean.openapi.generateJsonOfClass(
        DtoStockBalanceSelectResItem,
      );
      const balanceList = findComponent(
        balanceListJson,
        properties =>
          properties?._operationsRow && properties?.skuId && properties?.sku && properties?.onHand,
      );
      assert.deepEqual(Object.keys(balanceList.properties).sort(), [
        '_operationsRow',
        'available',
        'id',
        'onHand',
        'reserved',
        'sku',
        'skuId',
      ]);
      assertStockSkuRef(balanceListJson, balanceList.properties.sku);
      assert.equal(balanceList.properties.skuId.rest.table.render, 'basic-resource:resourcePicker');
      assert.deepEqual(balanceList.properties.skuId.rest.table.columnProps, skuPickerOptions);
      assert.deepEqual(
        balanceList.properties._operationsRow.rest.table.columnProps.actions.map(
          (action: any) => action.render,
        ),
        ['basic-table:actionView'],
      );
      assertFilter(balanceList);

      const balanceViewJson = await app.bean.openapi.generateJsonOfClass(DtoStockBalanceView);
      const balanceView = findComponent(balanceViewJson, properties => {
        return (
          properties?.sku && properties?.available && properties?.createdAt && properties?.updatedAt
        );
      });
      assert.deepEqual(Object.keys(balanceView.properties).sort(), [
        'available',
        'createdAt',
        'id',
        'onHand',
        'reserved',
        'sku',
        'skuId',
        'updatedAt',
      ]);
      assertStockSkuRef(balanceViewJson, balanceView.properties.sku);
      assert.equal(
        balanceView.properties.skuId.rest.form.render,
        'basic-resource:formFieldResourcePicker',
      );
      assert.deepEqual(balanceView.properties.skuId.rest.form.options, skuPickerOptions);
      assert.equal(balanceView.properties.createdAt.rest.table.render, 'basic-date:date');
      assert.equal(balanceView.properties.updatedAt.rest.table.render, 'basic-date:date');
      assert.equal(updatedAtVisible(balanceView), true);
      assert.deepEqual(
        getEntryToolbar(balanceView).options.actions.map((action: any) => action.render),
        ['basic-form:actionBack'],
      );

      const auditListJson = await app.bean.openapi.generateJsonOfClass(DtoStockAuditSelectResItem);
      const auditList = findComponent(
        auditListJson,
        properties =>
          properties?._operationsRow &&
          properties?.skuId &&
          properties?.sku &&
          properties?.operation,
      );
      assert.deepEqual(Object.keys(auditList.properties).sort(), [
        '_operationsRow',
        'createdAt',
        'delta',
        'id',
        'operation',
        'sku',
        'skuId',
      ]);
      assertStockSkuRef(auditListJson, auditList.properties.sku);
      assert.equal(auditList.properties.skuId.rest.table.render, 'basic-resource:resourcePicker');
      assert.deepEqual(auditList.properties.skuId.rest.table.columnProps, skuPickerOptions);
      assert.equal(auditList.properties.id.rest.table.render, 'basic-table:actionView');
      assert.deepEqual(
        auditList.properties._operationsRow.rest.table.columnProps.actions.map(
          (action: any) => action.render,
        ),
        ['basic-table:actionView'],
      );
      assertFilter(auditList);

      const auditViewJson = await app.bean.openapi.generateJsonOfClass(DtoStockAuditView);
      const auditView = findComponent(auditViewJson, properties => {
        return (
          properties?.sku &&
          properties?.stockBalanceId &&
          properties?.priorAvailable &&
          properties?.actorId
        );
      });
      assert.deepEqual(Object.keys(auditView.properties).sort(), [
        'actorId',
        'available',
        'correlationId',
        'createdAt',
        'delta',
        'id',
        'onHand',
        'operation',
        'priorAvailable',
        'priorOnHand',
        'priorReserved',
        'reason',
        'reserved',
        'sku',
        'skuId',
        'stockBalanceId',
        'stockReservationId',
        'updatedAt',
      ]);
      assertStockSkuRef(auditViewJson, auditView.properties.sku);
      assert.equal(
        auditView.properties.skuId.rest.form.render,
        'basic-resource:formFieldResourcePicker',
      );
      assert.deepEqual(auditView.properties.skuId.rest.form.options, skuPickerOptions);
      assert.equal(auditView.properties.createdAt.rest.form.render, 'basic-date:formFieldDate');
      assert.equal(auditView.properties.updatedAt.rest.form.render, 'basic-date:formFieldDate');
      assert.deepEqual(
        getEntryToolbar(auditView).options.actions.map((action: any) => action.render),
        ['basic-form:actionBack'],
      );

      for (const component of [balanceList, balanceView, auditList, auditView]) {
        assert.equal(component.properties.iid, undefined);
        assert.equal(component.properties.deleted, undefined);
      }
    });
  });

  it('action:stock:runtimeBoundary', async () => {
    await app.bean.executor.mockCtx(async () => {
      let fixture: IStockFixture | undefined;
      const suffix = randomUUID().slice(0, 12);
      await app.bean.passport.signinMock();
      try {
        fixture = await createSku(suffix);
        const balance: any = await app.bean.executor.performAction(
          'post',
          '/commerce/trade/stockBalance/adjustStock',
          { body: stockAdjust(fixture.skuId, suffix) },
        );
        assert.equal(balance.onHand, 7);
        assert.equal(balance.reserved, 0);
        assert.equal(balance.available, 7);
        assert.equal(balance.sku, undefined);

        const balanceView: any = await app.bean.executor.performAction(
          'get',
          '/commerce/trade/stockBalance/:id',
          { params: { id: balance.id } },
        );
        assert.deepEqual(Object.keys(balanceView).sort(), [
          'available',
          'createdAt',
          'id',
          'onHand',
          'reserved',
          'sku',
          'skuId',
          'updatedAt',
        ]);
        assert.equal(balanceView.available, balanceView.onHand - balanceView.reserved);
        assert.deepEqual(balanceView.sku, {
          id: fixture.skuId,
          code: `presentation-stock-sku-${suffix}`,
        });

        const balanceList: any = await app.bean.executor.performAction(
          'get',
          '/commerce/trade/stockBalance',
          { query: { skuId: fixture.skuId } },
        );
        assert.equal(balanceList.list.length, 1);
        assert.deepEqual(Object.keys(balanceList.list[0]).sort(), [
          'available',
          'id',
          'onHand',
          'reserved',
          'sku',
          'skuId',
        ]);
        assert.deepEqual(balanceList.list[0].sku, {
          id: fixture.skuId,
          code: `presentation-stock-sku-${suffix}`,
        });

        const auditList: any = await app.bean.executor.performAction(
          'get',
          '/commerce/trade/stockAudit',
          {
            query: { skuId: fixture.skuId },
          },
        );
        assert.equal(auditList.list.length, 1);
        assert.deepEqual(Object.keys(auditList.list[0]).sort(), [
          'createdAt',
          'delta',
          'id',
          'operation',
          'sku',
          'skuId',
        ]);
        assert.deepEqual(auditList.list[0].sku, {
          id: fixture.skuId,
          code: `presentation-stock-sku-${suffix}`,
        });

        const auditView: any = await app.bean.executor.performAction(
          'get',
          '/commerce/trade/stockAudit/:id',
          { params: { id: auditList.list[0].id } },
        );
        assert.deepEqual(Object.keys(auditView).sort(), [
          'actorId',
          'available',
          'correlationId',
          'createdAt',
          'delta',
          'id',
          'onHand',
          'operation',
          'priorAvailable',
          'priorOnHand',
          'priorReserved',
          'reason',
          'reserved',
          'sku',
          'skuId',
          'stockBalanceId',
          'stockReservationId',
          'updatedAt',
        ]);
        assert.equal(auditView.delta, 7);
        assert.equal(auditView.priorAvailable, 0);
        assert.equal(auditView.available, 7);
        assert.equal(auditView.correlationId, `presentation-stock-${suffix}`);
        assert.equal(auditView.reason, `presentation stock ${suffix}`);
        assert.equal(String(auditView.actorId), String(app.bean.passport.currentUser!.id));
        assert.deepEqual(auditView.sku, {
          id: fixture.skuId,
          code: `presentation-stock-sku-${suffix}`,
        });

        const renamedSkuCode = `presentation-stock-sku-renamed-${suffix}`;
        await app.bean.executor.performAction('patch', '/commerce/catalog/sku/:id', {
          params: { id: fixture.skuId },
          body: {
            code: renamedSkuCode,
            productId: fixture.productId,
            priceCents: 100,
            lifecycle: 'active',
          },
        });
        const renamedAuditList: any = await app.bean.executor.performAction(
          'get',
          '/commerce/trade/stockAudit',
          { query: { skuId: fixture.skuId } },
        );
        assert.equal(renamedAuditList.list.length, 1);
        assert.deepEqual(renamedAuditList.list[0].sku, { id: fixture.skuId, code: renamedSkuCode });
        const renamedAuditView: any = await app.bean.executor.performAction(
          'get',
          '/commerce/trade/stockAudit/:id',
          { params: { id: auditView.id } },
        );
        assert.equal(renamedAuditView.skuId, auditView.skuId);
        assert.equal(renamedAuditView.delta, auditView.delta);
        assert.equal(renamedAuditView.reason, auditView.reason);
        assert.equal(renamedAuditView.correlationId, auditView.correlationId);
        assert.deepEqual(renamedAuditView.sku, { id: fixture.skuId, code: renamedSkuCode });
        for (const field of ['iid', 'deleted']) assert.equal(auditView[field], undefined);
      } finally {
        await dropStockFixture(fixture);
        await app.bean.passport.signout();
      }
    });
  });
});

function updatedAtVisible(component: any) {
  return component.properties.updatedAt.rest.visible !== false;
}
