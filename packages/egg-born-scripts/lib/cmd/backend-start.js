/*
* @Author: zhennann
* @Date:   2017-09-15 22:51:21
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-28 10:57:25
*/

const StartCommand = require('egg-scripts').StartCommand;

class BackendStartCommand extends StartCommand {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-scripts backend-start';
  }

  * run(context) {

    if (!context.argv._ || context.argv._.length === 0) context.argv._ = [ 'src/backend' ];

    yield super.run(context);

  }

  description() {
    return 'backend start';
  }

}

module.exports = BackendStartCommand;
