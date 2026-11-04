import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, $makeSchema, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { EntityStudent, studentLevelItems } from '../entity/student.tsx';
import { studentAnalysis } from '../lib/studentAnalysis.ts';

export interface IDtoOptionsStudentSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentSelectReq>({
  analysis: studentAnalysis,
  openapi: { filter: { table: 'trainingStudent' } },
  fields: {
    name: $makeSchema(v.optional(), z.string()),
    level: $makeMetadata(
      ZovaRender.field('basic-select:formFieldSelect', {
        items: studentLevelItems,
        // Keep placeholder undefined so the filter select gets a real empty option
        // instead of a disabled placeholder, allowing users to clear the filter.
        placeholder: undefined,
      }),
    ),
    createdAt: $makeSchema(
      ZovaRender.field('basic-date:formFieldDateRange'),
      v.filterTransform('a-web:dateRange'),
      v.optional(),
      z.string(),
    ),
  },
})
export class DtoStudentSelectReq extends $Dto.queryPage(EntityStudent, [
  'name',
  'level',
  'createdAt',
]) {}
