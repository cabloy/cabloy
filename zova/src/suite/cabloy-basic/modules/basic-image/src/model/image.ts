import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type { ApiApiImagegetUploadPolicyResponseBody } from '../api/image.js';

export interface IModelOptionsImage extends IDecoratorModelOptions {}

@Model<IModelOptionsImage>()
export class ModelImage extends BeanModelBase {
  getUploadPolicy(imageScene?: string) {
    if (!imageScene) return undefined;
    return this.$useStateData<ApiApiImagegetUploadPolicyResponseBody>({
      queryKey: ['uploadPolicy', 'image', imageScene],
      queryFn: async () => {
        return this.scope.api.image.getUploadPolicy({ imageScene });
      },
      meta: {
        disableSuspenseOnInit: true,
      },
    });
  }
}
