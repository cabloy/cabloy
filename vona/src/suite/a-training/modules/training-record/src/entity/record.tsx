import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export interface IEntityOptionsRecord extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsRecord>('trainingRecord', {
  openapi: { title: $locale('TrainingRecord') },
  fields: {
    id: $makeMetadata(ZovaRender.order(1, 'core')),
    iid: $makeMetadata(ZovaRender.visible(false)),
    deleted: $makeMetadata(ZovaRender.visible(false)),
    createdAt: $makeMetadata(
      ZovaRender.order(-2, 'max'),
      ZovaRender.field('basic-date:formFieldDate'),
      ZovaRender.cell('basic-date:date'),
    ),
    updatedAt: $makeMetadata(
      ZovaRender.order(-1, 'max'),
      ZovaRender.field('basic-date:formFieldDate'),
      ZovaRender.cell('basic-date:date'),
    ),
  },
})
export class EntityRecord extends EntityBase {
  @Api.field(v.required(), ZovaRender.visible(false))
  studentId: TableIdentity;

  @Api.field(v.title($locale('Name')), v.required(), v.min(2), ZovaRender.order(1))
  name: string;

  @Api.field(v.title($locale('Score')), v.optional(), ZovaRender.order(2))
  score?: number;

  @Api.field(v.title($locale('Description')), v.optional(), ZovaRender.order(3))
  description?: string;
}
