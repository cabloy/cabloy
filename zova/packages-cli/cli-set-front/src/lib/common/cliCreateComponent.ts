import type { CmdOptions, NameMeta } from '@cabloy/cli';
import type { IModuleInfo } from '@cabloy/module-info';

import { BeanCliBase } from '@cabloy/cli';
import { toUpperCaseFirstChar } from '@cabloy/word-utils';
import fs from 'node:fs';
import path from 'node:path';

import { __ThisSetName__ } from '../this.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    module: string;
    moduleInfo: IModuleInfo;
    componentName: string;
    nameMeta: NameMeta;
    boilerplate: string;
  }
}

export class CliCreateComponentBase extends BeanCliBase {
  componentMode: string;

  constructor(options: CmdOptions, componentMode) {
    super(options);
    this.componentMode = componentMode;
  }

  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    // module name/info
    const moduleName = argv.module;
    argv.moduleInfo = this.helper.parseModuleInfo(moduleName);
    // check if exists
    const _module = this.helper.findModule(moduleName);
    if (!_module) {
      throw new Error(`module does not exist: ${moduleName}`);
    }
    // target dir
    const targetDir = await this.helper.ensureDir(_module.root);
    // componentName
    const componentName = argv.componentName;
    // nameMeta
    argv.nameMeta = this.helper.parseNameMeta(componentName);
    // directory
    let componentDir = path.join(targetDir, 'src/component');
    componentDir = path.join(componentDir, componentName);
    if (fs.existsSync(componentDir)) {
      throw new Error(`component exists: ${componentName}`);
    }
    await this.helper.ensureDir(componentDir);
    // // render snippets
    // await this.template.renderBoilerplateAndSnippets({
    //   targetDir,
    //   setName: __ThisSetName__,
    //   snippetsPath: `create/${this.componentMode}/snippets`,
    //   boilerplatePath: null,
    // });
    // boilerplate
    let boilerplate = 'boilerplate';
    if (argv.boilerplate) {
      boilerplate = `${boilerplate}${toUpperCaseFirstChar(argv.boilerplate)}`;
    }
    // render boilerplate
    await this.template.renderBoilerplateAndSnippets({
      targetDir: componentDir,
      setName: __ThisSetName__,
      snippetsPath: null,
      boilerplatePath: `create/${this.componentMode}/${boilerplate}`,
    });
    // tools.metadata
    if (!argv.nometadata) {
      await this.helper.invokeCli([':tools:metadata', moduleName], { cwd: argv.projectPath });
    }
  }
}
