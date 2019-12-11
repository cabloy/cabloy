const path = require('path');
const glob = require('glob');

module.exports = appInfo => {
  const config = {};

  // proxy
  config.proxy = true;

  // add http_proxy to httpclient
  if (process.env.http_proxy) {
    config.httpclient = {
      request: {
        enableProxy: true,
        rejectUnauthorized: false,
        proxy: process.env.http_proxy,
      },
    };
  }

  // development
  let watchDirs = glob.sync(`${path.join(appInfo.baseDir, '../module')}/*/backend/src`)
    .map(file => '../' + file.substr(path.join(appInfo.baseDir, '../').length));
  watchDirs = [
    'config',
    'mocks',
    'mocks_proxy',
    'app.js',
  ].concat(watchDirs);

  config.development = {
    overrideDefault: true,
    watchDirs,
  };

  return config;
};
