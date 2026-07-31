import type { CmdOptions, NameMeta } from '@cabloy/cli';
import type { IModuleInfo } from '@cabloy/module-info';

import { BeanCliBase } from '@cabloy/cli';
import fs from 'node:fs';
import path from 'node:path';

import { __ThisSetName__ } from '../this.ts';
import { loadZovaEnvs } from './utils.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    module: string;
    moduleInfo: IModuleInfo;
    pageName: string;
    nameMeta: NameMeta;
  }
}

export class CliCreatePageBase extends BeanCliBase {
  pageMode: string;

  constructor(options: CmdOptions, pageMode) {
    super(options);
    this.pageMode = pageMode;
  }

  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    // module name/info
    const moduleName = argv.module;
    argv.moduleInfo = this.helper.parseModuleInfoCanonical(moduleName);
    const _module = this.helper.findModuleCanonical(moduleName);
    // target dir
    const targetDir = await this.helper.ensureDir(_module.root);
    // pageName
    const pageName = argv.pageName;
    // nameMeta
    argv.nameMeta = this.helper.parseNameMeta(pageName);
    // directory
    let pageDir = path.join(targetDir, 'src/page');
    pageDir = path.join(pageDir, pageName);
    if (fs.existsSync(pageDir)) {
      throw new Error(`page exists: ${pageName}`);
    }
    await this.helper.ensureDir(pageDir);
    // render snippets
    await this.template.renderBoilerplateAndSnippets({
      targetDir,
      setName: __ThisSetName__,
      snippetsPath: `create/${this.pageMode}/snippets`,
      boilerplatePath: null,
    });
    // render boilerplate
    await this.template.renderBoilerplateAndSnippets({
      targetDir: pageDir,
      setName: __ThisSetName__,
      snippetsPath: null,
      boilerplatePath: `create/${this.pageMode}/boilerplate`,
    });
    // tools.metadata
    if (!argv.nometadata) {
      await this.helper.invokeCli([':tools:metadata', moduleName], { cwd: argv.projectPath });
    }
    // log url
    await this.logUrl(argv);
  }

  async logUrl(argv) {
    const env = loadZovaEnvs(argv.projectPath, {
      flavor: 'admin',
      mode: 'development',
      appMode: 'spa',
    });
    const host =
      !env.DEV_SERVER_HOSTNAME || env.DEV_SERVER_HOSTNAME === 'true'
        ? 'localhost'
        : env.DEV_SERVER_HOSTNAME;
    const port = env.DEV_SERVER_PORT;
    const url = `http://${host}:${port}/${argv.moduleInfo.pid}/${argv.moduleInfo.name}/${argv.pageName}`;
    const message = `Page URL: ${url}`;
    await this.console.log(message);
  }
}
