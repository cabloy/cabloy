const path = require('path');
const fse = require('fs-extra');
const Command = require('@zhennann/egg-bin').Command;
const eggBornUtils = require('egg-born-utils');
const OpenAuth = require('./lib/openAuth.js');
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
    const context = this.context;
    // argv
    const argv = {};
    argv.projectPath = context.cwd;
    // cli
    const cliFullName = this._prepareCliFullName(context.argv._[1]);
    // token
    const token = yield this._prepareToken(argv, context.argv.token);
    // OpenAuth
    const openAuth = new OpenAuth({ host: token.host });
    // signin
    let res = yield openAuth.post({
      path: '/a/authopen/auth/signin',
      body: {
        data: {
          clientID: token.clientID,
          clientSecret: token.clientSecret,
        },
      },
    });
    // cli meta
    res = yield openAuth.post({
      path: '/a/cli/cli/meta',
    });
    console.log(res);
    // cli run
    // logout
    yield openAuth.post({
      path: '/a/base/auth/logout',
    });
  }

  _prepareCliFullName(cliName) {
    if (!cliName) {
      throw new Error('Please specify the cli name');
    }
    const parts = cliName.split(':');
    if (parts.length !== 2) {
      throw new Error('The cli name is not valid');
    }
    if (!parts[0]) parts[0] = 'a-clibooster';
    return parts.join(':');
  }

  *_prepareToken(argv, tokenName) {
    // tokenName
    tokenName = this._prepareTokenName(argv, tokenName);
    // init file
    const { config } = yield eggBornUtils.openAuthConfig.load();
    return config.tokens[tokenName];
  }

  _prepareTokenName(argv, tokenName) {
    if (tokenName) return tokenName;
    const pkg = require(path.join(argv.projectPath, 'package.json'));
    return `clidev@${pkg.name}`;
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
    'jsconfig.json',
  ];
  for (const file of files) {
    const fileDest = path.join(process.cwd(), file);
    const fileSrc = path.join(__dirname, `./format/${file}`);
    fse.copySync(fileSrc, fileDest);
  }
  console.log('eslint updated!!!\n');
}

confirmFormat();
