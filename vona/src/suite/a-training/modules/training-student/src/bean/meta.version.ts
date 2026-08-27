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
        table.string(entityStudent.mobile, 50).comment(entityStudent.$comment.mobile);
        table.tableIdentity(entityStudent.imageId).comment(entityStudent.$comment.imageId);
        table.integer(entityStudent.level).comment(entityStudent.$comment.level);
      });

      const entityStudentContent = this.scope.entity.studentContent;
      await this.bean.model.createTable(entityStudentContent.$table, table => {
        table.comment(entityStudentContent.$comment.$table);
        table.basicFields();
        table
          .text(entityStudentContent.descriptionMarkdown)
          .comment(entityStudentContent.$comment.descriptionMarkdown);
        table
          .text(entityStudentContent.descriptionHtml)
          .comment(entityStudentContent.$comment.descriptionHtml);
        table
          .tableIdentity(entityStudentContent.studentId)
          .comment(entityStudentContent.$comment.studentId);
        table.index(
          [entityStudentContent.studentId],
          `idx_${entityStudentContent.$table}_studentId`,
        );
      });
    }
  }
}
