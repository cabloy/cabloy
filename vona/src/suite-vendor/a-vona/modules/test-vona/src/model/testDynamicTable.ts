import type { VonaContext } from 'vona';
import type { IDecoratorModelOptions, ITableRecord } from 'vona-module-a-orm';

import { DateTime } from 'luxon';
import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityTest } from '../entity/test.ts';

export interface IModelOptionsTestDynamicTable extends IDecoratorModelOptions<EntityTest> {}

@Model<IModelOptionsTestDynamicTable>({
  entity: EntityTest,
  table(ctx: VonaContext, _where: EntityTest | undefined, defaultTable: keyof ITableRecord) {
    if (ctx.instanceName !== '') return defaultTable;
    return `${defaultTable}_${DateTime.now().toFormat('yyyyMMdd')}`;
  },
  softDeletionPrune: {
    handler: async (_ctx, _modelInstance: ModelTestDynamicTable) => {
      // do nothing
    },
  },
})
export class ModelTestDynamicTable extends BeanModelBase<EntityTest> {}
