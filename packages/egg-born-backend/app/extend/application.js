/*
* @Author: zhennann
* @Date:   2017-09-28 14:07:59
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-28 21:05:11
*/

const fse = require('fs-extra');
const path = require('path');
const mparse = require('egg-born-mparse');

const MOCKUTIL = Symbol('Application#mockUtil');

module.exports = {
  get mockUtil() {
    if (!this[MOCKUTIL]) {
      this[MOCKUTIL] = createMockUtil(this);
    }
    return this[MOCKUTIL];
  },
};

// eslint-disable-next-line
function createMockUtil(app) {
  return {
    parseUrlFromPackage(dir) {
      const moduleInfo = this.parseInfoFromPackage(dir);
      if (!moduleInfo) return null;
      return `/api/${moduleInfo.pid}/${moduleInfo.name}/`;
    },
    parseInfoFromPackage(dir) {
      const file = lookupPackage(dir);
      if (!file) return null;
      const pkg = require(file);
      return mparse.parseInfo(mparse.parseName(pkg.name));
    },
  };
}

function lookupPackage(dir) {
  let _dir = dir;
  // eslint-disable-next-line
  while (true) {
    const file = path.join(_dir, 'package.json');
    if (file === '/package.json') return null;
    if (fse.existsSync(file)) return file;
    _dir = path.join(_dir, '../');
  }
}
