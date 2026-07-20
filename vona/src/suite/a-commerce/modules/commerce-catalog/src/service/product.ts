import type { Knex } from 'knex';
import type { TableIdentity } from 'table-identity';
import type { IQueryParams } from 'vona-module-a-orm';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { DtoProductCreate } from '../dto/productCreate.tsx';
import type { DtoProductPublic } from '../dto/productPublic.tsx';
import type { DtoProductPublicSelectRes } from '../dto/productPublicSelectRes.tsx';
import type { DtoProductSelectRes } from '../dto/productSelectRes.tsx';
import type { DtoProductUpdate } from '../dto/productUpdate.tsx';
import type { DtoProductView } from '../dto/productView.tsx';
import type { EntityProduct } from '../entity/product.tsx';
import type { ModelProduct } from '../model/product.ts';

@Service()
export class ServiceProduct extends BeanBase {
  async create(product: DtoProductCreate): Promise<EntityProduct> {
    await this._ensureCategoryExists(product.categoryId);
    return await this.scope.model.product.insert(product);
  }

  async select(params?: IQueryParams<ModelProduct>): Promise<DtoProductSelectRes> {
    return await this.scope.model.product.selectAndCount(params);
  }

  async selectPublic(params: IQueryParams<ModelProduct>): Promise<DtoProductPublicSelectRes> {
    const result = await this.scope.model.product.selectAndCount({
      columns: ['id', 'title', 'description', 'categoryId'],
      where: this._getPublicProductWhere(params.where),
      orders: [['id', 'asc']],
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
      include: {
        category: { columns: ['id', 'name'] },
        skuAvailables: true,
      },
    });
    const balancesBySkuId = await this._getBalancesBySkuId(
      result.list.flatMap((product: any) => product.skuAvailables.map((sku: any) => sku.id)),
    );
    return {
      ...result,
      list: result.list.flatMap((product: any) => {
        const item = this._toPublicProduct(product, balancesBySkuId);
        return item ? [item] : [];
      }),
    };
  }

  async view(id: TableIdentity): Promise<DtoProductView | undefined> {
    return await this.scope.model.product.getById(id);
  }

  async viewPublic(id: TableIdentity): Promise<DtoProductPublic | undefined> {
    const product = await this.scope.model.product.get(this._getPublicProductWhere({ id }), {
      columns: ['id', 'title', 'description', 'categoryId'],
      include: {
        category: { columns: ['id', 'name'] },
        skuAvailables: true,
      },
    });
    if (!product) return undefined;
    const balancesBySkuId = await this._getBalancesBySkuId(
      product.skuAvailables.map(sku => sku.id),
    );
    return this._toPublicProduct(product, balancesBySkuId);
  }

  async update(id: TableIdentity, product: DtoProductUpdate) {
    if (product.categoryId !== undefined) await this._ensureCategoryExists(product.categoryId);
    return await this.scope.model.product.updateById(id, product);
  }

  async delete(id: TableIdentity) {
    return await this.scope.model.product.deleteById(id);
  }

  private _getPublicProductWhere(where?: Record<string, unknown>) {
    const productModel = this.scope.model.product;
    const categoryModel = this.scope.model.category;
    const skuModel = this.scope.model.sku;
    const stockBalanceModel = this.$scope.commerceTrade.model.stockBalance;
    return {
      ...where,
      published: true,
      _exists_: function (this: Knex.QueryBuilder) {
        this.select(1)
          .from('commerceCatalogSku')
          .innerJoin('commerceTradeStockBalance', function () {
            this.on('commerceCatalogSku.id', '=', 'commerceTradeStockBalance.skuId').andOn(
              'commerceCatalogSku.iid',
              '=',
              'commerceTradeStockBalance.iid',
            );
          });
        skuModel.prepareWhere(this, 'commerceCatalogSku', { lifecycle: 'active' });
        this.where('commerceCatalogSku.productId', productModel.ref('commerceCatalogProduct.id'));
        stockBalanceModel.prepareWhere(this, 'commerceTradeStockBalance', {
          available: { _gt_: 0 },
        });
        this.whereExists(function (this: Knex.QueryBuilder) {
          this.select(1).from('commerceCatalogCategory');
          categoryModel.prepareWhere(this, 'commerceCatalogCategory', { published: true });
          this.where(
            'commerceCatalogCategory.id',
            productModel.ref('commerceCatalogProduct.categoryId'),
          );
        });
      } as any,
    };
  }

  private async _getBalancesBySkuId(skuIds: TableIdentity[]) {
    if (skuIds.length === 0) return new Map<string, number>();
    const balances = await this.$scope.commerceTrade.model.stockBalance.select({
      columns: ['skuId', 'available'],
      where: {
        skuId: skuIds,
        available: { _gt_: 0 },
      },
    });
    return new Map(balances.map(balance => [String(balance.skuId), balance.available]));
  }

  private _toPublicProduct(
    product: any,
    balancesBySkuId: Map<string, number>,
  ): DtoProductPublic | undefined {
    if (!product.category) return undefined;
    const skuAvailables = product.skuAvailables.flatMap((sku: any) => {
      const available = balancesBySkuId.get(String(sku.id));
      if (!available) return [];
      return [
        {
          id: sku.id,
          code: sku.code,
          priceCents: sku.priceCents,
          available,
        },
      ];
    });
    if (skuAvailables.length === 0) return undefined;
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      categoryId: product.category.id,
      categoryName: product.category.name,
      priceCents: Math.min(...skuAvailables.map((sku: any) => sku.priceCents)),
      available: skuAvailables.reduce((total: number, sku: any) => total + sku.available, 0),
      skuAvailables,
    };
  }

  private async _ensureCategoryExists(categoryId: TableIdentity) {
    if (!(await this.scope.model.category.getById(categoryId))) {
      this.app.throw(404, 'Product category not found');
    }
  }
}
