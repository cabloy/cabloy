import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

import type { EntityCouponGrant } from '../src/entity/couponGrant.tsx';
import type { EntityCouponTemplate } from '../src/entity/couponTemplate.tsx';

interface IFixture {
  templateId?: number;
  grantId?: number;
  userId?: number;
  templateIds?: number[];
  grantIds?: number[];
  userIds?: number[];
}

function createTestId() {
  return randomUUID().slice(0, 12);
}

async function cleanup(fixture: IFixture) {
  const promotion = app.scope('commerce-promotion');
  const grantIds = [...new Set([fixture.grantId, ...(fixture.grantIds ?? [])].filter(Boolean))];
  const templateIds = [
    ...new Set([fixture.templateId, ...(fixture.templateIds ?? [])].filter(Boolean)),
  ];
  const userIds = [...new Set([fixture.userId, ...(fixture.userIds ?? [])].filter(Boolean))];
  for (const grantId of grantIds) {
    await promotion.model.couponAudit.delete({ couponGrantId: grantId });
    await promotion.model.couponGrant.delete({ id: grantId });
  }
  for (const templateId of templateIds) {
    await promotion.model.couponTemplate.delete({ id: templateId });
  }
  for (const userId of userIds) {
    await app.scope('home-user').model.roleUser.delete({ userId });
    await app.bean.user.removeById(userId);
  }
}

async function createTemplate(
  fixture: IFixture,
  suffix: string,
  overrides: Partial<EntityCouponTemplate> = {},
): Promise<EntityCouponTemplate> {
  const now = Date.now();
  const template = await app.scope('commerce-promotion').model.couponTemplate.insert({
    name: `Coupon ${suffix}`,
    state: 'active',
    currency: 'USD',
    discountCents: 500,
    minSpendCents: 1_000,
    validFrom: new Date(now - 60_000),
    validUntil: new Date(now + 60_000),
    issuedCount: 0,
    redeemedCount: 0,
    ...overrides,
  });
  (fixture.templateIds ??= []).push(template.id as number);
  return template;
}

async function createGrant(
  fixture: IFixture,
  template: EntityCouponTemplate,
  userId: number,
  suffix: string,
  overrides: Partial<EntityCouponGrant> = {},
): Promise<EntityCouponGrant> {
  const grant = await app.scope('commerce-promotion').model.couponGrant.insert({
    templateId: template.id,
    userId,
    couponCode: `grant-${suffix}`,
    state: 'available',
    templateNameSnapshot: template.name,
    currencySnapshot: template.currency,
    discountCentsSnapshot: template.discountCents,
    minSpendCentsSnapshot: template.minSpendCents,
    validFromSnapshot: template.validFrom,
    validUntilSnapshot: template.validUntil,
    ...overrides,
  });
  (fixture.grantIds ??= []).push(grant.id as number);
  return grant;
}

async function registerCustomer(fixture: IFixture, name: string) {
  await app.bean.user.register({ name }, true);
  await app.bean.passport.signinMock(name as any);
  const customer = app.bean.passport.currentUser!;
  (fixture.userIds ??= []).push(customer.id as number);
  return customer;
}

