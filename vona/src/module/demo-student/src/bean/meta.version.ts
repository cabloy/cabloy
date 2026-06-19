import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      const entityStudent = this.scope.entity.student;
      await this.bean.model.createTable(entityStudent.$table, table => {
        table.comment(entityStudent.$comment.$table);
        table.basicFields();
        table.string(entityStudent.name, 50).comment(entityStudent.$comment.name);
        table.string(entityStudent.description, 255).comment(entityStudent.$comment.description);
        table.string(entityStudent.mobile, 50).comment(entityStudent.$comment.mobile);
        table.integer(entityStudent.level).comment(entityStudent.$comment.level);
      });
    }
  }
}
