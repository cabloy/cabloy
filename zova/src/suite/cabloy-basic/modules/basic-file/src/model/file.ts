import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type { ApiApiFilegetUploadPolicyResponseBody } from '../api/file.js';

export interface IModelOptionsFile extends IDecoratorModelOptions {}

@Model<IModelOptionsFile>()
export class ModelFile extends BeanModelBase {
  getUploadPolicy(fileScene?: string) {
    if (!fileScene) return undefined;
    return this.$useStateData<ApiApiFilegetUploadPolicyResponseBody>({
      queryKey: ['uploadPolicy', 'file', fileScene],
      queryFn: async () => {
        return this.scope.api.file.getUploadPolicy({ fileScene });
      },
      meta: {
        disableSuspenseOnInit: true,
      },
    });
  }
}
