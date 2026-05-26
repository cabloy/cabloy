import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      // create table: aMail
      const entity = this.scope.entity.mail;
      await this.bean.model.createTable(entity.$table, table => {
        table.basicFields();
        table.string(entity.client, 255);
        table.string(entity.from, 255);
        table.text(entity.to);
        table.text(entity.subject);
        table.json(entity.message);
        table.text(entity.error);
      });
    }
  }
}
