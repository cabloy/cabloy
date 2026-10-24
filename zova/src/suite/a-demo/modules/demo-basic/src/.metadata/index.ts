// eslint-disable
/** model: begin */
export * from '../model/test.ts';
import { IModelOptionsTest } from '../model/test.ts';
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
import type { ModelTest } from '../model/test.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'demo-basic.model.test': ModelTest;
  }
}
/** model: end */
/** controller: begin */
export * from '../component/actionView/controller.tsx';
export * from '../component/card/controller.tsx';
export * from '../component/controllerBoundaryProbe/controller.tsx';
export * from '../component/controllerBoundaryProbeInline/controller.tsx';
export * from '../component/controllerBoundaryProbeOverride/controller.tsx';
export * from '../component/formFieldTest/controller.tsx';
export * from '../component/tableCellTest/controller.tsx';
export * from '../page/component/controller.tsx';
export * from '../page/controllerBoundary/controller.tsx';
export * from '../page/locale/controller.tsx';
export * from '../page/routeParams/controller.tsx';
export * from '../page/routeQuery/controller.tsx';
export * from '../page/routeQueryB/controller.tsx';
export * from '../page/routedDialog/controller.tsx';
export * from '../page/routedDialogDetail/controller.tsx';
export * from '../page/routedDialogEntry/controller.tsx';
export * from '../page/state/controller.tsx';
export * from '../page/style/controller.tsx';
export * from '../page/toolMinimal/controller.tsx';
export * from '../page/toolOne/controller.tsx';
export * from '../page/toolTwo/controller.tsx';

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

        export interface ControllerControllerBoundaryProbe {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerControllerBoundaryProbeInline {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerControllerBoundaryProbeOverride {
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

        export interface ControllerPageControllerBoundary {
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

        export interface ControllerPageRoutedDialog {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerPageRoutedDialogDetail {
          /** @internal */
          get scope(): ScopeModuleDemoBasic;
        }

        export interface ControllerPageRoutedDialogEntry {
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

        export interface ControllerPageToolMinimal {
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
import type { ControllerActionView } from '../component/actionView/controller.tsx';
import type { ControllerCard } from '../component/card/controller.tsx';
import type { ControllerControllerBoundaryProbe } from '../component/controllerBoundaryProbe/controller.tsx';
import type { ControllerControllerBoundaryProbeInline } from '../component/controllerBoundaryProbeInline/controller.tsx';
import type { ControllerControllerBoundaryProbeOverride } from '../component/controllerBoundaryProbeOverride/controller.tsx';
import type { ControllerFormFieldTest } from '../component/formFieldTest/controller.tsx';
import type { ControllerTableCellTest } from '../component/tableCellTest/controller.tsx';
import type { ControllerPageComponent } from '../page/component/controller.tsx';
import type { ControllerPageControllerBoundary } from '../page/controllerBoundary/controller.tsx';
import type { ControllerPageLocale } from '../page/locale/controller.tsx';
import type { ControllerPageRouteParams } from '../page/routeParams/controller.tsx';
import type { ControllerPageRouteQuery } from '../page/routeQuery/controller.tsx';
import type { ControllerPageRouteQueryB } from '../page/routeQueryB/controller.tsx';
import type { ControllerPageRoutedDialog } from '../page/routedDialog/controller.tsx';
import type { ControllerPageRoutedDialogDetail } from '../page/routedDialogDetail/controller.tsx';
import type { ControllerPageRoutedDialogEntry } from '../page/routedDialogEntry/controller.tsx';
import type { ControllerPageState } from '../page/state/controller.tsx';
import type { ControllerPageStyle } from '../page/style/controller.tsx';
import type { ControllerPageToolMinimal } from '../page/toolMinimal/controller.tsx';
import type { ControllerPageToolOne } from '../page/toolOne/controller.tsx';
import type { ControllerPageToolTwo } from '../page/toolTwo/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'demo-basic.controller.actionView': ControllerActionView;
'demo-basic.controller.card': ControllerCard;
'demo-basic.controller.controllerBoundaryProbe': ControllerControllerBoundaryProbe;
'demo-basic.controller.controllerBoundaryProbeInline': ControllerControllerBoundaryProbeInline;
'demo-basic.controller.controllerBoundaryProbeOverride': ControllerControllerBoundaryProbeOverride;
'demo-basic.controller.formFieldTest': ControllerFormFieldTest;
'demo-basic.controller.tableCellTest': ControllerTableCellTest;
'demo-basic.controller.pageComponent': ControllerPageComponent;
'demo-basic.controller.pageControllerBoundary': ControllerPageControllerBoundary;
'demo-basic.controller.pageLocale': ControllerPageLocale;
'demo-basic.controller.pageRouteParams': ControllerPageRouteParams;
'demo-basic.controller.pageRouteQuery': ControllerPageRouteQuery;
'demo-basic.controller.pageRouteQueryB': ControllerPageRouteQueryB;
'demo-basic.controller.pageRoutedDialog': ControllerPageRoutedDialog;
'demo-basic.controller.pageRoutedDialogDetail': ControllerPageRoutedDialogDetail;
'demo-basic.controller.pageRoutedDialogEntry': ControllerPageRoutedDialogEntry;
'demo-basic.controller.pageState': ControllerPageState;
'demo-basic.controller.pageStyle': ControllerPageStyle;
'demo-basic.controller.pageToolMinimal': ControllerPageToolMinimal;
'demo-basic.controller.pageToolOne': ControllerPageToolOne;
'demo-basic.controller.pageToolTwo': ControllerPageToolTwo;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/component.ts';
export * from './page/controllerBoundary.ts';
import { NSControllerPageControllerBoundary } from './page/controllerBoundary.ts';
export * from './page/locale.ts';
export * from './page/routeParams.ts';
import { NSControllerPageRouteParams } from './page/routeParams.ts';
export * from './page/routeQuery.ts';
import { NSControllerPageRouteQuery } from './page/routeQuery.ts';
export * from './page/routeQueryB.ts';
import { NSControllerPageRouteQueryB } from './page/routeQueryB.ts';
export * from './page/routedDialog.ts';
export * from './page/routedDialogDetail.ts';
import { NSControllerPageRoutedDialogDetail } from './page/routedDialogDetail.ts';
export * from './page/routedDialogEntry.ts';
import { NSControllerPageRoutedDialogEntry } from './page/routedDialogEntry.ts';
export * from './page/state.ts';
export * from './page/style.ts';
export * from './page/toolMinimal.ts';
export * from './page/toolOne.ts';
import { NSControllerPageToolOne } from './page/toolOne.ts';
export * from './page/toolTwo.ts';
import { NSControllerPageToolTwo } from './page/toolTwo.ts';
export * from '../routes.ts';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/demo/basic/component': TypePagePathSchema<undefined,undefined>;
'/demo/basic/controllerBoundary': TypePagePathSchema<NSControllerPageControllerBoundary.ParamsInput,NSControllerPageControllerBoundary.QueryInput>;
'/demo/basic/locale': TypePagePathSchema<undefined,undefined>;
'/demo/basic/routeParams/:id?': TypePagePathSchema<NSControllerPageRouteParams.ParamsInput,NSControllerPageRouteParams.QueryInput>;
'/demo/basic/routeQuery': TypePagePathSchema<NSControllerPageRouteQuery.ParamsInput,NSControllerPageRouteQuery.QueryInput>;
'/demo/basic/routeQueryB': TypePagePathSchema<NSControllerPageRouteQueryB.ParamsInput,NSControllerPageRouteQueryB.QueryInput>;
'/demo/basic/routedDialog': TypePagePathSchema<undefined,undefined>;
'/demo/basic/routedDialogDetail/:id': TypePagePathSchema<NSControllerPageRoutedDialogDetail.ParamsInput,NSControllerPageRoutedDialogDetail.QueryInput>;
'/demo/basic/routedDialogEntry': TypePagePathSchema<NSControllerPageRoutedDialogEntry.ParamsInput,NSControllerPageRoutedDialogEntry.QueryInput>;
'/demo/basic/state': TypePagePathSchema<undefined,undefined>;
'/demo/basic/style': TypePagePathSchema<undefined,undefined>;
'/demo/basic/toolMinimal': TypePagePathSchema<undefined,undefined>;
'/demo/basic/toolOne/:id?': TypePagePathSchema<NSControllerPageToolOne.ParamsInput,NSControllerPageToolOne.QueryInput>;
'/demo/basic/toolTwo/:id?': TypePagePathSchema<NSControllerPageToolTwo.ParamsInput,NSControllerPageToolTwo.QueryInput>;
}
export interface IPageNameRecord {
  'demo-basic:routeParams': TypePagePathSchema<NSControllerPageRouteParams.ParamsInput,NSControllerPageRouteParams.QueryInput>;
'demo-basic:routedDialogDetail': TypePagePathSchema<NSControllerPageRoutedDialogDetail.ParamsInput,NSControllerPageRoutedDialogDetail.QueryInput>;
'demo-basic:toolMinimal': TypePagePathSchema<undefined,undefined>;
'demo-basic:toolOne': TypePagePathSchema<NSControllerPageToolOne.ParamsInput,NSControllerPageToolOne.QueryInput>;
'demo-basic:toolTwo': TypePagePathSchema<NSControllerPageToolTwo.ParamsInput,NSControllerPageToolTwo.QueryInput>;
}
}
export const pagePathSchemas = {
'/demo/basic/controllerBoundary': {
          query: NSControllerPageControllerBoundary.querySchema,
        },
'/demo/basic/routeQuery': {
          query: NSControllerPageRouteQuery.querySchema,
        },
'/demo/basic/routeQueryB': {
          query: NSControllerPageRouteQueryB.querySchema,
        },
'/demo/basic/routedDialogEntry': {
          query: NSControllerPageRoutedDialogEntry.querySchema,
        },
};
export const pageNameSchemas = {
'demo-basic:routeParams': {
          params: NSControllerPageRouteParams.paramsSchema,
          query: NSControllerPageRouteParams.querySchema,
        },
'demo-basic:routedDialogDetail': {
          params: NSControllerPageRoutedDialogDetail.paramsSchema,
          query: NSControllerPageRoutedDialogDetail.querySchema,
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
  export interface ControllerPageControllerBoundary {
        $params: NSControllerPageControllerBoundary.ParamsOutput;
$query: NSControllerPageControllerBoundary.QueryOutput;
      }
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
export interface ControllerPageRoutedDialogDetail {
        $params: NSControllerPageRoutedDialogDetail.ParamsOutput;
$query: NSControllerPageRoutedDialogDetail.QueryOutput;
      }
export interface ControllerPageRoutedDialogEntry {
        $params: NSControllerPageRoutedDialogEntry.ParamsOutput;
$query: NSControllerPageRoutedDialogEntry.QueryOutput;
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
export * from './component/actionView.ts';
import { ZActionView } from './component/actionView.ts';
export * from './component/card.ts';
import { ZCard } from './component/card.ts';
export * from './component/controllerBoundaryProbe.ts';
import { ZControllerBoundaryProbe } from './component/controllerBoundaryProbe.ts';
export * from './component/controllerBoundaryProbeInline.ts';
import { ZControllerBoundaryProbeInline } from './component/controllerBoundaryProbeInline.ts';
export * from './component/controllerBoundaryProbeOverride.ts';
import { ZControllerBoundaryProbeOverride } from './component/controllerBoundaryProbeOverride.ts';
export * from './component/formFieldTest.ts';
import { ZFormFieldTest } from './component/formFieldTest.ts';
export * from './component/tableCellTest.ts';
import { ZTableCellTest } from './component/tableCellTest.ts';
export const components = {
  'actionView': ZActionView,
'card': ZCard,
'controllerBoundaryProbe': ZControllerBoundaryProbe,
'controllerBoundaryProbeInline': ZControllerBoundaryProbeInline,
'controllerBoundaryProbeOverride': ZControllerBoundaryProbeOverride,
'formFieldTest': ZFormFieldTest,
'tableCellTest': ZTableCellTest,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'demo-basic:actionView': ControllerActionView;
'demo-basic:card': ControllerCard;
'demo-basic:controllerBoundaryProbe': ControllerControllerBoundaryProbe;
'demo-basic:controllerBoundaryProbeInline': ControllerControllerBoundaryProbeInline;
'demo-basic:controllerBoundaryProbeOverride': ControllerControllerBoundaryProbeOverride;
'demo-basic:formFieldTest': ControllerFormFieldTest;
'demo-basic:tableCellTest': ControllerTableCellTest;
}
export interface IZovaComponentRecord {
  'demo-basic:actionView': typeof ZActionView;
'demo-basic:card': typeof ZCard;
'demo-basic:controllerBoundaryProbe': typeof ZControllerBoundaryProbe;
'demo-basic:controllerBoundaryProbeInline': typeof ZControllerBoundaryProbeInline;
'demo-basic:controllerBoundaryProbeOverride': typeof ZControllerBoundaryProbeOverride;
'demo-basic:formFieldTest': typeof ZFormFieldTest;
'demo-basic:tableCellTest': typeof ZTableCellTest;
}
}
/** components: end */
/** render: begin */
export * from '../page/toolOne/render.tsx';

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
import type { RenderPageToolOne } from '../page/toolOne/render.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'demo-basic.render.pageToolOne': RenderPageToolOne;
  }
}
/** render: end */
/** behavior: begin */
export * from '../bean/behavior.formFieldLayout.tsx';
import { IBehaviorOptionsFormFieldLayout } from '../bean/behavior.formFieldLayout.tsx';
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
import type { BehaviorFormFieldLayout } from '../bean/behavior.formFieldLayout.tsx';
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
export * from '../bean/tableCell.test.tsx';
import { ITableCellOptionsTest } from '../bean/tableCell.test.tsx';
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
import type { TableCellTest } from '../bean/tableCell.test.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'demo-basic.tableCell.test': TableCellTest;
  }
}
/** tableCell: end */
/** locale: begin */
import { locales } from './locales.ts';
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
