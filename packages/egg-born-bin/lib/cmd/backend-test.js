const path = require('path');
const chalk = require('chalk');
const globby = require('globby');
const mock = require('egg-mock');
const TestCommand = require('egg-bin').TestCommand;
const eventAppReady = 'eb:event:appReady';

class BackendTestCommand extends TestCommand {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin backend-test';
  }

  * run(context) {

    if (!context.env.EGG_BASE_DIR) context.env.EGG_BASE_DIR = path.join(process.cwd(), 'src/backend');

    if (!context.argv._ || context.argv._.length === 0) context.argv._ = [ 'src/**/test/**/*.test.js' ];

    const testArgv = Object.assign({}, context.argv);

    // collect test files
    let files = testArgv._.slice();
    if (!files.length) {
      files = [ process.env.TESTS || 'test/**/*.test.js' ];
    }

    // expand glob and skip node_modules and fixtures
    files = globby.sync(files.concat('!test/**/{fixtures, node_modules}/**/*.test.js'));

    if (!files.length) {
      // options
      const options = {};
      options.baseDir = context.env.EGG_BASE_DIR;

      // env
      mock.env('unittest');
      // app
      const app = mock.app(options);
      yield app.ready();

      // check app ready
      yield this.checkAppReady(app);

      // done
      console.log(chalk.cyan('  backend-test successfully!'));
      process.exit(0);
    } else {
      // run
      yield super.run(context);
    }

  }

  checkAppReady(app) {
    return new Promise((resolve, reject) => {
      app.on(eventAppReady, () => {
        resolve();
      });
    });
  }

  description() {
    return 'backend test';
  }

}

module.exports = BackendTestCommand;
