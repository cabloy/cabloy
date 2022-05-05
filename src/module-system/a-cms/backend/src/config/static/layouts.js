const layoutAtomItemCms = require('./layout/layoutAtomItemCms.js');
const layoutAtomListCms = require('./layout/layoutAtomListCms.js');

module.exports = app => {
  const layouts = [layoutAtomItemCms(app), layoutAtomListCms(app)];
  return layouts;
};
