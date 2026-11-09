import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, v } from 'vona-module-a-openapiutils';
import { $defineQuery, $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelStudent } from 'vona-module-training-student';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { ModelRecord } from '../model/record.ts';

export const recordQuery = $defineQuery(() => ModelRecord, {
  name: 'TrainingRecordSelect',
  fields: {
    name: { operators: ['eq', 'containsI'] },
    studentId: { operators: ['eq'] },
    studentName: { operators: ['containsI'] },
    createdAt: { operators: ['gte', 'lt', 'lte'] },
  },
  orderable: ['id', 'name', 'studentId', 'studentName', 'createdAt'],
  defaults: { orders: [{ field: 'createdAt', direction: 'desc' }] },
  bindings: {
    studentName: {
      modelLike: () => ModelStudent,
      field: 'name',
      localKey: 'studentId',
      foreignKey: 'id',
      joinType: 'innerJoin',
    },
  },
  conveniences: { studentId: { field: 'studentName', op: 'containsI' } },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsRecordSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordSelectReq>({
  query: recordQuery,
  fields: {
    name: $makeSchema(v.optional(), z.string()),
    studentId: $makeSchema(
      ZovaRender.field('basic-input:formFieldInput'),
      v.optional(),
      z.string(),
    ),
    createdAt: $makeSchema(
      ZovaRender.field('basic-date:formFieldDateRange'),
      v.filterTransform('a-web:dateRange'),
      v.optional(),
      z.string(),
    ),
  },
})
export class DtoRecordSelectReq extends $Dto.queryPage(recordQuery, [
  'name',
  'studentId',
  'createdAt',
]) {}
