const path = require('path');
const require3 = require('require3');
const globby = require3('globby');
const AdmZip = require3('adm-zip');
const shajs = require3('sha.js');
const semver = require3('semver');
const fse = require3('fs-extra');
const CliStoreBase = require('../common/cliStoreBase.js');

module.exports = ctx => {
  class Cli extends CliStoreBase(ctx) {
    constructor(options) {
      super(options, 'publish');
    }

    async onExecuteStoreCommandEntity({ entityName }) {
      // fetch entity status
      const entityStatus = await this.openAuthClient.post({
        path: '/cabloy/store/store/publish/entityStatus',
        body: {
          entityName,
        },
      });
      if (!entityStatus) {
        throw new Error(ctx.text('Not Found'));
      }
      // entityHash
      const entityHash = entityStatus.entityHash ? JSON.parse(entityStatus.entityHash) : {};
      // suite/module
      if (entityStatus.entity.entityTypeCode === 1) {
        return await this._publishSuite({ suiteName: entityName, entityHash });
      }
      return await this._publishModule({ moduleName: entityName, entityHash });
    }

    async _publishSuite({ suiteName, entityHash }) {
      // check if exists
      const suite = this.helper.findSuite(suiteName);
      if (!suite) {
        throw new Error(ctx.text('Not Found'));
      }
      // modules
      const pathSuite = suite.root;
      const filePkgs = await globby(`${pathSuite}/modules/*/package.json`);
      for (const filePkg of filePkgs) {
        // name
        const name = filePkg.split('/').slice(-2)[0];
        // meta
        const _package = require(filePkg);
        const root = path.dirname(filePkg);
        const moduleMeta = {
          name,
          root,
          pkg: filePkg,
          package: _package,
        };
        if (moduleMeta.name === 'test-party') {
          await this._publishSuiteModule({ moduleMeta, entityHash });
        }
      }
    }

    async _publishSuiteModule({ moduleMeta, entityHash }) {
      // build:all
      await this.console.log(`===> build module: ${moduleMeta.name}`);
      // // spawn
      // await this.helper.spawn({
      //   cmd: 'npm',
      //   args: ['run', 'build:all'],
      //   options: {
      //     cwd: moduleMeta.root,
      //   },
      // });
      // zip official
      let zipOfficial = await this._zipAndHash({
        patterns: this.configModule.store.publish.patterns.official,
        pathRoot: moduleMeta.root,
      });
      // check hash
      if (zipOfficial.hash !== entityHash[moduleMeta.name]) {
        moduleMeta.changed = true;
        // bump
        moduleMeta.package.version = semver.inc(moduleMeta.package.version, 'patch');
        await fse.outputFile(moduleMeta.pkg, JSON.stringify(moduleMeta.package, null, 2) + '\n');
        // zip official
        zipOfficial = await this._zipAndHash({
          patterns: this.configModule.store.publish.patterns.official,
          pathRoot: moduleMeta.root,
        });
      }
      // zip trial
      const zipTrial = await this._zipAndHash({
        patterns: this.configModule.store.publish.patterns.trial,
        pathRoot: moduleMeta.root,
      });
      // ok
      moduleMeta.zipOfficial = zipOfficial;
      moduleMeta.zipTrial = zipTrial;
    }

    async _zipAndHash({ patterns, pathRoot }) {
      // globby
      const files = await globby(patterns, { cwd: pathRoot });
      // zip
      const zip = new AdmZip();
      for (const file of files) {
        const dirName = path.dirname(file);
        const fileName = path.basename(file);
        zip.addLocalFile(path.join(pathRoot, file), dirName, fileName);
      }
      const buffer = await zip.toBufferPromise();
      // hash
      const hash = shajs('sha256').update(buffer).digest('hex');
      // ok
      return { buffer, hash };
    }
  }

  return Cli;
};
