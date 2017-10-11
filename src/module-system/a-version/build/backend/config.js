/*
* @Author: zhennann
* @Date:   2017-09-20 14:51:12
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-20 14:53:08
*/

const path = require('path');
const merge = require('webpack-merge');
const config = require('../config.js');

module.exports = merge({
  build: {
    env: {
      NODE_ENV: '"production"',
    },
    assetsRoot: path.resolve(__dirname, '../../dist'),
    productionSourceMap: true,
    uglify: false,
  },
}, { build: config });
