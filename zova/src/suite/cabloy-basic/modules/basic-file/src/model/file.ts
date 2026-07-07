import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type { ApiApiFilegetUploadPolicyResponseBody } from '../api/file.js';

export interface IModelOptionsFile extends IDecoratorModelOptions {}

@Model<IModelOptionsFile>()
export class ModelFile extends BeanModelBase {
  getUploadPolicy(fileScene?: string) {
    if (!fileScene) return undefined;
    return this.$useStateData<ApiApiFilegetUploadPolicyResponseBody>({
      queryKey: ['uploadPolicy', fileScene],
      queryFn: async () => {
        return this.scope.api.file.getUploadPolicy({ fileScene });
      },
      enabled: false,
      staleTime: Infinity,
      meta: {
        disableSuspenseOnInit: true,
      },
    });
  }

  async ensureUploadPolicy(fileScene?: string) {
    const query = this.getUploadPolicy(fileScene);
    if (!query) return undefined;
    if (query.data !== undefined) return query.data;
    const result = await query.refetch();
    return result.data ?? query.data ?? undefined;
  }
}
