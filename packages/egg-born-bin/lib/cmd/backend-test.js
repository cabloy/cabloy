/*
* @Author: zhennann
* @Date:   2017-09-27 21:54:54
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-27 22:53:47
*/

const path = require('path');
const TestCommand = require('egg-bin').TestCommand;

class BackendTestCommand extends TestCommand {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-bin backend-test';
  }

  * run(context) {

    if (!context.env.EGG_BASE_DIR) context.env.EGG_BASE_DIR = path.join(process.cwd(), '/src/backend');

    if (!context.argv._ || context.argv._.length === 0) context.argv._ = [ 'src/**/test/**/*.test.js' ];

    yield super.run(context);

  }

  description() {
    return 'backend test';
  }

}

module.exports = BackendTestCommand;
