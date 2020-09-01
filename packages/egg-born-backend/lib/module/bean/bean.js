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
    _get(beanFullName) {
      return app.meta.beans[beanFullName];
    },
    _newInstance(beanFullName, ...args) {
      const _bean = this._get(beanFullName);
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
          chains.push(beanFullName);
        }
      }
      return chains;
    },
  };

  return new Proxy(beanBase, {
    get(obj, prop) {
      if (obj[prop]) return obj[prop];
      obj[prop] = beanBase._newInstance(prop);
      return obj[prop];
    },
  });

  function __aopMatch(match, beanFullName) {
    if (!Array.isArray(match)) return (typeof match === 'string' && match === beanFullName) || (is.regExp(match) && match.test(beanFullName));
    return match.some(item => __aopMatch(item, beanFullName));
  }
};
