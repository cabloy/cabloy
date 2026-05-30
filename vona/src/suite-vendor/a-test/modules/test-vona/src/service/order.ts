import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { $relationDynamic } from 'vona-module-a-orm';

import { ModelProduct } from '../model/product.ts';

@Service()
export class ServiceOrder extends BeanBase {
  async relationHasMany() {
    // insert
    const orderCreate = await this.scope.model.order.insert(
      {
        orderNo: 'Order001',
        products2: [{ name: 'Apple' }, { name: 'Pear' }],
      },
      {
        with: {
          products2: $relationDynamic.hasMany(() => ModelProduct, 'orderId'),
        },
      },
    );
    // get
    await this.scope.model.order.get(
      {
        id: orderCreate.id,
      },
      {
        with: {
          products2: $relationDynamic.hasMany(() => ModelProduct, 'orderId', {
            columns: ['id', 'name', 'price', 'quantity', 'amount'],
          }),
        },
      },
    );
    // update
    await this.scope.model.order.update(
      {
        id: orderCreate.id,
        orderNo: 'Order001-Update',
        products2: [
          // create product: Peach
          { name: 'Peach' },
          // update product: Apple
          { id: orderCreate.products?.[0].id, name: 'Apple-Update' },
          // delete product: Pear
          { id: orderCreate.products?.[1].id, deleted: true },
        ],
      },
      {
        with: {
          products2: $relationDynamic.hasMany(() => ModelProduct, 'orderId'),
        },
      },
    );
    // delete
    await this.scope.model.order.delete(
      {
        id: orderCreate.id,
      },
      {
        with: {
          products2: $relationDynamic.hasMany(() => ModelProduct, 'orderId'),
        },
      },
    );
  }
}
