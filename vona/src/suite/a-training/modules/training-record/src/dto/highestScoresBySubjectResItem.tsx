import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsHighestScoresBySubjectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsHighestScoresBySubjectResItem>()
export class DtoHighestScoresBySubjectResItem {
  @Api.field(v.title($locale('SubjectRecordId')), v.tableIdentity())
  subjectRecordId: TableIdentity;

  @Api.field(v.title($locale('SubjectName')))
  subjectName: string;

  @Api.field(v.title($locale('SubjectScore')))
  score: number;

  @Api.field(v.title($locale('TrainingRecordId')), v.tableIdentity())
  trainingRecordId: TableIdentity;

  @Api.field(v.title($locale('TrainingRecordName')))
  trainingRecordName: string;

  @Api.field(v.title($locale('TrainingTime')), v.optional())
  trainingTime?: Date;

  @Api.field(v.title($locale('StudentId')), v.tableIdentity())
  studentId: TableIdentity;

  @Api.field(v.title($locale('StudentName')))
  studentName: string;
}
