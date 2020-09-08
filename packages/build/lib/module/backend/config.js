const path = require('path');
const merge = require('webpack-merge');
const configFn = require('../config.js');

module.exports = context => {

  // config
  const config = configFn(context);

  // dist
  const distPath = path.resolve(context.modulePath, 'dist');

  return merge({
    build: {
      env: {
        NODE_ENV: '"production"',
      },
      assetsRoot: distPath,
      assetsSubDirectory: 'staticBackend',
      productionSourceMap: true,
      uglify: false,
    },
  }, { build: config.backend });

};
