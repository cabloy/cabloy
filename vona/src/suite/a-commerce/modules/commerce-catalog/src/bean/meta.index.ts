import type { IMetaOptionsIndex } from 'vona-module-a-index';

import { BeanBase } from 'vona';
import { Meta } from 'vona-module-a-meta';
import { $tableColumns } from 'vona-module-a-ormutils';

@Meta<IMetaOptionsIndex>({
  indexes: {
    ...$tableColumns('commerceCatalogSku', ['code', 'productId', 'lifecycle']),
    ...$tableColumns('commerceCatalogProduct', ['title', 'categoryId']),
    ...$tableColumns('commerceCatalogCategory', ['name', 'parentId']),
  },
})
export class MetaIndex extends BeanBase {}
