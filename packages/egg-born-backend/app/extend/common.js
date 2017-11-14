const util = require('../../lib/module/util.js');
const mparse = require('egg-born-mparse').default;

module.exports = {

// eslint-disable-next-line
createMockUtil(app) {
    return {
      parseUrlFromPackage(dir) {
        const moduleInfo = this.parseInfoFromPackage(dir);
        if (!moduleInfo) return null;
        return `/api/${moduleInfo.pid}/${moduleInfo.name}`;
      },
      parseInfoFromPackage(dir) {
        const file = util.lookupPackage(dir);
        if (!file) return null;
        const pkg = require(file);
        return mparse.parseInfo(mparse.parseName(pkg.name));
      },
    };
  },
  isProd(app) {
    return app.config.env !== 'local' && app.config.env !== 'unittest' && app.config.env !== 'test';
  },

};
