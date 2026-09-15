import type { TableIdentity } from 'table-identity';

export type TypeLayoutProfileWidth = number | 'auto';

export interface ILayoutProfileColumn {
  key: string;
  visible: boolean;
  width: TypeLayoutProfileWidth;
}

export interface ILayoutProfile extends Record<string, unknown> {
  version: 1;
  schemaFingerprint?: string;
  columns: ILayoutProfileColumn[];
}

export interface ILayoutProfileRecord {
  id?: TableIdentity;
  layoutKey: string;
  profile: ILayoutProfile;
}
