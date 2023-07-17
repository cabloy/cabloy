const layoutAtomItemBase = require('./layout/layoutAtomItemBase.js');
const layoutAtomListBase = require('./layout/layoutAtomListBase.js');
const layoutItemOnlyListBase = require('./layout/layoutItemOnlyListBase.js');
const layoutDetailListBase = require('./layout/layoutDetailListBase.js');

module.exports = app => {
  const layouts = [
    //
    layoutAtomItemBase(app),
    layoutAtomListBase(app),
    layoutItemOnlyListBase(app),
    layoutDetailListBase(app),
  ];
  return layouts;
};
