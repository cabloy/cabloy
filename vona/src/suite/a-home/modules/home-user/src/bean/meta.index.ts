import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('homeUser', 'name'),
    ...$tableColumns('homeRole', 'name'),
    ...$tableColumns('homeRoleUser', ['userId', 'roleId']),
  },
})
export class MetaIndex extends BeanBase {}
