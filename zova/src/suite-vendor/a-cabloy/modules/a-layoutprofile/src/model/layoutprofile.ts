import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type {
  ApiApiLayoutprofileloadResponseBody,
  ApiApiLayoutprofileresetResponseBody,
  ApiApiLayoutprofilesaveRequestBody,
  ApiApiLayoutprofilesaveResponseBody,
} from '../api/layoutprofile.js';

export interface IModelOptionsLayoutProfile extends IDecoratorModelOptions {
  enableSelector: true;
}

@Model<IModelOptionsLayoutProfile>({
  enableSelector: true,
})
export class ModelLayoutProfile extends BeanModelBase {
  layoutKey: string;

  protected async __init__(layoutKey: string) {
    if (!layoutKey) throw new Error('layout key not specified');
    await super.__init__(layoutKey);
    this.layoutKey = layoutKey;
  }

  load() {
    if (this.$ssr.cookieDisabledOnServer || !this.$passport.isAuthenticated) return;
    if (process.env.CLIENT && this.$ssr.profile === 'public' && this.$ssr.isRuntimeSsrPreHydration)
      return;
    return this.$useStateData<ApiApiLayoutprofileloadResponseBody>({
      queryKey: ['load'],
      queryFn: async () => {
        return await this.scope.api.layoutprofile.load({
          query: { layoutKey: this.layoutKey },
        });
      },
    });
  }

  save() {
    return this.$useMutationData<
      ApiApiLayoutprofilesaveResponseBody,
      ApiApiLayoutprofilesaveRequestBody['profile']
    >({
      mutationKey: ['save'],
      mutationFn: async profile => {
        return await this.scope.api.layoutprofile.save({
          layoutKey: this.layoutKey,
          profile,
        });
      },
      onSuccess: profile => {
        this.$setQueryData<ApiApiLayoutprofilesaveResponseBody>(['load'], profile);
      },
    });
  }

  reset() {
    return this.$useMutationData<ApiApiLayoutprofileresetResponseBody>({
      mutationKey: ['reset'],
      mutationFn: async () => {
        return await this.scope.api.layoutprofile.reset({
          query: { layoutKey: this.layoutKey },
        });
      },
      onSuccess: async () => {
        this.$setQueryData<ApiApiLayoutprofileloadResponseBody>(['load'], undefined);
      },
    });
  }
}
