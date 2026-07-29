import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

export interface IModelOptionsPaymentSession extends IDecoratorModelOptions {}

@Model<IModelOptionsPaymentSession>()
export class ModelPaymentSession extends BeanModelBase {
  protected async __init__() {}
}
