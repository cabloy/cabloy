import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      const entityAddress = this.scope.entity.address;
      await this.bean.model.createTable(entityAddress.$table, table => {
        table.comment(entityAddress.$comment.$table);
        table.basicFields();
        table.userId(entityAddress.userId).comment(entityAddress.$comment.userId);
        table
          .string(entityAddress.recipientName, 100)
          .comment(entityAddress.$comment.recipientName);
        table.string(entityAddress.phone, 50).comment(entityAddress.$comment.phone);
        table.string(entityAddress.countryCode, 10).comment(entityAddress.$comment.countryCode);
        table.string(entityAddress.region, 100).comment(entityAddress.$comment.region);
        table.string(entityAddress.city, 100).comment(entityAddress.$comment.city);
        table.string(entityAddress.postalCode, 30).comment(entityAddress.$comment.postalCode);
        table.string(entityAddress.addressLine1, 255).comment(entityAddress.$comment.addressLine1);
        table
          .string(entityAddress.addressLine2, 255)
          .nullable()
          .comment(entityAddress.$comment.addressLine2);
      });
    }
  }
}
