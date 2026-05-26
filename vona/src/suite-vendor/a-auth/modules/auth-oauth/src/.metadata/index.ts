// eslint-disable
/** authProvider: begin */
export * from '../bean/authProvider.oauth.ts';
import type { IAuthProviderOptionsOauth } from '../bean/authProvider.oauth.ts';
import 'vona-module-a-auth';
declare module 'vona-module-a-auth' {
  
    export interface IAuthProviderRecord {
      'auth-oauth:oauth': IAuthProviderOptionsOauth;
    }

  
}
declare module 'vona-module-auth-oauth' {
  
        export interface AuthProviderOauth {
          /** @internal */
          get scope(): ScopeModuleAuthOauth;
        }

          export interface AuthProviderOauth {
            get $beanFullName(): 'auth-oauth.authProvider.oauth';
            get $onionName(): 'auth-oauth:oauth';
            get $onionOptions(): IAuthProviderOptionsOauth;
          } 
}
/** authProvider: end */
/** authProvider: begin */
import type { AuthProviderOauth } from '../bean/authProvider.oauth.ts';
export interface IModuleAuthProvider {
  'oauth': AuthProviderOauth;
}
/** authProvider: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAuthOauth extends BeanScopeBase {}

export interface ScopeModuleAuthOauth {
  util: BeanScopeUtil;
authProvider: IModuleAuthProvider;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'auth-oauth': ScopeModuleAuthOauth;
  }

  export interface IBeanScopeContainer {
    authOauth: ScopeModuleAuthOauth;
  }
  
  

  

  
}
/** scope: end */
