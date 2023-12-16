const is = require('is-type-of');

module.exports = (app, ctx) => {
  const beanContainer = {
    _register(moduleName, beanName, beanClass) {
      const beanFullName = beanClass.global
        ? beanName
        : `${typeof moduleName === 'string' ? moduleName : moduleName.relativeName}.${beanName}`;
      let bean = beanClass.bean;
      if (beanClass.mode === 'app' && is.function(bean) && !is.class(bean)) {
        bean = bean(app);
      }
      app.meta.beans[beanFullName] = {
        ...beanClass,
        bean,
      };
      return beanFullName;
    },
    _registerAop(moduleName, aopName, aopClass) {
      const beanName = `aop.${aopName}`;
      const beanClass = {
        mode: aopClass.mode,
        bean: aopClass.bean,
        aop: true,
      };
      const beanFullName = this._register(moduleName, beanName, beanClass);
      app.meta.aops[beanFullName] = { match: aopClass.match, matchAop: aopClass.matchAop };
      return beanFullName;
    },
    _getBeanClass(beanFullName) {
      // need not support object mode
      return app.meta.beans[beanFullName];
    },
    _getBean(moduleName, beanName) {
      if (!beanName) {
        beanName = moduleName;
        moduleName = null;
      }
      let beanFullName;
      if (!moduleName) {
        beanFullName = beanName;
      } else {
        beanFullName = `${typeof moduleName === 'string' ? moduleName : moduleName.relativeName}.${beanName}`;
      }
      if (this[beanFullName] === undefined) {
        this[beanFullName] = this._newBean(beanFullName);
      }
      return this[beanFullName];
    },
    _newBean(beanFullName, ...args) {
      // class
      if (is.class(beanFullName)) {
        const beanInstance = new beanFullName(...args);
        if (app) beanInstance.app = app;
        if (ctx) beanInstance.ctx = ctx;
        return beanInstance;
      }
      // string
      const _beanClass = this._getBeanClass(beanFullName);
      if (!_beanClass) {
        // throw new Error(`bean not found: ${beanFullName}`);
        return null;
      }
      // class or fn
      const bean = _beanClass.bean;
      let _classOrFn;
      if (_beanClass.mode === 'app') {
        _classOrFn = bean;
      } else if (_beanClass.mode === 'ctx') {
        if (is.function(bean) && !is.class(bean)) {
          _classOrFn = bean(ctx);
        } else {
          _classOrFn = bean;
        }
      } else {
        _classOrFn = bean;
      }
      // instance
      let beanInstance;
      if (is.function(_classOrFn) && !is.class(_classOrFn)) {
        if (_beanClass.mode === 'app') {
          beanInstance = _classOrFn(ctx, ...args);
        } else if (_beanClass.mode === 'ctx') {
          beanInstance = _classOrFn(...args);
        }
      } else if (is.class(_classOrFn)) {
        // if (_beanClass.mode === 'app' || _beanClass.mode === 'ctx') {
        //   //
        //   throw new Error(`should not set mode: app/ctx for bean class: $${beanFullName}`);
        // }
        if (_beanClass.mode === 'app') {
          beanInstance = new _classOrFn(ctx, ...args);
        } else if (_beanClass.mode === 'ctx') {
          beanInstance = new _classOrFn(...args);
        } else {
          beanInstance = new _classOrFn(...args);
        }
      }
      if (!beanInstance) {
        throw new Error(`bean class not found: ${beanFullName}`);
      }
      if (app) beanInstance.app = app;
      if (ctx) beanInstance.ctx = ctx;
      // log
      Object.defineProperty(beanInstance, '__beanFullName__', {
        enumerable: false,
        get() {
          return beanFullName;
        },
      });
      // no aop
      const _aopChains = this._getAopChains(beanFullName);
      if (_aopChains.length === 0) return beanInstance;
      // aop
      return this._newBeanProxy(beanFullName, beanInstance);
    },
    _newBeanProxy(beanFullName, beanInstance) {
      const self = this;
      return new Proxy(beanInstance, {
        get(target, prop, receiver) {
          const descriptor = __getPropertyDescriptor(target, prop);
          // get prop
          if (!descriptor || descriptor.get) {
            if (typeof prop === 'symbol') {
              return target[prop];
            }
            const methodName = descriptor ? `get__${prop}` : 'get__magic__';
            const _aopChainsProp = self._getAopChainsProp(beanFullName, target, methodName);
            if (_aopChainsProp.length === 0) return target[prop];
            // context
            const context = {
              target,
              receiver,
              prop,
              method: methodName,
              value: undefined,
            };
            // aop
            __composeForProp(_aopChainsProp)(context, (context, next) => {
              if (context.value === undefined) {
                context.value = target[prop];
              }
              next();
            });
            // ok
            return context.value;
          }
          // method
          const methodType = descriptor.value && descriptor.value.constructor && descriptor.value.constructor.name;
          return self._getInstanceMethodProxy(beanFullName, target, prop, methodType);
        },
        set(target, prop, value, receiver) {
          if (typeof prop === 'symbol') {
            target[prop] = value;
            return true;
          }
          const methodName = `set__${prop}`;
          const _aopChainsProp = self._getAopChainsProp(beanFullName, target, methodName);
          if (_aopChainsProp.length === 0) {
            target[prop] = value;
            return true;
          }
          // context
          const context = {
            target,
            receiver,
            prop,
            method: methodName,
            value,
          };
          // aop
          __composeForProp(_aopChainsProp)(context, (context, next) => {
            target[prop] = context.value;
            next();
          });
          // ok
          return true;
        },
      });
    },
    _getInstanceMethodProxy(beanFullName, beanInstance, prop, methodType) {
      const _aopChainsProp = this._getAopChainsProp(beanFullName, beanInstance, prop);
      if (_aopChainsProp.length === 0) return beanInstance[prop];
      // proxy
      const methodProxyKey = `_aopproxy_method_${prop}`;
      if (beanInstance[methodProxyKey]) return beanInstance[methodProxyKey];
      beanInstance[methodProxyKey] = new Proxy(beanInstance[prop], {
        apply(target, thisArg, args) {
          // context
          const context = {
            target: beanInstance,
            receiver: thisArg,
            prop,
            arguments: args,
            result: undefined,
          };
          // aop
          if (methodType === 'Function') {
            __composeForProp(_aopChainsProp)(context, (context, next) => {
              if (context.result === undefined) {
                context.result = target.apply(thisArg, args);
              }
              next();
            });
            // ok
            return context.result;
          }
          if (methodType === 'AsyncFunction') {
            return new Promise((resolve, reject) => {
              __composeForPropAsync(_aopChainsProp)(context, async (context, next) => {
                if (context.result === undefined) {
                  context.result = await target.apply(thisArg, args);
                }
                await next();
              })
                .then(() => {
                  resolve(context.result);
                })
                .catch(err => {
                  reject(err);
                });
            });
          }
        },
      });
      return beanInstance[methodProxyKey];
    },
    _getAopChains(beanFullName) {
      const _beanClass = this._getBeanClass(beanFullName);
      if (_beanClass._aopChains) return _beanClass._aopChains;
      const chains = [];
      for (const key in app.meta.aops) {
        const aop = app.meta.aops[key];
        // not self
        if (key === beanFullName) continue;
        // check if match aop
        if (_beanClass.aop && !aop.matchAop) continue;
        // match
        if (__aopMatch(aop.match, beanFullName)) {
          chains.push(key);
        }
      }
      _beanClass._aopChains = chains;
      return chains;
    },
    _getAopChainsProp(beanFullName, beanInstance, methodName) {
      const chainsKey = `_aopChains_${methodName}`;
      const _beanClass = this._getBeanClass(beanFullName);
      if (_beanClass[chainsKey]) return _beanClass[chainsKey];
      const _aopChains = this._getAopChains(beanFullName);
      const chains = [];
      for (const key of _aopChains) {
        const aop = this._getBean(key);
        if (aop[methodName]) {
          chains.push(key);
        }
      }
      _beanClass[chainsKey] = chains;
      return chains;
    },
  };

  const __composeForPropAdapter = (context, chain) => {
    const aop = beanContainer._getBean(chain);
    if (!aop) throw new Error(`aop not found: ${chain}`);
    const methodName = context.method || context.prop;
    if (!aop[methodName]) return null;
    return {
      receiver: aop,
      fn: aop[methodName],
    };
  };

  function __composeForProp(chains) {
    return app.meta.util.compose(chains, __composeForPropAdapter);
  }

  function __composeForPropAsync(chains) {
    return app.meta.util.composeAsync(chains, __composeForPropAdapter);
  }

  return new Proxy(beanContainer, {
    get(obj, prop) {
      if (obj[prop]) return obj[prop];
      return beanContainer._getBean(prop);
    },
  });
};

function __getPropertyDescriptor(obj, prop) {
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
    if (descriptor) return descriptor;
    proto = Object.getPrototypeOf(proto);
  }
  return null;
}

function __aopMatch(match, beanFullName) {
  if (!Array.isArray(match)) {
    return (typeof match === 'string' && match === beanFullName) || (is.regExp(match) && match.test(beanFullName));
  }
  return match.some(item => __aopMatch(item, beanFullName));
}
