const path = require('path');
const fse = require('fs-extra');
const merge = require('webpack-merge');

module.exports = context => {

  let config = {
    front: {
      productionSourceMap: true,
      uglify: true,
    },
    backend: {
      productionSourceMap: true,
      uglify: false,
    },
  };

  const file = path.join(context.modulePath, 'build/config.js');
  if (fse.existsSync(file)) {
    config = merge(config, require(file));
  }

  return config;
};
