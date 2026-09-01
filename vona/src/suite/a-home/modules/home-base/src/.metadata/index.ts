// eslint-disable
import type { TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** dto: begin */
export * from '../dto/siteCatalogSelectRes.ts';
export * from '../dto/siteCatalogSelectResItem.ts';
import type { IDtoOptionsSiteCatalogSelectRes } from '../dto/siteCatalogSelectRes.ts';
import type { IDtoOptionsSiteCatalogSelectResItem } from '../dto/siteCatalogSelectResItem.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IDtoRecord {
      'home-base:siteCatalogSelectRes': IDtoOptionsSiteCatalogSelectRes;
'home-base:siteCatalogSelectResItem': IDtoOptionsSiteCatalogSelectResItem;
    }


}
declare module 'vona-module-home-base' {

}
/** dto: end */
/** dto: begin */
import type { DtoSiteCatalogSelectRes } from '../dto/siteCatalogSelectRes.ts';
import type { DtoSiteCatalogSelectResItem } from '../dto/siteCatalogSelectResItem.ts';
declare module 'vona-module-home-base' {

    export interface IDtoOptionsSiteCatalogSelectRes {
      fields?: TypeEntityOptionsFields<DtoSiteCatalogSelectRes, IDtoOptionsSiteCatalogSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsSiteCatalogSelectResItem {
      fields?: TypeEntityOptionsFields<DtoSiteCatalogSelectResItem, IDtoOptionsSiteCatalogSelectResItem[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/menu.ts';
export * from '../controller/permission.ts';
export * from '../controller/siteCatalog.ts';
import type { IControllerOptionsMenu } from '../controller/menu.ts';
import type { IControllerOptionsPermission } from '../controller/permission.ts';
import type { IControllerOptionsSiteCatalog } from '../controller/siteCatalog.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IControllerRecord {
      'home-base:menu': IControllerOptionsMenu;
'home-base:permission': IControllerOptionsPermission;
'home-base:siteCatalog': IControllerOptionsSiteCatalog;
    }


}
declare module 'vona-module-home-base' {

        export interface ControllerMenu {
          /** @internal */
          get scope(): ScopeModuleHomeBase;
        }

          export interface ControllerMenu {
            get $beanFullName(): 'home-base.controller.menu';
            get $onionName(): 'home-base:menu';
            get $onionOptions(): IControllerOptionsMenu;
          }

        export interface ControllerPermission {
          /** @internal */
          get scope(): ScopeModuleHomeBase;
        }

          export interface ControllerPermission {
            get $beanFullName(): 'home-base.controller.permission';
            get $onionName(): 'home-base:permission';
            get $onionOptions(): IControllerOptionsPermission;
          }

        export interface ControllerSiteCatalog {
          /** @internal */
          get scope(): ScopeModuleHomeBase;
        }

          export interface ControllerSiteCatalog {
            get $beanFullName(): 'home-base.controller.siteCatalog';
            get $onionName(): 'home-base:siteCatalog';
            get $onionOptions(): IControllerOptionsSiteCatalog;
          }
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerMenu } from '../controller/menu.ts';
// @ts-ignore ignore
import type { ControllerPermission } from '../controller/permission.ts';
// @ts-ignore ignore
import type { ControllerSiteCatalog } from '../controller/siteCatalog.ts';
declare module 'vona-module-home-base' {

    export interface IControllerOptionsMenu {
      actions?: TypeControllerOptionsActions<ControllerMenu>;
    }

    export interface IControllerOptionsPermission {
      actions?: TypeControllerOptionsActions<ControllerPermission>;
    }

    export interface IControllerOptionsSiteCatalog {
      actions?: TypeControllerOptionsActions<ControllerSiteCatalog>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/home/base/menu/:publicPath?': undefined;
'/home/base/permission/:resource': undefined;
'/home/base/siteCatalog': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'home-base:siteCatalog': never;
    }
  }

/** controller: end */
/** service: begin */
export * from '../service/menu.ts';
export * from '../service/permission.ts';
export * from '../service/siteCatalog.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {

    export interface IServiceRecord {
      'home-base:menu': never;
'home-base:permission': never;
'home-base:siteCatalog': never;
    }


}
declare module 'vona-module-home-base' {

        export interface ServiceMenu {
          /** @internal */
          get scope(): ScopeModuleHomeBase;
        }

          export interface ServiceMenu {
            get $beanFullName(): 'home-base.service.menu';
            get $onionName(): 'home-base:menu';
          }

        export interface ServicePermission {
          /** @internal */
          get scope(): ScopeModuleHomeBase;
        }

          export interface ServicePermission {
            get $beanFullName(): 'home-base.service.permission';
            get $onionName(): 'home-base:permission';
          }

        export interface ServiceSiteCatalog {
          /** @internal */
          get scope(): ScopeModuleHomeBase;
        }

          export interface ServiceSiteCatalog {
            get $beanFullName(): 'home-base.service.siteCatalog';
            get $onionName(): 'home-base:siteCatalog';
          }
}
/** service: end */
/** service: begin */
import type { ServiceMenu } from '../service/menu.ts';
import type { ServicePermission } from '../service/permission.ts';
import type { ServiceSiteCatalog } from '../service/siteCatalog.ts';
export interface IModuleService {
  'menu': ServiceMenu;
'permission': ServicePermission;
'siteCatalog': ServiceSiteCatalog;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'home-base.service.menu': ServiceMenu;
'home-base.service.permission': ServicePermission;
'home-base.service.siteCatalog': ServiceSiteCatalog;
  }
}
/** service: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** main: begin */
export * from '../main.ts';
/** main: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleHomeBase extends BeanScopeBase {}

export interface ScopeModuleHomeBase {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'home-base': ScopeModuleHomeBase;
  }

  export interface IBeanScopeContainer {
    homeBase: ScopeModuleHomeBase;
  }



  export interface IBeanScopeLocale {
    'home-base': (typeof locales)[TypeLocaleBase];
  }


}
/** scope: end */
