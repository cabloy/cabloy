// eslint-disable
/** monkey: begin */
export * from '../monkey.js';
/** monkey: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleACommand extends BeanScopeBase {}

export interface ScopeModuleACommand {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-command': ScopeModuleACommand;
  }
  
  

  

  
}
  
/** scope: end */
