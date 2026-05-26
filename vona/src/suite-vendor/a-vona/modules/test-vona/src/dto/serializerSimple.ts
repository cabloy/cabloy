import type { IDecoratorDtoOptions } from 'vona-module-a-web';

import { Api, v } from 'vona-module-a-openapiutils';
import { Dto } from 'vona-module-a-web';

import { SensitiveEmail } from '../lib/serializer.ts';

export interface IDtoOptionsSerializerSimple extends IDecoratorDtoOptions {}

@Dto<IDtoOptionsSerializerSimple>()
export class DtoSerializerSimple {
  @Api.field(v.serializerExclude(), v.min(6))
  password: string;

  @Api.field(v.serializerExclude(), v.min(6))
  password2: string;

  @Api.field(v.serializerTransform('test-vona:email'))
  email: string;

  @Api.field(
    v.serializerTransform('a-serialization:replace', {
      // eslint-disable-next-line
      patternFrom: /(\w?)(\w+)(\w)(@\w+\.[a-z]+)/,
      patternTo: '$1****$3$4',
    }),
    v.email(),
  )
  email2: string;

  @Api.field(
    v.serializerReplace({
      // eslint-disable-next-line
      patternFrom: /(\w?)(\w+)(\w)(@\w+\.[a-z]+)/,
      patternTo: '$1****$3$4',
    }),
    v.email(),
  )
  email3: string;

  @Api.field(SensitiveEmail())
  email4: string;

  @Api.field(
    v.openapi({
      serializerTransforms: {
        'a-serialization:replace': {
          // eslint-disable-next-line
          patternFrom: /(\w?)(\w+)(\w)(@\w+\.[a-z]+)/,
          patternTo: '$1****$3$4',
        },
      },
    }),
    v.email(),
  )
  email5: string;

  @Api.field(
    v.serializerTransform('a-serialization:replace', {
      // eslint-disable-next-line
      patternFrom: /(\w?)(\w+)(\w)(@\w+\.[a-z]+)/,
      patternTo: '$1****$3$4',
    }),
    v.email(),
  )
  email6: string;

  @Api.field(
    v.serializerReplace({
      // eslint-disable-next-line
      patternFrom: /(\w?)(\w+)(\w)(@\w+\.[a-z]+)/,
      patternTo: '$1****$3$4',
    }),
    v.email(),
  )
  email7: string;

  @Api.field()
  firstName: string;

  @Api.field()
  lastName: string;

  @Api.field(
    v.serializerGetter((data: DtoSerializerSimple) => {
      return `${data.firstName} ${data.lastName}`;
    }),
    v.optional(),
  )
  fullName: string;

  @Api.field(
    v.serializerGetter((data: DtoSerializerSimple) => {
      return `${data.firstName} ${data.lastName}`;
    }),
    v.optional(),
  )
  fullName2: string;

  @Api.field(v.optional())
  get fullName3(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Api.field(
    v.serializerCustom((_value, data: DtoSerializerSimple) => {
      return `${data.firstName} ${data.lastName}`;
    }),
    v.optional(),
  )
  fullName4: string;
}
