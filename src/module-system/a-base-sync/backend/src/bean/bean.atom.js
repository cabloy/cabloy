const atom_0 = require('./bean.atom/bean.atom_0.js');
const atom_1 = require('./bean.atom/bean.atom_1.js');
const atom_right = require('./bean.atom/bean.atom_right.js');
const atom_starLabel = require('./bean.atom/bean.atom_starLabel.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(atom_0, [atom_1, atom_right, atom_starLabel], ctx);
};
