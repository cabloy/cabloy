import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';
import { DtoOrderSelectResItem, DtoOrderView } from 'vona-module-commerce-trade';

function findComponent(apiJson: any, predicate: (properties: any) => boolean) {
  return Object.values(apiJson.components!.schemas as any).find(item => {
    return predicate((item as any).properties);
  }) as any;
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

function getListFilter(component: any) {
  const page = component?.rest?.blocks?.[0];
  const [filter, table, pager] = page?.options?.blocks ?? [];
  assert.equal(page?.render, 'basic-page:blockPage');
  assert.equal(filter?.render, 'basic-page:blockFilter');
  assert.equal(table?.render, 'basic-page:blockTable');
  assert.equal(pager?.render, 'basic-page:blockPager');
  return filter;
}

function assertCurrencyRenderer(field: any) {
  const options = { fixed: 2, exp: 2, zero: 2 };
  assert.equal(field.rest.form.render, 'basic-currency:formFieldCurrency');
  assert.deepEqual(field.rest.form.options, options);
  assert.equal(field.rest.table.render, 'basic-currency:currency');
  assert.deepEqual(field.rest.table.columnProps, options);
}

interface IFixture {
  orderId?: number;
  userId?: number;
}

async function cleanup(fixture: IFixture) {
  const trade = app.scope('commerce-trade');
  if (fixture.orderId !== undefined) {
    await trade.model.shipment.delete({ orderId: fixture.orderId });
    const lines = await trade.model.orderLine.select({ where: { orderId: fixture.orderId } });
    for (const line of lines) {
      await trade.model.stockReservation.delete({ orderLineId: line.id });
    }
    await trade.model.orderLine.delete({ orderId: fixture.orderId });
    await trade.model.order.delete({ id: fixture.orderId });
  }
  if (fixture.userId !== undefined) {
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  }
}

describe('orderPresentation.test.ts', { concurrency: false }, () => {
  let releaseTestLock: (() => void) | undefined;

  before(async () => {
    releaseTestLock = await acquireTestLock('a-commerce');
  });

  after(() => {
    releaseTestLock?.();
  });

  it('action:order:presentationMetadata', async () => {
    await app.bean.executor.mockCtx(async () => {
      const currencyOptions = { fixed: 2, exp: 2, zero: 2 };
      const viewJson = await app.bean.openapi.generateJsonOfClass(DtoOrderView);
      const viewComponent = findComponent(viewJson, properties => {
        return properties?.lines && properties?.addressSnapshot && properties?.shipment;
      });
      assert.deepEqual(Object.keys(viewComponent.properties).sort(), [
        '_lines',
        'addressSnapshot',
        'couponSnapshot',
        'createdAt',
        'currency',
        'discountCents',
        'eligibleSubtotalCents',
        'id',
        'lines',
        'payableTotalCents',
        'reservationExpiresAt',
        'shipment',
        'state',
        'updatedAt',
      ]);
      for (const field of ['iid', 'deleted', 'userId', 'addressId', 'correlationId', 'refund']) {
        assert.equal(viewComponent.properties[field], undefined);
      }
      assert.equal(
        viewComponent.properties.lines.rest.form.render,
        'basic-details:formFieldDetails',
      );
      assert.equal(viewComponent.properties._lines.rest.visible, false);
      assert.equal(viewComponent.properties.state.rest.form.render, 'basic-select:formFieldSelect');
      assert.equal(viewComponent.properties.state.rest.table.render, 'basic-select:select');
      assert.deepEqual(
        viewComponent.properties.state.rest.form.options.items.map((item: any) => item.value),
        [
          'awaiting_payment',
          'paid',
          'refund_requested',
          'refund_approved',
          'refund_rejected',
          'shipped',
          'refunded',
          'cancelled',
          'expired',
        ],
      );
      for (const field of ['eligibleSubtotalCents', 'discountCents', 'payableTotalCents']) {
        assertCurrencyRenderer(viewComponent.properties[field]);
      }
      assert.equal(
        viewComponent.properties.reservationExpiresAt.rest.form.render,
        'basic-date:formFieldDate',
      );
      assert.equal(
        viewComponent.properties.reservationExpiresAt.rest.table.render,
        'basic-date:date',
      );
      assert.equal(viewComponent.properties.createdAt.rest.form.render, 'basic-date:formFieldDate');
      assert.equal(viewComponent.properties.updatedAt.rest.table.render, 'basic-date:date');
      assert.deepEqual(
        getEntryToolbar(viewComponent).options.actions.map((action: any) => action.render),
        ['basic-form:actionBack'],
      );

      const lineComponent = findComponent(viewJson, properties => {
        return (
          properties?.skuCodeSnapshot &&
          properties?.eligibleSubtotalCents &&
          properties?.lineTotalCents
        );
      });
      assert.deepEqual(Object.keys(lineComponent.properties).sort(), [
        'eligibleSubtotalCents',
        'id',
        'lineTotalCents',
        'quantity',
        'skuAttributesSnapshot',
        'skuCodeSnapshot',
        'titleSnapshot',
        'unitPriceCents',
      ]);
      for (const field of ['orderId', 'skuId', 'productId', 'sku', 'product', '_operationsRow']) {
        assert.equal(lineComponent.properties[field], undefined);
      }
      assert.equal(lineComponent.properties.id.rest.visible, false);
      assertCurrencyRenderer(lineComponent.properties.unitPriceCents);
      assertCurrencyRenderer(lineComponent.properties.eligibleSubtotalCents);
      assertCurrencyRenderer(lineComponent.properties.lineTotalCents);
      assert.equal(lineComponent.rest.blocks[0].render, 'basic-details:blockDetails');
      assert.deepEqual(
        lineComponent.rest.blocks[0].options.blocks.map((block: any) => block.render),
        ['basic-details:blockTable'],
      );

      const listJson = await app.bean.openapi.generateJsonOfClass(DtoOrderSelectResItem);
      const listComponent = findComponent(listJson, properties => properties?._operationsRow);
      assert.deepEqual(Object.keys(listComponent.properties).sort(), [
        '_operationsRow',
        'createdAt',
        'id',
        'payableTotalCents',
        'reservationExpiresAt',
        'state',
      ]);
      for (const field of [
        'iid',
        'deleted',
        'userId',
        'addressId',
        'correlationId',
        'addressSnapshot',
        'couponSnapshot',
        'lines',
        'shipment',
      ]) {
        assert.equal(listComponent.properties[field], undefined);
      }
      assert.equal(listComponent.properties.id.rest.table.render, 'basic-table:actionView');
      assert.equal(listComponent.properties.state.rest.table.render, 'basic-select:select');
      assert.deepEqual(
        listComponent.properties.state.rest.table.columnProps.items.map((item: any) => item.value),
        viewComponent.properties.state.rest.form.options.items.map((item: any) => item.value),
      );
      assert.equal(
        listComponent.properties.payableTotalCents.rest.table.render,
        'basic-currency:currency',
      );
      assert.deepEqual(
        listComponent.properties.payableTotalCents.rest.table.columnProps,
        currencyOptions,
      );
      assert.equal(
        listComponent.properties.reservationExpiresAt.rest.table.render,
        'basic-date:date',
      );
      assert.equal(listComponent.properties.createdAt.rest.table.render, 'basic-date:date');
      assert.deepEqual(
        listComponent.properties._operationsRow.rest.table.columnProps.actions.map(
          (action: any) => action.render,
        ),
        ['commerce-trade:actionShip', 'commerce-trade:actionRefund', 'basic-table:actionView'],
      );
      const filter = getListFilter(listComponent);
      const section = filter.options.blocks[0].options.formLayout.children[0];
      assert.equal(section.type, 'section');
      assert.equal(section.layout, 'flow');
      assert.deepEqual(
        section.children.slice(0, 2).map((field: any) => field.name),
        ['state', 'createdAt'],
      );
      assert.equal(section.children[2].block.render, 'basic-page:blockFilterActions');
    });
  });

  it('action:order:runtimeBoundary', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      const suffix = randomUUID().slice(0, 12);
      const trade = app.scope('commerce-trade');
      try {
        const user = await app.bean.user.register({ name: `order-presentation-${suffix}` }, true);
        fixture.userId = user.id as number;
        const order = await trade.model.order.insert({
          userId: fixture.userId,
          addressId: 1,
          correlationId: `order-presentation-${suffix}`,
          addressSnapshot: {
            recipientName: 'Order Presentation',
            phone: '15555550123',
            countryCode: 'US',
            region: 'California',
            city: 'San Francisco',
            postalCode: '94105',
            addressLine1: '1 Market Street',
          },
          couponSnapshot: {
            couponGrantId: 1,
            couponTemplateId: 1,
            couponCode: `ORDER-${suffix}`,
            templateName: 'Order Presentation Coupon',
            currency: 'USD',
            fixedDiscountCents: 100,
            minSpendCents: 1,
            appliedDiscountCents: 100,
          },
          state: 'paid',
          currency: 'USD',
          eligibleSubtotalCents: 2_000,
          discountCents: 100,
          payableTotalCents: 1_900,
          reservationExpiresAt: new Date(Date.now() + 60_000),
        });
        fixture.orderId = order.id as number;
        await trade.model.orderLine.insert({
          orderId: fixture.orderId,
          skuId: 1,
          productId: 1,
          skuCodeSnapshot: `order-presentation-sku-${suffix}`,
          titleSnapshot: 'Order Presentation Product',
          skuAttributesSnapshot: [{ name: 'Color', value: 'Black' }],
          unitPriceCents: 1_000,
          quantity: 2,
          eligibleSubtotalCents: 2_000,
          lineTotalCents: 1_900,
        });
        await trade.model.shipment.insert({
          orderId: fixture.orderId,
          carrier: 'Cabloy Express',
          trackingNumber: `CAB-${suffix}`,
          operatorId: fixture.userId,
          shippedAt: new Date(),
          correlationId: `order-presentation-shipment-${suffix}`,
        });

        await app.bean.passport.signinMock();
        const view: any = await app.bean.executor.performAction(
          'get',
          '/commerce/trade/order/:id',
          { params: { id: fixture.orderId }, innerAccess: false },
        );
        assert.deepEqual(Object.keys(view).sort(), [
          'addressSnapshot',
          'couponSnapshot',
          'createdAt',
          'currency',
          'discountCents',
          'eligibleSubtotalCents',
          'id',
          'lines',
          'payableTotalCents',
          'reservationExpiresAt',
          'shipment',
          'state',
          'updatedAt',
        ]);
        for (const field of ['iid', 'deleted', 'userId', 'addressId', 'correlationId', 'refund']) {
          assert.equal(view[field], undefined);
        }
        assert.equal(view.addressSnapshot.city, 'San Francisco');
        assert.equal(view.couponSnapshot.couponCode, `ORDER-${suffix}`);
        assert.deepEqual(view.shipment, {
          id: view.shipment.id,
          carrier: 'Cabloy Express',
          trackingNumber: `CAB-${suffix}`,
          shippedAt: view.shipment.shippedAt,
        });
        assert.deepEqual(view.lines, [
          {
            id: view.lines[0].id,
            skuCodeSnapshot: `order-presentation-sku-${suffix}`,
            titleSnapshot: 'Order Presentation Product',
            skuAttributesSnapshot: [{ name: 'Color', value: 'Black' }],
            unitPriceCents: 1_000,
            quantity: 2,
            eligibleSubtotalCents: 2_000,
            lineTotalCents: 1_900,
          },
        ]);
        for (const field of ['orderId', 'skuId', 'productId', 'sku', 'product']) {
          assert.equal(view.lines[0][field], undefined);
        }

        const select: any = await app.bean.executor.performAction('get', '/commerce/trade/order', {
          query: { state: 'paid' },
          innerAccess: false,
        });
        const row = select.list.find((item: any) => String(item.id) === String(fixture.orderId));
        assert.ok(row);
        assert.deepEqual(Object.keys(row).sort(), [
          'createdAt',
          'id',
          'payableTotalCents',
          'reservationExpiresAt',
          'state',
        ]);
        assert.equal(row.state, 'paid');
        assert.equal(row.payableTotalCents, 1_900);
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });
});
