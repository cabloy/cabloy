import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { $makeMetadata } from 'vona-module-a-openapiutils';
import { $Dto } from 'vona-module-a-orm';
import { Dto } from 'vona-module-a-web';
import { ModelSubject } from 'vona-module-training-recordsubject';
import { ZovaRender } from 'zova-rest-cabloy-basic-admin';

export interface IDtoOptionsDetailRecordSubjectBase extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsDetailRecordSubjectBase>({
  fields: {
    id: $makeMetadata(ZovaRender.visible(false)),
  },
})
export class DtoDetailRecordSubjectBase extends $Dto.get(() => ModelSubject, {
  columns: ['id', 'deleted', 'name', 'score', 'description'],
}) {}
