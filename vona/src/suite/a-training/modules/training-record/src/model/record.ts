import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityRecord } from '../entity/record.tsx';

export interface IModelOptionsRecord extends IDecoratorModelOptions<EntityRecord> {}

@Model<IModelOptionsRecord>({
  entity: EntityRecord,
  cache: {
    modelsClearedBy: ['training-student:student', 'training-recordsubject:subject'],
  },
  relations: {
    student: $relation.belongsTo(
      'training-record:record',
      'training-student:student',
      'studentId',
      { columns: ['id', 'name'] },
    ),
    trainingRecordSubjects: $relation.hasMany('training-recordsubject:subject', 'recordId', {
      columns: ['id', 'name', 'score', 'description'],
    }),
  },
})
export class ModelRecord extends BeanModelBase<EntityRecord> {}
