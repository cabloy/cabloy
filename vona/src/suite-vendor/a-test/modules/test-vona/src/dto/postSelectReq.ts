import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeSchema, Api, v } from 'vona-module-a-openapiutils';
import { $defineQuery, $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { postAnalysis } from '../lib/postAnalysis.ts';
import { ModelPost } from '../model/post.ts';
import { ModelUser } from '../model/user.ts';

export const postQuery = $defineQuery(() => ModelPost, {
  name: 'TestPostSelect',
  fields: {
    title: {
      operators: ['eq', 'containsI', 'startsWith', 'isNull', 'isNotNull'],
      schema: z.string().nullable(),
    },
    createdAt: {
      operators: ['gte', 'lt', 'lte', 'isNull', 'isNotNull'],
      schema: z.iso.datetime({ offset: true }).nullable(),
      type: 'timestamp',
    },
    userId: { operators: ['eq', 'in'] },
    stars: { operators: ['eq', 'gte', 'gt', 'lte', 'lt'] },
    userName: { operators: ['eqI'] },
  },
  orderable: ['id', 'title', 'createdAt', 'userId', 'stars', 'userName'],
  defaults: { orders: [{ field: 'createdAt', direction: 'desc' }] },
  bindings: {
    userName: {
      modelLike: () => ModelUser,
      field: 'name',
      localKey: 'userId',
      foreignKey: 'id',
      joinType: 'innerJoin',
    },
  },
  conveniences: { userName: { field: 'userName', op: 'eqI' } },
  projection: { mode: 'fixed' },
});

export interface IDtoOptionsPostSelectReq extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsPostSelectReq>({
  query: postQuery,
  analysis: postAnalysis,
  fields: {
    title: $makeSchema(v.optional(), v.nullable(), z.string()),
    createdAt: $makeSchema(
      ZovaRender.field('basic-date:formFieldDateRange'),
      v.filterTransform('a-web:dateRange'),
      v.optional(),
      v.nullable(),
      z.string(),
    ),
  },
})
export class DtoPostSelectReq extends $Dto.queryPage(postQuery, ['title', 'createdAt']) {
  @Api.field(v.optional())
  userName?: string;
}
