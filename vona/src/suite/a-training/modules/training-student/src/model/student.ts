import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';
import { ModelRecord } from 'vona-module-training-record';

import { EntityStudent } from '../entity/student.tsx';

export interface IModelOptionsStudent extends IDecoratorModelOptions<EntityStudent> {}

@Model<IModelOptionsStudent>({
  entity: EntityStudent,
  relations: {
    trainingRecords: $relation.hasMany(() => ModelRecord, 'studentId', {
      columns: ['id', 'name', 'score', 'description'],
      dto: 'detail',
    }),
  },
})
export class ModelStudent extends BeanModelBase<EntityStudent> {}
