import { IParamsAndQuery } from '@cabloy/utils';

export const SymbolRouterHistory = Symbol('SymbolRouterHistory');

export interface IGotoPageOptions extends IParamsAndQuery {
  returnTo?: string | boolean;
  forceRedirect?: boolean;
  replace?: boolean;
}
