import type { TableIdentity } from 'table-identity';
import type { IPayloadData } from 'vona-module-a-jwt';

export interface IPayloadDataOfPassport extends IPayloadData {
  userId: TableIdentity;
  authId: TableIdentity;
  token?: string;
}
