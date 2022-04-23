const DevCommand = require('@zhennann/egg-bin').DevCommand;
const utils = require('../utils.js');

class BackendDevCommand extends DevCommand {
  constructor(rawArgv) {
    super(rawArgv);

    this.usage = 'Usage: egg-born-bin backend-dev';
    this.options = {
      baseDir: {
        description: 'directory of application, default to `process.cwd()`',
        type: 'string',
        default: 'src/backend',
      },
      workers: {
        description: 'numbers of app workers, default to 1 at local mode',
        type: 'number',
        alias: ['c', 'cluster'],
        default: 2,
      },
      port: {
        description: 'listening port, default to 7001',
        type: 'number',
        alias: 'p',
      },
      framework: {
        description: 'specify framework that can be absolute path or npm package',
        type: 'string',
      },
      require: {
        description: 'will add to execArgv --require',
        type: 'array',
        alias: 'r',
      },
    };
  }

  *run(context) {
    if (!context.argv.framework) {
      context.argv.framework = utils.getModulePath('egg-born-backend');
    }

    const res = yield utils.checkIfDevServerRunning();
    console.log('res: ', res);
    return;

    // need not sticky
    // if (context.argv.sticky === undefined) context.argv.sticky = true;

    utils.versionCheckCabloy({ scene: 'dev' }).then(() => {});

    yield super.run(context);
  }

  description() {
    return 'backend dev';
  }
}

module.exports = BackendDevCommand;
