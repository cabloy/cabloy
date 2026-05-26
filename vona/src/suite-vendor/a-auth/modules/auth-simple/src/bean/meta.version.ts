import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      // aAuthSimple
      const entity = this.scope.entity.authSimple;
      await this.bean.model.createTable(entity.$table, table => {
        table.basicFields();
        table.text(entity.hash);
      });
    }
  }
}
