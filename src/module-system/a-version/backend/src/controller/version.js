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

      // init all instances
      try {
        const instances = app.config.instances || [{ subdomain: '', password: '' }];
        for (const instance of instances) {
          await this.ctx.performAction({
            method: 'post',
            url: 'version/check',
            headers: {
              'x-inner-subdomain': instance.subdomain,
            },
            body: {
              ...instance,
              scene: 'init',
            },
          });
        }

        console.log(chalk.cyan('  All instances are initialized successfully!'));
      } catch (err) {
        console.log(chalk.cyan('  Instances are initialized failed!'));
        throw err;
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
      const options = this.ctx.request.body || {};
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

  }
  return VersionController;
};
