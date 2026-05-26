import { BeanBase } from 'vona';

import type {
  IDecoratorSerializerTransformOptions,
  ISerializerTransform,
  TypeSerializerTransformGetter,
} from '../types/serializerTransform.ts';

import { SerializerTransform } from '../lib/serializerTransform.ts';

export type TypeSerializerTransformGetterValue = unknown;

export type TypeSerializerTransformGetterData = unknown;

export type TypeSerializerTransformGetterResult = TypeSerializerTransformGetterValue;

export interface ISerializerTransformOptionsGetter extends IDecoratorSerializerTransformOptions {
  getter: TypeSerializerTransformGetter;
}

@SerializerTransform<ISerializerTransformOptionsGetter>()
export class SerializerTransformGetter
  extends BeanBase
  implements
    ISerializerTransform<
      TypeSerializerTransformGetterValue,
      TypeSerializerTransformGetterData,
      TypeSerializerTransformGetterResult
    >
{
  async transform(
    value: TypeSerializerTransformGetterValue,
    data: TypeSerializerTransformGetterData,
    options: ISerializerTransformOptionsGetter,
  ): Promise<TypeSerializerTransformGetterResult> {
    const getter = options.getter;
    if (!getter) return value;
    if (getter.name.startsWith('get ')) {
      return getter.call(data as any, data, value);
    } else {
      return getter.call(this.ctx, data, value);
    }
  }
}
