/*
* @Author: zhennann
* @Date:   2017-09-18 11:06:06
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-19 19:16:50
*/

const glob = require('glob');
const policy = require('./policy.js');
const loadRoutes = require('./route.js');
const loadServices = require('./service.js');
const moduleUtil = require('./module-util.js');

module.exports = function(loader) {

  const modules = parseModules(parseModules({}, policy.nodeModules), policy.projectModules);

  loadRoutes(loader, modules);
  loadServices(loader, modules);

  function parseModules(modules, policy) {

    const files = glob.sync(`${policy.modulesPath}*${policy.jsPath}`);

    files.forEach(file => {

      const pos1 = policy.modulesPath.length;
      const pos2 = file.indexOf('/', pos1);
      const name = file.substr(pos1, pos2 - pos1);

      const info = moduleUtil.parseInfo(name);

      if (!modules[info.fullName]) {
        modules[info.fullName] = { file, name, info, main: loader.loadFile(file) };
        console.log(info.fullName, ':', file);
      }

    });

    return modules;

  }

};
