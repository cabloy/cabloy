const path = require('path');
const merge = require('webpack-merge');

module.exports = context => {

  // config
  const config = require(path.join(context.modulePath, 'build/config.js'));

  // dist
  const distPath = path.resolve(context.modulePath, 'dist');

  return merge({
    build: {
      env: {
        NODE_ENV: '"production"',
      },
      assetsRoot: distPath,
      assetsSubDirectory: 'static',
      assetsPublicPath: '',
      productionSourceMap: false,
      uglify: true,
    },
  }, { build: config.front });

};
