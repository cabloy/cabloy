import type {
  IDecoratorSerializerTransformOptions,
  ISerializerTransform,
} from 'vona-module-a-serialization';

import { BeanBase } from 'vona';
import { SerializerTransform } from 'vona-module-a-serialization';

export type TypeSerializerTransformEmailValue = string | undefined;

export type TypeSerializerTransformEmailData = unknown;

export type TypeSerializerTransformEmailResult = TypeSerializerTransformEmailValue;

export interface ISerializerTransformOptionsEmail extends IDecoratorSerializerTransformOptions {}

@SerializerTransform<ISerializerTransformOptionsEmail>()
export class SerializerTransformEmail
  extends BeanBase
  implements
    ISerializerTransform<
      TypeSerializerTransformEmailValue,
      TypeSerializerTransformEmailData,
      TypeSerializerTransformEmailResult
    >
{
  async transform(
    value: TypeSerializerTransformEmailValue,
    _data: TypeSerializerTransformEmailData,
    _options: ISerializerTransformOptionsEmail,
  ): Promise<TypeSerializerTransformEmailResult> {
    // eslint-disable-next-line
    return value?.replace(/(\w?)(\w+)(\w)(@\w+\.[a-z]+)/, '$1****$3$4');
  }
}
