const mparse = require('egg-born-mparse').default;

module.exports = app => {
  return {
    parseUrlFromPackage(dir, apiPrefix = true) {
      apiPrefix = _prepareApiPrefix(apiPrefix);
      const moduleInfo = this.parseInfoFromPackage(dir);
      if (!moduleInfo) return null;
      return `${apiPrefix}/${moduleInfo.pid}/${moduleInfo.name}`;
    },
    parseInfoFromPackage(dir) {
      const file = app.meta.util.lookupPackage(dir);
      if (!file) return null;
      const pkg = require(file);
      return mparse.parseInfo(mparse.parseName(pkg.name));
    },
    mockUrl(dir, url, apiPrefix = true) {
      apiPrefix = _prepareApiPrefix(apiPrefix);
      if (url && url.charAt(0) === '/') return `${apiPrefix}${url}`;
      const prefix = this.parseUrlFromPackage(dir, apiPrefix);
      return url ? `${prefix}/${url}` : `${prefix}/`;
    },
  };
};

function _prepareApiPrefix(apiPrefix) {
  if (typeof apiPrefix === 'string') return apiPrefix;
  return apiPrefix ? '/api' : '';
}
