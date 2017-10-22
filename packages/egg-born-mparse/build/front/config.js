/*
* @Author: zhennann
* @Date:   2017-09-20 14:47:26
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-20 14:50:38
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
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    productionSourceMap: true,
    uglify: false,
  },
}, { build: config });
