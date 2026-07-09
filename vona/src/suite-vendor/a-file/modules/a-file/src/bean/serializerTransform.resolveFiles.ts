import type {
  IDecoratorSerializerTransformOptions,
  ISerializerTransform,
} from 'vona-module-a-serialization';

import { BeanBase } from 'vona';
import { SerializerTransform } from 'vona-module-a-serialization';

import type { IFileDeliveryOptions, IFileView } from '../types/file.ts';
import type { IFileSceneRecord } from '../types/fileScene.ts';

export type TypeSerializerTransformResolveFilesValue = unknown;

export type TypeSerializerTransformResolveFilesData = object;

export type TypeSerializerTransformResolveFilesResult = IFileView[] | undefined;

export interface ISerializerTransformOptionsResolveFiles extends IDecoratorSerializerTransformOptions {
  fieldName: string;
  fileScene?: keyof IFileSceneRecord;
  deliveryOptions?: IFileDeliveryOptions;
}

@SerializerTransform<ISerializerTransformOptionsResolveFiles>()
export class SerializerTransformResolveFiles
  extends BeanBase
  implements
    ISerializerTransform<
      TypeSerializerTransformResolveFilesValue,
      TypeSerializerTransformResolveFilesData,
      TypeSerializerTransformResolveFilesResult
    >
{
  async transform(
    _value: TypeSerializerTransformResolveFilesValue,
    data: TypeSerializerTransformResolveFilesData,
    options: ISerializerTransformOptionsResolveFiles,
  ): Promise<TypeSerializerTransformResolveFilesResult> {
    return await this.bean.file.resolveFiles(
      data[options.fieldName],
      options.fileScene,
      options.deliveryOptions,
    );
  }
}
