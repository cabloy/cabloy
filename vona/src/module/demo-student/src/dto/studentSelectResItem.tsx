import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { $locale } from '../.metadata/locales.ts';
import { ModelStudent } from '../model/student.ts';

export interface IDtoOptionsStudentSelectResItem extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsStudentSelectResItem>({
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
export class DtoStudentSelectResItem extends $Dto.get(() => ModelStudent) {
  @Api.field(
    v.title($locale('Operations')),
    ZovaRender.order(1, 'max'),
    ZovaRender.cell('demo-student:actionOperationsRow', {
      actions: [
        ZovaRender.tableActionRow('demo-student:actionSummary', {
          permission: { actionInherit: 'view' },
        }),
        ZovaRender.tableActionRow('basic-table:actionUpdate'),
        ZovaRender.tableActionRow('basic-table:actionDelete'),
        ZovaRender.tableActionRow('demo-student:actionDeleteForce', {
          permission: { actionInherit: 'delete' },
        }),
      ],
    }),
  )
  _operationsRow?: unknown;
}
