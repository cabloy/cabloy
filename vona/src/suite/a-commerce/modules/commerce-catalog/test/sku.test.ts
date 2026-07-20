import type { TableIdentity } from 'table-identity';
import type {
  DtoCategoryCreate,
  DtoProductCreate,
  DtoSkuCreate,
  DtoSkuSelectRes,
  DtoSkuUpdate,
  EntitySku,
} from 'vona-module-commerce-catalog';

import { catchError } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

async function updateSku(id: TableIdentity, body: DtoSkuUpdate) {
  return await app.bean.executor.performAction('patch', '/commerce/catalog/sku/:id', {
    params: { id },
    body,
  });
}

async function viewSku(id: TableIdentity): Promise<EntitySku> {
  return await app.bean.executor.performAction('get', '/commerce/catalog/sku/:id', {
    params: { id },
  });
}

describe('sku.test.ts', () => {
  it('action:sku', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        const category: DtoCategoryCreate = { name: '__SkuCategory__', published: true };
        const categoryId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/category',
          {
            body: category,
          },
        );
        const product: DtoProductCreate = {
          categoryId,
          title: '__SkuProduct__',
          published: true,
        };
        const productId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/product',
          {
            body: product,
          },
        );
        const data: DtoSkuCreate = {
          productId,
          code: '__sku__',
          priceCents: 1999,
          lifecycle: 'draft',
        };
        const skuId = await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
          body: data,
        });
        const dataUpdate: DtoSkuUpdate = {
          productId,
          code: '__sku-new__',
          priceCents: 2999,
          lifecycle: 'active',
        };
        assert.equal(!!skuId, true);
        const selectRes: DtoSkuSelectRes = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/sku',
        );
        assert.equal(
          selectRes.list.some(item => item.code === data.code),
          true,
        );
        const updateRes = await app.bean.executor.performAction(
          'patch',
          '/commerce/catalog/sku/:id',
          {
            params: { id: skuId },
            body: dataUpdate,
          },
        );
        assert.equal(updateRes, null);
        let sku: EntitySku = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/sku/:id',
          {
            params: { id: skuId },
          },
        );
        assert.equal(sku.code, dataUpdate.code);
        assert.equal(sku.priceCents, 2999);
        assert.equal(sku.lifecycle, 'active');
        const deleteRes = await app.bean.executor.performAction(
          'delete',
          '/commerce/catalog/sku/:id',
          {
            params: { id: sku.id },
          },
        );
        assert.equal(deleteRes, null);
        sku = await app.bean.executor.performAction('get', '/commerce/catalog/sku/:id', {
          params: { id: sku.id },
        });
        assert.equal(sku, undefined);
      } finally {
        await app.bean.passport.signout();
      }
    });
  });

  it('enforces the SKU lifecycle state machine', async () => {
    await app.bean.executor.mockCtx(async () => {
      await app.bean.passport.signinMock();
      try {
        const suffix = `${Date.now()}`;
        const categoryId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/category',
          {
            body: { name: `sku lifecycle category ${suffix}`, published: true },
          },
        );
        const productId = await app.bean.executor.performAction(
          'post',
          '/commerce/catalog/product',
          {
            body: { categoryId, title: `sku lifecycle product ${suffix}`, published: true },
          },
        );
        const createSku = async (code: string, lifecycle: EntitySku['lifecycle'] = 'draft') => {
          return await app.bean.executor.performAction('post', '/commerce/catalog/sku', {
            body: { productId, code, priceCents: 100, lifecycle },
          });
        };
        const updateLifecycle = async (id: TableIdentity, lifecycle: EntitySku['lifecycle']) => {
          return await updateSku(id, {
            productId,
            code: (await viewSku(id)).code,
            priceCents: 100,
            lifecycle,
          });
        };
        const assertLifecycle = async (id: TableIdentity, lifecycle: EntitySku['lifecycle']) => {
          assert.equal((await viewSku(id)).lifecycle, lifecycle);
        };
        const assertTransitionRejected = async (
          source: EntitySku['lifecycle'],
          target: EntitySku['lifecycle'],
        ) => {
          const skuId = await createSku(`sku-lifecycle-${suffix}-${source}-${target}`, source);
          const [_, err] = await catchError(() => updateLifecycle(skuId, target));
          assert.equal(err?.code, 409);
          await assertLifecycle(skuId, source);
        };

        const skuId = await createSku(`sku-lifecycle-${suffix}`);
        for (const lifecycle of ['active', 'inactive', 'active', 'archived'] as const) {
          const result = await updateLifecycle(skuId, lifecycle);
          assert.equal(result, null);
          await assertLifecycle(skuId, lifecycle);
        }

        const sameStateResult = await updateSku(skuId, {
          productId,
          code: `sku-lifecycle-${suffix}-renamed`,
          priceCents: 200,
          lifecycle: 'archived',
        });
        assert.equal(sameStateResult, null);
        const sameStateSku = await viewSku(skuId);
        assert.equal(sameStateSku.lifecycle, 'archived');
        assert.equal(sameStateSku.code, `sku-lifecycle-${suffix}-renamed`);
        assert.equal(sameStateSku.priceCents, 200);

        await assertTransitionRejected('draft', 'inactive');
        await assertTransitionRejected('active', 'draft');
        await assertTransitionRejected('inactive', 'draft');
        await assertTransitionRejected('archived', 'draft');
        await assertTransitionRejected('archived', 'active');
        await assertTransitionRejected('archived', 'inactive');
      } finally {
        await app.bean.passport.signout();
      }
    });
  });
});
