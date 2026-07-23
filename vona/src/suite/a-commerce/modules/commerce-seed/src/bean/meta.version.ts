import type { IMetaVersionSeed, IMetaVersionSeedOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionSeed {
  async seed(_options: IMetaVersionSeedOptions) {
    const scopeCatalog = this.$scope.commerceCatalog;
    const scopeTrade = this.$scope.commerceTrade;

    const electronics = await scopeCatalog.model.category.insert({
      name: 'Electronics',
      published: true,
      description: 'Consumer electronics for Commerce testing.',
    });
    const homeKitchen = await scopeCatalog.model.category.insert({
      name: 'Home & Kitchen',
      published: true,
      description: 'Home and kitchen products for Commerce testing.',
    });

    const headphones = await scopeCatalog.model.product.insert({
      categoryId: electronics.id,
      title: 'Wireless Headphones',
      published: true,
      description: 'Comfortable wireless headphones with clear sound.',
    });
    const keyboard = await scopeCatalog.model.product.insert({
      categoryId: electronics.id,
      title: 'Mechanical Keyboard',
      published: true,
      description: 'A compact mechanical keyboard for daily work.',
    });
    const coffeeSet = await scopeCatalog.model.product.insert({
      categoryId: homeKitchen.id,
      title: 'Pour-Over Coffee Set',
      published: true,
      description: 'A complete pour-over coffee brewing set.',
    });

    const skus = await Promise.all([
      scopeCatalog.model.sku.insert({
        productId: headphones.id,
        code: 'HPH-BLK',
        priceCents: 7999,
        lifecycle: 'active',
      }),
      scopeCatalog.model.sku.insert({
        productId: keyboard.id,
        code: 'MKB-US',
        priceCents: 12999,
        lifecycle: 'active',
      }),
      scopeCatalog.model.sku.insert({
        productId: keyboard.id,
        code: 'MKB-US-RGB',
        priceCents: 14999,
        lifecycle: 'active',
      }),
      scopeCatalog.model.sku.insert({
        productId: coffeeSet.id,
        code: 'COF-SET-01',
        priceCents: 4599,
        lifecycle: 'active',
      }),
    ]);

    for (const [index, delta] of [24, 15, 8, 30].entries()) {
      await scopeTrade.service.stockBalance.adjustStock({
        skuId: skus[index].id,
        delta,
        reason: 'Initial commerce seed inventory',
        correlationId: `commerce-seed-initial-${skus[index].id}`,
      });
    }
  }
}
