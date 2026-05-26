import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      const entityPaypalRecord = this.scope.entity.paypalRecord;
      await this.bean.model.createTable(entityPaypalRecord.$table, table => {
        table.comment(entityPaypalRecord.$comment.$table);
        table.basicFields();
        table.userId();
        table.int0(entityPaypalRecord.status).comment(entityPaypalRecord.$comment.status);
        table
          .string(entityPaypalRecord.prepayId, 255)
          .comment(entityPaypalRecord.$comment.prepayId);
        table.json(entityPaypalRecord.payload).comment(entityPaypalRecord.$comment.payload);
        table.json(entityPaypalRecord.options).comment(entityPaypalRecord.$comment.options);
      });
    }
  }
}
