import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

interface IFixture {
  categoryId?: number;
  productId?: number;
  skuId?: number;
  addressId?: number;
  orderId?: number;
  couponTemplateId?: number;
  couponGrantId?: number;
}

async function cleanup(fixture: IFixture) {
  const promotion = app.scope('commerce-promotion');
  const trade = app.scope('commerce-trade');
  const catalog = app.scope('commerce-catalog');
  const member = app.scope('commerce-member');
  if (fixture.orderId !== undefined) {
    const lines = await trade.model.orderLine.select({ where: { orderId: fixture.orderId } });
    for (const line of lines) {
      await trade.model.stockReservation.delete({ orderLineId: line.id });
    }
    await trade.model.orderLine.delete({ orderId: fixture.orderId });
    await trade.model.order.delete({ id: fixture.orderId });
  }
  if (fixture.couponGrantId !== undefined) {
    await promotion.model.couponAudit.delete({ couponGrantId: fixture.couponGrantId });
    await promotion.model.couponGrant.delete({ id: fixture.couponGrantId });
  }
  if (fixture.couponTemplateId !== undefined) {
    await promotion.model.couponTemplate.delete({ id: fixture.couponTemplateId });
  }
  if (fixture.skuId !== undefined) {
    await trade.model.stockAudit.delete({ skuId: fixture.skuId });
    await trade.model.stockReservation.delete({ skuId: fixture.skuId });
    await trade.model.stockBalance.delete({ skuId: fixture.skuId });
    await catalog.model.sku.delete({ id: fixture.skuId });
  }
  if (fixture.productId !== undefined)
    await catalog.model.product.delete({ id: fixture.productId });
  if (fixture.categoryId !== undefined)
    await catalog.model.category.delete({ id: fixture.categoryId });
  if (fixture.addressId !== undefined) await member.model.address.delete({ id: fixture.addressId });
}

describe('orderSnapshot.test.ts', { concurrency: false }, () => {
  it('persists catalog and address facts independently from later source changes', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      const suffix = `${Date.now()}`;
      try {
        await app.bean.passport.signinMock();
        fixture.categoryId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/category',
          {
            body: { name: `snapshot category ${suffix}`, published: true },
          },
        );
        fixture.productId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/product',
          {
            body: {
              categoryId: fixture.categoryId,
              title: `snapshot product ${suffix}`,
              published: true,
            },
          },
        );
        fixture.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
          body: {
            productId: fixture.productId,
            code: `snapshot-sku-${suffix}`,
            priceCents: 1299,
            attributes: [{ name: 'Color', value: 'Black' }],
            lifecycle: 'active',
          },
        });
        await app.scope('commerce-trade').service.stockBalance.adjustStock({
          skuId: fixture.skuId,
          delta: 2,
          reason: 'snapshot fixture',
          correlationId: `snapshot-stock-${suffix}`,
        });
        await app.bean.passport.signout();
        await app.bean.passport.signinMock();
        fixture.couponTemplateId = (
          await app.scope('commerce-promotion').model.couponTemplate.insert({
            name: `snapshot coupon ${suffix}`,
            state: 'active',
            currency: 'USD',
            discountCents: 500,
            minSpendCents: 1_000,
            validFrom: new Date(Date.now() - 1_000),
            validUntil: new Date(Date.now() + 60_000),
            issuedCount: 0,
            redeemedCount: 0,
          })
        ).id as number;
        const customerId = app.bean.passport.currentUser!.id;
        fixture.couponGrantId = (
          await app.scope('commerce-promotion').service.coupon.issue({
            templateId: fixture.couponTemplateId,
            userId: customerId,
            correlationId: `snapshot-coupon-${suffix}`,
            reason: 'snapshot fixture',
          })
        ).id as number;
        fixture.addressId = await app.bean.executor.performAction(
          'post',
          '/commerce/member/address',
          {
            body: {
              recipientName: 'Snapshot Recipient',
              phone: '15555550123',
              countryCode: 'US',
              region: 'California',
              city: 'San Francisco',
              postalCode: '94105',
              addressLine1: '1 Market Street',
            },
          },
        );

        const created = await app.scope('commerce-trade').service.order.createSnapshot({
          addressId: fixture.addressId,
          couponGrantId: fixture.couponGrantId,
          correlationId: `snapshot-order-${suffix}`,
          lines: [{ skuId: fixture.skuId, quantity: 2 }],
        });
        fixture.orderId = created.order.id as number;
        const replay = await app.scope('commerce-trade').service.order.createSnapshot({
          addressId: fixture.addressId,
          couponGrantId: fixture.couponGrantId,
          correlationId: `snapshot-order-${suffix}`,
          lines: [{ skuId: fixture.skuId, quantity: 2 }],
        });
        assert.equal(replay.order.id, created.order.id);
        assert.equal(replay.lines[0].id, created.lines[0].id);
        const [_, conflict] = await catchError(() =>
          app.scope('commerce-trade').service.order.createSnapshot({
            addressId: fixture.addressId,
            correlationId: `snapshot-order-${suffix}`,
            lines: [{ skuId: fixture.skuId, quantity: 1 }],
          }),
        );
        assert.equal(conflict?.code, 409);
        assert.equal(created.order.discountCents, 500);
        assert.equal(created.order.payableTotalCents, 2098);
        assert.equal(created.order.couponSnapshot?.couponGrantId, fixture.couponGrantId);
        assert.equal(created.order.couponSnapshot?.couponCode, `snapshot-coupon-${suffix}`);
        assert.equal(created.lines[0].titleSnapshot, `snapshot product ${suffix}`);
        assert.deepEqual(created.lines[0].skuAttributesSnapshot, [
          { name: 'Color', value: 'Black' },
        ]);

        await app.scope('commerce-catalog').model.product.updateById(fixture.productId, {
          title: 'Changed product title',
          published: false,
        });
        await app.scope('commerce-catalog').model.sku.updateById(fixture.skuId, {
          code: 'changed-sku-code',
          priceCents: 9999,
          attributes: [{ name: 'Color', value: 'Blue' }],
          lifecycle: 'inactive',
        });
        await app.scope('commerce-member').model.address.updateById(fixture.addressId, {
          city: 'Oakland',
          addressLine1: 'Changed address',
        });

        const snapshot = await app
          .scope('commerce-trade')
          .service.order.viewSnapshot(created.order.id);
        assert.equal(snapshot?.order.addressSnapshot.city, 'San Francisco');
        assert.equal(snapshot?.order.addressSnapshot.addressLine1, '1 Market Street');
        assert.equal(snapshot?.order.discountCents, 500);
        assert.equal(snapshot?.order.payableTotalCents, 2098);
        assert.equal(snapshot?.order.couponSnapshot?.templateName, `snapshot coupon ${suffix}`);
        assert.equal(snapshot?.lines.length, 1);
        assert.equal(snapshot?.lines[0].skuCodeSnapshot, `snapshot-sku-${suffix}`);
        assert.equal(snapshot?.lines[0].titleSnapshot, `snapshot product ${suffix}`);
        assert.deepEqual(snapshot?.lines[0].skuAttributesSnapshot, [
          { name: 'Color', value: 'Black' },
        ]);
        assert.equal(snapshot?.lines[0].unitPriceCents, 1299);
        assert.equal(snapshot?.lines[0].eligibleSubtotalCents, 2598);
        assert.equal(snapshot?.lines[0].lineTotalCents, 2598);
        const reservation = await app.scope('commerce-trade').model.stockReservation.get({
          orderLineId: created.lines[0].id,
        });
        assert.equal(reservation?.state, 'reserved');
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });
});
