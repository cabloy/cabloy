import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { $relation, BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityStudentContent } from '../entity/studentContent.tsx';

export interface IModelOptionsStudentContent extends IDecoratorModelOptions<EntityStudentContent> {}

@Model<IModelOptionsStudentContent>({
  entity: EntityStudentContent,
  relations: {
    student: $relation.belongsTo(
      'training-student:studentContent',
      'training-student:student',
      'studentId',
    ),
  },
  cache: {
    modelsClear: 'training-student:student',
  },
})
export class ModelStudentContent extends BeanModelBase<EntityStudentContent> {}
