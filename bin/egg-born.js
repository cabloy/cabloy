#!/usr/bin/env node

const os = require('os');
const co = require('co');
const Command = require('@zhennann/egg-init');
const path = require('path');
const fse = require('fs-extra');
const rimraf = require('mz-modules/rimraf');
const compressing = require('compressing');
const randomize = require('randomatic');

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
    // mysql
    locals.mysqlRootPassword = randomize('*', 16, { exclude: '\\\'"$' });
    locals.mysqlUserPassword = randomize('*', 16, { exclude: '\\\'"$' });
    locals.mysqlUserName = 'web_user';
    // ready
    return locals;
  };

  const processFiles = command.processFiles;
  command.processFiles = function* (targetDir, templateDir) {
    // download modules
    let modules;
    const pkg = require(path.join(templateDir, 'package.json'));
    if (pkg.name === 'egg-born-template-cabloy') {
      // download
      modules = {};
      for (const moduleName of [ 'test-party', 'test-partymonkey-monkey' ]) {
        modules[moduleName] = yield this.__downloadCabloyModule(moduleName);
      }
    }
    // process files
    yield processFiles.call(command, targetDir, templateDir);
    // move modules
    if (modules) {
      for (const moduleName in modules) {
        this.__moveCabloyModule(moduleName, modules[moduleName], targetDir);
      }
    }
  };

  command.__downloadCabloyModule = function* (moduleName) {
    const pkgName = `egg-born-module-${moduleName}`;
    const result = yield this.getPackageInfo(pkgName, false);
    const tgzUrl = result.dist.tarball;

    this.log(`downloading ${tgzUrl}`);

    const saveDir = path.join(os.tmpdir(), pkgName);
    yield rimraf(saveDir);

    const response = yield this.curl(tgzUrl, { streaming: true, followRedirect: true });
    yield compressing.tgz.uncompress(response.res, saveDir);

    this.log(`extract to ${saveDir}`);
    return path.join(saveDir, '/package');
  };

  command.__moveCabloyModule = function(moduleName, moduleSrcDir, targetDir) {
    const destDir = path.join(targetDir, 'src/module');
    // move
    fse.moveSync(moduleSrcDir, path.join(destDir, moduleName));
    // delete .gitkeep
    fse.removeSync(path.join(destDir, '.gitkeep'));

    // mergeDependencies
    const targetPathProject = path.join(targetDir, 'package.json');
    const sourcePathTest = path.join(destDir, `${moduleName}/package.json`);
    this.mergeDependencies(targetPathProject, sourcePathTest);
  };

  command.mergeDependencies = function(targetPathProject, sourcePathTest) {
    const ignores = [ 'extend2', 'require3' ];
    const targetPackageProject = require(targetPathProject);
    const sourcePackageTest = require(sourcePathTest);
    for (const item of ignores) {
      delete sourcePackageTest.dependencies[item];
    }
    Object.assign(targetPackageProject.dependencies, sourcePackageTest.dependencies);
    // version save
    fse.outputFileSync(targetPathProject, JSON.stringify(targetPackageProject, null, 2) + '\n');
  };

  // run
  yield command.run(process.cwd(), process.argv.slice(2));

}).catch(err => {
  console.error(err.stack);
  process.exit(1);
});

