const util = require('./util.js');
const mparse = require('egg-born-mparse').default;

module.exports = function(loader) {

  // meta
  const meta = loader.app.meta = loader.app.meta || {};

  // app or agent
  meta.inApp = loader.app.type === 'application';
  meta.inAgent = loader.app.type === 'agent';

  // isProd
  meta.isProd = loader.app.config.env !== 'local' && loader.app.config.env !== 'unittest' && loader.app.config.env !== 'test';

  // mockUtil
  meta.mockUtil = createMockUtil();

  return meta;
};

function createMockUtil() {
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
}
