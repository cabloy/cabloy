const atomBase_0 = require('./bean.atomBase/bean.atomBase_0.js');
const atomBase_1 = require('./bean.atomBase/bean.atomBase_1.js');

module.exports = app => {
  return app.meta.util.mixinClasses(atomBase_0, atomBase_1, app);
};
