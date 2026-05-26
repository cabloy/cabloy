import { BeanAopBase, BeanBase, BeanContainer, BeanControllerBase, BeanControllerPageBase, BeanRenderBase, BeanScopeBase, BeanScopeUtil, BeanSimple, BeanStyleBase, DefineModelOptions, IComponentOptions, IModuleMain, ISlot, PrefixKeys, TypeControllerInnerProps, TypeEventOff, TypeLocaleBase, TypeModuleConfig, TypeModuleLocales, TypePropUpdateFromModel, TypePropValueFromModel, ZovaSys } from "zova";
import * as _$vue from "vue";
import { VNode } from "vue";
import { BeanRouter, BeanRouterGuardsBase, IRouteViewRouteItem, ModelPageData, TypePagePathSchema } from "zova-module-a-router";
import z$1, { z } from "zod";
import { BeanApiBase, IApiActionOptions, IApiSchemaOptions } from "zova-module-a-api";
import * as _$zova_module_a_openapi0 from "zova-module-a-openapi";
import { ICaptchaData, ICaptchaSceneRecord, IFormMeta, IFormProvider, IJsxRenderContextBase, IJsxRenderContextPage, IJsxRenderContextPageEntry, IPageEntryScope, IPageScope, IPermissionHintGeneral, IResourceBlockOptionsBase, IResourceBlockRecord, IResourceFormActionRowNameRecord, IResourceFormActionRowOptionsBase, IResourceFormActionRowRecord, IResourceFormFieldLayoutOptions, IResourceFormFieldOptionsBase, IResourceFormFieldRecord, IResourceRenderBlockOptionsBlock, IResourceRenderFormActionRowOptionsAction, IResourceRenderTableActionBulkOptionsAction, IResourceRenderTableActionRowOptionsAction, IResourceTableActionBulkOptionsBase, IResourceTableActionBulkRecord, IResourceTableActionNameRecord, IResourceTableActionRowOptionsBase, IResourceTableActionRowRecord, IResourceTableCellOptionsBase, IResourceTableCellRecord, ISchemaRenderComponentLayoutOptions, ITablePaged, ITableQuery, ITableResPaged, TypeFormScene, TypeFormSchemaScene, TypeOpenapiPermissions, TypeSchemaOrderLevel, TypeSchemaScene } from "zova-module-a-openapi";
import { IJwtAdapter, IJwtInfo } from "zova-module-a-interceptor";
import { AopActionDispose, AopActionInit, AopActionRender, IDecoratorAopOptions, IVonaComponentRecord, TypeComponentOptions } from "zova-module-a-bean";
import * as _$_tanstack_vue_query0 from "@tanstack/vue-query";
import { BeanModelBase, IDecoratorModelOptions } from "zova-module-a-model";
import * as _$vue_jsx_runtime0 from "vue/jsx-runtime";
import { BeanControllerTableBase, ControllerTable as ControllerTable$1, ControllerTableProps as ControllerTableProps$1, IJsxRenderContextTableCell, IJsxRenderContextTableColumn, ITableCellRender, NextTableCellRender } from "zova-module-a-table";
import { BeanControllerFormBase, BeanControllerPageFormBase, ControllerForm, ControllerFormField, HTMLInputElementType, IFormFieldComponentOptions, IFormFieldRenderContext, TypeFormOnSubmitData } from "zova-module-a-form";
import * as _$openapi3_ts_oas310 from "openapi3-ts/oas31";
import { SchemaObject } from "openapi3-ts/oas31";
import { BeanBehaviorBase, IDecoratorBehaviorOptions, NextBehavior } from "zova-module-a-behavior";
import * as _$_tanstack_query_core0 from "@tanstack/query-core";
import { IIconRecord } from "zova-module-a-icon";
import { ScopeModuleASsr } from "zova-module-a-ssr";
import { BeanThemeBase, IDecoratorCssOptions, IDecoratorThemeOptions, IThemeApplyParams, IThemeApplyResult, IThemeBase, IThemeHandler, IThemeHandlerApplyParams } from "zova-module-a-style";
import { ModelTabs, RouteTab } from "zova-module-a-routertabs";
import { BeanCommandBulkBase, BeanCommandRowBase, ICommandBulkOptionsBase, ICommandExecute, ICommandOptionsBase, ICommandRecord, ICommandRowOptionsBase, IJsxCommandOptionsCommands, IJsxCommandOptionsEvent, NextCommandExecute, TypeCommandOptions } from "zova-module-a-command";
import { types } from "typestyle";
import { TypeRenderComponentJsx, ZovaJsx } from "zova-jsx";
import { ModelResource } from "zova-module-rest-resource";
import { TableIdentity } from "table-identity";
export * from "zova-module-a-router";
export * from "zova-module-a-api";
export * from "zova-module-a-openapi";
export * from "zova-module-a-interceptor";
export * from "zova-module-a-bean";
export * from "zova-module-a-model";
export * from "zova-module-a-table";
export * from "zova-module-a-form";
export * from "zova-module-a-behavior";
export * from "zova-module-a-fetch";
export * from "zova-module-a-app";
export * from "zova-module-a-boundary";
export * from "zova-module-a-icon";
export * from "zova-module-a-logger";
export * from "zova-module-a-meta";
export * from "zova-module-a-ssr";
export * from "zova-module-a-ssrhmr";
export * from "zova-module-a-style";
export * from "zova-module-a-zod";
export * from "zova-module-a-zova";
export * from "zova-module-a-routertabs";
export * from "zova-module-a-command";
export * from "zova-module-rest-resource";
export * from "zova-module-a-behaviors";
export * from "zova-module-a-routerstack";
export * from "zova-module-a-ssrserver";

