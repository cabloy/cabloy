import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelRecord } from 'vona-module-training-record';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

export interface IDtoOptionsDetailRecordBase extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDetailRecordBase>({
  fields: {
    id: $makeMetadata(ZovaRender.visible(false)),
  },
})
export class DtoDetailRecordBase extends $Dto.get(() => ModelRecord, {
  columns: ['id', 'name', 'score', 'description'],
}) {}
