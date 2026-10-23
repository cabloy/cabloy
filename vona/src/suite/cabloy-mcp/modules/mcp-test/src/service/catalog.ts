import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoCategoryPublicSelectReq } from '../dto/categoryPublicSelectReq.tsx';
import type { DtoCategoryPublicSelectRes } from '../dto/categoryPublicSelectRes.tsx';
import type { DtoProductPublic } from '../dto/productPublic.tsx';
import type { DtoProductPublicDetail } from '../dto/productPublicDetail.tsx';
import type { DtoProductPublicSelectReq } from '../dto/productPublicSelectReq.tsx';
import type { DtoProductPublicSelectRes } from '../dto/productPublicSelectRes.tsx';

import { catalogFixtures } from '../lib/catalogFixtures.ts';

@Service()
export class ServiceCatalog extends BeanBase {
  async categories(query: DtoCategoryPublicSelectReq): Promise<DtoCategoryPublicSelectRes> {
    const list = this._hasFixtureScope()
      ? catalogFixtures.categories
          .filter(item => item.published)
          .map(item => ({
            id: item.id,
            name: item.name,
            ...('description' in item ? { description: item.description } : {}),
          }))
      : [];
    return this._page(list, query);
  }

  async selectPublic(query: DtoProductPublicSelectReq): Promise<DtoProductPublicSelectRes> {
    const list = this._publicProducts().filter(
      item =>
        (query.categoryId === undefined || String(item.categoryId) === String(query.categoryId)) &&
        (!query.title || item.title.toLowerCase().includes(query.title.toLowerCase())),
    );
    return this._page(list, query);
  }

  async findPublicById(id: TableIdentity): Promise<DtoProductPublicDetail | undefined> {
    const product = this._publicProducts().find(item => String(item.id) === String(id));
    if (!product) return undefined;
    const fixture = catalogFixtures.products.find(item => item.id === Number(id))!;
    return {
      ...product,
      ...('descriptionHtml' in fixture ? { descriptionHtml: fixture.descriptionHtml } : {}),
    };
  }

  private _hasFixtureScope(): boolean {
    if (!this.app.ctx) throw new Error('Request context required');
    // Explicit fixture ownership, not a persisted ORM tenancy demonstration.
    return this.ctx.instanceName === '';
  }

  private _publicProducts(): DtoProductPublic[] {
    if (!this._hasFixtureScope()) return [];
    return catalogFixtures.products
      .flatMap(product => {
        const category = catalogFixtures.categories.find(item => item.id === product.categoryId);
        if (!product.published || !product.active || !category?.published) return [];
        const skuAvailables = catalogFixtures.skus
          .filter(item => item.productId === product.id && item.active && item.available > 0)
          .map(item => ({
            id: item.id,
            code: item.code,
            priceCents: item.priceCents,
            available: item.available,
          }))
          .sort((a, b) => a.id - b.id);
        if (!skuAvailables.length) return [];
        return [
          {
            id: product.id,
            title: product.title,
            ...('description' in product ? { description: product.description } : {}),
            categoryId: category.id,
            categoryName: category.name,
            priceCents: Math.min(...skuAvailables.map(item => item.priceCents)),
            available: skuAvailables.reduce((total, item) => total + item.available, 0),
            skuAvailables,
          },
        ];
      })
      .sort((a, b) => Number(a.id) - Number(b.id));
  }

  private _page<T extends { id: TableIdentity }>(
    list: T[],
    query: { pageNo: number; pageSize: number },
  ) {
    const { pageNo, pageSize } = query;
    const ordered = list.toSorted((a, b) => Number(a.id) - Number(b.id));
    const offset = (pageNo - 1) * pageSize;
    return {
      list: ordered.slice(offset, offset + pageSize),
      pageNo,
      pageSize,
      pageCount: Math.ceil(ordered.length / pageSize),
      total: String(ordered.length),
    };
  }
}
