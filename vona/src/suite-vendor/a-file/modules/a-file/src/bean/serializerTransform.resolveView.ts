import type {
  IDecoratorSerializerTransformOptions,
  ISerializerTransform,
} from 'vona-module-a-serialization';

import { BeanBase } from 'vona';
import { SerializerTransform } from 'vona-module-a-serialization';

import type { IFileDeliveryOptions, IFileView } from '../types/file.ts';
import type { IFileSceneRecord } from '../types/fileScene.ts';

export type TypeSerializerTransformResolveViewValue = unknown;

export type TypeSerializerTransformResolveViewData = object;

export type TypeSerializerTransformResolveViewResult = IFileView | undefined;

export interface ISerializerTransformOptionsResolveView extends IDecoratorSerializerTransformOptions {
  fieldName: string;
  fileScene?: keyof IFileSceneRecord;
  deliveryOptions?: IFileDeliveryOptions;
}

@SerializerTransform<ISerializerTransformOptionsResolveView>()
export class SerializerTransformResolveView
  extends BeanBase
  implements
    ISerializerTransform<
      TypeSerializerTransformResolveViewValue,
      TypeSerializerTransformResolveViewData,
      TypeSerializerTransformResolveViewResult
    >
{
  async transform(
    _value: TypeSerializerTransformResolveViewValue,
    data: TypeSerializerTransformResolveViewData,
    options: ISerializerTransformOptionsResolveView,
  ): Promise<TypeSerializerTransformResolveViewResult> {
    return await this.bean.file.resolveView(
      data[options.fieldName],
      options.fileScene,
      options.deliveryOptions,
    );
  }
}
