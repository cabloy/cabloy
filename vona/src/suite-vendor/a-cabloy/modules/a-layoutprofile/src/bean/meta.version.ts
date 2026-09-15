import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version !== 1) return;

    const entity = this.scope.entity.layoutprofile;
    await this.bean.model.createTable(entity.$table, table => {
      table.comment(entity.$comment.$table);
      table.basicFields();
      table.userId(entity.userId).comment(entity.$comment.userId);
      table.string(entity.layoutKey, 255).comment(entity.$comment.layoutKey);
      table.json(entity.profile).comment(entity.$comment.profile);
    });
  }
}
