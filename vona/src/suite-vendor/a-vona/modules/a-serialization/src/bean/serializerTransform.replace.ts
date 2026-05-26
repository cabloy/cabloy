import { BeanBase } from 'vona';

import type {
  IDecoratorSerializerTransformOptions,
  ISerializerTransform,
} from '../types/serializerTransform.ts';

import { SerializerTransform } from '../lib/serializerTransform.ts';

export type TypeSerializerTransformReplaceValue = string | undefined;

export type TypeSerializerTransformReplaceData = unknown;

export type TypeSerializerTransformReplaceResult = TypeSerializerTransformReplaceValue;

export interface ISerializerTransformOptionsReplace extends IDecoratorSerializerTransformOptions {
  patternFrom: RegExp;
  patternTo: string;
}

@SerializerTransform<ISerializerTransformOptionsReplace>()
export class SerializerTransformReplace
  extends BeanBase
  implements
    ISerializerTransform<
      TypeSerializerTransformReplaceValue,
      TypeSerializerTransformReplaceData,
      TypeSerializerTransformReplaceResult
    >
{
  async transform(
    value: TypeSerializerTransformReplaceValue,
    _data: TypeSerializerTransformReplaceData,
    options: ISerializerTransformOptionsReplace,
  ): Promise<TypeSerializerTransformReplaceResult> {
    if (!value) return value;
    return value.replace(options.patternFrom, options.patternTo);
  }
}
