/*
* @Author: zhennann
* @Date:   2017-09-18 11:06:06
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-19 00:02:51
*/

const path = require('path');
const glob = require('glob');
const is = require('is-type-of');
const debug = require('debug')('egg-born-backend:loader');
const FULLPATH = Symbol.for('EGG_LOADER_ITEM_FULLPATH');
const EXPORTS = Symbol.for('EGG_LOADER_ITEM_EXPORTS');

const policyNodeModules = {
  modulesPath: path.join(__dirname, '../../egg-born-module-'),
  jsPath: '/dist/backend.js',
};

const policyProjectModules = {
  modulesPath: path.join(__dirname, '../../../src/module/'),
  jsPath: '/backend/src/main.js',
};

module.exports = function(loader) {

  // loadModules(policyNodeModules);
  loadModules(policyProjectModules);


  // load modules of node_modules
  function loadModules(policy) {

    console.log(`${policy.modulesPath}*${policy.jsPath}`);
    glob(`${policy.modulesPath}*${policy.jsPath}`, (err, files) => {
      console.log(files);
      files.forEach(file => {
        const pos1 = policy.modulesPath.length;
        const pos2 = file.indexOf('/', pos1);
        const moduleName = file.substr(pos1, pos2 - pos1);

        const moduleInfo = parseModuleInfo(moduleName);
        const moduleMain = loader.loadFile(file);

        loadModuleMain(moduleInfo, moduleMain);
      });
    });

  }

  function loadModuleMain(moduleInfo, moduleMain) {

    // routes and controllers
    const routes = moduleMain.routes;
    if (routes) {
      routes.forEach(route => {
        route.path = `/api/${moduleInfo.url}${route.path}`;
        loader.app.get(route.path, methodToMiddleware(route.controller(loader.app), route.action));
      });
    }

    // services
    const services = moduleMain.services;
    if (services) {
      for (const key in services) {
        loadService(moduleInfo, key, services[key]);
      }
    }
  }

  function loadService(moduleInfo, key, service) {

    const item = parseService(moduleInfo, key, service);

    const target = loader.app.serviceClasses;

    debug('loading item %j', item);
    // item { properties: [ 'a', 'b', 'c'], exports }
    // => target.a.b.c = exports
    item.properties.reduce((target, property, index) => {
      let obj;
      const properties = item.properties.slice(0, index + 1).join('.');
      if (index === item.properties.length - 1) {
        if (property in target) {
          if (!loader.options.override) throw new Error(`can't overwrite property '${properties}' from ${target[property][FULLPATH]} by ${item.fullpath}`);
        }
        obj = item.exports;
        if (obj && !is.primitive(obj)) {
          obj[loader.FileLoader.FULLPATH] = item.pathName;
          obj[loader.FileLoader.EXPORTS] = true;
        }
      } else {
        obj = target[property] || {};
      }
      target[property] = obj;
      debug('loaded %s', properties);
      return obj;
    }, target);

  }

  function parseService(moduleInfo, key, service) {
    const properties = [ moduleInfo.pid, moduleInfo.name, key ];
    const pathName = [ 'service', ...properties ].join('.');
    const exports = service(loader.app);

    // set properties of class
    if (is.class(exports)) {
      exports.prototype.pathName = pathName;
    }

    return { pathName, properties, exports };
  }

  function parseModuleInfo(moduleName) {
    const parts = moduleName.split('-');
    if (parts.length < 2) { throw new Error(`${moduleName} is invalid.`); }
    return {
      pid: parts[0],
      name: parts[1],
      fullName: `egg-born-module-${parts[0]}-${parts[1]}`,
      relativeName: `${parts[0]}-${parts[1]}`,
      url: `${parts[0]}/${parts[1]}`,
    };
  }

  function methodToMiddleware(Controller, key) {
    return function* classControllerMiddleware(...args) {
      const controller = new Controller(this);
      if (!this.app.config.controller || !this.app.config.controller.supportParams) {
        args = [ this ];
      }
      return yield callController(controller[key], controller, args);
    };
  }

  function* callController(func, ctx, args) {
    const r = func.call(ctx, ...args);
    if (is.generator(r) || is.promise(r)) {
      return yield r;
    }
    return r;
  }


};
