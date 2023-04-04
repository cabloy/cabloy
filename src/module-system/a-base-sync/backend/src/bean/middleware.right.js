const right_0 = require('./middleware.right/middleware.right_0.js');
const right_atom = require('./middleware.right/middleware.right_atom.js');
const right_resource = require('./middleware.right/middleware.right_resource.js');
const right_detail = require('./middleware.right/middleware.right_detail.js');

// request.body
//   key: atomId itemId
//   atomClass: id,module,atomClassName
//   item:
// options
//   type: atom/resource/detail
//   action(atom):
//   name(function):
//   module:
module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(right_0, [right_atom, right_resource, right_detail], ctx);
};
