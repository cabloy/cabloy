import type {
  IDecoratorSerializerTransformOptions,
  ISerializerTransform,
  TypeSerializerTransformCustom,
} from 'vona-module-a-serialization';

import { BeanBase } from 'vona';
import { SerializerTransform } from 'vona-module-a-serialization';

export type TypeSerializerTransformCustomValue = unknown;

export type TypeSerializerTransformCustomData = unknown;

export type TypeSerializerTransformCustomResult = TypeSerializerTransformCustomValue;

export interface ISerializerTransformOptionsCustom extends IDecoratorSerializerTransformOptions {
  custom: TypeSerializerTransformCustom;
}

@SerializerTransform<ISerializerTransformOptionsCustom>()
export class SerializerTransformCustom
  extends BeanBase
  implements
    ISerializerTransform<
      TypeSerializerTransformCustomValue,
      TypeSerializerTransformCustomData,
      TypeSerializerTransformCustomResult
    >
{
  async transform(
    value: TypeSerializerTransformCustomValue,
    data: TypeSerializerTransformCustomData,
    options: ISerializerTransformOptionsCustom,
  ): Promise<TypeSerializerTransformCustomResult> {
    if (!options.custom) return value;
    return options.custom.call(this.ctx, value, data, options);
  }
}
