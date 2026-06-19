import type { TableIdentity } from 'table-identity';
import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { $locale } from '../.metadata/locales.ts';

export interface IDtoOptionsStudentSummary extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentSummary>()
export class DtoStudentSummary {
  @Api.field(v.tableIdentity())
  id: TableIdentity;

  @Api.field(v.title($locale('Name')))
  name: string;

  @Api.field(
    v.title($locale('Mobile')),
    v.serializerReplace({
      patternFrom: /^(\d{3})\d{4}(\d+)$/,
      patternTo: '$1****$2',
    }),
  )
  mobile: string;

  @Api.field(v.title($locale('Level')))
  level: 1 | 2 | 3;

  @Api.field(v.title($locale('LevelTitle')))
  levelTitle: string;

  @Api.field(v.title($locale('Description')), v.optional())
  description?: string;

  @Api.field(v.title($locale('DescriptionLength')))
  descriptionLength: number;

  @Api.field(v.title($locale('Summary')))
  summaryText: string;
}
