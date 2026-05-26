import type { Request } from 'koa';

import OAuth2Strategy from 'passport-oauth2';

import type { TypeStrategyOptions } from '../types/authProvider.ts';

export class StrategyBase extends OAuth2Strategy {
  name: string;
  redirect: (location: string) => void;
  error: (err: Error) => void;

  // oxlint-disable-next-line no-useless-constructor
  constructor(options: TypeStrategyOptions, verify: Function) {
    super(options, verify);
  }

  authenticate(req: Request, options: TypeStrategyOptions) {
    return super.authenticate(req, options);
  }
}
