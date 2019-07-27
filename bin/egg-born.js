#!/usr/bin/env node

const os = require('os');
const co = require('co');
const Command = require('@zhennann/egg-init');
const path = require('path');
const fse = require('fs-extra');
const rimraf = require('mz-modules/rimraf');
const compressing = require('compressing');

co(function* () {

  const options = {
    name: 'egg-born',
    configName: 'egg-born-init-config',
    pkgInfo: require('../package.json'),
  };

  const command = new Command(options);

  command.printUsage = function() {
    this.log(`usage:
      - cd ${this.targetDir}
      - npm install
      - npm run dev:front
      - npm run build:front
      - npm run dev:backend
      - npm run debug:backend
      - npm run lint
      - npm run test:backend
      - npm run cov:backend
      - npm run start:backend
      - npm run stop:backend
    `);
  };

  const askForVariable = command.askForVariable;
  command.askForVariable = function* (targetDir, templateDir) {
    const locals = yield askForVariable.call(command, targetDir, templateDir);
    // targetDir
    locals.targetDir = this.targetDir.replace(/\\/gi, '/');
    // publicDir
    locals.publicDir = path.join(require('os').homedir(), 'cabloy', locals.name).replace(/\\/gi, '/');
    return locals;
  };

  const processFiles = command.processFiles;
  command.processFiles = function* (targetDir, templateDir) {
    // download test-party
    let testPartyDir;
    const pkg = require(path.join(templateDir, 'package.json'));
    if (pkg.name === 'egg-born-template-cabloy') {
      // download
      testPartyDir = yield this.downloadModule('egg-born-module-test-party');
    }
    // process files
    yield processFiles.call(command, targetDir, templateDir);
    // move test-party
    if (testPartyDir) {
      const destDir = path.join(targetDir, 'src/module');
      // move
      fse.moveSync(testPartyDir, path.join(destDir, 'test-party'));
      // delete .gitkeep
      fse.removeSync(path.join(destDir, '.gitkeep'));
    }
  };

  command.downloadModule = function* (pkgName) {
    const result = yield this.getPackageInfo(pkgName, false);
    const tgzUrl = result.dist.tarball;

    this.log(`downloading ${tgzUrl}`);

    const saveDir = path.join(os.tmpdir(), 'egg-born-module');
    yield rimraf(saveDir);

    const response = yield this.curl(tgzUrl, { streaming: true, followRedirect: true });
    yield compressing.tgz.uncompress(response.res, saveDir);

    this.log(`extract to ${saveDir}`);
    return path.join(saveDir, '/package');
  };

  // run
  yield command.run(process.cwd(), process.argv.slice(2));

}).catch(err => {
  console.error(err.stack);
  process.exit(1);
});

