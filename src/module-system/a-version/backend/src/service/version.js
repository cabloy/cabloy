/*
* @Author: zhennann
* @Date:   2017-09-08 14:49:08
* @Last Modified by:   zhennann
* @Last Modified time: 2017-10-11 17:07:07
*/

const semver = require('semver');

module.exports = app => {

  class Version extends app.Service {

    async check() {

      // confirm table aVersion exists
      const res = await this.ctx.db.queryOne('show tables like \'aVersion\'');
      if (!res) {
        await this.ctx.db.query(`
          CREATE TABLE aVersion (
            id INT NOT NULL AUTO_INCREMENT,
            module VARCHAR(45) NULL,
            version INT NULL,
            createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id));
          `);
      }

      // check module of aVersion
      await this.__checkModule('a-version');

      // check other modules
      await this.__checkOtherModules();
    }

    // update module
    async updateModule(module, version) {

      // update
      await this.ctx.performAction({
        method: 'post',
        url: `/${module.info.url}/version/update`,
        body: {
          version,
        },
      });

      // insert record
      await this.ctx.db.insert('aVersion', {
        module: module.info.relativeName,
        version,
      });

    }

    // update this module
    async update(version) {

      if (version === 1) {
        // do nothing
      }

    }

    // check other modules
    async __checkOtherModules() {
      const keys = Object.keys(this.app.modules);
      for (const key of keys) {
        if (key !== 'egg-born-module-a-version') {
          const module = this.app.modules[key];
          await this.__checkModule(module.info.relativeName);
        }
      }
    }

    // check module
    async __checkModule(moduleName) {

      // module
      const module = this.__getModule(moduleName);
      if (module.__checking) return;
      module.__checking = true;

      // dependencies
      await this.__checkDependencies(module);

      // fileVersionNew
      let fileVersionNew = 0;
      if (module.pkg.eggBornModule && module.pkg.eggBornModule.fileVersion) {
        fileVersionNew = module.pkg.eggBornModule.fileVersion;
      }

      if (!fileVersionNew) return;

      // fileVersionOld
      let fileVersionOld = 0; // default
      const res = await this.ctx.db.queryOne('select * from aVersion where module=? order by version desc', [ moduleName ]);
      if (res) {
        fileVersionOld = res.version;
      }

      // check if need update
      if (fileVersionOld > fileVersionNew) {
        // module is old
        module.__check = this.ctx.parseFail(1001);
        this.ctx.throw(1001);
      } else if (fileVersionOld < fileVersionNew) {
        await this.__updateModule(module, fileVersionOld, fileVersionNew);
      }

    }

    // check dependencies
    async __checkDependencies(module) {

      if (!module.pkg.eggBornModule || !module.pkg.eggBornModule.dependencies) return;

      const dependencies = module.pkg.eggBornModule.dependencies;
      const keys = Object.keys(dependencies);
      for (const key of keys) {
        const subModule = this.__getModule(key);
        if (!subModule) {
          module.__check = this.ctx.parseFail(1002, key);
          this.ctx.throw(1002, key);
        }
        const subModuleVersion = dependencies[key];
        if (semver.lt(subModule.pkg.version, subModuleVersion)) {
          subModule.__check = this.ctx.parseFail(1001);
          this.ctx.throw(1001);
        }
        await this.__checkModule(key);
      }

    }

    // update module
    async __updateModule(module, fileVersionOld, fileVersionNew) {
      for (let version = fileVersionOld + 1; version <= fileVersionNew; version++) {
        // perform action
        try {
          await this.ctx.performAction({
            method: 'post',
            url: 'version/updateModule',
            body: {
              module,
              version,
            },
          });
        } catch (err) {
          module.__check = err;
          throw err;
        }
      }
    }

    // get module
    __getModule(moduleName) {
      const fullName = `egg-born-module-${moduleName}`;
      const module = this.app.modules[fullName];
      if (!module) return null;

      if (!module.pkg) module.pkg = require(module.package);
      return module;
    }

    // result
    result() {

      // find error module
      const moduleName = Object.keys(this.app.modules).find(key => this.app.modules[key].__check);
      if (moduleName) return { module: this.app.modules[moduleName], modules: null };

      // ok
      return { module: null, modules: this.app.modules };

    }

  }

  return Version;
};
