import type {
  IDecoratorSerializerTransformOptions,
  ISerializerTransform,
} from 'vona-module-a-serialization';

import { BeanBase } from 'vona';
import { SerializerTransform } from 'vona-module-a-serialization';

import type { IFileDeliveryOptions, IFileView } from '../types/file.ts';
import type { IFileSceneRecord } from '../types/fileScene.ts';

export type TypeSerializerTransformResolveViewsValue = unknown;

export type TypeSerializerTransformResolveViewsData = object;

export type TypeSerializerTransformResolveViewsResult = IFileView[] | undefined;

export interface ISerializerTransformOptionsResolveViews extends IDecoratorSerializerTransformOptions {
  fieldName: string;
  fileScene?: keyof IFileSceneRecord;
  deliveryOptions?: IFileDeliveryOptions;
}

@SerializerTransform<ISerializerTransformOptionsResolveViews>()
export class SerializerTransformResolveViews
  extends BeanBase
  implements
    ISerializerTransform<
      TypeSerializerTransformResolveViewsValue,
      TypeSerializerTransformResolveViewsData,
      TypeSerializerTransformResolveViewsResult
    >
{
  async transform(
    _value: TypeSerializerTransformResolveViewsValue,
    data: TypeSerializerTransformResolveViewsData,
    options: ISerializerTransformOptionsResolveViews,
  ): Promise<TypeSerializerTransformResolveViewsResult> {
    return await this.bean.file.resolveViews(
      data[options.fieldName],
      options.fileScene,
      options.deliveryOptions,
    );
  }
}
