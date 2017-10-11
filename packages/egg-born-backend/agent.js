/*
* @Author: zhennann
* @Date:   2017-10-09 22:42:16
* @Last Modified by:   zhennann
* @Last Modified time: 2017-10-11 18:45:13
*/

const chalk = require('chalk');
const util = require('./lib/module/util.js');

module.exports = agent => {

  agent.messenger.once('egg-ready', () => {
    versionCheck(agent);
  });

};

function versionCheck(agent) {
  if (agent.config.env === 'local') {
    // parse modules
    const modules = util.parseModules(agent.loader);
    // find module: a-version
    const fullName = Object.keys(modules).find(key => key === 'egg-born-module-a-version');
    if (fullName) {
      const listen = agent.config.cluster.listen;
      agent.curl(`http://${listen.hostname}:${listen.port}/api/a/version/version/check`, {
        method: 'POST',
        ontentType: 'json',
        dataType: 'json',
      }).then(result => {
        if (result.data && result.data.code === 0) {
          console.log(chalk.cyan('  All modules are checked successfully!'));
        } else {
          console.log(chalk.cyan('  Modules are checked failed!'));
        }
        console.log(chalk.yellow('  For more details, please goto http://{ip}:{port}/#/a/version/check\n'));
      });
    }
  }
}
