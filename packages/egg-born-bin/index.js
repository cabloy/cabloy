const path = require('path');
const fse = require('fs-extra');
const chalk = require('chalk');
const Command = require('@zhennann/egg-bin').Command;
const eggBornUtils = require('egg-born-utils');
const utils = require('./lib/utils.js');
const CliCommand = require('./lib/cmd/cli.js');
const DISPATCH = Symbol.for('eb:Command#dispatch');
const PARSE = Symbol.for('eb:Command#parse');

class EggBornBinCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin [command] [options]';

    // load directory
    this.load(path.join(__dirname, 'lib/cmd'));
  }

  *[DISPATCH]() {
    const commandName = this.rawArgv[0];
    // general
    if (commandName !== 'cli') {
      yield super[DISPATCH]();
      return;
    }
    // cli
    yield this._handleCli();
  }

  *_handleCli() {
    // get parsed argument without handling helper and version
    const parsed = yield this[PARSE](this.rawArgv);
    // argv
    const argv = {};
    argv.projectPath = process.cwd();
    // cli
    Object.assign(argv, this._prepareCliFullName(parsed._[1]));
    // token / proc
    const tokenAndProc = yield this._prepareTokenAndDevServer({ parsed, argv });
    if (!tokenAndProc) {
      // do nothing
      return;
    }
    const { token, proc } = tokenAndProc;
    // OpenAuthClient
    const openAuthClient = new eggBornUtils.OpenAuthClient({ token });
    // signin
    yield openAuthClient.signin();
    // cli meta
    const meta = yield openAuthClient.post({
      path: '/a/cli/cli/meta',
      body: {
        context: {
          argv,
        },
      },
    });
    // cli run
    const rawArgv = this.rawArgv.slice();
    rawArgv.splice(rawArgv.indexOf('cli'), 2);
    const command = new CliCommand(rawArgv, { meta, argv, openAuthClient });
    yield command[DISPATCH]();
    // logout
    yield openAuthClient.logout();
    // proc kill
    if (proc) {
      proc.kill('SIGTERM');
      yield eggBornUtils.tools.sleep(1500);
    }
    // force exit
    process.exit(0);
  }

  async _prepareTokenAndDevServer({ parsed, argv }) {
    const tokenName = parsed.token || parsed.t;
    let token = await utils.prepareToken(argv.projectPath, tokenName, { warnWhenEmpty: false });
    if (!token && tokenName) {
      console.log(chalk.red(`Open auth token not found: ${tokenName}`));
      // interrupted
      console.log(chalk.red('  cli interrupted!\n'));
      return null;
    }
    // check dev server
    let proc;
    if (!token || token.host.indexOf('http://127.0.0.1') === 0 || token.host.indexOf('http://localhost') === 0) {
      proc = await utils.forceDevServerRunning({
        projectPath: argv.projectPath,
      });
    }
    // reload token
    if (!token || proc) {
      token = await utils.prepareToken(argv.projectPath, tokenName, { warnWhenEmpty: true });
      if (!token) {
        // interrupted
        console.log(chalk.red('  cli interrupted!\n'));
        return null;
      }
    }
    // ready
    return { token, proc };
  }

  _prepareCliFullName(cliName) {
    if (!cliName) {
      return { cliFullName: 'a-clibooster:default:list' };
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
        if (!parts[0]) parts[0] = 'a-clibooster';
        return { cliFullName: 'a-clibooster:default:list', module: parts[0] };
      }
    }
    if (!parts[0]) parts[0] = 'a-clibooster';
    if (!parts[1]) parts[1] = 'default';
    if (!parts[2]) {
      // means show group's commands
      return { cliFullName: 'a-clibooster:default:list', module: parts[0], group: parts[1] };
    }
    // default
    return { cliFullName: parts.join(':') };
  }
}

module.exports = EggBornBinCommand;

function parseFirstLineDate(file) {
  // read
  const content = fse.readFileSync(file).toString();
  const lineFirst = content.split('\n')[0];
  const match = lineFirst.match(/\d{4}-\d{2}-\d{2}/);
  if (!match || !match[0]) return null;
  return new Date(match[0]);
}

function checkEslintrc() {
  const eslintrcPath = path.join(process.cwd(), '.eslintrc.js');
  if (!fse.existsSync(eslintrcPath)) return true;
  // date
  const date = parseFirstLineDate(eslintrcPath);
  if (!date) return true;
  // date src
  const eslintrcPathSrc = path.join(__dirname, './format/.eslintrc.js');
  const dateSrc = parseFirstLineDate(eslintrcPathSrc);
  return date < dateSrc;
}

function confirmFormat() {
  // check if in project path (not lerna/module)
  if (!fse.existsSync(path.join(process.cwd(), 'src/module'))) return;
  if (fse.existsSync(path.join(process.cwd(), 'packages/cabloy'))) return;
  // check .eslintrc.js
  if (!checkEslintrc()) return;
  // copy
  const files = [
    '.eslintrc.js', //
    '.eslintignore',
    '.prettierrc',
    '.prettierignore',
    ['_jsconfig.json', 'jsconfig.json'],
  ];
  for (const file of files) {
    let fileSrc;
    let fileDest;
    if (Array.isArray(file)) {
      fileSrc = file[0];
      fileDest = file[1];
    } else {
      fileSrc = file;
      fileDest = file;
    }
    fileSrc = path.join(__dirname, `./format/${fileSrc}`);
    fileDest = path.join(process.cwd(), fileDest);
    fse.copySync(fileSrc, fileDest);
  }
  console.log('eslint updated!!!\n');
}

confirmFormat();
