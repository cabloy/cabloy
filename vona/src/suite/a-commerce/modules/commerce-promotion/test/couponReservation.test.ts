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

describe('couponReservation.test.ts', () => {
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
            totalIssueLimit: 1,
            totalUsageLimit: 1,
            perCustomerIssueLimit: 1,
            issuedCount: 0,
            redeemedCount: 0,
          })
        ).id as number;
        const coupon = app.scope('commerce-promotion').service.coupon;
        const grant = await coupon.issue({
          templateId: fixture.templateId,
          userId: customer.id,
          correlationId: `issue-${suffix}`,
          reason: 'test issue',
        });
        fixture.grantId = grant.id as number;
        assert.equal(grant.state, 'available');
        assert.equal(grant.discountCentsSnapshot, 500);

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

        const released = await coupon.release({
          couponGrantId: grant.id,
          orderId: 100_001,
          correlationId: `release-${suffix}`,
          reason: 'test release',
        });
        assert.equal(released.state, 'available');
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
