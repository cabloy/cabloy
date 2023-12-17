const is = require('is-type-of');
const ProxyMagic = require('./proxyMagic.js');

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
      if (is.class(beanFullName)) return beanFullName;
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
        return this._patchBeanInstance(beanInstance, args, beanFullName, beanFullName, false);
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
      // patch
      return this._patchBeanInstance(beanInstance, args, beanFullName, _beanClass, _beanClass.aop);
    },
    _patchBeanInstance(beanInstance, args, beanFullName, _beanClass, isAop) {
      if (app) {
        __setPropertyValue(beanInstance, 'app', app);
      }
      if (ctx) {
        __setPropertyValue(beanInstance, 'ctx', ctx);
      }
      if (beanInstance.__init__) {
        beanInstance.__init__(...args);
      }
      // __beanFullName__
      if (!is.class(beanFullName)) {
        __setPropertyValue(beanInstance, '__beanFullName__', beanFullName);
      }
      // not aop on aop
      if (isAop) return beanInstance;
      // aop chains
      const _aopChains = this._prepareAopChains(beanFullName, beanInstance);
      // no aop
      if (_aopChains.length === 0) return beanInstance;
      // aop
      return this._newBeanProxy(beanFullName, beanInstance, _beanClass);
    },
    _newBeanProxy(beanFullName, beanInstance, _beanClass) {
      const self = this;
      return new Proxy(beanInstance, {
        get(target, prop, receiver) {
          if (typeof prop === 'symbol') {
            return target[prop];
          }
          const descriptorInfo = __getPropertyDescriptor(target, prop, _beanClass);
          if (descriptorInfo && descriptorInfo.dynamic) return target[prop];
          const methodType = __methodTypeOfDescriptor(descriptorInfo);
          // get prop
          if (!methodType) {
            const methodName = `__get_${prop}__`;
            const methodNameMagic = '__get__';
            const _aopChainsProp = self._getAopChainsProp(beanFullName, methodName, methodNameMagic);
            if (_aopChainsProp.length === 0) return target[prop];
            // context
            const context = {
              target,
              receiver,
              prop,
              value: undefined,
            };
            // aop
            __composeForProp(_aopChainsProp)(context, (context, next) => {
              if (context.value === undefined) {
                if (!descriptorInfo && target.__get__) {
                  context.value = target.__get__(prop);
                } else {
                  context.value = target[prop];
                }
              }
              next();
            });
            // ok
            return context.value;
          }
          // method
          return self._getInstanceMethodProxy(beanFullName, target, prop, methodType);
        },
        set(target, prop, value, receiver) {
          if (typeof prop === 'symbol') {
            target[prop] = value;
            return true;
          }
          const descriptorInfo = __getPropertyDescriptor(target, prop, _beanClass);
          if (descriptorInfo && descriptorInfo.dynamic) {
            target[prop] = value;
            return true;
          }
          const methodName = `__set_${prop}__`;
          const methodNameMagic = '__set__';
          const _aopChainsProp = self._getAopChainsProp(beanFullName, methodName, methodNameMagic);
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
          __composeForProp(_aopChainsProp)(context, (context, next) => {
            if (!descriptorInfo && target.__set__) {
              target.__set__(prop, context.value);
            } else {
              target[prop] = context.value;
            }
            next();
          });
          // ok
          return true;
        },
      });
    },
    _getInstanceMethodProxy(beanFullName, beanInstance, prop, methodType) {
      // not aop magic methods
      if (['__get__', '__set__'].includes(prop)) {
        return beanInstance[prop];
      }
      // aop chains
      const _aopChainsProp = this._getAopChainsProp(beanFullName, prop);
      if (_aopChainsProp.length === 0) return beanInstance[prop];
      // proxy
      const methodProxyKey = `__aopproxy_method_${prop}__`;
      if (beanInstance[methodProxyKey]) return beanInstance[methodProxyKey];
      const methodProxy = new Proxy(beanInstance[prop], {
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
      __setPropertyValue(beanInstance, methodProxyKey, methodProxy);
      return methodProxy;
    },
    _prepareAopChains(beanFullName, beanInstance) {
      // beanFullName maybe class
      const _beanClass = this._getBeanClass(beanFullName);
      if (_beanClass.__aopChains__) return _beanClass.__aopChains__;
      // chains
      const chains = [];
      if (!is.class(beanFullName)) {
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
      }
      // magic self
      if (__hasMagicMothod(beanInstance)) {
        chains.push(ProxyMagic);
      }
      // hold
      __setPropertyValue(_beanClass, '__aopChains__', chains);
      return chains;
    },
    _getAopChains(beanFullName) {
      // beanFullName maybe class
      const _beanClass = this._getBeanClass(beanFullName);
      return _beanClass.__aopChains__;
    },
    _getAopChainsProp(beanFullName, methodName, methodNameMagic) {
      const chainsKey = `__aopChains_${methodName}__`;
      const _beanClass = this._getBeanClass(beanFullName);
      if (_beanClass[chainsKey]) return _beanClass[chainsKey];
      const _aopChains = this._getAopChains(beanFullName);
      const chains = [];
      for (const key of _aopChains) {
        if (key === ProxyMagic) {
          chains.push(ProxyMagic);
        } else {
          const aop = this._getBean(key);
          if (aop[methodName]) {
            chains.push([key, methodName]);
          } else if (methodNameMagic && aop[methodNameMagic]) {
            chains.push([key, methodNameMagic]);
          }
        }
      }
      __setPropertyValue(_beanClass, chainsKey, chains);
      return chains;
    },
  };

  const __composeForPropAdapter = (context, chain) => {
    // ProxyMagic
    if (chain === ProxyMagic) return null;
    // chain
    const [key, methodName] = chain;
    const aop = beanContainer._getBean(key);
    if (!aop) throw new Error(`aop not found: ${chain}`);
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

function __getPropertyDescriptor(obj, prop, _beanClass) {
  // dynamic
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (descriptor) return { descriptor, dynamic: true };
  // static
  const propKey = `__aopPropertyDescriptor_${prop}__`;
  if (_beanClass[propKey] === undefined) {
    _beanClass[propKey] = __getPropertyDescriptorStatic(obj, prop);
  }
  return _beanClass[propKey];
}

function __getPropertyDescriptorStatic(obj, prop) {
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
    if (descriptor) return { descriptor, dynamic: false };
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

function __setPropertyValue(obj, prop, value) {
  Object.defineProperty(obj, prop, {
    enumerable: false,
    configurable: true,
    get() {
      return value;
    },
  });
}

function __hasMagicMothod(instance) {
  return !!instance.__get__ || !!instance.__set__;
}

function __methodTypeOfDescriptor(descriptorInfo) {
  if (!descriptorInfo) return null;
  const { descriptor, dynamic } = descriptorInfo;
  if (dynamic) return null;
  if (descriptor.get) return null;
  const methodType = descriptor.value?.constructor?.name;
  if (['Function', 'AsyncFunction'].includes(methodType)) {
    return methodType;
  }
  return null;
}
