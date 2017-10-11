/*
* @Author: zhennann
* @Date:   2017-09-15 22:51:21
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-28 11:02:13
*/

const StopCommand = require('egg-scripts').StopCommand;

class BackendStopCommand extends StopCommand {

  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: egg-born-scripts backend-stop';
  }

  * run(context) {

    if (!context.argv._ || context.argv._.length === 0) context.argv._ = [ 'src/backend' ];

    yield super.run(context);

  }

  description() {
    return 'backend stop';
  }

}

module.exports = BackendStopCommand;
