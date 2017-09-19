/*
* @Author: zhennann
* @Date:   2017-09-19 10:52:11
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-19 10:53:53
*/

const path = require('path');

module.exports = {
  nodeModules: {
    modulesPath: path.join(__dirname, '../../../egg-born-module-'),
    jsPath: '/dist/backend.js',
  },

  projectModules: {
    modulesPath: path.join(__dirname, '../../../../src/module/'),
    jsPath: '/backend/src/main.js',
  },
};
