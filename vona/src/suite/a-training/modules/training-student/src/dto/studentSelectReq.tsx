import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata, $makeSchema, v } from 'vona-module-a-openapiutils';
import { $defineQuery, $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { studentLevelItems } from '../entity/student.tsx';
import { studentAnalysis } from '../lib/studentAnalysis.ts';
import { ModelStudent } from '../model/student.ts';

export const studentQuery = $defineQuery(() => ModelStudent, {
  name: 'TrainingStudentSelect',
  fields: {
    id: { operators: ['eq', 'in'] },
    name: { operators: ['eq', 'containsI', 'startsWith'] },
    level: {
      operators: ['eq', 'gte'],
      schema: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      type: 'number',
    },
    createdAt: { operators: ['gte', 'lt', 'lte'] },
  },
  orderable: ['id', 'name', 'level', 'createdAt'],
  defaults: { orders: [{ field: 'createdAt', direction: 'desc' }] },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsStudentSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentSelectReq>({
  query: studentQuery,
  analysis: studentAnalysis,
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
export class DtoStudentSelectReq extends $Dto.queryPage(studentQuery, [
  'name',
  'level',
  'createdAt',
]) {}
