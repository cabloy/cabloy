// eslint-disable
/** model: begin */
export * from '../model/pageData.ts';
import { IModelOptionsPageData } from '../model/pageData.ts';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'a-router:pageData': IModelOptionsPageData;
    }


}
declare module 'zova-module-a-router' {

        export interface ModelPageData {
          /** @internal */
          get scope(): ScopeModuleARouter;
        }

        export interface ModelPageData {
          get $beanFullName(): 'a-router.model.pageData';
          get $onionName(): 'a-router:pageData';
          get $onionOptions(): IModelOptionsPageData;
        }
}
/** model: end */
/** model: begin */
import type { ModelPageData } from '../model/pageData.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-router.model.pageData': ModelPageData;
  }
}
/** model: end */
/** sys: begin */
export * from '../bean/sys.router.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-a-router' {

        export interface SysRouter {
          /** @internal */
          get scope(): ScopeModuleARouter;
        }

        export interface SysRouter {
          get $beanFullName(): 'a-router.sys.router';
          get $onionName(): 'a-router:router';

        }
}
/** sys: end */
/** sys: begin */
import type { SysRouter } from '../bean/sys.router.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-router.sys.router': SysRouter;
  }
}
/** sys: end */
/** bean: begin */
export * from '../bean/bean.router.ts';
export * from '../bean/bean.routerGuardsBase.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-a-router' {

        export interface BeanRouter {
          /** @internal */
          get scope(): ScopeModuleARouter;
        }

        export interface BeanRouter {
          get $beanFullName(): 'a-router.bean.router';
          get $onionName(): 'a-router:router';

        }
}
/** bean: end */
/** bean: begin */
import type { BeanRouter } from '../bean/bean.router.ts';
import type { BeanRouterGuardsBase } from '../bean/bean.routerGuardsBase.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-router.bean.router': BeanRouter;
'a-router.bean.routerGuardsBase': BeanRouterGuardsBase;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/routerGuards.ts';

import 'zova-module-a-bean';
declare module 'zova-module-a-bean' {

    export interface IServiceRecord {
      'a-router:routerGuards': never;
    }


}
declare module 'zova-module-a-router' {

        export interface ServiceRouterGuards {
          /** @internal */
          get scope(): ScopeModuleARouter;
        }

        export interface ServiceRouterGuards {
          get $beanFullName(): 'a-router.service.routerGuards';
          get $onionName(): 'a-router:routerGuards';

        }
}
/** service: end */
/** service: begin */
import type { ServiceRouterGuards } from '../service/routerGuards.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-router.service.routerGuards': ServiceRouterGuards;
  }
}
/** service: end */
/** controller: begin */
export * from '../component/routerViewEmpty/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-a-router' {

        export interface ControllerRouterViewEmpty {
          /** @internal */
          get scope(): ScopeModuleARouter;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerRouterViewEmpty } from '../component/routerViewEmpty/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'a-router.controller.routerViewEmpty': ControllerRouterViewEmpty;
  }
}
/** controller: end */

/** components: begin */
export * from './component/routerViewEmpty.ts';
import { ZRouterViewEmpty } from './component/routerViewEmpty.ts';
export const components = {
  'routerViewEmpty': ZRouterViewEmpty,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'a-router:routerViewEmpty': ControllerRouterViewEmpty;
}
export interface IZovaComponentRecord {
  'a-router:routerViewEmpty': typeof ZRouterViewEmpty;
}
}
/** components: end */
/** config: begin */
export * from '../config/config.ts';
import { config } from '../config/config.ts';
/** config: end */
/** monkey: begin */
export * from '../monkey.ts';
/** monkey: end */
/** monkeySys: begin */
export * from '../monkeySys.ts';
/** monkeySys: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleARouter extends BeanScopeBase {}

export interface ScopeModuleARouter {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-router': ScopeModuleARouter;
  }

  export interface IBeanScopeConfig {
    'a-router': ReturnType<typeof config>;
  }




}

/** scope: end */
