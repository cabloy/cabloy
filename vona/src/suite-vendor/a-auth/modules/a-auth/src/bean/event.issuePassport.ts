import type {
  EntityAuthProvider,
  IAuthenticateStrategyState,
  IAuthProviderClientOptions,
} from 'vona-module-a-auth';
import type { IAuthUserProfile, IPassport } from 'vona-module-a-user';

import { BeanEventBase, Event } from 'vona-module-a-event';

export interface TypeEventIssuePassportData {
  profileUser: IAuthUserProfile;
  entityAuthProvider: EntityAuthProvider;
  clientOptions: IAuthProviderClientOptions;
  state?: IAuthenticateStrategyState;
}

export type TypeEventIssuePassportResult = IPassport;

@Event()
export class EventIssuePassport extends BeanEventBase<
  TypeEventIssuePassportData,
  TypeEventIssuePassportResult
> {}