//#region \0rolldown/runtime.js
//#endregion
//#region src/module/demo-student/src/page/test/controller.d.ts
declare class ControllerPageTest extends BeanControllerPageBase {
  protected __init__(): Promise<void>;
  protected render(): null;
}
//#endregion
//#region src/module/demo-student/src/.metadata/page/test.d.ts
declare const ZPageTest: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/module/demo-student/src/.metadata/index.d.ts
declare module 'zova' {}
declare module 'zova-module-demo-student' {
  interface ControllerPageTest {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'demo-student.controller.pageTest': ControllerPageTest;
  }
}
/** controller: end */
/** pages: begin */
declare module 'zova-module-a-router' {
  interface IPagePathRecord {
    '/demo/student/test': TypePagePathSchema<undefined, undefined>;
  }
  interface IPageNameRecord {}
}
declare module 'zova-module-demo-student' {}
/** pages: end */
/** scope: begin */
declare class ScopeModuleDemoStudent extends BeanScopeBase {}
interface ScopeModuleDemoStudent {
  util: BeanScopeUtil;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'demo-student': ScopeModuleDemoStudent;
  }
}
/** scope: end */
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/openapi/baseURL.d.ts
declare const OpenApiBaseURL: (sys: ZovaSys) => string;
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/openapi/types.d.ts
interface paths {
  '/api/auth/mock/authorize': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['AuthMock_authorize'];
    put?: never;
    post: operations['AuthMock_authorizePost'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/captcha/create': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Captcha_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/captcha/refresh': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Captcha_refresh'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/captcha/verifyImmediate': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Captcha_verifyImmediate'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mailconfirm/mail/emailConfirmCallback': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['MailconfirmMail_emailConfirmCallback'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/mailconfirm/mail/passwordResetCallback': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['MailconfirmMail_passwordResetCallback'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/base/menu/{publicPath?}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeBaseMenu_retrieveMenus'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/base/permission/{resource}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeBasePermission_retrievePermissions'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    }; /** @description Home */
    get: operations['Home_index'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/current': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeUserPassport_current'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/logout': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_logout'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/register': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_register'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/login': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_login'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/login/{module}/{providerName}/{clientName?}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeUserPassport_loginOauth'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/associate/{module}/{providerName}/{clientName?}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeUserPassport_associate'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/migrate/{module}/{providerName}/{clientName?}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['HomeUserPassport_migrate'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/refreshAuthToken': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_refreshAuthToken'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/createPassportJwtFromOauthCode': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_createPassportJwtFromOauthCode'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/home/user/passport/createTempAuthToken': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['HomeUserPassport_createTempAuthToken'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/auth/passport/isAuthenticated': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestAuthPassport_isAuthenticated'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/auth/passport/current': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestAuthPassport_current'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/rest/product': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestRestProduct_select'];
    put?: never;
    post: operations['TestRestProduct_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/rest/product/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestRestProduct_view'];
    put?: never;
    post?: never;
    delete: operations['TestRestProduct_delete'];
    options?: never;
    head?: never;
    patch: operations['TestRestProduct_update'];
    trace?: never;
  };
  '/api/test/ssr/toolOne/test/{id?}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestSsrToolOne_testGet'];
    put?: never;
    post: operations['TestSsrToolOne_test'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/ssr/toolTwo/test/{id?}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestSsrToolTwo_test'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/captcha/signin': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestCaptcha_signin'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/paypal/getRecord/{recordId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['Paypal_getRecord'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/paypal/captureOrder/{recordId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Paypal_captureOrder'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/paypal/cancelOrder/{recordId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Paypal_cancelOrder'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/play': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Play_index'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/dtoTest/getUserLazy': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaDtoTest_getUserLazy'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/dtoTest/getUserDynamic': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaDtoTest_getPostDynamic'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/dtoTest/getUserStats': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaDtoTest_getUserStats'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/dtoTest/getUserStatsGroup': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaDtoTest_getUserStatsGroup'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/dtoTest/createUser': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaDtoTest_createUser'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/dtoTest/updateUser/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch: operations['TestVonaDtoTest_updateUser'];
    trace?: never;
  };
  '/api/test/vona/dtoTest/getCategoryTree': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaDtoTest_getCategoryTree'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/dtoTest/getCategoryTree2': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaDtoTest_getCategoryTree2'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/guardPassport/testUserName': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaGuardPassport_testUserName'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/guardPassport/testUserNameFail': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaGuardPassport_testUserNameFail'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/guardPassport/testRoleName': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaGuardPassport_testRoleName'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/guardPassport/testRoleNameFail': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaGuardPassport_testRoleNameFail'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['Onion_index'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/echo': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Onion_echo'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/onion/echo2/{userId}/{userName}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Onion_echo2'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/onion/echo3/{userId}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['Onion_echo3'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/onion/echo4': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['Onion_echo4'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/onion/echo5': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['Onion_echo5'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/onion/echo6': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['Onion_echo6'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/order/create': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaOrder_create'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/order/update/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaOrder_update'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/order/findAll': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaOrder_findAll'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/order/findMany': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaOrder_findMany'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/post/group': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaPost_group'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/post/aggregate': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaPost_aggregate'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/post/findManyEcho': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaPost_findManyEcho'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/post/findMany': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: operations['TestVonaPost_findMany'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/serializer/echoSimple': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaSerializer_echoSimple'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/serializer/echoArray': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaSerializer_echoArray'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/serializer/echoLazy': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaSerializer_echoLazy'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/upload/fields': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaUpload_fields'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/upload/file': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaUpload_file'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/api/test/vona/upload/files': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: operations['TestVonaUpload_files'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
type webhooks = Record<string, never>;
interface components {
  schemas: {
    'test-vona.dto.postCreate': {
      /** @description Title */title: string;
      userId: number | string;
      stars?: number | undefined;
    };
    'test-vona.dto.userCreate': {
      name: string;
      age?: number | undefined;
      scores?: number | undefined;
      posts?: {
        /** @description Title */title: string;
      }[] | undefined;
      roles?: {
        id: number | string;
        deleted?: boolean | undefined;
      }[] | undefined;
    };
    'test-vona.entity.product': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number; /** @description ID */
      id: number | string; /** @description Name */
      name: string; /** @description Price */
      price: number; /** @description Quantity */
      quantity: number; /** @description Amount */
      amount: number;
      orderId: number | string;
    };
    'a-captcha.dto.captchaData': {
      id: string;
      provider: string;
      token?: unknown;
      payload?: unknown;
    };
    'a-menu.dto.menus': {
      menus?: components['schemas']['a-menu.dto.menuItem'][] | undefined;
      groups?: components['schemas']['a-menu.dto.menuGroup'][] | undefined;
    };
    'a-menu.dto.menuItem': {
      name: string;
      title?: string | undefined;
      description?: string | undefined;
      icon?: string | undefined;
      order?: number | undefined;
      group?: string | string[] | undefined;
      separator?: boolean | undefined;
      link?: string | undefined;
      external?: boolean | undefined;
      target?: string | undefined;
      meta?: components['schemas']['a-menu.dto.menuItemMeta'];
    };
    'a-menu.dto.menuItemMeta': {
      params?: unknown;
      query?: unknown;
    } | undefined;
    'a-menu.dto.menuGroup': {
      name: string;
      title?: string | undefined;
      description?: string | undefined;
      icon?: string | undefined;
      order?: number | undefined;
      group?: string | string[] | undefined;
      collapsed?: boolean | undefined;
    };
    'a-permission.dto.permissions': {
      roleIds?: (number | string)[] | undefined;
      roleNames?: string[] | undefined;
      actions?: unknown;
    };
    'home-user.dto.passport': {
      user: components['schemas']['home-user.entity.user'];
      auth: components['schemas']['a-auth.dto.auth'];
      roles: components['schemas']['home-user.entity.role'][];
    } | undefined; /** @description User */
    'home-user.entity.user': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number; /** @description ID */
      id: number | string; /** @description User Name */
      name: string; /** @description Avatar */
      avatar?: string | undefined; /** @description Email */
      email?: string | undefined; /** @description Mobile */
      mobile?: string | undefined;
      /**
       * @description Activated
       * @default false
       */
      activated?: boolean; /** @description Language */
      locale?: string | undefined; /** @description Timezone */
      tz?: string | undefined;
    };
    'a-auth.dto.auth': {
      /** @description ID */id: number | string;
      profileId: string;
      authProvider?: {
        /** @description ID */id: number;
        providerName: string;
        clientName: string;
      };
    }; /** @description Role */
    'home-user.entity.role': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number; /** @description ID */
      id: number | string; /** @description Role Name */
      name: string;
    };
    'home-user.dto.passportJwt': {
      passport: components['schemas']['home-user.dto.passport'];
      jwt: components['schemas']['a-jwt.dto.jwtToken'];
    };
    'a-jwt.dto.jwtToken': {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
    'home-user.dto.register': {
      username: string; /** Format: email */
      email: string;
      password: string;
      passwordConfirm: string;
      captcha: components['schemas']['a-captcha.dto.captchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e'];
    };
    'a-captcha.dto.captchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e': {
      id: string;
      token: string;
    };
    'home-user.dto.login': {
      username: string;
      password: string;
      captcha: components['schemas']['a-captcha.dto.captchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e_3218e7d152830e08f6e764b9e0c3796df929ee2b'];
    };
    'a-captcha.dto.captchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e_3218e7d152830e08f6e764b9e0c3796df929ee2b': {
      id: string;
      token: string;
    }; /** @description Create Product */
    'test-rest.dto.productCreate': {
      /** @description Name */name: string; /** @description Description */
      description?: string | undefined; /** @description Price */
      price: number;
      /**
       * @description Quantity
       * @default 0
       */
      quantity?: number; /** @description Amount */
      amount: number; /** @description Custom */
      _custom?: unknown; /** @description Test */
      _test?: unknown;
    };
    'test-rest.dto.productQueryRes': {
      list: {
        /**
         * Format: date-time
         * @description Created At
         */
        createdAt: Date;
        /**
         * Format: date-time
         * @description Updated At
         */
        updatedAt: Date;
        /**
         * @description Deleted
         * @default false
         */
        deleted?: boolean;
        /**
         * @description Instance ID
         * @default 0
         */
        iid?: number; /** @description ID */
        id: number | string; /** @description Name */
        name: string; /** @description Description */
        description?: string | undefined; /** @description Price */
        price: number;
        /**
         * @description Quantity
         * @default 0
         */
        quantity?: number; /** @description Amount */
        amount: number; /** @description Custom */
        _custom?: unknown;
      }[];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    }; /** @description Product Info */
    'test-rest.entity.product': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number; /** @description ID */
      id: number | string; /** @description Name */
      name: string; /** @description Description */
      description?: string | undefined; /** @description Price */
      price: number;
      /**
       * @description Quantity
       * @default 0
       */
      quantity?: number; /** @description Amount */
      amount: number; /** @description Custom */
      _custom?: unknown;
    } | undefined; /** @description Update Product */
    'test-rest.dto.productUpdate': {
      /** @description Name */name: string; /** @description Description */
      description?: string | undefined; /** @description Price */
      price: number;
      /**
       * @description Quantity
       * @default 0
       */
      quantity?: number; /** @description Amount */
      amount: number; /** @description Custom */
      _custom?: unknown;
    };
    'test-ssr.dto.testResult': {
      id: number | string;
      /**
       * @description Name
       * @default tom
       */
      name?: string;
      married: boolean;
      details: components['schemas']['test-ssr.dto.testDetail'][]; /** @default custom */
      _custom1?: string | undefined; /** @default custom */
      _custom2?: string | undefined; /** @default custom */
      _custom3?: string | undefined; /** @default custom */
      _custom4?: string | undefined; /** @default custom */
      _custom5?: string | undefined;
      _customCopy?: string | undefined;
      _customCopied?: boolean | undefined;
    };
    'test-ssr.dto.testDetail': {
      name: string;
      price: number;
      quantity: number;
      amount: number;
    };
    'test-ssr.dto.testBody': {
      id: number | string;
      /**
       * @description Name
       * @default tom
       */
      name?: string;
      married: boolean;
      details: components['schemas']['test-ssr.dto.testDetail'][]; /** @default custom */
      _custom1?: string | undefined; /** @default custom */
      _custom2?: string | undefined; /** @default custom */
      _custom3?: string | undefined; /** @default custom */
      _custom4?: string | undefined; /** @default custom */
      _custom5?: string | undefined;
      _customCopy?: string | undefined;
      _customCopied?: boolean | undefined;
    };
    'test-captcha.dto.signin': {
      username: string;
      password: string;
      captcha?: unknown;
    };
    'a-paypal.entity.paypalRecord': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number; /** @description ID */
      id: number | string;
      userId: number | string; /** @default 0 */
      status?: number;
      prepayId: string;
      payload: components['schemas']['a-paypal.dto.paypalOrderRecordPayload'];
      options: components['schemas']['a-paypal.dto.paypalOrderRecordOptions'];
    };
    'a-paypal.dto.paypalOrderRecordPayload': {
      remark: string;
      total: string;
      currencyCode: string;
    };
    'a-paypal.dto.paypalOrderRecordOptions': {
      brandName: string;
      returnUrl: string;
      cancelUrl: string;
      returnTo: string;
      scene: string;
      orderId: number | string;
    };
    'a-play.dto.play': {
      args: string[];
      projectPath: string;
    };
    'test-vona.dto.userLazy': {
      name: string;
      user?: components['schemas']['test-vona.dto.userLazy'];
      roles?: components['schemas']['test-vona.dto.roleLazy'][] | undefined;
    };
    'test-vona.dto.roleLazy': {
      name: string;
      users?: components['schemas']['test-vona.dto.userLazy'][] | undefined;
    };
    'test-vona.entity.user_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7': {
      /** @description ID */id: number | string;
      name: string;
    };
    'test-vona.entity.post_a6ba2076b5b70a3c098374cc82d418bd1ab226c3': {
      count_all?: string | undefined;
      count_title?: string | undefined;
      sum_stars?: string | undefined;
    };
    'test-vona.entity.post_729883d7de16ce4401b26f75bebe618c8948ff64': {
      /** @description Title */title: string;
      count_all?: string | undefined;
      count_title?: string | undefined;
      sum_stars?: string | undefined;
    };
    'test-vona.dto.userUpdate': {
      name: string;
      age?: number | undefined;
      scores?: number | undefined;
      posts?: {
        /**
         * @description Deleted
         * @default false
         */
        deleted?: boolean | undefined; /** @description ID */
        id?: number | string | undefined; /** @description Title */
        title: string;
      }[] | undefined;
    };
    'test-vona.entity.category_2c7d642ee581efa300341e343180fbb0ecdc785d': {
      /** @description ID */id: number | string;
      name: string;
      children: components['schemas']['test-vona.entity.category_2c7d642ee581efa300341e343180fbb0ecdc785d'][];
    };
    'test-vona.dto.categoryTree': {
      /** @description ID */id: number | string;
      name: string;
      children: components['schemas']['test-vona.entity.category_2c7d642ee581efa300341e343180fbb0ecdc785d'][];
    }; /** @description User */
    'test-vona.dto.user': {
      /** @description User ID */id: number | string;
      name: string;
      married: boolean;
    };
    'test-vona.dto.orderCreate': {
      /**
       * @description Order No
       * @default
       */
      orderNo?: string; /** @description Remark */
      remark?: string | undefined;
      products?: components['schemas']['test-vona.entity.product_29731960f3f38d3572bc2f8a01a7498bfe927055'][] | undefined;
    };
    'test-vona.entity.product_29731960f3f38d3572bc2f8a01a7498bfe927055': {
      /** @description Name */name: string; /** @description Price */
      price: number; /** @description Quantity */
      quantity: number; /** @description Amount */
      amount: number;
    };
    'test-vona.dto.orderUpdate': {
      /**
       * @description Order No
       * @default
       */
      orderNo?: string; /** @description Remark */
      remark?: string | undefined;
      products?: components['schemas']['test-vona.entity.product_9cf2c6bcd41713270c34bcfce21b7b4942e3fbc6'][] | undefined;
    };
    'test-vona.entity.product_9cf2c6bcd41713270c34bcfce21b7b4942e3fbc6': {
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean | undefined; /** @description ID */
      id?: number | string | undefined; /** @description Name */
      name: string; /** @description Price */
      price: number; /** @description Quantity */
      quantity: number; /** @description Amount */
      amount: number;
    };
    'test-vona.dto.orderResult': {
      /**
       * Format: date-time
       * @description Created At
       */
      createdAt: Date;
      /**
       * Format: date-time
       * @description Updated At
       */
      updatedAt: Date;
      /**
       * @description Deleted
       * @default false
       */
      deleted?: boolean;
      /**
       * @description Instance ID
       * @default 0
       */
      iid?: number; /** @description ID */
      id: number | string;
      /**
       * @description Order No
       * @default
       */
      orderNo?: string; /** @description Remark */
      remark?: string | undefined;
      userId: number | string;
      user?: components['schemas']['test-vona.entity.user_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7'];
      products: components['schemas']['test-vona.entity.product_bce173590aaef19772f1ae3a82196493c2633e2e'][];
    };
    'test-vona.entity.product_bce173590aaef19772f1ae3a82196493c2633e2e': {
      /** @description ID */id: number | string; /** @description Name */
      name: string; /** @description Price */
      price: number; /** @description Quantity */
      quantity: number; /** @description Amount */
      amount: number;
    };
    'test-vona.dto.orderResultPage': {
      list: {
        /**
         * Format: date-time
         * @description Created At
         */
        createdAt: Date;
        /**
         * Format: date-time
         * @description Updated At
         */
        updatedAt: Date;
        /**
         * @description Deleted
         * @default false
         */
        deleted?: boolean;
        /**
         * @description Instance ID
         * @default 0
         */
        iid?: number; /** @description ID */
        id: number | string;
        /**
         * @description Order No
         * @default
         */
        orderNo?: string; /** @description Remark */
        remark?: string | undefined;
        userId: number | string;
        user?: components['schemas']['test-vona.entity.user_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7'];
        products: components['schemas']['test-vona.entity.product_bce173590aaef19772f1ae3a82196493c2633e2e'][];
      }[];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'test-vona.dto.postGroup': {
      userId: number | string;
      count_all?: string | undefined;
      sum_stars?: string | undefined;
    };
    'test-vona.dto.postAggregate': {
      count_all?: string | undefined;
      count_stars?: string | undefined;
      sum_stars?: string | undefined;
      avg_stars?: string | undefined;
      min_stars?: string | undefined;
      max_stars?: string | undefined;
    };
    'test-vona.dto.postQueryRes': {
      list: {
        /**
         * Format: date-time
         * @description Created At
         */
        createdAt: Date;
        /**
         * Format: date-time
         * @description Updated At
         */
        updatedAt: Date;
        /**
         * @description Deleted
         * @default false
         */
        deleted?: boolean;
        /**
         * @description Instance ID
         * @default 0
         */
        iid?: number; /** @description ID */
        id: number | string; /** @description Title */
        title: string;
        userId: number | string;
        stars?: number | undefined;
        postContent?: {
          /** @description ID */id: number | string;
          content: string;
        };
        user?: components['schemas']['test-vona.entity.user_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7'];
      }[];
      total: string;
      pageCount: number;
      pageSize: number;
      pageNo: number;
    };
    'test-vona.dto.serializerSimple': {
      password: string;
      password2: string;
      email?: unknown; /** Format: email */
      email2: string; /** Format: email */
      email3: string;
      email4?: unknown; /** Format: email */
      email5: string; /** Format: email */
      email6: string; /** Format: email */
      email7: string;
      firstName: string;
      lastName: string;
      fullName?: string | undefined;
      fullName2?: string | undefined;
      fullName3?: string | undefined;
      fullName4?: string | undefined;
    };
    'test-vona.dto.serializerArray': {
      /** @description Simple */simples: components['schemas']['test-vona.dto.serializerSimple'][]; /** @description Simple */
      simplesLazy: components['schemas']['test-vona.dto.serializerSimple'][];
    };
    'test-vona.dto.serializerLazy': {
      simple: components['schemas']['test-vona.dto.serializerSimple_1c4b95bcfe8fe28a56dbcc7028097cf11836b4fc'];
      simpleLazy?: components['schemas']['test-vona.dto.serializerSimple_542f7be0da9b85a67248a6a1a3629e72de5fdb33_cff0ae112a392da58caf5aa905749f3c4444c4ab'];
    };
    'test-vona.dto.serializerSimple_1c4b95bcfe8fe28a56dbcc7028097cf11836b4fc': {
      password: string;
      password2: string;
      email?: unknown; /** Format: email */
      email2: string; /** Format: email */
      email3: string;
      email4?: unknown; /** Format: email */
      email5: string; /** Format: email */
      email6: string; /** Format: email */
      email7: string;
      firstName: string;
      lastName: string;
      fullName?: string | undefined;
      fullName2?: string | undefined;
      fullName3?: string | undefined;
      fullName4?: string | undefined;
    };
    /**
     * title
     * @description description
     */
    'test-vona.dto.serializerSimple_542f7be0da9b85a67248a6a1a3629e72de5fdb33_cff0ae112a392da58caf5aa905749f3c4444c4ab': {
      password: string;
      password2: string;
      email?: unknown; /** Format: email */
      email2: string; /** Format: email */
      email3: string;
      email4?: unknown; /** Format: email */
      email5: string; /** Format: email */
      email6: string; /** Format: email */
      email7: string;
      firstName: string;
      lastName: string;
      fullName?: string | undefined;
      fullName2?: string | undefined;
      fullName3?: string | undefined;
      fullName4?: string | undefined;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
type $defs = Record<string, never>;
interface operations {
  AuthMock_authorize: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  AuthMock_authorizePost: {
    parameters: {
      query: {
        redirect_uri: string;
        state: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          username: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  Captcha_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          scene: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-captcha.dto.captchaData'];
          };
        };
      };
    };
  };
  Captcha_refresh: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          id: string;
          scene: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-captcha.dto.captchaData'];
          };
        };
      };
    };
  };
  Captcha_verifyImmediate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          id: string;
          token?: unknown;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: string;
          };
        };
      };
    };
  };
  MailconfirmMail_emailConfirmCallback: {
    parameters: {
      query: {
        token: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  MailconfirmMail_passwordResetCallback: {
    parameters: {
      query: {
        token: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  HomeBaseMenu_retrieveMenus: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        publicPath: ((string | undefined) | undefined) | undefined;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-menu.dto.menus'];
          };
        };
      };
    };
  };
  HomeBasePermission_retrievePermissions: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        resource: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-permission.dto.permissions'];
          };
        };
      };
    };
    authToken: true;
  };
  Home_index: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  HomeUserPassport_current: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['home-user.dto.passport'];
          };
        };
      };
    };
  };
  HomeUserPassport_logout: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  HomeUserPassport_register: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['home-user.dto.register'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['home-user.dto.passportJwt'];
          };
        };
      };
    };
  };
  HomeUserPassport_login: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['home-user.dto.login'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['home-user.dto.passportJwt'];
          };
        };
      };
    };
  };
  HomeUserPassport_loginOauth: {
    parameters: {
      query?: {
        redirect?: string | undefined;
      };
      header?: never;
      path: {
        module: string;
        providerName: string;
        clientName: ((string | undefined) | undefined) | undefined;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  HomeUserPassport_associate: {
    parameters: {
      query?: {
        redirect?: string | undefined;
      };
      header?: never;
      path: {
        module: string;
        providerName: string;
        clientName: ((string | undefined) | undefined) | undefined;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['home-user.dto.passportJwt'];
          };
        };
      };
    };
    authToken: true;
  };
  HomeUserPassport_migrate: {
    parameters: {
      query?: {
        redirect?: string | undefined;
      };
      header?: never;
      path: {
        module: string;
        providerName: string;
        clientName: ((string | undefined) | undefined) | undefined;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['home-user.dto.passportJwt'];
          };
        };
      };
    };
    authToken: true;
  };
  HomeUserPassport_refreshAuthToken: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          refreshToken: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-jwt.dto.jwtToken'];
          };
        };
      };
    };
  };
  HomeUserPassport_createPassportJwtFromOauthCode: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          code: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['home-user.dto.passportJwt'];
          };
        };
      };
    };
  };
  HomeUserPassport_createTempAuthToken: {
    parameters: {
      query?: {
        path?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: string;
          };
        };
      };
    };
    authToken: true;
  };
  TestAuthPassport_isAuthenticated: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: boolean;
          };
        };
      };
    };
    authToken: true;
  };
  TestAuthPassport_current: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestRestProduct_select: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?: {
          [key: string]: unknown;
        } | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        name?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-rest.dto.productQueryRes'];
          };
        };
      };
    };
    authToken: true;
  };
  TestRestProduct_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-rest.dto.productCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: number | string;
          };
        };
      };
    };
    authToken: true;
  };
  TestRestProduct_view: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: components['schemas']['test-rest.entity.product'];
          };
        };
      };
    };
    authToken: true;
  };
  TestRestProduct_delete: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestRestProduct_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: number | string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-rest.dto.productUpdate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestSsrToolOne_testGet: {
    parameters: {
      query: {
        name: string;
      };
      header?: never;
      path: {
        id: ((number | undefined) | (string | undefined) | (undefined | undefined)) | undefined;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestSsrToolOne_test: {
    parameters: {
      query: {
        name: string;
      };
      header?: never;
      path: {
        id: ((number | undefined) | (string | undefined) | (undefined | undefined)) | undefined;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-ssr.dto.testBody'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-ssr.dto.testResult'];
          };
        };
      };
    };
    authToken: true;
  };
  TestSsrToolTwo_test: {
    parameters: {
      query: {
        name: string;
      };
      header?: never;
      path: {
        id: ((number | undefined) | (string | undefined) | (undefined | undefined)) | undefined;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-ssr.dto.testResult'];
          };
        };
      };
    };
  };
  TestCaptcha_signin: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-captcha.dto.signin'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  Paypal_getRecord: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        recordId: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['a-paypal.entity.paypalRecord'];
          };
        };
      };
    };
    authToken: true;
  };
  Paypal_captureOrder: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        recordId: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  Paypal_cancelOrder: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        recordId: number | string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  Play_index: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['a-play.dto.play'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaDtoTest_getUserLazy: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.userLazy'];
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaDtoTest_getPostDynamic: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: {
              /**
               * Created At
               * Format: date-time
               */
              createdAt: Date;
              /**
               * Updated At
               * Format: date-time
               */
              updatedAt: Date;
              /**
               * Deleted
               * @default false
               */
              deleted?: boolean;
              /**
               * Instance ID
               * @default 0
               */
              iid?: number; /** ID */
              id: number | string; /** Title */
              title: string;
              userId: number | string;
              stars?: number | undefined;
              user?: components['schemas']['test-vona.entity.user_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7'];
            };
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaDtoTest_getUserStats: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: {
              /**
               * Created At
               * Format: date-time
               */
              createdAt: Date;
              /**
               * Updated At
               * Format: date-time
               */
              updatedAt: Date;
              /**
               * Deleted
               * @default false
               */
              deleted?: boolean;
              /**
               * Instance ID
               * @default 0
               */
              iid?: number; /** ID */
              id: number | string;
              name: string;
              age?: number | undefined;
              scores?: number | undefined;
              posts?: components['schemas']['test-vona.entity.post_a6ba2076b5b70a3c098374cc82d418bd1ab226c3'];
            };
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaDtoTest_getUserStatsGroup: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: {
              /**
               * Created At
               * Format: date-time
               */
              createdAt: Date;
              /**
               * Updated At
               * Format: date-time
               */
              updatedAt: Date;
              /**
               * Deleted
               * @default false
               */
              deleted?: boolean;
              /**
               * Instance ID
               * @default 0
               */
              iid?: number; /** ID */
              id: number | string;
              name: string;
              age?: number | undefined;
              scores?: number | undefined;
              posts: components['schemas']['test-vona.entity.post_729883d7de16ce4401b26f75bebe618c8948ff64'][];
            };
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaDtoTest_createUser: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-vona.dto.userCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaDtoTest_updateUser: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: unknown;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-vona.dto.userUpdate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaDtoTest_getCategoryTree: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: {
              /** ID */id: number | string;
              name: string;
              children: components['schemas']['test-vona.entity.category_2c7d642ee581efa300341e343180fbb0ecdc785d'][];
            }[];
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaDtoTest_getCategoryTree2: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.categoryTree'][];
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaGuardPassport_testUserName: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaGuardPassport_testUserNameFail: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaGuardPassport_testRoleName: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaGuardPassport_testRoleNameFail: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  Onion_index: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  Onion_echo: {
    parameters: {
      query?: {
        id?: number;
        name?: number | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          /** @description User ID */id: number;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: string | undefined;
          };
        };
      };
    };
  };
  Onion_echo2: {
    parameters: {
      query: {
        id: number | string;
        name: string;
        married: boolean;
      };
      header?: never;
      path: {
        userId: number;
        userName: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': {
          /** @description User ID */id: number;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.user'];
          };
        };
      };
    };
  };
  Onion_echo3: {
    parameters: {
      query?: {
        id?: number | undefined;
      };
      header: {
        Accept: string;
      };
      path: {
        userId: number;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  Onion_echo4: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: {
      content: {
        'application/json': components['schemas']['test-vona.dto.user'][] | undefined;
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.user'][];
          };
        };
      };
    };
  };
  Onion_echo5: {
    parameters: {
      query?: {
        ids?: number[];
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  Onion_echo6: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaOrder_create: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-vona.dto.orderCreate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: number | string;
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaOrder_update: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        id: unknown;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-vona.dto.orderUpdate'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaOrder_findAll: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?: {
          [key: string]: unknown;
        } | undefined;
        orders?: string | string[][] | undefined;
        orderNo?: string | undefined;
        remark?: string | undefined;
        userName?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.orderResult'][];
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaOrder_findMany: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?: {
          [key: string]: unknown;
        } | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        orderNo?: string | undefined;
        remark?: string | undefined;
        pageSize?: number;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.orderResultPage'];
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaPost_group: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.postGroup'][];
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaPost_aggregate: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.postAggregate'];
          };
        };
      };
    };
    authToken: true;
  };
  TestVonaPost_findManyEcho: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?: {
          [key: string]: unknown;
        } | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        title?: string | undefined;
        userName?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.postQueryRes'];
          };
        };
      };
    };
  };
  TestVonaPost_findMany: {
    parameters: {
      query?: {
        columns?: string[] | undefined;
        where?: {
          [key: string]: unknown;
        } | undefined;
        orders?: string | string[][] | undefined;
        pageNo?: number;
        pageSize?: number;
        createdAt?: string | undefined;
        title?: string | undefined;
        userName?: string | undefined;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.postQueryRes'];
          };
        };
      };
    };
  };
  TestVonaSerializer_echoSimple: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-vona.dto.serializerSimple'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.serializerSimple'];
          };
        };
      };
    };
  };
  TestVonaSerializer_echoArray: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-vona.dto.serializerArray'][];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.serializerArray'][];
          };
        };
      };
    };
  };
  TestVonaSerializer_echoLazy: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['test-vona.dto.serializerLazy'];
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data: components['schemas']['test-vona.dto.serializerLazy'];
          };
        };
      };
    };
  };
  TestVonaUpload_fields: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'multipart/form-data': {
          checkes: string[];
          /**
           * your name
           * @default zhennann
           */
          name?: string;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  TestVonaUpload_file: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'multipart/form-data': {
          /** @default zhennann */name?: string; /** Format: binary */
          welcome: Blob;
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
  TestVonaUpload_files: {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody: {
      content: {
        'multipart/form-data': {
          /** images */images: Blob[];
          /**
           * single file
           * Format: binary
           */
          welcome1: Blob; /** Format: binary */
          welcome2: Blob; /** more files */
          blobs: Blob[];
        };
      };
    };
    responses: {
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': {
            code: string;
            message: string;
            data?: unknown;
          };
        };
      };
    };
  };
}
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/openapi/schemas.d.ts
type ApiSchemaTestVonaDtoPostCreate = components['schemas']['test-vona.dto.postCreate'];
type ApiSchemaTestVonaDtoPostCreatePartial = Partial<ApiSchemaTestVonaDtoPostCreate>;
type ApiSchemaTestVonaDtoUserCreate = components['schemas']['test-vona.dto.userCreate'];
type ApiSchemaTestVonaDtoUserCreatePartial = Partial<ApiSchemaTestVonaDtoUserCreate>;
type ApiSchemaTestVonaEntityProduct = components['schemas']['test-vona.entity.product'];
type ApiSchemaTestVonaEntityProductPartial = Partial<ApiSchemaTestVonaEntityProduct>;
type ApiSchemaACaptchaDtoCaptchaData = components['schemas']['a-captcha.dto.captchaData'];
type ApiSchemaACaptchaDtoCaptchaDataPartial = Partial<ApiSchemaACaptchaDtoCaptchaData>;
type ApiSchemaAMenuDtoMenus = components['schemas']['a-menu.dto.menus'];
type ApiSchemaAMenuDtoMenusPartial = Partial<ApiSchemaAMenuDtoMenus>;
type ApiSchemaAMenuDtoMenuItem = components['schemas']['a-menu.dto.menuItem'];
type ApiSchemaAMenuDtoMenuItemPartial = Partial<ApiSchemaAMenuDtoMenuItem>;
type ApiSchemaAMenuDtoMenuItemMeta = components['schemas']['a-menu.dto.menuItemMeta'];
type ApiSchemaAMenuDtoMenuItemMetaPartial = Partial<ApiSchemaAMenuDtoMenuItemMeta>;
type ApiSchemaAMenuDtoMenuGroup = components['schemas']['a-menu.dto.menuGroup'];
type ApiSchemaAMenuDtoMenuGroupPartial = Partial<ApiSchemaAMenuDtoMenuGroup>;
type ApiSchemaAPermissionDtoPermissions = components['schemas']['a-permission.dto.permissions'];
type ApiSchemaAPermissionDtoPermissionsPartial = Partial<ApiSchemaAPermissionDtoPermissions>;
type ApiSchemaHomeUserDtoPassport = components['schemas']['home-user.dto.passport'];
type ApiSchemaHomeUserDtoPassportPartial = Partial<ApiSchemaHomeUserDtoPassport>;
type ApiSchemaHomeUserEntityUser = components['schemas']['home-user.entity.user'];
type ApiSchemaHomeUserEntityUserPartial = Partial<ApiSchemaHomeUserEntityUser>;
type ApiSchemaAAuthDtoAuth = components['schemas']['a-auth.dto.auth'];
type ApiSchemaAAuthDtoAuthPartial = Partial<ApiSchemaAAuthDtoAuth>;
type ApiSchemaHomeUserEntityRole = components['schemas']['home-user.entity.role'];
type ApiSchemaHomeUserEntityRolePartial = Partial<ApiSchemaHomeUserEntityRole>;
type ApiSchemaHomeUserDtoPassportJwt = components['schemas']['home-user.dto.passportJwt'];
type ApiSchemaHomeUserDtoPassportJwtPartial = Partial<ApiSchemaHomeUserDtoPassportJwt>;
type ApiSchemaAJwtDtoJwtToken = components['schemas']['a-jwt.dto.jwtToken'];
type ApiSchemaAJwtDtoJwtTokenPartial = Partial<ApiSchemaAJwtDtoJwtToken>;
type ApiSchemaHomeUserDtoRegister = components['schemas']['home-user.dto.register'];
type ApiSchemaHomeUserDtoRegisterPartial = Partial<ApiSchemaHomeUserDtoRegister>;
type ApiSchemaACaptchaDtoCaptchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e = components['schemas']['a-captcha.dto.captchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e'];
type ApiSchemaACaptchaDtoCaptchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797ePartial = Partial<ApiSchemaACaptchaDtoCaptchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e>;
type ApiSchemaHomeUserDtoLogin = components['schemas']['home-user.dto.login'];
type ApiSchemaHomeUserDtoLoginPartial = Partial<ApiSchemaHomeUserDtoLogin>;
type ApiSchemaACaptchaDtoCaptchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e_3218e7d152830e08f6e764b9e0c3796df929ee2b = components['schemas']['a-captcha.dto.captchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e_3218e7d152830e08f6e764b9e0c3796df929ee2b'];
type ApiSchemaACaptchaDtoCaptchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e_3218e7d152830e08f6e764b9e0c3796df929ee2bPartial = Partial<ApiSchemaACaptchaDtoCaptchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e_3218e7d152830e08f6e764b9e0c3796df929ee2b>;
type ApiSchemaTestRestDtoProductCreate = components['schemas']['test-rest.dto.productCreate'];
type ApiSchemaTestRestDtoProductCreatePartial = Partial<ApiSchemaTestRestDtoProductCreate>;
type ApiSchemaTestRestDtoProductQueryRes = components['schemas']['test-rest.dto.productQueryRes'];
type ApiSchemaTestRestDtoProductQueryResPartial = Partial<ApiSchemaTestRestDtoProductQueryRes>;
type ApiSchemaTestRestEntityProduct = components['schemas']['test-rest.entity.product'];
type ApiSchemaTestRestEntityProductPartial = Partial<ApiSchemaTestRestEntityProduct>;
type ApiSchemaTestRestDtoProductUpdate = components['schemas']['test-rest.dto.productUpdate'];
type ApiSchemaTestRestDtoProductUpdatePartial = Partial<ApiSchemaTestRestDtoProductUpdate>;
type ApiSchemaTestSsrDtoTestResult = components['schemas']['test-ssr.dto.testResult'];
type ApiSchemaTestSsrDtoTestResultPartial = Partial<ApiSchemaTestSsrDtoTestResult>;
type ApiSchemaTestSsrDtoTestDetail = components['schemas']['test-ssr.dto.testDetail'];
type ApiSchemaTestSsrDtoTestDetailPartial = Partial<ApiSchemaTestSsrDtoTestDetail>;
type ApiSchemaTestSsrDtoTestBody = components['schemas']['test-ssr.dto.testBody'];
type ApiSchemaTestSsrDtoTestBodyPartial = Partial<ApiSchemaTestSsrDtoTestBody>;
type ApiSchemaTestCaptchaDtoSignin = components['schemas']['test-captcha.dto.signin'];
type ApiSchemaTestCaptchaDtoSigninPartial = Partial<ApiSchemaTestCaptchaDtoSignin>;
type ApiSchemaAPaypalEntityPaypalRecord = components['schemas']['a-paypal.entity.paypalRecord'];
type ApiSchemaAPaypalEntityPaypalRecordPartial = Partial<ApiSchemaAPaypalEntityPaypalRecord>;
type ApiSchemaAPaypalDtoPaypalOrderRecordPayload = components['schemas']['a-paypal.dto.paypalOrderRecordPayload'];
type ApiSchemaAPaypalDtoPaypalOrderRecordPayloadPartial = Partial<ApiSchemaAPaypalDtoPaypalOrderRecordPayload>;
type ApiSchemaAPaypalDtoPaypalOrderRecordOptions = components['schemas']['a-paypal.dto.paypalOrderRecordOptions'];
type ApiSchemaAPaypalDtoPaypalOrderRecordOptionsPartial = Partial<ApiSchemaAPaypalDtoPaypalOrderRecordOptions>;
type ApiSchemaAPlayDtoPlay = components['schemas']['a-play.dto.play'];
type ApiSchemaAPlayDtoPlayPartial = Partial<ApiSchemaAPlayDtoPlay>;
type ApiSchemaTestVonaDtoUserLazy = components['schemas']['test-vona.dto.userLazy'];
type ApiSchemaTestVonaDtoUserLazyPartial = Partial<ApiSchemaTestVonaDtoUserLazy>;
type ApiSchemaTestVonaDtoRoleLazy = components['schemas']['test-vona.dto.roleLazy'];
type ApiSchemaTestVonaDtoRoleLazyPartial = Partial<ApiSchemaTestVonaDtoRoleLazy>;
type ApiSchemaTestVonaEntityUser_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7 = components['schemas']['test-vona.entity.user_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7'];
type ApiSchemaTestVonaEntityUser_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7Partial = Partial<ApiSchemaTestVonaEntityUser_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7>;
type ApiSchemaTestVonaEntityPost_a6ba2076b5b70a3c098374cc82d418bd1ab226c3 = components['schemas']['test-vona.entity.post_a6ba2076b5b70a3c098374cc82d418bd1ab226c3'];
type ApiSchemaTestVonaEntityPost_a6ba2076b5b70a3c098374cc82d418bd1ab226c3Partial = Partial<ApiSchemaTestVonaEntityPost_a6ba2076b5b70a3c098374cc82d418bd1ab226c3>;
type ApiSchemaTestVonaEntityPost_729883d7de16ce4401b26f75bebe618c8948ff64 = components['schemas']['test-vona.entity.post_729883d7de16ce4401b26f75bebe618c8948ff64'];
type ApiSchemaTestVonaEntityPost_729883d7de16ce4401b26f75bebe618c8948ff64Partial = Partial<ApiSchemaTestVonaEntityPost_729883d7de16ce4401b26f75bebe618c8948ff64>;
type ApiSchemaTestVonaDtoUserUpdate = components['schemas']['test-vona.dto.userUpdate'];
type ApiSchemaTestVonaDtoUserUpdatePartial = Partial<ApiSchemaTestVonaDtoUserUpdate>;
type ApiSchemaTestVonaEntityCategory_2c7d642ee581efa300341e343180fbb0ecdc785d = components['schemas']['test-vona.entity.category_2c7d642ee581efa300341e343180fbb0ecdc785d'];
type ApiSchemaTestVonaEntityCategory_2c7d642ee581efa300341e343180fbb0ecdc785dPartial = Partial<ApiSchemaTestVonaEntityCategory_2c7d642ee581efa300341e343180fbb0ecdc785d>;
type ApiSchemaTestVonaDtoCategoryTree = components['schemas']['test-vona.dto.categoryTree'];
type ApiSchemaTestVonaDtoCategoryTreePartial = Partial<ApiSchemaTestVonaDtoCategoryTree>;
type ApiSchemaTestVonaDtoUser = components['schemas']['test-vona.dto.user'];
type ApiSchemaTestVonaDtoUserPartial = Partial<ApiSchemaTestVonaDtoUser>;
type ApiSchemaTestVonaDtoOrderCreate = components['schemas']['test-vona.dto.orderCreate'];
type ApiSchemaTestVonaDtoOrderCreatePartial = Partial<ApiSchemaTestVonaDtoOrderCreate>;
type ApiSchemaTestVonaEntityProduct_29731960f3f38d3572bc2f8a01a7498bfe927055 = components['schemas']['test-vona.entity.product_29731960f3f38d3572bc2f8a01a7498bfe927055'];
type ApiSchemaTestVonaEntityProduct_29731960f3f38d3572bc2f8a01a7498bfe927055Partial = Partial<ApiSchemaTestVonaEntityProduct_29731960f3f38d3572bc2f8a01a7498bfe927055>;
type ApiSchemaTestVonaDtoOrderUpdate = components['schemas']['test-vona.dto.orderUpdate'];
type ApiSchemaTestVonaDtoOrderUpdatePartial = Partial<ApiSchemaTestVonaDtoOrderUpdate>;
type ApiSchemaTestVonaEntityProduct_9cf2c6bcd41713270c34bcfce21b7b4942e3fbc6 = components['schemas']['test-vona.entity.product_9cf2c6bcd41713270c34bcfce21b7b4942e3fbc6'];
type ApiSchemaTestVonaEntityProduct_9cf2c6bcd41713270c34bcfce21b7b4942e3fbc6Partial = Partial<ApiSchemaTestVonaEntityProduct_9cf2c6bcd41713270c34bcfce21b7b4942e3fbc6>;
type ApiSchemaTestVonaDtoOrderResult = components['schemas']['test-vona.dto.orderResult'];
type ApiSchemaTestVonaDtoOrderResultPartial = Partial<ApiSchemaTestVonaDtoOrderResult>;
type ApiSchemaTestVonaEntityProduct_bce173590aaef19772f1ae3a82196493c2633e2e = components['schemas']['test-vona.entity.product_bce173590aaef19772f1ae3a82196493c2633e2e'];
type ApiSchemaTestVonaEntityProduct_bce173590aaef19772f1ae3a82196493c2633e2ePartial = Partial<ApiSchemaTestVonaEntityProduct_bce173590aaef19772f1ae3a82196493c2633e2e>;
type ApiSchemaTestVonaDtoOrderResultPage = components['schemas']['test-vona.dto.orderResultPage'];
type ApiSchemaTestVonaDtoOrderResultPagePartial = Partial<ApiSchemaTestVonaDtoOrderResultPage>;
type ApiSchemaTestVonaDtoPostGroup = components['schemas']['test-vona.dto.postGroup'];
type ApiSchemaTestVonaDtoPostGroupPartial = Partial<ApiSchemaTestVonaDtoPostGroup>;
type ApiSchemaTestVonaDtoPostAggregate = components['schemas']['test-vona.dto.postAggregate'];
type ApiSchemaTestVonaDtoPostAggregatePartial = Partial<ApiSchemaTestVonaDtoPostAggregate>;
type ApiSchemaTestVonaDtoPostQueryRes = components['schemas']['test-vona.dto.postQueryRes'];
type ApiSchemaTestVonaDtoPostQueryResPartial = Partial<ApiSchemaTestVonaDtoPostQueryRes>;
type ApiSchemaTestVonaDtoSerializerSimple = components['schemas']['test-vona.dto.serializerSimple'];
type ApiSchemaTestVonaDtoSerializerSimplePartial = Partial<ApiSchemaTestVonaDtoSerializerSimple>;
type ApiSchemaTestVonaDtoSerializerArray = components['schemas']['test-vona.dto.serializerArray'];
type ApiSchemaTestVonaDtoSerializerArrayPartial = Partial<ApiSchemaTestVonaDtoSerializerArray>;
type ApiSchemaTestVonaDtoSerializerLazy = components['schemas']['test-vona.dto.serializerLazy'];
type ApiSchemaTestVonaDtoSerializerLazyPartial = Partial<ApiSchemaTestVonaDtoSerializerLazy>;
type ApiSchemaTestVonaDtoSerializerSimple_1c4b95bcfe8fe28a56dbcc7028097cf11836b4fc = components['schemas']['test-vona.dto.serializerSimple_1c4b95bcfe8fe28a56dbcc7028097cf11836b4fc'];
type ApiSchemaTestVonaDtoSerializerSimple_1c4b95bcfe8fe28a56dbcc7028097cf11836b4fcPartial = Partial<ApiSchemaTestVonaDtoSerializerSimple_1c4b95bcfe8fe28a56dbcc7028097cf11836b4fc>;
type ApiSchemaTestVonaDtoSerializerSimple_542f7be0da9b85a67248a6a1a3629e72de5fdb33_cff0ae112a392da58caf5aa905749f3c4444c4ab = components['schemas']['test-vona.dto.serializerSimple_542f7be0da9b85a67248a6a1a3629e72de5fdb33_cff0ae112a392da58caf5aa905749f3c4444c4ab'];
type ApiSchemaTestVonaDtoSerializerSimple_542f7be0da9b85a67248a6a1a3629e72de5fdb33_cff0ae112a392da58caf5aa905749f3c4444c4abPartial = Partial<ApiSchemaTestVonaDtoSerializerSimple_542f7be0da9b85a67248a6a1a3629e72de5fdb33_cff0ae112a392da58caf5aa905749f3c4444c4ab>;
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/captcha.d.ts
/** Captcha_create */
declare const ApiApiCaptchacreatePath = "/api/captcha/create";
type ApiApiCaptchacreatePath = '/api/captcha/create';
type ApiApiCaptchacreateMethod = 'post';
type ApiApiCaptchacreateRequestBody = {
  scene: string;
};
type ApiApiCaptchacreateResponseBody = paths[ApiApiCaptchacreatePath][ApiApiCaptchacreateMethod]['responses']['200']['content']['application/json']['data'];
/** Captcha_refresh */
declare const ApiApiCaptcharefreshPath = "/api/captcha/refresh";
type ApiApiCaptcharefreshPath = '/api/captcha/refresh';
type ApiApiCaptcharefreshMethod = 'post';
type ApiApiCaptcharefreshRequestBody = {
  id: string;
  scene: string;
};
type ApiApiCaptcharefreshResponseBody = paths[ApiApiCaptcharefreshPath][ApiApiCaptcharefreshMethod]['responses']['200']['content']['application/json']['data'];
/** Captcha_verifyImmediate */
declare const ApiApiCaptchaverifyImmediatePath = "/api/captcha/verifyImmediate";
type ApiApiCaptchaverifyImmediatePath = '/api/captcha/verifyImmediate';
type ApiApiCaptchaverifyImmediateMethod = 'post';
type ApiApiCaptchaverifyImmediateRequestBody = {
  id: string;
  token?: unknown;
};
type ApiApiCaptchaverifyImmediateResponseBody = paths[ApiApiCaptchaverifyImmediatePath][ApiApiCaptchaverifyImmediateMethod]['responses']['200']['content']['application/json']['data'];
declare class ApiCaptcha extends BeanApiBase {
  create(body: ApiApiCaptchacreateRequestBody, options?: IApiActionOptions): Promise<{
    id: string;
    provider: string;
    token?: unknown;
    payload?: unknown;
  }>;
  refresh(body: ApiApiCaptcharefreshRequestBody, options?: IApiActionOptions): Promise<{
    id: string;
    provider: string;
    token?: unknown;
    payload?: unknown;
  }>;
  verifyImmediate(body: ApiApiCaptchaverifyImmediateRequestBody, options?: IApiActionOptions): Promise<string>;
}
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/home.d.ts
/** Home_index */
declare const ApiApiHomeindexPath = "/";
type ApiApiHomeindexPath = '/';
type ApiApiHomeindexMethod = 'get';
type ApiApiHomeindexResponseBody = paths[ApiApiHomeindexPath][ApiApiHomeindexMethod]['responses']['200']['content']['application/json']['data'];
declare class ApiHome extends BeanApiBase {
  /** @description Home */
  index(options?: IApiActionOptions): Promise<unknown>;
}
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/homeBaseMenu.d.ts
/** HomeBaseMenu_retrieveMenus */
declare const ApiApiHomeBaseMenuretrieveMenusPath = "/api/home/base/menu/{publicPath?}";
type ApiApiHomeBaseMenuretrieveMenusPath = '/api/home/base/menu/{publicPath?}';
type ApiApiHomeBaseMenuretrieveMenusMethod = 'get';
type ApiApiHomeBaseMenuretrieveMenusRequestParams = paths[ApiApiHomeBaseMenuretrieveMenusPath][ApiApiHomeBaseMenuretrieveMenusMethod]['parameters']['path'];
type ApiApiHomeBaseMenuretrieveMenusResponseBody = paths[ApiApiHomeBaseMenuretrieveMenusPath][ApiApiHomeBaseMenuretrieveMenusMethod]['responses']['200']['content']['application/json']['data'];
declare class ApiHomeBaseMenu extends BeanApiBase {
  retrieveMenus(options: {
    params: ApiApiHomeBaseMenuretrieveMenusRequestParams;
  } & IApiActionOptions): Promise<{
    menus?: components['schemas']['a-menu.dto.menuItem'][] | undefined;
    groups?: components['schemas']['a-menu.dto.menuGroup'][] | undefined;
  }>;
}
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/homeBasePermission.d.ts
/** HomeBasePermission_retrievePermissions */
declare const ApiApiHomeBasePermissionretrievePermissionsPath = "/api/home/base/permission/{resource}";
type ApiApiHomeBasePermissionretrievePermissionsPath = '/api/home/base/permission/{resource}';
type ApiApiHomeBasePermissionretrievePermissionsMethod = 'get';
type ApiApiHomeBasePermissionretrievePermissionsRequestParams = paths[ApiApiHomeBasePermissionretrievePermissionsPath][ApiApiHomeBasePermissionretrievePermissionsMethod]['parameters']['path'];
type ApiApiHomeBasePermissionretrievePermissionsResponseBody = paths[ApiApiHomeBasePermissionretrievePermissionsPath][ApiApiHomeBasePermissionretrievePermissionsMethod]['responses']['200']['content']['application/json']['data'];
declare class ApiHomeBasePermission extends BeanApiBase {
  retrievePermissions(options: {
    params: ApiApiHomeBasePermissionretrievePermissionsRequestParams;
  } & IApiActionOptions): Promise<{
    roleIds?: (number | string)[] | undefined;
    roleNames?: string[] | undefined;
    actions?: unknown;
  }>;
}
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/homeUserPassport.d.ts
/** HomeUserPassport_current */
declare const ApiApiHomeUserPassportcurrentPath = "/api/home/user/passport/current";
type ApiApiHomeUserPassportcurrentPath = '/api/home/user/passport/current';
type ApiApiHomeUserPassportcurrentMethod = 'get';
type ApiApiHomeUserPassportcurrentResponseBody = paths[ApiApiHomeUserPassportcurrentPath][ApiApiHomeUserPassportcurrentMethod]['responses']['200']['content']['application/json']['data'];
/** HomeUserPassport_logout */
declare const ApiApiHomeUserPassportlogoutPath = "/api/home/user/passport/logout";
type ApiApiHomeUserPassportlogoutPath = '/api/home/user/passport/logout';
type ApiApiHomeUserPassportlogoutMethod = 'post';
type ApiApiHomeUserPassportlogoutResponseBody = paths[ApiApiHomeUserPassportlogoutPath][ApiApiHomeUserPassportlogoutMethod]['responses']['200']['content']['application/json']['data'];
/** HomeUserPassport_register */
declare const ApiApiHomeUserPassportregisterPath = "/api/home/user/passport/register";
type ApiApiHomeUserPassportregisterPath = '/api/home/user/passport/register';
type ApiApiHomeUserPassportregisterMethod = 'post';
type ApiApiHomeUserPassportregisterRequestBody = components['schemas']['home-user.dto.register'];
type ApiApiHomeUserPassportregisterResponseBody = paths[ApiApiHomeUserPassportregisterPath][ApiApiHomeUserPassportregisterMethod]['responses']['200']['content']['application/json']['data'];
/** HomeUserPassport_login */
declare const ApiApiHomeUserPassportloginPath = "/api/home/user/passport/login";
type ApiApiHomeUserPassportloginPath = '/api/home/user/passport/login';
type ApiApiHomeUserPassportloginMethod = 'post';
type ApiApiHomeUserPassportloginRequestBody = components['schemas']['home-user.dto.login'];
type ApiApiHomeUserPassportloginResponseBody = paths[ApiApiHomeUserPassportloginPath][ApiApiHomeUserPassportloginMethod]['responses']['200']['content']['application/json']['data'];
/** HomeUserPassport_loginOauth */
declare const ApiApiHomeUserPassportloginOauthPath = "/api/home/user/passport/login/{module}/{providerName}/{clientName?}";
type ApiApiHomeUserPassportloginOauthPath = '/api/home/user/passport/login/{module}/{providerName}/{clientName?}';
type ApiApiHomeUserPassportloginOauthMethod = 'get';
type ApiApiHomeUserPassportloginOauthRequestParams = paths[ApiApiHomeUserPassportloginOauthPath][ApiApiHomeUserPassportloginOauthMethod]['parameters']['path'];
type ApiApiHomeUserPassportloginOauthRequestQuery = paths[ApiApiHomeUserPassportloginOauthPath][ApiApiHomeUserPassportloginOauthMethod]['parameters']['query'];
type ApiApiHomeUserPassportloginOauthResponseBody = paths[ApiApiHomeUserPassportloginOauthPath][ApiApiHomeUserPassportloginOauthMethod]['responses']['200']['content']['application/json']['data'];
/** HomeUserPassport_associate */
declare const ApiApiHomeUserPassportassociatePath = "/api/home/user/passport/associate/{module}/{providerName}/{clientName?}";
type ApiApiHomeUserPassportassociatePath = '/api/home/user/passport/associate/{module}/{providerName}/{clientName?}';
type ApiApiHomeUserPassportassociateMethod = 'get';
type ApiApiHomeUserPassportassociateRequestParams = paths[ApiApiHomeUserPassportassociatePath][ApiApiHomeUserPassportassociateMethod]['parameters']['path'];
type ApiApiHomeUserPassportassociateRequestQuery = paths[ApiApiHomeUserPassportassociatePath][ApiApiHomeUserPassportassociateMethod]['parameters']['query'];
type ApiApiHomeUserPassportassociateResponseBody = paths[ApiApiHomeUserPassportassociatePath][ApiApiHomeUserPassportassociateMethod]['responses']['200']['content']['application/json']['data'];
/** HomeUserPassport_migrate */
declare const ApiApiHomeUserPassportmigratePath = "/api/home/user/passport/migrate/{module}/{providerName}/{clientName?}";
type ApiApiHomeUserPassportmigratePath = '/api/home/user/passport/migrate/{module}/{providerName}/{clientName?}';
type ApiApiHomeUserPassportmigrateMethod = 'get';
type ApiApiHomeUserPassportmigrateRequestParams = paths[ApiApiHomeUserPassportmigratePath][ApiApiHomeUserPassportmigrateMethod]['parameters']['path'];
type ApiApiHomeUserPassportmigrateRequestQuery = paths[ApiApiHomeUserPassportmigratePath][ApiApiHomeUserPassportmigrateMethod]['parameters']['query'];
type ApiApiHomeUserPassportmigrateResponseBody = paths[ApiApiHomeUserPassportmigratePath][ApiApiHomeUserPassportmigrateMethod]['responses']['200']['content']['application/json']['data'];
/** HomeUserPassport_refreshAuthToken */
declare const ApiApiHomeUserPassportrefreshAuthTokenPath = "/api/home/user/passport/refreshAuthToken";
type ApiApiHomeUserPassportrefreshAuthTokenPath = '/api/home/user/passport/refreshAuthToken';
type ApiApiHomeUserPassportrefreshAuthTokenMethod = 'post';
type ApiApiHomeUserPassportrefreshAuthTokenRequestBody = {
  refreshToken: string;
};
type ApiApiHomeUserPassportrefreshAuthTokenResponseBody = paths[ApiApiHomeUserPassportrefreshAuthTokenPath][ApiApiHomeUserPassportrefreshAuthTokenMethod]['responses']['200']['content']['application/json']['data'];
/** HomeUserPassport_createPassportJwtFromOauthCode */
declare const ApiApiHomeUserPassportcreatePassportJwtFromOauthCodePath = "/api/home/user/passport/createPassportJwtFromOauthCode";
type ApiApiHomeUserPassportcreatePassportJwtFromOauthCodePath = '/api/home/user/passport/createPassportJwtFromOauthCode';
type ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeMethod = 'post';
type ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeRequestBody = {
  code: string;
};
type ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeResponseBody = paths[ApiApiHomeUserPassportcreatePassportJwtFromOauthCodePath][ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeMethod]['responses']['200']['content']['application/json']['data'];
/** HomeUserPassport_createTempAuthToken */
declare const ApiApiHomeUserPassportcreateTempAuthTokenPath = "/api/home/user/passport/createTempAuthToken";
type ApiApiHomeUserPassportcreateTempAuthTokenPath = '/api/home/user/passport/createTempAuthToken';
type ApiApiHomeUserPassportcreateTempAuthTokenMethod = 'post';
type ApiApiHomeUserPassportcreateTempAuthTokenRequestQuery = paths[ApiApiHomeUserPassportcreateTempAuthTokenPath][ApiApiHomeUserPassportcreateTempAuthTokenMethod]['parameters']['query'];
type ApiApiHomeUserPassportcreateTempAuthTokenResponseBody = paths[ApiApiHomeUserPassportcreateTempAuthTokenPath][ApiApiHomeUserPassportcreateTempAuthTokenMethod]['responses']['200']['content']['application/json']['data'];
declare class ApiHomeUserPassport extends BeanApiBase {
  current(options?: IApiActionOptions): Promise<{
    user: components['schemas']['home-user.entity.user'];
    auth: components['schemas']['a-auth.dto.auth'];
    roles: components['schemas']['home-user.entity.role'][];
  } | undefined>;
  logout(body?: undefined, options?: IApiActionOptions): Promise<unknown>;
  register(body: ApiApiHomeUserPassportregisterRequestBody, options?: IApiActionOptions): Promise<{
    passport: components['schemas']['home-user.dto.passport'];
    jwt: components['schemas']['a-jwt.dto.jwtToken'];
  }>;
  login(body: ApiApiHomeUserPassportloginRequestBody, options?: IApiActionOptions): Promise<{
    passport: components['schemas']['home-user.dto.passport'];
    jwt: components['schemas']['a-jwt.dto.jwtToken'];
  }>;
  loginOauth(options: {
    params: ApiApiHomeUserPassportloginOauthRequestParams;
    query?: ApiApiHomeUserPassportloginOauthRequestQuery;
  } & IApiActionOptions): Promise<unknown>;
  associate(options: {
    params: ApiApiHomeUserPassportassociateRequestParams;
    query?: ApiApiHomeUserPassportassociateRequestQuery;
  } & IApiActionOptions): Promise<{
    passport: components['schemas']['home-user.dto.passport'];
    jwt: components['schemas']['a-jwt.dto.jwtToken'];
  }>;
  migrate(options: {
    params: ApiApiHomeUserPassportmigrateRequestParams;
    query?: ApiApiHomeUserPassportmigrateRequestQuery;
  } & IApiActionOptions): Promise<{
    passport: components['schemas']['home-user.dto.passport'];
    jwt: components['schemas']['a-jwt.dto.jwtToken'];
  }>;
  refreshAuthToken(body: ApiApiHomeUserPassportrefreshAuthTokenRequestBody, options?: IApiActionOptions): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }>;
  createPassportJwtFromOauthCode(body: ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeRequestBody, options?: IApiActionOptions): Promise<{
    passport: components['schemas']['home-user.dto.passport'];
    jwt: components['schemas']['a-jwt.dto.jwtToken'];
  }>;
  createTempAuthToken(body?: undefined, options?: {
    query?: ApiApiHomeUserPassportcreateTempAuthTokenRequestQuery;
  } & IApiActionOptions): Promise<string>;
}
//#endregion
//#region src/suite/a-home/modules/home-api/src/api/testSsrToolOne.d.ts
/** TestSsrToolOne_testGet */
declare const ApiApiTestSsrToolOnetestGetPath = "/api/test/ssr/toolOne/test/{id?}";
type ApiApiTestSsrToolOnetestGetPath = '/api/test/ssr/toolOne/test/{id?}';
type ApiApiTestSsrToolOnetestGetMethod = 'get';
type ApiApiTestSsrToolOnetestGetRequestParams = paths[ApiApiTestSsrToolOnetestGetPath][ApiApiTestSsrToolOnetestGetMethod]['parameters']['path'];
type ApiApiTestSsrToolOnetestGetRequestQuery = paths[ApiApiTestSsrToolOnetestGetPath][ApiApiTestSsrToolOnetestGetMethod]['parameters']['query'];
type ApiApiTestSsrToolOnetestGetResponseBody = paths[ApiApiTestSsrToolOnetestGetPath][ApiApiTestSsrToolOnetestGetMethod]['responses']['200']['content']['application/json']['data'];
/** TestSsrToolOne_test */
declare const ApiApiTestSsrToolOnetestPath = "/api/test/ssr/toolOne/test/{id?}";
type ApiApiTestSsrToolOnetestPath = '/api/test/ssr/toolOne/test/{id?}';
type ApiApiTestSsrToolOnetestMethod = 'post';
type ApiApiTestSsrToolOnetestRequestParams = paths[ApiApiTestSsrToolOnetestPath][ApiApiTestSsrToolOnetestMethod]['parameters']['path'];
type ApiApiTestSsrToolOnetestRequestQuery = paths[ApiApiTestSsrToolOnetestPath][ApiApiTestSsrToolOnetestMethod]['parameters']['query'];
type ApiApiTestSsrToolOnetestRequestBody = components['schemas']['test-ssr.dto.testBody'];
type ApiApiTestSsrToolOnetestResponseBody = paths[ApiApiTestSsrToolOnetestPath][ApiApiTestSsrToolOnetestMethod]['responses']['200']['content']['application/json']['data'];
declare class ApiTestSsrToolOne extends BeanApiBase {
  testGet(options: {
    params: ApiApiTestSsrToolOnetestGetRequestParams;
    query: ApiApiTestSsrToolOnetestGetRequestQuery;
  } & IApiActionOptions): Promise<unknown>;
  test(body: ApiApiTestSsrToolOnetestRequestBody, options: {
    params: ApiApiTestSsrToolOnetestRequestParams;
    query: ApiApiTestSsrToolOnetestRequestQuery;
  } & IApiActionOptions): Promise<{
    id: number | string;
    name?: string;
    married: boolean;
    details: components['schemas']['test-ssr.dto.testDetail'][];
    _custom1?: string | undefined;
    _custom2?: string | undefined;
    _custom3?: string | undefined;
    _custom4?: string | undefined;
    _custom5?: string | undefined;
    _customCopy?: string | undefined;
    _customCopied?: boolean | undefined;
  }>;
}
//#endregion
//#region src/suite/a-home/modules/home-api/src/apiSchema/captcha.d.ts
declare class ApiSchemaCaptcha extends BeanBase {
  create(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
  refresh(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
  verifyImmediate(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
}
//#endregion
//#region src/suite/a-home/modules/home-api/src/apiSchema/home.d.ts
declare class ApiSchemaHome extends BeanBase {
  index(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
}
//#endregion
//#region src/suite/a-home/modules/home-api/src/apiSchema/homeBaseMenu.d.ts
declare class ApiSchemaHomeBaseMenu extends BeanBase {
  retrieveMenus(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
}
//#endregion
//#region src/suite/a-home/modules/home-api/src/apiSchema/homeBasePermission.d.ts
declare class ApiSchemaHomeBasePermission extends BeanBase {
  retrievePermissions(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
}
//#endregion
//#region src/suite/a-home/modules/home-api/src/apiSchema/homeUserPassport.d.ts
declare class ApiSchemaHomeUserPassport extends BeanBase {
  current(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
  logout(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
  register(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
  login(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
  loginOauth(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
  associate(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
  migrate(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
  refreshAuthToken(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
  createPassportJwtFromOauthCode(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
  createTempAuthToken(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
}
//#endregion
//#region src/suite/a-home/modules/home-api/src/apiSchema/testSsrToolOne.d.ts
declare class ApiSchemaTestSsrToolOne extends BeanBase {
  testGet(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
  test(options?: IApiSchemaOptions): _$zova_module_a_openapi0.IOpenapiSchemas;
}
//#endregion
//#region src/suite/a-home/modules/home-api/src/service/jwtAdapter.d.ts
declare class ServiceJwtAdapter extends BeanBase implements IJwtAdapter {
  protected __init__(): Promise<void>;
  getJwtInfo(): Promise<IJwtInfo | undefined>;
  refreshAuthToken(refreshToken: string): Promise<IJwtInfo>;
}
//#endregion
//#region src/suite/a-home/modules/home-api/src/.metadata/index.d.ts
declare module 'zova' {}
declare module 'zova-module-home-api' {
  interface ApiCaptcha {}
  interface ApiCaptcha {
    get $beanFullName(): 'home-api.api.captcha';
    get $onionName(): 'home-api:captcha';
  }
  interface ApiHome {}
  interface ApiHome {
    get $beanFullName(): 'home-api.api.home';
    get $onionName(): 'home-api:home';
  }
  interface ApiHomeBaseMenu {}
  interface ApiHomeBaseMenu {
    get $beanFullName(): 'home-api.api.homeBaseMenu';
    get $onionName(): 'home-api:homeBaseMenu';
  }
  interface ApiHomeBasePermission {}
  interface ApiHomeBasePermission {
    get $beanFullName(): 'home-api.api.homeBasePermission';
    get $onionName(): 'home-api:homeBasePermission';
  }
  interface ApiHomeUserPassport {}
  interface ApiHomeUserPassport {
    get $beanFullName(): 'home-api.api.homeUserPassport';
    get $onionName(): 'home-api:homeUserPassport';
  }
  interface ApiTestSsrToolOne {}
  interface ApiTestSsrToolOne {
    get $beanFullName(): 'home-api.api.testSsrToolOne';
    get $onionName(): 'home-api:testSsrToolOne';
  }
}
/** api: end */
/** api: begin */
interface IModuleApi$1 {
  'captcha': ApiCaptcha;
  'home': ApiHome;
  'homeBaseMenu': ApiHomeBaseMenu;
  'homeBasePermission': ApiHomeBasePermission;
  'homeUserPassport': ApiHomeUserPassport;
  'testSsrToolOne': ApiTestSsrToolOne;
}
declare module 'zova' {
  interface IBeanRecordGeneral {
    'home-api.api.captcha': ApiCaptcha;
    'home-api.api.home': ApiHome;
    'home-api.api.homeBaseMenu': ApiHomeBaseMenu;
    'home-api.api.homeBasePermission': ApiHomeBasePermission;
    'home-api.api.homeUserPassport': ApiHomeUserPassport;
    'home-api.api.testSsrToolOne': ApiTestSsrToolOne;
  }
}
/** api: end */
/** openapi: begin */
declare module 'zova' {}
declare module 'zova-module-home-api' {
  interface ApiSchemaCaptcha {}
  interface ApiSchemaCaptcha {
    get $beanFullName(): 'home-api.apiSchema.captcha';
    get $onionName(): 'home-api:captcha';
  }
  interface ApiSchemaHome {}
  interface ApiSchemaHome {
    get $beanFullName(): 'home-api.apiSchema.home';
    get $onionName(): 'home-api:home';
  }
  interface ApiSchemaHomeBaseMenu {}
  interface ApiSchemaHomeBaseMenu {
    get $beanFullName(): 'home-api.apiSchema.homeBaseMenu';
    get $onionName(): 'home-api:homeBaseMenu';
  }
  interface ApiSchemaHomeBasePermission {}
  interface ApiSchemaHomeBasePermission {
    get $beanFullName(): 'home-api.apiSchema.homeBasePermission';
    get $onionName(): 'home-api:homeBasePermission';
  }
  interface ApiSchemaHomeUserPassport {}
  interface ApiSchemaHomeUserPassport {
    get $beanFullName(): 'home-api.apiSchema.homeUserPassport';
    get $onionName(): 'home-api:homeUserPassport';
  }
  interface ApiSchemaTestSsrToolOne {}
  interface ApiSchemaTestSsrToolOne {
    get $beanFullName(): 'home-api.apiSchema.testSsrToolOne';
    get $onionName(): 'home-api:testSsrToolOne';
  }
}
/** apiSchema: end */
/** apiSchema: begin */
interface IModuleApiSchema {
  'captcha': ApiSchemaCaptcha;
  'home': ApiSchemaHome;
  'homeBaseMenu': ApiSchemaHomeBaseMenu;
  'homeBasePermission': ApiSchemaHomeBasePermission;
  'homeUserPassport': ApiSchemaHomeUserPassport;
  'testSsrToolOne': ApiSchemaTestSsrToolOne;
}
declare module 'zova' {
  interface IBeanRecordGeneral {
    'home-api.apiSchema.captcha': ApiSchemaCaptcha;
    'home-api.apiSchema.home': ApiSchemaHome;
    'home-api.apiSchema.homeBaseMenu': ApiSchemaHomeBaseMenu;
    'home-api.apiSchema.homeBasePermission': ApiSchemaHomeBasePermission;
    'home-api.apiSchema.homeUserPassport': ApiSchemaHomeUserPassport;
    'home-api.apiSchema.testSsrToolOne': ApiSchemaTestSsrToolOne;
  }
}
/** apiSchema: end */
/** service: begin */
declare module 'zova-module-a-bean' {
  interface IServiceRecord {
    'home-api:jwtAdapter': never;
  }
}
declare module 'zova-module-home-api' {
  interface ServiceJwtAdapter {}
  interface ServiceJwtAdapter {
    get $beanFullName(): 'home-api.service.jwtAdapter';
    get $onionName(): 'home-api:jwtAdapter';
  }
}
/** service: end */
/** service: begin */
declare module 'zova' {
  interface IBeanRecordGeneral {
    'home-api.service.jwtAdapter': ServiceJwtAdapter;
  }
}
/** service: end */
/** scope: begin */
declare class ScopeModuleHomeApi extends BeanScopeBase {}
interface ScopeModuleHomeApi {
  util: BeanScopeUtil;
  api: IModuleApi$1;
  apiSchema: IModuleApiSchema;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'home-api': ScopeModuleHomeApi;
  }
}
/** scope: end */
//#endregion
//#region src/suite/a-home/modules/home-api/src/types/api.d.ts
declare module 'zova' {
  interface BeanBase {
    $api: IModuleApi$1;
    $apiSchema: IModuleApiSchema;
  }
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/model/test.d.ts
interface IModelOptionsTest extends IDecoratorModelOptions {}
declare class ModelTest extends BeanModelBase {
  test(): _$vue.UnwrapNestedRefs<_$_tanstack_vue_query0.UseQueryReturnType<{
    id: number | string;
    name?: string;
    married: boolean;
    details: components['schemas']['test-ssr.dto.testDetail'][];
    _custom1?: string | undefined;
    _custom2?: string | undefined;
    _custom3?: string | undefined;
    _custom4?: string | undefined;
    _custom5?: string | undefined;
    _customCopy?: string | undefined;
    _customCopied?: boolean | undefined;
  }, Error>>;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/component/actionView/controller.d.ts
interface ControllerActionViewProps {
  onClick?: () => void;
}
declare class ControllerActionView extends BeanControllerBase {
  static $propsDefault: {};
  $$renderContext: IJsxRenderContextTableCell;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/component/card/controller.d.ts
interface ControllerCardProps {
  header?: string;
  content?: string;
  footer?: string;
  onReset?: (time: Date) => void;
  slotHeader?: ISlot;
  slotFooter?: ISlot;
}
declare class ControllerCard extends BeanControllerBase {
  static $propsDefault: {
    header: string;
  };
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/component/formFieldTest/controller.d.ts
interface ControllerFormFieldTestProps extends IFormFieldComponentOptions {
  showLog?: boolean;
  slotHeader?: (scope: {
    name: string;
  }) => VNode;
  slotFooter?: (scope: {
    name: string;
  }) => VNode;
}
declare class ControllerFormFieldTest extends BeanControllerBase {
  static $propsDefault: {};
  static $componentOptions: IComponentOptions;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/component/tableCellTest/controller.d.ts
interface ControllerTableCellTestProps {
  showLog?: boolean;
  slotHeader?: (scope: {
    name: string;
  }) => VNode;
  slotFooter?: (scope: {
    name: string;
  }) => VNode;
}
declare class ControllerTableCellTest extends BeanControllerBase {
  static $propsDefault: {};
  $$renderContext: IJsxRenderContextTableCell;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/page/component/controller.d.ts
declare class ControllerPageComponent extends BeanControllerPageBase {
  resetTime: Date;
  cardRef?: ControllerCard;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/page/locale/controller.d.ts
declare class ControllerPageLocale extends BeanControllerPageBase {
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/page/routeParams/controller.d.ts
declare const ControllerPageRouteParamsSchemaParams: z.ZodObject<{
  id: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
declare const ControllerPageRouteParamsSchemaQuery: z.ZodObject<{}, z.core.$strip>;
declare class ControllerPageRouteParams extends BeanControllerPageBase {
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/page/routeQuery/controller.d.ts
declare const ControllerPageRouteQuerySchemaParams: z.ZodObject<{}, z.core.$strip>;
declare const ControllerPageRouteQuerySchemaQuery: z.ZodObject<{
  name: z.ZodOptional<z.ZodString>;
  age: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
declare class ControllerPageRouteQuery extends BeanControllerPageBase {
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/page/routeQueryB/controller.d.ts
declare const ControllerPageRouteQueryBSchemaParams: z.ZodObject<{}, z.core.$strip>;
declare const ControllerPageRouteQueryBSchemaQuery: z.ZodObject<{
  tabName: z.ZodDefault<z.ZodOptional<z.ZodString>>;
  private: z.ZodOptional<z.ZodBoolean>;
  user: z.ZodOptional<z.ZodObject<{
    name: z.ZodString;
    age: z.ZodNumber;
  }, z.core.$strip>>;
  todos: z.ZodOptional<z.ZodArray<z.ZodObject<{
    title: z.ZodString;
    done: z.ZodBoolean;
  }, z.core.$strip>>>;
}, z.core.$strip>;
declare class ControllerPageRouteQueryB extends BeanControllerPageBase {
  togglePrivate(): void;
  toggleUser(): void;
  toggleTodos(): void;
  toggleTab(event: any, tabName: string): void;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/page/state/controller.d.ts
declare class ControllerPageState extends BeanControllerPageBase {
  count: number;
  count2: string;
  protected __init__(): Promise<void>;
  increment(): void;
  decrement(): void;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/page/style/controller.d.ts
declare class ControllerPageStyle extends BeanControllerPageBase {
  active: boolean;
  cTextColor: string;
  cBlock: string;
  renderHello: any;
  renderHello2: any;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/page/toolOne/controller.d.ts
declare const ControllerPageToolOneSchemaParams: z.ZodObject<{
  id: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
declare const ControllerPageToolOneSchemaQuery: z.ZodObject<{
  name: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare class ControllerPageToolOne$1 extends BeanControllerPageFormBase {
  schemaUpdate?: SchemaObject;
  $$modelTest: ModelTest;
  controllerForm: ControllerForm;
  fieldName: string;
  formData: ApiSchemaTestSsrDtoTestBodyPartial;
  formMeta: IFormMeta;
  protected __init__(): Promise<void>;
  submitData(data: TypeFormOnSubmitData<ApiSchemaTestSsrDtoTestBodyPartial>): Promise<void>;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/page/toolTwo/controller.d.ts
declare const ControllerPageToolTwoSchemaParams: z.ZodObject<{
  id: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
declare const ControllerPageToolTwoSchemaQuery: z.ZodObject<{
  name: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare class ControllerPageToolTwo extends BeanControllerPageBase {
  $$modelPageData: ModelPageData<ApiSchemaTestSsrDtoTestResult | undefined>;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/.metadata/page/component.d.ts
declare const ZPageComponent: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/.metadata/page/locale.d.ts
declare const ZPageLocale: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/.metadata/page/routeParams.d.ts
declare namespace NSControllerPageRouteParams {
  const paramsSchema: z.ZodObject<{
    id: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
  }, z.core.$strip>;
  type ParamsInput = z.input<typeof ControllerPageRouteParamsSchemaParams>;
  type ParamsOutput = z.output<typeof ControllerPageRouteParamsSchemaParams>;
  const querySchema: z.ZodObject<{}, z.core.$strip>;
  type QueryInput = z.input<typeof ControllerPageRouteParamsSchemaQuery>;
  type QueryOutput = z.output<typeof ControllerPageRouteParamsSchemaQuery>;
}
declare const ZPageRouteParams: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/.metadata/page/routeQuery.d.ts
declare namespace NSControllerPageRouteQuery {
  const paramsSchema: z.ZodObject<{}, z.core.$strip>;
  type ParamsInput = z.input<typeof ControllerPageRouteQuerySchemaParams>;
  type ParamsOutput = z.output<typeof ControllerPageRouteQuerySchemaParams>;
  const querySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    age: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strip>;
  type QueryInput = z.input<typeof ControllerPageRouteQuerySchemaQuery>;
  type QueryOutput = z.output<typeof ControllerPageRouteQuerySchemaQuery>;
}
declare const ZPageRouteQuery: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/.metadata/page/routeQueryB.d.ts
declare namespace NSControllerPageRouteQueryB {
  const paramsSchema: z.ZodObject<{}, z.core.$strip>;
  type ParamsInput = z.input<typeof ControllerPageRouteQueryBSchemaParams>;
  type ParamsOutput = z.output<typeof ControllerPageRouteQueryBSchemaParams>;
  const querySchema: z.ZodObject<{
    tabName: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    private: z.ZodOptional<z.ZodBoolean>;
    user: z.ZodOptional<z.ZodObject<{
      name: z.ZodString;
      age: z.ZodNumber;
    }, z.core.$strip>>;
    todos: z.ZodOptional<z.ZodArray<z.ZodObject<{
      title: z.ZodString;
      done: z.ZodBoolean;
    }, z.core.$strip>>>;
  }, z.core.$strip>;
  type QueryInput = z.input<typeof ControllerPageRouteQueryBSchemaQuery>;
  type QueryOutput = z.output<typeof ControllerPageRouteQueryBSchemaQuery>;
}
declare const ZPageRouteQueryB: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/.metadata/page/state.d.ts
declare const ZPageState: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/.metadata/page/style.d.ts
declare const ZPageStyle: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/.metadata/page/toolOne.d.ts
declare namespace NSControllerPageToolOne {
  const paramsSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strip>;
  type ParamsInput = z.input<typeof ControllerPageToolOneSchemaParams>;
  type ParamsOutput = z.output<typeof ControllerPageToolOneSchemaParams>;
  const querySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
  type QueryInput = z.input<typeof ControllerPageToolOneSchemaQuery>;
  type QueryOutput = z.output<typeof ControllerPageToolOneSchemaQuery>;
}
declare module 'zova-module-demo-basic' {
  interface RenderPageToolOne extends ControllerPageToolOne {}
}
declare const ZPageToolOne: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/.metadata/page/toolTwo.d.ts
declare namespace NSControllerPageToolTwo {
  const paramsSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strip>;
  type ParamsInput = z.input<typeof ControllerPageToolTwoSchemaParams>;
  type ParamsOutput = z.output<typeof ControllerPageToolTwoSchemaParams>;
  const querySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
  type QueryInput = z.input<typeof ControllerPageToolTwoSchemaQuery>;
  type QueryOutput = z.output<typeof ControllerPageToolTwoSchemaQuery>;
}
declare const ZPageToolTwo: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/.metadata/component/actionView.d.ts
type ZActionViewProps = {
  controllerRef?: (ref: ControllerActionView) => void;
} & ControllerActionViewProps;
type ControllerInnerProps$28 = TypeControllerInnerProps<ControllerActionViewProps, keyof typeof ControllerActionView.$propsDefault>;
declare module 'zova-module-demo-basic' {
  interface ControllerActionView {
    $props: ControllerInnerProps$28;
  }
}
declare const ZActionView: _$vue.DefineSetupFnComponent<ZActionViewProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerActionView) => void;
} & ControllerActionViewProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'demo-basic:actionView': ControllerActionViewProps;
  }
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/.metadata/component/card.d.ts
type ZCardProps = {
  controllerRef?: (ref: ControllerCard) => void;
} & ControllerCardProps;
type ControllerInnerProps$27 = TypeControllerInnerProps<ControllerCardProps, keyof typeof ControllerCard.$propsDefault>;
declare module 'zova-module-demo-basic' {
  interface ControllerCard {
    $props: ControllerInnerProps$27;
  }
}
declare const ZCard: _$vue.DefineSetupFnComponent<ZCardProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerCard) => void;
} & ControllerCardProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'demo-basic:card': ControllerCardProps;
  }
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/.metadata/component/formFieldTest.d.ts
type ZFormFieldTestProps = {
  controllerRef?: (ref: ControllerFormFieldTest) => void;
} & ControllerFormFieldTestProps;
type ControllerInnerProps$26 = TypeControllerInnerProps<ControllerFormFieldTestProps, keyof typeof ControllerFormFieldTest.$propsDefault>;
declare module 'zova-module-demo-basic' {
  interface ControllerFormFieldTest {
    $props: ControllerInnerProps$26;
  }
}
declare const ZFormFieldTest: _$vue.DefineSetupFnComponent<ZFormFieldTestProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerFormFieldTest) => void;
} & ControllerFormFieldTestProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'demo-basic:formFieldTest': ControllerFormFieldTestProps;
  }
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/.metadata/component/tableCellTest.d.ts
type ZTableCellTestProps = {
  controllerRef?: (ref: ControllerTableCellTest) => void;
} & ControllerTableCellTestProps;
type ControllerInnerProps$25 = TypeControllerInnerProps<ControllerTableCellTestProps, keyof typeof ControllerTableCellTest.$propsDefault>;
declare module 'zova-module-demo-basic' {
  interface ControllerTableCellTest {
    $props: ControllerInnerProps$25;
  }
}
declare const ZTableCellTest: _$vue.DefineSetupFnComponent<ZTableCellTestProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerTableCellTest) => void;
} & ControllerTableCellTestProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'demo-basic:tableCellTest': ControllerTableCellTestProps;
  }
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/page/toolOne/render.d.ts
declare class RenderPageToolOne extends BeanRenderBase {
  private _renderAuto;
  private _renderManual;
  render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-home/modules/home-index/src/page/home/controller.d.ts
declare class ControllerPageHome extends BeanControllerPageBase {
  message: string;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-home/modules/home-index/src/.metadata/page/home.d.ts
declare const ZPageHome: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/suite/a-home/modules/home-index/src/.metadata/index.d.ts
declare module 'zova' {}
declare module 'zova-module-home-index' {
  interface ControllerPageHome {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'home-index.controller.pageHome': ControllerPageHome;
  }
}
/** controller: end */
/** pages: begin */
declare module 'zova-module-a-router' {
  interface IPagePathRecord {
    '/home/index': TypePagePathSchema<undefined, undefined>;
  }
  interface IPageNameRecord {}
}
declare module 'zova-module-home-index' {}
/** pages: end */
/** scope: begin */
declare class ScopeModuleHomeIndex extends BeanScopeBase {}
interface ScopeModuleHomeIndex {
  util: BeanScopeUtil;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'home-index': ScopeModuleHomeIndex;
  }
}
/** scope: end */
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/bean/aop.home.d.ts
declare class AopHome extends BeanAopBase {
  protected __init__: AopActionInit<ControllerPageHome>;
  protected __dispose__: AopActionDispose<ControllerPageHome>;
  protected render: AopActionRender<ControllerPageHome>;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/bean/aop.home3.d.ts
declare class AopHome3 extends BeanAopBase {
  protected render: AopActionRender<ControllerPageHome>;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/bean/behavior.formFieldLayout.d.ts
interface IBehaviorPropsInputFormFieldLayout$1 {}
interface IBehaviorPropsOutputFormFieldLayout$1 {}
interface IBehaviorOptionsFormFieldLayout$1 extends IDecoratorBehaviorOptions {}
declare class BehaviorFormFieldLayout$1 extends BeanBehaviorBase<IBehaviorOptionsFormFieldLayout$1, IBehaviorPropsInputFormFieldLayout$1, IBehaviorPropsOutputFormFieldLayout$1> {
  $$formField: ControllerFormField;
  protected render(renderContext: IFormFieldRenderContext, next: NextBehavior<IBehaviorPropsOutputFormFieldLayout$1>): VNode;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/bean/tableCell.test.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceTableCellRecord {
    'demo-basic:test'?: ITableCellOptionsTest;
  }
}
interface ITableCellOptionsTest extends IResourceTableCellOptionsBase {
  iconPrefix?: string;
}
declare class TableCellTest extends BeanBase implements ITableCellRender {
  render(options: ITableCellOptionsTest, _renderContext: IJsxRenderContextTableCell, next: NextTableCellRender): any;
}
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/.metadata/locales.d.ts
declare const locales$8: {
  'en-us': {
    HelloWorld: string;
    ChangeLanguage: string;
    YourName: string;
    Submit: string;
  };
  'zh-cn': {
    HelloWorld: string;
    ChangeLanguage: string;
    YourName: string;
    Submit: string;
  };
};
//#endregion
//#region src/suite/a-demo/modules/demo-basic/src/.metadata/index.d.ts
declare module 'zova-module-a-model' {
  interface IModelRecord {
    'demo-basic:test': IModelOptionsTest;
  }
}
declare module 'zova-module-demo-basic' {
  interface ModelTest {}
  interface ModelTest {
    get $beanFullName(): 'demo-basic.model.test';
    get $onionName(): 'demo-basic:test';
    get $onionOptions(): IModelOptionsTest;
  }
}
/** model: end */
/** model: begin */
declare module 'zova' {
  interface IBeanRecordGeneral {
    'demo-basic.model.test': ModelTest;
  }
}
/** model: end */
/** controller: begin */
declare module 'zova' {}
declare module 'zova-module-demo-basic' {
  interface ControllerActionView {}
  interface ControllerCard {}
  interface ControllerFormFieldTest {}
  interface ControllerTableCellTest {}
  interface ControllerPageComponent {}
  interface ControllerPageLocale {}
  interface ControllerPageRouteParams {}
  interface ControllerPageRouteQuery {}
  interface ControllerPageRouteQueryB {}
  interface ControllerPageState {}
  interface ControllerPageStyle {}
  interface ControllerPageToolOne {}
  interface ControllerPageToolTwo {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
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
    'demo-basic.controller.pageToolOne': ControllerPageToolOne$1;
    'demo-basic.controller.pageToolTwo': ControllerPageToolTwo;
  }
}
/** controller: end */
/** pages: begin */
declare module 'zova-module-a-router' {
  interface IPagePathRecord {
    '/demo/basic/component': TypePagePathSchema<undefined, undefined>;
    '/demo/basic/locale': TypePagePathSchema<undefined, undefined>;
    '/demo/basic/routeParams/:id?': TypePagePathSchema<NSControllerPageRouteParams.ParamsInput, NSControllerPageRouteParams.QueryInput>;
    '/demo/basic/routeQuery': TypePagePathSchema<NSControllerPageRouteQuery.ParamsInput, NSControllerPageRouteQuery.QueryInput>;
    '/demo/basic/routeQueryB': TypePagePathSchema<NSControllerPageRouteQueryB.ParamsInput, NSControllerPageRouteQueryB.QueryInput>;
    '/demo/basic/state': TypePagePathSchema<undefined, undefined>;
    '/demo/basic/style': TypePagePathSchema<undefined, undefined>;
    '/demo/basic/toolOne/:id?': TypePagePathSchema<NSControllerPageToolOne.ParamsInput, NSControllerPageToolOne.QueryInput>;
    '/demo/basic/toolTwo/:id?': TypePagePathSchema<NSControllerPageToolTwo.ParamsInput, NSControllerPageToolTwo.QueryInput>;
  }
  interface IPageNameRecord {
    'demo-basic:routeParams': undefined;
    'demo-basic:toolOne': undefined;
    'demo-basic:toolTwo': undefined;
  }
}
declare module 'zova-module-demo-basic' {
  interface ControllerPageRouteParams {
    $params: NSControllerPageRouteParams.ParamsOutput;
    $query: NSControllerPageRouteParams.QueryOutput;
  }
  interface ControllerPageRouteQuery {
    $params: NSControllerPageRouteQuery.ParamsOutput;
    $query: NSControllerPageRouteQuery.QueryOutput;
  }
  interface ControllerPageRouteQueryB {
    $params: NSControllerPageRouteQueryB.ParamsOutput;
    $query: NSControllerPageRouteQueryB.QueryOutput;
  }
  interface ControllerPageToolOne {
    $params: NSControllerPageToolOne.ParamsOutput;
    $query: NSControllerPageToolOne.QueryOutput;
  }
  interface ControllerPageToolTwo {
    $params: NSControllerPageToolTwo.ParamsOutput;
    $query: NSControllerPageToolTwo.QueryOutput;
  }
}
/** pages: end */
/** components: begin */
declare module 'zova' {
  interface IComponentRecord {
    'demo-basic:actionView': ControllerActionView;
    'demo-basic:card': ControllerCard;
    'demo-basic:formFieldTest': ControllerFormFieldTest;
    'demo-basic:tableCellTest': ControllerTableCellTest;
  }
  interface IZovaComponentRecord {
    'demo-basic:actionView': typeof ZActionView;
    'demo-basic:card': typeof ZCard;
    'demo-basic:formFieldTest': typeof ZFormFieldTest;
    'demo-basic:tableCellTest': typeof ZTableCellTest;
  }
}
/** components: end */
/** render: begin */
declare module 'zova' {}
declare module 'zova-module-demo-basic' {
  interface RenderPageToolOne {}
}
/** render: end */
/** render: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'demo-basic.render.pageToolOne': RenderPageToolOne;
  }
}
/** render: end */
/** aop: begin */
declare module 'zova-module-a-bean' {
  interface IAopRecord {
    'demo-basic:home': IDecoratorAopOptions;
    'demo-basic:home3': IDecoratorAopOptions;
  }
}
declare module 'zova-module-demo-basic' {
  interface AopHome {}
  interface AopHome {
    get $beanFullName(): 'demo-basic.aop.home';
    get $onionName(): 'demo-basic:home';
    get $onionOptions(): IDecoratorAopOptions;
  }
  interface AopHome3 {}
  interface AopHome3 {
    get $beanFullName(): 'demo-basic.aop.home3';
    get $onionName(): 'demo-basic:home3';
    get $onionOptions(): IDecoratorAopOptions;
  }
}
/** aop: end */
/** aop: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'demo-basic.aop.home': AopHome;
    'demo-basic.aop.home3': AopHome3;
  }
}
/** aop: end */
/** behavior: begin */
declare module 'zova-module-a-behavior' {
  interface IBehaviorRecord {
    'demo-basic:formFieldLayout': IBehaviorOptionsFormFieldLayout$1;
  }
}
declare module 'zova-module-demo-basic' {
  interface BehaviorFormFieldLayout {}
  interface BehaviorFormFieldLayout {
    get $beanFullName(): 'demo-basic.behavior.formFieldLayout';
    get $onionName(): 'demo-basic:formFieldLayout';
    get $onionOptions(): IBehaviorOptionsFormFieldLayout$1;
  }
}
/** behavior: end */
/** behavior: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'demo-basic.behavior.formFieldLayout': BehaviorFormFieldLayout$1;
  }
}
/** behavior: end */
/** behaviors: begin */
declare module 'vue' {
  interface InputHTMLAttributes {
    'bs-demo-basic-formFieldLayout'?: IBehaviorOptionsFormFieldLayout$1 | '' | boolean;
  }
}
declare module 'vue/jsx-runtime' {
  namespace JSX {
    interface IntrinsicAttributes {
      'bs-demo-basic-formFieldLayout'?: IBehaviorOptionsFormFieldLayout$1 | '' | boolean;
    }
  }
}
/** behaviors: end */
/** tableCell: begin */
declare module 'zova-module-a-table' {
  interface ITableCellRecord {
    'demo-basic:test': ITableCellOptionsTest;
  }
}
declare module 'zova-module-demo-basic' {
  interface TableCellTest {}
  interface TableCellTest {
    get $beanFullName(): 'demo-basic.tableCell.test';
    get $onionName(): 'demo-basic:test';
    get $onionOptions(): ITableCellOptionsTest;
  }
}
/** tableCell: end */
/** tableCell: begin */
declare module 'zova' {
  interface IBeanRecordGeneral {
    'demo-basic.tableCell.test': TableCellTest;
  }
}
/** tableCell: end */
/** locale: begin */
declare class ScopeModuleDemoBasic extends BeanScopeBase {}
interface ScopeModuleDemoBasic {
  util: BeanScopeUtil;
  locale: TypeModuleLocales<(typeof locales$8)[TypeLocaleBase]>;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'demo-basic': ScopeModuleDemoBasic;
  }
  interface IBeanScopeLocale {
    'demo-basic': (typeof locales$8)[TypeLocaleBase];
  }
}
//#endregion
//#region src/suite/a-demo/modules/demo-todo/src/model/todo.d.ts
interface IModelOptionsTodo extends IDecoratorModelOptions {}
declare class ModelTodo extends BeanModelBase {
  findAll(): _$vue.UnwrapNestedRefs<_$_tanstack_vue_query0.UseQueryReturnType<ApiTodoEntity[], Error>>;
  findOne(id?: string): {
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isEnabled: boolean;
    refetch: (options?: _$_tanstack_query_core0.RefetchOptions) => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
    fetchStatus: _$_tanstack_query_core0.FetchStatus;
    promise: Promise<ApiTodoEntity>;
    data: undefined;
    error: Error;
    isError: true;
    isPending: false;
    isLoading: false;
    isLoadingError: true;
    isRefetchError: false;
    isSuccess: false;
    isPlaceholderData: false;
    status: 'error';
    suspense: () => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
  } | {
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isLoading: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isEnabled: boolean;
    refetch: (options?: _$_tanstack_query_core0.RefetchOptions) => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
    fetchStatus: _$_tanstack_query_core0.FetchStatus;
    promise: Promise<ApiTodoEntity>;
    data: undefined;
    error: null;
    isError: false;
    isPending: true;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: false;
    isPlaceholderData: false;
    status: 'pending';
    suspense: () => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
  } | {
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isEnabled: boolean;
    refetch: (options?: _$_tanstack_query_core0.RefetchOptions) => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
    fetchStatus: _$_tanstack_query_core0.FetchStatus;
    promise: Promise<ApiTodoEntity>;
    data: ApiTodoEntity;
    isError: false;
    error: null;
    isPending: false;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: true;
    isPlaceholderData: true;
    status: 'success';
    suspense: () => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
  } | {
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isEnabled: boolean;
    refetch: (options?: _$_tanstack_query_core0.RefetchOptions) => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
    fetchStatus: _$_tanstack_query_core0.FetchStatus;
    promise: Promise<ApiTodoEntity>;
    data: ApiTodoEntity;
    error: Error;
    isError: true;
    isPending: false;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: true;
    isSuccess: false;
    isPlaceholderData: false;
    status: 'error';
    suspense: () => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
  } | {
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isEnabled: boolean;
    refetch: (options?: _$_tanstack_query_core0.RefetchOptions) => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
    fetchStatus: _$_tanstack_query_core0.FetchStatus;
    promise: Promise<ApiTodoEntity>;
    data: ApiTodoEntity;
    error: null;
    isError: false;
    isPending: false;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: true;
    isPlaceholderData: false;
    status: 'success';
    suspense: () => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
  } | undefined;
  create(): _$vue.UnwrapNestedRefs<_$_tanstack_vue_query0.UseMutationReturnType<void, Error, ApiTodoEntity, unknown>>;
  update(id: string): _$vue.UnwrapNestedRefs<_$_tanstack_vue_query0.UseMutationReturnType<void, Error, ApiTodoEntity, unknown>>;
  delete(id: string): _$vue.UnwrapNestedRefs<_$_tanstack_vue_query0.UseMutationReturnType<void, Error, void, unknown>>;
}
//#endregion
//#region src/suite/a-demo/modules/demo-todo/src/api/todo.d.ts
interface ApiTodoEntity {
  id: string;
  title: string;
  done: boolean;
}
type ApiTodoIntertBody = ApiTodoEntity;
type ApiTodoUpdateBody = ApiTodoEntity;
declare class ApiTodo extends BeanApiBase {
  findAll(): Promise<ApiTodoEntity[]>;
  findOne(id: string): Promise<ApiTodoEntity>;
  create(body: ApiTodoIntertBody): Promise<void>;
  update(id: string, body: ApiTodoUpdateBody): Promise<void>;
  delete(id: string): Promise<void>;
}
//#endregion
//#region src/suite/a-demo/modules/demo-todo/src/page/item/controller.d.ts
declare const ControllerPageItemSchemaParams: z.ZodObject<{
  id: z.ZodString;
}, z.core.$strip>;
declare const ControllerPageItemSchemaQuery: z.ZodObject<{}, z.core.$strip>;
declare class ControllerPageItem extends BeanControllerPageBase {
  $$modelTodo: ModelTodo;
  currentTodoId?: string;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-demo/modules/demo-todo/src/page/todo/controller.d.ts
declare class ControllerPageTodo extends BeanControllerPageBase {
  $$modelTodo: ModelTodo;
  newTitle: string;
  currentTodoId?: string;
  protected __init__(): Promise<void>;
  get queryTodos(): _$vue.UnwrapNestedRefs<_$_tanstack_vue_query0.UseQueryReturnType<ApiTodoEntity[], Error>>;
  get queryTodoCurrent(): {
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isEnabled: boolean;
    refetch: (options?: _$_tanstack_query_core0.RefetchOptions) => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
    fetchStatus: _$_tanstack_query_core0.FetchStatus;
    promise: Promise<ApiTodoEntity>;
    data: undefined;
    error: Error;
    isError: true;
    isPending: false;
    isLoading: false;
    isLoadingError: true;
    isRefetchError: false;
    isSuccess: false;
    isPlaceholderData: false;
    status: 'error';
    suspense: () => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
  } | {
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isLoading: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isEnabled: boolean;
    refetch: (options?: _$_tanstack_query_core0.RefetchOptions) => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
    fetchStatus: _$_tanstack_query_core0.FetchStatus;
    promise: Promise<ApiTodoEntity>;
    data: undefined;
    error: null;
    isError: false;
    isPending: true;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: false;
    isPlaceholderData: false;
    status: 'pending';
    suspense: () => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
  } | {
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isEnabled: boolean;
    refetch: (options?: _$_tanstack_query_core0.RefetchOptions) => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
    fetchStatus: _$_tanstack_query_core0.FetchStatus;
    promise: Promise<ApiTodoEntity>;
    data: ApiTodoEntity;
    isError: false;
    error: null;
    isPending: false;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: true;
    isPlaceholderData: true;
    status: 'success';
    suspense: () => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
  } | {
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isEnabled: boolean;
    refetch: (options?: _$_tanstack_query_core0.RefetchOptions) => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
    fetchStatus: _$_tanstack_query_core0.FetchStatus;
    promise: Promise<ApiTodoEntity>;
    data: ApiTodoEntity;
    error: Error;
    isError: true;
    isPending: false;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: true;
    isSuccess: false;
    isPlaceholderData: false;
    status: 'error';
    suspense: () => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
  } | {
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isEnabled: boolean;
    refetch: (options?: _$_tanstack_query_core0.RefetchOptions) => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
    fetchStatus: _$_tanstack_query_core0.FetchStatus;
    promise: Promise<ApiTodoEntity>;
    data: ApiTodoEntity;
    error: null;
    isError: false;
    isPending: false;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: true;
    isPlaceholderData: false;
    status: 'success';
    suspense: () => Promise<_$_tanstack_query_core0.QueryObserverResult<ApiTodoEntity, Error>>;
  } | undefined;
  addTodo(): Promise<void>;
  completeTodo(item: ApiTodoEntity): Promise<void>;
  deleteTodo(item: ApiTodoEntity): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-demo/modules/demo-todo/src/.metadata/page/item.d.ts
declare namespace NSControllerPageItem {
  const paramsSchema: z.ZodObject<{
    id: z.ZodString;
  }, z.core.$strip>;
  type ParamsInput = z.input<typeof ControllerPageItemSchemaParams>;
  type ParamsOutput = z.output<typeof ControllerPageItemSchemaParams>;
  const querySchema: z.ZodObject<{}, z.core.$strip>;
  type QueryInput = z.input<typeof ControllerPageItemSchemaQuery>;
  type QueryOutput = z.output<typeof ControllerPageItemSchemaQuery>;
}
declare const ZPageItem: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/suite/a-demo/modules/demo-todo/src/.metadata/page/todo.d.ts
declare const ZPageTodo: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/suite/a-demo/modules/demo-todo/src/.metadata/index.d.ts
declare module 'zova-module-a-model' {
  interface IModelRecord {
    'demo-todo:todo': IModelOptionsTodo;
  }
}
declare module 'zova-module-demo-todo' {
  interface ModelTodo {}
  interface ModelTodo {
    get $beanFullName(): 'demo-todo.model.todo';
    get $onionName(): 'demo-todo:todo';
    get $onionOptions(): IModelOptionsTodo;
  }
}
/** model: end */
/** model: begin */
declare module 'zova' {
  interface IBeanRecordGeneral {
    'demo-todo.model.todo': ModelTodo;
  }
}
/** model: end */
/** api: begin */
declare module 'zova' {}
declare module 'zova-module-demo-todo' {
  interface ApiTodo {}
  interface ApiTodo {
    get $beanFullName(): 'demo-todo.api.todo';
    get $onionName(): 'demo-todo:todo';
  }
}
/** api: end */
/** api: begin */
interface IModuleApi {
  'todo': ApiTodo;
}
declare module 'zova' {
  interface IBeanRecordGeneral {
    'demo-todo.api.todo': ApiTodo;
  }
}
/** api: end */
/** openapi: begin */
/** openapi: end */
/** controller: begin */
declare module 'zova' {}
declare module 'zova-module-demo-todo' {
  interface ControllerPageItem {}
  interface ControllerPageTodo {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'demo-todo.controller.pageItem': ControllerPageItem;
    'demo-todo.controller.pageTodo': ControllerPageTodo;
  }
}
/** controller: end */
/** pages: begin */
declare module 'zova-module-a-router' {
  interface IPagePathRecord {
    '/demo/todo/item/:id': TypePagePathSchema<NSControllerPageItem.ParamsInput, NSControllerPageItem.QueryInput>;
    '/demo/todo/todo': TypePagePathSchema<undefined, undefined>;
  }
  interface IPageNameRecord {
    'demo-todo:item': undefined;
  }
}
declare module 'zova-module-demo-todo' {
  interface ControllerPageItem {
    $params: NSControllerPageItem.ParamsOutput;
    $query: NSControllerPageItem.QueryOutput;
  }
}
/** pages: end */
/** scope: begin */
declare class ScopeModuleDemoTodo extends BeanScopeBase {}
interface ScopeModuleDemoTodo {
  util: BeanScopeUtil;
  api: IModuleApi;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'demo-todo': ScopeModuleDemoTodo;
  }
}
/** scope: end */
//#endregion
//#region src/suite/a-devui/modules/devui-adapter/src/bean/meta.themeHandler.d.ts
declare class MetaThemeHandler extends BeanBase implements IThemeHandler {
  $$scopeSsr: ScopeModuleASsr;
  apply({
    name: _name,
    dark,
    token
  }: IThemeHandlerApplyParams): Promise<void>;
}
//#endregion
//#region src/suite/a-devui/modules/devui-adapter/src/.metadata/index.d.ts
declare module 'zova-module-a-meta' {
  interface IMetaRecord {
    'devui-adapter:themeHandler': never;
  }
}
declare module 'zova-module-devui-adapter' {
  interface MetaThemeHandler {}
  interface MetaThemeHandler {
    get $beanFullName(): 'devui-adapter.meta.themeHandler';
    get $onionName(): 'devui-adapter:themeHandler';
  }
}
/** meta: end */
/** meta: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'devui-adapter.meta.themeHandler': MetaThemeHandler;
  }
}
/** meta: end */
/** monkeySys: begin */
declare class ScopeModuleDevuiAdapter extends BeanScopeBase {}
interface ScopeModuleDevuiAdapter {
  util: BeanScopeUtil;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'devui-adapter': ScopeModuleDevuiAdapter;
  }
}
/** scope: end */
//#endregion
//#region src/suite/a-home/modules/home-base/src/service/routerGuards.d.ts
declare class ServiceRouterGuards extends BeanRouterGuardsBase {
  protected onRouterGuards(router: BeanRouter): void;
}
//#endregion
//#region src/suite/a-home/modules/home-base/src/service/ssr.d.ts
declare class ServiceSsr extends BeanBase {
  initialize(): Promise<void>;
  private _ssrErrorHandler;
}
//#endregion
//#region src/suite/a-home/modules/home-base/src/service/ssrLayout.d.ts
interface IServiceSsrLayoutOptions {
  sidebarLeftOpenPC?: boolean;
}
declare class ServiceSsrLayout extends BeanBase {
  $$scopeSsr: ScopeModuleASsr;
  options?: IServiceSsrLayoutOptions;
  protected __init__(options?: IServiceSsrLayoutOptions): Promise<void>;
  private _getJsHandlerPageContainer;
  private _getJsHandlerSidebar;
}
//#endregion
//#region src/suite/a-home/modules/home-base/src/component/itemLink/controller.d.ts
interface ControllerItemLinkProps {
  title: string;
  description?: string;
  icon?: keyof IIconRecord;
  href?: string;
  to?: string | object;
}
declare class ControllerItemLink extends BeanControllerBase {
  static $propsDefault: {
    description: string;
    icon: string;
  };
  _renderLink(): _$vue_jsx_runtime0.JSX.Element;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-home/modules/home-base/src/component/page/controller.d.ts
interface ControllerPageProps {}
declare class ControllerPage extends BeanControllerBase {
  static $propsDefault: {};
  cPage: string;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-home/modules/home-base/src/page/authCallback/controller.d.ts
declare const ControllerPageAuthCallbackSchemaQuery: z.ZodObject<{
  returnTo: z.ZodOptional<z.ZodString>;
  'x-vona-oauth-code': z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare class ControllerPageAuthCallback extends BeanControllerPageBase {
  protected __init__(): Promise<void>;
  private _handleAuth;
  protected render(): null;
}
//#endregion
//#region src/suite/a-home/modules/home-base/src/page/errorExpired/controller.d.ts
declare const ControllerPageErrorExpiredSchemaQuery: z.ZodObject<{
  returnTo: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare class ControllerPageErrorExpired extends BeanControllerPageBase {
  $$jwtAdapter: ServiceJwtAdapter;
  protected __init__(): Promise<void>;
  private _refreshToken;
  protected render(): null;
}
//#endregion
//#region src/suite/a-home/modules/home-base/src/page/errorNotFound/controller.d.ts
declare class ControllerPageErrorNotFound extends BeanControllerPageBase {
  cTitle: string;
  cDescription: string;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-home/modules/home-base/src/.metadata/page/authCallback.d.ts
declare namespace NSControllerPageAuthCallback {
  const querySchema: z.ZodObject<{
    returnTo: z.ZodOptional<z.ZodString>;
    'x-vona-oauth-code': z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
  type QueryInput = z.input<typeof ControllerPageAuthCallbackSchemaQuery>;
  type QueryOutput = z.output<typeof ControllerPageAuthCallbackSchemaQuery>;
}
declare const ZPageAuthCallback: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/suite/a-home/modules/home-base/src/.metadata/page/errorExpired.d.ts
declare namespace NSControllerPageErrorExpired {
  const querySchema: z.ZodObject<{
    returnTo: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
  type QueryInput = z.input<typeof ControllerPageErrorExpiredSchemaQuery>;
  type QueryOutput = z.output<typeof ControllerPageErrorExpiredSchemaQuery>;
}
declare const ZPageErrorExpired: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/suite/a-home/modules/home-base/src/.metadata/page/errorNotFound.d.ts
declare const ZPageErrorNotFound: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/suite/a-home/modules/home-base/src/.metadata/component/itemLink.d.ts
type ZItemLinkProps = {
  controllerRef?: (ref: ControllerItemLink) => void;
} & ControllerItemLinkProps;
type ControllerInnerProps$24 = TypeControllerInnerProps<ControllerItemLinkProps, keyof typeof ControllerItemLink.$propsDefault>;
declare module 'zova-module-home-base' {
  interface ControllerItemLink {
    $props: ControllerInnerProps$24;
  }
}
declare const ZItemLink: _$vue.DefineSetupFnComponent<ZItemLinkProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerItemLink) => void;
} & ControllerItemLinkProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'home-base:itemLink': ControllerItemLinkProps;
  }
}
//#endregion
//#region src/suite/a-home/modules/home-base/src/.metadata/component/page.d.ts
type ZPageProps = {
  controllerRef?: (ref: ControllerPage) => void;
} & ControllerPageProps;
type ControllerInnerProps$23 = TypeControllerInnerProps<ControllerPageProps, keyof typeof ControllerPage.$propsDefault>;
declare module 'zova-module-home-base' {
  interface ControllerPage {
    $props: ControllerInnerProps$23;
  }
}
declare const ZPage: _$vue.DefineSetupFnComponent<ZPageProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerPage) => void;
} & ControllerPageProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'home-base:page': ControllerPageProps;
  }
}
//#endregion
//#region src/suite/a-home/modules/home-base/src/config/config.d.ts
declare const config$3: (_sys: ZovaSys) => {
  layout: {
    sidebar: {
      width: number;
    };
    navbar: {
      height: number;
    };
  };
};
//#endregion
//#region src/suite/a-home/modules/home-base/src/.metadata/locales.d.ts
declare const locales$7: {
  'en-us': {
    Home: string;
  };
  'zh-cn': {
    Home: string;
  };
};
//#endregion
//#region src/suite/a-home/modules/home-base/src/main.d.ts
declare class Main extends BeanSimple implements IModuleMain {
  moduleLoading(): Promise<void>;
  moduleLoaded(): Promise<void>;
}
//#endregion
//#region src/suite/a-home/modules/home-base/src/.metadata/index.d.ts
declare module 'zova-module-a-bean' {
  interface IServiceRecord {
    'home-base:routerGuards': never;
    'home-base:ssr': never;
    'home-base:ssrLayout': never;
  }
}
declare module 'zova-module-home-base' {
  interface ServiceRouterGuards {}
  interface ServiceRouterGuards {
    get $beanFullName(): 'home-base.service.routerGuards';
    get $onionName(): 'home-base:routerGuards';
  }
  interface ServiceSsr {}
  interface ServiceSsr {
    get $beanFullName(): 'home-base.service.ssr';
    get $onionName(): 'home-base:ssr';
  }
  interface ServiceSsrLayout {}
  interface ServiceSsrLayout {
    get $beanFullName(): 'home-base.service.ssrLayout';
    get $onionName(): 'home-base:ssrLayout';
  }
}
/** service: end */
/** service: begin */
declare module 'zova' {
  interface IBeanRecordGeneral {
    'home-base.service.routerGuards': ServiceRouterGuards;
    'home-base.service.ssr': ServiceSsr;
    'home-base.service.ssrLayout': ServiceSsrLayout;
  }
}
/** service: end */
/** controller: begin */
declare module 'zova' {}
declare module 'zova-module-home-base' {
  interface ControllerItemLink {}
  interface ControllerPage {}
  interface ControllerPageAuthCallback {}
  interface ControllerPageErrorExpired {}
  interface ControllerPageErrorNotFound {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'home-base.controller.itemLink': ControllerItemLink;
    'home-base.controller.page': ControllerPage;
    'home-base.controller.pageAuthCallback': ControllerPageAuthCallback;
    'home-base.controller.pageErrorExpired': ControllerPageErrorExpired;
    'home-base.controller.pageErrorNotFound': ControllerPageErrorNotFound;
  }
}
/** controller: end */
/** pages: begin */
declare module 'zova-module-a-router' {
  interface IPagePathRecord {
    '/home/base/authCallback': TypePagePathSchema<undefined, NSControllerPageAuthCallback.QueryInput>;
    '/home/base/errorExpired': TypePagePathSchema<undefined, NSControllerPageErrorExpired.QueryInput>;
    '/home/base//:catchAll(.*)*': TypePagePathSchema<undefined, undefined>;
  }
  interface IPageNameRecord {}
}
declare module 'zova-module-home-base' {
  interface ControllerPageAuthCallback {
    $query: NSControllerPageAuthCallback.QueryOutput;
  }
  interface ControllerPageErrorExpired {
    $query: NSControllerPageErrorExpired.QueryOutput;
  }
}
/** pages: end */
/** components: begin */
declare module 'zova' {
  interface IComponentRecord {
    'home-base:itemLink': ControllerItemLink;
    'home-base:page': ControllerPage;
  }
  interface IZovaComponentRecord {
    'home-base:itemLink': typeof ZItemLink;
    'home-base:page': typeof ZPage;
  }
}
/** components: end */
/** config: begin */
declare class ScopeModuleHomeBase extends BeanScopeBase {}
interface ScopeModuleHomeBase {
  util: BeanScopeUtil;
  config: TypeModuleConfig<typeof config$3>;
  locale: TypeModuleLocales<(typeof locales$7)[TypeLocaleBase]>;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'home-base': ScopeModuleHomeBase;
  }
  interface IBeanScopeConfig {
    'home-base': ReturnType<typeof config$3>;
  }
  interface IBeanScopeLocale {
    'home-base': (typeof locales$7)[TypeLocaleBase];
  }
}
//#endregion
//#region src/suite/a-home/modules/home-base/src/lib/utils.d.ts
declare function definePropertyScopeBase(bean: BeanContainer, beanInstance: BeanBase): void;
//#endregion
//#region src/suite/a-home/modules/home-base/src/types/scopeBase.d.ts
declare module 'zova' {
  interface BeanBase {
    $scopeBase: ScopeModuleHomeBase;
  }
}
//#endregion
//#region src/suite/a-home/modules/home-icon/src/.metadata/index.d.ts
declare const icons: {
  auth: string;
  business: string;
  daisy: string;
  default: string;
  editor: string;
  emoji: string;
  flow: string;
  login: string;
  outline: string;
  role: string;
  social: string;
  tools: string;
};
declare module 'zova-module-a-icon' {
  interface IIconRecord {
    ':auth:dingtalk-square': true;
    ':auth:github': true;
    ':auth:password': true;
    ':auth:sms': true;
    ':auth:wechat-outline': true;
    ':auth:wxwork-outline': true;
    ':business:coupon': true;
    ':business:course': true;
    ':business:distribution': true;
    ':business:hotsprings': true;
    ':business:kitchen-set': true;
    ':business:money-bag': true;
    ':business:party': true;
    ':business:provider': true;
    ':business:purchase': true;
    ':business:store': true;
    ':daisy:lock': true;
    ':daisy:person': true;
    '::add': true;
    '::alert': true;
    '::archive': true;
    '::arrow-back': true;
    '::arrow-cycle': true;
    '::arrow-down-left': true;
    '::arrow-down-right': true;
    '::arrow-down': true;
    '::arrow-drop-down': true;
    '::arrow-drop-up': true;
    '::arrow-forward': true;
    '::arrow-left': true;
    '::arrow-repeat': true;
    '::arrow-right-left': true;
    '::arrow-right': true;
    '::arrow-shuffle': true;
    '::arrow-up-down': true;
    '::arrow-up-left': true;
    '::arrow-up-right': true;
    '::arrow-up': true;
    '::article': true;
    '::asterisk': true;
    '::attachment-line': true;
    '::book': true;
    '::checkbox-checked': true;
    '::checkbox-intermediate': true;
    '::checkbox-off': true;
    '::checkbox': true;
    '::chevron-left': true;
    '::chevron-right': true;
    '::close': true;
    '::comment-dots': true;
    '::construction': true;
    '::copyright': true;
    '::cross-circle': true;
    '::dark-theme': true;
    '::dashboard': true;
    '::database': true;
    '::delete-forever': true;
    '::delete': true;
    '::developer-board': true;
    '::done': true;
    '::dot': true;
    '::draft-add': true;
    '::draft-edit': true;
    '::draft': true;
    '::drive-file-move': true;
    '::edit': true;
    '::expand-more': true;
    '::export': true;
    '::fast-forward': true;
    '::flow-chart': true;
    '::folder-open': true;
    '::folder': true;
    '::fullscreen-exit': true;
    '::fullscreen': true;
    '::grading': true;
    '::group-work': true;
    '::group': true;
    '::groups': true;
    '::heart': true;
    '::home': true;
    '::identification': true;
    '::import': true;
    '::info-circle': true;
    '::information-filled': true;
    '::information': true;
    '::label': true;
    '::language': true;
    '::layers': true;
    '::layout-columns': true;
    '::location-on': true;
    '::lock-open': true;
    '::lock': true;
    '::mail': true;
    '::mark-as-unread': true;
    '::mark-email-read': true;
    '::menu': true;
    '::message': true;
    '::module': true;
    '::more-horiz': true;
    '::none': true;
    '::notebook': true;
    '::open-in-new': true;
    '::open-with': true;
    '::people': true;
    '::person': true;
    '::play-arrow': true;
    '::popup': true;
    '::preview': true;
    '::radio-button-checked': true;
    '::radio-button-unchecked': true;
    '::redo': true;
    '::remove': true;
    '::reply': true;
    '::reset': true;
    '::round-person-add': true;
    '::save-and-return': true;
    '::save-and-submit': true;
    '::save-as-draft': true;
    '::save': true;
    '::search': true;
    '::send': true;
    '::settings': true;
    '::share': true;
    '::sort': true;
    '::star': true;
    '::stats-chart': true;
    '::stop': true;
    '::text-fields': true;
    '::timeline': true;
    '::undo': true;
    '::view-list': true;
    '::visibility': true;
    '::zoom-in': true;
    '::zoom-out': true;
    ':editor:add-box-outline': true;
    ':editor:add-box': true;
    ':editor:bookmark-outline': true;
    ':editor:bookmark': true;
    ':editor:code-block': true;
    ':editor:code': true;
    ':editor:format-align-center': true;
    ':editor:format-align-left': true;
    ':editor:format-align-right': true;
    ':editor:format-bold': true;
    ':editor:format-italic': true;
    ':editor:format-list-bulleted': true;
    ':editor:format-list-numbered': true;
    ':editor:format-quote': true;
    ':editor:format-strikethrough': true;
    ':editor:format-underlined': true;
    ':editor:grid-on': true;
    ':editor:horizontal-rule': true;
    ':editor:image-outline': true;
    ':editor:image': true;
    ':editor:insert-link-outline': true;
    ':editor:paragraph-break': true;
    ':editor:paragraph': true;
    ':editor:redo': true;
    ':editor:source-outline': true;
    ':editor:subscript': true;
    ':editor:superscript': true;
    ':editor:task-alt': true;
    ':editor:title': true;
    ':editor:undo': true;
    ':emoji:flower': true;
    ':flow:activity-none': true;
    ':flow:activity-service': true;
    ':flow:activity-user-task': true;
    ':flow:end-event-atom': true;
    ':flow:end-event-none': true;
    ':flow:gateway-exclusive': true;
    ':flow:gateway-inclusive': true;
    ':flow:gateway-parallel': true;
    ':flow:start-event-atom': true;
    ':flow:start-event-none': true;
    ':flow:start-event-timer': true;
    ':login:call-outline': true;
    ':login:chevron-left': true;
    ':login:done': true;
    ':login:lock-outline': true;
    ':login:person-outline': true;
    ':outline:add-circle-outline': true;
    ':outline:alert-outline': true;
    ':outline:apps-outline': true;
    ':outline:archive-lock-outline': true;
    ':outline:archive-outline': true;
    ':outline:article-outline': true;
    ':outline:backspace-outline': true;
    ':outline:build-circle-outline': true;
    ':outline:calendar-today-outline': true;
    ':outline:check-circle-outline': true;
    ':outline:checkbox-checked-outline': true;
    ':outline:checkbox-off-outline': true;
    ':outline:checkbox-outline': true;
    ':outline:copy-outline': true;
    ':outline:data-list-outline': true;
    ':outline:database-lock-outline': true;
    ':outline:delete-forever-outline': true;
    ':outline:delete-outline': true;
    ':outline:dict-outline': true;
    ':outline:draft-outline': true;
    ':outline:folder-transfer-outline': true;
    ':outline:group-outline': true;
    ':outline:heart-outline': true;
    ':outline:insert-emoticon-outline': true;
    ':outline:key-reset-outline': true;
    ':outline:label-outline': true;
    ':outline:layout-outline': true;
    ':outline:login-outline': true;
    ':outline:logout-outline': true;
    ':outline:mail-outline': true;
    ':outline:note-outline': true;
    ':outline:software-resource-cluster-outline': true;
    ':outline:software-resource-outline': true;
    ':outline:star-outline': true;
    ':outline:theme-outline': true;
    ':outline:timer-outline': true;
    ':outline:visibility-off-outline': true;
    ':outline:visibility-outline': true;
    ':outline:work-history-outline': true;
    ':role:collaboration': true;
    ':role:level': true;
    ':role:organization': true;
    ':role:position': true;
    ':role:relation': true;
    ':role:role': true;
    ':role:shield-key': true;
    ':role:template': true;
    ':social:cabloy': true;
    ':social:chat': true;
    ':social:facebook': true;
    ':social:github': true;
    ':social:public': true;
    ':social:record-voice-over': true;
    ':social:school': true;
    ':social:twitter': true;
    ':social:vona': true;
    ':social:zova': true;
    ':tools:pomotodo': true;
    ':tools:spreadsheet': true;
  }
}
/** icons: end */
/** scope: begin */
declare class ScopeModuleHomeIcon extends BeanScopeBase {}
interface ScopeModuleHomeIcon {
  util: BeanScopeUtil;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'home-icon': ScopeModuleHomeIcon;
  }
}
/** scope: end */
//#endregion
//#region src/suite/a-home/modules/home-layoutempty/src/component/layoutEmpty/controller.d.ts
interface ControllerLayoutEmptyProps {}
declare class ControllerLayoutEmpty extends BeanControllerBase {
  static $propsDefault: {};
  $$serviceSsrLayout: ServiceSsrLayout;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-home/modules/home-layoutempty/src/.metadata/component/layoutEmpty.d.ts
type ZLayoutEmptyProps = {
  controllerRef?: (ref: ControllerLayoutEmpty) => void;
} & ControllerLayoutEmptyProps;
type ControllerInnerProps$22 = TypeControllerInnerProps<ControllerLayoutEmptyProps, keyof typeof ControllerLayoutEmpty.$propsDefault>;
declare module 'zova-module-home-layoutempty' {
  interface ControllerLayoutEmpty {
    $props: ControllerInnerProps$22;
  }
}
declare const ZLayoutEmpty: _$vue.DefineSetupFnComponent<ZLayoutEmptyProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerLayoutEmpty) => void;
} & ControllerLayoutEmptyProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'home-layoutempty:layoutEmpty': ControllerLayoutEmptyProps;
  }
}
//#endregion
//#region src/suite/a-home/modules/home-layoutempty/src/.metadata/index.d.ts
declare module 'zova' {}
declare module 'zova-module-home-layoutempty' {
  interface ControllerLayoutEmpty {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'home-layoutempty.controller.layoutEmpty': ControllerLayoutEmpty;
  }
}
/** controller: end */
/** components: begin */
declare module 'zova' {
  interface IComponentRecord {
    'home-layoutempty:layoutEmpty': ControllerLayoutEmpty;
  }
  interface IZovaComponentRecord {
    'home-layoutempty:layoutEmpty': typeof ZLayoutEmpty;
  }
}
/** components: end */
/** scope: begin */
declare class ScopeModuleHomeLayoutempty extends BeanScopeBase {}
interface ScopeModuleHomeLayoutempty {
  util: BeanScopeUtil;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'home-layoutempty': ScopeModuleHomeLayoutempty;
  }
}
/** scope: end */
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/model/layout.d.ts
interface IModelOptionsLayout extends IDecoratorModelOptions {}
declare class ModelLayout extends BeanModelBase {
  leftDrawerOpenPC: boolean;
  $$scopeSsr: ScopeModuleASsr;
  protected __init__(): Promise<void>;
}
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/model/menu.d.ts
type TypeMenuGroup = ApiSchemaAMenuDtoMenuGroup & {
  folder: true;
  children: TypeMenuItem[];
};
type TypeMenuItem = (ApiSchemaAMenuDtoMenuItem & {
  folder: false;
}) | TypeMenuGroup;
type TypeMenuTree = TypeMenuItem[];
interface IModelOptionsMenu extends IDecoratorModelOptions {}
declare class ModelMenu extends BeanModelBase {
  menuTree?: TypeMenuTree;
  private _eventSsrHmrReload;
  protected __init__(): Promise<void>;
  protected __dispose__(): void;
  retrieveMenus(): _$vue.UnwrapNestedRefs<_$_tanstack_vue_query0.UseQueryReturnType<{
    groups?: components['schemas']['a-menu.dto.menuGroup'][] | undefined;
    menus: {
      name: string;
      title?: string | undefined;
      description?: string | undefined;
      icon?: string | undefined;
      order?: number | undefined;
      group?: string | string[] | undefined;
      separator?: boolean | undefined;
      link?: string | undefined;
      external?: boolean | undefined;
      target?: string | undefined;
      meta?: components['schemas']['a-menu.dto.menuItemMeta'];
    }[] | undefined;
  }, Error>>;
  findMenuItem(search: {
    name?: string;
    link?: string;
  }): ApiSchemaAMenuDtoMenuItem | undefined;
  private _prepareMenuTree;
}
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/controller.d.ts
interface ControllerLayoutTabsProps {}
declare class ControllerLayoutTabs extends BeanControllerBase {
  static $propsDefault: {};
  $$modelTabs: ModelTabs;
  $$modelMenu: ModelMenu;
  $$modelLayout: ModelLayout;
  $$serviceSsrLayout: ServiceSsrLayout;
  leftDrawerOpen: boolean;
  leftDrawerOpenMobile: boolean;
  belowBreakpoint: boolean;
  protected __init__(): Promise<void>;
  private _initTabs;
  toggleLeftDrawer(): void;
}
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/.metadata/component/layoutTabs.d.ts
type ZLayoutTabsProps = {
  controllerRef?: (ref: ControllerLayoutTabs) => void;
} & ControllerLayoutTabsProps;
type ControllerInnerProps$21 = TypeControllerInnerProps<ControllerLayoutTabsProps, keyof typeof ControllerLayoutTabs.$propsDefault>;
declare module 'zova-module-home-layouttabs' {
  interface ControllerLayoutTabs {
    $props: ControllerInnerProps$21;
  }
}
declare module 'zova-module-home-layouttabs' {
  interface StyleLayoutTabs extends ControllerLayoutTabs {}
  interface RenderLayoutTabs extends StyleLayoutTabs {}
  interface RenderContent extends StyleLayoutTabs {}
  interface RenderHeader extends StyleLayoutTabs {}
  interface RenderLocale extends StyleLayoutTabs {}
  interface RenderMenu extends StyleLayoutTabs {}
  interface RenderSidebar extends StyleLayoutTabs {}
  interface RenderTabs extends StyleLayoutTabs {}
  interface RenderTheme extends StyleLayoutTabs {}
  interface RenderUser extends StyleLayoutTabs {}
}
declare const ZLayoutTabs: _$vue.DefineSetupFnComponent<ZLayoutTabsProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerLayoutTabs) => void;
} & ControllerLayoutTabsProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'home-layouttabs:layoutTabs': ControllerLayoutTabsProps;
  }
}
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.header.d.ts
declare class RenderHeader extends BeanRenderBase {
  $$r: RenderLayoutTabs;
  render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.locale.d.ts
declare class RenderLocale extends BeanRenderBase {
  render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.menu.d.ts
declare class RenderMenu extends BeanRenderBase {
  _renderMenuItem(item: TypeMenuItem): _$vue_jsx_runtime0.JSX.Element;
  _renderMenuItems(items?: TypeMenuTree): VNode<_$vue.RendererNode, _$vue.RendererElement, {
    [key: string]: any;
  }>[] | undefined;
  render(): _$vue_jsx_runtime0.JSX.Element | undefined;
}
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.sidebar.d.ts
declare class RenderSidebar extends BeanRenderBase {
  $$r: RenderLayoutTabs;
  render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.tabs.d.ts
declare class RenderTabs extends BeanRenderBase {
  renderTabs(): _$vue_jsx_runtime0.JSX.Element | undefined;
  renderTabItems(): _$vue_jsx_runtime0.JSX.Element | undefined;
  getTabIcon(tab: RouteTab): string;
  getTabItemIcon(tabItem: IRouteViewRouteItem): keyof IIconRecord | '';
  _renderRouterViewTabs(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.theme.d.ts
declare class RenderTheme extends BeanRenderBase {
  renderThemeDark(): _$vue_jsx_runtime0.JSX.Element;
  renderThemeName(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.user.d.ts
declare class RenderUser extends BeanRenderBase {
  render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.d.ts
declare class RenderLayoutTabs extends BeanRenderBase {
  $$renderHeader: RenderHeader;
  $$renderContent: RenderContent;
  $$renderSidebar: RenderSidebar;
  $$renderMenu: RenderMenu;
  $$renderTabs: RenderTabs;
  $$renderTheme: RenderTheme;
  $$renderLocale: RenderLocale;
  $$renderUser: RenderUser;
  render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/render.content.d.ts
declare class RenderContent extends BeanRenderBase {
  $$r: RenderLayoutTabs;
  render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/component/layoutTabs/style.d.ts
declare class StyleLayoutTabs$1 extends BeanStyleBase {
  cTab: string;
  protected __init__(): Promise<void>;
}
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/config/config.d.ts
declare const config$2: (_sys: ZovaSys) => {
  tabs: {
    scene: string;
    max: number;
    maxItems: number;
    cache: boolean;
  };
  tabItem: {
    maxWidth: string;
  };
};
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/.metadata/locales.d.ts
declare const locales$6: {
  'en-us': {
    Home: string;
    Logout: string;
    LanguageEnglish: string;
    LanguageChinese: string;
    ThemeLight: string;
    ThemeDark: string;
    ThemeAuto: string;
    ThemeDefault: string;
    ThemeOrange: string;
    Basic: string;
    Business: string;
    State: string;
    Component: string;
    'Route Query': string;
    'Route Query(2)': string;
    'Route Params': string;
    Locale: string;
    'Todo: CRUD': string;
    Docs: string;
  };
  'zh-cn': {
    Home: string;
    Logout: string;
    LanguageEnglish: string;
    LanguageChinese: string;
    ThemeLight: string;
    ThemeDark: string;
    ThemeAuto: string;
    ThemeDefault: string;
    ThemeOrange: string;
    Basic: string;
    Business: string;
    State: string;
    Component: string;
    'Route Query': string;
    'Route Query(2)': string;
    'Route Params': string;
    Locale: string;
    'Todo: CRUD': string;
    Docs: string;
  };
};
//#endregion
//#region src/suite/a-home/modules/home-layouttabs/src/.metadata/index.d.ts
declare module 'zova-module-a-model' {
  interface IModelRecord {
    'home-layouttabs:layout': IModelOptionsLayout;
    'home-layouttabs:menu': IModelOptionsMenu;
  }
}
declare module 'zova-module-home-layouttabs' {
  interface ModelLayout {}
  interface ModelLayout {
    get $beanFullName(): 'home-layouttabs.model.layout';
    get $onionName(): 'home-layouttabs:layout';
    get $onionOptions(): IModelOptionsLayout;
  }
  interface ModelMenu {}
  interface ModelMenu {
    get $beanFullName(): 'home-layouttabs.model.menu';
    get $onionName(): 'home-layouttabs:menu';
    get $onionOptions(): IModelOptionsMenu;
  }
}
/** model: end */
/** model: begin */
declare module 'zova' {
  interface IBeanRecordGeneral {
    'home-layouttabs.model.layout': ModelLayout;
    'home-layouttabs.model.menu': ModelMenu;
  }
}
/** model: end */
/** controller: begin */
declare module 'zova' {}
declare module 'zova-module-home-layouttabs' {
  interface ControllerLayoutTabs {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'home-layouttabs.controller.layoutTabs': ControllerLayoutTabs;
  }
}
/** controller: end */
/** components: begin */
declare module 'zova' {
  interface IComponentRecord {
    'home-layouttabs:layoutTabs': ControllerLayoutTabs;
  }
  interface IZovaComponentRecord {
    'home-layouttabs:layoutTabs': typeof ZLayoutTabs;
  }
}
/** components: end */
/** render: begin */
declare module 'zova' {}
declare module 'zova-module-home-layouttabs' {
  interface RenderContent {}
  interface RenderHeader {}
  interface RenderLocale {}
  interface RenderMenu {}
  interface RenderSidebar {}
  interface RenderTabs {}
  interface RenderTheme {}
  interface RenderLayoutTabs {}
  interface RenderUser {}
}
/** render: end */
/** render: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'home-layouttabs.render.content': RenderContent;
    'home-layouttabs.render.header': RenderHeader;
    'home-layouttabs.render.locale': RenderLocale;
    'home-layouttabs.render.menu': RenderMenu;
    'home-layouttabs.render.sidebar': RenderSidebar;
    'home-layouttabs.render.tabs': RenderTabs;
    'home-layouttabs.render.theme': RenderTheme;
    'home-layouttabs.render.layoutTabs': RenderLayoutTabs;
    'home-layouttabs.render.user': RenderUser;
  }
}
/** render: end */
/** style: begin */
declare module 'zova' {}
declare module 'zova-module-home-layouttabs' {
  interface StyleLayoutTabs {}
}
/** style: end */
/** style: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'home-layouttabs.style.layoutTabs': StyleLayoutTabs$1;
  }
}
/** style: end */
/** config: begin */
declare class ScopeModuleHomeLayouttabs extends BeanScopeBase {}
interface ScopeModuleHomeLayouttabs {
  util: BeanScopeUtil;
  config: TypeModuleConfig<typeof config$2>;
  locale: TypeModuleLocales<(typeof locales$6)[TypeLocaleBase]>;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'home-layouttabs': ScopeModuleHomeLayouttabs;
  }
  interface IBeanScopeConfig {
    'home-layouttabs': ReturnType<typeof config$2>;
  }
  interface IBeanScopeLocale {
    'home-layouttabs': (typeof locales$6)[TypeLocaleBase];
  }
}
//#endregion
//#region src/suite/a-home/modules/home-login/src/page/login/controller.d.ts
declare class ControllerPageLogin$1 extends BeanControllerPageBase {
  user: ApiApiHomeUserPassportloginRequestBody;
  protected __init__(): Promise<void>;
  get schema(): _$openapi3_ts_oas310.SchemaObject | undefined;
  submitLogin(data: TypeFormOnSubmitData<ApiApiHomeUserPassportloginRequestBody>): Promise<void>;
  loginGitHub(): Promise<void>;
}
//#endregion
//#region src/suite/a-home/modules/home-login/src/.metadata/page/login.d.ts
declare module 'zova-module-home-login' {
  interface RenderPageLogin extends ControllerPageLogin {}
}
declare const ZPageLogin: _$vue.DefineSetupFnComponent<Record<string, any>, {}, {}, Record<string, any> & {}, _$vue.PublicProps>;
//#endregion
//#region src/suite/a-home/modules/home-login/src/page/login/render.d.ts
declare class RenderPageLogin extends BeanRenderBase {
  render(): _$vue_jsx_runtime0.JSX.Element;
  _renderLandingInfo(): _$vue_jsx_runtime0.JSX.Element;
  _renderForm(): _$vue_jsx_runtime0.JSX.Element;
  _renderGithub(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/a-home/modules/home-login/src/bean/behavior.formFieldLayoutLogin.d.ts
interface IBehaviorPropsInputFormFieldLayoutLogin extends IFormFieldRenderContext {}
interface IBehaviorPropsOutputFormFieldLayoutLogin extends IBehaviorPropsInputFormFieldLayoutLogin {}
interface IBehaviorOptionsFormFieldLayoutLogin extends IDecoratorBehaviorOptions {}
declare class BehaviorFormFieldLayoutLogin extends BeanBehaviorBase<IBehaviorOptionsFormFieldLayoutLogin, IBehaviorPropsInputFormFieldLayoutLogin, IBehaviorPropsOutputFormFieldLayoutLogin> {
  $$formField: ControllerFormField;
  protected render(renderContext: IBehaviorPropsInputFormFieldLayoutLogin, next: NextBehavior<IBehaviorPropsOutputFormFieldLayoutLogin>): VNode;
}
//#endregion
//#region src/suite/a-home/modules/home-login/src/.metadata/locales.d.ts
declare const locales$5: {
  'en-us': {
    YourUsername: string;
    YourPassword: string;
    Login: string;
    LoginGitHub: string;
  };
  'zh-cn': {
    YourUsername: string;
    YourPassword: string;
    Login: string;
    LoginGitHub: string;
  };
};
//#endregion
//#region src/suite/a-home/modules/home-login/src/.metadata/index.d.ts
declare module 'zova' {}
declare module 'zova-module-home-login' {
  interface ControllerPageLogin {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'home-login.controller.pageLogin': ControllerPageLogin$1;
  }
}
/** controller: end */
/** pages: begin */
declare module 'zova-module-a-router' {
  interface IPagePathRecord {
    '/home/login': TypePagePathSchema<undefined, undefined>;
  }
  interface IPageNameRecord {}
}
declare module 'zova-module-home-login' {}
/** pages: end */
/** render: begin */
declare module 'zova' {}
declare module 'zova-module-home-login' {
  interface RenderPageLogin {}
}
/** render: end */
/** render: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'home-login.render.pageLogin': RenderPageLogin;
  }
}
/** render: end */
/** behavior: begin */
declare module 'zova-module-a-behavior' {
  interface IBehaviorRecord {
    'home-login:formFieldLayoutLogin': IBehaviorOptionsFormFieldLayoutLogin;
  }
}
declare module 'zova-module-home-login' {
  interface BehaviorFormFieldLayoutLogin {}
  interface BehaviorFormFieldLayoutLogin {
    get $beanFullName(): 'home-login.behavior.formFieldLayoutLogin';
    get $onionName(): 'home-login:formFieldLayoutLogin';
    get $onionOptions(): IBehaviorOptionsFormFieldLayoutLogin;
  }
}
/** behavior: end */
/** behavior: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'home-login.behavior.formFieldLayoutLogin': BehaviorFormFieldLayoutLogin;
  }
}
/** behavior: end */
/** behaviors: begin */
declare module 'vue' {
  interface InputHTMLAttributes {
    'bs-home-login-formFieldLayoutLogin'?: IBehaviorOptionsFormFieldLayoutLogin | '' | boolean;
  }
}
declare module 'vue/jsx-runtime' {
  namespace JSX {
    interface IntrinsicAttributes {
      'bs-home-login-formFieldLayoutLogin'?: IBehaviorOptionsFormFieldLayoutLogin | '' | boolean;
    }
  }
}
/** behaviors: end */
/** locale: begin */
declare class ScopeModuleHomeLogin extends BeanScopeBase {}
interface ScopeModuleHomeLogin {
  util: BeanScopeUtil;
  locale: TypeModuleLocales<(typeof locales$5)[TypeLocaleBase]>;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'home-login': ScopeModuleHomeLogin;
  }
  interface IBeanScopeLocale {
    'home-login': (typeof locales$5)[TypeLocaleBase];
  }
}
//#endregion
//#region src/suite/a-home/modules/home-passport/src/model/passport.d.ts
interface IModelOptionsPassport extends IDecoratorModelOptions {}
declare class ModelPassport extends BeanModelBase {
  passport?: ApiApiHomeUserPassportloginResponseBody['passport'];
  jwt?: ApiApiHomeUserPassportloginResponseBody['jwt'];
  accessToken?: string;
  expireTime?: number;
  schemaLogin?: SchemaObject;
  protected __init__(): Promise<void>;
  get apiSchemasLogin(): _$zova_module_a_openapi0.IOpenapiSchemas;
  login(): _$vue.UnwrapNestedRefs<_$_tanstack_vue_query0.UseMutationReturnType<{
    passport: components['schemas']['home-user.dto.passport'];
    jwt: components['schemas']['a-jwt.dto.jwtToken'];
  }, Error, {
    username: string;
    password: string;
    captcha: components['schemas']['a-captcha.dto.captchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e_3218e7d152830e08f6e764b9e0c3796df929ee2b'];
  }, unknown>>;
  loginByOauthCode(): _$vue.UnwrapNestedRefs<_$_tanstack_vue_query0.UseMutationReturnType<{
    passport: components['schemas']['home-user.dto.passport'];
    jwt: components['schemas']['a-jwt.dto.jwtToken'];
  }, Error, ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeRequestBody, unknown>>;
  getOauthLoginUrl(module: string, providerName: string, clientName?: string): string;
  afterLogin(data?: ApiApiHomeUserPassportloginResponseBody): void;
  logout(): _$vue.UnwrapNestedRefs<_$_tanstack_vue_query0.UseMutationReturnType<void, Error, void, unknown>>;
  get isAuthenticated(): boolean;
  get user(): {
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    iid?: number;
    id: number | string;
    name: string;
    avatar?: string | undefined;
    email?: string | undefined;
    mobile?: string | undefined;
    activated?: boolean;
    locale?: string | undefined;
    tz?: string | undefined;
  } | undefined;
  get roles(): {
    createdAt: Date;
    updatedAt: Date;
    deleted?: boolean;
    iid?: number;
    id: number | string;
    name: string;
  }[] | undefined;
  getJwtInfo(): Promise<IJwtInfo | undefined>;
  refreshAuthToken(refreshToken: string): Promise<IJwtInfo>;
  ensurePassport(): Promise<{
    user: components['schemas']['home-user.entity.user'];
    auth: components['schemas']['a-auth.dto.auth'];
    roles: components['schemas']['home-user.entity.role'][];
  } | undefined>;
  private _setLocaleTz;
  private _setPassportJwt;
  private _setPassport;
  private _setJwt;
  checkPermission(permissions: TypeOpenapiPermissions | undefined, actionName?: keyof (IResourceTableActionNameRecord & IResourceFormActionRowNameRecord), permissionHint?: IPermissionHintGeneral): boolean;
}
//#endregion
//#region src/suite/a-home/modules/home-passport/src/config/config.d.ts
declare const config$1: (_sys: ZovaSys) => {
  accessToken: {
    expireTimeDelay: number;
  };
};
//#endregion
//#region src/suite/a-home/modules/home-passport/src/.metadata/index.d.ts
declare module 'zova-module-a-model' {
  interface IModelRecord {
    'home-passport:passport': IModelOptionsPassport;
  }
}
declare module 'zova-module-home-passport' {
  interface ModelPassport {}
  interface ModelPassport {
    get $beanFullName(): 'home-passport.model.passport';
    get $onionName(): 'home-passport:passport';
    get $onionOptions(): IModelOptionsPassport;
  }
}
/** model: end */
/** model: begin */
declare module 'zova' {
  interface IBeanRecordGeneral {
    'home-passport.model.passport': ModelPassport;
  }
}
/** model: end */
/** config: begin */
declare class ScopeModuleHomePassport extends BeanScopeBase {}
interface ScopeModuleHomePassport {
  util: BeanScopeUtil;
  config: TypeModuleConfig<typeof config$1>;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'home-passport': ScopeModuleHomePassport;
  }
  interface IBeanScopeConfig {
    'home-passport': ReturnType<typeof config$1>;
  }
}
/** scope: end */
//#endregion
//#region src/suite/a-home/modules/home-passport/src/types/passport.d.ts
declare module 'zova' {
  interface BeanBase {
    $passport: ModelPassport;
  }
}
//#endregion
//#region src/suite/a-home/modules/home-theme/src/bean/css.base.d.ts
interface ICssOptionsBase extends IDecoratorCssOptions {}
declare class CssBase extends BeanBase {
  cTextCenter: string;
  cButtonPrimary: string;
  protected __init__(): Promise<void>;
}
//#endregion
//#region src/suite/a-home/modules/home-theme/src/types/style.d.ts
declare module 'zova' {
  interface BeanBase {
    $cssBase: CssBase;
  }
}
//#endregion
//#region src/suite/a-home/modules/home-theme/src/types/themeToken.d.ts
interface ThemeTokenCustom {
  color: {
    primary: string;
  };
  var: {
    borderColor: string;
  };
  component: {
    page: {
      background: string;
      color: string;
    };
  };
}
declare module 'zova-module-a-style' {
  interface ThemeToken extends ThemeTokenCustom {}
}
//#endregion
//#region src/suite/a-home/modules/home-theme/src/bean/theme.default.d.ts
interface IThemeOptionsDefault extends IDecoratorThemeOptions {}
declare class ThemeDefault extends BeanThemeBase implements IThemeBase {
  apply({
    name,
    dark
  }: IThemeApplyParams): Promise<IThemeApplyResult>;
}
//#endregion
//#region src/suite/a-home/modules/home-theme/src/bean/theme.orange.d.ts
interface IThemeOptionsOrange extends IDecoratorThemeOptions {}
declare class ThemeOrange extends BeanThemeBase implements IThemeBase {
  apply({
    name,
    dark
  }: IThemeApplyParams): Promise<IThemeApplyResult>;
}
//#endregion
//#region src/suite/a-home/modules/home-theme/src/.metadata/index.d.ts
declare module 'zova-module-a-style' {
  interface ICssRecord {
    'home-theme:base': ICssOptionsBase;
  }
}
declare module 'zova-module-home-theme' {
  interface CssBase {}
  interface CssBase {
    get $beanFullName(): 'home-theme.css.base';
    get $onionName(): 'home-theme:base';
    get $onionOptions(): ICssOptionsBase;
  }
}
/** css: end */
/** css: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'home-theme.css.base': CssBase;
  }
}
/** css: end */
/** theme: begin */
declare module 'zova-module-a-style' {
  interface IThemeRecord {
    'home-theme:default': IThemeOptionsDefault;
    'home-theme:orange': IThemeOptionsOrange;
  }
}
declare module 'zova-module-home-theme' {
  interface ThemeDefault {}
  interface ThemeDefault {
    get $beanFullName(): 'home-theme.theme.default';
    get $onionName(): 'home-theme:default';
    get $onionOptions(): IThemeOptionsDefault;
  }
  interface ThemeOrange {}
  interface ThemeOrange {
    get $beanFullName(): 'home-theme.theme.orange';
    get $onionName(): 'home-theme:orange';
    get $onionOptions(): IThemeOptionsOrange;
  }
}
/** theme: end */
/** theme: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'home-theme.theme.default': ThemeDefault;
    'home-theme.theme.orange': ThemeOrange;
  }
}
/** theme: end */
/** scope: begin */
declare class ScopeModuleHomeTheme extends BeanScopeBase {}
interface ScopeModuleHomeTheme {
  util: BeanScopeUtil;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'home-theme': ScopeModuleHomeTheme;
  }
}
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-adapter/src/config/config.d.ts
declare const config: (_sys: ZovaSys) => {
  formProvider: IFormProvider;
};
//#endregion
//#region src/suite/cabloy-basic/modules/basic-adapter/src/.metadata/index.d.ts
declare class ScopeModuleBasicAdapter extends BeanScopeBase {}
interface ScopeModuleBasicAdapter {
  util: BeanScopeUtil;
  config: TypeModuleConfig<typeof config>;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'basic-adapter': ScopeModuleBasicAdapter;
  }
  interface IBeanScopeConfig {
    'basic-adapter': ReturnType<typeof config>;
  }
}
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-captcha/src/.metadata/locales.d.ts
declare const locales$4: {
  'en-us': {
    InputCaptcha: string;
  };
  'zh-cn': {
    InputCaptcha: string;
  };
};
//#endregion
//#region src/suite/cabloy-basic/modules/basic-captcha/src/component/formFieldCaptcha/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceFormFieldRecord {
    'basic-captcha:formFieldCaptcha'?: IResourceFormFieldCaptchaOptions;
  }
  interface ICaptchaSceneRecord {
    'captcha-simple:simple': never;
  }
}
interface IResourceFormFieldCaptchaOptions extends IResourceFormFieldOptionsBase {
  scene?: keyof ICaptchaSceneRecord;
}
interface ControllerFormFieldCaptchaProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldCaptchaOptions;
}
declare class ControllerFormFieldCaptcha extends BeanControllerBase {
  static $propsDefault: {
    options: {
      scene: string;
    };
  };
  static $componentOptions: IComponentOptions;
  eventFormSubmission: TypeEventOff;
  captchaData?: ICaptchaData;
  $$form: ControllerForm;
  protected __init__(): Promise<void>;
  protected __dispose__(): void;
  get captchaScene(): "captcha-simple:simple";
  private createCaptchaData;
  private refreshCaptchaData;
  private setFieldCaptchaData;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-captcha/src/.metadata/component/formFieldCaptcha.d.ts
type ZFormFieldCaptchaProps = {
  controllerRef?: (ref: ControllerFormFieldCaptcha) => void;
} & ControllerFormFieldCaptchaProps;
type ControllerInnerProps$20 = TypeControllerInnerProps<ControllerFormFieldCaptchaProps, keyof typeof ControllerFormFieldCaptcha.$propsDefault>;
declare module 'zova-module-basic-captcha' {
  interface ControllerFormFieldCaptcha {
    $props: ControllerInnerProps$20;
  }
}
declare const ZFormFieldCaptcha: _$vue.DefineSetupFnComponent<ZFormFieldCaptchaProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerFormFieldCaptcha) => void;
} & ControllerFormFieldCaptchaProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-captcha:formFieldCaptcha': ControllerFormFieldCaptchaProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-captcha/src/.metadata/index.d.ts
declare module 'zova' {}
declare module 'zova-module-basic-captcha' {
  interface ControllerFormFieldCaptcha {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'basic-captcha.controller.formFieldCaptcha': ControllerFormFieldCaptcha;
  }
}
/** controller: end */
/** components: begin */
declare module 'zova' {
  interface IComponentRecord {
    'basic-captcha:formFieldCaptcha': ControllerFormFieldCaptcha;
  }
  interface IZovaComponentRecord {
    'basic-captcha:formFieldCaptcha': typeof ZFormFieldCaptcha;
  }
}
/** components: end */
/** locale: begin */
declare class ScopeModuleBasicCaptcha extends BeanScopeBase {}
interface ScopeModuleBasicCaptcha {
  util: BeanScopeUtil;
  locale: TypeModuleLocales<(typeof locales$4)[TypeLocaleBase]>;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'basic-captcha': ScopeModuleBasicCaptcha;
  }
  interface IBeanScopeLocale {
    'basic-captcha': (typeof locales$4)[TypeLocaleBase];
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/bean/command.alert.d.ts
type TypeCommandAlertResult = unknown;
interface ICommandOptionsAlert extends ICommandOptionsBase<TypeCommandAlertResult> {
  message: string;
  wait?: boolean;
}
declare class CommandAlert extends BeanBase implements ICommandExecute {
  execute(options: ICommandOptionsAlert, _renderContext: IJsxRenderContextBase, next: NextCommandExecute): any;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/bean/command.confirm.d.ts
type TypeCommandConfirmResult = boolean;
interface ICommandOptionsConfirm extends ICommandOptionsBase<TypeCommandConfirmResult> {
  message: string;
}
declare class CommandConfirm extends BeanBase implements ICommandExecute {
  execute(options: ICommandOptionsConfirm, _renderContext: IJsxRenderContextBase, next: NextCommandExecute): any;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/bean/command.copy.d.ts
type TypeCommandCopyResult = unknown;
interface ICommandOptionsCopy extends ICommandOptionsBase<TypeCommandCopyResult> {
  text: any;
}
declare class CommandCopy extends BeanBase implements ICommandExecute {
  execute(options: ICommandOptionsCopy, _renderContext: IJsxRenderContextBase, next: NextCommandExecute): any;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/bean/command.create.d.ts
type TypeCommandCreateResult = unknown;
interface ICommandOptionsCreate extends ICommandBulkOptionsBase<TypeCommandCreateResult> {
  replace?: boolean;
}
declare class CommandCreate extends BeanCommandBulkBase implements ICommandExecute {
  execute(options: ICommandOptionsCreate, renderContext: IJsxRenderContextBase, next: NextCommandExecute): any;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/bean/command.delete.d.ts
type TypeCommandDeleteResult = unknown;
interface ICommandOptionsDelete extends ICommandRowOptionsBase<TypeCommandDeleteResult> {}
declare class CommandDelete extends BeanCommandRowBase implements ICommandExecute {
  execute(options: ICommandOptionsDelete, renderContext: IJsxRenderContextBase, next: NextCommandExecute): Promise<any>;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/bean/command.edit.d.ts
type TypeCommandEditResult = unknown;
interface ICommandOptionsEdit extends ICommandRowOptionsBase<TypeCommandEditResult> {
  replace?: boolean;
}
declare class CommandEdit extends BeanCommandRowBase implements ICommandExecute {
  execute(options: ICommandOptionsEdit, renderContext: IJsxRenderContextBase, next: NextCommandExecute): any;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/bean/command.setValue.d.ts
type TypeCommandSetValueResult = unknown;
interface ICommandOptionsSetValue extends ICommandOptionsBase<TypeCommandSetValueResult> {
  name?: string;
  value?: any;
  disableNotifyChanged?: boolean;
}
declare class CommandSetValue extends BeanBase implements ICommandExecute {
  execute(options: ICommandOptionsSetValue, renderContext: IJsxRenderContextBase, next: NextCommandExecute): any;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/bean/command.view.d.ts
type TypeCommandViewResult = unknown;
interface ICommandOptionsView extends ICommandRowOptionsBase<TypeCommandViewResult> {
  replace?: boolean;
}
declare class CommandView extends BeanCommandRowBase implements ICommandExecute {
  execute(options: ICommandOptionsView, renderContext: IJsxRenderContextBase, next: NextCommandExecute): any;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commands/src/.metadata/index.d.ts
declare module 'zova-module-a-command' {
  interface ICommandRecord {
    'basic-commands:alert': ICommandOptionsAlert;
    'basic-commands:confirm': ICommandOptionsConfirm;
    'basic-commands:copy': ICommandOptionsCopy;
    'basic-commands:create': ICommandOptionsCreate;
    'basic-commands:delete': ICommandOptionsDelete;
    'basic-commands:edit': ICommandOptionsEdit;
    'basic-commands:setValue': ICommandOptionsSetValue;
    'basic-commands:view': ICommandOptionsView;
  }
}
declare module 'zova-module-basic-commands' {
  interface CommandAlert {}
  interface CommandAlert {
    get $beanFullName(): 'basic-commands.command.alert';
    get $onionName(): 'basic-commands:alert';
    get $onionOptions(): ICommandOptionsAlert;
  }
  interface CommandConfirm {}
  interface CommandConfirm {
    get $beanFullName(): 'basic-commands.command.confirm';
    get $onionName(): 'basic-commands:confirm';
    get $onionOptions(): ICommandOptionsConfirm;
  }
  interface CommandCopy {}
  interface CommandCopy {
    get $beanFullName(): 'basic-commands.command.copy';
    get $onionName(): 'basic-commands:copy';
    get $onionOptions(): ICommandOptionsCopy;
  }
  interface CommandCreate {}
  interface CommandCreate {
    get $beanFullName(): 'basic-commands.command.create';
    get $onionName(): 'basic-commands:create';
    get $onionOptions(): ICommandOptionsCreate;
  }
  interface CommandDelete {}
  interface CommandDelete {
    get $beanFullName(): 'basic-commands.command.delete';
    get $onionName(): 'basic-commands:delete';
    get $onionOptions(): ICommandOptionsDelete;
  }
  interface CommandEdit {}
  interface CommandEdit {
    get $beanFullName(): 'basic-commands.command.edit';
    get $onionName(): 'basic-commands:edit';
    get $onionOptions(): ICommandOptionsEdit;
  }
  interface CommandSetValue {}
  interface CommandSetValue {
    get $beanFullName(): 'basic-commands.command.setValue';
    get $onionName(): 'basic-commands:setValue';
    get $onionOptions(): ICommandOptionsSetValue;
  }
  interface CommandView {}
  interface CommandView {
    get $beanFullName(): 'basic-commands.command.view';
    get $onionName(): 'basic-commands:view';
    get $onionOptions(): ICommandOptionsView;
  }
}
/** command: end */
/** command: begin */
declare module 'zova' {
  interface IBeanRecordGeneral {
    'basic-commands.command.alert': CommandAlert;
    'basic-commands.command.confirm': CommandConfirm;
    'basic-commands.command.copy': CommandCopy;
    'basic-commands.command.create': CommandCreate;
    'basic-commands.command.delete': CommandDelete;
    'basic-commands.command.edit': CommandEdit;
    'basic-commands.command.setValue': CommandSetValue;
    'basic-commands.command.view': CommandView;
  }
}
/** command: end */
/** scope: begin */
declare class ScopeModuleBasicCommands extends BeanScopeBase {}
interface ScopeModuleBasicCommands {
  util: BeanScopeUtil;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'basic-commands': ScopeModuleBasicCommands;
  }
}
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commandssync/src/bean/command.expr.d.ts
type TypeCommandExprResult = unknown;
interface ICommandOptionsExpr extends ICommandOptionsBase<TypeCommandExprResult> {
  expression: string;
}
declare class CommandExpr extends BeanBase implements ICommandExecute {
  execute(options: ICommandOptionsExpr, _renderContext: IJsxRenderContextBase, next: NextCommandExecute): any;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commandssync/src/bean/command.log.d.ts
type TypeCommandLogResult = unknown;
interface ICommandOptionsLog extends ICommandOptionsBase<TypeCommandLogResult> {
  name?: string;
  message: any;
}
declare class CommandLog extends BeanBase implements ICommandExecute {
  execute(options: ICommandOptionsLog, _renderContext: IJsxRenderContextBase, next: NextCommandExecute): any;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-commandssync/src/.metadata/index.d.ts
declare module 'zova-module-a-command' {
  interface ICommandRecord {
    'basic-commandssync:expr': ICommandOptionsExpr;
    'basic-commandssync:log': ICommandOptionsLog;
  }
}
declare module 'zova-module-basic-commandssync' {
  interface CommandExpr {}
  interface CommandExpr {
    get $beanFullName(): 'basic-commandssync.command.expr';
    get $onionName(): 'basic-commandssync:expr';
    get $onionOptions(): ICommandOptionsExpr;
  }
  interface CommandLog {}
  interface CommandLog {
    get $beanFullName(): 'basic-commandssync.command.log';
    get $onionName(): 'basic-commandssync:log';
    get $onionOptions(): ICommandOptionsLog;
  }
}
/** command: end */
/** command: begin */
declare module 'zova' {
  interface IBeanRecordGeneral {
    'basic-commandssync.command.expr': CommandExpr;
    'basic-commandssync.command.log': CommandLog;
  }
}
/** command: end */
/** scope: begin */
declare class ScopeModuleBasicCommandssync extends BeanScopeBase {}
interface ScopeModuleBasicCommandssync {
  util: BeanScopeUtil;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'basic-commandssync': ScopeModuleBasicCommandssync;
  }
}
/** scope: end */
//#endregion
//#region node_modules/.pnpm/@zhennann+currency@2.0.4/node_modules/@zhennann/currency/dist/index.d.ts
interface CurrencyOptions {
  fixed?: number;
  exp?: number;
  zero?: number;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-currency/src/component/formFieldCurrency/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceFormFieldRecord {
    'basic-currency:formFieldCurrency'?: IResourceFormFieldCurrencyOptions;
  }
}
interface IResourceFormFieldCurrencyOptions extends IResourceFormFieldOptionsBase, CurrencyOptions {}
interface ControllerFormFieldCurrencyProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldCurrencyOptions;
}
declare class ControllerFormFieldCurrency extends BeanControllerBase {
  static $propsDefault: {};
  static $componentOptions: IComponentOptions;
  private _valueKeyboardInput;
  $$form: ControllerForm;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
  private _valuePatch;
  private _getValue;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-currency/src/.metadata/component/formFieldCurrency.d.ts
type ZFormFieldCurrencyProps = {
  controllerRef?: (ref: ControllerFormFieldCurrency) => void;
} & ControllerFormFieldCurrencyProps;
type ControllerInnerProps$19 = TypeControllerInnerProps<ControllerFormFieldCurrencyProps, keyof typeof ControllerFormFieldCurrency.$propsDefault>;
declare module 'zova-module-basic-currency' {
  interface ControllerFormFieldCurrency {
    $props: ControllerInnerProps$19;
  }
}
declare const ZFormFieldCurrency: _$vue.DefineSetupFnComponent<ZFormFieldCurrencyProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerFormFieldCurrency) => void;
} & ControllerFormFieldCurrencyProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-currency:formFieldCurrency': ControllerFormFieldCurrencyProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-currency/src/bean/tableCell.currency.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceTableCellRecord {
    'basic-currency:currency'?: ITableCellOptionsCurrency;
  }
}
interface ITableCellOptionsCurrency extends IResourceTableCellOptionsBase, CurrencyOptions {}
declare class TableCellCurrency extends BeanBase implements ITableCellRender {
  render(options: ITableCellOptionsCurrency, _renderContext: IJsxRenderContextTableCell, next: NextTableCellRender): any;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-currency/src/.metadata/index.d.ts
declare module 'zova' {}
declare module 'zova-module-basic-currency' {
  interface ControllerFormFieldCurrency {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'basic-currency.controller.formFieldCurrency': ControllerFormFieldCurrency;
  }
}
/** controller: end */
/** components: begin */
declare module 'zova' {
  interface IComponentRecord {
    'basic-currency:formFieldCurrency': ControllerFormFieldCurrency;
  }
  interface IZovaComponentRecord {
    'basic-currency:formFieldCurrency': typeof ZFormFieldCurrency;
  }
}
/** components: end */
/** tableCell: begin */
declare module 'zova-module-a-table' {
  interface ITableCellRecord {
    'basic-currency:currency': ITableCellOptionsCurrency;
  }
}
declare module 'zova-module-basic-currency' {
  interface TableCellCurrency {}
  interface TableCellCurrency {
    get $beanFullName(): 'basic-currency.tableCell.currency';
    get $onionName(): 'basic-currency:currency';
    get $onionOptions(): ITableCellOptionsCurrency;
  }
}
/** tableCell: end */
/** tableCell: begin */
declare module 'zova' {
  interface IBeanRecordGeneral {
    'basic-currency.tableCell.currency': TableCellCurrency;
  }
}
/** tableCell: end */
/** scope: begin */
declare class ScopeModuleBasicCurrency extends BeanScopeBase {}
interface ScopeModuleBasicCurrency {
  util: BeanScopeUtil;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'basic-currency': ScopeModuleBasicCurrency;
  }
}
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-currency/src/lib/utils.d.ts
declare function currencyFormat(value: any, options?: CurrencyOptions): any;
declare function currencyUpdate(value: any, options?: CurrencyOptions): number | null | undefined;
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/types/date.d.ts
type TypeDateFormatPreset = 'DATE_SHORT' | 'DATE_MED' | 'DATE_MED_WITH_WEEKDAY' | 'DATE_FULL' | 'DATE_HUGE' | 'TIME_SIMPLE' | 'TIME_WITH_SECONDS' | 'TIME_WITH_SHORT_OFFSET' | 'TIME_WITH_LONG_OFFSET' | 'TIME_24_SIMPLE' | 'TIME_24_WITH_SECONDS' | 'TIME_24_WITH_SHORT_OFFSET' | 'TIME_24_WITH_LONG_OFFSET' | 'DATETIME_SHORT' | 'DATETIME_MED' | 'DATETIME_MED_WITH_WEEKDAY' | 'DATETIME_FULL' | 'DATETIME_HUGE' | 'DATETIME_SHORT_WITH_SECONDS' | 'DATETIME_MED_WITH_SECONDS' | 'DATETIME_FULL_WITH_SECONDS' | 'DATETIME_HUGE_WITH_SECONDS';
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/bean/tableCell.date.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceTableCellRecord {
    'basic-date:date'?: ITableCellOptionsDate;
  }
}
interface ITableCellOptionsDate extends IResourceTableCellOptionsBase {
  preset?: TypeDateFormatPreset;
  format?: string;
}
declare class TableCellDate extends BeanBase implements ITableCellRender {
  render(options: ITableCellOptionsDate, _renderContext: IJsxRenderContextTableCell, next: NextTableCellRender): any;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/lib/utils.d.ts
declare function dateFormatUtil(value: any, options?: ITableCellOptionsDate): any;
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/component/dateRange/controller.d.ts
interface ControllerDateRangeProps {
  separator?: string;
}
interface ControllerDateRangeModels {
  vModel?: string | undefined;
}
declare class ControllerDateRange extends BeanControllerBase {
  static $propsDefault: {
    separator: string;
  };
  private cSeparator;
  modelValue: string | undefined;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
  _parseValue(value?: string): string[];
  _combineValue(dateStartStr: string | undefined, dateEndStr: string | undefined): string | undefined;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/component/formFieldDate/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceFormFieldRecord {
    'basic-date:formFieldDate'?: IResourceFormFieldDateOptions;
  }
}
interface IResourceFormFieldDateOptions extends IResourceFormFieldOptionsBase {
  preset?: TypeDateFormatPreset;
  format?: string;
}
interface ControllerFormFieldDateProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldDateOptions;
}
declare class ControllerFormFieldDate extends BeanControllerBase {
  static $propsDefault: {
    options: {
      preset: string;
    };
  };
  static $componentOptions: IComponentOptions;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
  get dateFormat(): IResourceFormFieldDateOptions | undefined;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/component/formFieldDateRange/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceFormFieldRecord {
    'basic-date:formFieldDateRange'?: IResourceFormFieldDateRangeOptions;
  }
}
interface IResourceFormFieldDateRangeOptions extends IResourceFormFieldOptionsBase {
  separator?: string;
}
interface ControllerFormFieldDateRangeProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldDateRangeOptions;
}
declare class ControllerFormFieldDateRange extends BeanControllerBase {
  static $propsDefault: {};
  static $componentOptions: IComponentOptions;
  cContainer: string;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/.metadata/component/dateRange.d.ts
type ZDateRangeProps = {
  controllerRef?: (ref: ControllerDateRange) => void;
} & ControllerDateRangeProps & ControllerDateRangeModels & { [KEY in keyof ControllerDateRangeModels as TypePropValueFromModel<KEY>]: ControllerDateRangeModels[KEY] } & { [KEY in keyof ControllerDateRangeModels as TypePropUpdateFromModel<KEY>]: (value: ControllerDateRangeModels[KEY]) => void };
type TypeModelArguments$1 = { [KEY in keyof ControllerDateRangeModels as TypePropValueFromModel<KEY>]: ControllerDateRangeModels[KEY] };
type ControllerInnerProps$18 = TypeControllerInnerProps<ControllerDateRangeProps & { [KEY in keyof ControllerDateRangeModels as TypePropValueFromModel<KEY>]: ControllerDateRangeModels[KEY] }, keyof typeof ControllerDateRange.$propsDefault>;
declare module 'zova-module-basic-date' {
  interface ControllerDateRange {
    $props: ControllerInnerProps$18;
    $useModel<K extends keyof TypeModelArguments$1>(name: K, options?: DefineModelOptions<TypeModelArguments$1[K]>): ControllerInnerProps$18[K];
  }
}
declare const ZDateRange: _$vue.DefineSetupFnComponent<ZDateRangeProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerDateRange) => void;
} & ControllerDateRangeProps & ControllerDateRangeModels & {
  modelValue?: string | undefined;
} & {
  "onUpdate:modelValue"?: ((value: string | undefined) => void) | undefined;
} & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-date:dateRange': ControllerDateRangeProps & ControllerDateRangeModels & { [KEY in keyof ControllerDateRangeModels as TypePropValueFromModel<KEY>]: ControllerDateRangeModels[KEY] } & { [KEY in keyof ControllerDateRangeModels as TypePropUpdateFromModel<KEY>]: (value: ControllerDateRangeModels[KEY]) => void };
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/.metadata/component/formFieldDate.d.ts
type ZFormFieldDateProps = {
  controllerRef?: (ref: ControllerFormFieldDate) => void;
} & ControllerFormFieldDateProps;
type ControllerInnerProps$17 = TypeControllerInnerProps<ControllerFormFieldDateProps, keyof typeof ControllerFormFieldDate.$propsDefault>;
declare module 'zova-module-basic-date' {
  interface ControllerFormFieldDate {
    $props: ControllerInnerProps$17;
  }
}
declare const ZFormFieldDate: _$vue.DefineSetupFnComponent<ZFormFieldDateProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerFormFieldDate) => void;
} & ControllerFormFieldDateProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-date:formFieldDate': ControllerFormFieldDateProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/.metadata/component/formFieldDateRange.d.ts
type ZFormFieldDateRangeProps = {
  controllerRef?: (ref: ControllerFormFieldDateRange) => void;
} & ControllerFormFieldDateRangeProps;
type ControllerInnerProps$16 = TypeControllerInnerProps<ControllerFormFieldDateRangeProps, keyof typeof ControllerFormFieldDateRange.$propsDefault>;
declare module 'zova-module-basic-date' {
  interface ControllerFormFieldDateRange {
    $props: ControllerInnerProps$16;
  }
}
declare const ZFormFieldDateRange: _$vue.DefineSetupFnComponent<ZFormFieldDateRangeProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerFormFieldDateRange) => void;
} & ControllerFormFieldDateRangeProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-date:formFieldDateRange': ControllerFormFieldDateRangeProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-date/src/.metadata/index.d.ts
declare module 'zova' {}
declare module 'zova-module-basic-date' {
  interface ControllerDateRange {}
  interface ControllerFormFieldDate {}
  interface ControllerFormFieldDateRange {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'basic-date.controller.dateRange': ControllerDateRange;
    'basic-date.controller.formFieldDate': ControllerFormFieldDate;
    'basic-date.controller.formFieldDateRange': ControllerFormFieldDateRange;
  }
}
/** controller: end */
/** components: begin */
declare module 'zova' {
  interface IComponentRecord {
    'basic-date:dateRange': ControllerDateRange;
    'basic-date:formFieldDate': ControllerFormFieldDate;
    'basic-date:formFieldDateRange': ControllerFormFieldDateRange;
  }
  interface IZovaComponentRecord {
    'basic-date:dateRange': typeof ZDateRange;
    'basic-date:formFieldDate': typeof ZFormFieldDate;
    'basic-date:formFieldDateRange': typeof ZFormFieldDateRange;
  }
}
/** components: end */
/** tableCell: begin */
declare module 'zova-module-a-table' {
  interface ITableCellRecord {
    'basic-date:date': ITableCellOptionsDate;
  }
}
declare module 'zova-module-basic-date' {
  interface TableCellDate {}
  interface TableCellDate {
    get $beanFullName(): 'basic-date.tableCell.date';
    get $onionName(): 'basic-date:date';
    get $onionOptions(): ITableCellOptionsDate;
  }
}
/** tableCell: end */
/** tableCell: begin */
declare module 'zova' {
  interface IBeanRecordGeneral {
    'basic-date.tableCell.date': TableCellDate;
  }
}
/** tableCell: end */
/** scope: begin */
declare class ScopeModuleBasicDate extends BeanScopeBase {}
interface ScopeModuleBasicDate {
  util: BeanScopeUtil;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'basic-date': ScopeModuleBasicDate;
  }
}
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/.metadata/locales.d.ts
declare const locales$3: {
  'en-us': {
    Back: string;
    Submit: string;
  };
  'zh-cn': {
    Back: string;
    Submit: string;
  };
};
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/component/actionBack/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceFormActionRowRecord {
    'basic-form:actionBack'?: ControllerActionBackProps;
  }
}
interface ControllerActionBackProps extends IResourceFormActionRowOptionsBase {}
declare class ControllerActionBack extends BeanControllerBase {
  static $propsDefault: {
    class: string;
  };
  static $componentOptions: IComponentOptions;
  $$renderContext: IJsxRenderContextPageEntry;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/component/actionSubmit/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceFormActionRowRecord {
    'basic-form:actionSubmit'?: ControllerActionSubmitProps;
  }
}
interface ControllerActionSubmitProps extends IResourceFormActionRowOptionsBase {}
declare class ControllerActionSubmit extends BeanControllerBase {
  static $propsDefault: {
    class: string;
  };
  static $componentOptions: IComponentOptions;
  $$renderContext: IJsxRenderContextPageEntry;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
  private onClick;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/.metadata/component/actionBack.d.ts
type ZActionBackProps = {
  controllerRef?: (ref: ControllerActionBack) => void;
} & ControllerActionBackProps;
type ControllerInnerProps$15 = TypeControllerInnerProps<ControllerActionBackProps, keyof typeof ControllerActionBack.$propsDefault>;
declare module 'zova-module-basic-form' {
  interface ControllerActionBack {
    $props: ControllerInnerProps$15;
  }
}
declare const ZActionBack: _$vue.DefineSetupFnComponent<ZActionBackProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerActionBack) => void;
} & ControllerActionBackProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-form:actionBack': ControllerActionBackProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/.metadata/component/actionSubmit.d.ts
type ZActionSubmitProps = {
  controllerRef?: (ref: ControllerActionSubmit) => void;
} & ControllerActionSubmitProps;
type ControllerInnerProps$14 = TypeControllerInnerProps<ControllerActionSubmitProps, keyof typeof ControllerActionSubmit.$propsDefault>;
declare module 'zova-module-basic-form' {
  interface ControllerActionSubmit {
    $props: ControllerInnerProps$14;
  }
}
declare const ZActionSubmit: _$vue.DefineSetupFnComponent<ZActionSubmitProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerActionSubmit) => void;
} & ControllerActionSubmitProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-form:actionSubmit': ControllerActionSubmitProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/bean/behavior.formField.d.ts
interface IBehaviorPropsInputFormField extends IFormFieldRenderContext {}
interface IBehaviorPropsOutputFormField extends IBehaviorPropsInputFormField {}
interface IBehaviorOptionsFormField extends IDecoratorBehaviorOptions {}
declare class BehaviorFormField extends BeanBehaviorBase<IBehaviorOptionsFormField, IBehaviorPropsInputFormField, IBehaviorPropsOutputFormField> {
  $$formField: ControllerFormField;
  protected render(renderContext: IFormFieldRenderContext, next: NextBehavior<IBehaviorPropsOutputFormField>): VNode;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/bean/behavior.formFieldLayout.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceFormFieldLayoutOptions extends IBehaviorResourceFormFieldLayoutOptions {}
}
interface IBehaviorResourceFormFieldLayoutOptions {
  disable?: boolean;
  class?: any;
  style?: types.NestedCSSProperties;
  label?: string | false;
  inline?: boolean;
  bordered?: boolean;
  floating?: boolean;
  iconPrefix?: keyof IIconRecord;
  iconSuffix?: keyof IIconRecord;
  header?: TypeRenderComponentJsx | string;
  footer?: TypeRenderComponentJsx | string;
}
interface IBehaviorPropsInputFormFieldLayout extends IFormFieldRenderContext {}
interface IBehaviorPropsOutputFormFieldLayout extends IBehaviorPropsInputFormFieldLayout {}
interface IBehaviorOptionsFormFieldLayout extends IDecoratorBehaviorOptions {}
declare class BehaviorFormFieldLayout extends BeanBehaviorBase<IBehaviorOptionsFormFieldLayout, IBehaviorPropsInputFormFieldLayout, IBehaviorPropsOutputFormFieldLayout> {
  cFieldRequired: string;
  $$formField: ControllerFormField;
  protected __init__(): Promise<void>;
  protected render(renderContext: IFormFieldRenderContext, next: NextBehavior<IBehaviorPropsOutputFormFieldLayout>): VNode;
  private _renderInline;
  private _renderBlock;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-form/src/.metadata/index.d.ts
declare module 'zova' {}
declare module 'zova-module-basic-form' {
  interface ControllerActionBack {}
  interface ControllerActionSubmit {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'basic-form.controller.actionBack': ControllerActionBack;
    'basic-form.controller.actionSubmit': ControllerActionSubmit;
  }
}
/** controller: end */
/** components: begin */
declare module 'zova' {
  interface IComponentRecord {
    'basic-form:actionBack': ControllerActionBack;
    'basic-form:actionSubmit': ControllerActionSubmit;
  }
  interface IZovaComponentRecord {
    'basic-form:actionBack': typeof ZActionBack;
    'basic-form:actionSubmit': typeof ZActionSubmit;
  }
}
/** components: end */
/** behavior: begin */
declare module 'zova-module-a-behavior' {
  interface IBehaviorRecord {
    'basic-form:formField': IBehaviorOptionsFormField;
    'basic-form:formFieldLayout': IBehaviorOptionsFormFieldLayout;
  }
}
declare module 'zova-module-basic-form' {
  interface BehaviorFormField {}
  interface BehaviorFormField {
    get $beanFullName(): 'basic-form.behavior.formField';
    get $onionName(): 'basic-form:formField';
    get $onionOptions(): IBehaviorOptionsFormField;
  }
  interface BehaviorFormFieldLayout {}
  interface BehaviorFormFieldLayout {
    get $beanFullName(): 'basic-form.behavior.formFieldLayout';
    get $onionName(): 'basic-form:formFieldLayout';
    get $onionOptions(): IBehaviorOptionsFormFieldLayout;
  }
}
/** behavior: end */
/** behavior: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'basic-form.behavior.formField': BehaviorFormField;
    'basic-form.behavior.formFieldLayout': BehaviorFormFieldLayout;
  }
}
/** behavior: end */
/** behaviors: begin */
declare module 'vue' {
  interface InputHTMLAttributes {
    'bs-basic-form-formField'?: IBehaviorOptionsFormField | '' | boolean;
    'bs-basic-form-formFieldLayout'?: IBehaviorOptionsFormFieldLayout | '' | boolean;
  }
}
declare module 'vue/jsx-runtime' {
  namespace JSX {
    interface IntrinsicAttributes {
      'bs-basic-form-formField'?: IBehaviorOptionsFormField | '' | boolean;
      'bs-basic-form-formFieldLayout'?: IBehaviorOptionsFormFieldLayout | '' | boolean;
    }
  }
}
/** behaviors: end */
/** locale: begin */
declare class ScopeModuleBasicForm extends BeanScopeBase {}
interface ScopeModuleBasicForm {
  util: BeanScopeUtil;
  locale: TypeModuleLocales<(typeof locales$3)[TypeLocaleBase]>;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'basic-form': ScopeModuleBasicForm;
  }
  interface IBeanScopeLocale {
    'basic-form': (typeof locales$3)[TypeLocaleBase];
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-input/src/component/formFieldInput/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceFormFieldRecord {
    'basic-input:formFieldInput'?: IResourceFormFieldInputOptions;
  }
}
interface IResourceFormFieldInputOptions extends IResourceFormFieldOptionsBase {
  value?: any;
  type?: HTMLInputElementType;
  placeholder?: string;
  onChange?: (e: Event) => void;
  onInput?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}
interface ControllerFormFieldInputProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldInputOptions;
}
declare class ControllerFormFieldInput extends BeanControllerBase {
  static $propsDefault: {};
  static $componentOptions: IComponentOptions;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-input/src/.metadata/component/formFieldInput.d.ts
type ZFormFieldInputProps = {
  controllerRef?: (ref: ControllerFormFieldInput) => void;
} & ControllerFormFieldInputProps;
type ControllerInnerProps$13 = TypeControllerInnerProps<ControllerFormFieldInputProps, keyof typeof ControllerFormFieldInput.$propsDefault>;
declare module 'zova-module-basic-input' {
  interface ControllerFormFieldInput {
    $props: ControllerInnerProps$13;
  }
}
declare const ZFormFieldInput: _$vue.DefineSetupFnComponent<ZFormFieldInputProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerFormFieldInput) => void;
} & ControllerFormFieldInputProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-input:formFieldInput': ControllerFormFieldInputProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-input/src/.metadata/index.d.ts
declare module 'zova' {}
declare module 'zova-module-basic-input' {
  interface ControllerFormFieldInput {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'basic-input.controller.formFieldInput': ControllerFormFieldInput;
  }
}
/** controller: end */
/** components: begin */
declare module 'zova' {
  interface IComponentRecord {
    'basic-input:formFieldInput': ControllerFormFieldInput;
  }
  interface IZovaComponentRecord {
    'basic-input:formFieldInput': typeof ZFormFieldInput;
  }
}
/** components: end */
/** scope: begin */
declare class ScopeModuleBasicInput extends BeanScopeBase {}
interface ScopeModuleBasicInput {
  util: BeanScopeUtil;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'basic-input': ScopeModuleBasicInput;
  }
}
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/.metadata/locales.d.ts
declare const locales$2: {
  'en-us': {
    Search: string;
    Reset: string;
    PagedTotalItems: string;
    PagedTotalPages: string;
  };
  'zh-cn': {
    Search: string;
    Reset: string;
    PagedTotalItems: string;
    PagedTotalPages: string;
  };
};
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceBlockRecord {
    'basic-page:blockPage'?: ControllerBlockPageProps;
  }
}
interface ControllerBlockPageProps extends IResourceBlockOptionsBase {
  blocks?: IResourceRenderBlockOptionsBlock[];
  resource?: string;
  pageSize?: number;
}
declare class ControllerBlockPage<TData extends {} = {}> extends BeanControllerBase {
  static $propsDefault: {
    pageSize: number;
  };
  static $componentOptions: IComponentOptions;
  tableRef: BeanControllerTableBase<TData>;
  jsxZova: ZovaJsx;
  jsxCelScope: IPageScope;
  jsxRenderContext: IJsxRenderContextPage<TData>;
  queryFilterData: {};
  queryPaged: ITablePaged;
  query: ITableQuery;
  $$modelResource: ModelResource<TData>;
  protected __init__(): Promise<void>;
  get resource(): string | undefined;
  get queryData(): _$vue.UnwrapNestedRefs<_$_tanstack_vue_query0.UseQueryReturnType<_$zova_module_a_openapi0.ITableRes<TData>, Error>>;
  get data(): TData[] | undefined;
  get paged(): ITableResPaged | undefined;
  get schemaFilter(): _$zova_module_a_openapi0.ISchemaObjectExtensionField | undefined;
  get schemaRow(): _$zova_module_a_openapi0.ISchemaObjectExtensionField | undefined;
  get permissions(): _$zova_module_a_openapi0.TypeOpenapiPermissions | undefined;
  gotoPage(pageNo: number): void;
  setPageSize(pageSize: number): void;
  onFilter(data: any): void;
  private _prepareJsx;
  private _prepareJsxCelScope;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
  private _renderBlocks;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/types/page.d.ts
declare module 'zova-module-a-openapi' {
  interface IJsxRenderContextPage<TData extends {} = {}> {
    $$page: ControllerBlockPage<TData>;
  }
}
declare module 'zova-module-a-table' {
  interface ITableScope extends IPageScope {}
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/component/blockFilter/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceBlockRecord {
    'basic-page:blockFilter'?: ControllerBlockFilterProps;
  }
}
interface ControllerBlockFilterProps extends IResourceBlockOptionsBase {}
declare class ControllerBlockFilter extends BeanControllerBase {
  static $propsDefault: {};
  static $componentOptions: IComponentOptions;
  formMeta: IFormMeta;
  formFieldLayout: IResourceFormFieldLayoutOptions;
  $$renderContext: IJsxRenderContextPage;
  protected __init__(): Promise<void>;
  get schemaFilter(): _$zova_module_a_openapi0.ISchemaObjectExtensionField | undefined;
  submitData(data: TypeFormOnSubmitData): void;
  resetData(data: any): void;
  _onFilter(dataOld: any): void;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/component/blockPager/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceBlockRecord {
    'basic-page:blockPager'?: ControllerBlockPagerProps;
  }
}
interface ControllerBlockPagerProps extends IResourceBlockOptionsBase {}
declare class ControllerBlockPager extends BeanControllerBase {
  static $propsDefault: {};
  static $componentOptions: IComponentOptions;
  $$renderContext: IJsxRenderContextPage;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element | undefined;
  private _renderPager;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceBlockRecord {
    'basic-page:blockTable'?: ControllerBlockTableProps;
  }
}
interface ControllerBlockTableProps extends IResourceBlockOptionsBase {}
declare class ControllerBlockTable<TData extends {} = {}> extends BeanControllerBase {
  static $propsDefault: {};
  static $componentOptions: IComponentOptions;
  tableRef: BeanControllerTableBase<TData>;
  $$renderContext: IJsxRenderContextPage;
  protected __init__(): Promise<void>;
  get permissions(): _$zova_module_a_openapi0.TypeOpenapiPermissions | undefined;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/component/blockToolbarBulk/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceBlockRecord {
    'basic-page:blockToolbarBulk'?: ControllerBlockToolbarBulkProps;
  }
}
interface ControllerBlockToolbarBulkProps extends IResourceBlockOptionsBase {
  actions?: IResourceRenderTableActionBulkOptionsAction[];
}
declare class ControllerBlockToolbarBulk extends BeanControllerBase {
  static $propsDefault: {};
  static $componentOptions: IComponentOptions;
  $$renderContext: IJsxRenderContextPage;
  protected __init__(): Promise<void>;
  get permissions(): _$zova_module_a_openapi0.TypeOpenapiPermissions | undefined;
  protected render(): _$vue_jsx_runtime0.JSX.Element | undefined;
  private _renderActions;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/.metadata/component/blockFilter.d.ts
type ZBlockFilterProps = {
  controllerRef?: (ref: ControllerBlockFilter) => void;
} & ControllerBlockFilterProps;
type ControllerInnerProps$12 = TypeControllerInnerProps<ControllerBlockFilterProps, keyof typeof ControllerBlockFilter.$propsDefault>;
declare module 'zova-module-basic-page' {
  interface ControllerBlockFilter {
    $props: ControllerInnerProps$12;
  }
}
declare const ZBlockFilter: _$vue.DefineSetupFnComponent<ZBlockFilterProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerBlockFilter) => void;
} & ControllerBlockFilterProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-page:blockFilter': ControllerBlockFilterProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/.metadata/component/blockPage.d.ts
type ZBlockPageProps = {
  controllerRef?: (ref: ControllerBlockPage) => void;
} & ControllerBlockPageProps;
type ControllerInnerProps$11 = TypeControllerInnerProps<ControllerBlockPageProps, keyof typeof ControllerBlockPage.$propsDefault>;
declare module 'zova-module-basic-page' {
  interface ControllerBlockPage {
    $props: ControllerInnerProps$11;
  }
}
declare const ZBlockPage: _$vue.DefineSetupFnComponent<ZBlockPageProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerBlockPage) => void;
} & ControllerBlockPageProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-page:blockPage': ControllerBlockPageProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/.metadata/component/blockPager.d.ts
type ZBlockPagerProps = {
  controllerRef?: (ref: ControllerBlockPager) => void;
} & ControllerBlockPagerProps;
type ControllerInnerProps$10 = TypeControllerInnerProps<ControllerBlockPagerProps, keyof typeof ControllerBlockPager.$propsDefault>;
declare module 'zova-module-basic-page' {
  interface ControllerBlockPager {
    $props: ControllerInnerProps$10;
  }
}
declare const ZBlockPager: _$vue.DefineSetupFnComponent<ZBlockPagerProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerBlockPager) => void;
} & ControllerBlockPagerProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-page:blockPager': ControllerBlockPagerProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/.metadata/component/blockTable.d.ts
type ZBlockTableProps = {
  controllerRef?: (ref: ControllerBlockTable) => void;
} & ControllerBlockTableProps;
type ControllerInnerProps$9 = TypeControllerInnerProps<ControllerBlockTableProps, keyof typeof ControllerBlockTable.$propsDefault>;
declare module 'zova-module-basic-page' {
  interface ControllerBlockTable {
    $props: ControllerInnerProps$9;
  }
}
declare const ZBlockTable: _$vue.DefineSetupFnComponent<ZBlockTableProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerBlockTable) => void;
} & ControllerBlockTableProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-page:blockTable': ControllerBlockTableProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/.metadata/component/blockToolbarBulk.d.ts
type ZBlockToolbarBulkProps = {
  controllerRef?: (ref: ControllerBlockToolbarBulk) => void;
} & ControllerBlockToolbarBulkProps;
type ControllerInnerProps$8 = TypeControllerInnerProps<ControllerBlockToolbarBulkProps, keyof typeof ControllerBlockToolbarBulk.$propsDefault>;
declare module 'zova-module-basic-page' {
  interface ControllerBlockToolbarBulk {
    $props: ControllerInnerProps$8;
  }
}
declare const ZBlockToolbarBulk: _$vue.DefineSetupFnComponent<ZBlockToolbarBulkProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerBlockToolbarBulk) => void;
} & ControllerBlockToolbarBulkProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-page:blockToolbarBulk': ControllerBlockToolbarBulkProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-page/src/.metadata/index.d.ts
declare module 'zova' {}
declare module 'zova-module-basic-page' {
  interface ControllerBlockFilter {}
  interface ControllerBlockPage {}
  interface ControllerBlockPager {}
  interface ControllerBlockTable {}
  interface ControllerBlockToolbarBulk {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'basic-page.controller.blockFilter': ControllerBlockFilter;
    'basic-page.controller.blockPage': ControllerBlockPage;
    'basic-page.controller.blockPager': ControllerBlockPager;
    'basic-page.controller.blockTable': ControllerBlockTable;
    'basic-page.controller.blockToolbarBulk': ControllerBlockToolbarBulk;
  }
}
/** controller: end */
/** components: begin */
declare module 'zova' {
  interface IComponentRecord {
    'basic-page:blockFilter': ControllerBlockFilter;
    'basic-page:blockPage': ControllerBlockPage;
    'basic-page:blockPager': ControllerBlockPager;
    'basic-page:blockTable': ControllerBlockTable;
    'basic-page:blockToolbarBulk': ControllerBlockToolbarBulk;
  }
  interface IZovaComponentRecord {
    'basic-page:blockFilter': typeof ZBlockFilter;
    'basic-page:blockPage': typeof ZBlockPage;
    'basic-page:blockPager': typeof ZBlockPager;
    'basic-page:blockTable': typeof ZBlockTable;
    'basic-page:blockToolbarBulk': typeof ZBlockToolbarBulk;
  }
}
/** components: end */
/** locale: begin */
declare class ScopeModuleBasicPage extends BeanScopeBase {}
interface ScopeModuleBasicPage {
  util: BeanScopeUtil;
  locale: TypeModuleLocales<(typeof locales$2)[TypeLocaleBase]>;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'basic-page': ScopeModuleBasicPage;
  }
  interface IBeanScopeLocale {
    'basic-page': (typeof locales$2)[TypeLocaleBase];
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/.metadata/locales.d.ts
declare const locales$1: {
  'en-us': {
    EntryNotExist: string;
  };
  'zh-cn': {
    EntryNotExist: string;
  };
};
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceBlockRecord {
    'basic-pageentry:blockPageEntry'?: ControllerBlockPageEntryProps;
  }
}
interface ControllerBlockPageEntryProps extends IResourceBlockOptionsBase {
  blocks?: IResourceRenderBlockOptionsBlock[];
  resource?: string;
  id?: TableIdentity;
  formScene?: TypeFormScene;
  pageTitleKey?: string;
}
declare class ControllerBlockPageEntry<TData extends {} = {}> extends BeanControllerBase {
  static $propsDefault: {
    pageTitleKey: string;
  };
  static $componentOptions: IComponentOptions;
  entryIdCreated?: TableIdentity;
  formRef: BeanControllerFormBase;
  formMeta: IFormMeta;
  formProvider: IFormProvider;
  formSchema?: SchemaObject;
  formData?: TData;
  jsxZova: ZovaJsx;
  jsxCelScope: IPageEntryScope;
  jsxRenderContext: IJsxRenderContextPageEntry<TData>;
  $$modelResource: ModelResource<TData>;
  protected __init__(): Promise<void>;
  get resource(): string | undefined;
  get entryId(): TableIdentity | undefined;
  get formScene(): TypeFormScene;
  get schemaScene(): TypeFormSchemaScene;
  get queryData(): {
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isEnabled: boolean;
    refetch: (options?: _$_tanstack_query_core0.RefetchOptions) => Promise<_$_tanstack_query_core0.QueryObserverResult<NonNullable<Awaited<TData>> | null, Error>>;
    fetchStatus: _$_tanstack_query_core0.FetchStatus;
    promise: Promise<NonNullable<Awaited<TData>> | null>;
    data: undefined;
    error: Error;
    isError: true;
    isPending: false;
    isLoading: false;
    isLoadingError: true;
    isRefetchError: false;
    isSuccess: false;
    isPlaceholderData: false;
    status: 'error';
    suspense: () => Promise<_$_tanstack_query_core0.QueryObserverResult<NonNullable<Awaited<TData>> | null, Error>>;
  } | {
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isLoading: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isEnabled: boolean;
    refetch: (options?: _$_tanstack_query_core0.RefetchOptions) => Promise<_$_tanstack_query_core0.QueryObserverResult<NonNullable<Awaited<TData>> | null, Error>>;
    fetchStatus: _$_tanstack_query_core0.FetchStatus;
    promise: Promise<NonNullable<Awaited<TData>> | null>;
    data: undefined;
    error: null;
    isError: false;
    isPending: true;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: false;
    isPlaceholderData: false;
    status: 'pending';
    suspense: () => Promise<_$_tanstack_query_core0.QueryObserverResult<NonNullable<Awaited<TData>> | null, Error>>;
  } | {
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isEnabled: boolean;
    refetch: (options?: _$_tanstack_query_core0.RefetchOptions) => Promise<_$_tanstack_query_core0.QueryObserverResult<NonNullable<Awaited<TData>> | null, Error>>;
    fetchStatus: _$_tanstack_query_core0.FetchStatus;
    promise: Promise<NonNullable<Awaited<TData>> | null>;
    data: NonNullable<Awaited<TData>> | null;
    isError: false;
    error: null;
    isPending: false;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: true;
    isPlaceholderData: true;
    status: 'success';
    suspense: () => Promise<_$_tanstack_query_core0.QueryObserverResult<NonNullable<Awaited<TData>> | null, Error>>;
  } | {
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isEnabled: boolean;
    refetch: (options?: _$_tanstack_query_core0.RefetchOptions) => Promise<_$_tanstack_query_core0.QueryObserverResult<NonNullable<Awaited<TData>> | null, Error>>;
    fetchStatus: _$_tanstack_query_core0.FetchStatus;
    promise: Promise<NonNullable<Awaited<TData>> | null>;
    data: NonNullable<Awaited<TData>> | null;
    error: Error;
    isError: true;
    isPending: false;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: true;
    isSuccess: false;
    isPlaceholderData: false;
    status: 'error';
    suspense: () => Promise<_$_tanstack_query_core0.QueryObserverResult<NonNullable<Awaited<TData>> | null, Error>>;
  } | {
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    failureReason: Error | null;
    errorUpdateCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isInitialLoading: boolean;
    isPaused: boolean;
    isRefetching: boolean;
    isStale: boolean;
    isEnabled: boolean;
    refetch: (options?: _$_tanstack_query_core0.RefetchOptions) => Promise<_$_tanstack_query_core0.QueryObserverResult<NonNullable<Awaited<TData>> | null, Error>>;
    fetchStatus: _$_tanstack_query_core0.FetchStatus;
    promise: Promise<NonNullable<Awaited<TData>> | null>;
    data: NonNullable<Awaited<TData>> | null;
    error: null;
    isError: false;
    isPending: false;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: true;
    isPlaceholderData: false;
    status: 'success';
    suspense: () => Promise<_$_tanstack_query_core0.QueryObserverResult<NonNullable<Awaited<TData>> | null, Error>>;
  } | undefined;
  private _prepareJsx;
  private _prepareJsxCelScope;
  submitData(data: TypeFormOnSubmitData<TData>): Promise<void>;
  setPageMeta(data: any | undefined, pageDirty?: boolean): void;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
  private _renderFormWrapper;
  private _renderBlocks;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/types/pageEntry.d.ts
declare module 'zova-module-a-openapi' {
  interface IJsxRenderContextPageEntry<TData extends {} = {}> {
    $$pageEntry: ControllerBlockPageEntry<TData>;
  }
}
declare module 'zova-module-a-form' {
  interface IFormScope extends IPageEntryScope {}
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockForm/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceBlockRecord {
    'basic-pageentry:blockForm'?: ControllerBlockFormProps;
  }
}
interface ControllerBlockFormProps extends IResourceBlockOptionsBase {}
declare class ControllerBlockForm extends BeanControllerBase {
  static $propsDefault: {};
  static $componentOptions: IComponentOptions;
  formRef: BeanControllerFormBase;
  $$renderContext: IJsxRenderContextPageEntry;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockToolbarRow/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceBlockRecord {
    'basic-pageentry:blockToolbarRow'?: ControllerBlockToolbarRowProps;
  }
}
interface ControllerBlockToolbarRowProps extends IResourceBlockOptionsBase {
  actions?: IResourceRenderFormActionRowOptionsAction[];
}
declare class ControllerBlockToolbarRow extends BeanControllerBase {
  static $propsDefault: {};
  static $componentOptions: IComponentOptions;
  $$renderContext: IJsxRenderContextPageEntry;
  protected __init__(): Promise<void>;
  get permissions(): _$zova_module_a_openapi0.TypeOpenapiPermissions | undefined;
  protected render(): _$vue_jsx_runtime0.JSX.Element | undefined;
  private _renderActions;
  private _checkFormScene;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/.metadata/component/blockForm.d.ts
type ZBlockFormProps = {
  controllerRef?: (ref: ControllerBlockForm) => void;
} & ControllerBlockFormProps;
type ControllerInnerProps$7 = TypeControllerInnerProps<ControllerBlockFormProps, keyof typeof ControllerBlockForm.$propsDefault>;
declare module 'zova-module-basic-pageentry' {
  interface ControllerBlockForm {
    $props: ControllerInnerProps$7;
  }
}
declare const ZBlockForm: _$vue.DefineSetupFnComponent<ZBlockFormProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerBlockForm) => void;
} & ControllerBlockFormProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-pageentry:blockForm': ControllerBlockFormProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/.metadata/component/blockPageEntry.d.ts
type ZBlockPageEntryProps = {
  controllerRef?: (ref: ControllerBlockPageEntry) => void;
} & ControllerBlockPageEntryProps;
type ControllerInnerProps$6 = TypeControllerInnerProps<ControllerBlockPageEntryProps, keyof typeof ControllerBlockPageEntry.$propsDefault>;
declare module 'zova-module-basic-pageentry' {
  interface ControllerBlockPageEntry {
    $props: ControllerInnerProps$6;
  }
}
declare const ZBlockPageEntry: _$vue.DefineSetupFnComponent<ZBlockPageEntryProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerBlockPageEntry) => void;
} & ControllerBlockPageEntryProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-pageentry:blockPageEntry': ControllerBlockPageEntryProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/.metadata/component/blockToolbarRow.d.ts
type ZBlockToolbarRowProps = {
  controllerRef?: (ref: ControllerBlockToolbarRow) => void;
} & ControllerBlockToolbarRowProps;
type ControllerInnerProps$5 = TypeControllerInnerProps<ControllerBlockToolbarRowProps, keyof typeof ControllerBlockToolbarRow.$propsDefault>;
declare module 'zova-module-basic-pageentry' {
  interface ControllerBlockToolbarRow {
    $props: ControllerInnerProps$5;
  }
}
declare const ZBlockToolbarRow: _$vue.DefineSetupFnComponent<ZBlockToolbarRowProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerBlockToolbarRow) => void;
} & ControllerBlockToolbarRowProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-pageentry:blockToolbarRow': ControllerBlockToolbarRowProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-pageentry/src/.metadata/index.d.ts
declare module 'zova' {}
declare module 'zova-module-basic-pageentry' {
  interface ControllerBlockForm {}
  interface ControllerBlockPageEntry {}
  interface ControllerBlockToolbarRow {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'basic-pageentry.controller.blockForm': ControllerBlockForm;
    'basic-pageentry.controller.blockPageEntry': ControllerBlockPageEntry;
    'basic-pageentry.controller.blockToolbarRow': ControllerBlockToolbarRow;
  }
}
/** controller: end */
/** components: begin */
declare module 'zova' {
  interface IComponentRecord {
    'basic-pageentry:blockForm': ControllerBlockForm;
    'basic-pageentry:blockPageEntry': ControllerBlockPageEntry;
    'basic-pageentry:blockToolbarRow': ControllerBlockToolbarRow;
  }
  interface IZovaComponentRecord {
    'basic-pageentry:blockForm': typeof ZBlockForm;
    'basic-pageentry:blockPageEntry': typeof ZBlockPageEntry;
    'basic-pageentry:blockToolbarRow': typeof ZBlockToolbarRow;
  }
}
/** components: end */
/** locale: begin */
declare class ScopeModuleBasicPageentry extends BeanScopeBase {}
interface ScopeModuleBasicPageentry {
  util: BeanScopeUtil;
  locale: TypeModuleLocales<(typeof locales$1)[TypeLocaleBase]>;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'basic-pageentry': ScopeModuleBasicPageentry;
  }
  interface IBeanScopeLocale {
    'basic-pageentry': (typeof locales$1)[TypeLocaleBase];
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-select/src/component/select/controller.d.ts
interface ControllerSelectProps {
  placeholder?: string;
  items?: any[] | undefined;
  itemTitle?: string;
  itemValue?: string;
}
interface ControllerSelectModels {
  vModel?: any;
}
declare class ControllerSelect extends BeanControllerBase {
  static $propsDefault: {
    itemValue: string;
    itemTitle: string;
  };
  modelValue?: any;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-select/src/.metadata/component/select.d.ts
type ZSelectProps = {
  controllerRef?: (ref: ControllerSelect) => void;
} & ControllerSelectProps & ControllerSelectModels & { [KEY in keyof ControllerSelectModels as TypePropValueFromModel<KEY>]: ControllerSelectModels[KEY] } & { [KEY in keyof ControllerSelectModels as TypePropUpdateFromModel<KEY>]: (value: ControllerSelectModels[KEY]) => void };
type TypeModelArguments = { [KEY in keyof ControllerSelectModels as TypePropValueFromModel<KEY>]: ControllerSelectModels[KEY] };
type ControllerInnerProps$4 = TypeControllerInnerProps<ControllerSelectProps & { [KEY in keyof ControllerSelectModels as TypePropValueFromModel<KEY>]: ControllerSelectModels[KEY] }, keyof typeof ControllerSelect.$propsDefault>;
declare module 'zova-module-basic-select' {
  interface ControllerSelect {
    $props: ControllerInnerProps$4;
    $useModel<K extends keyof TypeModelArguments>(name: K, options?: DefineModelOptions<TypeModelArguments[K]>): ControllerInnerProps$4[K];
  }
}
declare const ZSelect: _$vue.DefineSetupFnComponent<ZSelectProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerSelect) => void;
} & ControllerSelectProps & ControllerSelectModels & {
  modelValue?: any;
} & {
  "onUpdate:modelValue"?: ((value: any) => void) | undefined;
} & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-select:select': ControllerSelectProps & ControllerSelectModels & { [KEY in keyof ControllerSelectModels as TypePropValueFromModel<KEY>]: ControllerSelectModels[KEY] } & { [KEY in keyof ControllerSelectModels as TypePropUpdateFromModel<KEY>]: (value: ControllerSelectModels[KEY]) => void };
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-select/src/component/formFieldSelect/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceFormFieldRecord {
    'basic-select:formFieldSelect'?: IResourceFormFieldSelectOptions;
  }
}
interface IResourceFormFieldSelectOptions extends IResourceFormFieldOptionsBase, ZSelectProps {}
interface ControllerFormFieldSelectProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldSelectOptions;
}
declare class ControllerFormFieldSelect extends BeanControllerBase {
  static $propsDefault: {
    options: {
      itemValue: string;
      itemTitle: string;
    };
  };
  static $componentOptions: IComponentOptions;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
  private _getValueByItems;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-select/src/.metadata/component/formFieldSelect.d.ts
type ZFormFieldSelectProps = {
  controllerRef?: (ref: ControllerFormFieldSelect) => void;
} & ControllerFormFieldSelectProps;
type ControllerInnerProps$3 = TypeControllerInnerProps<ControllerFormFieldSelectProps, keyof typeof ControllerFormFieldSelect.$propsDefault>;
declare module 'zova-module-basic-select' {
  interface ControllerFormFieldSelect {
    $props: ControllerInnerProps$3;
  }
}
declare const ZFormFieldSelect: _$vue.DefineSetupFnComponent<ZFormFieldSelectProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerFormFieldSelect) => void;
} & ControllerFormFieldSelectProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-select:formFieldSelect': ControllerFormFieldSelectProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-select/src/bean/tableCell.select.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceTableCellRecord {
    'basic-select:select'?: ITableCellOptionsSelect;
  }
}
interface ITableCellOptionsSelect extends IResourceTableCellOptionsBase, ZSelectProps {}
declare class TableCellSelect extends BeanBase implements ITableCellRender {
  render(options: ITableCellOptionsSelect, _renderContext: IJsxRenderContextTableCell, next: NextTableCellRender): any;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-select/src/.metadata/index.d.ts
declare module 'zova' {}
declare module 'zova-module-basic-select' {
  interface ControllerFormFieldSelect {}
  interface ControllerSelect {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'basic-select.controller.formFieldSelect': ControllerFormFieldSelect;
    'basic-select.controller.select': ControllerSelect;
  }
}
/** controller: end */
/** components: begin */
declare module 'zova' {
  interface IComponentRecord {
    'basic-select:formFieldSelect': ControllerFormFieldSelect;
    'basic-select:select': ControllerSelect;
  }
  interface IZovaComponentRecord {
    'basic-select:formFieldSelect': typeof ZFormFieldSelect;
    'basic-select:select': typeof ZSelect;
  }
}
/** components: end */
/** tableCell: begin */
declare module 'zova-module-a-table' {
  interface ITableCellRecord {
    'basic-select:select': ITableCellOptionsSelect;
  }
}
declare module 'zova-module-basic-select' {
  interface TableCellSelect {}
  interface TableCellSelect {
    get $beanFullName(): 'basic-select.tableCell.select';
    get $onionName(): 'basic-select:select';
    get $onionOptions(): ITableCellOptionsSelect;
  }
}
/** tableCell: end */
/** tableCell: begin */
declare module 'zova' {
  interface IBeanRecordGeneral {
    'basic-select.tableCell.select': TableCellSelect;
  }
}
/** tableCell: end */
/** scope: begin */
declare class ScopeModuleBasicSelect extends BeanScopeBase {}
interface ScopeModuleBasicSelect {
  util: BeanScopeUtil;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'basic-select': ScopeModuleBasicSelect;
  }
}
/** scope: end */
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/component/actionCreate/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceTableActionBulkRecord {
    'basic-table:actionCreate'?: ControllerActionCreateProps;
  }
}
interface ControllerActionCreateProps extends IResourceTableActionBulkOptionsBase {}
declare class ControllerActionCreate extends BeanControllerBase {
  static $propsDefault: {
    class: string;
  };
  static $componentOptions: IComponentOptions;
  $$renderContext: IJsxRenderContextPage;
  protected __init__(): Promise<void>;
  protected render(): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/component/table/controller.d.ts
interface ControllerTableProps<TData extends {} = {}> extends ControllerTableProps$1<TData> {}
declare class ControllerTable extends BeanControllerBase {
  static $propsDefault: {};
  protected __init__(): Promise<void>;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/.metadata/component/actionCreate.d.ts
type ZActionCreateProps = {
  controllerRef?: (ref: ControllerActionCreate) => void;
} & ControllerActionCreateProps;
type ControllerInnerProps$2 = TypeControllerInnerProps<ControllerActionCreateProps, keyof typeof ControllerActionCreate.$propsDefault>;
declare module 'zova-module-basic-table' {
  interface ControllerActionCreate {
    $props: ControllerInnerProps$2;
  }
}
declare const ZActionCreate: _$vue.DefineSetupFnComponent<ZActionCreateProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerActionCreate) => void;
} & ControllerActionCreateProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-table:actionCreate': ControllerActionCreateProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/.metadata/component/table.d.ts
type ZTableProps<TData extends {} = {}> = {
  controllerRef?: (ref: ControllerTable<TData>) => void;
} & ControllerTableProps<TData>;
type ControllerInnerProps$1<TData extends {} = {}> = TypeControllerInnerProps<ControllerTableProps<TData>, keyof typeof ControllerTable.$propsDefault>;
declare module 'zova-module-basic-table' {
  interface ControllerTable<TData extends {} = {}> {
    $props: ControllerInnerProps$1<TData>;
  }
}
declare module 'zova-module-basic-table' {
  interface RenderTable<TData extends {} = {}> extends ControllerTable<TData> {}
}
declare const ZTable: new <TData extends {} = {}>(props: ({
  controllerRef?: ((ref: ControllerTable<TData>) => void) | undefined;
} & ControllerTableProps<TData> & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
})) & _$vue.VNodeProps & _$vue.AllowedComponentProps & _$vue.ComponentCustomProps) => _$vue.CreateComponentPublicInstanceWithMixins<{
  controllerRef?: ((ref: ControllerTable<TData>) => void) | undefined;
} & ControllerTableProps<TData> & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), {}, {}, {}, {}, _$vue.ComponentOptionsMixin, _$vue.ComponentOptionsMixin, _$vue.EmitsOptions, _$vue.PublicProps, {}, false, {}, _$vue.SlotsType<Record<string, any>>, {}, {}, string, {}, any, _$vue.ComponentProvideOptions, {
  P: {};
  B: {};
  D: {};
  C: {};
  M: {};
  Defaults: {};
}, {} & ({
  controllerRef?: ((ref: ControllerTable<TData>) => void) | undefined;
} & ControllerTableProps<TData> & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
})), {}, {}, {}, {}, {}>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-table:table': ControllerTableProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/component/table/render.d.ts
declare class RenderTable<TData extends {} = {}> extends BeanRenderBase {
  render(): _$vue_jsx_runtime0.JSX.Element;
  _renderTable($$table: ControllerTable$1<TData>): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionDelete.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceTableActionRowRecord {
    'basic-table:actionDelete'?: ITableCellOptionsActionDelete;
  }
}
interface ITableCellOptionsActionDelete extends IResourceTableActionRowOptionsBase {}
declare class TableCellActionDelete extends BeanBase implements ITableCellRender {
  render(options: ITableCellOptionsActionDelete, renderContext: IJsxRenderContextTableCell, _next: NextTableCellRender): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionOperationsRow.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceTableActionRowRecord {
    'basic-table:actionOperationsRow'?: ITableCellOptionsActionOperationsRow;
  }
}
interface ITableCellOptionsActionOperationsRow extends IResourceTableActionRowOptionsBase {
  actions?: IResourceRenderTableActionRowOptionsAction[];
}
declare class TableCellActionOperationsRow extends BeanBase implements ITableCellRender {
  checkVisible(options: ITableCellOptionsActionOperationsRow, renderContext: IJsxRenderContextTableColumn): Promise<boolean>;
  render(options: ITableCellOptionsActionOperationsRow, renderContext: IJsxRenderContextTableCell, _next: NextTableCellRender): _$vue_jsx_runtime0.JSX.Element | undefined;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionUpdate.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceTableActionRowRecord {
    'basic-table:actionUpdate'?: ITableCellOptionsActionUpdate;
  }
}
interface ITableCellOptionsActionUpdate extends IResourceTableActionRowOptionsBase {}
declare class TableCellActionUpdate extends BeanBase implements ITableCellRender {
  render(options: ITableCellOptionsActionUpdate, renderContext: IJsxRenderContextTableCell, _next: NextTableCellRender): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionView.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceTableActionRowRecord {
    'basic-table:actionView'?: ITableCellOptionsActionView;
  }
}
interface ITableCellOptionsActionView extends IResourceTableActionRowOptionsBase {}
declare class TableCellActionView extends BeanBase implements ITableCellRender {
  render(options: ITableCellOptionsActionView, renderContext: IJsxRenderContextTableCell, next: NextTableCellRender): _$vue_jsx_runtime0.JSX.Element;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/.metadata/locales.d.ts
declare const locales: {
  'en-us': {
    Create: string;
    DeleteConfirm: string;
  };
  'zh-cn': {
    Create: string;
    DeleteConfirm: string;
  };
};
//#endregion
//#region src/suite/cabloy-basic/modules/basic-table/src/.metadata/index.d.ts
declare module 'zova' {}
declare module 'zova-module-basic-table' {
  interface ControllerActionCreate {}
  interface ControllerTable {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'basic-table.controller.actionCreate': ControllerActionCreate;
    'basic-table.controller.table': ControllerTable;
  }
}
/** controller: end */
/** components: begin */
declare module 'zova' {
  interface IComponentRecord {
    'basic-table:actionCreate': ControllerActionCreate;
    'basic-table:table': ControllerTable;
  }
  interface IZovaComponentRecord {
    'basic-table:actionCreate': typeof ZActionCreate;
    'basic-table:table': typeof ZTable;
  }
}
/** components: end */
/** render: begin */
declare module 'zova' {}
declare module 'zova-module-basic-table' {
  interface RenderTable {}
}
/** render: end */
/** render: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'basic-table.render.table': RenderTable;
  }
}
/** render: end */
/** tableCell: begin */
declare module 'zova-module-a-table' {
  interface ITableCellRecord {
    'basic-table:actionDelete': ITableCellOptionsActionDelete;
    'basic-table:actionOperationsRow': ITableCellOptionsActionOperationsRow;
    'basic-table:actionUpdate': ITableCellOptionsActionUpdate;
    'basic-table:actionView': ITableCellOptionsActionView;
  }
}
declare module 'zova-module-basic-table' {
  interface TableCellActionDelete {}
  interface TableCellActionDelete {
    get $beanFullName(): 'basic-table.tableCell.actionDelete';
    get $onionName(): 'basic-table:actionDelete';
    get $onionOptions(): ITableCellOptionsActionDelete;
  }
  interface TableCellActionOperationsRow {}
  interface TableCellActionOperationsRow {
    get $beanFullName(): 'basic-table.tableCell.actionOperationsRow';
    get $onionName(): 'basic-table:actionOperationsRow';
    get $onionOptions(): ITableCellOptionsActionOperationsRow;
  }
  interface TableCellActionUpdate {}
  interface TableCellActionUpdate {
    get $beanFullName(): 'basic-table.tableCell.actionUpdate';
    get $onionName(): 'basic-table:actionUpdate';
    get $onionOptions(): ITableCellOptionsActionUpdate;
  }
  interface TableCellActionView {}
  interface TableCellActionView {
    get $beanFullName(): 'basic-table.tableCell.actionView';
    get $onionName(): 'basic-table:actionView';
    get $onionOptions(): ITableCellOptionsActionView;
  }
}
/** tableCell: end */
/** tableCell: begin */
declare module 'zova' {
  interface IBeanRecordGeneral {
    'basic-table.tableCell.actionDelete': TableCellActionDelete;
    'basic-table.tableCell.actionOperationsRow': TableCellActionOperationsRow;
    'basic-table.tableCell.actionUpdate': TableCellActionUpdate;
    'basic-table.tableCell.actionView': TableCellActionView;
  }
}
/** tableCell: end */
/** locale: begin */
declare class ScopeModuleBasicTable extends BeanScopeBase {}
interface ScopeModuleBasicTable {
  util: BeanScopeUtil;
  locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'basic-table': ScopeModuleBasicTable;
  }
  interface IBeanScopeLocale {
    'basic-table': (typeof locales)[TypeLocaleBase];
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-text/src/component/formFieldTextarea/controller.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceFormFieldRecord {
    'basic-text:formFieldTextarea'?: IResourceFormFieldTextareaOptions;
  }
}
interface IResourceFormFieldTextareaOptions extends IResourceFormFieldOptionsBase {
  cols?: number;
  rows?: number;
  value?: any;
  placeholder?: string;
  onChange?: (e: Event) => void;
  onInput?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}
interface ControllerFormFieldTextareaProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldTextareaOptions;
}
declare class ControllerFormFieldTextarea extends BeanControllerBase {
  static $propsDefault: {};
  static $componentOptions: IComponentOptions;
  protected __init__(): Promise<void>;
  protected render(): void;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-text/src/.metadata/component/formFieldTextarea.d.ts
type ZFormFieldTextareaProps = {
  controllerRef?: (ref: ControllerFormFieldTextarea) => void;
} & ControllerFormFieldTextareaProps;
type ControllerInnerProps = TypeControllerInnerProps<ControllerFormFieldTextareaProps, keyof typeof ControllerFormFieldTextarea.$propsDefault>;
declare module 'zova-module-basic-text' {
  interface ControllerFormFieldTextarea {
    $props: ControllerInnerProps;
  }
}
declare const ZFormFieldTextarea: _$vue.DefineSetupFnComponent<ZFormFieldTextareaProps, _$vue.EmitsOptions, _$vue.SlotsType<Record<string, any>>, {
  controllerRef?: (ref: ControllerFormFieldTextarea) => void;
} & ControllerFormFieldTextareaProps & ({
  [x: `on${Capitalize<string>}`]: ((...args: any[]) => any) | undefined;
} | {
  [x: `on${Capitalize<string>}`]: ((...args: never) => any) | undefined;
}), _$vue.PublicProps>;
declare module 'zova-module-a-bean' {
  interface IVonaComponentRecord {
    'basic-text:formFieldTextarea': ControllerFormFieldTextareaProps;
  }
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-text/src/bean/tableCell.text.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceTableCellRecord {
    'basic-text:text'?: ITableCellOptionsText;
  }
}
interface ITableCellOptionsText extends IResourceTableCellOptionsBase {}
declare class TableCellText extends BeanBase implements ITableCellRender {
  render(options: ITableCellOptionsText, _renderContext: IJsxRenderContextTableCell, next: NextTableCellRender): any;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-text/src/bean/tableCell.textarea.d.ts
declare module 'zova-module-a-openapi' {
  interface IResourceTableCellRecord {
    'basic-text:textarea'?: ITableCellOptionsTextarea;
  }
}
interface ITableCellOptionsTextarea extends IResourceTableCellOptionsBase {}
declare class TableCellTextarea extends BeanBase implements ITableCellRender {
  render(options: ITableCellOptionsTextarea, _renderContext: IJsxRenderContextTableCell, next: NextTableCellRender): any;
}
//#endregion
//#region src/suite/cabloy-basic/modules/basic-text/src/.metadata/index.d.ts
declare module 'zova' {}
declare module 'zova-module-basic-text' {
  interface ControllerFormFieldTextarea {}
}
/** controller: end */
/** controller: begin */
declare module 'zova' {
  interface IBeanRecordLocal {
    'basic-text.controller.formFieldTextarea': ControllerFormFieldTextarea;
  }
}
/** controller: end */
/** components: begin */
declare module 'zova' {
  interface IComponentRecord {
    'basic-text:formFieldTextarea': ControllerFormFieldTextarea;
  }
  interface IZovaComponentRecord {
    'basic-text:formFieldTextarea': typeof ZFormFieldTextarea;
  }
}
/** components: end */
/** tableCell: begin */
declare module 'zova-module-a-table' {
  interface ITableCellRecord {
    'basic-text:text': ITableCellOptionsText;
    'basic-text:textarea': ITableCellOptionsTextarea;
  }
}
declare module 'zova-module-basic-text' {
  interface TableCellText {}
  interface TableCellText {
    get $beanFullName(): 'basic-text.tableCell.text';
    get $onionName(): 'basic-text:text';
    get $onionOptions(): ITableCellOptionsText;
  }
  interface TableCellTextarea {}
  interface TableCellTextarea {
    get $beanFullName(): 'basic-text.tableCell.textarea';
    get $onionName(): 'basic-text:textarea';
    get $onionOptions(): ITableCellOptionsTextarea;
  }
}
/** tableCell: end */
/** tableCell: begin */
declare module 'zova' {
  interface IBeanRecordGeneral {
    'basic-text.tableCell.text': TableCellText;
    'basic-text.tableCell.textarea': TableCellTextarea;
  }
}
/** tableCell: end */
/** scope: begin */
declare class ScopeModuleBasicText extends BeanScopeBase {}
interface ScopeModuleBasicText {
  util: BeanScopeUtil;
}
declare module 'zova' {
  interface IBeanScopeRecord {
    'basic-text': ScopeModuleBasicText;
  }
}
/** scope: end */
//#endregion
//#region .zova-rest/utils.d.ts
declare module 'zova-module-a-router' {
  interface IPagePathRecord {
    '/': TypePagePathSchema<undefined, undefined>;
    'presetLogin': TypePagePathSchema<undefined, undefined>;
    'presetErrorExpired': TypePagePathSchema<undefined, undefined>;
    'presetResource': TypePagePathSchema<undefined, undefined>;
  }
}
declare function ZovaCssBase<K extends PrefixKeys<CssBase, 'c'>>(name: K): string;
declare function ZovaCssMerge(...classes: (string | false | undefined | null | {
  [className: string]: any;
})[]): any;
declare function ZovaIconName<K extends keyof IIconRecord>(name: K): any;
declare function ZovaComponent<K extends keyof IVonaComponentRecord>(options: TypeComponentOptions<K>): K;
declare function ZovaCommand<K extends keyof ICommandRecord>(options: TypeCommandOptions<K>): string;
declare function ZovaEvent(_options: IJsxCommandOptionsEvent): string;
declare function ZovaCommands(_options: IJsxCommandOptionsCommands): string;
//#endregion
//#region .zova-rest/component.d.ts
declare function schemaRenderField<K extends keyof IResourceFormFieldRecord, T extends z$1.ZodType>(render: K, options?: IResourceFormFieldRecord[K], scene?: TypeFormSchemaScene): (schema: T) => T;
declare function schemaRenderFieldJsx<T extends z$1.ZodType>(renderComponentJsx: TypeRenderComponentJsx, scene?: TypeFormSchemaScene): (schema: T) => T;
declare function schemaRenderCell<K extends keyof (IResourceTableCellRecord & IResourceTableActionRowRecord), T extends z$1.ZodType>(render: K, options?: (IResourceTableCellRecord & IResourceTableActionRowRecord)[K]): (schema: T) => T;
declare function schemaRenderCellJsx<T extends z$1.ZodType>(renderComponentJsx: TypeRenderComponentJsx, options?: Pick<IResourceTableActionRowOptionsBase, 'permission'>): (schema: T) => T;
declare function schemaRenderTableActionRow<K extends keyof IResourceTableActionRowRecord>(render: K, options?: IResourceTableActionRowRecord[K]): IResourceRenderTableActionRowOptionsAction;
declare function schemaRenderTableActionRowJsx(renderComponentJsx: TypeRenderComponentJsx, options?: Pick<IResourceTableActionRowOptionsBase, 'permission'>): {
  render: TypeRenderComponentJsx;
  options: Pick<IResourceTableActionRowOptionsBase, "permission"> | undefined;
};
declare function schemaRenderFormActionRow<K extends keyof IResourceFormActionRowRecord>(render: K, options?: IResourceFormActionRowRecord[K]): IResourceRenderFormActionRowOptionsAction;
declare function schemaRenderFormActionRowJsx(renderComponentJsx: TypeRenderComponentJsx, options?: Pick<IResourceFormActionRowOptionsBase, 'permission'>): {
  render: TypeRenderComponentJsx;
  options: Pick<IResourceFormActionRowOptionsBase, "permission"> | undefined;
};
declare function schemaRenderTableActionBulk<K extends keyof IResourceTableActionBulkRecord>(render: K, options?: IResourceTableActionBulkRecord[K]): IResourceRenderTableActionBulkOptionsAction;
declare function schemaRenderTableActionBulkJsx(renderComponentJsx: TypeRenderComponentJsx, options?: Pick<IResourceTableActionBulkOptionsBase, 'permission'>): {
  render: TypeRenderComponentJsx;
  options: Pick<IResourceTableActionBulkOptionsBase, "permission"> | undefined;
};
declare function schemaRenderBlock<K extends keyof IResourceBlockRecord>(render: K, options?: IResourceBlockRecord[K]): IResourceRenderBlockOptionsBlock;
declare function schemaRenderBlockJsx(renderComponentJsx: TypeRenderComponentJsx): {
  render: TypeRenderComponentJsx;
};
//#endregion
//#region .zova-rest/rest.d.ts
declare function schemaRenderLayout<T extends z$1.ZodType>(layoutOptions: ISchemaRenderComponentLayoutOptions, scene?: TypeFormSchemaScene): (schema: T) => T;
declare function schemaRenderVisible<T extends z$1.ZodType>(visible?: boolean, scene?: TypeSchemaScene): (schema: T) => T;
declare function schemaRenderReadonly<T extends z$1.ZodType>(readonly?: boolean, scene?: TypeSchemaScene): (schema: T) => T;
declare function schemaRenderDisableNotifyChanged<T extends z$1.ZodType>(disableNotifyChanged?: boolean, scene?: TypeSchemaScene): (schema: T) => T;
declare function schemaRenderFieldSource<T extends z$1.ZodType>(fieldSource: string, scene?: TypeSchemaScene): (schema: T) => T;
declare function schemaRenderOrder<T extends z$1.ZodType>(order: number, level?: TypeSchemaOrderLevel, scene?: TypeSchemaScene): (schema: T) => T;
//#endregion
//#region .zova-rest/render.d.ts
declare const ZovaRender: {
  layout: typeof schemaRenderLayout;
  visible: typeof schemaRenderVisible;
  readonly: typeof schemaRenderReadonly;
  order: typeof schemaRenderOrder;
  disableNotifyChanged: typeof schemaRenderDisableNotifyChanged;
  fieldSource: typeof schemaRenderFieldSource;
  field: typeof schemaRenderField;
  fieldJsx: typeof schemaRenderFieldJsx;
  cell: typeof schemaRenderCell;
  cellJsx: typeof schemaRenderCellJsx;
  tableActionRow: typeof schemaRenderTableActionRow;
  tableActionRowJsx: typeof schemaRenderTableActionRowJsx;
  formActionRow: typeof schemaRenderFormActionRow;
  formActionRowJsx: typeof schemaRenderFormActionRowJsx;
  tableActionBulk: typeof schemaRenderTableActionBulk;
  tableActionBulkJsx: typeof schemaRenderTableActionBulkJsx;
  block: typeof schemaRenderBlock;
  blockJsx: typeof schemaRenderBlockJsx;
};
declare namespace index_d_exports {
  export { $defs, AopHome, AopHome3, ApiApiCaptchacreateMethod, ApiApiCaptchacreatePath, ApiApiCaptchacreateRequestBody, ApiApiCaptchacreateResponseBody, ApiApiCaptcharefreshMethod, ApiApiCaptcharefreshPath, ApiApiCaptcharefreshRequestBody, ApiApiCaptcharefreshResponseBody, ApiApiCaptchaverifyImmediateMethod, ApiApiCaptchaverifyImmediatePath, ApiApiCaptchaverifyImmediateRequestBody, ApiApiCaptchaverifyImmediateResponseBody, ApiApiHomeBaseMenuretrieveMenusMethod, ApiApiHomeBaseMenuretrieveMenusPath, ApiApiHomeBaseMenuretrieveMenusRequestParams, ApiApiHomeBaseMenuretrieveMenusResponseBody, ApiApiHomeBasePermissionretrievePermissionsMethod, ApiApiHomeBasePermissionretrievePermissionsPath, ApiApiHomeBasePermissionretrievePermissionsRequestParams, ApiApiHomeBasePermissionretrievePermissionsResponseBody, ApiApiHomeUserPassportassociateMethod, ApiApiHomeUserPassportassociatePath, ApiApiHomeUserPassportassociateRequestParams, ApiApiHomeUserPassportassociateRequestQuery, ApiApiHomeUserPassportassociateResponseBody, ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeMethod, ApiApiHomeUserPassportcreatePassportJwtFromOauthCodePath, ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeRequestBody, ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeResponseBody, ApiApiHomeUserPassportcreateTempAuthTokenMethod, ApiApiHomeUserPassportcreateTempAuthTokenPath, ApiApiHomeUserPassportcreateTempAuthTokenRequestQuery, ApiApiHomeUserPassportcreateTempAuthTokenResponseBody, ApiApiHomeUserPassportcurrentMethod, ApiApiHomeUserPassportcurrentPath, ApiApiHomeUserPassportcurrentResponseBody, ApiApiHomeUserPassportloginMethod, ApiApiHomeUserPassportloginOauthMethod, ApiApiHomeUserPassportloginOauthPath, ApiApiHomeUserPassportloginOauthRequestParams, ApiApiHomeUserPassportloginOauthRequestQuery, ApiApiHomeUserPassportloginOauthResponseBody, ApiApiHomeUserPassportloginPath, ApiApiHomeUserPassportloginRequestBody, ApiApiHomeUserPassportloginResponseBody, ApiApiHomeUserPassportlogoutMethod, ApiApiHomeUserPassportlogoutPath, ApiApiHomeUserPassportlogoutResponseBody, ApiApiHomeUserPassportmigrateMethod, ApiApiHomeUserPassportmigratePath, ApiApiHomeUserPassportmigrateRequestParams, ApiApiHomeUserPassportmigrateRequestQuery, ApiApiHomeUserPassportmigrateResponseBody, ApiApiHomeUserPassportrefreshAuthTokenMethod, ApiApiHomeUserPassportrefreshAuthTokenPath, ApiApiHomeUserPassportrefreshAuthTokenRequestBody, ApiApiHomeUserPassportrefreshAuthTokenResponseBody, ApiApiHomeUserPassportregisterMethod, ApiApiHomeUserPassportregisterPath, ApiApiHomeUserPassportregisterRequestBody, ApiApiHomeUserPassportregisterResponseBody, ApiApiHomeindexMethod, ApiApiHomeindexPath, ApiApiHomeindexResponseBody, ApiApiTestSsrToolOnetestGetMethod, ApiApiTestSsrToolOnetestGetPath, ApiApiTestSsrToolOnetestGetRequestParams, ApiApiTestSsrToolOnetestGetRequestQuery, ApiApiTestSsrToolOnetestGetResponseBody, ApiApiTestSsrToolOnetestMethod, ApiApiTestSsrToolOnetestPath, ApiApiTestSsrToolOnetestRequestBody, ApiApiTestSsrToolOnetestRequestParams, ApiApiTestSsrToolOnetestRequestQuery, ApiApiTestSsrToolOnetestResponseBody, ApiCaptcha, ApiHome, ApiHomeBaseMenu, ApiHomeBasePermission, ApiHomeUserPassport, ApiSchemaAAuthDtoAuth, ApiSchemaAAuthDtoAuthPartial, ApiSchemaACaptchaDtoCaptchaData, ApiSchemaACaptchaDtoCaptchaDataPartial, ApiSchemaACaptchaDtoCaptchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e, ApiSchemaACaptchaDtoCaptchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797ePartial, ApiSchemaACaptchaDtoCaptchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e_3218e7d152830e08f6e764b9e0c3796df929ee2b, ApiSchemaACaptchaDtoCaptchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e_3218e7d152830e08f6e764b9e0c3796df929ee2bPartial, ApiSchemaAJwtDtoJwtToken, ApiSchemaAJwtDtoJwtTokenPartial, ApiSchemaAMenuDtoMenuGroup, ApiSchemaAMenuDtoMenuGroupPartial, ApiSchemaAMenuDtoMenuItem, ApiSchemaAMenuDtoMenuItemMeta, ApiSchemaAMenuDtoMenuItemMetaPartial, ApiSchemaAMenuDtoMenuItemPartial, ApiSchemaAMenuDtoMenus, ApiSchemaAMenuDtoMenusPartial, ApiSchemaAPaypalDtoPaypalOrderRecordOptions, ApiSchemaAPaypalDtoPaypalOrderRecordOptionsPartial, ApiSchemaAPaypalDtoPaypalOrderRecordPayload, ApiSchemaAPaypalDtoPaypalOrderRecordPayloadPartial, ApiSchemaAPaypalEntityPaypalRecord, ApiSchemaAPaypalEntityPaypalRecordPartial, ApiSchemaAPermissionDtoPermissions, ApiSchemaAPermissionDtoPermissionsPartial, ApiSchemaAPlayDtoPlay, ApiSchemaAPlayDtoPlayPartial, ApiSchemaCaptcha, ApiSchemaHome, ApiSchemaHomeBaseMenu, ApiSchemaHomeBasePermission, ApiSchemaHomeUserDtoLogin, ApiSchemaHomeUserDtoLoginPartial, ApiSchemaHomeUserDtoPassport, ApiSchemaHomeUserDtoPassportJwt, ApiSchemaHomeUserDtoPassportJwtPartial, ApiSchemaHomeUserDtoPassportPartial, ApiSchemaHomeUserDtoRegister, ApiSchemaHomeUserDtoRegisterPartial, ApiSchemaHomeUserEntityRole, ApiSchemaHomeUserEntityRolePartial, ApiSchemaHomeUserEntityUser, ApiSchemaHomeUserEntityUserPartial, ApiSchemaHomeUserPassport, ApiSchemaTestCaptchaDtoSignin, ApiSchemaTestCaptchaDtoSigninPartial, ApiSchemaTestRestDtoProductCreate, ApiSchemaTestRestDtoProductCreatePartial, ApiSchemaTestRestDtoProductQueryRes, ApiSchemaTestRestDtoProductQueryResPartial, ApiSchemaTestRestDtoProductUpdate, ApiSchemaTestRestDtoProductUpdatePartial, ApiSchemaTestRestEntityProduct, ApiSchemaTestRestEntityProductPartial, ApiSchemaTestSsrDtoTestBody, ApiSchemaTestSsrDtoTestBodyPartial, ApiSchemaTestSsrDtoTestDetail, ApiSchemaTestSsrDtoTestDetailPartial, ApiSchemaTestSsrDtoTestResult, ApiSchemaTestSsrDtoTestResultPartial, ApiSchemaTestSsrToolOne, ApiSchemaTestVonaDtoCategoryTree, ApiSchemaTestVonaDtoCategoryTreePartial, ApiSchemaTestVonaDtoOrderCreate, ApiSchemaTestVonaDtoOrderCreatePartial, ApiSchemaTestVonaDtoOrderResult, ApiSchemaTestVonaDtoOrderResultPage, ApiSchemaTestVonaDtoOrderResultPagePartial, ApiSchemaTestVonaDtoOrderResultPartial, ApiSchemaTestVonaDtoOrderUpdate, ApiSchemaTestVonaDtoOrderUpdatePartial, ApiSchemaTestVonaDtoPostAggregate, ApiSchemaTestVonaDtoPostAggregatePartial, ApiSchemaTestVonaDtoPostCreate, ApiSchemaTestVonaDtoPostCreatePartial, ApiSchemaTestVonaDtoPostGroup, ApiSchemaTestVonaDtoPostGroupPartial, ApiSchemaTestVonaDtoPostQueryRes, ApiSchemaTestVonaDtoPostQueryResPartial, ApiSchemaTestVonaDtoRoleLazy, ApiSchemaTestVonaDtoRoleLazyPartial, ApiSchemaTestVonaDtoSerializerArray, ApiSchemaTestVonaDtoSerializerArrayPartial, ApiSchemaTestVonaDtoSerializerLazy, ApiSchemaTestVonaDtoSerializerLazyPartial, ApiSchemaTestVonaDtoSerializerSimple, ApiSchemaTestVonaDtoSerializerSimplePartial, ApiSchemaTestVonaDtoSerializerSimple_1c4b95bcfe8fe28a56dbcc7028097cf11836b4fc, ApiSchemaTestVonaDtoSerializerSimple_1c4b95bcfe8fe28a56dbcc7028097cf11836b4fcPartial, ApiSchemaTestVonaDtoSerializerSimple_542f7be0da9b85a67248a6a1a3629e72de5fdb33_cff0ae112a392da58caf5aa905749f3c4444c4ab, ApiSchemaTestVonaDtoSerializerSimple_542f7be0da9b85a67248a6a1a3629e72de5fdb33_cff0ae112a392da58caf5aa905749f3c4444c4abPartial, ApiSchemaTestVonaDtoUser, ApiSchemaTestVonaDtoUserCreate, ApiSchemaTestVonaDtoUserCreatePartial, ApiSchemaTestVonaDtoUserLazy, ApiSchemaTestVonaDtoUserLazyPartial, ApiSchemaTestVonaDtoUserPartial, ApiSchemaTestVonaDtoUserUpdate, ApiSchemaTestVonaDtoUserUpdatePartial, ApiSchemaTestVonaEntityCategory_2c7d642ee581efa300341e343180fbb0ecdc785d, ApiSchemaTestVonaEntityCategory_2c7d642ee581efa300341e343180fbb0ecdc785dPartial, ApiSchemaTestVonaEntityPost_729883d7de16ce4401b26f75bebe618c8948ff64, ApiSchemaTestVonaEntityPost_729883d7de16ce4401b26f75bebe618c8948ff64Partial, ApiSchemaTestVonaEntityPost_a6ba2076b5b70a3c098374cc82d418bd1ab226c3, ApiSchemaTestVonaEntityPost_a6ba2076b5b70a3c098374cc82d418bd1ab226c3Partial, ApiSchemaTestVonaEntityProduct, ApiSchemaTestVonaEntityProductPartial, ApiSchemaTestVonaEntityProduct_29731960f3f38d3572bc2f8a01a7498bfe927055, ApiSchemaTestVonaEntityProduct_29731960f3f38d3572bc2f8a01a7498bfe927055Partial, ApiSchemaTestVonaEntityProduct_9cf2c6bcd41713270c34bcfce21b7b4942e3fbc6, ApiSchemaTestVonaEntityProduct_9cf2c6bcd41713270c34bcfce21b7b4942e3fbc6Partial, ApiSchemaTestVonaEntityProduct_bce173590aaef19772f1ae3a82196493c2633e2e, ApiSchemaTestVonaEntityProduct_bce173590aaef19772f1ae3a82196493c2633e2ePartial, ApiSchemaTestVonaEntityUser_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7, ApiSchemaTestVonaEntityUser_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7Partial, ApiTestSsrToolOne, ApiTodo, ApiTodoEntity, ApiTodoIntertBody, ApiTodoUpdateBody, BehaviorFormField, BehaviorFormFieldLayoutLogin, CommandAlert, CommandConfirm, CommandCopy, CommandCreate, CommandDelete, CommandEdit, CommandExpr, CommandLog, CommandSetValue, CommandView, ControllerActionBack, ControllerActionBackProps, ControllerActionCreate, ControllerActionCreateProps, ControllerActionSubmit, ControllerActionSubmitProps, ControllerActionView, ControllerActionViewProps, ControllerBlockFilter, ControllerBlockFilterProps, ControllerBlockForm, ControllerBlockFormProps, ControllerBlockPage, ControllerBlockPageEntry, ControllerBlockPageEntryProps, ControllerBlockPageProps, ControllerBlockPager, ControllerBlockPagerProps, ControllerBlockTable, ControllerBlockTableProps, ControllerBlockToolbarBulk, ControllerBlockToolbarBulkProps, ControllerBlockToolbarRow, ControllerBlockToolbarRowProps, ControllerCard, ControllerCardProps, ControllerDateRange, ControllerDateRangeModels, ControllerDateRangeProps, ControllerFormFieldCaptcha, ControllerFormFieldCaptchaProps, ControllerFormFieldCurrency, ControllerFormFieldCurrencyProps, ControllerFormFieldDate, ControllerFormFieldDateProps, ControllerFormFieldDateRange, ControllerFormFieldDateRangeProps, ControllerFormFieldInput, ControllerFormFieldInputProps, ControllerFormFieldSelect, ControllerFormFieldSelectProps, ControllerFormFieldTest, ControllerFormFieldTestProps, ControllerFormFieldTextarea, ControllerFormFieldTextareaProps, ControllerItemLink, ControllerItemLinkProps, ControllerLayoutEmpty, ControllerLayoutEmptyProps, ControllerLayoutTabs, ControllerLayoutTabsProps, ControllerPage, ControllerPageAuthCallback, ControllerPageAuthCallbackSchemaQuery, ControllerPageComponent, ControllerPageErrorExpired, ControllerPageErrorExpiredSchemaQuery, ControllerPageErrorNotFound, ControllerPageHome, ControllerPageItem, ControllerPageItemSchemaParams, ControllerPageItemSchemaQuery, ControllerPageLocale, ControllerPageLogin$1 as ControllerPageLogin, ControllerPageProps, ControllerPageRouteParams, ControllerPageRouteParamsSchemaParams, ControllerPageRouteParamsSchemaQuery, ControllerPageRouteQuery, ControllerPageRouteQueryB, ControllerPageRouteQueryBSchemaParams, ControllerPageRouteQueryBSchemaQuery, ControllerPageRouteQuerySchemaParams, ControllerPageRouteQuerySchemaQuery, ControllerPageState, ControllerPageStyle, ControllerPageTest, ControllerPageTodo, ControllerPageToolOne$1 as ControllerPageToolOne, ControllerPageToolOneSchemaParams, ControllerPageToolOneSchemaQuery, ControllerPageToolTwo, ControllerPageToolTwoSchemaParams, ControllerPageToolTwoSchemaQuery, ControllerSelect, ControllerSelectModels, ControllerSelectProps, ControllerTable, ControllerTableCellTest, ControllerTableCellTestProps, ControllerTableProps, CssBase, IBehaviorOptionsFormField, IBehaviorOptionsFormFieldLayoutLogin, IBehaviorPropsInputFormField, IBehaviorPropsInputFormFieldLayoutLogin, IBehaviorPropsOutputFormField, IBehaviorPropsOutputFormFieldLayoutLogin, IBehaviorResourceFormFieldLayoutOptions, ICommandOptionsAlert, ICommandOptionsConfirm, ICommandOptionsCopy, ICommandOptionsCreate, ICommandOptionsDelete, ICommandOptionsEdit, ICommandOptionsExpr, ICommandOptionsLog, ICommandOptionsSetValue, ICommandOptionsView, ICssOptionsBase, IModelOptionsLayout, IModelOptionsMenu, IModelOptionsPassport, IModelOptionsTest, IModelOptionsTodo, IModuleApiSchema, IResourceFormFieldCaptchaOptions, IResourceFormFieldCurrencyOptions, IResourceFormFieldDateOptions, IResourceFormFieldDateRangeOptions, IResourceFormFieldInputOptions, IResourceFormFieldSelectOptions, IResourceFormFieldTextareaOptions, IServiceSsrLayoutOptions, ITableCellOptionsActionDelete, ITableCellOptionsActionOperationsRow, ITableCellOptionsActionUpdate, ITableCellOptionsActionView, ITableCellOptionsCurrency, ITableCellOptionsDate, ITableCellOptionsSelect, ITableCellOptionsTest, ITableCellOptionsText, ITableCellOptionsTextarea, IThemeOptionsDefault, IThemeOptionsOrange, Main, MetaThemeHandler, ModelLayout, ModelMenu, ModelPassport, ModelTest, ModelTodo, NSControllerPageAuthCallback, NSControllerPageErrorExpired, NSControllerPageItem, NSControllerPageRouteParams, NSControllerPageRouteQuery, NSControllerPageRouteQueryB, NSControllerPageToolOne, NSControllerPageToolTwo, OpenApiBaseURL, RenderContent, RenderHeader, RenderLayoutTabs, RenderLocale, RenderMenu, RenderPageLogin, RenderPageToolOne, RenderSidebar, RenderTable, RenderTabs, RenderTheme, RenderUser, ScopeModuleBasicAdapter, ScopeModuleBasicCaptcha, ScopeModuleBasicCommands, ScopeModuleBasicCommandssync, ScopeModuleBasicCurrency, ScopeModuleBasicDate, ScopeModuleBasicForm, ScopeModuleBasicInput, ScopeModuleBasicPage, ScopeModuleBasicPageentry, ScopeModuleBasicSelect, ScopeModuleBasicTable, ScopeModuleBasicText, ScopeModuleDemoBasic, ScopeModuleDemoStudent, ScopeModuleDemoTodo, ScopeModuleDevuiAdapter, ScopeModuleHomeApi, ScopeModuleHomeBase, ScopeModuleHomeIcon, ScopeModuleHomeIndex, ScopeModuleHomeLayoutempty, ScopeModuleHomeLayouttabs, ScopeModuleHomeLogin, ScopeModuleHomePassport, ScopeModuleHomeTheme, ServiceJwtAdapter, ServiceRouterGuards, ServiceSsr, ServiceSsrLayout, StyleLayoutTabs$1 as StyleLayoutTabs, TableCellActionDelete, TableCellActionOperationsRow, TableCellActionUpdate, TableCellActionView, TableCellCurrency, TableCellDate, TableCellSelect, TableCellTest, TableCellText, TableCellTextarea, ThemeDefault, ThemeOrange, ThemeTokenCustom, TypeCommandAlertResult, TypeCommandConfirmResult, TypeCommandCopyResult, TypeCommandCreateResult, TypeCommandDeleteResult, TypeCommandEditResult, TypeCommandExprResult, TypeCommandLogResult, TypeCommandSetValueResult, TypeCommandViewResult, TypeDateFormatPreset, TypeMenuGroup, TypeMenuItem, TypeMenuTree, ZActionBack, ZActionBackProps, ZActionCreate, ZActionCreateProps, ZActionSubmit, ZActionSubmitProps, ZActionView, ZActionViewProps, ZBlockFilter, ZBlockFilterProps, ZBlockForm, ZBlockFormProps, ZBlockPage, ZBlockPageEntry, ZBlockPageEntryProps, ZBlockPageProps, ZBlockPager, ZBlockPagerProps, ZBlockTable, ZBlockTableProps, ZBlockToolbarBulk, ZBlockToolbarBulkProps, ZBlockToolbarRow, ZBlockToolbarRowProps, ZCard, ZCardProps, ZDateRange, ZDateRangeProps, ZFormFieldCaptcha, ZFormFieldCaptchaProps, ZFormFieldCurrency, ZFormFieldCurrencyProps, ZFormFieldDate, ZFormFieldDateProps, ZFormFieldDateRange, ZFormFieldDateRangeProps, ZFormFieldInput, ZFormFieldInputProps, ZFormFieldSelect, ZFormFieldSelectProps, ZFormFieldTest, ZFormFieldTestProps, ZFormFieldTextarea, ZFormFieldTextareaProps, ZItemLink, ZItemLinkProps, ZLayoutEmpty, ZLayoutEmptyProps, ZLayoutTabs, ZLayoutTabsProps, ZPage, ZPageAuthCallback, ZPageComponent, ZPageErrorExpired, ZPageErrorNotFound, ZPageHome, ZPageItem, ZPageLocale, ZPageLogin, ZPageProps, ZPageRouteParams, ZPageRouteQuery, ZPageRouteQueryB, ZPageState, ZPageStyle, ZPageTest, ZPageTodo, ZPageToolOne, ZPageToolTwo, ZSelect, ZSelectProps, ZTable, ZTableCellTest, ZTableCellTestProps, ZTableProps, ZovaCommand, ZovaCommands, ZovaComponent, ZovaCssBase, ZovaCssMerge, ZovaEvent, ZovaIconName, ZovaRender, currencyFormat, currencyUpdate, dateFormatUtil, definePropertyScopeBase, icons, operations, paths, webhooks };
}
//#endregion
export { $defs, AopHome, AopHome3, ApiApiCaptchacreateMethod, ApiApiCaptchacreatePath, ApiApiCaptchacreateRequestBody, ApiApiCaptchacreateResponseBody, ApiApiCaptcharefreshMethod, ApiApiCaptcharefreshPath, ApiApiCaptcharefreshRequestBody, ApiApiCaptcharefreshResponseBody, ApiApiCaptchaverifyImmediateMethod, ApiApiCaptchaverifyImmediatePath, ApiApiCaptchaverifyImmediateRequestBody, ApiApiCaptchaverifyImmediateResponseBody, ApiApiHomeBaseMenuretrieveMenusMethod, ApiApiHomeBaseMenuretrieveMenusPath, ApiApiHomeBaseMenuretrieveMenusRequestParams, ApiApiHomeBaseMenuretrieveMenusResponseBody, ApiApiHomeBasePermissionretrievePermissionsMethod, ApiApiHomeBasePermissionretrievePermissionsPath, ApiApiHomeBasePermissionretrievePermissionsRequestParams, ApiApiHomeBasePermissionretrievePermissionsResponseBody, ApiApiHomeUserPassportassociateMethod, ApiApiHomeUserPassportassociatePath, ApiApiHomeUserPassportassociateRequestParams, ApiApiHomeUserPassportassociateRequestQuery, ApiApiHomeUserPassportassociateResponseBody, ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeMethod, ApiApiHomeUserPassportcreatePassportJwtFromOauthCodePath, ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeRequestBody, ApiApiHomeUserPassportcreatePassportJwtFromOauthCodeResponseBody, ApiApiHomeUserPassportcreateTempAuthTokenMethod, ApiApiHomeUserPassportcreateTempAuthTokenPath, ApiApiHomeUserPassportcreateTempAuthTokenRequestQuery, ApiApiHomeUserPassportcreateTempAuthTokenResponseBody, ApiApiHomeUserPassportcurrentMethod, ApiApiHomeUserPassportcurrentPath, ApiApiHomeUserPassportcurrentResponseBody, ApiApiHomeUserPassportloginMethod, ApiApiHomeUserPassportloginOauthMethod, ApiApiHomeUserPassportloginOauthPath, ApiApiHomeUserPassportloginOauthRequestParams, ApiApiHomeUserPassportloginOauthRequestQuery, ApiApiHomeUserPassportloginOauthResponseBody, ApiApiHomeUserPassportloginPath, ApiApiHomeUserPassportloginRequestBody, ApiApiHomeUserPassportloginResponseBody, ApiApiHomeUserPassportlogoutMethod, ApiApiHomeUserPassportlogoutPath, ApiApiHomeUserPassportlogoutResponseBody, ApiApiHomeUserPassportmigrateMethod, ApiApiHomeUserPassportmigratePath, ApiApiHomeUserPassportmigrateRequestParams, ApiApiHomeUserPassportmigrateRequestQuery, ApiApiHomeUserPassportmigrateResponseBody, ApiApiHomeUserPassportrefreshAuthTokenMethod, ApiApiHomeUserPassportrefreshAuthTokenPath, ApiApiHomeUserPassportrefreshAuthTokenRequestBody, ApiApiHomeUserPassportrefreshAuthTokenResponseBody, ApiApiHomeUserPassportregisterMethod, ApiApiHomeUserPassportregisterPath, ApiApiHomeUserPassportregisterRequestBody, ApiApiHomeUserPassportregisterResponseBody, ApiApiHomeindexMethod, ApiApiHomeindexPath, ApiApiHomeindexResponseBody, ApiApiTestSsrToolOnetestGetMethod, ApiApiTestSsrToolOnetestGetPath, ApiApiTestSsrToolOnetestGetRequestParams, ApiApiTestSsrToolOnetestGetRequestQuery, ApiApiTestSsrToolOnetestGetResponseBody, ApiApiTestSsrToolOnetestMethod, ApiApiTestSsrToolOnetestPath, ApiApiTestSsrToolOnetestRequestBody, ApiApiTestSsrToolOnetestRequestParams, ApiApiTestSsrToolOnetestRequestQuery, ApiApiTestSsrToolOnetestResponseBody, ApiCaptcha, ApiHome, ApiHomeBaseMenu, ApiHomeBasePermission, ApiHomeUserPassport, ApiSchemaAAuthDtoAuth, ApiSchemaAAuthDtoAuthPartial, ApiSchemaACaptchaDtoCaptchaData, ApiSchemaACaptchaDtoCaptchaDataPartial, ApiSchemaACaptchaDtoCaptchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e, ApiSchemaACaptchaDtoCaptchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797ePartial, ApiSchemaACaptchaDtoCaptchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e_3218e7d152830e08f6e764b9e0c3796df929ee2b, ApiSchemaACaptchaDtoCaptchaVerify_c3cd80b1eeafe39bfe4433491bb081d68e84797e_3218e7d152830e08f6e764b9e0c3796df929ee2bPartial, ApiSchemaAJwtDtoJwtToken, ApiSchemaAJwtDtoJwtTokenPartial, ApiSchemaAMenuDtoMenuGroup, ApiSchemaAMenuDtoMenuGroupPartial, ApiSchemaAMenuDtoMenuItem, ApiSchemaAMenuDtoMenuItemMeta, ApiSchemaAMenuDtoMenuItemMetaPartial, ApiSchemaAMenuDtoMenuItemPartial, ApiSchemaAMenuDtoMenus, ApiSchemaAMenuDtoMenusPartial, ApiSchemaAPaypalDtoPaypalOrderRecordOptions, ApiSchemaAPaypalDtoPaypalOrderRecordOptionsPartial, ApiSchemaAPaypalDtoPaypalOrderRecordPayload, ApiSchemaAPaypalDtoPaypalOrderRecordPayloadPartial, ApiSchemaAPaypalEntityPaypalRecord, ApiSchemaAPaypalEntityPaypalRecordPartial, ApiSchemaAPermissionDtoPermissions, ApiSchemaAPermissionDtoPermissionsPartial, ApiSchemaAPlayDtoPlay, ApiSchemaAPlayDtoPlayPartial, ApiSchemaCaptcha, ApiSchemaHome, ApiSchemaHomeBaseMenu, ApiSchemaHomeBasePermission, ApiSchemaHomeUserDtoLogin, ApiSchemaHomeUserDtoLoginPartial, ApiSchemaHomeUserDtoPassport, ApiSchemaHomeUserDtoPassportJwt, ApiSchemaHomeUserDtoPassportJwtPartial, ApiSchemaHomeUserDtoPassportPartial, ApiSchemaHomeUserDtoRegister, ApiSchemaHomeUserDtoRegisterPartial, ApiSchemaHomeUserEntityRole, ApiSchemaHomeUserEntityRolePartial, ApiSchemaHomeUserEntityUser, ApiSchemaHomeUserEntityUserPartial, ApiSchemaHomeUserPassport, ApiSchemaTestCaptchaDtoSignin, ApiSchemaTestCaptchaDtoSigninPartial, ApiSchemaTestRestDtoProductCreate, ApiSchemaTestRestDtoProductCreatePartial, ApiSchemaTestRestDtoProductQueryRes, ApiSchemaTestRestDtoProductQueryResPartial, ApiSchemaTestRestDtoProductUpdate, ApiSchemaTestRestDtoProductUpdatePartial, ApiSchemaTestRestEntityProduct, ApiSchemaTestRestEntityProductPartial, ApiSchemaTestSsrDtoTestBody, ApiSchemaTestSsrDtoTestBodyPartial, ApiSchemaTestSsrDtoTestDetail, ApiSchemaTestSsrDtoTestDetailPartial, ApiSchemaTestSsrDtoTestResult, ApiSchemaTestSsrDtoTestResultPartial, ApiSchemaTestSsrToolOne, ApiSchemaTestVonaDtoCategoryTree, ApiSchemaTestVonaDtoCategoryTreePartial, ApiSchemaTestVonaDtoOrderCreate, ApiSchemaTestVonaDtoOrderCreatePartial, ApiSchemaTestVonaDtoOrderResult, ApiSchemaTestVonaDtoOrderResultPage, ApiSchemaTestVonaDtoOrderResultPagePartial, ApiSchemaTestVonaDtoOrderResultPartial, ApiSchemaTestVonaDtoOrderUpdate, ApiSchemaTestVonaDtoOrderUpdatePartial, ApiSchemaTestVonaDtoPostAggregate, ApiSchemaTestVonaDtoPostAggregatePartial, ApiSchemaTestVonaDtoPostCreate, ApiSchemaTestVonaDtoPostCreatePartial, ApiSchemaTestVonaDtoPostGroup, ApiSchemaTestVonaDtoPostGroupPartial, ApiSchemaTestVonaDtoPostQueryRes, ApiSchemaTestVonaDtoPostQueryResPartial, ApiSchemaTestVonaDtoRoleLazy, ApiSchemaTestVonaDtoRoleLazyPartial, ApiSchemaTestVonaDtoSerializerArray, ApiSchemaTestVonaDtoSerializerArrayPartial, ApiSchemaTestVonaDtoSerializerLazy, ApiSchemaTestVonaDtoSerializerLazyPartial, ApiSchemaTestVonaDtoSerializerSimple, ApiSchemaTestVonaDtoSerializerSimplePartial, ApiSchemaTestVonaDtoSerializerSimple_1c4b95bcfe8fe28a56dbcc7028097cf11836b4fc, ApiSchemaTestVonaDtoSerializerSimple_1c4b95bcfe8fe28a56dbcc7028097cf11836b4fcPartial, ApiSchemaTestVonaDtoSerializerSimple_542f7be0da9b85a67248a6a1a3629e72de5fdb33_cff0ae112a392da58caf5aa905749f3c4444c4ab, ApiSchemaTestVonaDtoSerializerSimple_542f7be0da9b85a67248a6a1a3629e72de5fdb33_cff0ae112a392da58caf5aa905749f3c4444c4abPartial, ApiSchemaTestVonaDtoUser, ApiSchemaTestVonaDtoUserCreate, ApiSchemaTestVonaDtoUserCreatePartial, ApiSchemaTestVonaDtoUserLazy, ApiSchemaTestVonaDtoUserLazyPartial, ApiSchemaTestVonaDtoUserPartial, ApiSchemaTestVonaDtoUserUpdate, ApiSchemaTestVonaDtoUserUpdatePartial, ApiSchemaTestVonaEntityCategory_2c7d642ee581efa300341e343180fbb0ecdc785d, ApiSchemaTestVonaEntityCategory_2c7d642ee581efa300341e343180fbb0ecdc785dPartial, ApiSchemaTestVonaEntityPost_729883d7de16ce4401b26f75bebe618c8948ff64, ApiSchemaTestVonaEntityPost_729883d7de16ce4401b26f75bebe618c8948ff64Partial, ApiSchemaTestVonaEntityPost_a6ba2076b5b70a3c098374cc82d418bd1ab226c3, ApiSchemaTestVonaEntityPost_a6ba2076b5b70a3c098374cc82d418bd1ab226c3Partial, ApiSchemaTestVonaEntityProduct, ApiSchemaTestVonaEntityProductPartial, ApiSchemaTestVonaEntityProduct_29731960f3f38d3572bc2f8a01a7498bfe927055, ApiSchemaTestVonaEntityProduct_29731960f3f38d3572bc2f8a01a7498bfe927055Partial, ApiSchemaTestVonaEntityProduct_9cf2c6bcd41713270c34bcfce21b7b4942e3fbc6, ApiSchemaTestVonaEntityProduct_9cf2c6bcd41713270c34bcfce21b7b4942e3fbc6Partial, ApiSchemaTestVonaEntityProduct_bce173590aaef19772f1ae3a82196493c2633e2e, ApiSchemaTestVonaEntityProduct_bce173590aaef19772f1ae3a82196493c2633e2ePartial, ApiSchemaTestVonaEntityUser_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7, ApiSchemaTestVonaEntityUser_2c7d642ee581efa300341e343180fbb0ecdc785d_1816ff740d81c738ec055c7038bbd93beb9405a7Partial, ApiTestSsrToolOne, ApiTodo, ApiTodoEntity, ApiTodoIntertBody, ApiTodoUpdateBody, BehaviorFormField, BehaviorFormFieldLayoutLogin, CommandAlert, CommandConfirm, CommandCopy, CommandCreate, CommandDelete, CommandEdit, CommandExpr, CommandLog, CommandSetValue, CommandView, ControllerActionBack, ControllerActionBackProps, ControllerActionCreate, ControllerActionCreateProps, ControllerActionSubmit, ControllerActionSubmitProps, ControllerActionView, ControllerActionViewProps, ControllerBlockFilter, ControllerBlockFilterProps, ControllerBlockForm, ControllerBlockFormProps, ControllerBlockPage, ControllerBlockPageEntry, ControllerBlockPageEntryProps, ControllerBlockPageProps, ControllerBlockPager, ControllerBlockPagerProps, ControllerBlockTable, ControllerBlockTableProps, ControllerBlockToolbarBulk, ControllerBlockToolbarBulkProps, ControllerBlockToolbarRow, ControllerBlockToolbarRowProps, ControllerCard, ControllerCardProps, ControllerDateRange, ControllerDateRangeModels, ControllerDateRangeProps, ControllerFormFieldCaptcha, ControllerFormFieldCaptchaProps, ControllerFormFieldCurrency, ControllerFormFieldCurrencyProps, ControllerFormFieldDate, ControllerFormFieldDateProps, ControllerFormFieldDateRange, ControllerFormFieldDateRangeProps, ControllerFormFieldInput, ControllerFormFieldInputProps, ControllerFormFieldSelect, ControllerFormFieldSelectProps, ControllerFormFieldTest, ControllerFormFieldTestProps, ControllerFormFieldTextarea, ControllerFormFieldTextareaProps, ControllerItemLink, ControllerItemLinkProps, ControllerLayoutEmpty, ControllerLayoutEmptyProps, ControllerLayoutTabs, ControllerLayoutTabsProps, ControllerPage, ControllerPageAuthCallback, ControllerPageAuthCallbackSchemaQuery, ControllerPageComponent, ControllerPageErrorExpired, ControllerPageErrorExpiredSchemaQuery, ControllerPageErrorNotFound, ControllerPageHome, ControllerPageItem, ControllerPageItemSchemaParams, ControllerPageItemSchemaQuery, ControllerPageLocale, ControllerPageLogin$1 as ControllerPageLogin, ControllerPageProps, ControllerPageRouteParams, ControllerPageRouteParamsSchemaParams, ControllerPageRouteParamsSchemaQuery, ControllerPageRouteQuery, ControllerPageRouteQueryB, ControllerPageRouteQueryBSchemaParams, ControllerPageRouteQueryBSchemaQuery, ControllerPageRouteQuerySchemaParams, ControllerPageRouteQuerySchemaQuery, ControllerPageState, ControllerPageStyle, ControllerPageTest, ControllerPageTodo, ControllerPageToolOne$1 as ControllerPageToolOne, ControllerPageToolOneSchemaParams, ControllerPageToolOneSchemaQuery, ControllerPageToolTwo, ControllerPageToolTwoSchemaParams, ControllerPageToolTwoSchemaQuery, ControllerSelect, ControllerSelectModels, ControllerSelectProps, ControllerTable, ControllerTableCellTest, ControllerTableCellTestProps, ControllerTableProps, CssBase, IBehaviorOptionsFormField, IBehaviorOptionsFormFieldLayoutLogin, IBehaviorPropsInputFormField, IBehaviorPropsInputFormFieldLayoutLogin, IBehaviorPropsOutputFormField, IBehaviorPropsOutputFormFieldLayoutLogin, IBehaviorResourceFormFieldLayoutOptions, ICommandOptionsAlert, ICommandOptionsConfirm, ICommandOptionsCopy, ICommandOptionsCreate, ICommandOptionsDelete, ICommandOptionsEdit, ICommandOptionsExpr, ICommandOptionsLog, ICommandOptionsSetValue, ICommandOptionsView, ICssOptionsBase, IModelOptionsLayout, IModelOptionsMenu, IModelOptionsPassport, IModelOptionsTest, IModelOptionsTodo, IModuleApiSchema, IResourceFormFieldCaptchaOptions, IResourceFormFieldCurrencyOptions, IResourceFormFieldDateOptions, IResourceFormFieldDateRangeOptions, IResourceFormFieldInputOptions, IResourceFormFieldSelectOptions, IResourceFormFieldTextareaOptions, IServiceSsrLayoutOptions, ITableCellOptionsActionDelete, ITableCellOptionsActionOperationsRow, ITableCellOptionsActionUpdate, ITableCellOptionsActionView, ITableCellOptionsCurrency, ITableCellOptionsDate, ITableCellOptionsSelect, ITableCellOptionsTest, ITableCellOptionsText, ITableCellOptionsTextarea, IThemeOptionsDefault, IThemeOptionsOrange, Main, MetaThemeHandler, ModelLayout, ModelMenu, ModelPassport, ModelTest, ModelTodo, NSControllerPageAuthCallback, NSControllerPageErrorExpired, NSControllerPageItem, NSControllerPageRouteParams, NSControllerPageRouteQuery, NSControllerPageRouteQueryB, NSControllerPageToolOne, NSControllerPageToolTwo, OpenApiBaseURL, RenderContent, RenderHeader, RenderLayoutTabs, RenderLocale, RenderMenu, RenderPageLogin, RenderPageToolOne, RenderSidebar, RenderTable, RenderTabs, RenderTheme, RenderUser, ScopeModuleBasicAdapter, ScopeModuleBasicCaptcha, ScopeModuleBasicCommands, ScopeModuleBasicCommandssync, ScopeModuleBasicCurrency, ScopeModuleBasicDate, ScopeModuleBasicForm, ScopeModuleBasicInput, ScopeModuleBasicPage, ScopeModuleBasicPageentry, ScopeModuleBasicSelect, ScopeModuleBasicTable, ScopeModuleBasicText, ScopeModuleDemoBasic, ScopeModuleDemoStudent, ScopeModuleDemoTodo, ScopeModuleDevuiAdapter, ScopeModuleHomeApi, ScopeModuleHomeBase, ScopeModuleHomeIcon, ScopeModuleHomeIndex, ScopeModuleHomeLayoutempty, ScopeModuleHomeLayouttabs, ScopeModuleHomeLogin, ScopeModuleHomePassport, ScopeModuleHomeTheme, ServiceJwtAdapter, ServiceRouterGuards, ServiceSsr, ServiceSsrLayout, StyleLayoutTabs$1 as StyleLayoutTabs, TableCellActionDelete, TableCellActionOperationsRow, TableCellActionUpdate, TableCellActionView, TableCellCurrency, TableCellDate, TableCellSelect, TableCellTest, TableCellText, TableCellTextarea, ThemeDefault, ThemeOrange, ThemeTokenCustom, TypeCommandAlertResult, TypeCommandConfirmResult, TypeCommandCopyResult, TypeCommandCreateResult, TypeCommandDeleteResult, TypeCommandEditResult, TypeCommandExprResult, TypeCommandLogResult, TypeCommandSetValueResult, TypeCommandViewResult, TypeDateFormatPreset, TypeMenuGroup, TypeMenuItem, TypeMenuTree, ZActionBack, ZActionBackProps, ZActionCreate, ZActionCreateProps, ZActionSubmit, ZActionSubmitProps, ZActionView, ZActionViewProps, ZBlockFilter, ZBlockFilterProps, ZBlockForm, ZBlockFormProps, ZBlockPage, ZBlockPageEntry, ZBlockPageEntryProps, ZBlockPageProps, ZBlockPager, ZBlockPagerProps, ZBlockTable, ZBlockTableProps, ZBlockToolbarBulk, ZBlockToolbarBulkProps, ZBlockToolbarRow, ZBlockToolbarRowProps, ZCard, ZCardProps, ZDateRange, ZDateRangeProps, ZFormFieldCaptcha, ZFormFieldCaptchaProps, ZFormFieldCurrency, ZFormFieldCurrencyProps, ZFormFieldDate, ZFormFieldDateProps, ZFormFieldDateRange, ZFormFieldDateRangeProps, ZFormFieldInput, ZFormFieldInputProps, ZFormFieldSelect, ZFormFieldSelectProps, ZFormFieldTest, ZFormFieldTestProps, ZFormFieldTextarea, ZFormFieldTextareaProps, ZItemLink, ZItemLinkProps, ZLayoutEmpty, ZLayoutEmptyProps, ZLayoutTabs, ZLayoutTabsProps, ZPage, ZPageAuthCallback, ZPageComponent, ZPageErrorExpired, ZPageErrorNotFound, ZPageHome, ZPageItem, ZPageLocale, ZPageLogin, ZPageProps, ZPageRouteParams, ZPageRouteQuery, ZPageRouteQueryB, ZPageState, ZPageStyle, ZPageTest, ZPageTodo, ZPageToolOne, ZPageToolTwo, ZSelect, ZSelectProps, ZTable, ZTableCellTest, ZTableCellTestProps, ZTableProps, ZovaCommand, ZovaCommands, ZovaComponent, ZovaCssBase, ZovaCssMerge, ZovaEvent, ZovaIconName, ZovaRender, currencyFormat, currencyUpdate, dateFormatUtil, definePropertyScopeBase, icons, operations, paths, webhooks };