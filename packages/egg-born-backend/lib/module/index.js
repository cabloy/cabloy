/*
* @Author: zhennann
* @Date:   2017-09-18 11:06:06
* @Last Modified by:   zhennann
* @Last Modified time: 2017-10-10 16:10:16
*/


const loadRoutes = require('./route.js');
const loadServices = require('./service.js');
const loadConfig = require('./config.js');
const loadLocales = require('./locales.js');
const loadErrors = require('./errors.js');
const util = require('./util.js');

module.exports = function(loader) {

  const modules = loader.app.modules = util.parseModules(loader);

  loadRoutes(loader, modules);
  loadServices(loader, modules);
  loadConfig(loader, modules);
  loadLocales(loader, modules);
  loadErrors(loader, modules);

};
