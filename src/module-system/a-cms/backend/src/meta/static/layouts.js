const layoutAtomItemCms = require('./layout/layoutAtomItemCms.js');
const layoutAtomListCms = require('./layout/layoutAtomListCms.js');
const layoutAppMenuCmsBase = require('./layout/layoutAppMenuCmsBase.js');

module.exports = app => {
  const layouts = [
    //
    layoutAtomItemCms(app),
    layoutAtomListCms(app),
    layoutAppMenuCmsBase(app),
  ];
  return layouts;
};
