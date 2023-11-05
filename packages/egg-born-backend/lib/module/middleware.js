module.exports = function (loader) {
  // use modulesArray
  const ebModulesArray = loader.app.meta.modulesArray;

  // all middlewares
  const ebMiddlewaresAll = (loader.app.meta.middlewares = []);
  const ebMiddlewaresNormal = (loader.app.meta.middlewaresNormal = {});
  const ebMiddlewaresGlobal = (loader.app.meta.middlewaresGlobal = []);
  const ebMiddlewaresSocketIoConnection = (loader.app.meta.middlewaresSocketIoConnection = []);
  const ebMiddlewaresSocketIoPacket = (loader.app.meta.middlewaresSocketIoPacket = []);

  // load middlewares all
  loadMiddlewaresAll(ebMiddlewaresAll, ebModulesArray, loader);

  // handle dependents
  handleDependents(ebMiddlewaresAll);

  // load middlewares
  loadMiddlewares(
    ebMiddlewaresAll,
    ebMiddlewaresNormal,
    ebMiddlewaresGlobal,
    ebMiddlewaresSocketIoConnection,
    ebMiddlewaresSocketIoPacket
  );

  return [ebMiddlewaresNormal, ebMiddlewaresGlobal];
};

function loadMiddlewares(
  ebMiddlewaresAll,
  ebMiddlewaresNormal,
  ebMiddlewaresGlobal,
  ebMiddlewaresSocketIoConnection,
  ebMiddlewaresSocketIoPacket
) {
  // load
  for (const item of ebMiddlewaresAll) {
    // ignore other types, such as: socketio.connection/socketio.packet
    const type = item.options.type;
    if (!type) {
      // normal
      ebMiddlewaresNormal[item.name] = item;
      if (item.options.global) {
        ebMiddlewaresGlobal.push(item);
      }
    } else if (type === 'socketio.connection') {
      ebMiddlewaresSocketIoConnection.push(item);
    } else if (type === 'socketio.packet') {
      ebMiddlewaresSocketIoPacket.push(item);
    }
  }

  // global order
  swap(ebMiddlewaresGlobal);
  swap(ebMiddlewaresSocketIoConnection);
  swap(ebMiddlewaresSocketIoPacket);
}

function loadMiddlewaresAll(ebMiddlewaresAll, ebModulesArray, loader) {
  for (const module of ebModulesArray) {
    const config = loader.app.meta.configs[module.info.relativeName];
    if (!config.middlewares) continue;
    for (const middlewareKey in config.middlewares) {
      const middlewareConfig = config.middlewares[middlewareKey];
      // bean
      const beanName = middlewareConfig.bean;
      if (!beanName) throw new Error(`bean not set for middleware: ${module.info.relativeName}.${middlewareKey}`);
      let bean;
      if (typeof beanName === 'string') {
        bean = {
          module: module.info.relativeName,
          name: beanName,
        };
      } else {
        bean = {
          module: beanName.module || module.info.relativeName,
          name: beanName.name,
        };
      }
      // push
      ebMiddlewaresAll.push({
        module: module.info.relativeName,
        name: middlewareKey,
        options: middlewareConfig,
        bean,
      });
    }
  }
}

function handleDependents(ebMiddlewaresAll) {
  for (const middleware of ebMiddlewaresAll) {
    let dependents = middleware.options.dependents;
    if (!dependents) continue;
    if (!Array.isArray(dependents)) {
      dependents = dependents.split(',');
    }
    for (const dep of dependents) {
      const middleware2 = ebMiddlewaresAll.find(item => item.name === dep);
      if (!middleware2) {
        throw new Error(`middleware ${dep} not found for dependents of ${middleware.name}`);
      }
      const options = middleware2.options;
      if (!options.dependencies) options.dependencies = [];
      if (!Array.isArray(options.dependencies)) {
        options.dependencies = options.dependencies.split(',');
      }
      if (options.dependencies.findIndex(item => item === middleware.name) === -1) {
        options.dependencies.push(middleware.name);
      }
    }
  }
}

function swap(middlewares) {
  // eslint-disable-next-line
  while (true) {
    if (!_swap(middlewares)) break;
  }
}

function _swap(middlewares) {
  let result = false;
  const middlewaresClone = middlewares.slice(0);
  middlewaresClone.forEach(item => {
    let deps = item.options.dependencies || [];
    if (typeof deps === 'string') deps = deps.split(',');
    deps.forEach(dep => {
      if (swapDep(middlewares, dep, item.name)) result = true;
    });
  });
  return result;
}

function swapDep(arr, a, b) {
  const indexA = arr.findIndex(item => item.name === a);
  const indexB = arr.findIndex(item => item.name === b);
  if (indexA === -1 || indexB === -1 || indexA < indexB) return false;
  arr.splice(indexB, 0, arr.splice(indexA, 1)[0]);
  return true;
}
