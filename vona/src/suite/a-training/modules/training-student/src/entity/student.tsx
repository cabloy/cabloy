import type { IDecoratorEntityOptions } from 'vona-module-a-orm';

import { $makeMetadata, Api, v } from 'vona-module-a-openapiutils';
import { Entity, EntityBase } from 'vona-module-a-orm';
import z from 'zod';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';

export const studentLevelItems = [
  { value: 1, title: $locale('LevelBeginner') },
  { value: 2, title: $locale('LevelIntermediate') },
  { value: 3, title: $locale('LevelAdvanced') },
];

export interface IEntityOptionsStudent extends IDecoratorEntityOptions {}

@Entity<IEntityOptionsStudent>('trainingStudent', {
  openapi: { title: $locale('Student') },
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
export class EntityStudent extends EntityBase {
  @Api.field(
    v.title($locale('Name')),
    v.required(),
    v.min(2),
    ZovaRender.order(1),
    ZovaRender.cell('basic-table:actionView'),
  )
  name: string;

  @Api.field(v.title($locale('Description')), v.optional(), ZovaRender.order(2))
  description?: string;

  @Api.field(
    v.title($locale('Mobile')),
    v.required(),
    v.min(11),
    v.serializerReplace({
      patternFrom: /^(\d{3})\d{4}(\d+)$/,
      patternTo: '$1****$2',
    }),
    ZovaRender.order(3),
  )
  mobile: string;

  @Api.field(
    v.title($locale('Level')),
    v.required(),
    z.union([z.literal(1), z.literal(2), z.literal(3)]),
    ZovaRender.order(4),
    // Tutorial 3 built-in form renderer example. Keep it commented here for side-by-side comparison.
    // ZovaRender.field('basic-select:formFieldSelect', {
    //   items: studentLevelItems,
    //   placeholder: $locale('Level'),
    // }),
    // Tutorial 3 built-in table cell renderer example.
    // ZovaRender.cell('basic-select:select', { items: studentLevelItems }),
    // Tutorial 4 custom form renderer example used by the current implementation.
    ZovaRender.field('training-student:formFieldLevel', {
      items: studentLevelItems,
      placeholder: $locale('Level'),
    }),
    // Tutorial 4 custom table cell renderer example used by the current implementation.
    ZovaRender.cell('training-student:level', { items: studentLevelItems }),
  )
  level: number;
}
