// const path = require('path');
const chalk = require('chalk');
// const fse = require('fs-extra');
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

  *__releaseSuite(entity, entityRepos) {}

  *__releaseModule(entity, entityRepos) {}

  description() {
    return 'release';
  }
}

module.exports = ReleaseCommand;
