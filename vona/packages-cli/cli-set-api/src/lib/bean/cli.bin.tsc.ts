import { BeanCliBase } from '@cabloy/cli';

import type { TypeScriptCompiler } from '../typescriptRunner.ts';

import { runTypeScript } from '../typescriptRunner.ts';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    force: boolean;
    compiler: TypeScriptCompiler;
  }
}

export class CliBinTsc extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    const projectPath = argv.projectPath;
    const force = argv.force;
    await this._tsc(projectPath, force, argv.compiler ?? 'typescript');
  }

  async _tsc(projectPath: string, force: boolean, compiler: TypeScriptCompiler = 'typescript') {
    const suiteNames = Object.keys(this.modulesMeta.suites).filter(
      suiteName => !this.modulesMeta.suites[suiteName].info.node_modules,
    );
    const modulesArray = this.modulesMeta.modulesArray.filter(
      item => !item.suite && !item.info.node_modules,
    );
    // count
    const count = 1 + suiteNames.length + modulesArray.length;
    // begin
    let counter = 0;
    const timeBegin = Date.now();
    // eslint-disable-next-line
    console.log('===> build begin');
    // args
    const tscArgs = ['-b'];
    if (force) {
      tscArgs.push('--force');
    }
    const check = async (cwd: string) => {
      if (compiler === 'native') {
        await runTypeScript(compiler, tscArgs, { projectPath, cwd });
      } else {
        await this.helper.processHelper.tsc(tscArgs, { cwd });
      }
    };
    // tsc: project
    // eslint-disable-next-line
    console.log(`===>  ${++counter}/${count} project`);
    await check(projectPath);
    // suites
    for (const key of suiteNames) {
      const suite = this.modulesMeta.suites[key];
      // eslint-disable-next-line
      console.log(`===>  ${++counter}/${count} suite: ${suite.info.originalName}`);
      await check(suite.root);
    }
    // modules
    for (const module of modulesArray) {
      // eslint-disable-next-line
      console.log(`===>  ${++counter}/${count} module: ${module.info.originalName}`);
      await check(module.root);
    }
    // end
    const timeEnd = Date.now();
    // eslint-disable-next-line
    console.log(`===> tsc end: ${(timeEnd - timeBegin) / 1000}s`);
  }
}
