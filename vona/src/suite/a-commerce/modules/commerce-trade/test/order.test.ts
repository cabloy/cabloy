import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { DtoOrderSummary, DtoShipmentView } from 'vona-module-commerce-trade';

describe('order.test.ts', () => {
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
