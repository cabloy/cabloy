import type { TableIdentity } from 'table-identity';
import type { TypeQueryInput } from 'vona-module-a-orm';

import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { DtoOrderSummary, DtoShipmentView } from 'vona-module-commerce-trade';

import type { orderMineQuery } from '../src/dto/orderMineReq.tsx';

describe('order.test.ts', { concurrency: false }, () => {
  it('keeps Mine ownership and fixed columns outside public OR/NOT predicates', async () => {
    await app.bean.executor.mockCtx(async () => {
      const trade = app.scope('commerce-trade');
      const suffix = randomUUID().slice(0, 12);
      const userIds: TableIdentity[] = [];
      const orderIds: TableIdentity[] = [];
      try {
        for (const name of [`query-owner-${suffix}`, `query-foreign-${suffix}`]) {
          const user = await app.bean.user.register({ name }, true);
          userIds.push(user.id);
        }
        await app.bean.passport.signinMock(`query-owner-${suffix}` as any);
        for (const [userId, state] of [
          [userIds[0], 'paid'],
          [userIds[0], 'cancelled'],
          [userIds[1], 'paid'],
        ] as const) {
          const order = await trade.model.order.insert({
            userId,
            addressId: 1,
            correlationId: `query-${suffix}-${orderIds.length}`,
            addressSnapshot: {
              recipientName: 'Query regression',
              phone: '15555550123',
              countryCode: 'US',
              region: 'California',
              city: 'San Francisco',
              postalCode: '94105',
              addressLine1: '1 Market Street',
            },
            state,
            currency: 'USD',
            eligibleSubtotalCents: 100,
            discountCents: 0,
            payableTotalCents: 100,
            reservationExpiresAt: new Date(Date.now() + 60_000),
          });
          orderIds.push(order.id);
        }
        const query: TypeQueryInput<typeof orderMineQuery> = {
          where: {
            or: [
              { field: 'state', op: 'eq', value: 'paid' },
              { not: { field: 'state', op: 'eq', value: 'cancelled' } },
            ],
          },
          orders: [{ field: 'id', direction: 'asc' }],
        };
        const original = structuredClone(query);
        for (const result of [
          await trade.service.order.mine(query),
          await app.bean.executor.performAction('get', '/commerce/trade/order/mine', { query }),
        ]) {
          assert.equal(result.total, '1');
          assert.deepEqual(
            result.list.map(item => String(item.id)),
            [String(orderIds[0])],
          );
          assert.deepEqual(Object.keys(result.list[0]).sort(), [
            'createdAt',
            'currency',
            'id',
            'payableTotalCents',
            'state',
          ]);
        }
        assert.deepEqual(query, original);
        // Reversing the visible predicate cannot turn the foreign customer's row into ours.
        const notPaid = await trade.service.order.mine({
          where: { not: { field: 'state', op: 'eq', value: 'paid' } },
        });
        assert.deepEqual(
          notPaid.list.map(item => String(item.id)),
          [String(orderIds[1])],
        );
        for (const invalid of [
          { columns: ['id', 'userId', 'addressSnapshot'] },
          { include: { lines: true } },
          { where: { userId: userIds[1] } },
          { where: { field: 'userId', op: 'eq', value: userIds[1] } },
        ]) {
          await assert.rejects(
            () => trade.service.order.mine(invalid as never),
            (error: { code?: number }) => error.code === 422,
          );
          await assert.rejects(
            () =>
              app.bean.executor.performAction('get', '/commerce/trade/order/mine', {
                query: invalid,
              }),
            (error: { code?: number }) => error.code === 422,
          );
        }
      } finally {
        try {
          for (const id of orderIds.toReversed()) await trade.model.order.deleteById(id);
        } finally {
          await app.bean.passport.signout();
          for (const id of userIds.toReversed()) {
            await app.scope('home-user').model.roleUser.delete({ userId: id });
            await app.bean.user.removeById(id);
          }
        }
      }
    });
  });

  it('action:order:emittedDtoSchemas', async () => {
    await app.bean.executor.mockCtx(async () => {
      const summaryJson = await app.bean.openapi.generateJsonOfClass(DtoOrderSummary);
      const summaryComponent = Object.values(summaryJson.components!.schemas as any).find(item => {
        return (item as any).properties?.payableTotalCents && (item as any).properties?.createdAt;
      }) as any;
      assert.deepEqual(
        Object.keys(summaryComponent.properties).sort(),
        ['id', 'state', 'currency', 'payableTotalCents', 'createdAt'].sort(),
      );

      const shipmentJson = await app.bean.openapi.generateJsonOfClass(DtoShipmentView);
      const shipmentComponent = Object.values(shipmentJson.components!.schemas as any).find(
        item => {
          return (item as any).properties?.carrier && (item as any).properties?.trackingNumber;
        },
      ) as any;
      assert.deepEqual(
        Object.keys(shipmentComponent.properties).sort(),
        ['id', 'carrier', 'trackingNumber', 'shippedAt'].sort(),
      );
    });
  });

  it('action:order permits system-admin read and shipment actions only', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        const actions = ['select', 'view', 'ship'];
        const permissions = await Promise.all(
          actions.map(action =>
            app.bean.permission.retrievePermissionAction('commerce-trade:order', action),
          ),
        );
        assert.deepEqual(
          permissions,
          actions.map(() => true),
        );
        assert.equal(
          await app.bean.permission.retrievePermissionAction('commerce-trade:order', 'create'),
          false,
        );
        assert.equal(
          await app.bean.permission.retrievePermissionAction('commerce-trade:order', 'update'),
          false,
        );
        assert.equal(
          await app.bean.permission.retrievePermissionAction('commerce-trade:order', 'delete'),
          false,
        );
      } finally {
        await app.bean.passport.signout();
      }
    });
  });
});
