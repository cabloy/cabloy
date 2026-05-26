import { CliBinBuild } from './bean/cli.bin.build.ts';
import { CliBinBuildGeneral } from './bean/cli.bin.buildGeneral.ts';
import { CliBinBuildModule } from './bean/cli.bin.buildModule.ts';
import { CliBinDbReset } from './bean/cli.bin.dbReset.ts';
import { CliBinDev } from './bean/cli.bin.dev.ts';
import { CliBinPlay } from './bean/cli.bin.play.ts';
import { CliBinTest } from './bean/cli.bin.test.ts';
import { CliBinTsc } from './bean/cli.bin.tsc.ts';
import { CliCreateBean } from './bean/cli.create.bean.ts';
import { CliCreateModule } from './bean/cli.create.module.ts';
import { CliCreateProject } from './bean/cli.create.project.ts';
import { CliCreateSuite } from './bean/cli.create.suite.ts';
import { CliCreateTest } from './bean/cli.create.test.ts';
import { CliDefaultList } from './bean/cli.default.list.ts';
import { CliInitAppMonkey } from './bean/cli.init.appMonkey.ts';
import { CliInitAsset } from './bean/cli.init.asset.ts';
import { CliInitConfig } from './bean/cli.init.config.ts';
import { CliInitConstant } from './bean/cli.init.constant.ts';
import { CliInitError } from './bean/cli.init.error.ts';
import { CliInitLib } from './bean/cli.init.lib.ts';
import { CliInitLocale } from './bean/cli.init.locale.ts';
import { CliInitMain } from './bean/cli.init.main.ts';
import { CliInitMonkey } from './bean/cli.init.monkey.ts';
import { CliInitStatic } from './bean/cli.init.static.ts';
import { CliInitTypes } from './bean/cli.init.types.ts';
import { CliToolsCrud } from './bean/cli.tools.crud.ts';
import { CliToolsCrudBasic } from './bean/cli.tools.crudBasic.ts';
import { CliToolsCrudStart } from './bean/cli.tools.crudStart.ts';
import { CliToolsDeps } from './bean/cli.tools.deps.ts';
import { CliToolsMetadata } from './bean/cli.tools.metadata.ts';

export const beans = {
  'default.list': CliDefaultList,
  'bin.build': CliBinBuild,
  'bin.buildModule': CliBinBuildModule,
  'bin.buildGeneral': CliBinBuildGeneral,
  'bin.dbReset': CliBinDbReset,
  'bin.play': CliBinPlay,
  'bin.dev': CliBinDev,
  'bin.test': CliBinTest,
  'bin.tsc': CliBinTsc,
  'create.suite': CliCreateSuite,
  'create.bean': CliCreateBean,
  'create.module': CliCreateModule,
  'create.project': CliCreateProject,
  'create.test': CliCreateTest,
  'init.config': CliInitConfig,
  'init.constant': CliInitConstant,
  'init.error': CliInitError,
  'init.locale': CliInitLocale,
  'init.monkey': CliInitMonkey,
  'init.main': CliInitMain,
  'init.static': CliInitStatic,
  'init.asset': CliInitAsset,
  'init.lib': CliInitLib,
  'init.types': CliInitTypes,
  'init.appMonkey': CliInitAppMonkey,
  'tools.deps': CliToolsDeps,
  'tools.metadata': CliToolsMetadata,
  'tools.crudBasic': CliToolsCrudBasic,
  'tools.crudStart': CliToolsCrudStart,
  'tools.crud': CliToolsCrud,
};
