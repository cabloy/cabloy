const layoutAtomItemBase = require('./layout/layoutAtomItemBase.js');
const layoutAtomListBase = require('./layout/layoutAtomListBase.js');
const layoutItemOnlyListBase = require('./layout/layoutItemOnlyListBase.js');

module.exports = app => {
  const layouts = [
    //
    layoutAtomItemBase(app),
    layoutAtomListBase(app),
    layoutItemOnlyListBase(app),
  ];
  return layouts;
};
