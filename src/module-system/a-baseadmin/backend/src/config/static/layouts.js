const layoutAtomItemRole = require('./layout/layoutAtomItemRole.js');
const layoutAtomListRole = require('./layout/layoutAtomListRole.js');
const layoutAtomItemUser = require('./layout/layoutAtomItemUser.js');
const layoutAtomListUser = require('./layout/layoutAtomListUser.js');

module.exports = app => {
  const layouts = [
    layoutAtomItemRole(app), //
    layoutAtomListRole(app),
    layoutAtomItemUser(app),
    layoutAtomListUser(app),
  ];
  return layouts;
};
