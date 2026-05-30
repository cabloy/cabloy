import type {
  IMetaVersionTest,
  IMetaVersionTestOptions,
  IMetaVersionUpdate,
  IMetaVersionUpdateOptions,
} from 'vona-module-a-version';

import { getRandomInt } from '@cabloy/utils';
import { faker } from '@faker-js/faker';
import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

import type { EntityProduct } from '../entity/product.tsx';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate, IMetaVersionTest {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      const entityProduct = this.scope.entity.product;
      await this.bean.model.createTable(entityProduct.$table, table => {
        table.basicFields();
        table.string(entityProduct.name, 50);
        table.string(entityProduct.description, 255);
        table.integer(entityProduct.price);
        table.int0(entityProduct.quantity);
        table.integer(entityProduct.amount);
      });
    }
  }

  async test(_options: IMetaVersionTestOptions): Promise<void> {
    const items: Partial<EntityProduct>[] = [];
    const now = Date.now();
    for (let i = 0; i < 100; i++) {
      const price = getRandomInt(1000, 50);
      const quantity = getRandomInt(10, 1);
      const amount = price * quantity;
      const createdAt = new Date(now - (100 - i) * 3600 * 1000);
      items.push({
        name: faker.commerce.productName(),
        price,
        quantity,
        amount,
        createdAt,
      });
    }
    await this.scope.model.product.insertBulk(items);
  }
}
