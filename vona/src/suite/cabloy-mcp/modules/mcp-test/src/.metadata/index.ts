// eslint-disable
import type { TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** dto: begin */
export * from '../dto/categoryPublic.tsx';
export * from '../dto/categoryPublicSelectReq.tsx';
export * from '../dto/categoryPublicSelectRes.tsx';
export * from '../dto/productPublic.tsx';
export * from '../dto/productPublicDetail.tsx';
export * from '../dto/productPublicSelectReq.tsx';
export * from '../dto/productPublicSelectRes.tsx';
export * from '../dto/productPublicSku.tsx';
import type { IDtoOptionsCategoryPublic } from '../dto/categoryPublic.tsx';
import type { IDtoOptionsCategoryPublicSelectReq } from '../dto/categoryPublicSelectReq.tsx';
import type { IDtoOptionsCategoryPublicSelectRes } from '../dto/categoryPublicSelectRes.tsx';
import type { IDtoOptionsProductPublic } from '../dto/productPublic.tsx';
import type { IDtoOptionsProductPublicDetail } from '../dto/productPublicDetail.tsx';
import type { IDtoOptionsProductPublicSelectReq } from '../dto/productPublicSelectReq.tsx';
import type { IDtoOptionsProductPublicSelectRes } from '../dto/productPublicSelectRes.tsx';
import type { IDtoOptionsProductPublicSku } from '../dto/productPublicSku.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IDtoRecord {
      'mcp-test:categoryPublic': IDtoOptionsCategoryPublic;
'mcp-test:categoryPublicSelectReq': IDtoOptionsCategoryPublicSelectReq;
'mcp-test:categoryPublicSelectRes': IDtoOptionsCategoryPublicSelectRes;
'mcp-test:productPublic': IDtoOptionsProductPublic;
'mcp-test:productPublicDetail': IDtoOptionsProductPublicDetail;
'mcp-test:productPublicSelectReq': IDtoOptionsProductPublicSelectReq;
'mcp-test:productPublicSelectRes': IDtoOptionsProductPublicSelectRes;
'mcp-test:productPublicSku': IDtoOptionsProductPublicSku;
    }


}
declare module 'vona-module-mcp-test' {

}
/** dto: end */
/** dto: begin */
import type { DtoCategoryPublic } from '../dto/categoryPublic.tsx';
import type { DtoCategoryPublicSelectReq } from '../dto/categoryPublicSelectReq.tsx';
import type { DtoCategoryPublicSelectRes } from '../dto/categoryPublicSelectRes.tsx';
import type { DtoProductPublic } from '../dto/productPublic.tsx';
import type { DtoProductPublicDetail } from '../dto/productPublicDetail.tsx';
import type { DtoProductPublicSelectReq } from '../dto/productPublicSelectReq.tsx';
import type { DtoProductPublicSelectRes } from '../dto/productPublicSelectRes.tsx';
import type { DtoProductPublicSku } from '../dto/productPublicSku.tsx';
declare module 'vona-module-mcp-test' {

    export interface IDtoOptionsCategoryPublic {
      fields?: TypeEntityOptionsFields<DtoCategoryPublic, IDtoOptionsCategoryPublic[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCategoryPublicSelectReq {
      fields?: TypeEntityOptionsFields<DtoCategoryPublicSelectReq, IDtoOptionsCategoryPublicSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsCategoryPublicSelectRes {
      fields?: TypeEntityOptionsFields<DtoCategoryPublicSelectRes, IDtoOptionsCategoryPublicSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsProductPublic {
      fields?: TypeEntityOptionsFields<DtoProductPublic, IDtoOptionsProductPublic[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsProductPublicDetail {
      fields?: TypeEntityOptionsFields<DtoProductPublicDetail, IDtoOptionsProductPublicDetail[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsProductPublicSelectReq {
      fields?: TypeEntityOptionsFields<DtoProductPublicSelectReq, IDtoOptionsProductPublicSelectReq[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsProductPublicSelectRes {
      fields?: TypeEntityOptionsFields<DtoProductPublicSelectRes, IDtoOptionsProductPublicSelectRes[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsProductPublicSku {
      fields?: TypeEntityOptionsFields<DtoProductPublicSku, IDtoOptionsProductPublicSku[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/catalog.ts';
import type { IControllerOptionsCatalog } from '../controller/catalog.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IControllerRecord {
      'mcp-test:catalog': IControllerOptionsCatalog;
    }


}
declare module 'vona-module-mcp-test' {

        export interface ControllerCatalog {
          /** @internal */
          get scope(): ScopeModuleMcpTest;
        }

          export interface ControllerCatalog {
            get $beanFullName(): 'mcp-test.controller.catalog';
            get $onionName(): 'mcp-test:catalog';
            get $onionOptions(): IControllerOptionsCatalog;
          }
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerCatalog } from '../controller/catalog.ts';
declare module 'vona-module-mcp-test' {

    export interface IControllerOptionsCatalog {
      actions?: TypeControllerOptionsActions<ControllerCatalog>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/mcp/test/catalog/categories': undefined;
'/mcp/test/catalog/products': undefined;
'/mcp/test/catalog/products/:id': undefined;
    }

}

/** controller: end */
/** service: begin */
export * from '../service/catalog.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {

    export interface IServiceRecord {
      'mcp-test:catalog': never;
    }


}
declare module 'vona-module-mcp-test' {

        export interface ServiceCatalog {
          /** @internal */
          get scope(): ScopeModuleMcpTest;
        }

          export interface ServiceCatalog {
            get $beanFullName(): 'mcp-test.service.catalog';
            get $onionName(): 'mcp-test:catalog';
          }
}
/** service: end */
/** service: begin */
import type { ServiceCatalog } from '../service/catalog.ts';
export interface IModuleService {
  'catalog': ServiceCatalog;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'mcp-test.service.catalog': ServiceCatalog;
  }
}
/** service: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleMcpTest extends BeanScopeBase {}

export interface ScopeModuleMcpTest {
  util: BeanScopeUtil;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'mcp-test': ScopeModuleMcpTest;
  }

  export interface IBeanScopeContainer {
    mcpTest: ScopeModuleMcpTest;
  }






}
/** scope: end */
