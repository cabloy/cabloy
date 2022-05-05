const layoutAtomItemBase = require('./layout/layoutAtomItemBase.js');
const layoutAtomListBase = require('./layout/layoutAtomListBase.js');

module.exports = app => {
  const layouts = [layoutAtomItemBase(app), layoutAtomListBase(app)];
  return layouts;
};
