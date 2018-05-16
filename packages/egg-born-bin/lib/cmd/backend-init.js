const path = require('path');
const chalk = require('chalk');
const mock = require('egg-mock');
const Command = require('egg-bin').Command;
const eventAppReady = 'eb:event:appReady';

class BackendInitCommand extends Command {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin backend-init';
  }

  async run(context) {

    // override argv
    const params = Object.assign({}, context.argv);
    Object.keys(params).forEach(key => {
      params[key] = context.env[`npm_config_${key}`] || params[key];
    });

    // options
    const options = {};
    options.baseDir = context.argv.baseDir || path.join(context.cwd, 'src/backend');

    // env
    mock.env(params.env || 'prod');
    // app
    const app = mock.app(options);
    await app.ready();

    // check app ready
    await this.checkAppReady(app);

    // ctx
    const ctx = app.mockContext({ mockUrl: '/api/a/version/' });

    // version init
    await ctx.performAction({
      method: 'post',
      url: 'version/check',
      headers: {
        'x-inner-subdomain': params.subdomain,
      },
      body: {
        ...params,
        scene: 'init',
      },
    });

    // done
    console.log(chalk.cyan('  backend-init successfully!'));
    process.exit(0);
  }

  checkAppReady(app) {
    return new Promise((resolve, reject) => {
      app.on(eventAppReady, () => {
        resolve();
      });
    });
  }

  description() {
    return 'backend init';
  }

}

module.exports = BackendInitCommand;
