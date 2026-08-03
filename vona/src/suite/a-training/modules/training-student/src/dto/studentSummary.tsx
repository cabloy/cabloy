import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';
import { ModelStudent } from '../model/student.ts';

export interface IDtoOptionsStudentSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentSummary>()
export class DtoStudentSummary extends $Dto.get(() => ModelStudent, {
  columns: ['id', 'name', 'mobile', 'level', 'description'],
}) {
  @Api.field(v.title($locale('LevelTitle')))
  levelTitle: string;

  @Api.field(v.title($locale('DescriptionLength')))
  descriptionLength: number;

  @Api.field(v.title($locale('Summary')))
  summaryText: string;
}
