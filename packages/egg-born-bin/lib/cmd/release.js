const path = require('path');
const chalk = require('chalk');
const fse = require('fs-extra');
const Command = require('@zhennann/egg-bin').Command;
const mglob = require('egg-born-mglob');

class ReleaseCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin release';
  }

  *run({ cwd, argv }) {
    const description = this.type ? `release ${this.type}` : 'release';
    console.log(`run ${description} at %s`, cwd);

    // entityRepos
    const entityRepos = mglob.glob(cwd, null, null, false);

    // entityNames
    let entityNames = argv._;
    if (entityNames.length === 0) {
      // only local entity
      entityNames = Array.from(
        new Set(Object.keys(entityRepos.modulesLocal).concat(Object.keys(entityRepos.suitesLocal)))
      );
    }

    // loop
    for (const entityName of entityNames) {
      // try suite first
      let entity = entityRepos.suites[entityName];
      if (entity) {
        yield this.__releaseSuite(entity, entityRepos);
      } else {
        entity = entityRepos.modules[entityName];
        if (entity && !entity.suite) {
          yield this.__releaseModule(entity, entityRepos);
        }
      }
    }

    // done
    console.log(chalk.cyan(`  ${description} successfully!`));
  }

  *__releaseSuite(entity, entityRepos) {
    const dirDest = this.__prepareDirectory(entity);
  }

  *__releaseModule(entity, entityRepos) {
    const dirDest = this.__prepareDirectory(entity);
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

    const dirDest = path.join(
      this.context.cwd,
      'dist',
      'release',
      this.type || 'all',
      entity.modules ? 'suite' : 'modue',
      entityPathName
    );
    // clear dirDest
    fse.emptyDirSync(dirDest);
    // ok
    return { dirSrc, dirDest };
  }

  description() {
    return 'release';
  }
}

module.exports = ReleaseCommand;
