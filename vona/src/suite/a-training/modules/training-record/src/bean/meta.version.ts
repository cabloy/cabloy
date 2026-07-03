import type { IMetaVersionUpdate, IMetaVersionUpdateOptions } from 'vona-module-a-version';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';

@Meta()
export class MetaVersion extends BeanBase implements IMetaVersionUpdate {
  async update(options: IMetaVersionUpdateOptions) {
    if (options.version === 1) {
      const entityRecord = this.scope.entity.record;
      await this.bean.model.createTable(entityRecord.$table, table => {
        table.comment(entityRecord.$comment.$table);
        table.basicFields();
        table.tableIdentity(entityRecord.studentId).comment(entityRecord.$comment.studentId);
        table.string(entityRecord.name, 50).comment(entityRecord.$comment.name);
        table.integer(entityRecord.subjectCount).comment(entityRecord.$comment.subjectCount);
        table.integer(entityRecord.totalScore).comment(entityRecord.$comment.totalScore);
        table.decimal(entityRecord.averageScore, 8, 2).comment(entityRecord.$comment.averageScore);
        table.dateTime(entityRecord.trainingTime).comment(entityRecord.$comment.trainingTime);
        table.json(entityRecord.sceneImageIds).comment(entityRecord.$comment.sceneImageIds);
        table.string(entityRecord.description, 255).comment(entityRecord.$comment.description);
      });
    }
  }
}
