import type { TableIdentity } from 'table-identity';
import type { OmitNever, VonaContext } from 'vona';
import type { ServiceOnion } from 'vona-module-a-onion';

import type { IPaymentOutcomeEvent } from './payment.ts';
import type { IPayProviderRecord } from './payProvider.ts';

export interface IPaySceneExecute {
  onPaymentOutcome(event: IPaymentOutcomeEvent): Promise<void>;
}

export interface IPaySceneRecord {}

export type TypePaySceneExecuteByName<N extends keyof IPaySceneRecord> =
  IPaySceneRecord[N] extends IDecoratorPaySceneOptions ? IPaySceneExecute : never;

export interface IPaySceneProviderCandidate {
  key: string;
  providerName: keyof IPayProviderRecord;
  clientName: string;
}

export interface IPaySceneResolveProviderInput {
  payScene: keyof IPaySceneRecord;
  userId: TableIdentity;
  businessReference: string;
  amountMinor: number;
  currency: string;
  providers: readonly IPaySceneProviderCandidate[];
}

export type TypePaySceneResolveProvider = (
  ctx: VonaContext,
  input: IPaySceneResolveProviderInput,
) => string | Promise<string>;

export interface IDecoratorPaySceneOptions {
  providers?: readonly IPaySceneProviderCandidate[];
  resolveProvider?: TypePaySceneResolveProvider;
  currencies?: readonly string[];
  captureMode?: 'automatic' | 'manual';
  sessionExpiresIn?: number;
  refund?: {
    enabled?: boolean;
    allowPartial?: boolean;
  };
}

declare module 'vona-module-a-onion' {
  export interface BeanOnion {
    payScene: ServiceOnion<IPaySceneRecord>;
  }
}

declare module 'vona' {
  export interface ConfigOnions {
    payScene: OmitNever<IPaySceneRecord>;
  }

  export interface IBeanSceneRecord {
    payScene: never;
  }
}
