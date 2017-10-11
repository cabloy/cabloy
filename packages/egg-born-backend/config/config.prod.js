/*
* @Author: zhennann
* @Date:   2017-10-11 18:30:56
* @Last Modified by:   zhennann
* @Last Modified time: 2017-10-11 18:32:15
*/

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // coreMiddleware
  config.coreMiddleware = [ 'disableVersionCheck' ];

  // middleware disableVersionCheck
  config.disableVersionCheck = {
    enable: true,
    match: /\/version\//,
  };

  return config;
};
