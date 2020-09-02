const is = require('is-type-of');

module.exports = (app, ctx) => {

  const beanContainer = {
    _register(moduleName, beanName, bean) {
      const beanFullName = bean.global ? beanName : `${moduleName}.${beanName}`;
      app.meta.beans[beanFullName] = bean;
      return beanFullName;
    },
    _registerAop(moduleName, aopName, aop) {
      const beanName = `aop.${aopName}`;
      const bean = {
        mode: aop.mode,
        bean: aop.bean,
      };
      const beanFullName = this._register(moduleName, beanName, bean);
      app.meta.aops[beanFullName] = { match: aop.match };
      return beanFullName;
    },
    _getBeanClass(beanFullName) {
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
        beanFullName = typeof moduleName === 'string' ? `${moduleName}.${beanName}` : `${moduleName.relativeName}.${beanName}`;
      }
      if (!this[beanFullName]) {
        this[beanFullName] = this._newBean(beanFullName);
      }
      return this[beanFullName];
    },
    _newBean(beanFullName, ...args) {
      const _bean = this._getBeanClass(beanFullName);
      // instance
      const bean = _bean.bean;
      let beanInstance;
      if (is.function(bean) && !is.class(bean)) {
        if (_bean.mode === 'app') {
          beanInstance = new (bean(app))(ctx, ...args);
        } else if (_bean.mode === 'ctx') {
          beanInstance = new (bean(ctx))(...args);
        }
      } else if (is.class(bean)) {
        if (_bean.mode === 'app') {
          beanInstance = new bean(ctx, ...args);
        } else if (_bean.mode === 'ctx') {
          beanInstance = new bean(...args);
        }
      }
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
          const descriptor = Object.getOwnPropertyDescriptor(target.__proto__, prop);
          // get prop
          if (descriptor.get) {
            const prefix = 'get__';
            const _aopChainsProp = self._getAopChainsProp(beanFullName, target, prop, prefix);
            if (_aopChainsProp.length === 0) return target[prop];
            // context
            const context = {
              target,
              receiver,
              prop,
              value: undefined,
            };
            // aop
            __composeForProp(self, _aopChainsProp, prefix)(context, (context, next) => {
              context.value = target[prop];
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
          const prefix = 'set__';
          const _aopChainsProp = self._getAopChainsProp(beanFullName, target, prop, prefix);
          if (_aopChainsProp.length === 0) {
            target[prop] = value;
            return true;
          }
          // context
          const context = {
            target,
            receiver,
            prop,
            value,
          };
          // aop
          __composeForProp(self, _aopChainsProp, prefix)(context, (context, next) => {
            target[prop] = context.value;
            next();
          });
          // ok
          return true;
        },
      });
    },
    _getInstanceMethodProxy(beanFullName, beanInstance, prop, methodType) {
      const self = this;
      const _aopChainsProp = self._getAopChainsProp(beanFullName, beanInstance, prop);
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
            __composeForProp(self, _aopChainsProp)(context, (context, next) => {
              context.result = target.apply(thisArg, args);
              next();
            });
            // ok
            return context.result;
          }
          if (methodType === 'AsyncFunction') {
            return new Promise((resolve, reject) => {
              __composeForPropAsync(self, _aopChainsProp)(context, async (context, next) => {
                context.result = await target.apply(thisArg, args);
                await next();
              }).then(() => {
                resolve(context.result);
              }).catch(err => {
                reject(err);
              });
            });
          }
        },
      });
      return beanInstance[methodProxyKey];
    },
    _getAopChains(beanFullName) {
      const _bean = this._getBeanClass(beanFullName);
      if (_bean._aopChains) return _bean._aopChains;
      const chains = [];
      for (const key in app.meta.aops) {
        const aop = app.meta.aops[key];
        const match = aop.match;
        if (__aopMatch(match, beanFullName)) {
          chains.push(key);
        }
      }
      _bean._aopChains = chains;
      return chains;
    },
    _getAopChainsProp(beanFullName, beanInstance, prop, prefix = '') {
      const methodName = `${prefix}${prop}`;
      const chainsKey = `_aopChains_${methodName}`;
      const _bean = this._getBeanClass(beanFullName);
      if (_bean[chainsKey]) return _bean[chainsKey];
      const _aopChains = this._getAopChains(beanFullName);
      const chains = [];
      for (const key of _aopChains) {
        const aop = this._getBean(key);
        if (aop[methodName]) {
          chains.push(key);
        }
      }
      _bean[chainsKey] = chains;
      return chains;
    },
  };

  return new Proxy(beanContainer, {
    get(obj, prop) {
      if (obj[prop]) return obj[prop];
      return beanContainer._getBean(prop);
    },
  });

};

function __aopMatch(match, beanFullName) {
  if (!Array.isArray(match)) return (typeof match === 'string' && match === beanFullName) || (is.regExp(match) && match.test(beanFullName));
  return match.some(item => __aopMatch(item, beanFullName));
}

function __composeForProp(bean, chains, prefix = '') {
  return function(context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) return new Error('next() called multiple times');
      index = i;
      let fn;
      let aop;
      const chain = chains[i];
      if (chain) {
        aop = bean._getBean(chain);
        const methodName = `${prefix}${context.prop}`;
        if (!aop[methodName]) return dispatch(i + 1);
        fn = aop[methodName];
      }
      if (i === chains.length) fn = next;
      if (!fn) return;
      return fn.call(aop, context, function next() {
        return dispatch(i + 1);
      });
    }
  };
}

function __composeForPropAsync(bean, chains) {
  return function(context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'));
      index = i;
      let fn;
      let aop;
      const chain = chains[i];
      if (chain) {
        aop = bean._getBean(chain);
        const methodName = context.prop;
        if (!aop[methodName]) return dispatch(i + 1);
        fn = aop[methodName];
      }
      if (i === chains.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn.call(aop, context, function next() {
          return dispatch(i + 1);
        }));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}

