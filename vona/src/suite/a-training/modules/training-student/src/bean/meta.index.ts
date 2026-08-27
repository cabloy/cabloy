import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('trainingStudent', 'name'),
    ...$tableColumns('trainingStudentContent', 'studentId'),
  },
})
export class MetaIndex extends BeanBase {}
