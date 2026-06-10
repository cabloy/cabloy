// eslint-disable
import type { TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** dto: begin */
export * from '../dto/testBody.ts';
export * from '../dto/testDetail.ts';
export * from '../dto/testParams.ts';
export * from '../dto/testQuery.ts';
export * from '../dto/testResult.tsx';
import type { IDtoOptionsTestBody } from '../dto/testBody.ts';
import type { IDtoOptionsTestDetail } from '../dto/testDetail.ts';
import type { IDtoOptionsTestParams } from '../dto/testParams.ts';
import type { IDtoOptionsTestQuery } from '../dto/testQuery.ts';
import type { IDtoOptionsTestResult } from '../dto/testResult.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'test-ssr:testBody': IDtoOptionsTestBody;
'test-ssr:testDetail': IDtoOptionsTestDetail;
'test-ssr:testParams': IDtoOptionsTestParams;
'test-ssr:testQuery': IDtoOptionsTestQuery;
'test-ssr:testResult': IDtoOptionsTestResult;
    }

  
}
declare module 'vona-module-test-ssr' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoTestBody } from '../dto/testBody.ts';
import type { DtoTestDetail } from '../dto/testDetail.ts';
import type { DtoTestParams } from '../dto/testParams.ts';
import type { DtoTestQuery } from '../dto/testQuery.ts';
import type { DtoTestResult } from '../dto/testResult.tsx';
declare module 'vona-module-test-ssr' {
  
    export interface IDtoOptionsTestBody {
      fields?: TypeEntityOptionsFields<DtoTestBody, IDtoOptionsTestBody[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsTestDetail {
      fields?: TypeEntityOptionsFields<DtoTestDetail, IDtoOptionsTestDetail[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsTestParams {
      fields?: TypeEntityOptionsFields<DtoTestParams, IDtoOptionsTestParams[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsTestQuery {
      fields?: TypeEntityOptionsFields<DtoTestQuery, IDtoOptionsTestQuery[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsTestResult {
      fields?: TypeEntityOptionsFields<DtoTestResult, IDtoOptionsTestResult[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/toolMinimal.ts';
export * from '../controller/toolOne.ts';
export * from '../controller/toolTwo.ts';
import type { IControllerOptionsToolMinimal } from '../controller/toolMinimal.ts';
import type { IControllerOptionsToolOne } from '../controller/toolOne.ts';
import type { IControllerOptionsToolTwo } from '../controller/toolTwo.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IControllerRecord {
      'test-ssr:toolMinimal': IControllerOptionsToolMinimal;
'test-ssr:toolOne': IControllerOptionsToolOne;
'test-ssr:toolTwo': IControllerOptionsToolTwo;
    }


}
declare module 'vona-module-test-ssr' {

        export interface ControllerToolMinimal {
          /** @internal */
          get scope(): ScopeModuleTestSsr;
        }

          export interface ControllerToolMinimal {
            get $beanFullName(): 'test-ssr.controller.toolMinimal';
            get $onionName(): 'test-ssr:toolMinimal';
            get $onionOptions(): IControllerOptionsToolMinimal;
          }

        export interface ControllerToolOne {
          /** @internal */
          get scope(): ScopeModuleTestSsr;
        }

          export interface ControllerToolOne {
            get $beanFullName(): 'test-ssr.controller.toolOne';
            get $onionName(): 'test-ssr:toolOne';
            get $onionOptions(): IControllerOptionsToolOne;
          }

        export interface ControllerToolTwo {
          /** @internal */
          get scope(): ScopeModuleTestSsr;
        }

          export interface ControllerToolTwo {
            get $beanFullName(): 'test-ssr.controller.toolTwo';
            get $onionName(): 'test-ssr:toolTwo';
            get $onionOptions(): IControllerOptionsToolTwo;
          }
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerToolMinimal } from '../controller/toolMinimal.ts';
// @ts-ignore ignore
import type { ControllerToolOne } from '../controller/toolOne.ts';
// @ts-ignore ignore
import type { ControllerToolTwo } from '../controller/toolTwo.ts';
declare module 'vona-module-test-ssr' {

    export interface IControllerOptionsToolMinimal {
      actions?: TypeControllerOptionsActions<ControllerToolMinimal>;
    }

    export interface IControllerOptionsToolOne {
      actions?: TypeControllerOptionsActions<ControllerToolOne>;
    }

    export interface IControllerOptionsToolTwo {
      actions?: TypeControllerOptionsActions<ControllerToolTwo>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/test/ssr/toolMinimal/test': undefined;
'/test/ssr/toolOne/test/:id?': undefined;
'/test/ssr/toolTwo/test/:id?': undefined;
    }
export interface IApiPathPostRecord{
        '/test/ssr/toolOne/test/:id?': undefined;
    }

}

/** controller: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleLocales, type TypeLocaleBase } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleTestSsr extends BeanScopeBase {}

export interface ScopeModuleTestSsr {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'test-ssr': ScopeModuleTestSsr;
  }

  export interface IBeanScopeContainer {
    testSsr: ScopeModuleTestSsr;
  }
  
  

  export interface IBeanScopeLocale {
    'test-ssr': (typeof locales)[TypeLocaleBase];
  }

  
}
/** scope: end */
