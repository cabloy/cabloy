const fs = require('fs');
const path = require('path');

const moduleInfo = module.info;
module.exports = class Cli extends module.meta.class.CliBase {
  async execute({ user }) {
    const { argv } = this.context;
    // super
    await super.execute({ user });
    // suite name/info
    const suiteName = argv.name;
    argv.suiteInfo = this.helper.parseSuiteInfo(suiteName);
    // check if exists
    const _suite = this.helper.findSuite(suiteName);
    if (_suite) {
      throw new Error(`suite exists: ${suiteName}`);
    }
    // target dir
    let targetDir = path.join(argv.projectPath, 'src/suite', suiteName);
    if (fs.existsSync(targetDir)) {
      throw new Error(`suite exists: ${suiteName}`);
    }
    targetDir = await this.helper.ensureDir(targetDir);
    // templateDir
    const templateDir = this.template.resolvePath({
      moduleName: moduleInfo.relativeName,
      path: 'create/suite',
    });
    // render
    await this.template.renderDir({ targetDir, templateDir });
    // reload
    this.ctx.app.meta.reload.now();
  }
};
