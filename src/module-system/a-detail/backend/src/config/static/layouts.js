const layoutDetailItemBase = require('./layout/layoutDetailItemBase.js');
const layoutDetailListBase = require('./layout/layoutDetailListBase.js');

module.exports = app => {
  const layouts = [
    //
    layoutDetailItemBase(app),
    layoutDetailListBase(app),
  ];
  return layouts;
};
