import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type { ApiApiImagegetUploadPolicyResponseBody } from '../api/image.js';

export interface IModelOptionsImage extends IDecoratorModelOptions {}

@Model<IModelOptionsImage>()
export class ModelImage extends BeanModelBase {
  getUploadPolicy(imageScene?: string) {
    if (!imageScene) return undefined;
    return this.$useStateData<ApiApiImagegetUploadPolicyResponseBody>({
      queryKey: ['uploadPolicy', imageScene],
      queryFn: async () => {
        return this.scope.api.image.getUploadPolicy({ imageScene });
      },
      enabled: false,
      staleTime: Infinity,
      meta: {
        disableSuspenseOnInit: true,
      },
    });
  }

  async ensureUploadPolicy(imageScene?: string) {
    const query = this.getUploadPolicy(imageScene);
    if (!query) return undefined;
    if (query.data !== undefined) return query.data;
    const result = await query.refetch();
    return result.data ?? query.data ?? undefined;
  }
}
