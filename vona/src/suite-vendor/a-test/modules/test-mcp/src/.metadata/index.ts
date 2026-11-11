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
      'test-mcp:categoryPublic': IDtoOptionsCategoryPublic;
'test-mcp:categoryPublicSelectReq': IDtoOptionsCategoryPublicSelectReq;
'test-mcp:categoryPublicSelectRes': IDtoOptionsCategoryPublicSelectRes;
'test-mcp:productPublic': IDtoOptionsProductPublic;
'test-mcp:productPublicDetail': IDtoOptionsProductPublicDetail;
'test-mcp:productPublicSelectReq': IDtoOptionsProductPublicSelectReq;
'test-mcp:productPublicSelectRes': IDtoOptionsProductPublicSelectRes;
'test-mcp:productPublicSku': IDtoOptionsProductPublicSku;
    }


}
declare module 'vona-module-test-mcp' {

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
declare module 'vona-module-test-mcp' {

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
export * from '../controller/toolFixture.ts';
import type { IControllerOptionsCatalog } from '../controller/catalog.ts';
import type { IControllerOptionsToolFixture } from '../controller/toolFixture.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IControllerRecord {
      'test-mcp:catalog': IControllerOptionsCatalog;
'test-mcp:toolFixture': IControllerOptionsToolFixture;
    }


}
declare module 'vona-module-test-mcp' {

        export interface ControllerCatalog {
          /** @internal */
          get scope(): ScopeModuleTestMcp;
        }

          export interface ControllerCatalog {
            get $beanFullName(): 'test-mcp.controller.catalog';
            get $onionName(): 'test-mcp:catalog';
            get $onionOptions(): IControllerOptionsCatalog;
          }

        export interface ControllerToolFixture {
          /** @internal */
          get scope(): ScopeModuleTestMcp;
        }

          export interface ControllerToolFixture {
            get $beanFullName(): 'test-mcp.controller.toolFixture';
            get $onionName(): 'test-mcp:toolFixture';
            get $onionOptions(): IControllerOptionsToolFixture;
          }
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerCatalog } from '../controller/catalog.ts';
// @ts-ignore ignore
import type { ControllerToolFixture } from '../controller/toolFixture.ts';
declare module 'vona-module-test-mcp' {

    export interface IControllerOptionsCatalog {
      actions?: TypeControllerOptionsActions<ControllerCatalog>;
    }

    export interface IControllerOptionsToolFixture {
      actions?: TypeControllerOptionsActions<ControllerToolFixture>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/mcp/test/catalog/categories': undefined;
'/mcp/test/catalog/products': undefined;
'/mcp/test/catalog/products/:id': undefined;
'/mcp/test/catalog/excluded': undefined;
'/mcp/test/actions/status': undefined;
'/mcp/test/actions/scalar': undefined;
'/mcp/test/actions/array': undefined;
'/mcp/test/actions/unsupported': undefined;
'/mcp/test/actions/excluded': undefined;
'/mcp/test/actions/closed': undefined;
    }
export interface IApiPathPostRecord{
        '/mcp/test/actions/effect/:label': undefined;
    }

}

/** controller: end */
/** service: begin */
export * from '../service/catalog.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {

    export interface IServiceRecord {
      'test-mcp:catalog': never;
    }


}
declare module 'vona-module-test-mcp' {

        export interface ServiceCatalog {
          /** @internal */
          get scope(): ScopeModuleTestMcp;
        }

          export interface ServiceCatalog {
            get $beanFullName(): 'test-mcp.service.catalog';
            get $onionName(): 'test-mcp:catalog';
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
    'test-mcp.service.catalog': ServiceCatalog;
  }
}
/** service: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleTestMcp extends BeanScopeBase {}

export interface ScopeModuleTestMcp {
  util: BeanScopeUtil;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'test-mcp': ScopeModuleTestMcp;
  }

  export interface IBeanScopeContainer {
    testMcp: ScopeModuleTestMcp;
  }






}
/** scope: end */
