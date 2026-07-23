import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

interface IFixture {
  templateId?: number;
  grantId?: number;
}

async function cleanup(fixture: IFixture) {
  const promotion = app.scope('commerce-promotion');
  if (fixture.grantId !== undefined) {
    await promotion.model.couponAudit.delete({ couponGrantId: fixture.grantId });
    await promotion.model.couponGrant.delete({ id: fixture.grantId });
  }
  if (fixture.templateId !== undefined) {
    await promotion.model.couponTemplate.delete({ id: fixture.templateId });
  }
}

describe('couponReservation.test.ts', { concurrency: false }, () => {
  it('enforces fixed-discount eligibility and exact-once transitions', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      const suffix = randomUUID().slice(0, 12);
      try {
        const customerName = `coupon-customer-${suffix}`;
        await app.bean.user.register({ name: customerName }, true);
        await app.bean.passport.signinMock(customerName as any);
        const customer = app.bean.passport.currentUser!;
        fixture.templateId = (
          await app.scope('commerce-promotion').model.couponTemplate.insert({
            name: `Coupon ${suffix}`,
            state: 'active',
            currency: 'USD',
            discountCents: 500,
            minSpendCents: 1000,
            validFrom: new Date(Date.now() - 1_000),
            validUntil: new Date(Date.now() + 60_000),
            totalIssueLimit: 2,
            totalUsageLimit: 1,
            perCustomerIssueLimit: 3,
            issuedCount: 0,
            redeemedCount: 0,
          })
        ).id as number;
        const coupon = app.scope('commerce-promotion').service.coupon;
        const [, issuanceLengthError] = await catchError(() =>
          coupon.issue({
            templateId: fixture.templateId!,
            userId: customer.id,
            correlationId: 'x'.repeat(81),
            reason: 'test overlong issue correlation',
          }),
        );
        assert.equal(issuanceLengthError?.code, 400);
        assert.equal(
          await app
            .scope('commerce-promotion')
            .model.couponGrant.get({ couponCode: 'x'.repeat(81) }),
          undefined,
        );
        const grant = await coupon.issue({
          templateId: fixture.templateId,
          userId: customer.id,
          correlationId: `issue-${suffix}`,
          reason: 'test issue',
        });
        fixture.grantId = grant.id as number;
        assert.equal(grant.state, 'available');
        assert.equal(grant.discountCentsSnapshot, 500);
        const exactLimitGrant = await coupon.issue({
          templateId: fixture.templateId,
          userId: customer.id,
          correlationId: 'a'.repeat(80),
          reason: 'test exact issue correlation limit',
        });
        assert.equal(exactLimitGrant.couponCode.length, 80);
        await app.scope('commerce-promotion').model.couponAudit.delete({
          couponGrantId: exactLimitGrant.id,
        });
        await app.scope('commerce-promotion').model.couponGrant.delete({ id: exactLimitGrant.id });
        await app.scope('commerce-promotion').model.couponTemplate.updateById(fixture.templateId, {
          issuedCount: 1,
        });

        const [_, belowMinimumError] = await catchError(() =>
          coupon.reserve({
            couponGrantId: grant.id,
            userId: customer.id,
            orderId: 100_001,
            eligibleSubtotalCents: 999,
            currency: 'USD',
            correlationId: `reserve-too-small-${suffix}`,
            reason: 'test reserve',
          }),
        );
        assert.equal(belowMinimumError?.code, 409);
        assert.equal(
          (await app.scope('commerce-promotion').model.couponGrant.getById(grant.id))?.state,
          'available',
        );

        const reserved = await coupon.reserve({
          couponGrantId: grant.id,
          userId: customer.id,
          orderId: 100_001,
          eligibleSubtotalCents: 1_200,
          currency: 'USD',
          correlationId: `reserve-${suffix}`,
          reason: 'test reserve',
        });
        assert.equal(reserved.discountCents, 500);
        assert.equal(reserved.couponGrant.state, 'reserved');
        const replay = await coupon.reserve({
          couponGrantId: grant.id,
          userId: customer.id,
          orderId: 100_001,
          eligibleSubtotalCents: 1_200,
          currency: 'USD',
          correlationId: `reserve-${suffix}`,
          reason: 'test reserve',
        });
        assert.equal(replay.couponGrant.id, grant.id);
        const [, wrongCustomerError] = await catchError(() =>
          coupon.reserve({
            couponGrantId: grant.id,
            userId: customer.id + 10_000,
            orderId: 100_001,
            eligibleSubtotalCents: 1_200,
            currency: 'USD',
            correlationId: `reserve-wrong-customer-${suffix}`,
            reason: 'test wrong customer',
          }),
        );
        assert.equal(wrongCustomerError?.code, 404);
        const reserveAuditsBeforeRelease = await app
          .scope('commerce-promotion')
          .model.couponAudit.select({ where: { couponGrantId: grant.id } });
        assert.deepEqual(
          reserveAuditsBeforeRelease.map(item => item.operation),
          ['issue', 'reserve'],
        );

        const released = await coupon.release({
          couponGrantId: grant.id,
          orderId: 100_001,
          correlationId: `release-${suffix}`,
          reason: 'test release',
        });
        assert.equal(released.state, 'available');
        const releasedPersisted = await app
          .scope('commerce-promotion')
          .model.couponGrant.getById(grant.id);
        assert.equal(releasedPersisted?.reservationOrderId, null);
        assert.equal(releasedPersisted?.reservationCorrelationId, null);
        assert.equal(releasedPersisted?.reservedAt, null);
        const releaseReplay = await coupon.release({
          couponGrantId: grant.id,
          orderId: 100_001,
          correlationId: `release-${suffix}`,
          reason: 'test release',
        });
        assert.equal(releaseReplay.state, 'available');
        const releaseAudits = await app.scope('commerce-promotion').model.couponAudit.select({
          where: { couponGrantId: grant.id, operation: 'release' },
        });
        assert.equal(releaseAudits.length, 1);
        const reservedAgain = await coupon.reserve({
          couponGrantId: grant.id,
          userId: customer.id,
          orderId: 100_002,
          eligibleSubtotalCents: 1_000,
          currency: 'USD',
          correlationId: `reserve-again-${suffix}`,
          reason: 'test reserve again',
        });
        assert.equal(reservedAgain.discountCents, 500);
        const anotherGrant = await coupon.issue({
          templateId: fixture.templateId,
          userId: customer.id,
          correlationId: `issue-another-${suffix}`,
          reason: 'test second grant',
        });
        const [, secondCouponError] = await catchError(() =>
          coupon.reserve({
            couponGrantId: anotherGrant.id,
            userId: customer.id,
            orderId: 100_002,
            eligibleSubtotalCents: 1_200,
            currency: 'USD',
            correlationId: `reserve-another-${suffix}`,
            reason: 'test second coupon',
          }),
        );
        assert.equal(secondCouponError?.code, 409);
        assert.equal(
          (await app.scope('commerce-promotion').model.couponGrant.getById(anotherGrant.id))?.state,
          'available',
        );
        await app.scope('commerce-promotion').model.couponAudit.delete({
          couponGrantId: anotherGrant.id,
        });
        await app.scope('commerce-promotion').model.couponGrant.delete({ id: anotherGrant.id });
        await app.scope('commerce-promotion').model.couponTemplate.updateById(fixture.templateId, {
          issuedCount: 1,
        });
        const redeemed = await coupon.redeem({
          couponGrantId: grant.id,
          orderId: 100_002,
          correlationId: `redeem-${suffix}`,
          reason: 'test redeem',
        });
        assert.equal(redeemed.state, 'redeemed');
        const [__, releaseError] = await catchError(() =>
          coupon.release({
            couponGrantId: grant.id,
            orderId: 100_002,
            correlationId: `release-after-redeem-${suffix}`,
            reason: 'must fail',
          }),
        );
        assert.equal(releaseError?.code, 409);
        const template = await app
          .scope('commerce-promotion')
          .model.couponTemplate.getById(fixture.templateId);
        assert.equal(template?.issuedCount, 1);
        assert.equal(template?.redeemedCount, 1);
        const audit = await app.scope('commerce-promotion').model.couponAudit.select({
          where: { couponGrantId: grant.id },
          orders: [['id', 'asc']],
        });
        assert.deepEqual(
          audit.map(item => item.operation),
          ['issue', 'reserve', 'release', 'reserve', 'redeem'],
        );
      } finally {
        await cleanup(fixture);
        await app.bean.passport.signout();
      }
    });
  });
});
