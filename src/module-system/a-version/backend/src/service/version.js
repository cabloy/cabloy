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
            module VARCHAR(50) NULL,
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
    async initModule(options, module, version) {

      // init
      try {
        await this.ctx.performAction({
          method: 'post',
          url: `/${module.info.url}/version/init`,
          body: options,
        });
      } catch (e) {
        if (e.code !== 404) throw e;
      }

      // insert record
      if (version > 0) {
        await this.ctx.db.insert('aVersionInit', {
          subdomain: options.subdomain,
          module: module.info.relativeName,
          version,
        });
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

      if (version === 2) {
        await this.ctx.db.query(`
          CREATE TABLE aVersionInit (
            id INT NOT NULL AUTO_INCREMENT,
            subdomain VARCHAR(50) NULL,
            module VARCHAR(50) NULL,
            version INT NULL,
            createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id));
          `);
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
      if (module.package.eggBornModule && module.package.eggBornModule.fileVersion) {
        fileVersionNew = module.package.eggBornModule.fileVersion;
      }

      if (!fileVersionNew) return;

      if (!options.scene || options.scene === 'init') {
        // update module or init module

        // fileVersionOld
        let fileVersionOld = 0; // default
        if (!options.scene) {
          const res = await this.ctx.db.queryOne('select * from aVersion where module=? order by version desc', [ moduleName ]);
          if (res) {
            fileVersionOld = res.version;
          }
        } else {
          const res = await this.ctx.db.queryOne('select * from aVersionInit where subdomain=? and module=? order by version desc', [ options.subdomain, moduleName ]);
          if (res) {
            fileVersionOld = res.version;
          }
        }

        // check if need update
        if (fileVersionOld > fileVersionNew) {
          // module is old
          module.__check = this.ctx.parseFail(1001);
          this.ctx.throw(1001);
        } else if (fileVersionOld < fileVersionNew) {
          await this.__updateModule(options, module, fileVersionOld, fileVersionNew);
        }
      } else if (options.scene === 'test') {
        // test module
        await this.__testModule(module, fileVersionNew, options);
      }

    }

    // check dependencies
    async __checkDependencies(module, options) {

      if (!module.package.eggBornModule || !module.package.eggBornModule.dependencies) return;

      const dependencies = module.package.eggBornModule.dependencies;
      const keys = Object.keys(dependencies);
      for (const key of keys) {
        const subModule = this.__getModule(key);
        if (!subModule) {
          module.__check = this.ctx.parseFail(1002, key);
          this.ctx.throw(1002, key);
        }
        const subModuleVersion = dependencies[key];
        if (semver.lt(subModule.package.version, subModuleVersion)) {
          subModule.__check = this.ctx.parseFail(1001);
          this.ctx.throw(1001);
        }
        await this.__checkModule(key, options);
      }

    }

    // update module or init module
    async __updateModule(options, module, fileVersionOld, fileVersionNew) {

      // versions
      const versions = [];
      for (let version = fileVersionOld + 1; version <= fileVersionNew; version++) {
        versions.push(version);
      }

      // loop
      for (const version of versions) {
        // perform action
        try {
          if (!options.scene) {
            await this.ctx.performAction({
              method: 'post',
              url: 'version/updateModule',
              body: {
                module,
                version,
              },
            });
          } else {
            options.module = module;
            options.version = version;
            await this.ctx.performAction({
              method: 'post',
              url: 'version/initModule',
              body: options,
            });
          }
        } catch (err) {
          module.__check = err;
          throw err;
        }
      }

      // log
      options.result[module.info.relativeName] = { fileVersionOld, fileVersionNew };

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
      return this.app.meta.modules[fullName];
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
