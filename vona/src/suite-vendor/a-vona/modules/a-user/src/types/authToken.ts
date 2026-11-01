import type { IServiceRecord } from 'vona-module-a-bean';
import type {
  IJwtClientRecord,
  IJwtCreateOptions,
  IJwtVerifyOptions,
  IPayloadData,
} from 'vona-module-a-jwt';

import type { IAuthTokenOptions } from './auth.ts';
import type { IPassport } from './passport.ts';
import type { IUser } from './user.ts';

export interface IAuthTokenVerifyOptions {
  operation: 'check' | 'refresh';
  clientName?: keyof IJwtClientRecord;
  input?: unknown;
}

export interface IAuthTokenCheckOptions extends IJwtVerifyOptions {
  operation?: IAuthTokenVerifyOptions['operation'];
  input?: unknown;
}

export interface IAuthTokenAdapter {
  readonly options?: Readonly<IAuthTokenOptions>;
  deserialize?(payloadData: IPayloadData): Promise<IPassport | undefined>;
  getJwtOptions?(payloadData: IPayloadData): IJwtCreateOptions;
  create(payloadData: IPayloadData, ttl?: number, input?: unknown): Promise<IPayloadData>;
  retrieve(payloadData: IPayloadData): Promise<IPayloadData | undefined>;
  verify(payloadData: IPayloadData, options?: IAuthTokenVerifyOptions): Promise<boolean>;
  refresh(payloadData: IPayloadData, ttl?: number): Promise<void>;
  remove(payloadData: IPayloadData): Promise<void>;
  removeAll(user: IUser): Promise<void>;
}

// Trusted client configuration selects state ownership, never unverified claims.
declare module 'vona-module-a-jwt' {
  export interface IJwtClientOptions {
    authTokenAdapter?: keyof IServiceRecord;
  }
}
