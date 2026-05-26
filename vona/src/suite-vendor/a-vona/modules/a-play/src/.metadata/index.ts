// eslint-disable
import type { TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** dto: begin */
export * from '../dto/play.ts';
import type { IDtoOptionsPlay } from '../dto/play.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'a-play:play': IDtoOptionsPlay;
    }

  
}
declare module 'vona-module-a-play' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoPlay } from '../dto/play.ts';
declare module 'vona-module-a-play' {
  
    export interface IDtoOptionsPlay {
      fields?: TypeEntityOptionsFields<DtoPlay, IDtoOptionsPlay[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/memoryDiag.ts';
export * from '../controller/play.ts';
import type { IControllerOptionsMemoryDiag } from '../controller/memoryDiag.ts';
import type { IControllerOptionsPlay } from '../controller/play.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'a-play:memoryDiag': IControllerOptionsMemoryDiag;
'a-play:play': IControllerOptionsPlay;
    }

  
}
declare module 'vona-module-a-play' {
  
        export interface ControllerMemoryDiag {
          /** @internal */
          get scope(): ScopeModuleAPlay;
        }

          export interface ControllerMemoryDiag {
            get $beanFullName(): 'a-play.controller.memoryDiag';
            get $onionName(): 'a-play:memoryDiag';
            get $onionOptions(): IControllerOptionsMemoryDiag;
          }

        export interface ControllerPlay {
          /** @internal */
          get scope(): ScopeModuleAPlay;
        }

          export interface ControllerPlay {
            get $beanFullName(): 'a-play.controller.play';
            get $onionName(): 'a-play:play';
            get $onionOptions(): IControllerOptionsPlay;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerMemoryDiag } from '../controller/memoryDiag.ts';
// @ts-ignore ignore
import type { ControllerPlay } from '../controller/play.ts';
declare module 'vona-module-a-play' {
  
    export interface IControllerOptionsMemoryDiag {
      actions?: TypeControllerOptionsActions<ControllerMemoryDiag>;
    }

    export interface IControllerOptionsPlay {
      actions?: TypeControllerOptionsActions<ControllerPlay>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/play/memoryDiag/stats': undefined;
'/play/memoryDiag/heapSnapshot': undefined;
    }
export interface IApiPathPostRecord{
        '/play/memoryDiag/gc': undefined;
'/play': undefined;
    }

}

/** controller: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAPlay extends BeanScopeBase {}

export interface ScopeModuleAPlay {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-play': ScopeModuleAPlay;
  }

  export interface IBeanScopeContainer {
    play: ScopeModuleAPlay;
  }
  
  

  

  
}
/** scope: end */
