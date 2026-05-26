import type { TypeBrandName } from '@cabloy/module-info';

import CommonBin from '@zhennann/common-bin';

import type { ICommandArgv } from './types/argv.ts';

import { BeanCli } from './lib/bean.cli.ts';
import { CliCommand } from './lib/cli.ts';
import { collectCommands } from './lib/commands.ts';

const DISPATCH = Symbol.for('eb:Command#dispatch');
const PARSE = Symbol.for('eb:Command#parse');

export class CabloyCommand extends CommonBin {
  brandName: TypeBrandName;
  defaultSetName: string;

  constructor(brandName: TypeBrandName, rawArgv?) {
    super(rawArgv);
    this.usage = `Usage: ${brandName} [command] [options]`;
    this.defaultSetName = brandName === 'zova' ? 'front' : 'api';
    this.brandName = brandName;
    process.env.CabloyCliBrandName = brandName;
  }

  async [DISPATCH]() {
    const parsed = await this[PARSE](this.rawArgv);
    if (parsed._.length === 0) {
      await super[DISPATCH]();
      return;
    }
    // checkForUpdates
    // checkForUpdates(`${this.brandName}-cli`);
    // collectCommands
    await collectCommands();
    // cli
    await this._handleCli();
  }

  async _handleCli() {
    // get parsed argument without handling helper and version
    const parsed = await this[PARSE](this.rawArgv);
    // argv
    const argv = {
      projectPath: process.cwd(),
    } as ICommandArgv;
    // indexBrandName
    const indexBrandName = this.rawArgv.indexOf(this.brandName);
    // cli
    const indexCommand = indexBrandName > -1 ? indexBrandName + 1 : 0;
    Object.assign(argv, this._prepareCliFullName(parsed._[indexCommand]));
    // cli meta
    const context = { brandName: this.brandName, argv };
    const beanCli = new BeanCli();
    const meta = await beanCli.meta({ context });
    // cli run
    const rawArgv = this.rawArgv.slice();
    if (indexBrandName > -1) {
      rawArgv.splice(0, indexBrandName + 2);
    } else {
      rawArgv.splice(0, 1);
    }
    const command = new CliCommand(rawArgv, { meta, argv });
    await command[DISPATCH]();
    // should not force exit, let app shutdown gracefully
    // process.exit(0);
  }

  _prepareCliFullName(cliName) {
    if (!cliName) {
      return { cliFullName: `${this.defaultSetName}:default:list` };
      // throw new Error('Please specify the cli name');
    }
    const parts = cliName.split(':');
    if (parts.length === 1) {
      // means show module's commands
      parts[1] = '';
    }
    if (parts.length === 2) {
      if (parts[1]) {
        // means show group's commands
        parts[2] = '';
      } else {
        // means show module's commands
        if (!parts[0]) parts[0] = this.defaultSetName;
        return { cliFullName: `${this.defaultSetName}:default:list`, set: parts[0] };
      }
    }
    if (!parts[0]) parts[0] = this.defaultSetName;
    if (!parts[1]) parts[1] = 'default';
    if (!parts[2]) {
      // means show group's commands
      return { cliFullName: `${this.defaultSetName}:default:list`, set: parts[0], group: parts[1] };
    }
    // default
    return { cliFullName: parts.join(':') };
  }
}
