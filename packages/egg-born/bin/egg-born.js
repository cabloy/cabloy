#!/usr/bin/env node

const co = require('co');
const Command = require('@zhennann/egg-init');
const path = require('path');
const randomize = require('randomatic');
const uuid = require('uuid');

co(function* () {
  const options = {
    name: 'egg-born',
    configName: 'egg-born-init-config',
    pkgInfo: require('../package.json'),
  };

  const command = new Command(options);

  command.printUsage = function () {
    this.log(`usage:
      - cd ${this.targetDir}
      - npm install
      - npm run cli
      - npm run db:reset
      - npm run test:backend
      - npm run dev:backend
      - npm run dev:front
      - npm run build:front
      - npm run start:backend
      - npm run start:backend-daemon
      - npm run stop:backend
      - npm run debug:backend
      - npm run cov:backend
      - npm run lint
      - npm run format
    `);
  };

  command.getTemplateDir = function* () {
    // download boilerplate
    return yield this.downloadBoilerplate('egg-born-template-cabloy');
  };

  const askForVariable = command.askForVariable;
  command.askForVariable = function* (targetDir, templateDir) {
    const locals = yield askForVariable.call(command, targetDir, templateDir);
    // targetDir
    locals.targetDir = this.targetDir.replace(/\\/gi, '/');
    // publicDir
    locals.publicDir = path.join(require('os').homedir(), 'cabloy', locals.name).replace(/\\/gi, '/');
    // mysql
    locals.mysqlRootPassword = randomize('*', 16, { exclude: '\\\'"$' });
    locals.mysqlUserPassword = randomize('*', 16, { exclude: '\\\'"$' });
    locals.mysqlUserName = 'web_user';
    // safeKeys
    locals.safeKeys = `${uuid.v4()}_${Date.now()}_${random(100, 10000)}`;
    // ready
    return locals;
  };

  const processFiles = command.processFiles;
  command.processFiles = function* (targetDir, templateDir) {
    // process files
    yield processFiles.call(command, targetDir, templateDir);
  };

  // run
  yield command.run(process.cwd(), process.argv.slice(2));
}).catch(err => {
  console.error(err.stack);
  process.exit(1);
});

function random(start, end) {
  return Math.floor(Math.random() * (end - start) + start);
}
