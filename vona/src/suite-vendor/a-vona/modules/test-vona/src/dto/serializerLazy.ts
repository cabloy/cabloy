import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { DtoSerializerSimple } from './serializerSimple.ts';

export interface IDtoOptionsSerializerLazy extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSerializerLazy>()
export class DtoSerializerLazy {
  @Api.field(
    v.serializerGetter((value: DtoSerializerSimple) => {
      return { ...value, password: '111111' };
    }),
    v.object(DtoSerializerSimple),
  )
  simple: DtoSerializerSimple;

  @Api.field(
    v.serializerGetter((value: DtoSerializerSimple) => {
      return { ...value, password: '111111' };
    }),
    v.title('title'),
    v.optional(),
    v.lazy(v.description('description'), () => {
      return DtoSerializerSimple;
    }),
  )
  simpleLazy: DtoSerializerSimple;
}
