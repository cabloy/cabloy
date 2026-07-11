import type {
  IDecoratorSerializerTransformOptions,
  ISerializerTransform,
} from 'vona-module-a-serialization';

import { BeanBase } from 'vona';
import { SerializerTransform } from 'vona-module-a-serialization';

import type { DtoImageView } from '../dto/imageView.ts';
import type { IImageDeliveryOptions } from '../types/image.ts';
import type { IImageSceneRecord } from '../types/imageScene.ts';

export type TypeSerializerTransformResolveViewsValue = unknown;

export type TypeSerializerTransformResolveViewsData = object;

export type TypeSerializerTransformResolveViewsResult = DtoImageView[] | undefined;

export interface ISerializerTransformOptionsResolveViews extends IDecoratorSerializerTransformOptions {
  fieldName: string;
  imageScene?: keyof IImageSceneRecord;
  deliveryOptions?: IImageDeliveryOptions;
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
    return await this.bean.image.resolveViews(
      data[options.fieldName],
      undefined,
      options.imageScene,
      options.deliveryOptions,
    );
  }
}
