import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      // create table: aInstance
      const entity = this.scope.entity.instance;
      await this.bean.model.createTable(entity.$table, table => {
        table.basicFieldsSimple({ iid: false });
        table.boolean(entity.disabled).defaultTo(entity.$default.disabled);
        table.boolean(entity.isolate).defaultTo(entity.$default.isolate);
        table.string(entity.name, 255);
        table.string(entity.title, 255);
        table.text(entity.config);
      });
    }
  }
}
