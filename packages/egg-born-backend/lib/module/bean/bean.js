const is = require('is-type-of');

module.exports = (app, ctx) => {

  const beanBase = {
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
    _getBean(beanFullName) {
      return app.meta.beans[beanFullName];
    },
    _getInstance(beanFullName) {
      if (!this[beanFullName]) {
        this[beanFullName] = this._newInstance(beanFullName);
      }
      return this[beanFullName];
    },
    _newInstance(beanFullName, ...args) {
      const self = this;
      const _bean = this._getBean(beanFullName);
      // aop chains
      if (!_bean.aopChains) {
        _bean.aopChains = this._createAopChains(beanFullName);
      }
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
      if (_bean.aopChains.length === 0) return beanInstance;
      // aop
      const beanInstanceProxy = new Proxy(beanInstance, {
        get(target, prop) {
          const value = target[prop];
          // check if function asyncFunction
          if (is.function(value) && !is.generatorFunction(value) && !is.class(value)) {
            //

          } else {
            // normal property
            const context = {
              target,
              prop,
              value,
            };
            // aop
            __composeForPropGet(self, _bean.aopChains)(context);
            // ok
            return context.value;
          }
        },
        set() {

        },
      });
      // ok
      return beanInstanceProxy;
    },
    _createAopChains(beanFullName) {
      const chains = [];
      for (const key in app.meta.aops) {
        const aop = app.meta.aops[key];
        const match = aop.match;
        if (__aopMatch(match, beanFullName)) {
          chains.push(key);
        }
      }
      return chains;
    },
  };

  return new Proxy(beanBase, {
    get(obj, prop) {
      if (obj[prop]) return obj[prop];
      return beanBase._getInstance(prop);
    },
  });

};

function __aopMatch(match, beanFullName) {
  if (!Array.isArray(match)) return (typeof match === 'string' && match === beanFullName) || (is.regExp(match) && match.test(beanFullName));
  return match.some(item => __aopMatch(item, beanFullName));
}

function __composeForPropGet(bean, chains) {
  return function(context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index) return new Error('next() called multiple times');
      index = i;
      let fn;
      const chain = chains[i];
      if (chain) {
        const aop = bean._getInstance(chain);
        const methodName = `get__${context.prop}`;
        if (!aop[methodName]) return dispatch(i + 1);
        fn = aop[methodName];
      }
      if (i === chains.length) fn = next;
      if (!fn) return;
      return fn(context, function next() {
        return dispatch(i + 1);
      });
    }
  };
}

