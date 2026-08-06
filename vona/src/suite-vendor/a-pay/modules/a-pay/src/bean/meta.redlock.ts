import { Meta } from 'vona-module-a-meta';
import { BeanRedlockBase } from 'vona-module-a-redlock';

export type TypeRedlockLockResource =
  | `pay.providerOperation.start.${string}`
  | `pay.providerOperation.confirm.${string}`
  | `pay.providerOperation.query.${string}`
  | `pay.webhook.${string}`;
export type TypeRedlockLockIsolateResource = never;

@Meta()
export class MetaRedlock extends BeanRedlockBase<
  TypeRedlockLockResource,
  TypeRedlockLockIsolateResource
> {}
