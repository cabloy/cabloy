import type { ContextState, IInstanceRecord, ILocaleRecord, PowerPartial } from 'vona';
import type { ConfigOnions } from 'vona-module-a-onion';
import type { IDbInfo, ITransactionOptions } from 'vona-module-a-orm';

export const SymbolRouterMiddleware = Symbol('SymbolRouterMiddleware');

export interface INewCtxExtraData {
  state?: ContextState;
  request?: {
    headers?: Record<string, string>;
  };
}

export interface INewCtxOptions extends INewCtxBaseOptions {
  dbInfo?: Partial<IDbInfo>;
}

export interface INewCtxBaseOptions {
  locale?: keyof ILocaleRecord;
  tz?: string;
  instanceName?: keyof IInstanceRecord | undefined | null;
  instance?: boolean;
  transaction?: boolean;
  transactionOptions?: ITransactionOptions;
  extraData?: INewCtxExtraData | undefined;
  innerAccess?: boolean;
  req?: any;
  res?: any;
}

// cannot provide instanceName/locale/tz for safety
//   can newCtx/newCtxIsolate for using new instanceName/locale/tz
export interface IPerformActionOptions {
  innerAccess?: boolean;
  params?: object;
  query?: object;
  headers?: object;
  body?: any;
  onions?: PowerPartial<ConfigOnions>;
  authToken?: string;
  extraData?: INewCtxExtraData | undefined;
}

export interface IGeneralInfoOptions {
  dbInfo?: Partial<IDbInfo>;
  locale?: keyof ILocaleRecord;
  tz?: string;
  instanceName?: keyof IInstanceRecord | undefined | null;
  extraData?: INewCtxExtraData;
}
