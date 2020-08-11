const path = require('path');
const CovCommand = require('egg-bin').CovCommand;

class BackendCovCommand extends CovCommand {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin backend-cov';
  }

  * run(context) {

    if (!context.env.EGG_BASE_DIR) context.env.EGG_BASE_DIR = path.join(process.cwd(), 'src/backend');

    if (!context.argv._ || context.argv._.length === 0) context.argv._ = [ 'src/**/backend/test/**/*.test.js' ];

    yield super.run(context);

  }

  description() {
    return 'backend cov';
  }

}

module.exports = BackendCovCommand;
