const layoutAtomItemRole = require('./layout/layoutAtomItemRole.js');
const layoutAtomListRole = require('./layout/layoutAtomListRole.js');
const layoutAtomListRoleRight = require('./layout/layoutAtomListRoleRight.js');
const layoutAtomItemUser = require('./layout/layoutAtomItemUser.js');
const layoutAtomListUser = require('./layout/layoutAtomListUser.js');
const layoutAtomListResource = require('./layout/layoutAtomListResource.js');
const layoutAtomListRoleResourceRight = require('./layout/layoutAtomListRoleResourceRight.js');
const layoutAtomListRoleFieldsRight = require('./layout/layoutAtomListRoleFieldsRight.js');

const layouts = [
  layoutAtomItemRole, //
  layoutAtomListRole,
  layoutAtomListRoleRight,
  layoutAtomItemUser,
  layoutAtomListUser,
  layoutAtomListResource,
  layoutAtomListRoleResourceRight,
  layoutAtomListRoleFieldsRight,
];
module.exports = layouts;
