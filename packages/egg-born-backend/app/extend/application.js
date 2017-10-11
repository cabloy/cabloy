/*
* @Author: zhennann
* @Date:   2017-09-28 14:07:59
* @Last Modified by:   zhennann
* @Last Modified time: 2017-10-10 22:03:12
*/

const util = require('../../lib/module/util.js');
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
      const file = util.lookupPackage(dir);
      if (!file) return null;
      const pkg = require(file);
      return mparse.parseInfo(mparse.parseName(pkg.name));
    },
  };
}

