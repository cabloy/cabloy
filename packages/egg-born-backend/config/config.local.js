/*
* @Author: zhennann
* @Date:   2017-09-17 12:40:06
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-18 21:37:05
*/

module.exports = appInfo => {
  const config = {};

  // development
  config.development = {
    watchDirs: [ '../module' ],
  };

  return config;
};
