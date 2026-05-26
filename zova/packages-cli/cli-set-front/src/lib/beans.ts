import { CliBinBuildModule } from './bean/cli.bin.buildModule.ts';
import { CliBinBuildRest } from './bean/cli.bin.buildRest.ts';
import { CliCreateBean } from './bean/cli.create.bean.ts';
import { CliCreateComponent } from './bean/cli.create.component.ts';
import { CliCreateMock } from './bean/cli.create.mock.ts';
import { CliCreateModule } from './bean/cli.create.module.ts';
import { CliCreatePage } from './bean/cli.create.page.ts';
import { CliCreateProject } from './bean/cli.create.project.ts';
import { CliCreateSuite } from './bean/cli.create.suite.ts';
import { CliDefaultList } from './bean/cli.default.list.ts';
import { CliInitAppMonkey } from './bean/cli.init.appMonkey.ts';
import { CliInitAsset } from './bean/cli.init.asset.ts';
import { CliInitConfig } from './bean/cli.init.config.ts';
import { CliInitConstant } from './bean/cli.init.constant.ts';
import { CliInitError } from './bean/cli.init.error.ts';
import { CliInitIcon } from './bean/cli.init.icon.ts';
// import { CliInitLegacy } from './bean/cli.init.legacy.ts';
import { CliInitLib } from './bean/cli.init.lib.ts';
import { CliInitLocale } from './bean/cli.init.locale.ts';
import { CliInitMain } from './bean/cli.init.main.ts';
import { CliInitMainSys } from './bean/cli.init.mainSys.ts';
import { CliInitMonkey } from './bean/cli.init.monkey.ts';
import { CliInitMonkeySys } from './bean/cli.init.monkeySys.ts';
import { CliInitSysMonkey } from './bean/cli.init.sysMonkey.ts';
import { CliInitTypes } from './bean/cli.init.types.ts';
import { CliOpenapiConfig } from './bean/cli.openapi.config.ts';
import { CliOpenapiGenerate } from './bean/cli.openapi.generate.ts';
import { CliRefactorAnotherRender } from './bean/cli.refactor.anotherRender.ts';
import { CliRefactorAnotherStyle } from './bean/cli.refactor.anotherStyle.ts';
import { CliRefactorComponentEmits } from './bean/cli.refactor.componentEmits.ts';
import { CliRefactorComponentGeneric } from './bean/cli.refactor.componentGeneric.ts';
import { CliRefactorComponentModel } from './bean/cli.refactor.componentModel.ts';
import { CliRefactorComponentProps } from './bean/cli.refactor.componentProps.ts';
import { CliRefactorComponentSlots } from './bean/cli.refactor.componentSlots.ts';
import { CliRefactorFirstRender } from './bean/cli.refactor.firstRender.ts';
import { CliRefactorFirstStyle } from './bean/cli.refactor.firstStyle.ts';
import { CliRefactorPageParams } from './bean/cli.refactor.pageParams.ts';
import { CliRefactorPageQuery } from './bean/cli.refactor.pageQuery.ts';
import { CliRefactorRenameComponent } from './bean/cli.refactor.renameComponent.ts';
import { CliToolsDeps } from './bean/cli.tools.deps.ts';
import { CliToolsMetadata } from './bean/cli.tools.metadata.ts';

export const beans = {
  'default.list': CliDefaultList,
  'bin.buildModule': CliBinBuildModule,
  'bin.buildRest': CliBinBuildRest,
  'create.project': CliCreateProject,
  'create.suite': CliCreateSuite,
  'create.module': CliCreateModule,
  'create.page': CliCreatePage,
  'create.component': CliCreateComponent,
  'create.mock': CliCreateMock,
  'create.bean': CliCreateBean,
  'init.icon': CliInitIcon,
  'init.config': CliInitConfig,
  'init.constant': CliInitConstant,
  'init.locale': CliInitLocale,
  'init.error': CliInitError,
  // 'init.legacy': CliInitLegacy,
  'init.appMonkey': CliInitAppMonkey,
  'init.sysMonkey': CliInitSysMonkey,
  'init.monkey': CliInitMonkey,
  'init.monkeySys': CliInitMonkeySys,
  'init.main': CliInitMain,
  'init.mainSys': CliInitMainSys,
  'init.asset': CliInitAsset,
  'init.lib': CliInitLib,
  'init.types': CliInitTypes,
  'refactor.pageQuery': CliRefactorPageQuery,
  'refactor.pageParams': CliRefactorPageParams,
  'refactor.componentGeneric': CliRefactorComponentGeneric,
  'refactor.firstRender': CliRefactorFirstRender,
  'refactor.firstStyle': CliRefactorFirstStyle,
  'refactor.anotherRender': CliRefactorAnotherRender,
  'refactor.anotherStyle': CliRefactorAnotherStyle,
  'refactor.componentProps': CliRefactorComponentProps,
  'refactor.componentEmits': CliRefactorComponentEmits,
  'refactor.componentSlots': CliRefactorComponentSlots,
  'refactor.componentModel': CliRefactorComponentModel,
  'refactor.renameComponent': CliRefactorRenameComponent,
  'tools.metadata': CliToolsMetadata,
  'tools.deps': CliToolsDeps,
  'openapi.config': CliOpenapiConfig,
  'openapi.generate': CliOpenapiGenerate,
};
