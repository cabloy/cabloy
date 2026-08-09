import type { IDecoratorModelOptions } from 'vona-module-a-orm';

import { BeanModelBase, Model } from 'vona-module-a-orm';

import { EntityProviderOperationRecoveryAudit } from '../entity/providerOperationRecoveryAudit.tsx';

export interface IModelOptionsProviderOperationRecoveryAudit extends IDecoratorModelOptions<EntityProviderOperationRecoveryAudit> {}

@Model<IModelOptionsProviderOperationRecoveryAudit>({
  entity: EntityProviderOperationRecoveryAudit,
})
export class ModelProviderOperationRecoveryAudit extends BeanModelBase<EntityProviderOperationRecoveryAudit> {}
