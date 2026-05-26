import type { IModuleInfo } from '@cabloy/module-info';

import { BeanCliBase } from '@cabloy/cli';
import fs from 'node:fs';
import path from 'node:path';

import { __ThisSetName__ } from '../this.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    name: string;
    suiteInfo: IModuleInfo;
  }
}

export class CliCreateSuite extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    // noformat
    // argv.noformat = true;
    // nameMeta
    const nameMeta = this.helper.parseNameMeta(argv.name);
    const suiteDir = nameMeta.directory || 'suite';
    argv.name = nameMeta.short;
    // suite name/info
    const suiteName = argv.name;
    argv.suiteInfo = this.helper.parseSuiteInfo(suiteName);
    // check if exists
    const _suite = this.helper.findSuite(suiteName);
    if (_suite) {
      throw new Error(`suite exists: ${suiteName}`);
    }
    // target dir
    let targetDir = path.join(argv.projectPath, `src/${suiteDir}`, suiteName);
    if (fs.existsSync(targetDir)) {
      throw new Error(`suite exists: ${suiteName}`);
    }
    targetDir = await this.helper.ensureDir(targetDir);
    // templateDir
    const templateDir = this.template.resolveTemplatePath(__ThisSetName__, 'create/suite');
    // render
    await this.template.renderDir(targetDir, templateDir);
  }
}
