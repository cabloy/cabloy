const path = require('path');
const chalk = require('chalk');
const fse = require('fs-extra');
const Command = require('@zhennann/egg-bin').Command;
const mglob = require('egg-born-mglob');
const eggBornUtils = require('egg-born-utils');

const __patterns = {
  project: {
    all: [
      'build',
      'scripts',
      'src/backend',
      '!src/backend/_config',
      '!src/backend/app',
      '!src/backend/logs',
      '!src/backend/run',
      'src/front',
      '!src/front/_config',
      'lerna.json',
      'LICENSE',
      'package.json',
    ],
    backend: [
      'build',
      'scripts',
      'src/backend',
      '!src/backend/_config',
      '!src/backend/app',
      '!src/backend/logs',
      '!src/backend/run',
      'lerna.json',
      'LICENSE',
      'package.json',
    ],
    front: ['build', 'scripts', 'src/front', '!src/front/_config', 'lerna.json', 'LICENSE', 'package.json'],
  },
  module: {
    all: [
      '**',
      '!node_modules',
      '!miniprogram_npm',
      '!.git',
      '!.DS_Store',
      '!backend/src',
      '!backend/static',
      '!backend/test',
      '!front/src',
      '!icons',
      '!build',
      '!dist/backend.js.map',
      '!dist/front.js.map',
    ],
    backend: [
      '**',
      '!node_modules',
      '!miniprogram_npm',
      '!.git',
      '!.DS_Store',
      '!backend/src',
      '!backend/static',
      '!backend/test',
      '!front',
      '!icons',
      '!build',
      '!dist/backend.js.map',
      '!dist/front.js*',
      '!dist/static',
    ],
    front: [
      '**',
      '!node_modules',
      '!miniprogram_npm',
      '!.git',
      '!.DS_Store',
      '!backend',
      '!front/src',
      '!icons',
      '!build',
      '!dist/front.js.map',
      '!dist/backend.js*',
      '!dist/staticBackend',
    ],
  },
  suite: ['**', '!node_modules', '!miniprogram_npm', '!.git', '!.DS_Store', '!modules'],
};

class ReleaseCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin release';
  }

  get type2() {
    return this.type || 'all';
  }
  *run({ cwd, argv }) {
    const description = this.type ? `release ${this.type}` : 'release';
    console.log(`run ${description} at %s`, cwd);

    // entityRepos
    const entityRepos = mglob.glob(cwd, null, null, false, this.type2);

    // entityNames
    let entityNames = argv._;
    if (entityNames.length === 0) {
      // all entities
      entityNames = Array.from(new Set(Object.keys(entityRepos.modules).concat(Object.keys(entityRepos.suites))));
    }

    // loop
    for (const entityName of entityNames) {
      // try suite first
      let entity = entityRepos.suites[entityName];
      if (entity) {
        yield this.__releaseSuite(entity, entityRepos);
        continue;
      } else {
        entity = entityRepos.modules[entityName];
        if (entity) {
          // check if node_modules / in suite
          if (!entity.info.node_modules && !entity.suite) {
            yield this.__releaseModule(entity, entityRepos);
          }
          continue;
        }
      }
      // not found
      console.log(chalk.red(`  ${entityName} not found!`));
    }

    // copy project files
    yield this.__copyProjectFiles();

    // done
    console.log(chalk.cyan(`  ${description} successfully!`));
  }

  *__copyProjectFiles() {
    const dirSrc = this.context.cwd;
    const dirDest = path.join(this.context.cwd, 'dist-release', this.type2);
    // globby
    const files = yield eggBornUtils.tools.globbyAsync(__patterns.project[this.type2], { cwd: this.context.cwd });
    // copy
    for (const file of files) {
      const fileSrc = path.join(dirSrc, file);
      const fileDest = path.join(dirDest, file);
      // only copy once
      if (!fse.existsSync(fileDest)) {
        fse.copySync(fileSrc, fileDest);
      }
    }
  }

  *__releaseSuite(entity, entityRepos) {
    const { dirSrc, dirDest } = this.__prepareDirectory(entity);
    fse.emptyDirSync(dirDest);
    // build modules
    for (const moduleName of entity.modules) {
      const entityModule = entityRepos.modules[moduleName];
      const { dirSrc: dirSrcModule } = this.__prepareDirectory(entityModule);
      const dirDestModule = path.join(
        dirDest,
        'modules',
        entityModule.package.name.substring('egg-born-module-'.length)
      );
      yield this.__releaseModuleIsolate(entityModule, dirSrcModule, dirDestModule);
    }
    // globby
    const files = yield eggBornUtils.tools.globbyAsync(__patterns.suite, { cwd: dirSrc });
    // copy
    for (const file of files) {
      const fileSrc = path.join(dirSrc, file);
      const fileDest = path.join(dirDest, file);
      fse.copySync(fileSrc, fileDest);
    }
  }

  *__releaseModule(entity) {
    const { dirSrc, dirDest } = this.__prepareDirectory(entity);
    fse.emptyDirSync(dirDest);
    yield this.__releaseModuleIsolate(entity, dirSrc, dirDest);
  }

  *__releaseModuleIsolate(entityModule, dirSrcModule, dirDestModule) {
    // build front
    if (this.type2 !== 'backend') {
      // check if include 'main.js'
      if (entityModule.js.front.indexOf('main.js') > -1) {
        // build
        yield eggBornUtils.process.spawnCmd({
          cmd: 'npm',
          args: ['run', 'build:front'],
          options: {
            cwd: dirSrcModule,
          },
        });
      }
    }
    // build backend
    if (this.type2 !== 'front') {
      // check if include 'main.js'
      if (entityModule.js.backend.indexOf('main.js') > -1) {
        // build
        yield eggBornUtils.process.spawnCmd({
          cmd: 'npm',
          args: ['run', 'build:backend'],
          options: {
            cwd: dirSrcModule,
          },
        });
      }
    }
    // globby
    const files = yield eggBornUtils.tools.globbyAsync(__patterns.module[this.type2], { cwd: dirSrcModule });
    // copy
    for (const file of files) {
      const fileSrc = path.join(dirSrcModule, file);
      const fileDest = path.join(dirDestModule, file);
      fse.copySync(fileSrc, fileDest);
    }
  }

  __prepareDirectory(entity) {
    // dirSrc
    const dirSrc = entity.root;
    // dirDest
    let entityPathName;
    if (entity.modules) {
      entityPathName = entity.package.name.substring('egg-born-suite-'.length);
    } else {
      entityPathName = entity.package.name.substring('egg-born-module-'.length);
    }
    let entityPathNameParent = entity.modules ? 'suite' : 'module';
    if (entity.info.vendor) {
      entityPathNameParent = `${entityPathNameParent}-vendor`;
    }
    const dirDest = path.join(
      this.context.cwd,
      'dist-release',
      this.type2,
      'src',
      entityPathNameParent,
      entityPathName
    );
    // ok
    return { dirSrc, dirDest };
  }

  description() {
    return 'release';
  }
}

module.exports = ReleaseCommand;
