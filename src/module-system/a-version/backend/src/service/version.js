const require3 = require('require3');
const semver = require3('semver');

module.exports = app => {

  class Version extends app.Service {

    async check(options) {

      if (!options.scene) {
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
      }

      // reset all modules
      this.__resetAllModules();

      // check module of aVersion
      await this.__checkModule('a-version', options);

      // check other modules
      await this.__checkOtherModules(options);
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
      if (version > 0) {
        await this.ctx.db.insert('aVersion', {
          module: module.info.relativeName,
          version,
        });
      }

    }

    // init module
    async initModule(options) {

      // init
      try {
        await this.ctx.performAction({
          method: 'post',
          url: `/${options.module.info.url}/version/init`,
          body: options,
        });
      } catch (e) {
        if (e.code !== 404) throw e;
      }

    }

    // test module
    async testModule(options) {

      // test
      try {
        await this.ctx.performAction({
          method: 'post',
          url: `/${options.module.info.url}/version/test`,
          body: options,
        });
      } catch (e) {
        if (e.code !== 404) throw e;
      }

    }


    // update this module
    async update(version) {

      if (version === 1) {
        // do nothing
      }

    }

    // reset all modules
    __resetAllModules() {
      const keys = Object.keys(this.app.meta.modules);
      for (const key of keys) {
        const module = this.app.meta.modules[key];
        module.__checking = false;
      }
    }

    // check other modules
    async __checkOtherModules(options) {
      const keys = Object.keys(this.app.meta.modules);
      for (const key of keys) {
        if (key !== 'egg-born-module-a-version') {
          const module = this.app.meta.modules[key];
          await this.__checkModule(module.info.relativeName, options);
        }
      }
    }

    // check module
    async __checkModule(moduleName, options) {

      // module
      const module = this.__getModule(moduleName);
      if (module.__checking) return;
      module.__checking = true;

      // dependencies
      await this.__checkDependencies(module, options);

      // fileVersionNew
      let fileVersionNew = 0;
      if (module._pkg.eggBornModule && module._pkg.eggBornModule.fileVersion) {
        fileVersionNew = module._pkg.eggBornModule.fileVersion;
      }

      if (!fileVersionNew) return;

      if (!options.scene) {
        // update module
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
      } else if (options.scene === 'init') {
        // init module
        await this.__initModule(module, fileVersionNew, options);
      } else if (options.scene === 'test') {
        // test module
        await this.__testModule(module, fileVersionNew, options);
      }

    }

    // check dependencies
    async __checkDependencies(module, options) {

      if (!module._pkg.eggBornModule || !module._pkg.eggBornModule.dependencies) return;

      const dependencies = module._pkg.eggBornModule.dependencies;
      const keys = Object.keys(dependencies);
      for (const key of keys) {
        const subModule = this.__getModule(key);
        if (!subModule) {
          module.__check = this.ctx.parseFail(1002, key);
          this.ctx.throw(1002, key);
        }
        const subModuleVersion = dependencies[key];
        if (semver.lt(subModule._pkg.version, subModuleVersion)) {
          subModule.__check = this.ctx.parseFail(1001);
          this.ctx.throw(1001);
        }
        await this.__checkModule(key, options);
      }

    }

    // update module
    async __updateModule(module, fileVersionOld, fileVersionNew) {

      // versions
      const versions = [];
      for (let version = fileVersionOld + 1; version <= fileVersionNew; version++) {
        versions.push(version);
      }

      // loop
      for (const version of versions) {
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

    // init module
    async __initModule(module, fileVersionNew, options) {
      options.module = module;
      options.version = fileVersionNew;

      await this.ctx.performAction({
        method: 'post',
        url: 'version/initModule',
        body: options,
      });
    }

    // test module
    async __testModule(module, fileVersionNew, options) {
      options.module = module;
      options.version = fileVersionNew;

      await this.ctx.performAction({
        method: 'post',
        url: 'version/testModule',
        body: options,
      });
    }

    // get module
    __getModule(moduleName) {
      const fullName = `egg-born-module-${moduleName}`;
      const module = this.app.meta.modules[fullName];
      if (!module) return null;

      if (!module._pkg) module._pkg = require3(module.pkg);
      return module;
    }

    // result
    result() {

      // find error module
      const moduleName = Object.keys(this.app.meta.modules).find(key => this.app.meta.modules[key].__check);
      if (moduleName) return { module: this.app.meta.modules[moduleName], modules: null };

      // ok
      return { module: null, modules: this.app.meta.modules };

    }

  }

  return Version;
};
