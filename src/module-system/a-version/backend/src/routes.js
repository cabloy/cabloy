/*
* @Author: zhennann
* @Date:   2017-09-18 19:03:21
* @Last Modified by:   zhennann
* @Last Modified time: 2017-10-11 16:48:29
*/

const version = require('./controller/version.js');

module.exports = [
  { method: 'post', path: 'version/check', controller: version },
  { method: 'post', path: 'version/updateModule', controller: version, transaction: true },
  { method: 'post', path: 'version/update', controller: version },
  { method: 'get', path: 'version/result', controller: version },
];
