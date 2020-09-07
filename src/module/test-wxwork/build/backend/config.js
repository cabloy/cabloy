const path = require('path');
const merge = require('webpack-merge');
const config = require('../config.js');

module.exports = merge({
  build: {
    env: {
      NODE_ENV: '"production"',
    },
    assetsRoot: path.resolve(__dirname, '../../dist'),
    assetsSubDirectory: 'staticBackend',
    productionSourceMap: true,
    uglify: false,
  },
}, { build: config });
