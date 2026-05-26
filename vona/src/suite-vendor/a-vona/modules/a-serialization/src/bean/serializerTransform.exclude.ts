import type {
  IDecoratorSerializerTransformOptions,
  ISerializerTransform,
} from 'vona-module-a-serialization';

import { BeanBase } from 'vona';
import { SerializerTransform } from 'vona-module-a-serialization';

export type TypeSerializerTransformExcludeValue = unknown;

export type TypeSerializerTransformExcludeData = unknown;

export type TypeSerializerTransformExcludeResult = TypeSerializerTransformExcludeValue;

export interface ISerializerTransformOptionsExclude extends IDecoratorSerializerTransformOptions {
  exclude?: boolean;
}

@SerializerTransform<ISerializerTransformOptionsExclude>()
export class SerializerTransformExclude
  extends BeanBase
  implements
    ISerializerTransform<
      TypeSerializerTransformExcludeValue,
      TypeSerializerTransformExcludeData,
      TypeSerializerTransformExcludeResult
    >
{
  async transform(
    value: TypeSerializerTransformExcludeValue,
    _data: TypeSerializerTransformExcludeData,
    options: ISerializerTransformOptionsExclude,
  ): Promise<TypeSerializerTransformExcludeResult> {
    return options.exclude !== false ? undefined : value;
  }
}
