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
      const entityHash = entityStatus.entity.entityHash ? JSON.parse(entityStatus.entity.entityHash) : {};
      // need official/trial
      const needOfficial = entityStatus.entity.moduleLicenseFull !== 0;
      const needTrial = entityStatus.entity.moduleLicenseTrial !== 0;
      // suite/module
      if (entityStatus.entity.entityTypeCode === 1) {
        return await this._publishSuite({ suiteName: entityName, entityHash, needOfficial, needTrial });
      }
      return await this._publishModule({ moduleName: entityName, entityHash, needOfficial, needTrial });
    }

    async _publishSuite({ suiteName, entityHash, needOfficial, needTrial }) {
      // check if exists
      const suite = this.helper.findSuite(suiteName);
      if (!suite) {
        throw new Error(ctx.text('Not Found'));
      }
      // zip modules
      const pathSuite = suite.root;
      const filePkgs = await globby(`${pathSuite}/modules/*/package.json`);
      const modulesMeta = [];
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
        modulesMeta.push(moduleMeta);
        if (moduleMeta.name === 'test-party') {
          await this._zipSuiteModule({ moduleMeta, entityHash, needOfficial, needTrial });
        }
      }
      // zip suite
      const filePkg = path.join(pathSuite, 'package.json');
      const _package = require(filePkg);
      const suiteMeta = {
        name: suiteName,
        root: pathSuite,
        pkg: filePkg,
        package: _package,
      };
      await this._zipSuite({ modulesMeta, suiteMeta, entityHash });
    }

    async _zipSuite({ modulesMeta, suiteMeta, entityHash }) {
      let zipSuite;
      // check modulesMeta
      let changed = modulesMeta.some(moduleMeta => moduleMeta.changed);
      if (!changed) {
        // check suite
        zipSuite = await this._zipAndHash({
          patterns: this.configModule.store.publish.patterns.suite,
          pathRoot: suiteMeta.root,
        });
        changed = zipSuite.hash !== entityHash.default;
      }
      if (changed) {
        suiteMeta.changed = true;
        // bump
        suiteMeta.package.version = semver.inc(suiteMeta.package.version, 'patch');
        await fse.outputFile(suiteMeta.pkg, JSON.stringify(suiteMeta.package, null, 2) + '\n');
        // zip suite
        zipSuite = await this._zipAndHash({
          patterns: this.configModule.store.publish.patterns.suite,
          pathRoot: suiteMeta.root,
        });
      }
      // ok
      suiteMeta.zipSuite = zipSuite;
    }

    async _zipSuiteModule({ moduleMeta, entityHash, needOfficial, needTrial }) {
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
        if (needOfficial) {
          zipOfficial = await this._zipAndHash({
            patterns: this.configModule.store.publish.patterns.official,
            pathRoot: moduleMeta.root,
          });
        }
      }
      if (needOfficial) {
        moduleMeta.zipOfficial = zipOfficial;
      }
      // zip trial
      if (needTrial) {
        moduleMeta.zipTrial = await this._zipAndHash({
          patterns: this.configModule.store.publish.patterns.trial,
          pathRoot: moduleMeta.root,
        });
      }
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
