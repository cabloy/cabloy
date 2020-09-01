const is = require('is-type-of');

module.exports = (app, ctx) => {

  const beanBase = {
    _register(moduleName, beanName, bean) {
      const beanFullName = bean.global ? beanName : `${moduleName}.${beanName}`;
      app.meta.beans[beanFullName] = bean;
    },
    _get(beanFullName) {
      return app.meta.beans[beanFullName];
    },
    _newInstance(beanFullName, ...args) {
      const _bean = this._get(beanFullName);
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
      return beanInstance;
    },
  };

  return new Proxy(beanBase, {
    get(obj, prop) {
      if (prop[0] === '_') return beanBase[prop];
      if (obj[prop]) return obj[prop];
      obj[prop] = beanBase._newInstance(prop);
      return obj[prop];
    },
  });
};
