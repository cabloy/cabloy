/*
* @Author: zhennann
* @Date:   2017-09-24 21:49:55
* @Last Modified by:   zhennann
* @Last Modified time: 2017-10-15 21:16:27
*/

const mparse = require('egg-born-mparse');
const glob = require('glob');
const fse = require('fs-extra');
const path = require('path');
const policy = require('./policy.js');

const util = {
  getModuleInfo(context) {
    if (context.__ebModuleInfo === undefined) {
      context.__ebModuleInfo = mparse.parseInfo(mparse.parseName(context.req.mockUrl || context.req.url));
    }
    return context.__ebModuleInfo;
  },
  parseModules(loader) {
    return __parseModules(__parseModules({}, policy.nodeModules, loader), policy.projectModules, loader);
  },
  lookupPackage(dir) {
    let _dir = dir;
    // eslint-disable-next-line
    while (true) {
      const file = path.join(_dir, 'package.json');
      if (file === '/package.json') return null;
      if (fse.existsSync(file)) return file;
      _dir = path.join(_dir, '../');
    }
  },

};

function __parseModules(modules, policy, loader) {

  const files = glob.sync(`${policy.modulesPath}*${policy.jsPath}`);

  files.forEach(file => {

    const pos1 = policy.modulesPath.length;
    const pos2 = file.indexOf('/', pos1);
    const name = file.substr(pos1, pos2 - pos1);

    const info = mparse.parseInfo(name);

    if (!modules[info.fullName]) {
      modules[info.fullName] = { file, name, info, main: loader.loadFile(file), package: util.lookupPackage(file) };
      if(loader.app.config.env === 'local') console.log(info.fullName, ':', file);
    }

  });

  return modules;

}

module.exports = util;
