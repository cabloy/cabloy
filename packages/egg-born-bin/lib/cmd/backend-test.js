const path = require('path');
const TestCommand = require('egg-bin').TestCommand;

class BackendTestCommand extends TestCommand {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin backend-test';
  }

  * run(context) {

    if (!context.env.EGG_BASE_DIR) context.env.EGG_BASE_DIR = path.join(process.cwd(), 'src/backend');

    if (!context.argv._ || context.argv._.length === 0) context.argv._ = [ 'src/**/test/**/*.test.js' ];

    yield super.run(context);

  }

  description() {
    return 'backend test';
  }

}

module.exports = BackendTestCommand;
