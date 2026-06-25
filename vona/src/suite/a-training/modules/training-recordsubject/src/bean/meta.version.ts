import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      const entitySubject = this.scope.entity.subject;
      await this.bean.model.createTable(entitySubject.$table, table => {
        table.comment(entitySubject.$comment.$table);
        table.basicFields();
        table.tableIdentity(entitySubject.recordId).comment(entitySubject.$comment.recordId);
        table.string(entitySubject.name, 50).comment(entitySubject.$comment.name);
        table.integer(entitySubject.score).comment(entitySubject.$comment.score);
        table.string(entitySubject.description, 255).comment(entitySubject.$comment.description);
      });
    }
  }
}
