import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { acquireTestLock, app } from 'vona-mock';

import { renderProductContentMarkdown } from '../src/lib/productContentMarkdown.ts';

interface IFixture {
  categoryId?: number | string;
  productIds: Array<number | string>;
  skuIds: Array<number | string>;
}

async function cleanupFixture(fixture: IFixture) {
  const scopeCatalog = app.scope('commerce-catalog');
  const scopeTrade = app.scope('commerce-trade');
  for (const skuId of fixture.skuIds) {
    await scopeTrade.model.stockAudit.delete({ skuId });
    await scopeTrade.model.stockReservation.delete({ skuId });
    await scopeTrade.model.stockBalance.delete({ skuId });
    await scopeCatalog.model.sku.delete({ id: skuId });
  }
  for (const productId of fixture.productIds) {
    await scopeCatalog.model.productContent.delete({ productId });
    await scopeCatalog.model.product.delete({ id: productId });
  }
  if (fixture.categoryId !== undefined) {
    await scopeCatalog.model.category.delete({ id: fixture.categoryId });
  }
}

async function runInMockCtx<TResult>(operation: () => Promise<TResult>): Promise<TResult> {
  return await app.bean.executor.mockCtx(async () => {
    await app.bean.passport.signinMock();
    try {
      return await operation();
    } finally {
      await app.bean.passport.signout();
    }
  });
}

