const atomBase_0 = require('./bean.atomBase/bean.atomBase_0.js');
const atomBase_1 = require('./bean.atomBase/bean.atomBase_1.js');
const atomBase_create = require('./bean.atomBase/bean.atomBase_create.js');
const atomBase_select = require('./bean.atomBase/bean.atomBase_select.js');
const atomBase_read = require('./bean.atomBase/bean.atomBase_read.js');
const atomBase_write = require('./bean.atomBase/bean.atomBase_write.js');
const atomBase_delete = require('./bean.atomBase/bean.atomBase_delete.js');
const atomBase_exportBulk = require('./bean.atomBase/bean.atomBase_exportBulk.js');

module.exports = app => {
  return app.meta.util.mixinClasses(
    atomBase_0,
    [
      //
      atomBase_1,
      atomBase_create,
      atomBase_select,
      atomBase_read,
      atomBase_write,
      atomBase_delete,
      atomBase_exportBulk,
    ],
    app
  );
};
