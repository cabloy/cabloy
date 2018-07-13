const mparse = require('egg-born-mparse').default;
const fse = require('fs-extra');
const path = require('path');

const util = {
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

module.exports = util;
