import type { TableIdentity } from 'table-identity';
import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, $resourceName, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { onEffectForAverageScore } from '../lib/onEffectForAverageScore.tsx';

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
  @Api.field(
    v.title($locale('TrainingRecordName')),
    v.required(),
    v.min(2),
    ZovaRender.order(1),
    ZovaRender.cell('basic-table:actionView'),
  )
  name: string;

  @Api.field(
    v.title($locale('Student')),
    v.required(),
    ZovaRender.order(2),
    ZovaRender.field('basic-resource:formFieldResourcePicker', {
      resource: $resourceName('training-student:student'),
    }),
    ZovaRender.cell('basic-resource:resourcePicker', {
      resource: $resourceName('training-student:student'),
    }),
    v.tableIdentity(),
  )
  studentId: TableIdentity;

  @Api.field(
    v.title($locale('SubjectCount')),
    v.optional(),
    ZovaRender.order(3),
    ZovaRender.onEffect(onEffectForAverageScore),
    z.int(),
  )
  subjectCount?: number;

  @Api.field(
    v.title($locale('TotalScore')),
    v.optional(),
    ZovaRender.order(4),
    ZovaRender.onEffect(onEffectForAverageScore),
    z.int(),
  )
  totalScore?: number;

  @Api.field(v.title($locale('AverageScore')), v.optional(), ZovaRender.order(5))
  averageScore?: number;

  @Api.field(
    v.title($locale('TrainingTime')),
    v.optional(),
    ZovaRender.order(6),
    ZovaRender.field('basic-date:formFieldDate', { preset: 'DATE_FULL' }),
    ZovaRender.cell('basic-date:date', { preset: 'DATE_FULL' }),
  )
  trainingTime?: Date;

  @Api.field(
    v.title($locale('ScenePhotos')),
    v.optional(),
    ZovaRender.order(7),
    ZovaRender.field('basic-image:formFieldImage', {
      imageScene: 'training-record:sceneImage',
      multiple: true,
      maxCount: 9,
      relationName: 'sceneImages',
      accept: ['image/png', 'image/jpeg', 'image/webp'],
      maxSize: 2 * 1024 * 1024,
      enableCrop: false,
      resize: {
        width: 1280,
        height: 1280,
        fit: 'contain',
        format: 'jpeg',
        quality: 90,
      },
    }),
    ZovaRender.cell('basic-image:image', { relationName: 'sceneImages' }),
    v.array(v.tableIdentity()),
  )
  sceneImageIds?: TableIdentity[];

  @Api.field(
    v.title($locale('DossierFiles')),
    v.optional(),
    ZovaRender.visible(false),
    ZovaRender.order(8),
    v.array(v.tableIdentity()),
  )
  dossierFileIds?: TableIdentity[];

  @Api.field(v.title($locale('Description')), v.optional(), ZovaRender.order(9))
  description?: string;
}
