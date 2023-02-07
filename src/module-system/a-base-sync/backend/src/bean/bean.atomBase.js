const atomBase_0 = require('./bean.atomBase/bean.atomBase_0.js');
const atomBase_1 = require('./bean.atomBase/bean.atomBase_1.js');
const atomBase_write = require('./bean.atomBase/bean.atomBase_write.js');

module.exports = app => {
  return app.meta.util.mixinClasses(
    atomBase_0,
    [
      //
      atomBase_1,
      atomBase_write,
    ],
    app
  );
};
