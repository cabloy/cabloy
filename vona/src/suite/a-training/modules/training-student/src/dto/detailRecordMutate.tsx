import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelRecord } from 'vona-module-training-record';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

import { DtoDetailRecordBase } from './detailRecordBase.tsx';

export interface IDtoOptionsDetailRecordMutate extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDetailRecordMutate>({
  blocks: [
    ZovaRender.block('basic-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('basic-pageentry:blockForm'),
        ZovaRender.block('basic-pageentry:blockToolbarRow', {
          actions: [
            ZovaRender.formActionRow('basic-form:actionSubmit', {
              permission: { actionInherit: 'update', formScene: ['create', 'edit'] },
            }),
            ZovaRender.formActionRow('basic-form:actionBack', { permission: { public: true } }),
          ],
        }),
      ],
    }),
  ],
})
export class DtoDetailRecordMutate extends $Dto.mutate(() => ModelRecord, {
  dtoClass: DtoDetailRecordBase,
}) {}
