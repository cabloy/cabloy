import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityStudent } from '../entity/student.tsx';

export interface IModelOptionsStudent extends IDecoratorModelOptions<EntityStudent> {}

@Model<IModelOptionsStudent>({
  entity: EntityStudent,
  relations: {
    trainingRecords: $relation.hasMany('training-record:record', 'studentId', {
      columns: [
        'id',
        'name',
        'subjectCount',
        'totalScore',
        'averageScore',
        'trainingTime',
        'sceneImageIds',
        'dossierFileIds',
        'description',
      ],
    }),
    content: $relation.hasOne('training-student:studentContent', 'studentId', {
      columns: ['id', 'descriptionMarkdown'],
    }),
    contentHtml: $relation.hasOne('training-student:studentContent', 'studentId', {
      columns: ['id', 'descriptionHtml'],
    }),
  },
})
export class ModelStudent extends BeanModelBase<EntityStudent> {}
