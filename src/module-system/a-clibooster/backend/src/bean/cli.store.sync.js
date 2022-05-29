const fs = require('fs');
const path = require('path');
const require3 = require('require3');
const AdmZip = require3('adm-zip');
const shajs = require3('sha.js');
const semver = require3('semver');
const fse = require3('fs-extra');
const CliStoreBase = require('../common/cliStoreBase.js');

module.exports = ctx => {
  class Cli extends CliStoreBase(ctx) {
    constructor(options) {
      super(options, 'sync');
    }

    async onExecuteStoreCommandEntity({ entityName }) {
      // fetch entity status
      const entityStatus = await this.openAuthClient.post({
        path: '/cabloy/store/store/sync/entityStatus',
        body: {
          entityName,
        },
      });
      if (!entityStatus) {
        // not found
        return { code: 1001 };
      }
      // prepare licenseMeta
      let licenseMeta;
      if (entityStatus.licenseFull.download) {
        licenseMeta = entityStatus.licenseFull;
      }
      if (!licenseMeta && entityStatus.licenseTrial.download) {
        licenseMeta = entityStatus.licenseTrial;
      }
      if (!licenseMeta) {
        licenseMeta = entityStatus.licenseFull;
      }
      // handle
      const res = await this._onExecuteStoreCommandEntity_handle({ entityName, entityStatus, licenseMeta });
    }

    async _onExecuteStoreCommandEntity_handle({ entityName, entityStatus, licenseMeta }) {
      // entityVersion
      const entityVersion = entityStatus.entity.moduleVersion;
      // entityMeta
      const entityMeta = this._getEntityMeta({ entityName, entityStatus });
      // check version
      if (entityMeta.version && !semver.lt(entityMeta.version, entityVersion)) {
        // No Changes Found
        return { code: 2001 };
      }
      // check if has download
      if (!licenseMeta.download) {
        return licenseMeta;
      }
      // download
      const res = await this.openAuthClient.getRaw({ path: licenseMeta.download });
      throw new Error('ssss');
      // unzip
      // copy
      // suite/module
      if (entityStatus.entity.entityTypeCode === 1) {
        return await this._syncSuite({ suiteName: entityName, entityStatus, entityVersion });
      }
      return await this._syncModuleIsolate({ moduleName: entityName, entityStatus, entityVersion });
    }

    async _syncSuite({ suiteName, entityStatus, entityVersion }) {
      // Synced
      return { code: 3000, args: [entityVersion] };
    }

    _getEntityType({ entityStatus }) {
      return entityStatus.entity.entityTypeCode;
    }

    _getEntityMeta({ entityName, entityStatus }) {
      const { argv } = this.context;
      // entityMeta
      const entityType = this._getEntityType({ entityStatus });
      const entityMeta = {
        root: path.join(argv.projectPath, entityType === 1 ? 'src/suite-vendor' : 'src/module-vendor', entityName),
      };
      // version
      entityMeta.version = this._getEntityVersion(entityMeta.root);
      return entityMeta;
    }
    _getEntityVersion(entityPath) {
      const filePkg = path.join(entityPath, 'package.json');
      if (!fs.existsSync(filePkg)) return null;
      const _package = require(filePkg);
      return _package.version;
    }
  }

  return Cli;
};