describe('couponReservation.test.ts', { concurrency: false }, () => {
  it('enforces fixed-discount eligibility and exact-once transitions', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      const suffix = createTestId();
      try {
        const customerName = `coupon-customer-${suffix}`;
        await app.bean.user.register({ name: customerName }, true);
        await app.bean.passport.signinMock(customerName as any);
        const customer = app.bean.passport.currentUser!;
        fixture.userId = customer.id as number;
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
        await app.bean.passport.signout();
        await cleanup(fixture);
      }
    });
  });

  it('rejects invalid, expired, and exhausted issuance and reservation without writes', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = {};
      const suffix = createTestId();
      try {
        const customer = await registerCustomer(fixture, `coupon-boundary-${suffix}`);
        const coupon = app.scope('commerce-promotion').service.coupon;
        const now = Date.now();
        const disabledTemplate = await createTemplate(fixture, `disabled-${suffix}`, {
          state: 'disabled',
        });
        const expiredTemplate = await createTemplate(fixture, `expired-${suffix}`, {
          validFrom: new Date(now - 120_000),
          validUntil: new Date(now - 60_000),
        });
        const issueExhaustedTemplate = await createTemplate(fixture, `issue-exhausted-${suffix}`, {
          totalIssueLimit: 1,
          issuedCount: 1,
        });
        const perCustomerLimitedTemplate = await createTemplate(fixture, `per-customer-${suffix}`, {
          perCustomerIssueLimit: 1,
        });
        const perCustomerGrant = await coupon.issue({
          templateId: perCustomerLimitedTemplate.id,
          userId: customer.id,
          correlationId: `issue-per-customer-first-${suffix}`,
          reason: 'test per-customer first issuance',
        });
        (fixture.grantIds ??= []).push(perCustomerGrant.id as number);
        const [__, perCustomerError] = await catchError(() =>
          coupon.issue({
            templateId: perCustomerLimitedTemplate.id,
            userId: customer.id,
            correlationId: `issue-per-customer-second-${suffix}`,
            reason: 'test per-customer exhausted issuance',
          }),
        );
        assert.equal(perCustomerError?.code, 409);
        assert.equal(
          await app
            .scope('commerce-promotion')
            .model.couponGrant.get({ couponCode: `issue-per-customer-second-${suffix}` }),
          undefined,
        );
        assert.equal(
          (
            await app
              .scope('commerce-promotion')
              .model.couponTemplate.getById(perCustomerLimitedTemplate.id)
          )?.issuedCount,
          1,
        );
        for (const [template, label] of [
          [disabledTemplate, 'disabled'],
          [expiredTemplate, 'expired'],
          [issueExhaustedTemplate, 'issue-exhausted'],
        ] as const) {
          const correlationId = `issue-${label}-${suffix}`;
          const [_, error] = await catchError(() =>
            coupon.issue({
              templateId: template.id,
              userId: customer.id,
              correlationId,
              reason: `test ${label} issuance`,
            }),
          );
          assert.equal(error?.code, 409);
          assert.equal(
            await app
              .scope('commerce-promotion')
              .model.couponGrant.get({ couponCode: correlationId }),
            undefined,
          );
          assert.equal(
            (await app.scope('commerce-promotion').model.couponTemplate.getById(template.id))
              ?.issuedCount,
            template.issuedCount,
          );
        }

        const disabledReservationTemplate = await createTemplate(
          fixture,
          `reserve-disabled-${suffix}`,
          { state: 'disabled' },
        );
        const expiredReservationTemplate = await createTemplate(
          fixture,
          `reserve-expired-${suffix}`,
        );
        const usageExhaustedTemplate = await createTemplate(
          fixture,
          `reserve-exhausted-${suffix}`,
          { totalUsageLimit: 1, redeemedCount: 1 },
        );
        const disabledGrant = await createGrant(
          fixture,
          disabledReservationTemplate,
          customer.id as number,
          `reserve-disabled-${suffix}`,
        );
        const expiredGrant = await createGrant(
          fixture,
          expiredReservationTemplate,
          customer.id as number,
          `reserve-expired-${suffix}`,
          {
            validFromSnapshot: new Date(now - 120_000),
            validUntilSnapshot: new Date(now - 60_000),
          },
        );
        const usageExhaustedGrant = await createGrant(
          fixture,
          usageExhaustedTemplate,
          customer.id as number,
          `reserve-exhausted-${suffix}`,
        );
        for (const [grant, label] of [
          [disabledGrant, 'disabled'],
          [expiredGrant, 'expired'],
          [usageExhaustedGrant, 'usage-exhausted'],
        ] as const) {
          const [_, error] = await catchError(() =>
            coupon.reserve({
              couponGrantId: grant.id,
              userId: customer.id,
              orderId: 200_000 + grant.id,
              eligibleSubtotalCents: 1_000,
              currency: 'USD',
              correlationId: `reserve-${label}-${suffix}`,
              reason: `test ${label} reservation`,
            }),
          );
          assert.equal(error?.code, 409);
          assert.equal(
            (await app.scope('commerce-promotion').model.couponGrant.getById(grant.id))?.state,
            'available',
          );
          assert.deepEqual(
            await app
              .scope('commerce-promotion')
              .model.couponAudit.select({ where: { couponGrantId: grant.id } }),
            [],
          );
        }
      } finally {
        await app.bean.passport.signout();
        await cleanup(fixture);
      }
    });
  });

  it('rejects a direct issue action for a recipient from another instance', async () => {
    const defaultFixture: IFixture = {};
    const foreignFixture: IFixture = {};
    const suffix = createTestId();
    let template!: EntityCouponTemplate;
    let foreignUserId!: number;
    try {
      await app.bean.executor.mockCtx(async () => {
        template = await createTemplate(defaultFixture, `foreign-recipient-${suffix}`);
      });
      await app.bean.executor.mockCtx(
        async () => {
          const customer = await registerCustomer(foreignFixture, `coupon-foreign-${suffix}`);
          foreignUserId = customer.id as number;
          await app.bean.passport.signout();
        },
        { instanceName: 'shareTest' as any },
      );
      await app.bean.executor.mockCtx(async () => {
        await app.bean.passport.signinMock();
        try {
          const [_, error] = await catchError(() =>
            app.bean.executor.performAction('post', '/commerce/promotion/coupon/issue', {
              body: {
                templateId: template.id,
                userId: foreignUserId,
                correlationId: `foreign-recipient-${suffix}`,
                reason: 'test foreign recipient issue action',
              },
            }),
          );
          assert.equal(error?.code, 404);
          assert.equal(
            await app
              .scope('commerce-promotion')
              .model.couponGrant.get({ couponCode: `foreign-recipient-${suffix}` }),
            undefined,
          );
          assert.equal(
            (await app.scope('commerce-promotion').model.couponTemplate.getById(template.id))
              ?.issuedCount,
            0,
          );
        } finally {
          await app.bean.passport.signout();
        }
      });
    } finally {
      await app.bean.executor.mockCtx(
        async () => {
          await cleanup(foreignFixture);
        },
        { instanceName: 'shareTest' as any },
      );
      await app.bean.executor.mockCtx(async () => {
        await cleanup(defaultFixture);
      });
    }
  });

  it('allows exactly one PostgreSQL reservation when a coupon has one total usage', async t => {
    if (process.env.DATABASE_DEFAULT_CLIENT !== 'pg') {
      t.skip('requires PostgreSQL row-lock contention');
      return;
    }
    const fixture: IFixture = {};
    const suffix = createTestId();
    let customerId!: number;
    let customerName!: string;
    let grantIds!: number[];
    try {
      await app.bean.executor.mockCtx(async () => {
        customerName = `coupon-concurrent-${suffix}`;
        const customer = await registerCustomer(fixture, customerName);
        customerId = customer.id as number;
        const template = await createTemplate(fixture, `concurrent-${suffix}`, {
          totalIssueLimit: 2,
          totalUsageLimit: 1,
        });
        const coupon = app.scope('commerce-promotion').service.coupon;
        grantIds = [
          (
            await coupon.issue({
              templateId: template.id,
              userId: customerId,
              correlationId: `concurrent-first-${suffix}`,
              reason: 'test concurrent first issue',
            })
          ).id as number,
          (
            await coupon.issue({
              templateId: template.id,
              userId: customerId,
              correlationId: `concurrent-second-${suffix}`,
              reason: 'test concurrent second issue',
            })
          ).id as number,
        ];
        fixture.grantIds = grantIds;
        await app.bean.passport.signout();
      });

      const reserveInContext = async (grantId: number, label: string) => {
        return await app.bean.executor.mockCtx(async () => {
          await app.bean.passport.signinMock(customerName as any);
          try {
            return await app.scope('commerce-promotion').service.coupon.reserve({
              couponGrantId: grantId,
              userId: customerId,
              orderId: 300_000 + grantId,
              eligibleSubtotalCents: 1_000,
              currency: 'USD',
              correlationId: `concurrent-${label}-${suffix}`,
              reason: `test concurrent ${label} reservation`,
            });
          } finally {
            await app.bean.passport.signout();
          }
        });
      };
      const results = await Promise.allSettled([
        reserveInContext(grantIds[0], 'first'),
        reserveInContext(grantIds[1], 'second'),
      ]);
      assert.equal(
        results.filter(result => result.status === 'fulfilled').length,
        1,
        JSON.stringify(results),
      );
      assert.equal(
        results.filter(result => result.status === 'rejected').length,
        1,
        JSON.stringify(results),
      );
      const rejected = results.find(result => result.status === 'rejected');
      assert.equal(
        (rejected as PromiseRejectedResult | undefined)?.reason?.code,
        409,
        String((rejected as PromiseRejectedResult | undefined)?.reason),
      );

      await app.bean.executor.mockCtx(async () => {
        const grants = await app.scope('commerce-promotion').model.couponGrant.select({
          where: { templateId: fixture.templateIds![0] },
        });
        const audits = await app.scope('commerce-promotion').model.couponAudit.select({
          where: { templateId: fixture.templateIds![0] },
          orders: [['id', 'asc']],
        });
        assert.equal(grants.filter(grant => grant.state === 'reserved').length, 1);
        assert.equal(grants.filter(grant => grant.state === 'available').length, 1);
        assert.deepEqual(
          audits.map(audit => audit.operation),
          ['issue', 'issue', 'reserve'],
        );
      });
    } finally {
      await app.bean.executor.mockCtx(async () => {
        await cleanup(fixture);
      });
    }
  });
});
