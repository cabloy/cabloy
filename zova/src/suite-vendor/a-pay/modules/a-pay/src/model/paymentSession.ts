import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsPaymentSession extends IDecoratorModelOptions {}

@Model<IModelOptionsPaymentSession>()
export class ModelPaymentSession extends BeanModelBase {
  view(id: TableIdentity) {
    if (this.$ssr.cookieDisabledOnServer) return;
    if (!this.$passport.isAuthenticated) return;
    return this.$useStateData({
      queryKey: ['view', id],
      queryFn: async () => {
        return await this.scope.api.paymentSession.view({ params: { id } });
      },
    });
  }

  reconcile(id: TableIdentity) {
    return this.$useMutationData({
      mutationKey: ['reconcile', id],
      mutationFn: async () => {
        return await this.scope.api.paymentSession.reconcile(undefined, { params: { id } });
      },
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['view', id] });
      },
    });
  }

  start(id: TableIdentity) {
    return this.$useMutationData({
      mutationKey: ['start', id],
      mutationFn: async () => {
        return await this.scope.api.paymentSession.start(undefined, { params: { id } });
      },
      onSuccess: async () => {
        await this.$invalidateQueries({ queryKey: ['view', id] });
      },
    });
  }
}
