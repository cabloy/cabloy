const moment = require('moment');
const chalk = require('chalk');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Version extends app.meta.BeanBase {
    async databaseInitStartup() {
      // database
      await this.__database();
      // version start
      await this.__start();
    }

    async databaseNameStartup() {
      // database
      await this.__database();
    }

    async instanceInitStartup({ options }) {
      const instanceBase = options && options.instanceBase;
      await this.__instanceInit(this.ctx.subdomain, instanceBase);
    }

    async __start() {
      // update all modules
      try {
        const result = await this.__check({ scene: null });
        // clear columns cache
        this.ctx.model.columnsClearAll();
        // broadcast
        console.log('------- broadcast:');
        this.ctx.meta.util.broadcastEmit({
          module: moduleInfo.relativeName,
          broadcastName: 'columnsClear',
          data: { mode: 'all' },
        });
        // log
        if (Object.keys(result).length > 0) console.log(result);
        console.log(chalk.cyan('  All modules are checked successfully!'));
      } catch (err) {
        console.log(chalk.cyan('  Modules are checked failed!'));
        throw err;
      }
    }

    async __instanceInit(subdomain, instanceBase) {
      try {
        if (!instanceBase) {
          instanceBase = this.ctx.bean.instance._getInstanceBase({ subdomain });
        }
        if (!instanceBase) instanceBase = {};
        await this.__check({ ...instanceBase, scene: 'init', subdomain });
        console.log(chalk.cyan(`  The instance is initialized successfully: ${subdomain || 'default'}`));
      } catch (err) {
        console.log(chalk.cyan(`  The instance is initialized failed: ${subdomain || 'default'}`));
        throw err;
      }
    }

    async __instanceTest(subdomain) {
      await this.__check({ scene: 'test', subdomain });
    }

    // scene: null/init/test
    async __check(options) {
      options.result = {};

      if (!options.scene) {
        // confirm table aVersion exists
        const res = await this.ctx.db.queryOne("show tables like 'aVersion'");
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

      // check all modules
      for (const module of app.meta.modulesArray) {
        await this.__checkModule(module.info.relativeName, options);
      }

      // check if role dirty for init/test
      if (options.scene === 'init' || options.scene === 'test') {
        await this.ctx.meta.util.executeBean({
          subdomain: options.subdomain,
          beanModule: moduleInfo.relativeName,
          beanFullName: `${moduleInfo.relativeName}.local.version`,
          fn: '__after',
        });
      }

      // ok
      return options.result;
    }

    // check module
    async __checkModule(moduleName, options) {
      // module
      const module = this.__getModule(moduleName);

      // fileVersionNew
      let fileVersionNew = 0;
      if (module.package.eggBornModule && module.package.eggBornModule.fileVersion) {
        fileVersionNew = module.package.eggBornModule.fileVersion;
      }

      if (fileVersionNew && (!options.scene || options.scene === 'init')) {
        // update module or init module

        // -1: always
        if (fileVersionNew === -1) {
          await this.__updateModule(options, module, -1, -1);
        } else {
          // fileVersionOld
          let fileVersionOld = 0; // default
          if (!options.scene) {
            const res = await this.ctx.db.queryOne('select * from aVersion where module=? order by version desc', [
              moduleName,
            ]);
            if (res) {
              fileVersionOld = res.version;
            }
          } else {
            const res = await this.ctx.db.queryOne(
              'select * from aVersionInit where subdomain=? and module=? order by version desc',
              [options.subdomain, moduleName]
            );
            if (res) {
              fileVersionOld = res.version;
            }
          }

          // check if need update
          if (fileVersionOld > fileVersionNew) {
            this.ctx.throw(1001, moduleName);
          } else {
            // not check if (fileVersionOld < fileVersionNew)
            await this.__updateModule(options, module, fileVersionOld, fileVersionNew);
          }
        }
      }

      if (options.scene === 'test') {
        // test module
        await this.ctx.meta.util.executeBean({
          subdomain: options.subdomain,
          beanModule: module.info.relativeName,
          transaction: true,
          fn: async ({ ctx }) => {
            await this.__testModuleTransaction(ctx, module, fileVersionNew, options);
          },
        });
      }
    }

    // update module or init module
    async __updateModule(options, module, fileVersionOld, fileVersionNew) {
      if (fileVersionNew === -1) {
        // always
        await this.__updateModule2(options, module, -1);
      } else {
        // versions
        //   always version:0
        const versions = [0];
        for (let version = fileVersionOld + 1; version <= fileVersionNew; version++) {
          versions.push(version);
        }
        // loop
        for (const version of versions) {
          await this.__updateModule2(options, module, version);
        }
      }

      // log
      if (fileVersionOld !== fileVersionNew) {
        options.result[module.info.relativeName] = { fileVersionOld, fileVersionNew };
      }
    }

    async __updateModule2(options, module, version) {
      // perform action
      try {
        if (!options.scene) {
          // update
          await this.ctx.meta.util.executeBean({
            beanModule: module.info.relativeName,
            transaction: true,
            fn: async ({ ctx }) => {
              await this.__updateModuleTransaction(ctx, module, version);
            },
          });
        } else {
          // init
          await this.ctx.meta.util.executeBean({
            subdomain: options.subdomain,
            beanModule: module.info.relativeName,
            transaction: true,
            fn: async ({ ctx }) => {
              await this.__initModuleTransaction(ctx, module, version, options);
            },
          });
        }
      } catch (err) {
        throw err;
      }
    }

    async __updateModuleTransaction(_ctx, module, version) {
      // bean
      const beanVersion = _ctx.bean._getBean(`${module.info.relativeName}.version.manager`);
      if (!beanVersion) throw new Error(`version.manager not exists for ${module.info.relativeName}`);
      if (!beanVersion.update) throw new Error(`version.manager.update not exists for ${module.info.relativeName}`);
      // clear columns cache
      _ctx.model.columnsClearAll();
      // execute
      await beanVersion.update({ version });
      // insert record
      if (version > 0) {
        await _ctx.db.insert('aVersion', {
          module: module.info.relativeName,
          version,
        });
      }
    }

    async __initModuleTransaction(_ctx, module, version, options) {
      // bean
      const beanVersion = _ctx.bean._getBean(`${module.info.relativeName}.version.manager`);
      if (!beanVersion) throw new Error(`version.manager not exists for ${module.info.relativeName}`);
      // execute
      if (beanVersion.init) {
        await beanVersion.init({ ...options, version });
      }
      // insert record
      if (version > 0) {
        await _ctx.db.insert('aVersionInit', {
          subdomain: options.subdomain,
          module: module.info.relativeName,
          version,
        });
      }
    }

    // test module
    async __testModuleTransaction(_ctx, module, version, options) {
      // bean
      const beanVersion = _ctx.bean._getBean(`${module.info.relativeName}.version.manager`);
      // execute
      if (beanVersion && beanVersion.test) {
        await beanVersion.test({ ...options, version });
      }
    }

    async __after() {
      await this.ctx.bean.role.build();
    }

    __getDatabasePrefix() {
      return `egg-born-test-${app.name}`;
    }

    async __fetchDatabases() {
      // db prefix
      const dbPrefix = this.__getDatabasePrefix();
      // dbs
      const mysql = app.mysql.get('__ebdb');
      let dbs = await mysql.query(`show databases like \'${dbPrefix}-%\'`);
      // map
      dbs = dbs.map(db => {
        const name = db[Object.keys(db)[0]];
        return { name };
      });
      // filter
      dbs = dbs.filter(db => {
        const _time = db.name.substring(dbPrefix.length);
        return _time.length === 16;
      });
      // ok
      return dbs;
    }

    async __createDatabase() {
      // db prefix
      const dbPrefix = this.__getDatabasePrefix();
      // create
      const mysql = app.mysql.get('__ebdb');
      const databaseName = `${dbPrefix}-${moment().format('YYYYMMDD-HHmmss')}`;
      await mysql.query(`CREATE DATABASE \`${databaseName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci`);
      return databaseName;
    }

    async __database() {
      // dev/debug db
      if (app.meta.isLocal) {
        const mysqlConfig = this.__getMysqlConfig('__ebdb');
        if ((mysqlConfig.database === 'sys' || mysqlConfig.database === 'mysql') && !app.mysql.__ebdb_test) {
          let databaseName;
          const dbs = await this.__fetchDatabases();
          if (dbs.length === 0) {
            databaseName = await this.__createDatabase();
          } else {
            const db = dbs[0];
            databaseName = db.name;
          }
          // create test mysql
          mysqlConfig.database = databaseName;
          app.mysql.__ebdb_test = mysqlConfig; // database ready
          this.ctx.db = null; // reset
          console.log(chalk.cyan(`  database: ${mysqlConfig.database}, pid: ${process.pid}`));
        }
      }
      // test db
      if (app.meta.isTest && !app.mysql.__ebdb_test) {
        // drop old databases
        const mysql = app.mysql.get('__ebdb');
        const dbs = await this.__fetchDatabases();
        for (const db of dbs) {
          const name = db.name;
          await mysql.query(`drop database \`${name}\``);
        }
        // create database
        const databaseName = await this.__createDatabase();
        // create test mysql
        const mysqlConfig = this.__getMysqlConfig('__ebdb');
        mysqlConfig.database = databaseName;
        app.mysql.__ebdb_test = mysqlConfig;
        this.ctx.db = null; // reset
        // database ready
        console.log(chalk.cyan(`  database: ${mysqlConfig.database}, pid: ${process.pid}`));
      }
      // default
      if (!app.mysql.__ebdb_test) {
        app.mysql.__ebdb_test = this.__getMysqlConfig('__ebdb');
      }
    }

    // get mysql config
    __getMysqlConfig(clientName) {
      const mysqlConfig = app.config.mysql.clients[clientName];
      return Object.assign({}, app.config.mysql.default, mysqlConfig);
    }

    // get module
    __getModule(moduleName) {
      return app.meta.modules[moduleName];
    }
  }

  return Version;
};
