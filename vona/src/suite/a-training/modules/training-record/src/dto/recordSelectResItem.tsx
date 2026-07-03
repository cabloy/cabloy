import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { DtoImageView } from 'vona-module-a-image';
import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelRecord } from '../model/record.ts';

export interface IDtoOptionsRecordSelectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsRecordSelectResItem>({
  blocks: [
    ZovaRender.block('basic-page:blockPage', {
      blocks: [
        ZovaRender.block('basic-page:blockFilter'),
        ZovaRender.block('basic-page:blockToolbarBulk', {
          actions: [ZovaRender.tableActionBulk('basic-table:actionCreate')],
        }),
        ZovaRender.block('basic-page:blockTable'),
        ZovaRender.block('basic-page:blockPager'),
      ],
    }),
  ],
})
export class DtoRecordSelectResItem extends $Dto.get(() => ModelRecord) {
  @Api.field(
    ZovaRender.visible(false),
    v.optional(),
    v.serializerTransform('a-image:resolveViews', {
      fieldName: 'sceneImageIds',
      imageScene: 'training-record:sceneImage',
    }),
    v.array(DtoImageView),
  )
  sceneImages?: DtoImageView[];

  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('basic-table:actionOperationsRow', {
      actions: [
        ZovaRender.tableActionRow('basic-table:actionUpdate'),
        ZovaRender.tableActionRow('basic-table:actionDelete'),
      ],
    }),
  )
  _operationsRow?: unknown;
}
