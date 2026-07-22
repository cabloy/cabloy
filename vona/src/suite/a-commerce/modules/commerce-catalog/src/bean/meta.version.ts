import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      const entityCategory = this.scope.entity.category;
      await this.bean.model.createTable(entityCategory.$table, table => {
        table.comment(entityCategory.$comment.$table);
        table.basicFields();
        table.string(entityCategory.name, 50).comment(entityCategory.$comment.name);
        table.tableIdentity(entityCategory.parentId).comment(entityCategory.$comment.parentId);
        table
          .boolean(entityCategory.published)
          .defaultTo(entityCategory.$default.published)
          .comment(entityCategory.$comment.published);
        table.string(entityCategory.description, 255).comment(entityCategory.$comment.description);
        table.index([entityCategory.parentId], `idx_${entityCategory.$table}_parentId`);
      });

      const entityProduct = this.scope.entity.product;
      await this.bean.model.createTable(entityProduct.$table, table => {
        table.comment(entityProduct.$comment.$table);
        table.basicFields();
        table.string(entityProduct.title, 100).comment(entityProduct.$comment.title);
        table.tableIdentity(entityProduct.categoryId).comment(entityProduct.$comment.categoryId);
        table
          .boolean(entityProduct.published)
          .defaultTo(entityProduct.$default.published)
          .comment(entityProduct.$comment.published);
        table.string(entityProduct.description, 255).comment(entityProduct.$comment.description);
        table.index([entityProduct.categoryId], `idx_${entityProduct.$table}_categoryId`);
      });

      const entitySku = this.scope.entity.sku;
      await this.bean.model.createTable(entitySku.$table, table => {
        table.comment(entitySku.$comment.$table);
        table.basicFields();
        table.tableIdentity(entitySku.productId).comment(entitySku.$comment.productId);
        table.string(entitySku.code, 100).comment(entitySku.$comment.code);
        table.integer(entitySku.priceCents).comment(entitySku.$comment.priceCents);
        table.json(entitySku.attributes).comment(entitySku.$comment.attributes);
        table.string(entitySku.lifecycle, 20).comment(entitySku.$comment.lifecycle);
        table.index([entitySku.productId], `idx_${entitySku.$table}_productId`);
        table.index([entitySku.lifecycle], `idx_${entitySku.$table}_lifecycle`);
        table.index([entitySku.code], `idx_${entitySku.$table}_code`);
      });
    }
  }
}
