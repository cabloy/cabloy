import binBuildModule from './command/bin.buildModule.ts';
import binBuildRest from './command/bin.buildRest.ts';
import createBean from './command/create.bean.ts';
import createComponent from './command/create.component.ts';
import createMock from './command/create.mock.ts';
import createModule from './command/create.module.ts';
import createPage from './command/create.page.ts';
import createProject from './command/create.project.ts';
import createSuite from './command/create.suite.ts';
import defaultList from './command/default.list.ts';
import initAppMonkey from './command/init.appMonkey.ts';
import initAsset from './command/init.asset.ts';
import initConfig from './command/init.config.ts';
import initConstant from './command/init.constant.ts';
import initError from './command/init.error.ts';
import initIcon from './command/init.icon.ts';
// import initLegacy from './command/init.legacy.ts';
import initLib from './command/init.lib.ts';
import initLocale from './command/init.locale.ts';
import initMain from './command/init.main.ts';
import initMainSys from './command/init.mainSys.ts';
import initMonkey from './command/init.monkey.ts';
import initMonkeySys from './command/init.monkeySys.ts';
import initSysMonkey from './command/init.sysMonkey.ts';
import initTypes from './command/init.types.ts';
import openapiConfig from './command/openapi.config.ts';
import openapiGenerate from './command/openapi.generate.ts';
import refactorAnotherRender from './command/refactor.anotherRender.ts';
import refactorAnotherStyle from './command/refactor.anotherStyle.ts';
import refactorComponentGeneric from './command/refactor.componentGeneric.ts';
import refactorComponentModel from './command/refactor.componentModel.ts';
import refactorComponentProps from './command/refactor.componentProps.ts';
import refactorFirstRender from './command/refactor.firstRender.ts';
import refactorFirstStyle from './command/refactor.firstStyle.ts';
import refactorPageParams from './command/refactor.pageParams.ts';
import refactorPageQuery from './command/refactor.pageQuery.ts';
import refactorRenameComponent from './command/refactor.renameComponent.ts';
import toolsDeps from './command/tools.deps.ts';
// import toolsIcon from './command/tools.icon.ts';
import toolsMetadata from './command/tools.metadata.ts';

export const commands = {
  default: {
    list: defaultList,
  },
  bin: {
    buildModule: binBuildModule,
    buildRest: binBuildRest,
  },
  create: {
    project: createProject,
    suite: createSuite,
    module: createModule,
    page: createPage,
    component: createComponent,
    mock: createMock,
    bean: createBean,
  },
  init: {
    icon: initIcon,
    config: initConfig,
    constant: initConstant,
    locale: initLocale,
    error: initError,
    // legacy: initLegacy,
    appMonkey: initAppMonkey,
    sysMonkey: initSysMonkey,
    monkey: initMonkey,
    monkeySys: initMonkeySys,
    main: initMain,
    mainSys: initMainSys,
    asset: initAsset,
    lib: initLib,
    types: initTypes,
  },
  refactor: {
    pageQuery: refactorPageQuery,
    pageParams: refactorPageParams,
    componentGeneric: refactorComponentGeneric,
    firstRender: refactorFirstRender,
    firstStyle: refactorFirstStyle,
    anotherRender: refactorAnotherRender,
    anotherStyle: refactorAnotherStyle,
    componentProps: refactorComponentProps,
    // componentEmits: refactorComponentEmits,
    // componentSlots: refactorComponentSlots,
    componentModel: refactorComponentModel,
    renameComponent: refactorRenameComponent,
  },
  tools: {
    // icon: toolsIcon,
    metadata: toolsMetadata,
    deps: toolsDeps,
  },
  openapi: {
    config: openapiConfig,
    generate: openapiGenerate,
  },
};
