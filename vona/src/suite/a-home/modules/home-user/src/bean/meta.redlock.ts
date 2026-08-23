import { Meta } from 'vona-module-a-meta';
import { BeanRedlockBase } from 'vona-module-a-redlock';

export type TypeRedlockLockResource =
  | `homeUser.account.passwordMutation.${string}`
  | `homeUser.account.passwordSetIssue.${string}`
  | `homeUser.account.passwordSetConsume.${string}`
  | `homeUser.account.passwordSetCandidate.${string}`
  | `homeUser.account.passwordResetConsume.${string}`
  | `homeUser.account.activationMutation.${string}`
  | `homeUser.account.activationConsume.${string}`;
export type TypeRedlockLockIsolateResource = never;

@Meta()
export class MetaRedlock extends BeanRedlockBase<
  TypeRedlockLockResource,
  TypeRedlockLockIsolateResource
> {}
