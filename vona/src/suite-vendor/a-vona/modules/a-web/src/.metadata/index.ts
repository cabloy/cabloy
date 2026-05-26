// eslint-disable
/** pipe: begin */
export * from '../bean/pipe.filter.ts';
export * from '../bean/pipe.valid.ts';
import type { IPipeOptionsFilter } from '../bean/pipe.filter.ts';
import type { IPipeOptionsValid } from '../bean/pipe.valid.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
  
export interface IPipeRecordLocal {
  'a-web:filter': IPipeOptionsFilter;
'a-web:valid': IPipeOptionsValid;
}

}
declare module 'vona-module-a-web' {
  
        export interface PipeFilter {
          /** @internal */
          get scope(): ScopeModuleAWeb;
        }

          export interface PipeFilter {
            get $beanFullName(): 'a-web.pipe.filter';
            get $onionName(): 'a-web:filter';
            get $onionOptions(): IPipeOptionsFilter;
          }

        export interface PipeValid {
          /** @internal */
          get scope(): ScopeModuleAWeb;
        }

          export interface PipeValid {
            get $beanFullName(): 'a-web.pipe.valid';
            get $onionName(): 'a-web:valid';
            get $onionOptions(): IPipeOptionsValid;
          } 
}
/** pipe: end */
/** bean: begin */
export * from '../bean/bean.router.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-web' {
  
        export interface BeanRouter {
          /** @internal */
          get scope(): ScopeModuleAWeb;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanRouter } from '../bean/bean.router.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'router': BeanRouter;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/web.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-web:web': never;
    }

  
}
declare module 'vona-module-a-web' {
  
        export interface ServiceWeb {
          /** @internal */
          get scope(): ScopeModuleAWeb;
        }

          export interface ServiceWeb {
            get $beanFullName(): 'a-web.service.web';
            get $onionName(): 'a-web:web';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceWeb } from '../service/web.ts';
export interface IModuleService {
  'web': ServiceWeb;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-web.service.web': ServiceWeb;
  }
}
/** service: end */
/** hmr: begin */
export * from '../bean/hmr.controller.ts';
export * from '../bean/hmr.dto.ts';

import 'vona';
declare module 'vona' {
  
    export interface IHmrRecord {
      'a-web:controller': never;
'a-web:dto': never;
    }

  
}
declare module 'vona-module-a-web' {
  
        export interface HmrController {
          /** @internal */
          get scope(): ScopeModuleAWeb;
        }

          export interface HmrController {
            get $beanFullName(): 'a-web.hmr.controller';
            get $onionName(): 'a-web:controller';
            
          }

        export interface HmrDto {
          /** @internal */
          get scope(): ScopeModuleAWeb;
        }

          export interface HmrDto {
            get $beanFullName(): 'a-web.hmr.dto';
            get $onionName(): 'a-web:dto';
            
          } 
}
/** hmr: end */
/** startup: begin */
export * from '../bean/startup.listen.ts';

import { type IDecoratorStartupOptions } from 'vona-module-a-startup';
declare module 'vona-module-a-startup' {
  
    export interface IStartupRecord {
      'a-web:listen': IDecoratorStartupOptions;
    }

  
}
declare module 'vona-module-a-web' {
  
        export interface StartupListen {
          /** @internal */
          get scope(): ScopeModuleAWeb;
        }

          export interface StartupListen {
            get $beanFullName(): 'a-web.startup.listen';
            get $onionName(): 'a-web:listen';
            get $onionOptions(): IDecoratorStartupOptions;
          } 
}
/** startup: end */
/** filterTransform: begin */
export * from '../bean/filterTransform.base.ts';
export * from '../bean/filterTransform.dateRange.ts';
import type { IFilterTransformOptionsBase } from '../bean/filterTransform.base.ts';
import type { IFilterTransformOptionsDateRange } from '../bean/filterTransform.dateRange.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IFilterTransformRecord {
      'a-web:base': IFilterTransformOptionsBase;
'a-web:dateRange': IFilterTransformOptionsDateRange;
    }

  
}
declare module 'vona-module-a-web' {
  
        export interface FilterTransformBase {
          /** @internal */
          get scope(): ScopeModuleAWeb;
        }

          export interface FilterTransformBase {
            get $beanFullName(): 'a-web.filterTransform.base';
            get $onionName(): 'a-web:base';
            get $onionOptions(): IFilterTransformOptionsBase;
          }

        export interface FilterTransformDateRange {
          /** @internal */
          get scope(): ScopeModuleAWeb;
        }

          export interface FilterTransformDateRange {
            get $beanFullName(): 'a-web.filterTransform.dateRange';
            get $onionName(): 'a-web:dateRange';
            get $onionOptions(): IFilterTransformOptionsDateRange;
          } 
}
/** filterTransform: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** main: begin */
export * from '../main.ts';
/** main: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAWeb extends BeanScopeBase {}

export interface ScopeModuleAWeb {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-web': ScopeModuleAWeb;
  }

  export interface IBeanScopeContainer {
    web: ScopeModuleAWeb;
  }
  
  export interface IBeanScopeConfig {
    'a-web': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
