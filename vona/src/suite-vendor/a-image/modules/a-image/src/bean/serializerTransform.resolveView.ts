import type {
  IDecoratorSerializerTransformOptions,
  ISerializerTransform,
} from 'vona-module-a-serialization';

import { BeanBase } from 'vona';
import { SerializerTransform } from 'vona-module-a-serialization';

import type { DtoImageView } from '../dto/imageView.ts';
import type { IImageSceneRecord } from '../types/imageScene.ts';

export type TypeSerializerTransformResolveViewValue = unknown;

export type TypeSerializerTransformResolveViewData = object;

export type TypeSerializerTransformResolveViewResult = DtoImageView | undefined;

export interface ISerializerTransformOptionsResolveView extends IDecoratorSerializerTransformOptions {
  fieldName: string;
  imageScene?: keyof IImageSceneRecord;
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
    return data[options.fieldName]
      ? await this.bean.image.resolveView(data[options.fieldName], undefined, options.imageScene)
      : undefined;
  }
}
