const extend = require('extend2');

module.exports = function(loader) {

  // use modulesArray
  const ebModulesArray = loader.app.meta.modulesArray;

  loader.app.meta.lookupMiddlewares = function(cb) {
    for (const module of ebModulesArray) {
      // module middlewares
      if (module.main.middlewares) {
        for (const middlewareKey in module.main.middlewares) {
          const middleware = module.main.middlewares[middlewareKey];
          const config = loader.app.meta.configs[module.info.relativeName];
          const middlewareConfig = config.middlewares ? config.middlewares[middlewareKey] : null;
          const options = extend(true, {}, middlewareConfig, loader.app.config.mws[middlewareKey]);
          cb({ options, middleware, key: middlewareKey });
        }
      }
    }
  };

  // all middlewares
  const ebMiddlewares = {};

  // load middlewares
  const ebMiddlewaresGlobal = loadMiddlewares(ebMiddlewares, loader);

  return [ ebMiddlewares, ebMiddlewaresGlobal ];
};


function loadMiddlewares(ebMiddlewares, loader) {
  const globals = [];

  // load
  loader.app.meta.lookupMiddlewares(function({ options, middleware, key }) {
    // ignore other types, such as: socketio.connection/socketio.packet
    if (!options.type) {
      ebMiddlewares[key] = { options, middleware, key };
      if (options.global) globals.push(key);
    }
  });

  // global order
  // eslint-disable-next-line
  while (true) {
    if (!swap(ebMiddlewares, globals)) break;
  }

  return globals;
}

function swap(ebMiddlewares, globals) {
  let result = false;
  const globalsClone = globals.slice(0);
  globalsClone.forEach(key => {
    const item = ebMiddlewares[key];
    let deps = item.options.dependencies || [];
    if (typeof deps === 'string') deps = deps.split(',');
    deps.forEach(dep => {
      if (swapDep(globals, dep, key)) result = true;
    });
  });
  return result;
}

function swapDep(arr, a, b) {
  const indexA = arr.indexOf(a);
  const indexB = arr.indexOf(b);
  if (indexA === -1 || indexB === -1 || indexA < indexB) return false;
  arr.splice(indexB, 0, arr.splice(indexA, 1)[0]);
  return true;
}
