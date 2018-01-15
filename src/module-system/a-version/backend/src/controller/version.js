const require3 = require('require3');
const chalk = require3('chalk');

module.exports = app => {
  class VersionController extends app.Controller {

    async start() {
      // update all modules
      let result;
      try {
        result = await this.ctx.performAction({
          method: 'post',
          url: 'version/check',
        });
        if (Object.keys(result).length > 0) console.log(result);
        console.log(chalk.cyan('  All modules are checked successfully!'));
      } catch (err) {
        console.log(chalk.cyan('  Modules are checked failed!'));
        throw err;
      }

      // init all subdomains
      if (result && Object.keys(result).length > 0) {
        try {
          const rows = await this.ctx.db.query('select distinct subdomain from aVersionInit');
          for (const row of rows) {
            await this.ctx.performAction({
              method: 'post',
              url: 'version/check',
              body: {
                subdomain: row.subdomain,
                scene: 'init',
              },
            });
          }

          console.log(chalk.cyan('  All subdomains are initialized successfully!'));
        } catch (err) {
          console.log(chalk.cyan('  Subdomains are initialized failed!'));
          throw err;
        }
      }

      // ok
      // console.log(chalk.yellow('  For more details, please goto http://{ip}:{port}/#/a/version/check\n'));
      this.ctx.success();
    }

    // check all modules
    async check() {
      // options:
      //   scene:init
      //   scene:test
      const options = this.ctx.request.body;
      options.result = {};
      await this.service.version.check(options);
      this.ctx.success(options.result);
    }

    // update module
    async updateModule() {
      await this.service.version.updateModule(
        this.ctx.request.body.module,
        this.ctx.getInt('version')
      );
      this.ctx.success();
    }

    // init module
    async initModule() {
      await this.service.version.initModule(
        this.ctx.request.body,
        this.ctx.request.body.module,
        this.ctx.getInt('version')
      );
      this.ctx.success();
    }

    // test module
    async testModule() {
      await this.service.version.testModule(
        this.ctx.request.body
      );
      this.ctx.success();
    }

    // update this module
    async update() {
      await this.service.version.update(this.ctx.getInt('version'));
      this.ctx.success();
    }

    // // result
    // async result() {
    //   if (app.config.env !== 'local') this.ctx.throw(1003);
    //   const res = this.service.version.result();
    //   this.ctx.success(res);
    // }

  }
  return VersionController;
};
