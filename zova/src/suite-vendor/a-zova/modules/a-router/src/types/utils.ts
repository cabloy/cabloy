import { IParamsAndQuery } from '@cabloy/utils';

export const SymbolRouterHistory = Symbol('SymbolRouterHistory');

export interface IGetPagePathOptions extends IParamsAndQuery {
  returnTo?: string | boolean;
}

export interface IGotoPageOptions extends IGetPagePathOptions {
  forceRedirect?: boolean;
  replace?: boolean;
}
