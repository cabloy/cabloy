import type { SignOptions, VerifyOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';

import 'vona';

export interface IJwtToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IJwtClientRecord {
  access: never;
  refresh: never;
  oauth: never;
  oauthstate: never;
  code: never;
}

export interface IJwtSignOptions {
  path?: string | string[];
  dev?: boolean;
  temp?: boolean;
}

export interface IJwtVerifyOptions {
  path?: string;
}

export interface IJwtClientOptions {
  secret?: string;
  signOptions: SignOptions;
  verifyOptions?: VerifyOptions;
}

export interface ConfigJwt {
  field: {
    payload: {
      client: string;
      path: string;
      data: string;
    };
    extract: {
      header: string;
      headerAuth: string;
      headerAuthScheme: string;
      query: string;
      // cookie: string;
    };
  };
  tempAuthToken: {
    signOptions: { expiresIn: StringValue | number };
  };
  base: IJwtClientOptions;
  clients: Record<keyof IJwtClientRecord, IJwtClientOptions>;
}

export interface IPayloadData {}

export interface IJwtPayload {}

declare module 'vona' {
  export interface ILoggerChildRecord {
    jwt: never;
  }
}
