const path = require('path');
const glob = require('glob');

module.exports = appInfo => {
  const config = {};

  // proxy
  config.proxy = true;

  // development
  config.development = {
    watchDirs: glob.sync(`${path.join(appInfo.baseDir, '../module')}/*/backend`)
      .map(file => '../' + file.substr(path.join(appInfo.baseDir, '../').length)),
  };

  return config;
};
