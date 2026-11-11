import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';
import { $schema } from 'vona-module-a-openapiutils';

import { DtoCategoryPublicSelectRes } from '../src/dto/categoryPublicSelectRes.tsx';
import { DtoProductPublicSelectRes } from '../src/dto/productPublicSelectRes.tsx';
import { catalogFixtures } from '../src/lib/catalogFixtures.ts';

const paths = {
  categories: '/mcp/test/catalog/categories',
  products: '/mcp/test/catalog/products',
  detail: '/mcp/test/catalog/products/:id',
} as const;

describe('catalog.test.ts', { concurrency: false }, () => {
  it('owns an immutable directory and public product projections through guarded controllers', async () => {
    await app.bean.executor.mockCtx(async () => {
      assert.ok(Object.isFrozen(catalogFixtures));
      assert.ok(catalogFixtures.skus.every(Object.isFrozen));
      const categories = await app.bean.executor.performAction('get', paths.categories, {
        query: {},
        innerAccess: false,
      });
      assert.equal(
        (await $schema(DtoCategoryPublicSelectRes).parseAsync(categories)).total,
        categories.total,
      );
      assert.deepEqual(
        categories.list.map(item => item.name),
        ['Electronics', 'Books', 'Empty', 'Unavailable'],
      );
      assert.equal(categories.total, '4');
      assert.equal(categories.pageNo, 1);
      assert.equal(categories.pageSize, 20);
      const products = await app.bean.executor.performAction('get', paths.products, {
        query: {},
        innerAccess: false,
      });
      assert.equal(
        (await $schema(DtoProductPublicSelectRes).parseAsync(products)).total,
        products.total,
      );
      assert.deepEqual(
        products.list.map(item => item.title),
        ['Wireless Headphones', 'Laptop', 'TypeScript Handbook'],
      );
      assert.equal(products.total, '3');
      const headphones = products.list[0];
      assert.equal(headphones.available, 11);
      assert.equal(headphones.priceCents, 9999);
      assert.equal(headphones.skuAvailables.length, 2);
      assert.ok(headphones.skuAvailables.every(item => item.available > 0));
      assert.ok(!('published' in headphones));
      assert.ok(!('productId' in headphones.skuAvailables[0]));
      const detail = await app.bean.executor.performAction('get', paths.detail, {
        params: { id: headphones.id },
        innerAccess: false,
      });
      assert.equal(detail.descriptionHtml, '<p>Synthetic wireless audio</p>');
      for (const category of categories.list.filter(item =>
        ['Empty', 'Unavailable'].includes(item.name),
      )) {
        const empty = await app.bean.executor.performAction('get', paths.products, {
          query: { categoryId: category.id },
          innerAccess: false,
        });
        assert.equal(empty.total, '0');
        assert.deepEqual(empty.list, []);
      }
      const service = app.scope('test-mcp').service.catalog;
      for (const fixture of catalogFixtures.products.filter(
        item => !products.list.some(publicItem => publicItem.id === item.id),
      )) {
        assert.equal(await service.findPublicById(fixture.id), undefined);
      }
      assert.equal(await service.findPublicById(Number.MAX_SAFE_INTEGER), undefined);
      headphones.title = 'mutated projection';
      headphones.skuAvailables[0].available = 1;
      const fresh = await service.findPublicById(headphones.id);
      assert.equal(fresh?.title, 'Wireless Headphones');
      assert.equal(fresh?.available, 11);
      assert.equal(fresh?.skuAvailables[0].available, 8);
    });
  });

  it('filters before stable pagination and omits absent optional fields', async () => {
    await app.bean.executor.mockCtx(async () => {
      const service = app.scope('test-mcp').service.catalog;
      const categories = await service.categories({ pageNo: 1, pageSize: 20 });
      const electronics = categories.list.find(item => item.name === 'Electronics')!;
      const pageOne = await service.selectPublic({
        categoryId: electronics.id,
        pageNo: 1,
        pageSize: 1,
      });
      const pageTwo = await service.selectPublic({
        categoryId: electronics.id,
        pageNo: 2,
        pageSize: 1,
      });
      assert.equal(pageOne.total, '2');
      assert.equal(pageOne.pageCount, 2);
      assert.equal(pageOne.list[0].title, 'Wireless Headphones');
      assert.equal(pageTwo.list[0].title, 'Laptop');
      assert.ok(!('description' in pageTwo.list[0]));
      assert.ok(!('descriptionHtml' in (await service.findPublicById(pageTwo.list[0].id))!));
      const search = await service.selectPublic({
        categoryId: electronics.id,
        title: 'headphones',
        pageNo: 1,
        pageSize: 20,
      });
      assert.equal(search.total, '1');
      assert.equal(search.list[0].id, pageOne.list[0].id);
      const books = categories.list.find(item => item.name === 'Books')!;
      assert.equal(
        (
          await service.selectPublic({
            categoryId: books.id,
            title: 'Headphones',
            pageNo: 1,
            pageSize: 20,
          })
        ).total,
        '0',
      );
      assert.deepEqual(
        (await service.categories({ pageNo: 2, pageSize: 2 })).list.map(item => item.name),
        ['Empty', 'Unavailable'],
      );
    });
  });

  it('scopes synthetic data to the actual default-instance context, not ORM tenancy', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        const service = app.scope('test-mcp').service.catalog;
        assert.deepEqual((await service.categories({ pageNo: 1, pageSize: 20 })).list, []);
        assert.deepEqual((await service.selectPublic({ pageNo: 1, pageSize: 20 })).list, []);
        assert.equal(await service.findPublicById(catalogFixtures.products[0].id), undefined);
      },
      { instanceName: 'shareTest' as any },
    );
  });
});
