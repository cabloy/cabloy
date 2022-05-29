const path = require('path');
const require3 = require('require3');
const globby = require3('globby');
const AdmZip = require3('adm-zip');
const shajs = require3('sha.js');
const semver = require3('semver');
const fse = require3('fs-extra');
const utility = require3('utility');
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
        // not found
        return { code: 1001 };
      }
      // entityHash
      const entityHash = entityStatus.entity.entityHash ? JSON.parse(entityStatus.entity.entityHash) : {};
      // need official/trial
      const needOfficial = entityStatus.entity.moduleLicenseFull !== 0;
      const needTrial = entityStatus.entity.moduleLicenseTrial !== 0;
      // suite/module
      if (entityStatus.entity.entityTypeCode === 1) {
        return await this._publishSuite({ suiteName: entityName, entityStatus, entityHash, needOfficial, needTrial });
      }
      return await this._publishModuleIsolate({
        moduleName: entityName,
        entityStatus,
        entityHash,
        needOfficial,
        needTrial,
      });
    }

    async _publishModuleIsolate({ moduleName, entityHash, entityStatus, needOfficial, needTrial }) {
      // check if exists
      const module = this.helper.findModule(moduleName);
      if (!module) {
        // not found
        return { code: 1001 };
      }
      // zip module
      const moduleMeta = {
        name: moduleName,
        root: module.root,
        pkg: module.pkg,
        package: module.package,
      };
      const moduleHash = entityHash.default || {};
      await this._zipSuiteModule({ moduleMeta, moduleHash, needOfficial, needTrial });
      if (!moduleMeta.changed) {
        // No Changes Found
        return { code: 2001 };
      }
      // upload module isolate
      await this._uploadModuleIsolate({ moduleMeta, entityStatus, needOfficial, needTrial });
      // submitted
      return { code: 2000, args: [moduleMeta.package.version] };
    }

    async _publishSuite({ suiteName, entityHash, entityStatus, needOfficial, needTrial }) {
      // check if exists
      const suite = this.helper.findSuite(suiteName);
      if (!suite) {
        // not found
        return { code: 1001 };
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
        const moduleHash = entityHash[moduleMeta.name] || {};
        await this._zipSuiteModule({ moduleMeta, moduleHash, needOfficial, needTrial });
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
      const suiteHash = entityHash.default || {};
      await this._zipSuite({ modulesMeta, suiteMeta, suiteHash });
      if (!suiteMeta.changed) {
        // No Changes Found
        return { code: 2001 };
      }
      // zip all
      const zipSuiteAll = await this._zipSuiteAll({ suiteMeta, modulesMeta, needOfficial, needTrial });
      // upload all
      await this._uploadSuiteAll({ suiteMeta, zipSuiteAll, entityStatus, needOfficial, needTrial });
      // submitted
      return { code: 2000, args: [suiteMeta.package.version] };
    }

    async _uploadModuleIsolate({ moduleMeta, entityStatus, needOfficial, needTrial }) {
      await this.openAuthClient.post({
        path: '/cabloy/store/store/publish/entityPublish',
        body: {
          key: {
            atomId: entityStatus.entity.atomId,
          },
          data: {
            entityName: moduleMeta.name,
            entityVersion: moduleMeta.package.version,
            entityHash: JSON.stringify({ default: moduleMeta.zipOfficial.hash }, null, 2),
            zipOfficial: needOfficial ? utility.base64encode(moduleMeta.zipOfficial.buffer, false) : undefined,
            zipTrial: needTrial ? utility.base64encode(moduleMeta.zipTrial.buffer, false) : undefined,
          },
        },
      });
    }

    async _uploadSuiteAll({ suiteMeta, zipSuiteAll, entityStatus, needOfficial, needTrial }) {
      await this.openAuthClient.post({
        path: '/cabloy/store/store/publish/entityPublish',
        body: {
          key: {
            atomId: entityStatus.entity.atomId,
          },
          data: {
            entityName: suiteMeta.name,
            entityVersion: suiteMeta.package.version,
            entityHash: JSON.stringify(zipSuiteAll.entityHash, null, 2),
            zipOfficial: needOfficial ? utility.base64encode(zipSuiteAll.zipOfficial.buffer, false) : undefined,
            zipTrial: needTrial ? utility.base64encode(zipSuiteAll.zipTrial.buffer, false) : undefined,
          },
        },
      });
    }

    async _zipSuiteAll({ suiteMeta, modulesMeta, needOfficial, needTrial }) {
      const zipSuiteAll = {};
      // hash
      zipSuiteAll.entityHash = this._zipSuiteAll_hash({ suiteMeta, modulesMeta });
      // zip official
      if (needOfficial) {
        zipSuiteAll.zipOfficial = await this._zipSuiteAll_zip({ suiteMeta, modulesMeta, type: 'official' });
      }
      // zip trial
      if (needTrial) {
        zipSuiteAll.zipTrial = await this._zipSuiteAll_zip({ suiteMeta, modulesMeta, type: 'trial' });
      }
      return zipSuiteAll;
    }

    _zipSuiteAll_hash({ suiteMeta, modulesMeta }) {
      const entityHash = {};
      entityHash.default = suiteMeta.zipSuite.hash;
      for (const moduleMeta of modulesMeta) {
        entityHash[moduleMeta.name] = moduleMeta.zipOfficial.hash;
      }
      return entityHash;
    }

    async _zipSuiteAll_zip({ suiteMeta, modulesMeta, type }) {
      const zip = new AdmZip();
      zip.addFile('default', suiteMeta.zipSuite.buffer);
      for (const moduleMeta of modulesMeta) {
        const buffer = type === 'official' ? moduleMeta.zipOfficial.buffer : moduleMeta.zipTrial.buffer;
        zip.addFile(moduleMeta.name, buffer);
      }
      const buffer = await zip.toBufferPromise();
      return { buffer };
    }

    async _zipSuite({ modulesMeta, suiteMeta, suiteHash }) {
      let zipSuite;
      // check modulesMeta
      let changed = modulesMeta.some(moduleMeta => moduleMeta.changed);
      if (!changed) {
        // check suite
        zipSuite = await this._zipAndHash({
          patterns: this.configModule.store.publish.patterns.suite,
          pathRoot: suiteMeta.root,
          needHash: true,
        });
        changed = zipSuite.hash.hash !== suiteHash.hash;
      }
      if (changed) {
        suiteMeta.changed = true;
        // bump
        if (suiteHash.version && !semver.gt(suiteMeta.package.version, suiteHash.version)) {
          suiteMeta.package.version = semver.inc(suiteHash.version, 'patch');
          await fse.outputFile(suiteMeta.pkg, JSON.stringify(suiteMeta.package, null, 2) + '\n');
          zipSuite = null;
        }
      }
      // force zip
      if (!zipSuite) {
        // zip suite
        zipSuite = await this._zipAndHash({
          patterns: this.configModule.store.publish.patterns.suite,
          pathRoot: suiteMeta.root,
          needHash: true,
        });
      }
      // ok
      zipSuite.hash.version = suiteMeta.package.version;
      suiteMeta.zipSuite = zipSuite;
    }

    async _zipSuiteModule({ moduleMeta, moduleHash, needTrial }) {
      // log
      await this.console.log(`===> module: ${moduleMeta.name}`);
      // zip officialTemp
      const patternsTemp = this.configModule.store.publish.patterns.official.concat(['!dist']);
      let zipOfficialTemp = await this._zipAndHash({
        patterns: patternsTemp,
        pathRoot: moduleMeta.root,
        needHash: true,
      });
      // check hash
      if (zipOfficialTemp.hash.hash !== moduleHash.hash) {
        moduleMeta.changed = true;
        // build:all
        await this.helper.spawn({
          cmd: 'npm',
          args: ['run', 'build:all'],
          options: {
            cwd: moduleMeta.root,
          },
        });
        // bump
        if (moduleHash.version && !semver.gt(moduleMeta.package.version, moduleHash.version)) {
          moduleMeta.package.version = semver.inc(moduleHash.version, 'patch');
          await fse.outputFile(moduleMeta.pkg, JSON.stringify(moduleMeta.package, null, 2) + '\n');
          zipOfficialTemp = await this._zipAndHash({
            patterns: patternsTemp,
            pathRoot: moduleMeta.root,
            needHash: true,
          });
        }
      }
      // zip official
      const zipOfficial = await this._zipAndHash({
        patterns: this.configModule.store.publish.patterns.official,
        pathRoot: moduleMeta.root,
        needHash: false,
      });
      zipOfficial.hash = {
        hash: zipOfficialTemp.hash.hash,
        version: moduleMeta.package.version,
      };
      moduleMeta.zipOfficial = zipOfficial;
      // zip trial
      if (needTrial) {
        moduleMeta.zipTrial = await this._zipAndHash({
          patterns: this.configModule.store.publish.patterns.trial,
          pathRoot: moduleMeta.root,
          needHash: false,
        });
      }
    }

    async _zipAndHash({ patterns, pathRoot, needHash }) {
      // globby
      const files = await globby(patterns, { cwd: pathRoot });
      files.sort();
      // zip
      const zip = new AdmZip();
      for (const file of files) {
        const dirName = path.dirname(file);
        const fileName = path.basename(file);
        zip.addLocalFile(path.join(pathRoot, file), dirName, fileName);
      }
      const buffer = await zip.toBufferPromise();
      // hash
      const hash = needHash ? shajs('sha256').update(buffer).digest('hex') : undefined;
      // ok
      return { buffer, hash: { hash } };
    }
  }

  return Cli;
};
