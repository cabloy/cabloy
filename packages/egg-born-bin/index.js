const path = require('path');
const fse = require('fs-extra');
const chalk = require('chalk');
const Command = require('@zhennann/egg-bin').Command;
const eggBornUtils = require('egg-born-utils');
const utils = require('./lib/utils.js');
const OpenAuth = require('./lib/openAuth.js');
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
    argv.cliFullName = this._prepareCliFullName(parsed._[1]);
    // check dev server
    const devServerRunning = yield utils.checkIfDevServerRunning({
      projectPath: argv.projectPath,
      needDevServer: true,
    });
    if (!devServerRunning) return;
    // token
    const tokenName = parsed.token || parsed.t;
    const token = yield eggBornUtils.openAuthConfig.prepareToken(argv.projectPath, tokenName);
    if (!token) {
      console.log(chalk.red(`Open auth token not found: ${tokenName}\n`));
      return;
    }
    // OpenAuth
    const openAuth = new OpenAuth({ host: token.host });
    // signin
    const res = yield openAuth.post({
      path: '/a/authopen/auth/signin',
      body: {
        data: {
          clientID: token.clientID,
          clientSecret: token.clientSecret,
        },
      },
    });
    // locale
    let locale = res.user.agent.locale;
    if (!locale) {
      locale = eggBornUtils.tools.preferredLocale({ locale: null, locales: res.locales });
    }
    // cli meta
    const meta = yield openAuth.post({
      path: `/a/cli/cli/meta?locale=${locale}`,
      body: {
        context: {
          argv,
        },
      },
    });
    // cli run
    const rawArgv = this.rawArgv.slice();
    rawArgv.splice(rawArgv.indexOf('cli'), 2);
    const command = new CliCommand(rawArgv, { meta, argv, openAuth, locale });
    yield command[DISPATCH]();
    // logout
    yield openAuth.post({
      path: '/a/base/auth/logout',
    });
  }

  _prepareCliFullName(cliName) {
    if (!cliName) {
      return 'a-clibooster:default:list';
      // throw new Error('Please specify the cli name');
    }
    const parts = cliName.split(':');
    if (parts.length !== 3) {
      throw new Error('The cli name is not valid');
    }
    if (!parts[0]) parts[0] = 'a-clibooster';
    if (!parts[1]) parts[1] = 'default';
    return parts.join(':');
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
