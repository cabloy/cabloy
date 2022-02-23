const path = require('path');
const chalk = require('chalk');
const glob = require('glob');
const bb = require('bluebird');
const Command = require('@zhennann/egg-bin').Command;

class ToolsIconsCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin tools-icons';
  }

  async run({ cwd, argv }) {
    console.log('run tools icons at %s', cwd);

    const moduleNames = argv._;
    for (const moduleName of moduleNames) {
      console.log(moduleName);
      await this._generateIcons({ cwd, moduleName });
    }
    // done
    console.log(chalk.cyan('  tools-icons successfully!'));
  }

  async _generateIcons({ cwd, moduleName }) {
    const modulePath = await this._resolveModulePath({ cwd, moduleName });
    const iconsSrc = path.join(modulePath, 'icons/src');
    // groups
    const groups = await this._resolveGroups({ iconsSrc });
    console.log(groups);
  }

  async _resolveModulePath({ cwd, moduleName }) {
    const files = await bb.fromCallback(cb => {
      glob(`${cwd}/src/**/${moduleName}/`, cb);
    });
    if (files.length === 0) throw new Error('module not found: ', moduleName);
    return files[0];
  }

  async _resolveGroups({ iconsSrc }) {
    const groupPaths = await bb.fromCallback(cb => {
      glob(`${iconsSrc}/*`, cb);
    });
    return groupPaths.map(item => path.basename(item));
  }

  description() {
    return 'tools icons';
  }
}

module.exports = ToolsIconsCommand;
