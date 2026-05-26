// eslint-disable
/** sys: begin */
export * from '../bean/sys.icon.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-a-icon' {
  
        export interface SysIcon {
          /** @internal */
          get scope(): ScopeModuleAIcon;
        }

        export interface SysIcon {
          get $beanFullName(): 'a-icon.sys.icon';
          get $onionName(): 'a-icon:icon';
          
        } 
}
/** sys: end */
/** sys: begin */
import { SysIcon } from '../bean/sys.icon.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-icon.sys.icon': SysIcon;
  }
}
/** sys: end */
/** tool: begin */
export * from '../bean/tool.icon.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-a-icon' {
  
        export interface ToolIcon {
          /** @internal */
          get scope(): ScopeModuleAIcon;
        }

        export interface ToolIcon {
          get $beanFullName(): 'a-icon.tool.icon';
          get $onionName(): 'a-icon:icon';
          
        } 
}
/** tool: end */
/** tool: begin */
import { ToolIcon } from '../bean/tool.icon.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-icon.tool.icon': ToolIcon;
  }
}
/** tool: end */
/** controller: begin */
export * from '../component/icon/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-a-icon' {
  
        export interface ControllerIcon {
          /** @internal */
          get scope(): ScopeModuleAIcon;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerIcon } from '../component/icon/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'a-icon.controller.icon': ControllerIcon;
  }
}
/** controller: end */

/** components: begin */
export * from './component/icon.js';
import { ZIcon } from './component/icon.js';
export const components = {
  'icon': ZIcon,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'a-icon:icon': ControllerIcon;
}
export interface IZovaComponentRecord {
  'a-icon:icon': typeof ZIcon;
}
}
/** components: end */
/** config: begin */
export * from '../config/config.js';
import { config } from '../config/config.js';
/** config: end */
/** monkeySys: begin */
export * from '../monkeySys.js';
/** monkeySys: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleAIcon extends BeanScopeBase {}

export interface ScopeModuleAIcon {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-icon': ScopeModuleAIcon;
  }
  
  export interface IBeanScopeConfig {
    'a-icon': ReturnType<typeof config>;
  }

  

  
}
  
/** scope: end */
