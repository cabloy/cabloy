const mparse = require('egg-born-mparse').default;
const glob = require('glob');
const fse = require('fs-extra');
const path = require('path');
const policy = require('./policy.js');

const util = {
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
  combineFetchPath(moduleName, arg) {
    if (arg.substr(0, 2) === '//') return arg.substr(1);
    if (arg.charAt(0) === '/') return `/api${arg}`;
    const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
    if (!moduleInfo) throw new Error('invalid url');
    return `/api/${moduleInfo.url}/${arg}`;
  },
  combineApiPath(moduleName, arg) {
    if (arg.charAt(0) === '/') return arg;
    const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
    if (!moduleInfo) throw new Error('invalid url');
    return `/${moduleInfo.url}/${arg}`;
  },
};

function __parseModules(modules, policy, loader) {

  const files = glob.sync(`${policy.modulesPath}*${policy.jsPath}`);

  files.forEach(file => {

    const pos1 = policy.modulesPath.length;
    const pos2 = file.indexOf('/', pos1);
    const name = file.substr(pos1, pos2 - pos1);

    const info = mparse.parseInfo(name);

    if (!modules[info.relativeName]) {
      const pkg = util.lookupPackage(file);
      const module = { file, name, info, pkg };
      module.package = require(pkg);
      module.main = loader.loadFile(file, loader.app, module);
      modules[info.relativeName] = module;
      if (loader.app.meta.inAgent) console.log(info.fullName);
    }

  });

  return modules;

}

module.exports = util;
