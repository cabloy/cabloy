import type {
  ContextState,
  IInstanceRecord,
  ILocaleRecord,
  PowerPartial,
  VonaContext,
  VonaScopeOutcomeObserver,
} from 'vona';
import type { ConfigOnions } from 'vona-module-a-onion';
import type { IDbInfo, ITransactionOptions } from 'vona-module-a-orm';

export const SymbolRouterMiddleware = Symbol('SymbolRouterMiddleware');
export const SymbolActionQuery = Symbol('SymbolActionQuery');
export const SymbolValidationFailureCapture = Symbol('SymbolValidationFailureCapture');

export interface IValidationFailureCapture {
  capture(location: string, issues: unknown[]): void;
}

export interface IValidationFailureObserver {
  context: VonaContext;
  capture: IValidationFailureCapture;
}

export interface INewCtxExtraData {
  state?: ContextState;
  request?: {
    headers?: Record<string, string>;
  };
}

export interface INewCtxOptions extends INewCtxBaseOptions {
  dbInfo?: Partial<IDbInfo>;
}

export interface INewCtxReadyExistingOptions {
  req?: any;
  res?: any;
  locale?: keyof ILocaleRecord;
  tz?: string;
}

export interface INewCtxLifecycle {
  initializeContext?: (ctx: VonaContext) => void;
  onScopeOutcome?: VonaScopeOutcomeObserver;
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
  validationFailureCapture?: IValidationFailureCapture;
  req?: any;
  res?: any;
}

// cannot provide instanceName/locale/tz for safety
//   can newCtx/newCtxIsolate for using new instanceName/locale/tz
export interface IPerformActionOptions {
  innerAccess?: boolean;
  params?: object;
  query?: object;
  /** Preserve internal JSON query types instead of reparsing their URL encoding. */
  queryNative?: boolean;
  headers?: object;
  body?: any;
  onions?: PowerPartial<ConfigOnions>;
  authToken?: string;
  extraData?: INewCtxExtraData | undefined;
  /** Internal per-dispatch validation diagnostics; never serialized. */
  validationFailureCapture?: IValidationFailureCapture;
}

export interface IGeneralInfoOptions {
  dbInfo?: Partial<IDbInfo>;
  locale?: keyof ILocaleRecord;
  tz?: string;
  instanceName?: keyof IInstanceRecord | undefined | null;
  extraData?: INewCtxExtraData;
}
