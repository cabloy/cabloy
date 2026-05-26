import type { TableIdentity } from 'table-identity';

export interface IPaypalOrderSceneRecord {}

export interface IPaypalOrderRecordPayload {
  remark: string;
  total: string;
  currencyCode: string;
}

export interface IPaypalOrderRecordOptions {
  brandName: string;
  returnUrl: string;
  cancelUrl: string;
  returnTo: string;
  scene: keyof IPaypalOrderSceneRecord;
  orderId: TableIdentity;
}
