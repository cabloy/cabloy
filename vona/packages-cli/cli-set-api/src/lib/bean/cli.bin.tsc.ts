import { BeanCliBase } from '@cabloy/cli';

declare module '@cabloy/cli' {
  interface ICommandArgv {
    force: boolean;
  }
}

export class CliBinTsc extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    const projectPath = argv.projectPath;
    const force = argv.force;
    await this._tsc(projectPath, force);
  }

  async _tsc(projectPath: string, force: boolean) {
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
    // tsc: project
    // eslint-disable-next-line
    console.log(`===>  ${++counter}/${count} project`);
    await this.helper.processHelper.tsc(tscArgs, { cwd: projectPath });
    // suites
    for (const key of suiteNames) {
      const suite = this.modulesMeta.suites[key];
      // eslint-disable-next-line
      console.log(`===>  ${++counter}/${count} suite: ${suite.info.originalName}`);
      await this.helper.processHelper.tsc(tscArgs, { cwd: suite.root });
    }
    // modules
    for (const module of modulesArray) {
      // eslint-disable-next-line
      console.log(`===>  ${++counter}/${count} module: ${module.info.originalName}`);
      await this.helper.processHelper.tsc(tscArgs, { cwd: module.root });
    }
    // end
    const timeEnd = Date.now();
    // eslint-disable-next-line
    console.log(`===> tsc end: ${(timeEnd - timeBegin) / 1000}s`);
  }
}