describe('productContent.test.ts', { concurrency: false }, () => {
  let releaseTestLock: (() => void) | undefined;

  before(async () => {
    releaseTestLock = await acquireTestLock('a-commerce');
  });

  after(() => {
    releaseTestLock?.();
  });

  it('stores Markdown and server-rendered safe HTML through the Admin contract', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = { productIds: [], skuIds: [] };
      const suffix = randomUUID().slice(0, 12);
      const scopeCatalog = app.scope('commerce-catalog');
      await app.bean.passport.signinMock();
      try {
        const category = await scopeCatalog.model.category.insert({
          name: `__ProductContentCategory-${suffix}__`,
          published: true,
        });
        fixture.categoryId = category.id;
        const product = await scopeCatalog.model.product.insert({
          categoryId: category.id,
          title: `__ProductContent-${suffix}__`,
          description: 'Short summary',
          published: true,
        });
        fixture.productIds.push(product.id);
        const sku = await scopeCatalog.model.sku.insert({
          code: `__ProductContentSku-${suffix}__`,
          productId: product.id,
          priceCents: 1999,
          lifecycle: 'active',
        });
        fixture.skuIds.push(sku.id);
        await app.scope('commerce-trade').service.stockBalance.adjustStock({
          skuId: sku.id,
          delta: 1,
          reason: 'product content fixture',
          correlationId: `product-content-${suffix}`,
        });

        const markdown =
          '# Product details\n\nA **durable** product.\n\n<a href="javascript:alert(\'unsafe\')">unsafe</a>';
        const updateResult = await app.bean.executor.performAction(
          'patch',
          '/commerce/catalog/product/:id',
          {
            params: { id: product.id },
            body: {
              title: product.title,
              categoryId: product.categoryId,
              productContentForm: { descriptionMarkdown: markdown },
            },
          },
        );
        assert.equal(updateResult, null);

        const stored = await scopeCatalog.model.productContent.get({ productId: product.id });
        assert.ok(stored);
        assert.equal(stored.descriptionMarkdown, markdown);
        assert.equal(stored.descriptionHtml, renderProductContentMarkdown(markdown));
        assert.match(stored.descriptionHtml!, /<h1>Product details<\/h1>/);
        assert.match(stored.descriptionHtml!, /<strong>durable<\/strong>/);
        assert.doesNotMatch(stored.descriptionHtml!, /<a[^>]+javascript:/i);

        const adminProduct: any = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/product/:id',
          { params: { id: product.id } },
        );
        assert.equal(adminProduct.productContentForm.descriptionMarkdown, markdown);

        await scopeCatalog.service.product.update(product.id, {
          productContentForm: {
            descriptionMarkdown: '## Server-derived HTML',
            descriptionHtml: '<script>forged</script>',
          },
        } as any);
        const forgedHtmlIgnored = await scopeCatalog.model.productContent.get({
          productId: product.id,
        });
        assert.equal(forgedHtmlIgnored?.descriptionHtml, '<h2>Server-derived HTML</h2>');

        const publicDetail: any = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/product/public/:id',
          { params: { id: product.id }, innerAccess: false },
        );
        assert.equal(publicDetail.descriptionMarkdown, undefined);
        assert.equal(publicDetail.descriptionHtml, '<h2>Server-derived HTML</h2>');
        assert.equal(publicDetail.description, 'Short summary');

        const publicList: any = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/product/public',
          { innerAccess: false },
        );
        const publicListItem = publicList.list.find(
          (item: any) => String(item.id) === String(product.id),
        );
        assert.ok(publicListItem);
        assert.equal(publicListItem.descriptionHtml, undefined);

        await app.bean.executor.performAction('patch', '/commerce/catalog/product/:id', {
          params: { id: product.id },
          body: {
            title: product.title,
            categoryId: product.categoryId,
            productContentForm: { descriptionMarkdown: '  \n\t' },
          },
        });
        assert.equal(
          await scopeCatalog.model.productContent.get({ productId: product.id }),
          undefined,
        );
        const productWithoutContent: any = await app.bean.executor.performAction(
          'get',
          '/commerce/catalog/product/:id',
          { params: { id: product.id } },
        );
        assert.equal(productWithoutContent.productContentForm, undefined);
      } finally {
        await cleanupFixture(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('removes ProductContent when its Product is deleted', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = { productIds: [], skuIds: [] };
      const suffix = randomUUID().slice(0, 12);
      const scopeCatalog = app.scope('commerce-catalog');
      await app.bean.passport.signinMock();
      try {
        const category = await scopeCatalog.model.category.insert({
          name: `__ProductContentDeleteCategory-${suffix}__`,
          published: false,
        });
        fixture.categoryId = category.id;
        const product = await scopeCatalog.model.product.insert({
          categoryId: category.id,
          title: `__ProductContentDelete-${suffix}__`,
          published: false,
        });
        fixture.productIds.push(product.id);
        await scopeCatalog.service.product.update(product.id, {
          productContentForm: { descriptionMarkdown: 'Content to delete' },
        } as any);

        await app.bean.executor.performAction('delete', '/commerce/catalog/product/:id', {
          params: { id: product.id },
        });
        fixture.productIds = fixture.productIds.filter(id => String(id) !== String(product.id));
        assert.equal(
          await scopeCatalog.model.productContent.get({ productId: product.id }),
          undefined,
        );
      } finally {
        await cleanupFixture(fixture);
        await app.bean.passport.signout();
      }
    });
  });

  it('keeps the final Markdown and HTML pair consistent across competing updates', async () => {
    await app.bean.executor.mockCtx(async () => {
      const fixture: IFixture = { productIds: [], skuIds: [] };
      const suffix = randomUUID().slice(0, 12);
      const scopeCatalog = app.scope('commerce-catalog');
      try {
        const category = await scopeCatalog.model.category.insert({
          name: `__ProductContentRaceCategory-${suffix}__`,
          published: false,
        });
        fixture.categoryId = category.id;
        const product = await scopeCatalog.model.product.insert({
          categoryId: category.id,
          title: `__ProductContentRace-${suffix}__`,
          published: false,
        });
        fixture.productIds.push(product.id);
        const markdowns = ['# First update', '## Second update'];

        await Promise.all(
          markdowns.map(descriptionMarkdown =>
            runInMockCtx(async () => {
              await app.scope('commerce-catalog').service.product.update(product.id, {
                productContentForm: { descriptionMarkdown },
              } as any);
            }),
          ),
        );

        const stored = await scopeCatalog.model.productContent.get({ productId: product.id });
        assert.ok(stored);
        assert.ok(markdowns.includes(stored.descriptionMarkdown!));
        assert.equal(
          stored.descriptionHtml,
          renderProductContentMarkdown(stored.descriptionMarkdown),
        );
      } finally {
        await cleanupFixture(fixture);
      }
    });
  });
});
