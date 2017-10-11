/*
* @Author: zhennann
* @Date:   2017-09-18 19:03:33
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-27 21:20:36
*/

const routes = require('./routes.js');
const services = require('./services.js');
const config = require('./config/config.js');
const locales = require('./config/locales.js');
const errors = require('./config/errors.js');

// eslint-disable-next-line
module.exports = app => {

  return {
    routes,
    services,
    config,
    locales,
    errors,
  };

};
