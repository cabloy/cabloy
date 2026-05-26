export const SymbolRouterHistory = Symbol('SymbolRouterHistory');

export interface IGotoPageOptions {
  query?: object;
  returnTo?: string | boolean;
  forceRedirect?: boolean;
  replace?: boolean;
}
