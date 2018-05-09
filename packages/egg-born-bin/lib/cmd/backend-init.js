const path = require('path');
const chalk = require('chalk');
const mock = require('egg-mock');
const Command = require('egg-bin').Command;

class BackendInitCommand extends Command {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin backend-init';
  }

  * run(context) {

    // override argv
    const params = Object.assign({}, context.argv);
    Object.keys(params).forEach(key => {
      params[key] = context.env[`npm_config_${key}`] || params[key];
    });

    // options
    const options = {};
    options.baseDir = context.argv.baseDir || path.join(context.cwd, 'src/backend');

    // env
    mock.env('prod');
    // app
    const app = mock.app(options);
    yield app.ready();

    // ctx
    const ctx = app.mockContext({ mockUrl: '/api/a/version/' });

    // version check
    const pathVersionCheck = path.join(__dirname, '../../../egg-born-backend/app/schedule/versionCheck.js');
    yield app.runSchedule(pathVersionCheck);

    // version init
    yield ctx.performAction({
      method: 'post',
      url: 'version/check',
      body: {
        ...params,
        scene: 'init',
      },
    });

    // done
    console.log(chalk.cyan('  backend-init successfully!'));
    process.exit(0);
  }

  description() {
    return 'backend init';
  }

}

module.exports = BackendInitCommand;
