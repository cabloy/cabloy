// eslint-disable
/** model: begin */
export * from '../model/test.js';
import { IModelOptionsTest } from '../model/test.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'demo-basic:test': IModelOptionsTest;
    }

  
}
declare module 'zova-module-demo-basic' {
  
        export interface ModelTest {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ModelTest {
          get $beanFullName(): 'demo-basic.model.test';
          get $onionName(): 'demo-basic:test';
          get $onionOptions(): IModelOptionsTest;
        } 
}
/** model: end */
/** model: begin */
import { ModelTest } from '../model/test.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'demo-basic.model.test': ModelTest;
  }
}
/** model: end */
/** controller: begin */
export * from '../component/actionView/controller.jsx';
export * from '../component/card/controller.jsx';
export * from '../component/formFieldTest/controller.jsx';
export * from '../component/tableCellTest/controller.jsx';
export * from '../page/component/controller.jsx';
export * from '../page/locale/controller.jsx';
export * from '../page/routeParams/controller.jsx';
export * from '../page/routeQuery/controller.jsx';
export * from '../page/routeQueryB/controller.jsx';
export * from '../page/state/controller.jsx';
export * from '../page/style/controller.jsx';
export * from '../page/toolOne/controller.jsx';
export * from '../page/toolTwo/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-demo-basic' {
  
        export interface ControllerActionView {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerCard {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerFormFieldTest {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerTableCellTest {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerPageComponent {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerPageLocale {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerPageRouteParams {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerPageRouteQuery {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerPageRouteQueryB {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerPageState {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerPageStyle {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerPageToolOne {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerPageToolTwo {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerActionView } from '../component/actionView/controller.jsx';
import { ControllerCard } from '../component/card/controller.jsx';
import { ControllerFormFieldTest } from '../component/formFieldTest/controller.jsx';
import { ControllerTableCellTest } from '../component/tableCellTest/controller.jsx';
import { ControllerPageComponent } from '../page/component/controller.jsx';
import { ControllerPageLocale } from '../page/locale/controller.jsx';
import { ControllerPageRouteParams } from '../page/routeParams/controller.jsx';
import { ControllerPageRouteQuery } from '../page/routeQuery/controller.jsx';
import { ControllerPageRouteQueryB } from '../page/routeQueryB/controller.jsx';
import { ControllerPageState } from '../page/state/controller.jsx';
import { ControllerPageStyle } from '../page/style/controller.jsx';
import { ControllerPageToolOne } from '../page/toolOne/controller.jsx';
import { ControllerPageToolTwo } from '../page/toolTwo/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'demo-basic.controller.actionView': ControllerActionView;
'demo-basic.controller.card': ControllerCard;
'demo-basic.controller.formFieldTest': ControllerFormFieldTest;
'demo-basic.controller.tableCellTest': ControllerTableCellTest;
'demo-basic.controller.pageComponent': ControllerPageComponent;
'demo-basic.controller.pageLocale': ControllerPageLocale;
'demo-basic.controller.pageRouteParams': ControllerPageRouteParams;
'demo-basic.controller.pageRouteQuery': ControllerPageRouteQuery;
'demo-basic.controller.pageRouteQueryB': ControllerPageRouteQueryB;
'demo-basic.controller.pageState': ControllerPageState;
'demo-basic.controller.pageStyle': ControllerPageStyle;
'demo-basic.controller.pageToolOne': ControllerPageToolOne;
'demo-basic.controller.pageToolTwo': ControllerPageToolTwo;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/component.js';
export * from './page/locale.js';
export * from './page/routeParams.js';
import { NSControllerPageRouteParams } from './page/routeParams.js';
export * from './page/routeQuery.js';
import { NSControllerPageRouteQuery } from './page/routeQuery.js';
export * from './page/routeQueryB.js';
import { NSControllerPageRouteQueryB } from './page/routeQueryB.js';
export * from './page/state.js';
export * from './page/style.js';
export * from './page/toolOne.js';
import { NSControllerPageToolOne } from './page/toolOne.js';
export * from './page/toolTwo.js';
import { NSControllerPageToolTwo } from './page/toolTwo.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/demo/basic/component': TypePagePathSchema<undefined,undefined>;
'/demo/basic/locale': TypePagePathSchema<undefined,undefined>;
'/demo/basic/routeParams/:id?': TypePagePathSchema<NSControllerPageRouteParams.ParamsInput,NSControllerPageRouteParams.QueryInput>;
'/demo/basic/routeQuery': TypePagePathSchema<NSControllerPageRouteQuery.ParamsInput,NSControllerPageRouteQuery.QueryInput>;
'/demo/basic/routeQueryB': TypePagePathSchema<NSControllerPageRouteQueryB.ParamsInput,NSControllerPageRouteQueryB.QueryInput>;
'/demo/basic/state': TypePagePathSchema<undefined,undefined>;
'/demo/basic/style': TypePagePathSchema<undefined,undefined>;
'/demo/basic/toolOne/:id?': TypePagePathSchema<NSControllerPageToolOne.ParamsInput,NSControllerPageToolOne.QueryInput>;
'/demo/basic/toolTwo/:id?': TypePagePathSchema<NSControllerPageToolTwo.ParamsInput,NSControllerPageToolTwo.QueryInput>;
}
export interface IPageNameRecord {
  'demo-basic:routeParams': undefined;
'demo-basic:toolOne': undefined;
'demo-basic:toolTwo': undefined;
}
}
export const pagePathSchemas = {
'/demo/basic/routeQuery': {
          query: NSControllerPageRouteQuery.querySchema,
        },
'/demo/basic/routeQueryB': {
          query: NSControllerPageRouteQueryB.querySchema,
        },
};
export const pageNameSchemas = {
'demo-basic:routeParams': {
          params: NSControllerPageRouteParams.paramsSchema,
          query: NSControllerPageRouteParams.querySchema,
        },
'demo-basic:toolOne': {
          params: NSControllerPageToolOne.paramsSchema,
          query: NSControllerPageToolOne.querySchema,
        },
'demo-basic:toolTwo': {
          params: NSControllerPageToolTwo.paramsSchema,
          query: NSControllerPageToolTwo.querySchema,
        },
};
declare module 'zova-module-demo-basic' {
  export interface ControllerPageRouteParams {
        $params: NSControllerPageRouteParams.ParamsOutput;
$query: NSControllerPageRouteParams.QueryOutput;
      }
export interface ControllerPageRouteQuery {
        $params: NSControllerPageRouteQuery.ParamsOutput;
$query: NSControllerPageRouteQuery.QueryOutput;
      }
export interface ControllerPageRouteQueryB {
        $params: NSControllerPageRouteQueryB.ParamsOutput;
$query: NSControllerPageRouteQueryB.QueryOutput;
      }
export interface ControllerPageToolOne {
        $params: NSControllerPageToolOne.ParamsOutput;
$query: NSControllerPageToolOne.QueryOutput;
      }
export interface ControllerPageToolTwo {
        $params: NSControllerPageToolTwo.ParamsOutput;
$query: NSControllerPageToolTwo.QueryOutput;
      }
}
/** pages: end */

/** components: begin */
export * from './component/actionView.js';
import { ZActionView } from './component/actionView.js';
export * from './component/card.js';
import { ZCard } from './component/card.js';
export * from './component/formFieldTest.js';
import { ZFormFieldTest } from './component/formFieldTest.js';
export * from './component/tableCellTest.js';
import { ZTableCellTest } from './component/tableCellTest.js';
export const components = {
  'actionView': ZActionView,
'card': ZCard,
'formFieldTest': ZFormFieldTest,
'tableCellTest': ZTableCellTest,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'demo-basic:actionView': ControllerActionView;
'demo-basic:card': ControllerCard;
'demo-basic:formFieldTest': ControllerFormFieldTest;
'demo-basic:tableCellTest': ControllerTableCellTest;
}
export interface IZovaComponentRecord {
  'demo-basic:actionView': typeof ZActionView;
'demo-basic:card': typeof ZCard;
'demo-basic:formFieldTest': typeof ZFormFieldTest;
'demo-basic:tableCellTest': typeof ZTableCellTest;
}
}
/** components: end */
/** render: begin */
export * from '../page/toolOne/render.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-demo-basic' {
  
        export interface RenderPageToolOne {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        } 
}
/** render: end */
/** render: begin */
import { RenderPageToolOne } from '../page/toolOne/render.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'demo-basic.render.pageToolOne': RenderPageToolOne;
  }
}
/** render: end */
/** aop: begin */
export * from '../bean/aop.home.jsx';
export * from '../bean/aop.home3.jsx';

import { IDecoratorAopOptions } from 'zova-module-a-bean';
declare module 'zova-module-a-bean' {
  
    export interface IAopRecord {
      'demo-basic:home': IDecoratorAopOptions;
'demo-basic:home3': IDecoratorAopOptions;
    }

  
}
declare module 'zova-module-demo-basic' {
  
        export interface AopHome {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface AopHome {
          get $beanFullName(): 'demo-basic.aop.home';
          get $onionName(): 'demo-basic:home';
          get $onionOptions(): IDecoratorAopOptions;
        }

        export interface AopHome3 {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface AopHome3 {
          get $beanFullName(): 'demo-basic.aop.home3';
          get $onionName(): 'demo-basic:home3';
          get $onionOptions(): IDecoratorAopOptions;
        } 
}
/** aop: end */
/** aop: begin */
import { AopHome } from '../bean/aop.home.jsx';
import { AopHome3 } from '../bean/aop.home3.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'demo-basic.aop.home': AopHome;
'demo-basic.aop.home3': AopHome3;
  }
}
/** aop: end */
/** behavior: begin */
export * from '../bean/behavior.formFieldLayout.jsx';
import { IBehaviorOptionsFormFieldLayout } from '../bean/behavior.formFieldLayout.jsx';
import 'zova-module-a-behavior';
declare module 'zova-module-a-behavior' {
  
    export interface IBehaviorRecord {
      'demo-basic:formFieldLayout': IBehaviorOptionsFormFieldLayout;
    }

  
}
declare module 'zova-module-demo-basic' {
  
        export interface BehaviorFormFieldLayout {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface BehaviorFormFieldLayout {
          get $beanFullName(): 'demo-basic.behavior.formFieldLayout';
          get $onionName(): 'demo-basic:formFieldLayout';
          get $onionOptions(): IBehaviorOptionsFormFieldLayout;
        } 
}
/** behavior: end */
/** behavior: begin */
import { BehaviorFormFieldLayout } from '../bean/behavior.formFieldLayout.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'demo-basic.behavior.formFieldLayout': BehaviorFormFieldLayout;
  }
}
/** behavior: end */
/** behaviors: begin */
import 'vue';
import 'vue/jsx-runtime';

declare module 'vue' {
  export interface InputHTMLAttributes {
    'bs-demo-basic-formFieldLayout'?: IBehaviorOptionsFormFieldLayout | '' | boolean;
  }
}

declare module 'vue/jsx-runtime' {
  namespace JSX {
    // need define class/style in IntrinsicAttributes
    export interface IntrinsicAttributes {
      'bs-demo-basic-formFieldLayout'?: IBehaviorOptionsFormFieldLayout | '' | boolean;
    }
  }
}
/** behaviors: end */
/** tableCell: begin */
export * from '../bean/tableCell.test.jsx';
import { ITableCellOptionsTest } from '../bean/tableCell.test.jsx';
import 'zova-module-a-table';
declare module 'zova-module-a-table' {
  
    export interface ITableCellRecord {
      'demo-basic:test': ITableCellOptionsTest;
    }

  
}
declare module 'zova-module-demo-basic' {
  
        export interface TableCellTest {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface TableCellTest {
          get $beanFullName(): 'demo-basic.tableCell.test';
          get $onionName(): 'demo-basic:test';
          get $onionOptions(): ITableCellOptionsTest;
        } 
}
/** tableCell: end */
/** tableCell: begin */
import { TableCellTest } from '../bean/tableCell.test.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'demo-basic.tableCell.test': TableCellTest;
  }
}
/** tableCell: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleDemoBasic extends BeanScopeBase {}

export interface ScopeModuleDemoBasic {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'demo-basic': ScopeModuleDemoBasic;
  }
  
  

  export interface IBeanScopeLocale {
    'demo-basic': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `demo-basic::${K}` {
  return `demo-basic::${key}`;
}  
/** scope: end */
