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
// roleFieldsRight: listLayoutList
import roleFieldsRightListLayoutBlockListItems from './components/roleFieldsRight/listLayoutList/listLayoutBlockListItems.jsx';
import roleFieldsRightListLayoutBlockListItem from './components/roleFieldsRight/listLayoutList/listLayoutBlockListItem.jsx';
import renderRoleFieldsRight from './components/roleFieldsRight/render/renderRoleFieldsRight.jsx';
//
import actionRole from './components/actionRole.js';
import actionRoleResource from './components/actionRoleResource.js';
import actionUser from './components/actionUser.js';
import roleIncludes from './components/role/includes.jsx';
import roleUsers from './components/role/roleUsers.jsx';
import userRoles from './components/user/userRoles.jsx';
import userSelect from './components/user/select.vue';
// roleResourceRight: listLayoutList
import roleResourceRightListLayoutBlockListItems from './components/roleResourceRight/listLayoutList/listLayoutBlockListItems.jsx';
import roleResourceRightListLayoutBlockListItem from './components/roleResourceRight/listLayoutList/listLayoutBlockListItem.jsx';
// combineSearch
import combineSearch from './components/action/combineSearch.js';
// render
import renderResourceType from './components/render/renderResourceType.jsx';

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
  // roleFieldsRight: roleListLayout
  roleFieldsRightListLayoutBlockListItems,
  roleFieldsRightListLayoutBlockListItem,
  renderRoleFieldsRight,
  //
  actionRole,
  actionRoleResource,
  actionUser,
  roleIncludes,
  roleUsers,
  userRoles,
  userSelect,
  //
  roleResourceRightListLayoutBlockListItems,
  roleResourceRightListLayoutBlockListItem,
  //
  combineSearch,
  //
  renderResourceType,
};

// bak
// import atomRightRights from './components/atomRight/rights.vue';
// import atomRightSpreads from './components/atomRight/spreads.vue';
// import resourceRightRights from './components/resourceRight/rights.vue';
// import resourceRightSpreads from './components/resourceRight/spreads.vue';
