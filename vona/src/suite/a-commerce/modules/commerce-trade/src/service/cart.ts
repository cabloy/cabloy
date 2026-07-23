import type { TableIdentity } from 'table-identity';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoCartAddItem } from '../dto/cartAddItem.tsx';
import type { DtoCartItem } from '../dto/cartItem.tsx';
import type { DtoCartUpdateItem } from '../dto/cartUpdateItem.tsx';
import type { DtoCartView } from '../dto/cartView.tsx';
import type { EntityCart } from '../entity/cart.tsx';

const serializationRetryOptions = {
  retries: 1,
  factor: 1,
  minTimeout: 0,
  maxTimeout: 0,
  randomize: false,
  errorCodes: ['40001', 'ER_LOCK_DEADLOCK', 'ER_LOCK_WAIT_TIMEOUT'],
  ownerOnly: true,
};

@Service()
export class ServiceCart extends BeanBase {
  async current(): Promise<DtoCartView> {
    const cart = await this._getCurrentCart();
    return await this._toCartView(cart);
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async addItem(command: DtoCartAddItem): Promise<DtoCartView> {
    await this._assertSellableSku(command.skuId, command.quantity);
    const cart = await this._getOrCreateCurrentCart();
    const item = await this.scope.model.cartItem.getForUpdate({
      cartId: cart.id,
      skuId: command.skuId,
    });
    if (item) {
      const quantity = item.quantity + command.quantity;
      await this._assertSellableSku(command.skuId, quantity);
      await this.scope.model.cartItem.updateById(item.id, { quantity });
    } else {
      await this.scope.model.cartItem.insert({
        cartId: cart.id,
        skuId: command.skuId,
        quantity: command.quantity,
      });
    }
    return await this._toCartView(cart);
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async updateItem(id: TableIdentity, command: DtoCartUpdateItem): Promise<DtoCartView> {
    const cart = await this._getCurrentCartForUpdate();
    if (!cart) return { items: [] };
    const item = await this.scope.model.cartItem.getForUpdate({ id, cartId: cart.id });
    if (!item) return await this._toCartView(cart);
    await this._assertSellableSku(item.skuId, command.quantity);
    await this.scope.model.cartItem.updateById(item.id, { quantity: command.quantity });
    return await this._toCartView(cart);
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async deleteItem(id: TableIdentity): Promise<DtoCartView> {
    const cart = await this._getCurrentCartForUpdate();
    if (!cart) return { items: [] };
    const item = await this.scope.model.cartItem.getForUpdate({ id, cartId: cart.id });
    if (item) await this.scope.model.cartItem.deleteById(item.id);
    return await this._toCartView(cart);
  }

  @Core.transaction({ isolationLevel: 'SERIALIZABLE' })
  @Core.retryable(serializationRetryOptions)
  async clear(): Promise<DtoCartView> {
    const cart = await this._getCurrentCartForUpdate();
    if (!cart) return { items: [] };
    await this.scope.model.cartItem.delete({ cartId: cart.id });
    return await this._toCartView(cart);
  }

  private _getCurrentUserId(): TableIdentity {
    return this.bean.passport.currentUser!.id;
  }

  private async _getCurrentCart(): Promise<EntityCart | undefined> {
    return await this.scope.model.cart.get({ userId: this._getCurrentUserId() });
  }

  private async _getCurrentCartForUpdate(): Promise<EntityCart | undefined> {
    return await this.scope.model.cart.getForUpdate({ userId: this._getCurrentUserId() });
  }

  private async _getOrCreateCurrentCart(): Promise<EntityCart> {
    let cart = await this._getCurrentCartForUpdate();
    if (!cart) {
      cart = await this.scope.model.cart.insert({ userId: this._getCurrentUserId() });
    }
    return cart;
  }

  private async _toCartView(cart: EntityCart | undefined): Promise<DtoCartView> {
    if (!cart) return { items: [] };
    const items = await this.scope.model.cartItem.select({
      where: { cartId: cart.id },
      orders: [['id', 'asc']],
    });
    return {
      id: cart.id,
      items: (await Promise.all(items.map(item => this._toCartItem(item)))).flatMap(item =>
        item ? [item] : [],
      ),
    };
  }

  private async _toCartItem(item: {
    id: TableIdentity;
    skuId: TableIdentity;
    quantity: number;
  }): Promise<DtoCartItem | undefined> {
    const sku = await this.$scope.commerceCatalog.model.sku.getById(item.skuId, {
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
    const balance = await this.scope.model.stockBalance.get({ skuId: item.skuId });
    if (!sku || !sku.product || !sku.product.category || !balance) return undefined;
    return {
      id: item.id,
      skuId: item.skuId,
      quantity: item.quantity,
      skuCode: sku.code,
      productTitle: sku.product.title,
      priceCents: sku.priceCents,
      available: balance.available,
    };
  }

  private async _assertSellableSku(skuId: TableIdentity, quantity: number) {
    const sku = await this.$scope.commerceCatalog.model.sku.getById(skuId, {
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
    if (!sku || sku.lifecycle !== 'active') {
      this.app.throw(404, 'SKU not found');
    }
    if (!sku.product?.published || !sku.product.category?.published) {
      this.app.throw(409, 'SKU is not sellable');
    }
    const balance = await this.scope.model.stockBalance.get({ skuId });
    if (!balance || balance.available < quantity) {
      this.app.throw(409, 'insufficient available stock');
    }
  }
}
