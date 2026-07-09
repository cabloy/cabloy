import type {
  IDecoratorSerializerTransformOptions,
  ISerializerTransform,
} from 'vona-module-a-serialization';

import { BeanBase } from 'vona';
import { SerializerTransform } from 'vona-module-a-serialization';

import type { IFileDeliveryOptions, IFileView } from '../types/file.ts';
import type { IFileSceneRecord } from '../types/fileScene.ts';

export type TypeSerializerTransformResolveFileValue = unknown;

export type TypeSerializerTransformResolveFileData = object;

export type TypeSerializerTransformResolveFileResult = IFileView | undefined;

export interface ISerializerTransformOptionsResolveFile extends IDecoratorSerializerTransformOptions {
  fieldName: string;
  fileScene?: keyof IFileSceneRecord;
  deliveryOptions?: IFileDeliveryOptions;
}

@SerializerTransform<ISerializerTransformOptionsResolveFile>()
export class SerializerTransformResolveFile
  extends BeanBase
  implements
    ISerializerTransform<
      TypeSerializerTransformResolveFileValue,
      TypeSerializerTransformResolveFileData,
      TypeSerializerTransformResolveFileResult
    >
{
  async transform(
    _value: TypeSerializerTransformResolveFileValue,
    data: TypeSerializerTransformResolveFileData,
    options: ISerializerTransformOptionsResolveFile,
  ): Promise<TypeSerializerTransformResolveFileResult> {
    return await this.bean.file.resolveFile(
      data[options.fieldName],
      options.fileScene,
      options.deliveryOptions,
    );
  }
}
