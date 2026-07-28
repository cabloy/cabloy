import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

interface IFixture {
  categoryId?: number;
  productId?: number;
  skuId?: number;
  addressId?: number;
  cartId?: number;
  orderId?: number;
  paymentAttemptId?: number;
  couponTemplateId?: number;
  couponGrantId?: number;
  userId?: number;
}

async function cleanup(fixture: IFixture) {
  const promotion = app.scope('commerce-promotion');
  const payment = app.scope('commerce-payment');
  const trade = app.scope('commerce-trade');
  const catalog = app.scope('commerce-catalog');
  const member = app.scope('commerce-member');
  if (fixture.orderId !== undefined) {
    const requests = await payment.model.refundRequest.select({
      where: { orderId: fixture.orderId },
    });
    for (const request of requests) {
      await payment.model.refundAudit.delete({ refundRequestId: request.id });
      await payment.model.refundAttempt.delete({ refundRequestId: request.id });
    }
    await payment.model.refundRequest.delete({ orderId: fixture.orderId });
    await trade.model.shipment.delete({ orderId: fixture.orderId });
  }
  if (fixture.paymentAttemptId !== undefined) {
    await payment.model.paymentAudit.delete({ paymentAttemptId: fixture.paymentAttemptId });
    await payment.model.paymentAttempt.delete({ id: fixture.paymentAttemptId });
  }
  if (fixture.orderId !== undefined) {
    await trade.model.orderAudit.delete({ orderId: fixture.orderId });
    const lines = await trade.model.orderLine.select({ where: { orderId: fixture.orderId } });
    for (const line of lines) {
      await trade.model.stockReservation.delete({ orderLineId: line.id });
    }
    await trade.model.orderLine.delete({ orderId: fixture.orderId });
    await trade.model.order.delete({ id: fixture.orderId });
  }
  if (fixture.cartId !== undefined) {
    await trade.model.cartItem.delete({ cartId: fixture.cartId });
    await trade.model.cart.delete({ id: fixture.cartId });
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
  if (fixture.userId !== undefined) {
    await app.scope('home-user').model.roleUser.delete({ userId: fixture.userId });
    await app.bean.user.removeById(fixture.userId);
  }
}

describe('orderSnapshot.test.ts', { concurrency: false }, () => {
  let releaseTestLock: (() => void) | undefined;

  before(async () => {
    releaseTestLock = await acquireTestLock('a-commerce');
  });

  after(() => {
    releaseTestLock?.();
  });

  it('persists catalog and address facts independently from later source changes', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      const suffix = randomUUID().slice(0, 12);
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

        const customerName = `snapshot-customer-${suffix}`;
        const customer = await app.bean.user.register({ name: customerName }, true);
        fixture.userId = customer.id as number;
        await app.bean.passport.signinMock(customerName as any);
        const customerId = app.bean.passport.currentUser!.id;
        assert.equal(String(customerId), String(fixture.userId));

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
          '/commerce/member/address/createMine',
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

  it('keeps immutable purchase facts in the refunded customer order view', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      const suffix = randomUUID().slice(0, 12);
      const original = {
        addressCity: 'San Francisco',
        addressLine1: '1 Market Street',
        couponName: `refund snapshot coupon ${suffix}`,
        productTitle: `refund snapshot product ${suffix}`,
        skuCode: `refund-snapshot-sku-${suffix}`,
        attributes: [{ name: 'Color', value: 'Black' }],
      };
      try {
        await app.bean.passport.signinMock();
        fixture.categoryId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/category',
          { body: { name: `refund snapshot category ${suffix}`, published: true } },
        );
        fixture.productId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/product',
          {
            body: { categoryId: fixture.categoryId, title: original.productTitle, published: true },
          },
        );
        fixture.skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
          body: {
            productId: fixture.productId,
            code: original.skuCode,
            priceCents: 1299,
            attributes: original.attributes,
            lifecycle: 'active',
          },
        });
        await app.scope('commerce-trade').service.stockBalance.adjustStock({
          skuId: fixture.skuId,
          delta: 1,
          reason: 'refund snapshot fixture',
          correlationId: `refund-snapshot-stock-${suffix}`,
        });
        await app.bean.passport.signout();

        const customerName = `refund-snapshot-customer-${suffix}`;
        const customer = await app.bean.user.register({ name: customerName }, true);
        fixture.userId = customer.id as number;
        await app.bean.passport.signinMock(customerName as any);
        const userId = app.bean.passport.currentUser!.id;
        fixture.couponTemplateId = (
          await app.scope('commerce-promotion').model.couponTemplate.insert({
            name: original.couponName,
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
        fixture.couponGrantId = (
          await app.scope('commerce-promotion').service.coupon.issue({
            templateId: fixture.couponTemplateId,
            userId,
            correlationId: `refund-snapshot-coupon-${suffix}`,
            reason: 'refund snapshot fixture',
          })
        ).id as number;
        fixture.addressId = await app.bean.executor.performAction(
          'post',
          '/commerce/member/address/createMine',
          {
            body: {
              recipientName: 'Refund Snapshot Recipient',
              phone: '15555550123',
              countryCode: 'US',
              region: 'California',
              city: original.addressCity,
              postalCode: '94105',
              addressLine1: original.addressLine1,
            },
          },
        );
        const cart = await app.scope('commerce-trade').model.cart.insert({ userId });
        fixture.cartId = cart.id as number;
        await app.scope('commerce-trade').model.cartItem.insert({
          cartId: cart.id,
          skuId: fixture.skuId,
          quantity: 1,
        });
        const checkout = await app.scope('commerce-trade').service.order.checkout({
          addressId: fixture.addressId,
          couponGrantId: fixture.couponGrantId,
          correlationId: `refund-snapshot-checkout-${suffix}`,
        });
        fixture.orderId = checkout.orderId as number;
        fixture.paymentAttemptId = checkout.paymentAttemptId as number;
        await app
          .scope('commerce-trade')
          .service.order.applyPaymentOutcome(fixture.paymentAttemptId, {
            outcome: 'succeeded',
            idempotencyKey: `refund-snapshot-payment-${suffix}`,
          });

        await app.scope('commerce-catalog').model.product.updateById(fixture.productId, {
          title: 'Changed refund product title',
          published: false,
        });
        await app.scope('commerce-catalog').model.sku.updateById(fixture.skuId, {
          code: 'changed-refund-sku-code',
          priceCents: 9999,
          attributes: [{ name: 'Color', value: 'Blue' }],
          lifecycle: 'inactive',
        });
        await app.scope('commerce-member').model.address.updateById(fixture.addressId, {
          city: 'Oakland',
          addressLine1: 'Changed refund address',
        });
        await app
          .scope('commerce-promotion')
          .model.couponTemplate.updateById(fixture.couponTemplateId, {
            name: 'Changed refund coupon',
            discountCents: 999,
          });

        await app.scope('commerce-trade').service.order.requestRefund(fixture.orderId, {
          reason: 'snapshot refund request',
          idempotencyKey: `refund-snapshot-request-${suffix}`,
        });
        await app.bean.passport.signout();
        await app.bean.passport.signinMock();
        await app.scope('commerce-trade').service.order.approveRefund(fixture.orderId, {
          reason: 'snapshot refund approval',
          idempotencyKey: `refund-snapshot-approval-${suffix}`,
        });
        await app.scope('commerce-trade').service.order.applyRefundOutcome(fixture.orderId, {
          outcome: 'succeeded',
          idempotencyKey: `refund-snapshot-outcome-${suffix}`,
        });
        await app.bean.passport.signout();
        await app.bean.passport.signinMock(customerName as any);

        const detail = await app.scope('commerce-trade').service.order.viewMine(fixture.orderId);
        assert.equal(detail?.state, 'refunded');
        assert.equal(detail?.shipment, undefined);
        assert.equal(detail?.addressSnapshot.city, original.addressCity);
        assert.equal(detail?.addressSnapshot.addressLine1, original.addressLine1);
        assert.equal(detail?.couponSnapshot?.templateName, original.couponName);
        assert.equal(detail?.couponSnapshot?.fixedDiscountCents, 500);
        assert.equal(detail?.discountCents, 500);
        assert.equal(detail?.payableTotalCents, 799);
        assert.equal(detail?.lines.length, 1);
        assert.deepEqual(
          detail?.lines[0] && {
            skuCodeSnapshot: detail.lines[0].skuCodeSnapshot,
            titleSnapshot: detail.lines[0].titleSnapshot,
            skuAttributesSnapshot: detail.lines[0].skuAttributesSnapshot,
            unitPriceCents: detail.lines[0].unitPriceCents,
            quantity: detail.lines[0].quantity,
            lineTotalCents: detail.lines[0].lineTotalCents,
          },
          {
            skuCodeSnapshot: original.skuCode,
            titleSnapshot: original.productTitle,
            skuAttributesSnapshot: original.attributes,
            unitPriceCents: 1299,
            quantity: 1,
            lineTotalCents: 1299,
          },
        );
        const liveProduct = await app
          .scope('commerce-catalog')
          .model.product.getById(fixture.productId);
        const liveSku = await app.scope('commerce-catalog').model.sku.getById(fixture.skuId);
        const liveAddress = await app
          .scope('commerce-member')
          .model.address.getById(fixture.addressId);
        const liveCoupon = await app
          .scope('commerce-promotion')
          .model.couponTemplate.getById(fixture.couponTemplateId);
        assert.deepEqual(
          [
            liveProduct?.title,
            liveSku?.code,
            liveSku?.priceCents,
            liveAddress?.city,
            liveCoupon?.name,
          ],
          [
            'Changed refund product title',
            'changed-refund-sku-code',
            9999,
            'Oakland',
            'Changed refund coupon',
          ],
        );
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });
});
