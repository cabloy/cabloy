// role: listLayoutTree
import roleListLayoutTreeDataSourceAdapter from './components/role/listLayoutTree/listLayoutTreeDataSourceAdapter.js';
// role: itemLayoutDefault
import roleItemLayoutBlockDefaultTitle from './components/role/itemLayoutDefault/itemLayoutBlockDefaultTitle.jsx';
import roleItemLayoutBlockDefaultSubnavbar from './components/role/itemLayoutDefault/itemLayoutBlockDefaultSubnavbar.jsx';
// user: itemLayoutDefault
import userItemLayoutBlockDefaultTitle from './components/user/itemLayoutDefault/itemLayoutBlockDefaultTitle.jsx';
import userItemLayoutBlockDefaultSubnavbar from './components/user/itemLayoutDefault/itemLayoutBlockDefaultSubnavbar.jsx';
// user: listLayoutExtend
import userListLayoutExtend from './components/user/listLayoutExtend.jsx';
// roleRight: listLayoutList
import roleRightListLayoutBlockListItems from './components/roleRight/listLayoutList/listLayoutBlockListItems.jsx';
import roleRightListLayoutBlockListItem from './components/roleRight/listLayoutList/listLayoutBlockListItem.jsx';
import renderRoleRightAction from './components/roleRight/render/renderRoleRightAction.jsx';
import renderRoleRightScope from './components/roleRight/render/renderRoleRightScope.jsx';
//
import actionRole from './components/actionRole.js';
import actionUser from './components/actionUser.js';
import roleIncludes from './components/role/includes.jsx';
import roleUsers from './components/role/roleUsers.jsx';
import userRoles from './components/user/userRoles.jsx';
import userSelect from './components/user/select.vue';
import resourceRightRights from './components/resourceRight/rights.vue';
import resourceRightSpreads from './components/resourceRight/spreads.vue';

export default {
  // role: roleListLayoutTree
  roleListLayoutTreeDataSourceAdapter,
  // role: itemLayoutDefault
  roleItemLayoutBlockDefaultTitle,
  roleItemLayoutBlockDefaultSubnavbar,
  // user: itemLayoutDefault
  userItemLayoutBlockDefaultTitle,
  userItemLayoutBlockDefaultSubnavbar,
  // user: listLayoutExtend
  userListLayoutExtend,
  // roleRight: roleListLayout
  roleRightListLayoutBlockListItems,
  roleRightListLayoutBlockListItem,
  renderRoleRightAction,
  renderRoleRightScope,
  //
  actionRole,
  actionUser,
  roleIncludes,
  roleUsers,
  userRoles,
  userSelect,
  resourceRightRights,
  resourceRightSpreads,
};

// bak
// import atomRightRights from './components/atomRight/rights.vue';
// import atomRightSpreads from './components/atomRight/spreads.vue';
