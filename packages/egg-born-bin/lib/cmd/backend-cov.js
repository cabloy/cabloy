/*
* @Author: zhennann
* @Date:   2017-09-27 23:33:42
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-27 23:39:00
*/

const path = require('path');
const CovCommand = require('egg-bin').CovCommand;

class BackendCovCommand extends CovCommand {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin backend-cov';
  }

  * run(context) {

    if (!context.env.EGG_BASE_DIR) context.env.EGG_BASE_DIR = path.join(process.cwd(), '/src/backend');

    if (!context.argv._ || context.argv._.length === 0) context.argv._ = [ 'src/**/test/**/*.test.js' ];

    yield super.run(context);

  }

  description() {
    return 'backend cov';
  }

}

module.exports = BackendCovCommand;
