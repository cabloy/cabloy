/*
* @Author: zhennann
* @Date:   2017-09-17 12:40:06
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-20 12:03:31
*/

const path = require('path');
const glob = require('glob');

module.exports = appInfo => {
  const config = {};

  // development
  config.development = {
    watchDirs: glob.sync(`${path.join(appInfo.baseDir, '../module')}/*/backend`)
      .map(file => '../' + file.substr(path.join(appInfo.baseDir, '../').length)),
  };

  return config;
};
