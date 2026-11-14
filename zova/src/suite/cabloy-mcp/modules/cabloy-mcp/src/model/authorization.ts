import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsAuthorization extends IDecoratorModelOptions {}

@Model<IModelOptionsAuthorization>()
export class ModelAuthorization extends BeanModelBase {
  summary(request: string) {
    if (!process.env.CLIENT || !this.$passport.isAuthenticated || !request) return;
    return this.$useStateData({
      queryKey: ['summary', this.sys.env.SITE_ID, request, this.app.meta.locale.current],
      queryFn: () => this.scope.api.authorization.summary({ query: { request } }),
      retry: false,
      meta: {
        disableSuspenseOnInit: true,
        persister: false,
        ssr: { dehydrate: false },
      },
    });
  }

  decision(request: string, allow: boolean, scope?: string) {
    return this.scope.api.authorization.decision({ request, allow, scope });
  }
}
